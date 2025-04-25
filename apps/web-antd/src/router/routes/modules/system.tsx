import type { RouteConfig } from '@xpress-core/router';

const routes: RouteConfig[] = [
  {
    path: 'system',
    meta: {
      title: '系统管理',
      icon: 'mdi:cog-outline',
      order: 9999,
    },
    defaultPath: 'user',
    children: [
      {
        path: 'user',
        component: () => import('#/pages/system/user'),
        meta: {
          title: '用户管理',
          icon: 'mdi:account-outline',
          order: 10_000,
        },
      },
      {
        path: 'role',
        component: () => import('#/pages/system/role'),
        meta: {
          title: '角色管理',
          icon: 'mdi:shield-account-outline',
          order: 10_001,
        },
      },
      {
        path: 'menu',
        component: () => import('#/pages/system/menu'),
        meta: {
          title: '菜单管理',
          icon: 'mdi:menu',
        },
      },
    ],
  },
];

export default routes;
