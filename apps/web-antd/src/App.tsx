import { AuthGuard, Loading, Progress } from '@xpress/components';
import { usePreferencesContext } from '@xpress-core/preferences';

import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AliveScope } from 'react-activation';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Bounce, ToastContainer } from 'react-toastify';

import router, { useRouter, useRoutes } from '#/router';

function App() {
  const { curRoute, reactRoutes } = useRouter(router);
  const element = useRoutes(reactRoutes);

  const { isDark, preferences } = usePreferencesContext();
  // const setAccessMenus = useAccessStore((state) => state.setAccessMenus);
  const [isLoading, setIsLoading] = useState(true);
  // useEffect(() => {
  //   const { menuItems } = generateMenuItems(routes);
  //   setAccessMenus(menuItems);
  // }, [routes, setAccessMenus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (import.meta.env.VITE_SHOW_GLOBAL_LOADING && isLoading) {
    return <Loading isDark={isDark} title={preferences.app.name} />;
  }

  return (
    <AliveScope>
      <HelmetProvider>
        <Helmet>
          <title>{curRoute?.meta?.title}</title>
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
        <AuthGuard router={router}>
          <AnimatePresence mode="wait">{element}</AnimatePresence>
        </AuthGuard>
      </HelmetProvider>
    </AliveScope>
  );
}

export default App;
