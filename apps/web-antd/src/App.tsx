import type { MenuRecordRaw } from '@xpress-core/typings';

import { BasicLayout } from '@xpress/layouts';

import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  RouterProvider,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { lazy, memo } from 'react';

import Layout from './layout';

// 懒加载组件
const Analysis = lazy(() => import('./pages/Analysis'));
const Workbench = lazy(() => import('./pages/Workbench'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

// 定义菜单数据
const menus: MenuRecordRaw[] = [
  {
    name: '仪表盘',
    path: '/',
    children: [
      {
        name: '分析页',
        path: '/analysis',
      },
      {
        name: '工作台',
        path: '/workbench',
        badge: '新',
        badgeType: 'normal',
        badgeVariants: 'primary',
      },
    ],
  },
  {
    name: '系统设置',
    path: '/settings',
  },
];

const LayoutWrapper = memo(({ children }: { children: React.ReactNode }) => (
  <BasicLayout content={children} sidebarMenus={menus} />
));
LayoutWrapper.displayName = 'LayoutWrapper';

// 定义根路由
const rootRoute = createRootRoute({
  component: () => <Layout menus={menus} />,
  notFoundComponent: () => <NotFound />,
});

// 定义索引路由
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({
      to: '/analysis',
    });
  },
});

// 定义子路由
const analysisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'analysis',
  component: Analysis,
});

const workbenchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'workbench',
  component: Workbench,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'settings',
  component: Settings,
});

// 创建路由树
const routeTree = rootRoute.addChildren([
  indexRoute,
  analysisRoute,
  workbenchRoute,
  settingsRoute,
]);

// 创建路由器
const router = createRouter({ routeTree });

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <TanStackRouterDevtools position="bottom-right" router={router} />
    </>
  );
}

export default App;
