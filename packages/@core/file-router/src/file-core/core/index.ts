import type { FSWatcher } from 'chokidar';

import type {
  XpressRouterNamePathEntry,
  XpressRouterNamePathMap,
  XpressRouterOption,
  XpressRouterTree,
} from '../types';

import micromatch from 'micromatch';

import { getGlobs } from '../shared/glob';
import { createPluginOptions } from './options';
import { getFullPathOfPageGlob } from './path';
import { handleValidatePageGlob } from './validate';
import { setupWatcher } from './watcher';
/**
 * 优雅路由核心类
 *
 * 负责处理文件系统路由的核心逻辑，包括：
 * - 文件系统扫描
 * - 路由信息解析
 * - 路由树构建
 * - 文件监听
 *
 * @example
 * ```ts
 * const router = new ElegantRouter({
 *   pageDir: 'src/pages',
 *   pagePatterns: ['**‍/index.tsx']
 * });
 *
 * // 开始监听文件变化
 * router.setupFSWatcher(() => {
 *   console.log('路由已更新');
 * });
 * ```
 */
export default class XpressRouter {
  /**
   * 路由名称和路径的映射条目数组
   *
   * 每个条目是一个元组 [routeName, routePath]
   * 按照路由名称排序
   */
  entries: XpressRouterNamePathEntry[] = [];

  /**
   * 路由文件信息数组
   *
   * 包含每个路由文件的详细信息：
   * - 完整路径
   * - 导入路径
   * - 路由名称
   * - 路由参数
   */
  files: string[] = [];

  /**
   * 文件系统监听器实例
   *
   * 用于监听页面文件的变化
   * 当文件发生变化时，会触发路由重新生成
   */
  fsWatcher?: FSWatcher;

  /**
   * 路由名称到路径的映射表
   *
   * 用于快速查找路由路径
   * key: 路由名称
   * value: 路由路径
   */
  maps: XpressRouterNamePathMap = new Map<string, string>();

  /**
   * 插件配置选项
   *
   * 包含所有的路由配置信息
   */
  options: XpressRouterOption;

  /**
   * 页面文件的 glob 匹配模式数组
   *
   * 存储所有匹配到的页面文件路径
   */
  pageGlobs: string[] = [];

  /**
   * 路由树数组
   *
   * 按照路由层级组织的树形结构
   * 用于生成嵌套路由配置
   */
  trees: XpressRouterTree[] = [];

  /**
   * 创建路由实例
   *
   * @param options - 路由配置选项
   */
  constructor(options: Partial<XpressRouterOption> = {}) {
    this.options = createPluginOptions(options);
    this.scanPages();
  }

  /**
   * 过滤有效的页面 glob 模式
   *
   * @param globs - 要过滤的 glob 模式数组
   * @param needMatch - 是否需要匹配页面模式
   * @returns 过滤后的有效 glob 模式数组
   */
  filterValidPageGlobs(globs: string[], needMatch = false) {
    const { cwd, pageDir } = this.options;

    return globs.filter((glob) => {
      const fullGlob = getFullPathOfPageGlob(glob, pageDir, cwd);

      const isValid = handleValidatePageGlob(glob, fullGlob);

      const isMatch = !needMatch || this.isMatchPageGlob(glob);

      return isValid && isMatch;
    });
  }

  /**
   * 获取有效的页面 glob 模式
   *
   * 根据配置的页面模式和排除模式，获取所有匹配的页面文件
   */
  getPageGlobs() {
    const { pageDir, pageExcludePatterns, pagePatterns } = this.options;

    const globs = getGlobs(pagePatterns, pageExcludePatterns, pageDir);

    this.pageGlobs = this.filterValidPageGlobs(globs);
  }

  /**
   * 获取路由上下文属性
   *
   * 依次执行以下转换：
   * 1. glob 模式 -> 路由文件信息
   * 2. 路由文件信息 -> 路由映射表
   * 3. 路由映射表 -> 路由条目数组
   * 4. 路由条目数组 -> 路由树
   */
  getRouterContextProps() {
    this.files = this.pageGlobs.map(
      (glob) => {
        // console.log('glob', glob);
        return glob;
      },
      // transformPageGlobToRouterFile(glob, this.options),
    );
    // this.maps = transformRouterFilesToMaps(this.files, this.options);
    // this.entries = transformRouterMapsToEntries(this.maps);
    // this.trees = transformRouterEntriesToTrees(this.entries, this.maps);
  }

  /**
   * 根据 glob 模式获取路由文件信息
   *
   * @param glob - glob 模式
   * @returns 路由文件信息对象
   */
  // getRouterFileByGlob(glob: string) {
  //   return transformPageGlobToRouterFile(glob, this.options);
  // }

  /**
   * 检查 glob 模式是否匹配页面模式
   *
   * @param glob - 要检查的 glob 模式
   * @returns 是否匹配
   */
  isMatchPageGlob(glob: string) {
    const { pageExcludePatterns, pagePatterns } = this.options;

    return micromatch.isMatch(glob, pagePatterns, {
      ignore: pageExcludePatterns,
    });
  }

  /**
   * 扫描页面文件
   *
   * 获取所有页面文件并更新路由信息
   */
  scanPages() {
    this.getPageGlobs();
    // this.getRouterContextProps();
  }

  /**
   * 设置文件系统监听器
   *
   * @param afterChange - 文件变化后的回调函数
   * @param beforeChange - 文件变化前的回调函数
   *
   * @example
   * ```ts
   * router.setupFSWatcher(
   *   () => console.log('路由更新完成'),
   *   () => console.log('开始更新路由')
   * );
   * ```
   */
  setupFSWatcher(afterChange: () => void, beforeChange?: () => void) {
    const { pageDir, pageExcludePatterns } = this.options;
    this.fsWatcher = setupWatcher(
      pageDir,
      pageExcludePatterns,
      (globs) => {
        const updateGlobs = this.filterValidPageGlobs(globs, true);
        const needUpdate = updateGlobs.length > 0;
        if (needUpdate) {
          beforeChange?.();
          this.scanPages();
          afterChange();
        }
      },
      this.options.log,
    );
  }

  /**
   * 停止文件系统监听器
   *
   * 清理监听器资源
   */
  stopFSWatcher() {
    this.fsWatcher?.close();
  }
}
