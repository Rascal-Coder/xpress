import type { RouteConfig } from '@xpress-core/router';

const routes: RouteConfig[] = [
  {
    path: 'nest',
    component: () => import('#/pages/nest'),
    meta: {
      title: '嵌套路由',
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
        component: () => import('#/pages/nest/nest2'),
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
            component: () => import('#/pages/nest/nest2/nest2-2'),
            meta: {
              title: '菜单2-2',
            },
            defaultPath: 'nest2-2-1',
            children: [
              {
                path: 'nest2-2-1',
                component: () => import('#/pages/nest/nest2/nest2-1/nest2-2-1'),
                meta: {
                  title: '菜单2-2-1',
                },
              },
              {
                path: 'nest2-2-2',
                component: () => import('#/pages/nest/nest2/nest2-2/nest2-2-2'),
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
];

export default routes;
