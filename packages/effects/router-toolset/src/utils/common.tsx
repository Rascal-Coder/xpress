import type { RouteConfig } from '@xpress-core/typings';
import type { ReactNode } from 'react';

import loadable from '@loadable/component';
import {
  Navigate,
  type RouteObject,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { AuthGuard } from './Auth';

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
      const { component, defaultPath, meta, redirect, children } = configItem;
      let element: null | ReactNode = null;

      if (redirect) {
        element = <Navigate to={redirect} />;
      } else if (component) {
        const LoadedElement = loadable(component);
        element = <AuthGuard meta={meta}>{<LoadedElement />}</AuthGuard>;
      }

      const routeObject: RouteObject = {
        caseSensitive: configItem.caseSensitive ?? false,
        element,
        path: configItem.path,
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
 * 获取完整的路由路径（包含查询参数和hash）
 */
export function getFullPath(
  pathname: string,
  search: string = '',
  hash: string = '',
): string {
  return `${pathname}${search}${hash}`;
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
      const {
        collecttedPath: parentPath,
        collecttedPathname: parentPathname,
        collecttedRouteInfo: parentMeta = [],
      } = parentConfig ?? {};

      const collecttedPathname = parentPathname
        ? [
            ...parentPathname,
            `${parentPathname[parentPathname.length - 1]}/${path}`,
          ]
        : [path];
      const collecttedPath = parentPath ? [...parentPath, path] : [path];
      const pathname = collecttedPath.join('/').replace(/\/$/, '') || '/';

      // 收集当前路由和父路由的meta信息
      const collecttedRouteInfo = [
        ...parentMeta,
        ...(routeItem.meta
          ? [
              {
                defaultPath: routeItem.defaultPath,
                meta: routeItem.meta,
                path: pathname,
              },
            ]
          : []),
      ];

      const processedRoute = {
        ...routeItem,
        collecttedPath,
        collecttedPathname,
        collecttedRouteInfo,
        parent: parentConfig,
        pathname,
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
  return { flattenRoutes, routes };
}

/**
 * 获取当前路由的完整路径（包含查询参数和hash）的 hook
 */
export function useFullPath(): string {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const search = searchParams.toString();
  return getFullPath(
    location.pathname,
    search ? `?${search}` : '',
    location.hash,
  );
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

/**
 * 判断路由是否有权限访问
 * @param route
 * @param access
 */
export function hasPermission(route: RouteConfig, access: string[]) {
  const permission = route.meta?.permission;
  if (!permission) {
    return true;
  }
  const canAccess = access.some((value) => permission.includes(value));

  return canAccess || (!canAccess && menuHasVisibleWithForbidden(route));
}

/**
 * 判断路由是否在菜单中显示，但是访问会被重定向到403
 * @param route
 */
export function menuHasVisibleWithForbidden(route: RouteConfig) {
  return (
    !!route.meta?.permission &&
    Reflect.has(route.meta || {}, 'menuVisibleWithForbidden') &&
    !!route.meta?.menuVisibleWithForbidden
  );
}
