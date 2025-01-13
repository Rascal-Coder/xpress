import type { ElegantRouterOption } from '../types';

import process from 'node:process';

import { normalizeWindowsPath } from './path';

/**
 * create the plugin options
 *
 * @param options the plugin options
 */
export function createPluginOptions(
  options?: Partial<ElegantRouterOption>,
): ElegantRouterOption {
  const PAGE_DIR = 'src/pages';
  const PAGE_PATTERNS = ['**/index.tsx', '**/[[]*[]].tsx'];
  const PAGE_EXCLUDE_PATTERNS = ['**/components/**'];

  const opts: ElegantRouterOption = {
    alias: {
      '@': 'src',
    },
    cwd: process.cwd(),
    log: true,
    pageDir: PAGE_DIR,
    pageExcludePatterns: PAGE_EXCLUDE_PATTERNS,
    pagePatterns: PAGE_PATTERNS,
    routeNameTransformer: (name) => name,
    routePathTransformer: (_transformedName, path) => path,
    ...options,
  };

  // normalize the path if it is windows
  opts.cwd = normalizeWindowsPath(opts.cwd);

  return opts;
}
