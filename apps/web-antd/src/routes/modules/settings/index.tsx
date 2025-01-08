import { createRoute } from '@tanstack/react-router';

import { rootRoute } from '#/routes/root';

import { Settings } from './components';

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'settings',
  component: Settings,
});

export const settingsRoutes = [settingsRoute];
