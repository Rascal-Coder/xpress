import type { BaseXpressLayoutProps } from '@xpress-core/typings';
import type { ReactNode } from 'react';

interface LayoutComponents {
  logo?: ReactNode;
  menu?: ReactNode;
  mixedMenu?: ReactNode;
  sideExtra?: ReactNode;
  sideExtraTitle?: ReactNode;
}

interface LayoutSlots {
  content?: ReactNode;
  'content-overlay'?: ReactNode;
  extra?: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
  tabbar?: ReactNode;
}

interface XpressLayoutProps extends BaseXpressLayoutProps, LayoutComponents {
  components?: LayoutSlots;
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
  /** Optional mouse leave handler for sidebar */
  onSideMouseLeave?: () => void;

  /** 切换侧边栏事件 */
  onToggleSidebar: () => void;
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

export type { LayoutComponents, LayoutSlots, XpressLayoutProps };
