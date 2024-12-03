import type { BaseXpressLayoutProps } from '../types';

interface LayoutComponents {
  logo?: React.ReactNode;
  menu?: React.ReactNode;
  mixedMenu?: React.ReactNode;
  sideExtra?: React.ReactNode;
  sideExtraTitle?: React.ReactNode;
}

interface LayoutSlots {
  content?: React.ReactNode;
  'content-overlay'?: React.ReactNode;
  extra?: React.ReactNode;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  tabbar?: React.ReactNode;
}

// 添加useModel相关的状态控制props
interface ModelStateProps {
  /** 侧边栏折叠状态改变回调 */
  onSidebarCollapseChange?: (collapse: boolean) => void;
  /** 侧边栏启用状态改变回调 */
  onSidebarEnableChange?: (enable: boolean) => void;

  /** 侧边栏hover展开状态改变回调 */
  onSidebarExpandOnHoverChange?: (expand: boolean) => void;
  /** 侧边栏额外内容折叠状态改变回调 */
  onSidebarExtraCollapseChange?: (collapse: boolean) => void;

  /** 侧边栏额外内容显示状态改变回调 */
  onSidebarExtraVisibleChange?: (visible: boolean) => void;
  /** 侧边栏折叠状态 */
  sidebarCollapse?: boolean;

  /** 侧边栏启用状态 */
  sidebarEnable?: boolean;
  /** 侧边栏hover展开状态 */
  sidebarExpandOnHover?: boolean;

  /** 侧边栏额外内容折叠状态 */
  sidebarExtraCollapse?: boolean;
  /** 侧边栏额外内容显示状态 */
  sidebarExtraVisible?: boolean;
}

interface XpressLayoutProps
  extends BaseXpressLayoutProps,
    LayoutComponents,
    ModelStateProps {
  children?: LayoutSlots;
  /** Optional mouse leave handler for sidebar */
  onSideMouseLeave?: () => void;
  /** 切换侧边栏事件 */
  onToggleSidebar: () => void;
}

export type { LayoutComponents, LayoutSlots, XpressLayoutProps };
