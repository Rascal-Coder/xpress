import type { RouteConfig } from '@xpress-core/typings';

import { DEFAULT_HOME_PATH } from '@xpress/constants';

export const constantRoutes: RouteConfig[] = [
  {
    path: '/login',
    component: () => import('#/pages/login'),
    isConstant: true,
    meta: {
      title: '登录页',
      hideInBreadcrumb: true,
      hideInMenu: true,
      hideInTab: true,
    },
  },
];

export const rootRoutes: RouteConfig[] = [
  {
    path: '/',
    redirect: DEFAULT_HOME_PATH,
  },
  {
    path: '/',
    component: () => import('#/layout'),
    flatten: true,
    isRoot: true,
  },
];
export const fallBackRoutes: RouteConfig[] = [
  {
    path: '/no-access',
    component: () => import('#/pages/not-access'),
    isConstant: true,
    meta: {
      title: '出错了',
      hideInBreadcrumb: true,
      hideInMenu: true,
      hideInTab: true,
    },
  },
  {
    path: '/not-found',
    component: () => import('#/pages/not-found'),
    isConstant: true,
    meta: {
      title: '页面不存在',
      hideInBreadcrumb: true,
      hideInMenu: true,
      hideInTab: true,
    },
  },
  {
    path: '*',
    component: () => import('#/pages/not-found'),
    isConstant: true,
    meta: {
      title: '页面不存在',
      hideInBreadcrumb: true,
      hideInMenu: true,
      hideInTab: true,
    },
  },
];
