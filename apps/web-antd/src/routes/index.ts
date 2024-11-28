import type { RouteRecord } from '@xpress-core/router';

import About from '../pages/About';
import Home from '../pages/Home';

export const routes: RouteRecord[] = [
  {
    path: '/',
    component: Home,
    meta: {
      title: '首页',
    },
  },
  {
    path: '/about',
    component: About,
    meta: {
      title: '关于',
    },
  },
];
