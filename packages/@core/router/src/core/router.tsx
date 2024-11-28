import type { NavigateFunction, RouteObject } from 'react-router-dom';

import type { LocationQuery, LocationQueryRaw } from './query';
import type {
  ErrorHandler,
  NavigationGuard,
  NavigationGuardNext,
  NavigationHook,
  RedirectFn,
  RouteLocation,
  RouteLocationRaw,
  RouteRecord,
  Router as RouterInterface,
  RouterMode,
  RouterOptions,
} from './types';

import React from 'react';
import {
  createBrowserRouter,
  createHashRouter,
  createMemoryRouter,
  Outlet,
} from 'react-router-dom';

import { RouterContext } from '../context/RouterContext';
import { createRouterError, RouterError, RouterErrorTypes } from './errors';
import { RouteMatcher } from './matcher';
import { parseQuery, stringifyQuery } from './query';
import { callbacks } from './utils/callbacks';
import { logger } from './utils/logger';
import { createRedirect } from './utils/redirect';

export class Router implements RouterInterface {
  private afterHooks = callbacks<NavigationHook>();
  private beforeGuards = callbacks<NavigationGuard>();
  private errorHandlers = callbacks<ErrorHandler>();
  private matcher: RouteMatcher;
  private mode: RouterMode;
  public currentRoute?: RouteLocation;
  public history: NavigateFunction | null = null;
  public redirect: RedirectFn;

  constructor(private options: RouterOptions) {
    this.mode = options.mode || 'history';
    this.matcher = new RouteMatcher(options.routes);
    this.redirect = createRedirect();

    if (options.beforeEach) {
      this.beforeEach(options.beforeEach);
    }

    if (options.afterEach) {
      this.afterEach(options.afterEach);
    }

    this.initializeRoute();
  }

  private handleError(error: RouterError): void {
    if (this.errorHandlers.list().length > 0) {
      this.errorHandlers.list().forEach((handler) => handler(error));
    } else {
      logger.error('Navigation error:', error);
      throw error;
    }
  }

  private async initializeRoute() {
    const location = window.location;
    const currentRoute = await this.resolve({
      path: location.pathname + location.search,
    });

    // 执行导航守卫
    try {
      const emptyRoute = this.createEmptyRoute();
      await this.runGuards(currentRoute, emptyRoute);
      this.currentRoute = currentRoute;

      // 执行 afterEach 钩子
      this.afterHooks.list().forEach((hook) => hook(currentRoute, emptyRoute));
    } catch (error) {
      // 如果导航被取消（例如重定向），不更新当前路由
      const routerError =
        error instanceof RouterError
          ? error
          : createRouterError(RouterErrorTypes.NAVIGATION_CANCELLED, {
              error,
              from: this.createEmptyRoute(),
              to: currentRoute,
            });
      this.handleError(routerError);
    }
  }

  private async navigate(
    to: RouteLocation,
    type: 'push' | 'replace',
  ): Promise<void> {
    if (!this.history) {
      throw new RouterError(
        RouterErrorTypes.NAVIGATION_ABORTED,
        'Router not initialized',
      );
    }

    const from = this.currentRoute || this.createEmptyRoute();

    try {
      await this.runGuards(to, from);

      const navigationMethod =
        type === 'push'
          ? (path: string) => Promise.resolve(this.history?.(path))
          : (path: string) =>
              Promise.resolve(this.history?.(path, { replace: true }));

      if (!this.history) {
        throw new RouterError(
          RouterErrorTypes.NAVIGATION_ABORTED,
          'Router not initialized',
        );
      }

      await navigationMethod(to.fullPath);

      this.currentRoute = to;

      this.afterHooks.list().forEach((hook) => hook(to, from));

      // 处理滚动行为
      if (this.options.scrollBehavior) {
        const position = await Promise.resolve(
          this.options.scrollBehavior(to, from),
        );
        if (position) {
          window.scrollTo(position);
        } else if (position === false) {
          // 不做任何滚动
        } else {
          // 默认滚动到顶部
          window.scrollTo({ behavior: 'auto', top: 0 });
        }
      }
    } catch (error) {
      const routerError =
        error instanceof RouterError
          ? error
          : createRouterError(RouterErrorTypes.NAVIGATION_CANCELLED, {
              error,
              from,
              to,
            });
      this.handleError(routerError);
    }
  }

  private async runGuards(to: RouteLocation, from: RouteLocation) {
    const guards = this.beforeGuards.list();
    for (const guard of guards) {
      await new Promise<void>((resolve, reject) => {
        const next: NavigationGuardNext = (result) => {
          if (result === false || result instanceof Error) {
            reject(result);
          } else {
            resolve();
          }
        };
        guard(to, from, next, this);
      });
    }
  }

  private transformRoutes(routes: RouteRecord[]): RouteObject[] {
    return [
      {
        element: (
          <RouterContext.Provider
            value={{
              currentRoute: this.currentRoute || this.createEmptyRoute(),
              router: this,
            }}
          >
            <Outlet />
          </RouterContext.Provider>
        ),
        path: '/',
        children: routes.map((route) => ({
          path: route.path === '/' ? '' : route.path,
          element: React.createElement(route.component),
          children: route.children
            ? this.transformRoutes(route.children)
            : undefined,
        })),
      },
    ];
  }

  private updateReactRouter(): void {
    if (this.history) {
      const routes = this.transformRoutes(this.getRoutes());
      // @ts-ignore - 内部方法
      this.history._internalSetRoutes(routes);
    }
  }

  // 路由管理方法
  addRoute(route: RouteRecord, parentName?: string): void {
    try {
      this.matcher.addRoute(route, parentName);
      this.updateReactRouter();
    } catch (error) {
      logger.error('Failed to add route:', error);
      throw error;
    }
  }

  afterEach(hook: NavigationHook): () => void {
    return this.afterHooks.add(hook);
  }

  beforeEach(guard: NavigationGuard): () => void {
    return this.beforeGuards.add(guard);
  }

  // 将 createEmptyRoute 改为公共方法
  createEmptyRoute(): RouteLocation {
    return {
      fullPath: '',
      hash: '',
      matched: [],
      meta: {},
      params: {},
      path: '',
      query: {},
    };
  }

  // 创建底层路由器
  createRouter(): ReturnType<typeof createBrowserRouter> {
    const routes = this.transformRoutes(this.options.routes);

    const config = {
      future: {
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_relativeSplatPath: true,
        v7_skipActionErrorRevalidation: true,
        v7_startTransition: true,
      },
      routes,
    };

    switch (this.mode) {
      case 'hash': {
        return createHashRouter(routes, config);
      }
      case 'memory': {
        return createMemoryRouter(routes, config);
      }
      default: {
        return createBrowserRouter(routes, config);
      }
    }
  }

  // 添加 getOptions 方法以安全地访问配置
  getOptions(): RouterOptions {
    return this.options;
  }

  getRoute(name: string): RouteRecord | undefined {
    return this.matcher.getRoute(name);
  }

  getRoutes(): RouteRecord[] {
    return this.matcher.getRoutes();
  }

  onError(handler: ErrorHandler): void {
    this.errorHandlers.add(handler);
  }

  // 查询参数处理
  parseQuery(search: string): LocationQuery {
    return parseQuery(search);
  }

  // 导航方法
  async push(to: RouteLocationRaw): Promise<void> {
    try {
      const targetRoute = await this.resolve(to);
      await this.navigate(targetRoute, 'push');
    } catch (error) {
      logger.error('Navigation failed:', error);
      throw error;
    }
  }

  removeRoute(name: string): void {
    try {
      this.matcher.removeRoute(name);
      this.updateReactRouter();
    } catch (error) {
      logger.error('Failed to remove route:', error);
      throw error;
    }
  }

  async replace(to: RouteLocationRaw): Promise<void> {
    try {
      const targetRoute = await this.resolve(to);
      await this.navigate(targetRoute, 'replace');
    } catch (error) {
      logger.error('Navigation failed:', error);
      throw error;
    }
  }

  async resolve(to: RouteLocationRaw): Promise<RouteLocation> {
    const { params, route } = this.matcher.resolve(to);
    const query = typeof to === 'string' ? {} : to.query || {};
    const fullPath = route.path + this.stringifyQuery(query);

    return {
      fullPath,
      hash: typeof to === 'string' ? '' : to.hash || '',
      matched: [route],
      meta: route.meta || {},
      name: route.name,
      params,
      path: route.path,
      query: parseQuery(this.stringifyQuery(query)),
    };
  }

  stringifyQuery(query: LocationQueryRaw): string {
    return stringifyQuery(query);
  }
}
