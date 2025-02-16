import type { ReactNode } from 'react';
import type { RouteObject } from 'react-router-dom';

import type { RouteConfig } from './types';

import loadable from '@loadable/component';
import { Navigate, useParams } from 'react-router-dom';

interface FormatRoutesResult {
  flattenRoutes: Map<string, RouteConfig>;
  routes: RouteConfig[];
}

type RouteParams = null | Record<string, string | undefined> | undefined;

/**
 * 将 RouteConfig 配置转换为 react-router 所需的路由配置
 * @param configs - 路由配置数组
 * @returns 转换后的 RouteObject 数组
 */
export function generateReactRoutes(configs?: RouteConfig[]): RouteObject[] {
  return (configs ?? [])
    .filter((configItem) => !configItem.meta?.link)
    .map((configItem) => {
      const { redirect, component, defaultPath, children } = configItem;
      let element: null | ReactNode = null;

      if (redirect) {
        element = <Navigate to={redirect} />;
      } else if (component) {
        const LoadedElement = loadable(component);
        element = <LoadedElement />;
      }

      const routeObject: RouteObject = {
        path: configItem.path,
        element,
        caseSensitive: configItem.caseSensitive ?? false,
      };

      if (children) {
        routeObject.children = defaultPath
          ? generateReactRoutes([
              { path: '', redirect: defaultPath },
              ...children,
            ])
          : generateReactRoutes(children);
      }

      return routeObject;
    });
}

/**
 * 处理路由配置，生成扁平化路由表和层级路由结构
 * @param routesConfig - 路由配置数组
 * @param parent - 父级路由配置
 * @returns 包含扁平化路由表和层级路由结构的对象
 */
export function formatRoutes(
  routesConfig: RouteConfig[],
  parent?: RouteConfig,
): FormatRoutesResult {
  const flattenRoutes = new Map<string, RouteConfig>();

  function processRoutes(
    configs: RouteConfig[],
    parentConfig?: RouteConfig,
  ): RouteConfig[] {
    return configs.map((routeItem) => {
      const path = routeItem.path === '/' ? '' : routeItem.path;
      const { collecttedPathname: parentPathname, collecttedPath: parentPath } =
        parentConfig ?? {};

      const collecttedPathname = parentPathname
        ? [
            ...parentPathname,
            `${parentPathname[parentPathname.length - 1]}/${path}`,
          ]
        : [path];
      const collecttedPath = parentPath ? [...parentPath, path] : [path];
      const pathname = collecttedPath.join('/').replace(/\/$/, '') || '/';

      const processedRoute = {
        ...routeItem,
        collecttedPathname,
        collecttedPath,
        pathname,
        parent: parentConfig,
      };

      if (routeItem.children) {
        processedRoute.children = processRoutes(
          routeItem.children,
          processedRoute,
        );
      }

      flattenRoutes.set(pathname, {
        ...flattenRoutes.get(pathname),
        ...processedRoute,
      });

      return processedRoute;
    });
  }

  const routes = processRoutes(routesConfig, parent);
  return { routes, flattenRoutes };
}

/**
 * 根据路由路径和参数生成实际的 URL 路径
 * @param routePath - 路由路径模板
 * @param params - URL 参数对象
 * @returns 替换参数后的实际 URL 路径
 */
export function getPathnameByRoutePathAndParams(
  routePath: string,
  params: RouteParams,
): string {
  let result = routePath;
  const paramEntries = Object.entries(params ?? {});

  for (const [key, value] of paramEntries) {
    const pattern = new RegExp(`:${key}`);
    result = result.replace(pattern, value ?? '');
  }

  return result;
}

/**
 * 根据当前路由 routePath, 替换掉path中的动态路由参数如":id"的hooks写法
 * @example '/:id/home' -> '/123/home'
 */
export function usePathname(): (routePath: string) => string {
  const params = useParams<Record<string, string>>();
  return (routePath: string) =>
    getPathnameByRoutePathAndParams(routePath, params);
}

/**
 * 把/:id去掉，以及其后面的去掉
 * 应用场景例如计算菜单展开时, 父路由下的详情页会选中其父菜单
 */
export function tryFindRouteFather(routePath: string, hidden = false): string {
  if (!hidden) return routePath;

  const pathSegments = routePath.split(':');
  return pathSegments.length === 1
    ? (pathSegments[0] ?? '')
    : pathSegments.slice(0, -1).join(':').replace(/\/$/, '');
}

/**
 * 在路由配置中查找指定路径的配置项
 * @param routesConfig - 路由配置数组
 * @param routePath - 目标路径
 * @returns 匹配的路由配置项或 null
 */
export function findroutesConfigItem(
  routesConfig: RouteConfig[],
  routePath: string,
): null | RouteConfig {
  const computedPath: string[] = [];

  function findInTree(
    configs: RouteConfig[],
    targetPath: string,
  ): null | RouteConfig {
    for (const item of configs) {
      computedPath.push(item.path === '/' ? '' : item.path);
      const currentPath = computedPath.join('/');

      if (currentPath === targetPath && !item.redirect) {
        return item;
      }

      if (item.children?.length) {
        const found = findInTree(item.children, targetPath);
        if (found) return found;
      }

      computedPath.pop();
    }
    return null;
  }

  return findInTree(routesConfig, routePath);
}
