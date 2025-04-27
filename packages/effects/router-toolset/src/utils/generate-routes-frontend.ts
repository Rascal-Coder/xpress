import type { RouteConfig } from '@xpress-core/typings';

import { filterTree, mapTree } from '@xpress-core/shared/utils';

import { hasPermission, menuHasVisibleWithForbidden } from './common';

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

export { generateRoutesByFrontend };
