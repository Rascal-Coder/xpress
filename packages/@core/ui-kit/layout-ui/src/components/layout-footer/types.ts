import type { PropsWithChildren } from 'react';

export interface LayoutFooterProps extends PropsWithChildren {
  /**
   * 是否固定在底部
   */
  fixed?: boolean;
  height: number;
  /**
   * 是否显示
   * @default true
   */
  show?: boolean;
  width: string;
  zIndex: number;
}
