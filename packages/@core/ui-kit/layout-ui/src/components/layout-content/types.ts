import type { HTMLAttributes } from 'react';

type ContentCompactType = 'compact' | 'wide';
export interface LayoutContentProps extends HTMLAttributes<HTMLElement> {
  /**
   * 内容区域定宽
   */
  contentCompact: ContentCompactType;
  /**
   * 定宽布局宽度
   */
  contentCompactWidth: number;
  overlay?: React.ReactNode;
  padding: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
}
