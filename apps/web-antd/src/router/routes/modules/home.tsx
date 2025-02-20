import type { RouteConfig } from '@xpress-core/router';

const routes: RouteConfig[] = [
  {
    path: 'home',
    meta: {
      title: '概览',
      badgeType: 'dot',
    },
    defaultPath: 'analysis',
    children: [
      {
        path: 'analysis',
        component: () => import('#/pages/dashboard/analysis'),
        meta: {
          menuVisibleWithForbidden: true,
          title: '分析页',
          permission: ['homeIndex'],
        },
      },
      {
        path: 'workbench',
        component: () => import('#/pages/dashboard/workbench'),
        meta: {
          title: '工作台',
        },
      },
    ],
  },
];

export default routes;
