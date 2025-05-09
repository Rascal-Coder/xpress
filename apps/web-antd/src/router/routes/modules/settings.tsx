import type { RouteConfig } from '@xpress-core/typings';

const routes: RouteConfig[] = [
  {
    path: 'settings',
    meta: {
      title: '设置',
      icon: 'mdi:cog-outline',
    },
    component: () => import('#/pages/settings'),
  },
];
export default routes;
