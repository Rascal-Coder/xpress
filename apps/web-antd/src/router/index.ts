import { Router } from '@xpress-core/router';

import { testFrontendRoutes } from './helper';

// const router = new Router(routesConfig);
const router = new Router(testFrontendRoutes);

export default router;

export * from '@xpress-core/router';
