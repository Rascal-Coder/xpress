import type { CSSProperties, MouseEvent, ReactNode } from 'react';

export interface LayoutSidebarProps {
  /** 子组件 */
  children?: ReactNode;
  /** 折叠 */
  collapse: boolean;
  /** 折叠区域高度 */
  collapseHeight?: number;
  /** 折叠宽度 */
  collapseWidth?: number;
  /** 隐藏的dom是否可见 */
  domVisible?: boolean;
  /** 展开时是否悬停 */
  expandOnHover: boolean;
  /** 展开时是否悬停 */
  expandOnHovering: boolean;
  /** 额外内容 */
  extra?: ReactNode;
  /** 扩展区域折叠状态 */
  extraCollapse: boolean;
  /** 额外内容标题 */
  extraTitle?: ReactNode;
  /** 扩展区域可见性 */
  extraVisible: boolean;
  /** 扩展区域宽度 */
  extraWidth: number;
  /** 固定扩展区域 */
  fixedExtra?: boolean;
  /** 头部高度 */
  headerHeight: number;
  /** 是否侧边混合模式 */
  isSidebarMixed?: boolean;
  /** Logo组件 */
  logo?: ReactNode;
  /** 顶部margin */
  marginTop?: number;
  /** 混合菜单宽度 */
  mixedWidth?: number;
  /** 折叠变化 */
  onCollapseChange: (collapse: boolean) => void;
  /** 展开时是否悬停变化 */
  onExpandOnHoverChange: (expandOnHover: boolean) => void;
  /** 展开时是否悬停变化 */
  onExpandOnHoveringChange: (expandOnHovering: boolean) => void;
  /** 扩展区域折叠状态改变事件 */
  onExtraCollapseChange: (collapse: boolean) => void;
  /** 扩展区域可见性改变事件 */
  onExtraVisibleChange: (visible: boolean) => void;
  onLeave: () => void;
  /** 顶部padding */
  paddingTop?: number;
  /** 是否显示 */
  show?: boolean;
  /** 显示折叠按钮 */
  showCollapseButton?: boolean;
  /** 是否显示Logo */
  showLogo?: boolean;
  /** 主题 */
  theme: string;
  /** 宽度 */
  width: number;
  /** zIndex */
  zIndex?: number;
}

export interface StyleProps {
  extraContentStyle: CSSProperties;
  extraStyle: CSSProperties;
  extraTitleStyle: CSSProperties;
  hiddenSideStyle: CSSProperties;
  style: CSSProperties;
}

export interface EventHandlers {
  handleMouseenter: (e: MouseEvent) => void;
  handleMouseleave: () => void;
}
