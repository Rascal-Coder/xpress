import type { RouteLocationRaw, RouteRecord } from './types';

import { RouterError, RouterErrorTypes } from './errors';

export class RouteMatcher {
  private nameMap = new Map<string, RouteRecord>();
  private pathMap = new Map<string, RouteRecord>();

  constructor(routes: RouteRecord[]) {
    this.addRoutes(routes);
  }

  private matchName(name: string): RouteRecord {
    const route = this.nameMap.get(name);

    if (!route) {
      throw new RouterError(
        RouterErrorTypes.ROUTE_NOT_FOUND,
        `Route with name "${name}" not found`,
      );
    }

    return route;
  }

  private matchPath(path: string): RouteRecord {
    const normalizedPath = this.normalizePath(path);
    const route = this.pathMap.get(normalizedPath);

    if (!route) {
      throw new RouterError(
        RouterErrorTypes.ROUTE_NOT_FOUND,
        `Route with path "${path}" not found`,
      );
    }

    return route;
  }

  private normalizePath(path: string): string {
    return path.replaceAll(/\/+/g, '/').replace(/\/$/, '') || '/';
  }

  addRoute(route: RouteRecord, parentName?: string): void {
    const parent = parentName ? this.nameMap.get(parentName) : undefined;
    const path = this.normalizePath(
      parent ? parent.path + route.path : route.path,
    );

    this.pathMap.set(path, route);
    if (route.name) {
      this.nameMap.set(route.name, route);
    }
  }

  addRoutes(routes: RouteRecord[], parentPath = ''): void {
    routes.forEach((route) => {
      const path = this.normalizePath(parentPath + route.path);
      this.pathMap.set(path, route);
      if (route.name) {
        this.nameMap.set(route.name, route);
      }
      if (route.children) {
        this.addRoutes(route.children, path);
      }
    });
  }

  getRoute(name: string): RouteRecord | undefined {
    return this.nameMap.get(name);
  }

  getRoutes(): RouteRecord[] {
    return [...this.pathMap.values()];
  }

  removeRoute(name: string): void {
    const route = this.nameMap.get(name);
    if (route) {
      this.nameMap.delete(name);
      this.pathMap.delete(route.path);
    }
  }

  resolve(location: RouteLocationRaw): RouteRecord {
    if (typeof location === 'string') {
      return this.matchPath(location);
    }
    if (location.name) {
      return this.matchName(location.name);
    }
    return this.matchPath(location.path || '/');
  }
}
