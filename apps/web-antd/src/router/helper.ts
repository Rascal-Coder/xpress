import { generateRoutesByFrontend } from '@xpress-core/router';

import { routes } from './routes';

const forbiddenComponent = () => import('#/pages/noAccess');
// TODO: 测试前端路由
const testFrontendRoutes = await generateRoutesByFrontend(
  routes,
  ['admin'],
  forbiddenComponent,
);
// TODO:后端返回路由
// const mockRoutes = [
//   {
//     path: '/',
//     redirect: '/home',
//   },
//   {
//     path: '/',
//     component: 'layout',
//     flatten: true,
//     children: [
//       {
//         path: 'home',
//         meta: {
//           title: '概览',
//           badgeType: 'dot',
//         },
//         defaultPath: 'analysis',
//         children: [
//           {
//             path: 'analysis',
//             component: '/dashboard/analysis',
//             meta: {
//               menuVisibleWithForbidden: true,
//               title: '分析页',
//             },
//           },
//           {
//             path: 'workbench',
//             component: '/dashboard/workbench',
//             meta: {
//               title: '工作台',
//             },
//           },
//         ],
//       },
//       {
//         path: 'settings',
//         meta: {
//           title: '设置',
//         },
//         component: '/settings',
//       },
//       {
//         path: 'nest',
//         component: () => import('#/pages/nest'),
//         meta: {
//           title: '嵌套路由',
//         },
//         defaultPath: 'nest1',
//         children: [
//           {
//             path: 'nest1',
//             component: '/nest/nest1',
//             meta: {
//               title: '菜单1',
//             },
//           },
//           {
//             path: 'nest2',
//             component: '/nest/nest2',
//             meta: {
//               title: '菜单2',
//             },
//             defaultPath: 'nest2-1',
//             children: [
//               {
//                 path: 'nest2-1',
//                 component: '/nest/nest2/nest2-1',
//                 meta: {
//                   title: '菜单2-1',
//                 },
//               },
//               {
//                 path: 'nest2-2',
//                 component: '/nest/nest2/nest2-2',
//                 meta: {
//                   title: '菜单2-2',
//                 },
//                 defaultPath: 'nest2-2-1',
//                 children: [
//                   {
//                     path: 'nest2-2-1',
//                     component: '/nest/nest2/nest2-1/nest2-2-1',
//                     meta: {
//                       title: '菜单2-2-1',
//                     },
//                   },
//                   {
//                     path: 'nest2-2-2',
//                     component: '/nest/nest2/nest2-2/nest2-2-2',
//                     meta: {
//                       title: '菜单2-2-2',
//                     },
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//       {
//         path: 'error-page',
//         meta: {
//           title: '错误页',
//         },
//         defaultPath: '403',
//         children: [
//           {
//             path: '403',
//             component: '/noAccess',
//             meta: {
//               title: '403',
//             },
//           },
//           {
//             path: '404',
//             component: '/pages/notFound',
//             meta: {
//               title: '404',
//             },
//           },
//         ],
//       },
//     ],
//   },
// ];
type ComponentRecordType = Record<string, () => Promise<any>>;
const pageMap: ComponentRecordType = import.meta.glob('../pages/**/*.tsx');
console.warn('pageMap', pageMap);

// TODO:根据后端返回路由生成真实的前端路由
export { testFrontendRoutes };
