import { Router } from '@xpress/router';

import { generateAccessRoutes } from './access';

const { accessibleRoutes } = await generateAccessRoutes(
  import.meta.env.VITE_ACCESS_MODE,
);
const router = new Router(accessibleRoutes);

export default router;

export * from '@xpress/router';
