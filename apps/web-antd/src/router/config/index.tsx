import type { RouteConfig } from '@xpress-core/router';

export const routesConfig: RouteConfig[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/',
    component: () => import('#/layout'),
    flatten: true,
    children: [
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
      {
        path: 'settings',
        meta: {
          title: '设置',
        },
        component: () => import('#/pages/settings'),
      },
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
                component: () => import('#/pages/nest/nest2-1'),
                meta: {
                  title: '菜单2-1',
                },
              },
              {
                path: 'nest2-2',
                component: () => import('#/pages/nest/nest2-2'),
                meta: {
                  title: '菜单2-2',
                },
                defaultPath: 'nest2-2-1',
                children: [
                  {
                    path: 'nest2-2-1',
                    component: () => import('#/pages/nest/nest2-2-1'),
                    meta: {
                      title: '菜单2-2-1',
                    },
                  },
                  {
                    path: 'nest2-2-2',
                    component: () => import('#/pages/nest/nest2-2-2'),
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
          title: '错误页',
        },
        defaultPath: '403',
        children: [
          {
            path: '403',
            component: () => import('#/pages/noAccess'),
            meta: {
              title: '403',
            },
          },
          {
            path: '404',
            component: () => import('#/pages/notFound'),
            meta: {
              title: '404',
            },
          },
        ],
      },
    ],
  },
  {
    path: '/no-access',
    component: () => import('#/pages/noAccess'),
    meta: {
      title: '出错了',
    },
  },
  {
    path: '/not-found',
    component: () => import('#/pages/notFound'),
    meta: {
      title: '页面不存在',
    },
  },
  {
    path: '*',
    component: () => import('#/pages/notFound'),
    meta: {
      title: '页面不存在',
      hideInBreadcrumb: true,
      hideInMenu: true,
      hideInTab: true,
    },
  },
];
