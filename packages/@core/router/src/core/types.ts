import type { createBrowserRouter, NavigateFunction } from 'react-router-dom';

import type { RouterError } from './errors';

/* eslint-disable no-use-before-define */
import type { LocationQuery } from './query';

export type RouterMode = 'hash' | 'history' | 'memory';

export type ErrorHandler = (error: RouterError) => void;

export interface RouterPublic {
  currentRoute?: RouteLocation;
  // 公共 API
  push(to: RouteLocationRaw): Promise<void>;
  redirect: RedirectFn;
  replace(to: RouteLocationRaw): Promise<void>;
}

export interface Router extends RouterPublic {
  // 路由管理
  addRoute(route: RouteRecord, parentName?: string): void;
  afterEach(hook: NavigationHook): () => void;

  // 导航守卫
  beforeEach(guard: NavigationGuard): () => void;
  // 工具方法
  createEmptyRoute(): RouteLocation;
  createRouter(): ReturnType<typeof createBrowserRouter>;
  // 路由状态
  getOptions(): RouterOptions;
  getRoute(name: string): RouteRecord | undefined;
  getRoutes(): RouteRecord[];

  history: NavigateFunction | null;
  onError(handler: ErrorHandler): void;
  parseQuery(search: string): LocationQuery;

  // 导航方法
  resolve(to: RouteLocationRaw): Promise<RouteLocation>;
}

export interface RouteLocationRaw {
  hash?: string;
  name?: string;
  params?: Record<string, any>;
  path?: string;
  query?: LocationQuery;
}

export interface RouteLocation {
  fullPath: string;
  hash: string;
  matched: RouteRecord[];
  meta: Record<string, any>;
  name?: string;
  params: Record<string, string>;
  path: string;
  query: LocationQuery;
}

export interface RouteRecord {
  children?: RouteRecord[];
  component: React.ComponentType;
  meta?: Record<string, any>;
  name?: string;
  path: string;
}

export interface RouteLocationNormalized extends RouteLocation {}

export type NavigationGuardNext = (
  to?: (() => void) | Error | false | RouteLocationRaw,
) => void;

export type NavigationGuard = (
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext,
  router: RouterPublic,
) => Promise<void> | void;

export type NavigationHook = (to: RouteLocation, from: RouteLocation) => void;

export interface ScrollPosition {
  behavior?: ScrollBehavior;
  left?: number;
  top?: number;
}

export type ScrollBehaviorFn = (
  to: RouteLocation,
  from: RouteLocation,
) => false | ScrollPosition | undefined;

export interface RouterOptions {
  afterEach?: NavigationHook;
  base?: string;
  beforeEach?: NavigationGuard;
  mode?: 'hash' | 'history';
  redirect?: {
    queryKey?: string;
  };
  routes: RouteRecord[];
  scrollBehavior?: ScrollBehaviorFn;
}

// 重定向相关类型
export interface RedirectOptions {
  path: string;
  query?: Record<string, string>;
  replace?: boolean;
}

export type RedirectFn = (to: RedirectOptions) => void;
