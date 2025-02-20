import type { Icon } from '@xpress-core/typings';

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
  /** 默认子路由路径，当有children时生效，会自动添加空路径重定向到该路径 */
  defaultPath?: string;
  /** 将子路由的菜单层级提升到本级 */
  flatten?: boolean;
  /** 是否是根路由 */
  isRoot?: boolean;
  meta?: {
    /**
     * 激活图标（菜单/tab）
     */
    activeIcon?: Icon;
    /**
     * 当前激活的菜单，有时候不想激活现有菜单，需要激活父级菜单时使用
     */
    activePath?: string;
    /**
     * 是否固定标签页
     * @default false
     */
    affixTab?: boolean;
    /**
     * 固定标签页的顺序
     * @default 0
     */
    affixTabOrder?: number;
    /**
     * 徽标
     */
    badge?: string;
    /**
     * 徽标类型
     */
    badgeType?: 'dot' | 'normal';
    /**
     * 徽标颜色
     */
    badgeVariants?:
      | 'default'
      | 'destructive'
      | 'primary'
      | 'success'
      | 'warning'
      | string;
    /**
     * 当前路由的子级在菜单中不展现
     * @default false
     */
    hideChildrenInMenu?: boolean;
    /**
     * 当前路由在面包屑中不展现
     * @default false
     */
    hideInBreadcrumb?: boolean;
    /**
     * 当前路由在菜单中不展现
     * @default false
     */
    hideInMenu?: boolean;
    /**
     * 当前路由在标签页不展现
     * @default false
     */
    hideInTab?: boolean;
    /** 菜单icon */
    icon?: Icon;
    /**
     * iframe 地址
     */
    iframeSrc?: string;
    /**
     * 忽略权限，直接可以访问
     * @default false
     */
    ignoreAccess?: boolean;
    /**
     * 开启KeepAlive缓存
     */
    keepAlive?: boolean;
    /**
     * 外链-跳转路径
     */
    link?: string;
    /**
     * 标签页最大打开数量
     * @default -1
     */
    maxNumOfOpenTab?: number;
    /** 菜单是否显示禁止访问的页面 */
    menuVisibleWithForbidden?: boolean;
    /**
     * 在新窗口打开
     */
    openInNewWindow?: boolean;
    /**
     * 用于路由->菜单排序
     */
    order?: number;
    /** 菜单权限 */
    permission?: string[];

    /** 进度条 */
    progress?: boolean;
    /**
     * 标题名称
     */
    title: string;
  };
  /** 父路由 */
  parentRouteConfig?: RouteConfig;
  /** 路径，同react-router */
  path: string;
  /** 对应react-router的pathname，所有非父路由将会有该值 */
  pathname?: string;
  /** 重定向path */
  redirect?: string;
};
