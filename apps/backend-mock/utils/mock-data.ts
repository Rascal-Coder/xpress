export interface UserInfo {
  id: number;
  password: string;
  realName: string;
  roles: string[];
  username: string;
}

export const MOCK_USERS: UserInfo[] = [
  {
    id: 0,
    password: '123456',
    realName: 'xpress',
    roles: ['super'],
    username: 'xpress',
  },
  {
    id: 1,
    password: '123456',
    realName: 'Admin',
    roles: ['admin'],
    username: 'admin',
  },
  {
    id: 2,
    password: '123456',
    realName: 'Jack',
    roles: ['user'],
    username: 'jack',
  },
];

export const MOCK_CODES = [
  // super
  {
    codes: ['AC_100100', 'AC_100110', 'AC_100120', 'AC_100010'],
    username: 'xpress',
  },
  {
    // admin
    codes: ['AC_100010', 'AC_100020', 'AC_100030'],
    username: 'admin',
  },
  {
    // user
    codes: ['AC_1000001', 'AC_1000002'],
    username: 'jack',
  },
];

const dashboardMenus = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/',
    component: 'BasicLayout',
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
            component: '/dashboard/analysis/index',
            meta: {
              menuVisibleWithForbidden: true,
              title: '分析页',
              permission: ['homeIndex'],
              affixTab: true,
            },
          },
          {
            path: 'workbench',
            component: '/dashboard/workbench/index',
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
        component: '/settings/index',
      },
      {
        path: 'nest',
        component: '/pages/nest/index',
        meta: {
          title: '嵌套路由',
        },
        defaultPath: 'nest1',
        children: [
          {
            path: 'nest1',
            component: '/nest/nest1/index',
            meta: {
              title: '菜单1',
            },
          },
          {
            path: 'nest2',
            component: '/nest/nest2/index',
            meta: {
              title: '菜单2',
            },
            defaultPath: 'nest2-1',
            children: [
              {
                path: 'nest2-1',
                component: '/nest/nest2/nest2-1/index',
                meta: {
                  title: '菜单2-1',
                },
              },
              {
                path: 'nest2-2',
                component: '/nest/nest2/nest2-2/nest2-2-2/index',
                meta: {
                  title: '菜单2-2',
                },
                defaultPath: 'nest2-2-1',
                children: [
                  {
                    path: 'nest2-2-1',
                    component: '/nest/nest2/nest2-1/nest2-2-1/index',
                    meta: {
                      title: '菜单2-2-1',
                    },
                  },
                  {
                    path: 'nest2-2-2',
                    component: '/nest/nest2/nest2-2/nest2-2-2/index',
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
            component: '/noAccess/index',
            meta: {
              title: '403',
            },
          },
          {
            path: '404',
            component: '/notFound/index',
            meta: {
              title: '404',
            },
          },
        ],
      },
    ],
  },
];

// const createDemosMenus = (_role: 'admin' | 'super' | 'user') => {
//   const roleWithMenus = {
//     admin: {
//       component: '/demos/access/admin-visible',
//       meta: {
//         icon: 'mdi:button-cursor',
//         title: 'demos.access.adminVisible',
//       },
//       name: 'AccessAdminVisibleDemo',
//       path: '/demos/access/admin-visible',
//     },
//     super: {
//       component: '/demos/access/super-visible',
//       meta: {
//         icon: 'mdi:button-cursor',
//         title: 'demos.access.superVisible',
//       },
//       name: 'AccessSuperVisibleDemo',
//       path: '/demos/access/super-visible',
//     },
//     user: {
//       component: '/demos/access/user-visible',
//       meta: {
//         icon: 'mdi:button-cursor',
//         title: 'demos.access.userVisible',
//       },
//       name: 'AccessUserVisibleDemo',
//       path: '/demos/access/user-visible',
//     },
//   };

//   return [
//     {
//       component: 'BasicLayout',
//       meta: {
//         icon: 'ic:baseline-view-in-ar',
//         keepAlive: true,
//         order: 1000,
//         title: 'demos.title',
//       },
//       name: 'Demos',
//       path: '/demos',
//       redirect: '/demos/access',
//       children: [
//         {
//           name: 'AccessDemos',
//           path: '/demosaccess',
//           meta: {
//             icon: 'mdi:cloud-key-outline',
//             title: 'demos.access.backendPermissions',
//           },
//           redirect: '/demos/access/page-control',
//           children: [
//             {
//               name: 'AccessPageControlDemo',
//               path: '/demos/access/page-control',
//               component: '/demos/access/index',
//               meta: {
//                 icon: 'mdi:page-previous-outline',
//                 title: 'demos.access.pageAccess',
//               },
//             },
//             {
//               name: 'AccessButtonControlDemo',
//               path: '/demos/access/button-control',
//               component: '/demos/access/button-control',
//               meta: {
//                 icon: 'mdi:button-cursor',
//                 title: 'demos.access.buttonControl',
//               },
//             },
//             {
//               name: 'AccessMenuVisible403Demo',
//               path: '/demos/access/menu-visible-403',
//               component: '/demos/access/menu-visible-403',
//               meta: {
//                 authority: ['no-body'],
//                 icon: 'mdi:button-cursor',
//                 menuVisibleWithForbidden: true,
//                 title: 'demos.access.menuVisible403',
//               },
//             },
//             roleWithMenus[role],
//           ],
//         },
//       ],
//     },
//   ];
// };

export const MOCK_MENUS = [
  ...dashboardMenus,
  // {
  //   menus: [...dashboardMenus, ...createDemosMenus('super')],
  //   username: 'xpress',
  // },
  // {
  //   menus: [...dashboardMenus, ...createDemosMenus('admin')],
  //   username: 'admin',
  // },
  // {
  //   menus: [...dashboardMenus, ...createDemosMenus('user')],
  //   username: 'jack',
  // },
];
