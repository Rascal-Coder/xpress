import type { CSSProperties, ReactNode } from 'react';

import { useMemo } from 'react';

interface LayoutHeaderProps {
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

export default function LayoutHeader({
  fullWidth = false,
  height = 0,
  isMobile = false,
  logo,
  show = true,
  sidebarWidth = 0,
  theme,
  toggleButton,
  children,
}: LayoutHeaderProps) {
  const style = useMemo((): CSSProperties => {
    const right = !show || !fullWidth ? undefined : 0;

    return {
      height: `${height}px`,
      marginTop: show ? 0 : `-${height}px`,
      right,
    };
  }, [fullWidth, height, show]);

  const logoStyle = useMemo((): CSSProperties => {
    return {
      minWidth: `${isMobile ? 40 : sidebarWidth}px`,
    };
  }, [isMobile, sidebarWidth]);

  return (
    <header
      className={`border-border bg-header top-0 flex w-full flex-[0_0_auto] items-center border-b transition-[margin-top] duration-200 ${
        theme || ''
      }`}
      style={style}
    >
      {logo && <div style={logoStyle}>{logo}</div>}
      {toggleButton}
      {children}
    </header>
  );
}
