import type {
  AccessModeType,
  GenerateMenuAndRoutesOptions,
  RouteConfig,
} from '@xpress-core/typings';

import { generateRoutesByBackend } from './generate-routes-backend';
import { generateRoutesByFrontend } from './generate-routes-frontend';

async function generateAccessible(
  mode: AccessModeType,
  options: GenerateMenuAndRoutesOptions,
) {
  const accessibleRoutes = await generateRoutes(mode, options);
  return { accessibleRoutes };
}
/**
 * Generate routes
 * @param mode
 * @param options
 */
async function generateRoutes(
  mode: AccessModeType,
  options: GenerateMenuAndRoutesOptions,
) {
  const { forbiddenComponent, roles, routes } = options;

  let resultRoutes: RouteConfig[] = routes;
  switch (mode) {
    case 'backend': {
      const dynamicRoutes = await generateRoutesByBackend(options);
      resultRoutes = [...resultRoutes, ...dynamicRoutes];
      break;
    }
    case 'frontend': {
      resultRoutes = await generateRoutesByFrontend(
        routes,
        roles || [],
        forbiddenComponent,
      );
      break;
    }
  }

  return resultRoutes;
}

export { generateAccessible };
