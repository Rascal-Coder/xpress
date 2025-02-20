import { Router } from '@xpress-core/router';

import { testBackendRoutes } from './helper';

// const router = new Router(routesConfig);
// const router = new Router(testFrontendRoutes);
const router = new Router(testBackendRoutes);

export default router;

export * from '@xpress-core/router';
