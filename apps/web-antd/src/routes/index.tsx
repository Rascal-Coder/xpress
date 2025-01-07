import { createRoute, createRouter, redirect } from '@tanstack/react-router';

import { dashboardRoutes } from './modules/dashboard';
import { settingsRoutes } from './modules/settings';
import { rootRoute } from './root';

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/analysis' });
  },
});

// 创建路由树
const routeTree = rootRoute.addChildren([
  indexRoute,
  ...dashboardRoutes,
  ...settingsRoutes,
]);

// 创建路由器
export const router = createRouter({ routeTree });
