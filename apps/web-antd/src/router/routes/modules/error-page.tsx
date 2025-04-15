import type { RouteConfig } from '@xpress-core/router';

const routes: RouteConfig[] = [
  {
    path: 'error-page',
    meta: {
      title: '错误页',
      order: 9999,
    },
    defaultPath: '403',
    children: [
      {
        path: '403',
        component: () => import('#/pages/not-access'),
        meta: {
          title: '403',
          order: 10_000,
        },
      },
      {
        path: '404',
        component: () => import('#/pages/not-found'),
        meta: {
          title: '404',
          order: 10_001,
        },
      },
      {
        path: '500',
        component: () => import('#/pages/server-error'),
        meta: {
          title: '500',
        },
      },
      {
        path: 'offline',
        component: () => import('#/pages/offline'),
        meta: {
          title: '离线',
        },
      },
    ],
  },
];

export default routes;
