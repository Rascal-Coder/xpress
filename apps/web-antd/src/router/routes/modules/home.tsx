import type { RouteConfig } from '@xpress-core/router';

const routes: RouteConfig[] = [
  {
    path: 'home',
    meta: {
      title: '概览',
      badgeType: 'dot',
      icon: 'lucide:layout-dashboard',
    },
    defaultPath: 'analysis',
    children: [
      {
        path: 'analysis',
        component: () => import('#/pages/dashboard/analysis'),
        meta: {
          // menuVisibleWithForbidden: true,
          title: '分析页',
          // permission: ['homeIndex'],
          affixTab: true,
          icon: 'lucide:area-chart',
          // affixTabOrder: 2,
        },
      },
      {
        path: 'workbench',
        component: () => import('#/pages/dashboard/workbench'),
        meta: {
          title: '工作台',
          icon: 'carbon:workspace',
          keepAlive: true,
          // affixTab: true,
        },
      },
    ],
  },
];

export default routes;
