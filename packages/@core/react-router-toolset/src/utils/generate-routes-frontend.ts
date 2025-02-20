import type { RouteConfig } from '@xpress-core/router';

import { filterTree, mapTree } from '@xpress-core/shared/utils';

/**
 * 动态生成路由 - 前端方式
 */
async function generateRoutesByFrontend(
  routes: RouteConfig[],
  roles: string[],
  forbiddenComponent?: RouteConfig['component'],
): Promise<RouteConfig[]> {
  // 根据角色标识过滤路由表,判断当前用户是否拥有指定权限
  const finalRoutes = filterTree(routes, (route) => {
    return hasPermission(route, roles);
  });

  if (!forbiddenComponent) {
    return finalRoutes;
  }

  // 如果有禁止访问的页面，将禁止访问的页面替换为403页面
  return mapTree(finalRoutes, (route) => {
    if (menuHasVisibleWithForbidden(route)) {
      route.component = forbiddenComponent;
    }
    return route;
  });
}

/**
 * 判断路由是否有权限访问
 * @param route
 * @param access
 */
function hasPermission(route: RouteConfig, access: string[]) {
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
function menuHasVisibleWithForbidden(route: RouteConfig) {
  return (
    !!route.meta?.permission &&
    Reflect.has(route.meta || {}, 'menuVisibleWithForbidden') &&
    !!route.meta?.menuVisibleWithForbidden
  );
}

export { generateRoutesByFrontend, hasPermission };
