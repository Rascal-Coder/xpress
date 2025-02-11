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
        name: '概览',
        children: [
          {
            path: '',
            redirect: 'analysis',
          },
          {
            path: 'analysis',
            component: () => import('#/pages/dashboard/analysis'),
            name: '分析页',
            permission: 'homeIndex',
          },
          {
            path: 'workbench',
            component: () => import('#/pages/dashboard/workbench'),
            name: '工作台',
          },
        ],
      },
      {
        path: 'settings',
        hidden: true,
        component: () => import('#/pages/settings'),
        name: '设置',
      },
      {
        path: 'nest',
        component: () => import('#/pages/nest'),
        name: '嵌套路由',
        children: [
          {
            path: '', // 或'/layout'，也会生效
            redirect: 'nest1',
          },
          {
            path: 'nest1',
            component: () => import('#/pages/nest/nest1'),
            name: '菜单1',
          },
          {
            path: 'nest2',
            component: () => import('#/pages/nest/nest2'),
            name: '菜单2',
            children: [
              {
                path: '',
                redirect: 'nest2-1',
              },
              {
                path: 'nest2-1',
                component: () => import('#/pages/nest/nest2-1'),
                name: '菜单2-1',
              },
              {
                path: 'nest2-2',
                component: () => import('#/pages/nest/nest2-2'),
                name: '菜单2-2',
                children: [
                  {
                    path: '',
                    redirect: 'nest2-2-1',
                  },
                  {
                    path: 'nest2-2-1',
                    component: () => import('#/pages/nest/nest2-2-1'),
                    name: '菜单2-2-1',
                  },
                  {
                    path: 'nest2-2-2',
                    component: () => import('#/pages/nest/nest2-2-2'),
                    name: '菜单2-2-2',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: 'error-page',
        name: '错误页',
        children: [
          {
            path: '',
            redirect: '403',
          },
          {
            path: '403',
            component: () => import('#/pages/noAccess'),
            name: '403',
          },
          {
            path: '404',
            component: () => import('#/pages/notFound'),
            name: '404',
          },
        ],
      },
    ],
  },
  {
    path: '/no-access',
    component: () => import('#/pages/noAccess'),
    name: '出错了',
    hidden: true,
  },
  {
    path: '/not-found',
    component: () => import('#/pages/notFound'),
    name: '页面不存在',
    hidden: true,
  },
  {
    path: '*',
    component: () => import('#/pages/notFound'),
    name: '页面不存在',
    hidden: true,
  },
];
