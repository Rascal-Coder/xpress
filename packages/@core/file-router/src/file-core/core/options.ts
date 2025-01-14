import type { XpressRouterOption } from '../types';

import process from 'node:process';

import { PAGE_DIR, PAGE_EXCLUDE_PATTERNS, PAGE_PATTERNS } from '../constants';
import { normalizeWindowsPath } from './path';

/**
 * 创建插件配置选项
 *
 * 该函数用于创建和初始化路由插件的配置选项。它会将用户提供的配置与默认配置进行合并，
 * 并确保所有必要的选项都被正确设置。
 *
 * @param options - 用户提供的配置选项
 * @param options.alias - 路径别名配置，用于简化导入路径
 * @param options.cwd - 项目的工作目录，默认为当前进程的工作目录
 * @param options.log - 是否启用日志输出
 * @param options.pageDir - 页面文件所在的目录
 * @param options.pageExcludePatterns - 要排除的页面文件匹配模式
 * @param options.pagePatterns - 页面文件的匹配模式
 *
 * @returns 完整的路由插件配置选项
 *
 * @example
 * ```ts
 * const options = createPluginOptions({
 *   pageDir: 'src/pages',
 *   log: false
 * });
 * ```
 */
export function createPluginOptions(
  options?: Partial<XpressRouterOption>,
): XpressRouterOption {
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
