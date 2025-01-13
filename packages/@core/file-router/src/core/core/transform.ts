import type {
  ElegantRouterFile,
  ElegantRouterNamePathEntry,
  ElegantRouterNamePathMap,
  ElegantRouterOption,
  ElegantRouterTree,
} from '../types';

import path from 'node:path';

import {
  PAGE_DEGREE_SPLITTER,
  PAGE_FILE_NAME_WITH_SQUARE_BRACKETS_PATTERN,
  PATH_SPLITTER,
} from '../constants';
import { getFullPathOfPageGlob } from './path';

/**
 * transform the page glob to the router file
 *
 * @param glob
 * @param options
 */
export function transformPageGlobToRouterFile(
  glob: string,
  options: ElegantRouterOption,
) {
  const { alias, cwd, pageDir, routeNameTransformer } = options;

  // 1. get path info
  const fullPath = getFullPathOfPageGlob(glob, pageDir, cwd);

  let importPath = path.posix.join(pageDir, glob);

  const aliasEntries = Object.entries(alias);

  aliasEntries.some((item) => {
    const [a, dir] = item;
    const match = importPath.startsWith(dir);

    if (match) {
      importPath = importPath.replace(dir, a);
    }
    return match;
  });

  // 2. get route info
  const dirAndFile = glob.split(PATH_SPLITTER).reverse();
  const [file = '', ...dirs] = dirAndFile;

  const filteredDirs = dirs
    .filter((dir) => !dir.startsWith(PAGE_DEGREE_SPLITTER))
    .reverse();

  const routeName = routeNameTransformer(
    filteredDirs.join(PAGE_DEGREE_SPLITTER).toLocaleLowerCase(),
  );
  let routePath = transformRouterNameToPath(routeName);

  let routeParamKey = '';

  if (PAGE_FILE_NAME_WITH_SQUARE_BRACKETS_PATTERN.test(file)) {
    const [fileName = ''] = file.split('.');
    routeParamKey = fileName.replaceAll(/\[|\]/g, '');
    routePath = `${routePath}/:${routeParamKey}`;
  }

  const item: ElegantRouterFile = {
    fullPath,
    glob,
    importPath,
    routeName,
    routeParamKey,
    routePath: options.routePathTransformer(routeName, routePath),
  };

  return item;
}

/**
 * transform the router files to the router maps (name -> path)
 *
 * @param files
 * @param options
 */
export function transformRouterFilesToMaps(
  files: ElegantRouterFile[],
  options: ElegantRouterOption,
) {
  const maps: ElegantRouterNamePathMap = new Map<string, string>();

  files.forEach((file) => {
    const { routeName, routePath } = file;

    const names = splitRouterName(routeName);

    names.forEach((name) => {
      if (!maps.has(name)) {
        const isSameName = name === routeName;

        const itemRouteName = isSameName
          ? name
          : options.routeNameTransformer(name);
        const itemRoutePath = isSameName
          ? routePath
          : options.routePathTransformer(
              itemRouteName,
              transformRouterNameToPath(itemRouteName),
            );

        maps.set(itemRouteName, itemRoutePath);
      }
    });
  });

  return maps;
}

/**
 * transform the router files to the router entries (name -> path)
 *
 * @param maps
 */
export function transformRouterMapsToEntries(maps: ElegantRouterNamePathMap) {
  const entries: ElegantRouterNamePathEntry[] = [];

  maps.forEach((routePath, routeName) => {
    entries.push([routeName, routePath]);
  });

  return entries.sort((a, b) => a[0].localeCompare(b[0]));
}

/**
 * transform the router entries to the router trees
 *
 * @param entries
 * @param options
 */
export function transformRouterEntriesToTrees(
  entries: ElegantRouterNamePathEntry[],
  maps: ElegantRouterNamePathMap,
) {
  const treeWithClassify = new Map<string, string[][]>();

  entries.forEach(([routeName]) => {
    const isFirstLevel = !routeName.includes(PAGE_DEGREE_SPLITTER);

    if (isFirstLevel) {
      treeWithClassify.set(routeName, []);
    } else {
      const names = routeName.split(PAGE_DEGREE_SPLITTER);
      const firstLevelName = names[0] ?? '';
      if (!firstLevelName) return;

      const levels = names.length;

      const currentLevelChildren = treeWithClassify.get(firstLevelName) || [];

      const child = currentLevelChildren[levels - 2] || [];

      child.push(routeName);

      currentLevelChildren[levels - 2] = child;

      treeWithClassify.set(firstLevelName, currentLevelChildren);
    }
  });

  const trees: ElegantRouterTree[] = [];

  treeWithClassify.forEach((children, key) => {
    const firstLevelRoute: ElegantRouterTree = {
      routeName: key,
      routePath: maps.get(key) ?? '',
    };

    const treeChildren = recursiveGetRouteTreeChildren(key, children, maps);

    if (treeChildren.length > 0) {
      firstLevelRoute.children = treeChildren;
    }

    trees.push(firstLevelRoute);
  });

  return trees;
}

/**
 * recursive get the route tree children
 *
 * @param parentName
 * @param children
 * @param maps
 */
function recursiveGetRouteTreeChildren(
  parentName: string,
  children: string[][],
  maps: ElegantRouterNamePathMap,
) {
  if (children.length === 0) {
    return [];
  }

  const [current = [], ...rest] = children;

  const currentChildren = current.filter((name) => name.startsWith(parentName));

  const trees = currentChildren.map((name) => {
    const tree: ElegantRouterTree = {
      routeName: name,
      routePath: maps.get(name) ?? '',
    };

    const nextChildren = recursiveGetRouteTreeChildren(name, rest, maps);

    if (nextChildren.length > 0) {
      tree.children = nextChildren;
    }
    return tree;
  });

  return trees;
}

/**
 * split the router name
 *
 * @example
 *   a_b_c => ['a', 'a_b', 'a_b_c'];
 *
 * @param name
 */
export function splitRouterName(name: string) {
  const names = name.split(PAGE_DEGREE_SPLITTER);
  const result: string[] = [];

  for (const cur of names) {
    const last = result[result.length - 1];
    const next = last ? `${last}${PAGE_DEGREE_SPLITTER}${cur}` : cur;
    result.push(next);
  }

  return result;
}

/**
 * transform the router name to the router path
 *
 * @example
 *   a_b_c => '/a/b/c';
 *
 * @param name
 */
export function transformRouterNameToPath(name: string) {
  const nameList = name.split(PAGE_DEGREE_SPLITTER);
  const routePath = nameList.at(-1) ?? '';

  return nameList.length > 1 ? routePath : PATH_SPLITTER + routePath;
}
