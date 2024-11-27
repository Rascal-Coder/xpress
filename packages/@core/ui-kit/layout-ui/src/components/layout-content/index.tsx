import type { LayoutContentProps } from './types';

import { useLayoutContentStyle } from '@xpress-core/hooks';
import { Slot } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import { type CSSProperties, type FC, useMemo } from 'react';

const LayoutContent: FC<LayoutContentProps> = ({
  className,
  contentCompact,
  contentCompactWidth,
  overlay,
  padding,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingTop,
  style,
  children,
  ...rest
}) => {
  const { contentElementRef, overlayStyle } = useLayoutContentStyle();

  const baseStyle = useMemo((): CSSProperties => {
    const compactStyle: CSSProperties =
      contentCompact === 'compact'
        ? { margin: '0 auto', width: `${contentCompactWidth}px` }
        : {};
    return {
      ...compactStyle,
      flex: 1,
      padding: `${padding}px`,
      paddingBottom: `${paddingBottom}px`,
      paddingLeft: `${paddingLeft}px`,
      paddingRight: `${paddingRight}px`,
      paddingTop: `${paddingTop}px`,
      // ...style,
    };
  }, [
    contentCompact,
    contentCompactWidth,
    padding,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
    // style,
  ]);
  const mergedStyle = useMemo(
    () => ({
      ...baseStyle,
      ...style,
    }),
    [baseStyle, style],
  );

  return (
    <>
      <main
        className={cn('bg-background-deep relative', className)}
        ref={contentElementRef}
        style={mergedStyle}
        {...rest}
      >
        <Slot style={overlayStyle}>{overlay}</Slot>
        {children}
      </main>
    </>
  );
};

export default LayoutContent;
