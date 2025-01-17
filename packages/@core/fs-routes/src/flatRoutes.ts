import type { RouteManifest, RouteManifestEntry } from './manifest';

import fs from 'node:fs';
import path from 'node:path';

import { makeRe } from 'minimatch';

import { normalizeSlashes } from './normalizeSlashes';

export const routeModuleExts = ['.js', '.jsx', '.ts', '.tsx', '.md', '.mdx'];

export const paramPrefixChar = '$' as const;
export const escapeStart = '[' as const;
export const escapeEnd = ']' as const;

export const optionalStart = '(' as const;
export const optionalEnd = ')' as const;

const PrefixLookupTrieEndSymbol = Symbol('PrefixLookupTrieEndSymbol');
type PrefixLookupNode = {
  [key: string]: PrefixLookupNode;
} & Record<typeof PrefixLookupTrieEndSymbol, boolean>;

class PrefixLookupTrie {
  root: PrefixLookupNode = {
    [PrefixLookupTrieEndSymbol]: false,
  };

  #findAndRemoveRecursive(
    values: string[],
    node: PrefixLookupNode,
    prefix: string,
    filter: (nodeValue: string) => boolean,
  ): string[] {
    for (const char of Object.keys(node)) {
      if (char !== PrefixLookupTrieEndSymbol.toString() && node[char]) {
        this.#findAndRemoveRecursive(values, node[char], prefix + char, filter);
      }
    }

    if (node[PrefixLookupTrieEndSymbol] && filter(prefix)) {
      node[PrefixLookupTrieEndSymbol] = false;
      values.push(prefix);
    }

    return values;
  }

  add(value: string) {
    if (!value) throw new Error('Cannot add empty string to PrefixLookupTrie');

    let node = this.root;
    for (const char of value) {
      if (!node[char]) {
        node[char] = {
          [PrefixLookupTrieEndSymbol]: false,
        };
      }
      node = node[char];
    }
    node[PrefixLookupTrieEndSymbol] = true;
  }

  findAndRemove(
    prefix: string,
    filter: (nodeValue: string) => boolean,
  ): string[] {
    let node = this.root;
    for (const char of prefix) {
      if (!node[char]) return [];
      node = node[char];
    }

    return this.#findAndRemoveRecursive([], node, prefix, filter);
  }
}

export function flatRoutes(
  appDirectory: string,
  ignoredFilePatterns: string[] = [],
  prefix = 'routes',
) {
  const ignoredFileRegex = [...new Set(['**/.*', ...ignoredFilePatterns])]
    .map((re) => makeRe(re))
    .filter((re: any): re is RegExp => !!re);
  const routesDir = path.join(appDirectory, prefix);

  const rootRoute = findFile(appDirectory, 'root', routeModuleExts);

  if (!rootRoute) {
    throw new Error(
      `Could not find a root route module in the app directory: ${appDirectory}`,
    );
  }

  if (!fs.existsSync(routesDir)) {
    throw new Error(
      `Could not find the routes directory: ${routesDir}. Did you forget to create it?`,
    );
  }

  // Only read the routes directory
  const entries = fs.readdirSync(routesDir, {
    encoding: 'utf8',
    withFileTypes: true,
  });

  const routes: string[] = [];
  for (const entry of entries) {
    const filepath = normalizeSlashes(path.join(routesDir, entry.name));

    let route: null | string = null;
    // If it's a directory, don't recurse into it, instead just look for a route module
    if (entry.isDirectory()) {
      route = findRouteModuleForFolder(
        appDirectory,
        filepath,
        ignoredFileRegex,
      );
    } else if (entry.isFile()) {
      route = findRouteModuleForFile(appDirectory, filepath, ignoredFileRegex);
    }

    if (route) routes.push(route);
  }

  const routeManifest = flatRoutesUniversal(appDirectory, routes, prefix);
  return routeManifest;
}

export function flatRoutesUniversal(
  appDirectory: string,
  routes: string[],
  prefix: string = 'routes',
): RouteManifest {
  const urlConflicts = new Map<string, RouteManifestEntry[]>();
  const routeManifest: RouteManifest = {};
  const prefixLookup = new PrefixLookupTrie();
  const uniqueRoutes = new Map<string, RouteManifestEntry>();
  const routeIdConflicts = new Map<string, string[]>();

  // id -> file
  const routeIds = new Map<string, string>();

  for (const file of routes) {
    const normalizedFile = normalizeSlashes(file);
    const routeExt = path.extname(normalizedFile);
    const routeDir = path.dirname(normalizedFile);
    const normalizedApp = normalizeSlashes(appDirectory);
    const routeId =
      routeDir === path.posix.join(normalizedApp, prefix)
        ? path.posix
            .relative(normalizedApp, normalizedFile)
            .slice(0, -routeExt.length)
        : path.posix.relative(normalizedApp, routeDir);

    const conflict = routeIds.get(routeId);
    if (conflict) {
      let currentConflicts = routeIdConflicts.get(routeId);
      if (!currentConflicts) {
        currentConflicts = [path.posix.relative(normalizedApp, conflict)];
      }
      currentConflicts.push(path.posix.relative(normalizedApp, normalizedFile));
      routeIdConflicts.set(routeId, currentConflicts);
      continue;
    }

    routeIds.set(routeId, normalizedFile);
  }

  const sortedRouteIds = [...routeIds].sort(([a], [b]) => b.length - a.length);

  for (const [routeId, file] of sortedRouteIds) {
    const index = routeId.endsWith('_index');
    const [segments, raw] = getRouteSegments(routeId.slice(prefix.length + 1));
    const pathname = createRoutePath(segments, raw, index);

    routeManifest[routeId] = {
      file: file.slice(appDirectory.length + 1),
      id: routeId,
      path: pathname,
    };
    if (index) routeManifest[routeId].index = true;
    const childRouteIds = prefixLookup.findAndRemove(routeId, (value) => {
      return ['.', '/'].includes(value.slice(routeId.length).charAt(0));
    });
    prefixLookup.add(routeId);

    if (childRouteIds.length > 0) {
      for (const childRouteId of childRouteIds) {
        routeManifest[childRouteId]!.parentId = routeId;
      }
    }
  }

  // path creation
  const parentChildrenMap = new Map<string, RouteManifestEntry[]>();
  for (const [routeId] of sortedRouteIds) {
    const config = routeManifest[routeId];
    if (!config?.parentId) continue;
    const existingChildren = parentChildrenMap.get(config.parentId) || [];
    existingChildren.push(config);
    parentChildrenMap.set(config.parentId, existingChildren);
  }

  for (const [routeId] of sortedRouteIds) {
    const config = routeManifest[routeId];
    const originalPathname = config?.path || '';
    let pathname = config?.path;
    const parentConfig = config?.parentId
      ? routeManifest[config.parentId]
      : null;
    if (parentConfig?.path && pathname) {
      pathname = pathname
        .slice(parentConfig.path.length)
        .replace(/^\//, '')
        .replace(/\/$/, '');
    }

    if (!config?.parentId) config!.parentId = 'root';
    config!.path = pathname || undefined;

    /**
     * We do not try to detect path collisions for pathless layout route
     * files because, by definition, they create the potential for route
     * collisions _at that level in the tree_.
     *
     * Consider example where a user may want multiple pathless layout routes
     * for different subfolders
     *
     *   routes/
     *     account.tsx
     *     account._private.tsx
     *     account._private.orders.tsx
     *     account._private.profile.tsx
     *     account._public.tsx
     *     account._public.login.tsx
     *     account._public.perks.tsx
     *
     * In order to support both a public and private layout for `/account/*`
     * URLs, we are creating a mutually exclusive set of URLs beneath 2
     * separate pathless layout routes.  In this case, the route paths for
     * both account._public.tsx and account._private.tsx is the same
     * (/account), but we're again not expecting to match at that level.
     *
     * By only ignoring this check when the final portion of the filename is
     * pathless, we will still detect path collisions such as:
     *
     *   routes/parent._pathless.foo.tsx
     *   routes/parent._pathless2.foo.tsx
     *
     * and
     *
     *   routes/parent._pathless/index.tsx
     *   routes/parent._pathless2/index.tsx
     */
    const lastRouteSegment = config!.id
      .replace(new RegExp(`^${prefix}/`), '')
      .split('.')
      .pop();
    const isPathlessLayoutRoute =
      lastRouteSegment &&
      lastRouteSegment.startsWith('_') &&
      lastRouteSegment !== '_index';
    if (isPathlessLayoutRoute) {
      continue;
    }

    const conflictRouteId = originalPathname + (config!.index ? '?index' : '');
    const conflict = uniqueRoutes.get(conflictRouteId);
    uniqueRoutes.set(conflictRouteId, config!);

    if (conflict && (originalPathname || config!.index)) {
      let currentConflicts = urlConflicts.get(originalPathname);
      if (!currentConflicts) currentConflicts = [conflict];
      currentConflicts.push(config!);
      urlConflicts.set(originalPathname, currentConflicts);
      continue;
    }
  }

  if (routeIdConflicts.size > 0) {
    for (const [routeId, files] of routeIdConflicts.entries()) {
      console.error(getRouteIdConflictErrorMessage(routeId, files));
    }
  }

  // report conflicts
  if (urlConflicts.size > 0) {
    for (const [path, routes] of urlConflicts.entries()) {
      // delete all but the first route from the manifest
      for (let i = 1; i < routes.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete routeManifest[(routes?.[i] as RouteManifestEntry).id];
      }
      const files = routes.map((r) => r.file);
      console.error(getRoutePathConflictErrorMessage(path, files));
    }
  }

  return routeManifest;
}

function findRouteModuleForFile(
  appDirectory: string,
  filepath: string,
  ignoredFileRegex: RegExp[],
): null | string {
  const relativePath = normalizeSlashes(path.relative(appDirectory, filepath));
  const isIgnored = ignoredFileRegex.some((regex) => regex.test(relativePath));
  if (isIgnored) return null;
  return filepath;
}

function findRouteModuleForFolder(
  appDirectory: string,
  filepath: string,
  ignoredFileRegex: RegExp[],
): null | string {
  const relativePath = path.relative(appDirectory, filepath);
  const isIgnored = ignoredFileRegex.some((regex) => regex.test(relativePath));
  if (isIgnored) return null;

  const routeRouteModule = findFile(filepath, 'route', routeModuleExts);
  const routeIndexModule = findFile(filepath, 'index', routeModuleExts);

  // if both a route and index module exist, throw a conflict error
  // preferring the route module over the index module
  if (routeRouteModule && routeIndexModule) {
    const [segments, raw] = getRouteSegments(
      path.relative(appDirectory, filepath),
    );
    const routePath = createRoutePath(segments, raw, false);
    console.error(
      getRoutePathConflictErrorMessage(routePath || '/', [
        routeRouteModule,
        routeIndexModule,
      ]),
    );
  }

  return routeRouteModule || routeIndexModule || null;
}

type State =
  | // normal path segment normal character concatenation until we hit a special character or the end of the segment (i.e. `/`, `.`, '\')
  'ESCAPE'
  // we hit a `[` and are now in an escape sequence until we hit a `]` - take characters literally and skip isSegmentSeparator checks
  | 'NORMAL'
  // we hit a `(` and are now in an optional segment until we hit a `)` or an escape sequence
  | 'OPTIONAL'
  // we previously were in a opt fional segment and hit a `[` and are now in an escape sequence until we hit a `]` - take characters literally and skip isSegmentSeparator checks - afterwards go back to OPTIONAL state
  | 'OPTIONAL_ESCAPE';

export function getRouteSegments(routeId: string): [string[], string[]] {
  const routeSegments: string[] = [];
  const rawRouteSegments: string[] = [];
  let index = 0;
  let routeSegment = '';
  let rawRouteSegment = '';
  let state: State = 'NORMAL';

  const pushRouteSegment = (segment: string, rawSegment: string) => {
    if (!segment) return;

    const notSupportedInRR = (segment: string, char: string) => {
      throw new Error(
        `Route segment "${segment}" for "${routeId}" cannot contain "${char}".\n` +
          `If this is something you need, upvote this proposal for React Router https://github.com/remix-run/react-router/discussions/9822.`,
      );
    };

    if (rawSegment.includes('*')) {
      return notSupportedInRR(rawSegment, '*');
    }

    if (rawSegment.includes(':')) {
      return notSupportedInRR(rawSegment, ':');
    }

    if (rawSegment.includes('/')) {
      return notSupportedInRR(segment, '/');
    }

    routeSegments.push(segment);
    rawRouteSegments.push(rawSegment);
  };

  while (index < routeId.length) {
    const char = routeId[index];
    index++; // advance to next char

    switch (state) {
      case 'ESCAPE': {
        if (char === escapeEnd) {
          state = 'NORMAL';
          rawRouteSegment += char;
          break;
        }

        routeSegment += char;
        rawRouteSegment += char;
        break;
      }
      case 'NORMAL': {
        if (isSegmentSeparator(char)) {
          pushRouteSegment(routeSegment, rawRouteSegment);
          routeSegment = '';
          rawRouteSegment = '';
          state = 'NORMAL';
          break;
        }
        if (char === escapeStart) {
          state = 'ESCAPE';
          rawRouteSegment += char;
          break;
        }
        if (char === optionalStart) {
          state = 'OPTIONAL';
          rawRouteSegment += char;
          break;
        }
        if (!routeSegment && char === paramPrefixChar) {
          if (index === routeId.length) {
            routeSegment += '*';
            rawRouteSegment += char;
          } else {
            routeSegment += ':';
            rawRouteSegment += char;
          }
          break;
        }

        routeSegment += char;
        rawRouteSegment += char;
        break;
      }
      case 'OPTIONAL': {
        if (char === optionalEnd) {
          routeSegment += '?';
          rawRouteSegment += char;
          state = 'NORMAL';
          break;
        }

        if (char === escapeStart) {
          state = 'OPTIONAL_ESCAPE';
          rawRouteSegment += char;
          break;
        }

        if (!routeSegment && char === paramPrefixChar) {
          if (index === routeId.length) {
            routeSegment += '*';
            rawRouteSegment += char;
          } else {
            routeSegment += ':';
            rawRouteSegment += char;
          }
          break;
        }

        routeSegment += char;
        rawRouteSegment += char;
        break;
      }
      case 'OPTIONAL_ESCAPE': {
        if (char === escapeEnd) {
          state = 'OPTIONAL';
          rawRouteSegment += char;
          break;
        }

        routeSegment += char;
        rawRouteSegment += char;
        break;
      }
    }
  }

  // process remaining segment
  pushRouteSegment(routeSegment, rawRouteSegment);
  return [routeSegments, rawRouteSegments];
}

export function createRoutePath(
  routeSegments: string[],
  rawRouteSegments: string[],
  isIndex?: boolean,
) {
  const result: string[] = [];

  if (isIndex) {
    routeSegments = routeSegments.slice(0, -1);
  }

  for (let [index, segment] of routeSegments.entries()) {
    const rawSegment = rawRouteSegments[index];

    // skip pathless layout segments
    if (segment.startsWith('_') && rawSegment?.startsWith('_')) {
      continue;
    }

    // remove trailing slash
    if (segment.endsWith('_') && rawSegment?.endsWith('_')) {
      segment = segment.slice(0, -1);
    }

    result.push(segment);
  }

  return result.length > 0 ? result.join('/') : undefined;
}

export function getRoutePathConflictErrorMessage(
  pathname: string,
  routes: string[],
) {
  const [taken, ...others] = routes;

  if (!pathname.startsWith('/')) {
    pathname = `/${pathname}`;
  }

  return (
    `⚠️ Route Path Collision: "${pathname}"\n\n` +
    `The following routes all define the same URL, only the first one will be used\n\n` +
    `🟢 ${taken}\n${others.map((route) => `⭕️️ ${route}`).join('\n')}\n`
  );
}

export function getRouteIdConflictErrorMessage(
  routeId: string,
  files: string[],
) {
  const [taken, ...others] = files;

  return (
    `⚠️ Route ID Collision: "${routeId}"\n\n` +
    `The following routes all define the same Route ID, only the first one will be used\n\n` +
    `🟢 ${taken}\n${others.map((route) => `⭕️️ ${route}`).join('\n')}\n`
  );
}

export function isSegmentSeparator(checkChar: string | undefined) {
  if (!checkChar) return false;
  return ['.', '/', path.win32.sep].includes(checkChar);
}

function findFile(
  dir: string,
  basename: string,
  extensions: string[],
): string | undefined {
  for (const ext of extensions) {
    const name = basename + ext;
    const file = path.join(dir, name);
    if (fs.existsSync(file)) return file;
  }

  return undefined;
}
