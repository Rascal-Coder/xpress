import type { MenuRecordRaw } from '@xpress-core/typings';

import { BasicLayout } from '@xpress/layouts';
import { PreferencesProvider } from '@xpress-core/preferences';

// import { useMemo } from 'react';

import { overridesPreferences } from '#/preferences';
// import router, { useRouter } from '#/router';

function Layout({ menus }: { menus: MenuRecordRaw[] }) {
  const env = import.meta.env.PROD ? 'prod' : 'dev';
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const namespace = `${import.meta.env.VITE_APP_NAMESPACE}-${appVersion}-${env}`;
  // const { routes } = useRouter(router);
  // const { menuItems, flattenMenuItems, allFlattenMenuItems } = useMemo(() => {
  //   const ret = generateMenuItems(routes);
  //   console.log('flattenMenuItems:', ret.flattenMenuItems);
  //   console.log('allFlattenMenuItems:', ret.allFlattenMenuItems);
  //   return ret;
  // }, [routes]);
  return (
    <PreferencesProvider
      options={{ namespace, overrides: overridesPreferences }}
    >
      <BasicLayout sidebarMenus={menus} />
    </PreferencesProvider>
  );
}
// export interface ExtendedRouteConfig extends RouteConfig {
//   _external?: boolean;
// }

// /**
//  * 根据RouteConfig, 生成Menu组件所需的数据
//  */
// export function generateMenuItems(routes: RouteConfig[]): {
//   allFlattenMenuItems: Map<React.Key, ExtendedRouteConfig>;
//   flattenMenuItems: Map<React.Key, ExtendedRouteConfig>;
//   menuItems: MenuRecordRaw[];
// } {
//   const allFlattenMenuItems: Map<React.Key, ExtendedRouteConfig> = new Map();
//   const flattenMenuItems: Map<React.Key, ExtendedRouteConfig> = new Map();
//   function _generateMenuItems(
//     _routes: RouteConfig[],
//     parent?: MenuRecordRaw,
//   ): MenuRecordRaw[] {
//     const ret: MenuRecordRaw[] = [];
//     for (const _route of _routes) {
//       const {
//         collecttedPathname = [],
//         icon,
//         name,
//         hidden,
//         flatten,
//         children,
//         redirect,
//         permission,
//         external,
//       } = _route;
//       if (redirect || (permission && !_permissions?.[permission])) {
//         continue;
//       }
//       if (flatten) {
//         const menuChildren = _generateMenuItems(
//           children ?? [],
//           _permissions,
//           parent,
//         );
//         ret.push(...menuChildren);
//         menuChildren.forEach((item) =>
//           allFlattenMenuItems.set(item.key!, _route as ExtendedRouteConfig),
//         );
//         continue;
//       }
//       const itemRet: MenuRecordRaw = {
//         key: collecttedPathname[collecttedPathname.length - 1],
//         label: i18n.t(`menu:${name}`),
//         icon,
//         parent,
//       };
//       const extendedRoute = {
//         ..._route,
//         _external: external,
//       } as ExtendedRouteConfig;
//       if (children) {
//         const menuChildren = _generateMenuItems(
//           children ?? [],
//           _permissions,
//           itemRet,
//         );
//         itemRet.children = menuChildren;
//       }
//       if (!hidden) {
//         ret.push(itemRet);
//       }
//       allFlattenMenuItems.set(itemRet.key!, extendedRoute);
//       if (!hidden) {
//         flattenMenuItems.set(itemRet.key!, extendedRoute);
//       }
//     }
//     return ret;
//   }
//   const menuItems = _generateMenuItems(routes, permissions);
//   return {
//     menuItems,
//     flattenMenuItems,
//     allFlattenMenuItems,
//   };
// }
export default Layout;
