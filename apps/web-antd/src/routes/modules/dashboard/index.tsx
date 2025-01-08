import { createRoute } from '@tanstack/react-router';

import { rootRoute } from '../../root';
import { Analysis, Workbench } from './components';

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'analysis',
  component: Analysis,
});

const workbenchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'workbench',
  component: Workbench,
});

export const dashboardRoutes = [indexRoute, workbenchRoute];
