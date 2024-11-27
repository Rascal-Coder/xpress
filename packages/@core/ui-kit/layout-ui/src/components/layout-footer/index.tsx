import type { LayoutFooterProps } from './types';

import { type CSSProperties, type FC, useMemo } from 'react';

const LayoutFooter: FC<LayoutFooterProps> = ({
  fixed,
  height,
  show = true,
  width,
  zIndex,
  children,
}) => {
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
};

export default LayoutFooter;
