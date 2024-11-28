import type { NavigateFunction, RouteObject } from 'react-router-dom';

import type { LocationQuery, LocationQueryRaw } from './query';
import type {
  RouteLocation,
  RouteLocationRaw,
  RouteRecord,
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
// import type { NavigationFailure } from './errors';
import { logger } from './utils/logger';

export type RouterMode = 'hash' | 'history' | 'memory';

export type NavigationGuardNext = (
  to?: (() => void) | Error | false | RouteLocationRaw,
) => void;

export interface NavigationGuard {
  (
    to: RouteLocation,
    from: RouteLocation,
    next: NavigationGuardNext,
  ): Promise<void> | void;
}

export type NavigationHook = (to: RouteLocation, from: RouteLocation) => void;

export type ErrorHandler = (error: RouterError) => void;

export class Router {
  private afterHooks = callbacks<NavigationHook>();
  private beforeGuards = callbacks<NavigationGuard>();
  private errorHandler?: ErrorHandler;
  private history: NavigateFunction | null = null;
  private matcher: RouteMatcher;
  private mode: RouterMode;
  currentRoute?: RouteLocation;

  constructor(private options: RouterOptions) {
    this.mode = options.mode || 'history';
    this.matcher = new RouteMatcher(options.routes);

    if (options.beforeEach) {
      this.beforeEach(options.beforeEach);
    }

    if (options.afterEach) {
      this.afterEach(options.afterEach);
    }
  }

  // 私有方法
  private createEmptyRoute(): RouteLocation {
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

  private handleError(error: RouterError): void {
    if (this.errorHandler) {
      this.errorHandler(error);
    } else {
      logger.error('Navigation error:', error);
      throw error;
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

  private async runGuards(
    to: RouteLocation,
    from: RouteLocation,
  ): Promise<void> {
    const guards = this.beforeGuards.list();
    for (const guard of guards) {
      await new Promise<void>((resolve, reject) => {
        const next: NavigationGuardNext = (arg?: any) => {
          if (arg === false) {
            reject(
              new RouterError(
                RouterErrorTypes.NAVIGATION_CANCELLED,
                'Navigation cancelled by guard',
              ),
            );
          } else if (arg instanceof Error) {
            reject(arg);
          } else if (typeof arg === 'string' || typeof arg === 'object') {
            reject(
              new RouterError(
                RouterErrorTypes.NAVIGATION_DUPLICATED,
                'Redirecting',
                { to: arg },
              ),
            );
          } else {
            resolve();
          }
        };

        guard(to, from, next);
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

  getRoute(name: string): RouteRecord | undefined {
    return this.matcher.getRoute(name);
  }

  getRoutes(): RouteRecord[] {
    return this.matcher.getRoutes();
  }

  onError(handler: ErrorHandler): void {
    this.errorHandler = handler;
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
    const route = this.matcher.resolve(to);
    const query = typeof to === 'string' ? {} : to.query || {};
    const fullPath = route.path + this.stringifyQuery(query);

    return {
      fullPath,
      hash: typeof to === 'string' ? '' : to.hash || '',
      matched: [route],
      meta: route.meta || {},
      name: route.name,
      params: typeof to === 'string' ? {} : to.params || {},
      path: route.path,
      query: parseQuery(this.stringifyQuery(query)),
    };
  }

  stringifyQuery(query: LocationQueryRaw): string {
    return stringifyQuery(query);
  }
}
