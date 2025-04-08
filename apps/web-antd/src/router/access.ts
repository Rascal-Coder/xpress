import type { ComponentType } from 'react';

import {
  type AccessModeType,
  type ComponentRecordType,
  generateAccessible,
} from '@xpress-core/router';

import { basicRoutes, routes } from './routes';

const forbiddenComponent = () => import('#/pages/noAccess');

const pageMap: ComponentRecordType = import.meta.glob<{
  default: ComponentType;
}>('../pages/**/*.tsx', { import: 'default' });

const layoutMap: ComponentRecordType = {
  BasicLayout: () => import('#/layout'),
};

const generateAccessRoutes = async (mode: AccessModeType) => {
  let _routes = [];
  _routes = mode === 'backend' ? basicRoutes : routes;
  // const router = new Router(routes);

  return await generateAccessible(mode, {
    fetchMenuListAsync: async () => {
      const res = await fetch('http://localhost:5320/api/menu/all');
      const { data } = await res.json();
      return data;
    },
    forbiddenComponent,
    layoutMap,
    pageMap,
    // router,
    routes: _routes,
  });
};

export { generateAccessRoutes };
