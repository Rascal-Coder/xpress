import type { RouteConfig } from '@xpress-core/typings';

const routes: RouteConfig[] = [
  {
    path: 'demos',
    meta: {
      title: '演示',
      icon: 'ic:baseline-view-in-ar',
    },
    defaultPath: 'nest',
    children: [
      {
        path: 'nest',
        meta: {
          title: '嵌套菜单',
        },
        defaultPath: 'nest1',
        children: [
          {
            path: 'nest1',
            component: () => import('#/pages/nest/nest1'),
            meta: {
              title: '菜单1',
            },
          },
          {
            path: 'nest2',
            meta: {
              title: '菜单2',
            },
            defaultPath: 'nest2-1',
            children: [
              {
                path: 'nest2-1',
                component: () => import('#/pages/nest/nest2/nest2-1'),
                meta: {
                  title: '菜单2-1',
                },
              },
              {
                path: 'nest2-2',
                meta: {
                  title: '菜单2-2',
                },
                defaultPath: 'nest2-2-1',
                children: [
                  {
                    path: 'nest2-2-1',
                    component: () =>
                      import('#/pages/nest/nest2/nest2-1/nest2-2-1'),
                    meta: {
                      title: '菜单2-2-1',
                    },
                  },
                  {
                    path: 'nest2-2-2',
                    component: () =>
                      import('#/pages/nest/nest2/nest2-2/nest2-2-2'),
                    meta: {
                      title: '菜单2-2-2',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: 'error-page',
        meta: {
          title: '缺省页',
          icon: 'mdi:lightbulb-error-outline',
          order: 9999,
        },
        defaultPath: '403',
        children: [
          {
            path: '403',
            component: () => import('#/pages/not-access'),
            meta: {
              title: '403',
              icon: 'mdi:do-not-disturb-alt',
              order: 10_000,
            },
          },
          {
            path: '404',
            component: () => import('#/pages/not-found'),
            meta: {
              title: '404',
              icon: 'mdi:table-off',
              order: 10_001,
            },
          },
          {
            path: '500',
            component: () => import('#/pages/server-error'),
            meta: {
              title: '500',
              icon: 'mdi:server-off',
            },
          },
          {
            path: 'offline',
            component: () => import('#/pages/offline'),
            meta: {
              title: '离线',
              icon: 'mdi:wifi-off',
            },
          },
        ],
      },
    ],
  },
];

export default routes;
