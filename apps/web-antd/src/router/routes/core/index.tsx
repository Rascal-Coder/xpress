import type { RouteConfig } from '@xpress-core/router';

const DEFAULT_HOME_PATH = '/home/analysis';
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
  {
    path: '/register',
    component: () => import('#/pages/register'),
    isConstant: true,
    meta: {
      title: '注册页',
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
    component: () => import('#/pages/noAccess'),
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
    component: () => import('#/pages/notFound'),
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
    component: () => import('#/pages/notFound'),
    isConstant: true,
    meta: {
      title: '页面不存在',
      hideInBreadcrumb: true,
      hideInMenu: true,
      hideInTab: true,
    },
  },
];
