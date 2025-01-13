import type { ElegantRouterNamePathEntry } from '../core';
import type { CustomRouteConfig, ElegantReactRouterOption } from '../types';

import { splitRouterName, transformRouterNameToPath } from '../core';

/**
 * get custom route config
 *
 * @param options
 */
export function getCustomRouteConfig(
  options: ElegantReactRouterOption,
  generatedEntries: ElegantRouterNamePathEntry[],
): CustomRouteConfig {
  const { map, names } = options.customRoutes;

  const entryMap = new Map<string, string>();
  const firstLevelRouteSet = new Set<string>();
  const lastLevelRouteSet = new Set<string>();

  Object.entries(map || {}).forEach(([name, rPath]) => {
    const routeName = options.routeNameTransformer(name.toLocaleLowerCase());
    const routePath = options.routePathTransformer(routeName, rPath);

    if (!entryMap.has(routeName)) {
      entryMap.set(routeName, routePath);
    }

    if (!firstLevelRouteSet.has(routeName)) {
      firstLevelRouteSet.add(routeName);
    }

    if (!lastLevelRouteSet.has(routeName)) {
      lastLevelRouteSet.add(routeName);
    }
  });

  names?.forEach((name) => {
    const itemNames = splitRouterName(name);
    itemNames.forEach((itemName, index) => {
      const transformName = itemName.toLocaleLowerCase();
      const routeName = options.routeNameTransformer(transformName);
      const routePath = options.routePathTransformer(
        routeName,
        transformRouterNameToPath(transformName),
      );

      if (!entryMap.has(routeName)) {
        entryMap.set(routeName, routePath);
      }

      if (index === 0 && !firstLevelRouteSet.has(routeName)) {
        firstLevelRouteSet.add(routeName);
      }

      if (index === itemNames.length - 1 && !lastLevelRouteSet.has(routeName)) {
        lastLevelRouteSet.add(routeName);
      }
    });
  });

  const generatedNameSet = new Set<string>(
    generatedEntries.map(([name]) => name),
  );
  function isInGeneratedEntries(routeName: string) {
    return generatedNameSet.has(routeName);
  }

  const entries: ElegantRouterNamePathEntry[] = [...entryMap.entries()].filter(
    ([name]) => !isInGeneratedEntries(name),
  );
  const firstLevelRoutes: string[] = [...firstLevelRouteSet].filter(
    (name) => !isInGeneratedEntries(name),
  );
  const lastLevelRoutes: string[] = [...lastLevelRouteSet].filter(
    (name) => !isInGeneratedEntries(name),
  );

  return {
    entries,
    firstLevelRoutes,
    lastLevelRoutes,
  };
}
