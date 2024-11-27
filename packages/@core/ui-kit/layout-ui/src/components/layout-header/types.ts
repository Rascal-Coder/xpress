import type { ReactNode } from 'react';

export interface LayoutHeaderProps {
  /**
   * 默认插槽内容
   */
  children?: ReactNode;
  /**
   * 横屏
   */
  fullWidth?: boolean;
  /**
   * 高度
   */
  height?: number;
  /**
   * 是否移动端
   */
  isMobile?: boolean;
  /**
   * Logo 插槽内容
   */
  logo?: ReactNode;
  /**
   * 是否显示
   */
  show?: boolean;
  /**
   * 侧边菜单宽度
   */
  sidebarWidth?: number;
  /**
   * 主题
   */
  theme?: string;
  /**
   * 切换按钮插槽内容
   */
  toggleButton?: ReactNode;
}
