import type { MenuRecordRaw } from '@xpress-core/typings';

import type { RouteConfig } from '../types';

import { filterTree } from '@xpress-core/shared/utils';

/**
 * 根据RouteConfig, 生成Menu组件的item属性所需的数据
 */
export function generateMenuItems(routes: RouteConfig[]): {
  allFlattenMenuItems: Map<React.Key, RouteConfig>;
  flattenMenuItems: Map<React.Key, RouteConfig>;
  menuItems: MenuRecordRaw[];
} {
  const allFlattenMenuItems: Map<React.Key, RouteConfig> = new Map();
  const flattenMenuItems: Map<React.Key, RouteConfig> = new Map();
  function _generateMenuItems(
    _routes: RouteConfig[],
    _parentRouteConfig?: RouteConfig,
  ): MenuRecordRaw[] {
    const ret: MenuRecordRaw[] = [];
    for (const _route of _routes) {
      const { collecttedPathname = [], flatten, redirect, children } = _route;
      const {
        activeIcon,
        badge,
        badgeType,
        badgeVariants,
        hideChildrenInMenu = false,
        hideInMenu,
        icon,
        link,
        order,
        title = '',
      } = _route.meta ?? {};

      // 如果是重定向路由，跳过
      if (redirect) {
        continue;
      }

      // 如果是扁平化路由，直接将子路由添加到当前层级
      if (flatten) {
        const menuChildren = _generateMenuItems(children ?? [], _route);
        ret.push(...menuChildren);
        menuChildren.forEach((item) =>
          allFlattenMenuItems.set(item.key, _route as RouteConfig),
        );
        continue;
      }

      const currentPath =
        collecttedPathname[collecttedPathname.length - 1] ?? '';

      const itemRet: MenuRecordRaw = {
        activeIcon,
        badge,
        badgeType,
        badgeVariants,
        icon,
        key: currentPath,
        name: title ?? '',
        order,
        path: hideChildrenInMenu
          ? (redirect ?? currentPath)
          : (link ?? currentPath),
        show: !hideInMenu,
      };

      const extendedRoute = {
        ..._route,
      };

      if (children) {
        const menuChildren = _generateMenuItems(children, itemRet);
        if (menuChildren.length > 0) {
          const resultChildren = hideChildrenInMenu
            ? []
            : (menuChildren as MenuRecordRaw[]);
          itemRet.children = resultChildren;
        }
      }

      if (!hideInMenu) {
        ret.push(itemRet);
      }

      allFlattenMenuItems.set(itemRet.key, extendedRoute);
      if (!hideInMenu) {
        flattenMenuItems.set(itemRet.key, extendedRoute);
      }
    }
    return ret;
  }
  let menuItems = _generateMenuItems(routes);
  menuItems = menuItems.sort((a, b) => (a.order || 999) - (b.order || 999));

  const finalMenus = filterTree(menuItems, (menu) => {
    return !!menu.show;
  });
  return {
    allFlattenMenuItems,
    flattenMenuItems,
    menuItems: finalMenus,
  };
}
