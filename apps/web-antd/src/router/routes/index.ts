import { mergeRouteModules, type RouteConfig } from '@xpress-core/router';

import { coreRoutes, fallBackRoutes } from './core';

const dynamicRouteFiles = import.meta.glob('./modules/**/*.tsx', {
  eager: true,
});

const dynamicRoutes: RouteConfig[] = mergeRouteModules(dynamicRouteFiles);
const staticRoutes = coreRoutes.map((item) => {
  if (item.isRoot) {
    return {
      ...item,
      children: [...dynamicRoutes],
    };
  }
  return item;
});
const routes = [...staticRoutes, ...fallBackRoutes];
export { routes };
