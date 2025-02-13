import { AnimatePresence } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useRoutes } from 'react-router-dom';

import Progress from '#/components/Progress';
import router, { useRouter } from '#/router';

function App() {
  const { curRoute, reactRoutes } = useRouter(router);
  const element = useRoutes(reactRoutes);
  const logo = '/images/logo.svg';

  return (
    <HelmetProvider>
      <Helmet>
        <title>{curRoute?.meta?.title}</title>
        <link data-rh="true" href={logo} rel="icon" type="image/x-icon"></link>
      </Helmet>
      <Progress />
      <AnimatePresence mode="wait">{element}</AnimatePresence>
    </HelmetProvider>
  );
}

export default App;
