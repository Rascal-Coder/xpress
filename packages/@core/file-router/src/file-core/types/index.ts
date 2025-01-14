/**
 * 路由文件类型
 */
export type RouteFileType =
  | 'error' // 错误处理
  | 'layout' // 布局文件
  | 'loading' // 加载状态
  | 'not-found' // 404页面
  | 'page'; // 普通页面

/**
 * 路由参数类型
 */
export interface RouteParams {
  dynamic?: string[]; // 动态参数 [id]
  group?: string; // 分组名称 (group)
  optional?: string[]; // 可选参数 [[id]]
  query?: string[]; // 查询参数 $page
}

/**
 * 路由配置选项
 */
export interface XpressRouterOption {
  /**
   * 路径别名配置
   */
  alias: Record<string, string>;

  /**
   * 工作目录
   */
  cwd: string;

  /**
   * 是否启用日志
   */
  log: boolean;

  /**
   * 页面文件目录
   */
  pageDir: string;

  /**
   * 要排除的页面文件匹配模式
   */
  pageExcludePatterns: string[];

  /**
   * 页面文件的匹配模式
   */
  pagePatterns: string[];
}

/**
 * 路由文件信息
 */
export interface RouteFile {
  /**
   * 导入路径
   */
  importPath: string;

  /**
   * 路由参数信息
   */
  params: RouteParams;

  /**
   * 文件路径
   */
  path: string;

  /**
   * 路由路径
   */
  routePath: string;

  /**
   * 文件类型
   */
  type: RouteFileType;
}

/**
 * 路由树节点
 */
export interface RouteTreeNode {
  /**
   * 子节点
   */
  children?: RouteTreeNode[];

  /**
   * 路由文件信息
   */
  file?: RouteFile;

  /**
   * 分组信息
   */
  group?: string;

  /**
   * 节点名称
   */
  name: string;

  /**
   * 节点路径
   */
  path: string;
}

/**
 * 路由名称到路径的映射条目
 *
 * 每个条目是一个元组 [routeName, routePath]
 */
export type XpressRouterNamePathEntry = [string, string];

/**
 * 路由名称到路径的映射表
 */
export type XpressRouterNamePathMap = Map<string, string>;
