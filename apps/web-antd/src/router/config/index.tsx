import type { RouteConfig } from '#/router';

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
        },
        children: [
          {
            path: '',
            redirect: 'analysis',
          },
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
        children: [
          {
            path: '', // 或'/layout'，也会生效
            redirect: 'nest1',
          },
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
            children: [
              {
                path: '',
                redirect: 'nest2-1',
              },
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
                children: [
                  {
                    path: '',
                    redirect: 'nest2-2-1',
                  },
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
        children: [
          {
            path: '',
            redirect: '403',
          },
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
