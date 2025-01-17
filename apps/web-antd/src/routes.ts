import { flatRoutes } from '@xpress-core/fs-routes';

import { type RouteConfig } from '@react-router/dev/routes';

// 添加异步的立即执行函数来处理异步的 flatRoutes
// (async () => {
//   try {
//     const routes = await ;
//     console.log('Routes configuration:', {
//       routes,
//       timestamp: new Date().toISOString(),
//     });
//   } catch (error) {
//     console.error('Error in flatRoutes:', error);
//   }
// })();
// [
//   index('./routes/_index.tsx'),
//   layout('./routes/_layout.tsx', [
//     route('examples', './routes/(demo)/examples/route.tsx'),
//     route('about', './routes/about/route.tsx'),
//     route('analytics', './routes/(dashboard)/analytics/route.tsx'),
//        route('workbench', './routes/(dashboard)/workbench/route.tsx'),
//     ...prefix('nested1', [
//       route('nested1-1', './routes/(nested)/nested1/nested1-1/route.tsx'),
//       route('nested1-2', './routes/(nested)/nested1/nested1-2/route.tsx'),
//     ]),
//     route('nested2', './routes/(nested)/nested2/route.tsx'),
//   ]),
// ]

export default flatRoutes() satisfies RouteConfig;
