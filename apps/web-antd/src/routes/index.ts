import type { RouteRecord } from '@xpress-core/router';

import About from '../pages/About';
import Admin from '../pages/Admin';
import Home from '../pages/Home';
import Login from '../pages/Login';

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
  {
    path: '/admin',
    component: Admin,
    meta: {
      title: '管理页面',
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    component: Login,
    meta: {
      title: '登录',
    },
  },
];
