import { Router } from '@xpress-core/router';

import { generateAccessRoutes } from './access';

// const router = new Router(routesConfig);
// const router = new Router(testFrontendRoutes);
const { accessibleRoutes } = await generateAccessRoutes('backend');
const router = new Router(accessibleRoutes);

export default router;

export * from '@xpress-core/router';
