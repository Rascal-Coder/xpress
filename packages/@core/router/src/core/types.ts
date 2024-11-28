/* eslint-disable no-use-before-define */
import type { LocationQuery } from './query';

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
  routes: RouteRecord[];
  scrollBehavior?: ScrollBehaviorFn;
}
