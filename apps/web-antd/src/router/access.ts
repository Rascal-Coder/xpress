import type { ComponentType } from 'react';

import {
  type AccessModeType,
  type ComponentRecordType,
  generateAccessible,
  Router,
} from '@xpress-core/router';

import { Slide, toast } from 'react-toastify';

import { routes } from './routes';

const forbiddenComponent = () => import('#/pages/noAccess');

const pageMap: ComponentRecordType = import.meta.glob<{
  default: ComponentType;
}>('../pages/**/*.tsx', { import: 'default' });

const layoutMap: ComponentRecordType = {
  BasicLayout: () => import('#/layout'),
};
const router = new Router(routes);

const generateAccessRoutes = async (mode: AccessModeType) => {
  return await generateAccessible(mode, {
    fetchMenuListAsync: async () => {
      const res = await fetch('http://localhost:5320/api/menu/all');
      const { data } = await res.json();
      toast.info('菜单加载中...', {
        position: 'top-center',
        transition: Slide,
      });
      return data;
    },
    forbiddenComponent,
    layoutMap,
    pageMap,
    router,
    routes,
  });
};

export { generateAccessRoutes };
