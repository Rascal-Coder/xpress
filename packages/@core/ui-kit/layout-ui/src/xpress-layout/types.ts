import type { XpressLayoutProps } from '../types';

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
interface Props extends XpressLayoutProps, LayoutComponents {
  children?: LayoutSlots;
  /** 侧边栏鼠标离开事件 */
  onSideMouseLeave: () => void;
  /** 切换侧边栏事件 */
  onToggleSidebar: () => void;
}

export type { LayoutComponents, LayoutSlots, Props };
