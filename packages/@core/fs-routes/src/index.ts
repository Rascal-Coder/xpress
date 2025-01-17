import fs from 'node:fs';
import path from 'node:path';

import {
  getAppDirectory,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

import { normalizeSlashes } from './normalizeSlashes';

function getAllFiles(dir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else {
      files.push(normalizeSlashes(fullPath));
    }
  }

  return files;
}

function convertToRouteParam(segment: string): string {
  const dynamicParamMatch = segment.match(/^\[(.+)\]$/);
  if (dynamicParamMatch) {
    return `:${dynamicParamMatch[1]}`;
  }
  return segment;
}

interface RouteInfo {
  file: string;
  groupName?: string;
  segments: string[];
}

function parseRoute(file: string): null | RouteInfo {
  const parts = file.split('/');
  const groupIndex = parts.findIndex(
    (p) => p.startsWith('(') && p.endsWith(')'),
  );

  const routesIndex = parts.indexOf('routes');
  if (routesIndex === -1) return null;

  const routeIndex = parts.indexOf('route.tsx');
  if (routeIndex === -1) return null;

  if (groupIndex === -1) {
    const segments = parts.slice(routesIndex + 1, routeIndex).filter(Boolean);
    return {
      file,
      segments,
    };
  }

  const group = parts[groupIndex];
  if (!group) return null;

  const groupName = group.slice(1, -1);
  const segments = parts.slice(groupIndex + 1, routeIndex).filter(Boolean);

  return {
    file,
    groupName,
    segments,
  };
}

function processRoutes(files: string[]) {
  const normalizedFiles = files.map((f) => f.replaceAll('\\', '/'));

  const layoutFile = normalizedFiles.find((f) => f.endsWith('/_layout.tsx'));
  const indexFile = normalizedFiles.find((f) => f.endsWith('/_index.tsx'));

  const routeFiles = normalizedFiles.filter(
    (f) =>
      !f.endsWith('/_layout.tsx') &&
      !f.endsWith('/_index.tsx') &&
      f.endsWith('/route.tsx'),
  );

  const routeGroups = new Map<string, RouteInfo[]>();
  const standaloneRoutes: RouteInfo[] = [];

  for (const file of routeFiles) {
    const routeInfo = parseRoute(file);
    if (!routeInfo) continue;

    if (routeInfo.segments.length > 1 && routeInfo.groupName) {
      const prefixKey = routeInfo.segments[0];
      if (!prefixKey) continue;

      const existingGroup = routeGroups.get(prefixKey) || [];
      routeGroups.set(prefixKey, [...existingGroup, routeInfo]);
    } else {
      standaloneRoutes.push(routeInfo);
    }
  }

  const routes = [];

  if (indexFile) {
    routes.push(index(`./${indexFile}`));
  }

  if (layoutFile) {
    const children = standaloneRoutes.map((info) => {
      const routePath = info.segments
        .map((segment) => convertToRouteParam(segment))
        .join('/');
      return route(routePath, `./${info.file}`);
    });
    for (const [prefixKey, groupRoutes] of routeGroups.entries()) {
      const prefixRoutes = groupRoutes.map((info) => {
        const segments = [...info.segments];
        segments.shift(); // 移除 prefix 部分
        const routePath = segments
          .map((segment) => convertToRouteParam(segment))
          .join('/');
        return route(routePath, `./${info.file}`);
      });
      children.push(...prefix(prefixKey, prefixRoutes));
    }

    routes.push(layout(`./${layoutFile}`, children));
  }
  // console.log('routes', JSON.stringify(routes, null, 2));

  return routes;
}

export async function flatRoutes(
  options: {
    /**
     * An array of [minimatch](https://www.npmjs.com/package/minimatch) globs that match files to ignore.
     * Defaults to `[]`.
     */
    ignoredRouteFiles?: string[];

    /**
     * The directory containing file system routes, relative to the app directory.
     * Defaults to `"./routes"`.
     */
    rootDirectory?: string;
  } = {},
): Promise<any> {
  const { rootDirectory: userRootDirectory = 'routes' } = options;
  const appDirectory = getAppDirectory();
  const rootDirectory = path.resolve(appDirectory, userRootDirectory);

  const allFiles = fs.existsSync(rootDirectory)
    ? getAllFiles(rootDirectory)
    : [];
  const _files = allFiles.map((file) => path.relative(appDirectory, file));
  const routes = processRoutes(_files);
  // console.log('routes', JSON.stringify(routes, null, 2));
  // console.log('_files', _files);

  // return {
  //   appDirectory,
  //   files: _files,
  //   ignoredRouteFiles,
  //   prefix,
  //   relativeRootDirectory,
  //   rootDirectory,
  //   routes,
  // };
  return routes;
}
