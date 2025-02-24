import { AuthGuard, Loading, Progress } from '@xpress/components';
import { useAccessStore } from '@xpress/stores';
import { usePreferencesContext } from '@xpress-core/preferences';

import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useRoutes } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';

import router, { generateMenuItems, useRouter } from '#/router';

function App() {
  const { curRoute, reactRoutes, routes } = useRouter(router);
  const element = useRoutes(reactRoutes);
  const logo = '/images/logo.svg';
  const { isDark, preferences } = usePreferencesContext();
  const setAccessMenus = useAccessStore((state) => state.setAccessMenus);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const { menuItems } = generateMenuItems(routes);
    setAccessMenus(menuItems);
  }, [routes, setAccessMenus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (import.meta.env.VITE_SHOW_GLOBAL_LOADING && isLoading) {
    return <Loading isDark={isDark} title={preferences.app.name} />;
  }

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
      <AuthGuard router={router}>
        <AnimatePresence mode="wait">{element}</AnimatePresence>
      </AuthGuard>
    </HelmetProvider>
  );
}

export default App;
