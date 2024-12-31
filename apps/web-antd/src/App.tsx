import type { MenuRecordRaw } from '@xpress-core/typings';

import { BasicLayout } from '@xpress/layouts';
import { PreferencesProvider } from '@xpress-core/preferences';

import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
  RouterProvider,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { lazy, memo, Suspense } from 'react';

// 懒加载组件
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analysis = lazy(() => import('./pages/Analysis'));
const Workbench = lazy(() => import('./pages/Workbench'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

// 定义菜单数据
const menus: MenuRecordRaw[] = [
  {
    name: '仪表盘',
    path: '/dashboard',
    icon: 'DashboardIcon',
    children: [
      {
        name: '分析页',
        path: '/dashboard/analysis',
      },
      {
        name: '工作台',
        path: '/dashboard/workbench',
        badge: '新',
        badgeType: 'normal',
        badgeVariants: 'primary',
      } as MenuRecordRaw,
    ],
  },
  {
    name: '系统设置',
    path: '/settings',
    icon: 'SettingsIcon',
  },
];

const LayoutWrapper = memo(({ children }: { children: React.ReactNode }) => (
  <BasicLayout content={children} sidebarMenus={menus} />
));
LayoutWrapper.displayName = 'LayoutWrapper';

// 定义根路由
const rootRoute = createRootRoute({
  component: () => (
    <PreferencesProvider>
      <LayoutWrapper>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </LayoutWrapper>
    </PreferencesProvider>
  ),
  notFoundComponent: () => <NotFound />,
});

// 定义索引路由
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/dashboard' });
  },
});

// 定义子路由
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'dashboard',
  component: Dashboard,
});

const analysisRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: 'analysis',
  component: Analysis,
});

const workbenchRoute = createRoute({
  getParentRoute: () => dashboardRoute,
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
  dashboardRoute.addChildren([analysisRoute, workbenchRoute]),
  settingsRoute,
]);

// 创建路由器
const router = createRouter({ routeTree });

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <TanStackRouterDevtools router={router} />
    </>
  );
}

export default App;
