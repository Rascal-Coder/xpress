import type { XpressRouterOption } from '../types';

import process from 'node:process';

import { normalizeWindowsPath } from './path';

/**
 * create the plugin options
 *
 * @param options the plugin options
 */
export function createPluginOptions(
  options?: Partial<XpressRouterOption>,
): XpressRouterOption {
  const PAGE_DIR = 'src/@routes';
  const PAGE_PATTERNS = ['**/index.tsx', '**/[[]*[]].tsx'];
  const PAGE_EXCLUDE_PATTERNS = ['**/components/**'];
  const opts: XpressRouterOption = {
    alias: {
      '#': 'src',
    },
    cwd: process.cwd(),
    log: true,
    pageDir: PAGE_DIR,
    pageExcludePatterns: PAGE_EXCLUDE_PATTERNS,
    pagePatterns: PAGE_PATTERNS,
    ...options,
  };

  // normalize the path if it is windows
  opts.cwd = normalizeWindowsPath(opts.cwd);

  return opts;
}
