import { usePreferencesContext } from '@xpress-core/preferences';

import { AnimatePresence } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import {
  useLocation,
  useNavigate,
  useRoutes,
  useSearchParams,
} from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';

import Progress from '#/components/Progress';
import router, { generateMenuItems, useRouter } from '#/router';

import useAsyncEffect from './hooks/useAsyncEffect';
import { useAccessStore, useUserStore } from './stores';

function App() {
  // const [router, setRouter] = useState<null | Router>(null);
  const { curRoute, reactRoutes, routes } = useRouter(router);
  const element = useRoutes(reactRoutes);
  const logo = '/images/logo.svg';
  const { isDark } = usePreferencesContext();
  const setAccessMenus = useAccessStore((state) => state.setAccessMenus);
  const token = useAccessStore((state) => state.accessToken);
  const userInfo = useUserStore((state) => state.userInfo);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const DEFAULT_HOME_PATH = '/home';
  const LOGIN_PATH = '/login';
  const coreRouteNames = new Set(['/login', '/register']); // 使用完整路径而不是名称

  useAsyncEffect(async () => {
    const { menuItems } = generateMenuItems(routes);
    setAccessMenus(menuItems);
    // 基本路由，这些路由不需要进入权限拦截
    if (coreRouteNames.has(location.pathname)) {
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
  ]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{curRoute?.meta?.title}</title>
        <link data-rh="true" href={logo} rel="icon" type="image/x-icon"></link>
      </Helmet>
      <Progress />
      <ToastContainer
        autoClose={500}
        closeOnClick
        draggable
        hideProgressBar={false}
        newestOnTop={false}
        pauseOnFocusLoss
        pauseOnHover
        position="top-right"
        rtl={false}
        theme={isDark ? 'dark' : 'light'}
        transition={Bounce}
      />
      <AnimatePresence mode="wait">{element}</AnimatePresence>
    </HelmetProvider>
  );
}

export default App;
