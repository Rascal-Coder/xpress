import type { LayoutHeaderProps } from './types';

import { useShow } from '@xpress-core/hooks';

import { type CSSProperties, type FC, useMemo } from 'react';

const LayoutHeader: FC<LayoutHeaderProps> = ({
  fullWidth = false,
  height = 0,
  isMobile = false,
  logo,
  show = true,
  sidebarWidth = 0,
  theme,
  toggleButton,
  children,
}) => {
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

  const logoNode = useShow(!!logo, () => <div style={logoStyle}>{logo}</div>);

  return (
    <header
      className={`border-border bg-header top-0 flex w-full flex-[0_0_auto] items-center border-b transition-[margin-top] duration-200 ${
        theme || ''
      }`}
      style={style}
    >
      {logoNode}
      {toggleButton}
      {children}
    </header>
  );
};

export default LayoutHeader;
