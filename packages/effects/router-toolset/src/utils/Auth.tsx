import type { RouteMeta } from '@xpress-core/typings';

import {
  CORE_ROUTE_NAMES,
  DEFAULT_HOME_PATH,
  LOGIN_PATH,
} from '@xpress/constants';
import {
  Navigate,
  useFullPath,
  useLocation,
  useSearchParams,
} from '@xpress/router';
import { useAccessStore, useUserStore } from '@xpress/stores';

import { type ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  meta: RouteMeta;
}

export function AuthGuard({ meta, children }: AuthGuardProps) {
  const token = useAccessStore((state) => state.accessToken);
  const userInfo = useUserStore((state) => state.userInfo);
  // const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const fullPath = useFullPath();
  if (CORE_ROUTE_NAMES.has(location.pathname)) {
    if (location.pathname === LOGIN_PATH && token) {
      const redirect = searchParams.get('redirect');
      const targetPath = decodeURIComponent(
        redirect || userInfo?.homePath || DEFAULT_HOME_PATH,
      );
      // navigate(targetPath, { replace: true });
      return <Navigate replace={true} to={targetPath} />;
    }
    return <>{children}</>;
  }

  // accessToken 检查
  if (!token) {
    // 检查路由是否忽略权限访问
    if (meta?.ignoreAccess) {
      return;
    }
    // 如果不在登录页且需要权限，则重定向到登录页
    if (location.pathname !== LOGIN_PATH) {
      const redirectPath =
        fullPath === '/'
          ? `${LOGIN_PATH}?redirect=${encodeURIComponent(DEFAULT_HOME_PATH)}`
          : `${LOGIN_PATH}?redirect=${encodeURIComponent(fullPath)}`;

      return <Navigate replace={true} to={redirectPath} />;
    }
  }

  return <>{children}</>;
}
