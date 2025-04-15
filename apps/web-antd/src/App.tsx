import { AuthGuard, Progress } from '@xpress/components';
import { usePreferencesContext } from '@xpress-core/preferences';

import { AnimatePresence } from 'framer-motion';
import { AliveScope } from 'react-activation';
// import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Bounce, ToastContainer } from 'react-toastify';

import router, { useRouter, useRoutes } from '#/router';

function App() {
  const { reactRoutes } = useRouter(router);
  const element = useRoutes(reactRoutes);

  const { isDark } = usePreferencesContext();
  return (
    <AliveScope>
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
      {/* <HelmetProvider>
        <Helmet>
          <title>{curRoute?.meta?.title}</title>
        </Helmet>

      </HelmetProvider> */}
    </AliveScope>
  );
}

export default App;
