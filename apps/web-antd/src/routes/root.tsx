import { createRootRoute } from '@tanstack/react-router';

import Layout from '../layout';
import { NotFound } from './components';
import { menus } from './menus';

export const rootRoute = createRootRoute({
  component: () => <Layout menus={menus} />,
  notFoundComponent: () => <NotFound />,
});
