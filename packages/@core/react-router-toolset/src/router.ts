import type { RouteConfig } from './types';

import {
  matchPath,
  matchRoutes,
  type RouteMatch,
  type RouteObject,
  useLocation,
} from '@xpress-core/router';

import EventEmitter from 'eventemitter3';
import { produce } from 'immer';
import { useEffect, useMemo, useState } from 'react';

import {
  findroutesConfigItem,
  formatRoutes,
  generateReactRoutes,
  getPathnameByRoutePathAndParams,
} from './utils';

export class Router extends EventEmitter {
  static EVENT_NAME__onChangeRoutesConfig =
    'EVENT_NAME__onChangeRoutesConfig' as const;
  /**
   * 监听this.routesConfigs变化，并更新reactRoutes/routes/flattenRoutes
   */
  private _onChangeRoutesConfig = () => {
    const handler = (routesConfig: RouteConfig[]) => {
      const reactRoutes = generateReactRoutes(routesConfig);
      const { flattenRoutes, routes } = formatRoutes(routesConfig);
      this.reactRoutes = reactRoutes;
      this.routes = routes;
      this.flattenRoutes = flattenRoutes;
    };

    this.on(Router.EVENT_NAME__onChangeRoutesConfig, handler);
    return () => {
      this.removeListener(Router.EVENT_NAME__onChangeRoutesConfig, handler);
    };
  };
  flattenRoutes: Map<string, RouteConfig> = new Map();
  /**
   * 根据当前路由 params
   * 替换掉目标routePath中的动态路由参数如":id"
   * @example '/:id/home' -> '/123/home'
   */
  getPathname = (routePath: string) => {
    const curRoutePath = this.getRoutePath(location.pathname);
    const { params } =
      matchPath({ path: curRoutePath }, location.pathname) ?? {};
    const pathname = getPathnameByRoutePathAndParams(routePath, params);
    return pathname;
  };
  /**
   * 根据pathname获取router的path
   * router的path里可能有:id
   * @example '/123/home' -> '/:id/home'
   */
  getRoutePath = (pathname: string) => {
    const matchedRoutes = matchRoutes(this.reactRoutes, pathname);
    const routePath = _getRoutePathBymatchedRoutes(matchedRoutes);
    return routePath;
  };
  reactRoutes: RouteObject[] = [];
  routes: RouteConfig[] = [];
  routesConfig: RouteConfig[] = [];
  /**
   * 设置路由项
   * @param pathname 指定路由
   * @param cb 参数为pathname对应的路由
   */
  setItem = (
    pathname: ((routesConfigItem: RouteConfig) => void) | string,
    cb?: (routesConfigItem: RouteConfig) => void,
  ) => {
    const _pathname =
      typeof pathname === 'string' ? pathname : location.pathname;
    const routePath = this.getRoutePath(_pathname);
    const newRoutesConfigs = produce(this.routesConfig, (draft) => {
      const routesConfigItem = findroutesConfigItem(draft, routePath);
      if (routesConfigItem) {
        typeof pathname === 'string'
          ? cb?.(routesConfigItem)
          : pathname(routesConfigItem);
      }
    });
    this.routesConfig = newRoutesConfigs;
    this.emit(Router.EVENT_NAME__onChangeRoutesConfig, newRoutesConfigs);
  };
  /**
   * 设置pathname的兄弟路由
   * @param pathname 指定路由
   * @param cb 参数routesConfigs为pathname的兄弟路由
   * @param cb 参数parentRoute为pathname的父路由
   */
  setSiblings = (
    pathname:
      | ((routesConfig: RouteConfig[], parentRoute: RouteConfig) => void)
      | string,
    cb?: (routesConfig: RouteConfig[], parentRoute: RouteConfig) => void,
  ) => {
    const _pathname =
      typeof pathname === 'string' ? pathname : location.pathname;
    const routePath = this.getRoutePath(_pathname);
    const parentRoute = this.flattenRoutes.get(routePath)?.parentRouteConfig;
    if (parentRoute?.pathname) {
      this.setItem(parentRoute?.pathname, (routesConfig) => {
        if (routesConfig.children) {
          typeof pathname === 'string'
            ? cb?.(routesConfig.children, routesConfig)
            : pathname(routesConfig.children, routesConfig);
        }
      });
    }
  };
  constructor(routesConfig: RouteConfig[]) {
    super();
    this.routesConfig = routesConfig;
    this.reactRoutes = generateReactRoutes(routesConfig);
    const { flattenRoutes, routes } = formatRoutes(routesConfig);
    this.routes = routes;
    this.flattenRoutes = flattenRoutes;

    this._onChangeRoutesConfig();
  }
}

function _getRoutePathBymatchedRoutes(
  matchedRoutes: null | RouteMatch<string, RouteObject>[],
) {
  return (
    matchedRoutes
      ?.map((item) => {
        const reactRoutePath = item.route.path === '/' ? '' : item.route.path;
        return reactRoutePath;
      })
      .join('/')
      .replace(/\/$/, '') ?? ''
  );
}

/**
 * 在react组件中获取最新的reactRoutes/routes/flattenRoutes/curRoute
 */
export function useRouter(router: Router) {
  const [reactRoutes, setReactRoutes] = useState<RouteObject[]>(
    router.reactRoutes,
  );
  const [routes, setRoutes] = useState<RouteConfig[]>(router.routes);
  const [flattenRoutes, setFlattenRoutes] = useState<Map<string, RouteConfig>>(
    router.flattenRoutes,
  );
  const location = useLocation();

  const curRoute = useMemo(() => {
    const routePath = router.getRoutePath(location.pathname);
    return flattenRoutes.get(routePath);
  }, [flattenRoutes, location.pathname, router]);

  useEffect(() => {
    const handler = (newRoutesConfigs: RouteConfig[]) => {
      const reactRoutes = generateReactRoutes(newRoutesConfigs);
      const { flattenRoutes, routes } = formatRoutes(newRoutesConfigs);
      setReactRoutes(reactRoutes);
      setRoutes(routes);
      setFlattenRoutes(flattenRoutes);
    };

    router.on(Router.EVENT_NAME__onChangeRoutesConfig, handler);
    return () => {
      router.removeListener(Router.EVENT_NAME__onChangeRoutesConfig, handler);
    };
  }, [router]);

  return {
    curRoute,
    flattenRoutes,
    reactRoutes,
    routes,
  };
}
