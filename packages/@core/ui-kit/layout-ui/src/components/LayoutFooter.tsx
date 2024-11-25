import type { CSSProperties, PropsWithChildren } from 'react';

import { useMemo } from 'react';

interface Props extends PropsWithChildren {
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
export default function LayoutFooter({
  fixed,
  height,
  show = true,
  width,
  zIndex,
  children,
}: Props) {
  const style = useMemo((): CSSProperties => {
    return {
      height: `${height}px`,
      marginBottom: show ? '0' : `-${height}px`,
      position: fixed ? 'fixed' : 'static',
      width,
      zIndex,
    };
  }, [fixed, height, show, width, zIndex]);
  return (
    <footer
      className="bg-background-deep bottom-0 w-full transition-all duration-200"
      style={style}
    >
      {children}
    </footer>
  );
}
