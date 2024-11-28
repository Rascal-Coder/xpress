import { unmountGlobalLoading } from '@xpress/utils';
import { type RouteLocation, RouterProvider } from '@xpress-core/router';

import { useEffect } from 'react';

import { routes } from './routes';

const routerOptions = {
  mode: 'history' as const,
  routes,
  scrollBehavior: () => ({ top: 0 }),
  beforeEach: (
    to: RouteLocation,
    _from: RouteLocation,
    next: (to?: any) => void,
  ) => {
    // 更新页面标题
    document.title = to.meta.title ? `${to.meta.title} - Xpress` : 'Xpress';
    next();
  },
};

export default function App() {
  useEffect(() => {
    unmountGlobalLoading();
  }, []);

  return (
    <RouterProvider options={routerOptions}>
      {/* <div className="min-h-screen bg-gray-100">
        <Outlet />  
      </div> */}
    </RouterProvider>
  );
}
