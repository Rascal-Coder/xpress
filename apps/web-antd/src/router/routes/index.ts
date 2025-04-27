import type { RouteConfig } from '@xpress-core/typings';

import { mergeRouteModules } from '@xpress/router';

import { constantRoutes, fallBackRoutes, rootRoutes } from './core';

const dynamicRouteFiles = import.meta.glob('./modules/**/*.tsx', {
  eager: true,
});

const dynamicRoutes: RouteConfig[] = mergeRouteModules(dynamicRouteFiles);
const staticRoutes = rootRoutes.map((item) => {
  if (item.isRoot) {
    return {
      ...item,
      children: [...dynamicRoutes],
    };
  }
  return item;
});
const routes = [...staticRoutes, ...constantRoutes, ...fallBackRoutes];
const basicRoutes = [...constantRoutes, ...fallBackRoutes];
export { basicRoutes, constantRoutes, routes };
