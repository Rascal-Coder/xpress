import type { ReactNode } from 'react';
import type { RouteObject } from 'react-router-dom';

import type { RouteConfig } from './types';

import loadable from '@loadable/component';
import { Navigate, useParams } from 'react-router-dom';

/**
 * 使用RouteConfig定义的路由数据，生成react-router需要的路由配置
 */
export function generateReactRoutes(configs?: RouteConfig[]) {
  const ret = (configs ?? [])
    .filter((configItem) => {
      return !configItem.meta?.link;
    })
    .map((configItem) => {
      const { redirect, component, /* progress = true,  */ children } =
        configItem;
      let element: null | ReactNode;
      if (redirect) {
        element = <Navigate to={redirect} />;
      } else {
        if (component) {
          const LoadedElement = loadable(component!);
          element = <LoadedElement />;
        }
      }
      const routeObject: RouteObject = {
        path: configItem.path,
        element,
        caseSensitive: configItem.caseSensitive ?? false,
      };
      if (children) {
        routeObject.children = generateReactRoutes(children);
      }
      return routeObject;
    });
  return ret;
}

/**
 * 使用RouteConfig定义的路由数据，拓展出一些用于渲染(如菜单)的数据
 */
export function formatRoutes(
  routesConfig: RouteConfig[],
  parent?: RouteConfig,
): {
  flattenRoutes: Map<string, RouteConfig>;
  routes: RouteConfig[];
} {
  const flattenRoutes: Map<string, RouteConfig> = new Map();
  function _formatRoutes(
    _routesConfigs: RouteConfig[],
    _parent?: RouteConfig,
  ): RouteConfig[] {
    // return produce(_routesConfigs, draft => {});
    return _routesConfigs.map((routeItem) => {
      const path = routeItem.path === '/' ? '' : routeItem.path;
      const { collecttedPathname: parentPathname, collecttedPath: parentPath } =
        _parent ?? {};
      const collecttedPathname = parentPathname
        ? [
            ...parentPathname,
            `${parentPathname[parentPathname.length - 1]}/${path}`,
          ]
        : [path];
      const collecttedPath = parentPath ? [...parentPath, path] : [path];
      const pathname = collecttedPath.join('/').replace(/\/$/, '') || '/';
      const ret = {
        ...routeItem,
        collecttedPathname,
        collecttedPath,
        pathname,
        parent: _parent,
      };
      if (routeItem.children) {
        ret.children = _formatRoutes(routeItem.children ?? [], ret);
      }
      flattenRoutes.set(pathname, {
        ...flattenRoutes.get(pathname), // 可能有redirect
        ...ret,
      });
      return ret;
    });
  }
  const routes = _formatRoutes(routesConfig, parent);
  return {
    routes,
    flattenRoutes,
  };
}

/**
 * 根据当前路由 routePath 和 params(useParams), 替换掉path中的动态路由参数如":id"
 * @example '/:id/home' -> '/123/home'
 */
export function getPathnameByRoutePathAndParams(
  routePath: string,
  params: null | Record<string, string | undefined> | undefined,
) {
  let ret = routePath;
  for (const key in params ?? {}) {
    const reg = new RegExp(`:${key}`);
    ret = ret.replace(reg, params?.[key] ?? '');
  }
  return ret;
}

/**
 * 根据当前路由 routePath, 替换掉path中的动态路由参数如":id"的hooks写法
 * @example '/:id/home' -> '/123/home'
 */
export function usePathname() {
  const params = useParams();
  return (routePath: string) => {
    const pathname = getPathnameByRoutePathAndParams(routePath, params);
    return pathname;
  };
}

/**
 * 把/:id去掉，以及其后面的去掉
 * 应用场景例如计算菜单展开时, 父路由下的详情页会选中其父菜单
 */
export function tryFindRouteFather(routePath: string, hidden?: boolean) {
  if (!(hidden ?? false)) {
    return routePath;
  }
  const pathAry = routePath.split(':');
  if (pathAry.length === 1) {
    return pathAry[0];
  }
  const ret = pathAry.slice(0, -1).join(':').replace(/\/$/, '');
  return ret;
}

export function findroutesConfigItem(
  routesConfig: RouteConfig[],
  routePath: string,
) {
  const computedPath: string[] = [];

  function loopTree(
    routesConfig: RouteConfig[],
    routePath: string,
  ): null | RouteConfig {
    for (const item of routesConfig) {
      computedPath.push(item.path === '/' ? '' : item.path);
      if (computedPath.join('/') === routePath && !item.redirect) {
        return item;
      }
      if (item.children && item.children.length > 0) {
        const childrenRet = loopTree(item.children, routePath);
        if (childrenRet) {
          return childrenRet;
        }
      }
      computedPath.pop();
      continue;
    }
    return null;
  }

  const item = loopTree(routesConfig, routePath);
  return item;
}
