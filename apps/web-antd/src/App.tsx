import { usePreferencesContext } from '@xpress-core/preferences';

import { AnimatePresence } from 'framer-motion';

// import { AnimatePresence } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useRoutes } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';

import Progress from '#/components/Progress';
import router, { useRouter } from '#/router';

function App() {
  const { curRoute, reactRoutes } = useRouter(router);
  const element = useRoutes(reactRoutes);
  const logo = '/images/logo.svg';
  const { isDark } = usePreferencesContext();
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
