import type { RouteConfigEntry } from '@react-router/dev/routes';

export interface RouteManifestEntry {
  caseSensitive?: boolean;
  file: string;
  id: string;
  index?: boolean;
  parentId?: string;
  path?: string;
}

export interface RouteManifest {
  [routeId: string]: RouteManifestEntry;
}

export function routeManifestToRouteConfig(
  routeManifest: RouteManifest,
  rootId = 'root',
): RouteConfigEntry[] {
  const routeConfigById: {
    [id: string]: RouteConfigEntry;
  } = {};

  for (const id in routeManifest) {
    const route = routeManifest[id];
    if (!route) continue;
    routeConfigById[id] = {
      caseSensitive: route.caseSensitive,
      file: route.file,
      id: route.id,
      index: route.index,
      path: route.path,
    };
  }

  const routeConfig: RouteConfigEntry[] = [];

  for (const id in routeConfigById) {
    const route = routeConfigById[id];
    if (!route || !route.id) continue;
    const parentId = routeManifest[route.id]?.parentId;
    if (parentId === rootId) {
      routeConfig.push(route);
    } else {
      const parentRoute = parentId && routeConfigById[parentId];
      if (parentRoute) {
        parentRoute.children = parentRoute.children || [];
        parentRoute.children.push(route as RouteConfigEntry);
      }
    }
  }

  return routeConfig;
}
