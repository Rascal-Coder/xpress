export type RouteConfig = {
  /** 同react-router */
  caseSensitive?: boolean;
  /** 子路由，同react-router */
  children?: RouteConfig[];
  /** ['', 'layout', 'layout-children1', 'permission'] */
  collecttedPath?: string[];
  /** ['', '/layout', '/layout/layout-children1', '/layout/layout-children1/permission'] */
  collecttedPathname?: string[];
  /** 组件的文件地址 */
  component?: () => Promise<any>;
  /** 是否是外链 */
  external?: boolean;
  /** 将子路由的菜单层级提升到本级 */
  flatten?: boolean;
  /** 页面标题，不传则用name */
  helmet?: string;
  /** 隐藏在菜单 */
  hidden?: boolean;
  /** 菜单icon */
  icon?: React.ReactNode;
  /** 菜单名称 */
  name?: string;
  /** 父路由 */
  parent?: RouteConfig;
  /** 路径，同react-router */
  path: string;
  /** 对应react-router的pathname，所有非父路由将会有该值 */
  pathname?: string;
  /** 菜单权限 */
  permission?: string;
  /** 进度条 */
  progress?: boolean;
  /** 重定向path */
  redirect?: string;
};
