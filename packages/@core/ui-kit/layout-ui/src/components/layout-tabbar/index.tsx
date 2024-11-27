import type { LayoutTabbarProps } from './types';

import { cn } from '@xpress-core/shared/utils';

import { type CSSProperties, type FC, useMemo } from 'react';

const LayoutTabbar: FC<LayoutTabbarProps> = ({
  className,
  height,
  style,
  children,
}: LayoutTabbarProps) => {
  const baseStyle = useMemo((): CSSProperties => {
    return {
      height: `${height}px`,
    };
  }, [height]);

  const mergedStyle = useMemo(
    () => ({
      ...baseStyle,
      ...style,
    }),
    [baseStyle, style],
  );

  return (
    <section
      className={cn(
        'border-border bg-background flex w-full border-b transition-all',
        className,
      )}
      style={mergedStyle}
    >
      {children}
    </section>
  );
};

export default LayoutTabbar;
