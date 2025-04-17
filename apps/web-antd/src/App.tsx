import { AuthGuard, Progress } from '@xpress/components';
import { usePreferencesContext } from '@xpress-core/preferences';

import { AnimatePresence } from 'framer-motion';
import { AliveScope } from 'react-activation';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Bounce, ToastContainer } from 'react-toastify';

import router, { useRouter, useRoutes } from '#/router';

function App() {
  const { reactRoutes, curRoute } = useRouter(router);
  const element = useRoutes(reactRoutes);

  const { isDark, preferences } = usePreferencesContext();

  return (
    <HelmetProvider>
      <Helmet>
        <title>
          {preferences.app.dynamicTitle
            ? `${curRoute?.meta?.title} - ${preferences.app.name}`
            : preferences.app.name}
        </title>
      </Helmet>
      <AnimatePresence mode="wait">
        <AliveScope>
          {preferences.transition.progress && <Progress />}
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
          <AuthGuard router={router}>{element}</AuthGuard>
        </AliveScope>
      </AnimatePresence>
    </HelmetProvider>
  );
}

export default App;
