import { AnimatePresence } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useRoutes } from 'react-router-dom';

import router, { useRouter } from '#/router';

function App() {
  const { curRoute, reactRoutes } = useRouter(router);
  const element = useRoutes(reactRoutes);
  const logo = '/images/logo.png';
  return (
    <HelmetProvider>
      <Helmet>
        <title>{curRoute?.name}</title>
        <link data-rh="true" href={logo} rel="icon" type="image/x-icon"></link>
      </Helmet>
      <AnimatePresence mode="wait">{element}</AnimatePresence>
    </HelmetProvider>
  );
}

export default App;
