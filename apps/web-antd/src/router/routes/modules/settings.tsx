import type { RouteConfig } from '@xpress-core/router';

const routes: RouteConfig[] = [
  {
    path: 'settings',
    meta: {
      title: '设置',
    },
    component: () => import('#/pages/settings'),
  },
];
export default routes;
