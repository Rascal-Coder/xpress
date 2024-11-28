import { unmountGlobalLoading } from '@xpress/utils';
import {
  type RouteLocation,
  RouterProvider,
  type RouterPublic,
} from '@xpress-core/router';

import { useEffect } from 'react';

import { routes } from './routes';

const LOGIN_PATH = '/login';

const routerOptions = {
  mode: 'history' as const,
  routes,
  scrollBehavior: () => ({ top: 0 }),
  redirect: {
    queryKey: 'redirect',
  },
  beforeEach: (
    to: RouteLocation,
    _from: RouteLocation,
    next: (to?: any) => void,
    router: RouterPublic,
  ) => {
    // 更新页面标题
    document.title = to.meta.title ? `${to.meta.title} - Xpress` : 'Xpress';

    // 权限验证
    if (to.meta.requiresAuth) {
      const token = localStorage.getItem('token');
      if (!token && to.path !== LOGIN_PATH) {
        router.redirect({
          path: LOGIN_PATH,
          query: {
            redirect: encodeURIComponent(to.fullPath),
          },
          replace: true,
        });
        return;
      }
    }

    next();
  },
  afterEach: (_to: RouteLocation) => {
    unmountGlobalLoading();
  },
};

export default function App() {
  useEffect(() => {
    unmountGlobalLoading();
  }, []);

  return <RouterProvider options={routerOptions} />;
}
