import type { CSSProperties, MouseEvent, ReactNode } from 'react';

export interface LayoutSidebarProps {
  /** 子内容 */
  children?: ReactNode;
  /** 是否折叠侧边栏 */
  collapse?: boolean;
  /** 折叠按钮高度 */
  collapseHeight?: number;
  /** 折叠时的宽度 */
  collapseWidth?: number;
  /** DOM 是否可见 */
  domVisible?: boolean;
  /** 是否启用悬停展开 */
  expandOnHover?: boolean;
  /** 当前是否处于悬停展开状态 */
  expandOnHovering?: boolean;
  /** 额外内容 */
  extra?: ReactNode;
  /** 额外区域是否折叠 */
  extraCollapse?: boolean;
  /** 额外区域标题 */
  extraTitle?: ReactNode;
  /** 额外区域是否可见 */
  extraVisible?: boolean;
  /** 额外区域宽度 */
  extraWidth?: number;
  /** 是否固定额外区域 */
  fixedExtra?: boolean;
  /** 头部高度 */
  headerHeight?: number;
  /** 是否为混合侧边栏模式 */
  isSidebarMixed?: boolean;
  /** Logo 内容 */
  logo?: ReactNode;
  /** 上边距 */
  marginTop?: number;
  /** 混合模式下的宽度 */
  mixedWidth?: number;
  /** 折叠状态改变回调 */
  onCollapseChange?: (collapsed: boolean) => void;
  /** 悬停展开状态改变回调 */
  onExpandOnHoverChange?: (expanded: boolean) => void;
  /** 正在悬停展开状态改变回调 */
  onExpandOnHoveringChange?: (hovering: boolean) => void;
  /** 额外区域折叠状态改变回调 */
  onExtraCollapseChange?: (collapsed: boolean) => void;
  /** 额外区域可见性改变回调 */
  onExtraVisibleChange?: (visible: boolean) => void;
  /** 鼠标离开回调 */
  onLeave?: () => void;
  /** 上内边距 */
  paddingTop?: number;
  /** 是否显示 */
  show?: boolean;
  /** 是否显示折叠按钮 */
  showCollapseButton?: boolean;
  /** 是否显示 Logo */
  showLogo?: boolean;
  /** 主题 */
  theme?: 'auto' | 'dark' | 'light';
  /** 侧边栏宽度 */
  width?: number;
  /** z-index 层级 */
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
