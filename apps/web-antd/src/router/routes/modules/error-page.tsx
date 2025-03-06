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
        component: () => import('#/pages/noAccess'),
        meta: {
          title: '403',
          order: 10_000,
        },
      },
      {
        path: '404',
        component: () => import('#/pages/notFound'),
        meta: {
          title: '404',
          order: 10_001,
        },
      },
    ],
  },
];

export default routes;
