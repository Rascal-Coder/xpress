import type { RouteLocationRaw, RouteRecord } from './types';

import { RouterError, RouterErrorTypes } from './errors';

interface MatchResult {
  params: Record<string, string>;
  route: RouteRecord;
}

// interface RegexMatchResult {
//   paramNames: string[];
//   values: (string | undefined)[];
// }

export class RouteMatcher {
  private nameMap = new Map<string, RouteRecord>();
  private pathMap = new Map<string, RouteRecord>();

  constructor(routes: RouteRecord[]) {
    this.addRoutes(routes);
  }

  private generatePath(
    pattern: string,
    params: Record<string, string>,
  ): string {
    return pattern.replaceAll(/:([a-z]+)/gi, (_, key) => {
      return params[key] || `:${key}`;
    });
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

  private matchPath(path: string): MatchResult {
    const cleanPath = path.split(/[?#]/)[0] || '/';

    for (const [pattern, route] of this.pathMap.entries()) {
      const regex = new RegExp(
        `^${pattern.replaceAll(/:[a-z]+/gi, '([^/]+)').replaceAll('/', String.raw`\/`)}$`,
        'i',
      );

      const matches = cleanPath.match(regex);
      if (matches) {
        const params: Record<string, string> = {};
        const paramMatches = pattern.matchAll(/:([a-z]+)/gi);
        const paramNames = paramMatches
          ? [...paramMatches].map((m) => m[1])
          : [];
        const values = matches.slice(1);

        for (let i = 0; i < paramNames.length && i < values.length; i++) {
          const value = values[i];
          const name = paramNames[i];
          if (name && value) {
            params[name] = decodeURIComponent(value);
          }
        }

        const resolvedPath = this.generatePath(pattern, params);
        return { params, route: { ...route, path: resolvedPath } };
      }
    }

    throw new RouterError(
      RouterErrorTypes.ROUTE_NOT_FOUND,
      `Route with path "${path}" not found`,
    );
  }

  private normalizePath(path: string): string {
    return path.replaceAll(/\/+/g, '/').replace(/\/$/, '') || '/';
  }

  addRoute(route: RouteRecord, parentName?: string): void {
    const parent = parentName ? this.nameMap.get(parentName) : undefined;
    const path = this.normalizePath(
      parent ? parent.path + route.path : route.path,
    );

    const meta = parent ? { ...parent.meta, ...route.meta } : route.meta;
    const normalizedRoute = { ...route, meta, path };

    this.pathMap.set(path, normalizedRoute);
    if (route.name) {
      this.nameMap.set(route.name, normalizedRoute);
    }
  }

  addRoutes(routes: RouteRecord[], parentPath = ''): void {
    routes.forEach((route) => {
      const path = this.normalizePath(parentPath + route.path);
      const normalizedRoute = { ...route, path };

      this.pathMap.set(path, normalizedRoute);
      if (route.name) {
        this.nameMap.set(route.name, normalizedRoute);
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

  resolve(location: RouteLocationRaw): MatchResult {
    if (typeof location === 'string') {
      return this.matchPath(location);
    }

    if (location.name) {
      const route = this.matchName(location.name);
      const params = location.params ? cleanParams(location.params) : {};
      return { params, route };
    }

    const path = location.path || '/';
    const { params, route } = this.matchPath(path);

    if (location.query) {
      Object.assign(params, cleanParams(location.query));
    }

    return { params, route };
  }
}

function cleanParams(params: Record<string, any>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in params) {
    const value = params[key];
    if (value !== null) {
      result[key] = Array.isArray(value) ? value.join(',') : String(value);
    }
  }
  return result;
}
