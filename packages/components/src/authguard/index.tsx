import { useAccessStore, useUserStore } from '@xpress/stores';
import { type Router, useRouter } from '@xpress-core/router';

import { type ReactNode, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

interface AuthGuardProps {
  children: ReactNode;
  router: Router;
}

const DEFAULT_HOME_PATH = '/home';
const LOGIN_PATH = '/login';
const CORE_ROUTE_NAMES = new Set(['/login', '/register']);

export function AuthGuard({ router, children }: AuthGuardProps) {
  const { curRoute } = useRouter(router);
  const token = useAccessStore((state) => state.accessToken);
  const userInfo = useUserStore((state) => state.userInfo);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 基本路由，这些路由不需要进入权限拦截
    if (CORE_ROUTE_NAMES.has(location.pathname)) {
      if (location.pathname === LOGIN_PATH && token) {
        const redirect = searchParams.get('redirect');
        const targetPath = decodeURIComponent(
          redirect || userInfo?.homePath || DEFAULT_HOME_PATH,
        );
        navigate(targetPath, { replace: true });
        return;
      }
      return;
    }

    // accessToken 检查
    if (!token) {
      // 检查路由是否忽略权限访问
      if (curRoute?.meta?.ignoreAccess) {
        return;
      }

      // 如果不在登录页且需要权限，则重定向到登录页
      if (location.pathname !== LOGIN_PATH) {
        const fullPath = location.pathname + location.search;
        const redirectPath =
          fullPath === DEFAULT_HOME_PATH
            ? LOGIN_PATH
            : `${LOGIN_PATH}?redirect=${encodeURIComponent(fullPath)}`;

        navigate(redirectPath, { replace: true });
      }
    }
  }, [
    token,
    location.pathname,
    location.search,
    curRoute?.meta?.ignoreAccess,
    searchParams,
    userInfo?.homePath,
    navigate,
  ]);

  return <>{children}</>;
}
