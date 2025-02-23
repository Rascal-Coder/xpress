import { usePreferencesContext } from '@xpress-core/preferences';

import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useRoutes } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';

import Progress from '#/components/Progress';
import router, { generateMenuItems, useRouter } from '#/router';

import AuthGuard from './components/AuthGuard';
import { useAccessStore } from './stores';

function App() {
  const { curRoute, reactRoutes, routes } = useRouter(router);
  const element = useRoutes(reactRoutes);
  const logo = '/images/logo.svg';
  const { isDark } = usePreferencesContext();
  const setAccessMenus = useAccessStore((state) => state.setAccessMenus);

  useEffect(() => {
    const { menuItems } = generateMenuItems(routes);
    setAccessMenus(menuItems);
  }, [routes, setAccessMenus]);

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
