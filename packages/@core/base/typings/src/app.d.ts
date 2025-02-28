type LayoutType =
  | 'full-content'
  | 'header-mixed-nav'
  | 'header-nav'
  | 'mixed-nav'
  | 'sidebar-mixed-nav'
  | 'sidebar-nav';

type ThemeModeType = 'auto' | 'dark' | 'light';

/**
 * 偏好设置按钮位置
 * fixed 固定在右侧
 * header 顶栏
 * auto 自动
 */
type PreferencesButtonPositionType = 'auto' | 'fixed' | 'header';

type BuiltinThemeType =
  | 'custom'
  | 'deep-blue'
  | 'deep-green'
  | 'default'
  | 'gray'
  | 'green'
  | 'neutral'
  | 'orange'
  | 'pink'
  | 'red'
  | 'rose'
  | 'sky-blue'
  | 'slate'
  | 'stone'
  | 'violet'
  | 'yellow'
  | 'zinc'
  | (Record<never, never> & string);

type ContentCompactType = 'compact' | 'wide';

type LayoutHeaderModeType = 'auto' | 'auto-scroll' | 'fixed' | 'static';

/**
 * 登录过期模式
 * modal 弹窗模式
 * page 页面模式
 */
type LoginExpiredModeType = 'modal' | 'page';

/**
 * 面包屑样式
 * background 背景
 * normal 默认
 */
type BreadcrumbStyleType = 'background' | 'normal';

/**
 * 权限模式
 * backend 后端权限模式
 * frontend 前端权限模式
 */
type AccessModeType = 'backend' | 'frontend';

/**
 * 导航风格
 * plain 朴素
 * rounded 圆润
 */
type NavigationStyleType = 'plain' | 'rounded';

/**
 * 标签栏风格
 * brisk 轻快
 * card 卡片
 * chrome 谷歌
 * plain 朴素
 */
type TabsStyleType = 'brisk' | 'card' | 'chrome' | 'plain';

/**
 * 页面切换动画
 */
type PageTransitionType = 'fade' | 'fade-down' | 'fade-slide' | 'fade-up';

/**
 * 页面切换动画
 * panel-center 居中布局
 * panel-left 居左布局
 * panel-right 居右布局
 */
type AuthPageLayoutType = 'panel-center' | 'panel-left' | 'panel-right';

interface UseLayoutResult {
  currentLayout: LayoutType;
  isFullContent: boolean;
  isHeaderMixedNav: boolean;
  isHeaderNav: boolean;
  isMixedNav: boolean;
  isSidebarMixedNav: boolean;
}

interface XpressLayoutProps {
  /**
   * 内容区域定宽
   * @default 'wide'
   */
  contentCompact?: ContentCompactType;
  /**
   * 定宽布局宽度
   * @default 1200
   */
  contentCompactWidth?: number;
  /**
   * padding
   * @default 16
   */
  contentPadding?: number;
  /**
   * paddingBottom
   * @default 16
   */
  contentPaddingBottom?: number;
  /**
   * paddingLeft
   * @default 16
   */
  contentPaddingLeft?: number;
  /**
   * paddingRight
   * @default 16
   */
  contentPaddingRight?: number;
  /**
   * paddingTop
   * @default 16
   */
  contentPaddingTop?: number;
  /**
   * footer 是否可见
   * @default false
   */
  footerEnable?: boolean;
  /**
   * footer 是否固定
   * @default true
   */
  footerFixed?: boolean;
  /**
   * footer 高度
   * @default 32
   */
  footerHeight?: number;

  /**
   * header高度
   * @default 48
   */
  headerHeight?: number;
  /**
   * 顶栏是否隐藏
   * @default false
   */
  headerHidden?: boolean;
  /**
   * header 显示模式
   * @default 'fixed'
   */
  headerMode?: LayoutHeaderModeType;
  /**
   * header 顶栏主题
   */
  headerTheme?: ThemeModeType;
  /**
   * 是否显示header切换侧边栏按钮
   * @default
   */
  headerToggleSidebarButton?: boolean;
  /**
   * header是否显示
   * @default true
   */
  headerVisible?: boolean;
  /**
   * 是否移动端显示
   * @default false
   */
  isMobile?: boolean;
  /**
   * 布局方式
   * sidebar-nav 侧边菜单布局
   * header-nav 顶部菜单布局
   * mixed-nav 侧边&顶部菜单布局
   * sidebar-mixed-nav 侧边混合菜单布局
   * full-content 全屏内容布局
   * @default sidebar-nav
   */
  layout?: LayoutType;
  /**
   * 侧边菜单折叠状态
   * @default false
   */
  sidebarCollapse?: boolean;
  /**
   * 侧边菜单是否折叠时，是否显示title
   * @default true
   */
  sidebarCollapseShowTitle?: boolean;
  /**
   * 侧边栏是否可见
   * @default true
   */
  sidebarEnable?: boolean;
  /**
   * 侧边菜单折叠额外宽度
   * @default 48
   */
  sidebarExtraCollapsedWidth?: number;
  /**
   * 侧边栏是否隐藏
   * @default false
   */
  sidebarHidden?: boolean;
  /**
   * 混合侧边栏宽度
   * @default 80
   */
  sidebarMixedWidth?: number;
  /**
   * 侧边栏
   * @default dark
   */
  sidebarTheme?: ThemeModeType;
  /**
   * 侧边栏宽度
   * @default 210
   */
  sidebarWidth?: number;
  /**
   *  侧边菜单折叠宽度
   * @default 48
   */
  sideCollapseWidth?: number;
  /**
   * tab是否可见
   * @default true
   */
  tabbarEnable?: boolean;
  /**
   * tab高度
   * @default 30
   */
  tabbarHeight?: number;
  /**
   * zIndex
   * @default 100
   */
  zIndex?: number;
}
export type {
  AccessModeType,
  AuthPageLayoutType,
  BreadcrumbStyleType,
  BuiltinThemeType,
  ContentCompactType,
  LayoutHeaderModeType,
  LayoutType,
  LoginExpiredModeType,
  NavigationStyleType,
  PageTransitionType,
  PreferencesButtonPositionType,
  TabsStyleType,
  ThemeModeType,
  UseLayoutResult,
  XpressLayoutProps as BaseXpressLayoutProps,
};
