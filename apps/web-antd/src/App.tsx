import { PreferencesProvider } from '@xpress-core/preferences';

import { AnimatePresence } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useRoutes } from 'react-router-dom';

import { overridesPreferences } from '#/preferences';
import router, { useRouter } from '#/router';

function App() {
  const { curRoute, reactRoutes } = useRouter(router);
  const element = useRoutes(reactRoutes);
  const logo = '/images/logo.png';
  const env = import.meta.env.PROD ? 'prod' : 'dev';
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const namespace = `${import.meta.env.VITE_APP_NAMESPACE}-${appVersion}-${env}`;
  return (
    <HelmetProvider>
      <Helmet>
        <title>{curRoute?.meta?.title}</title>
        <link data-rh="true" href={logo} rel="icon" type="image/x-icon"></link>
      </Helmet>
      <PreferencesProvider
        options={{ namespace, overrides: overridesPreferences }}
      >
        <AnimatePresence mode="wait">{element}</AnimatePresence>
      </PreferencesProvider>
    </HelmetProvider>
  );
}

export default App;
