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
        ? {
            marginLeft: 'auto',
            marginRight: 'auto',
            width: `${contentCompactWidth}px`,
          }
        : {};
    return {
      ...compactStyle,
      flex: 1,
      paddingBottom: `${paddingBottom ?? padding}px`,
      paddingLeft: `${paddingLeft ?? padding}px`,
      paddingRight: `${paddingRight ?? padding}px`,
      paddingTop: `${paddingTop ?? padding}px`,
      ...style,
    };
  }, [
    contentCompact,
    contentCompactWidth,
    padding,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
    style,
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
