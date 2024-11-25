import type { CSSProperties, HTMLAttributes } from 'react';

import { Slot } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import { useMemo } from 'react';

import { useLayoutContentStyle } from '../hooks';

type ContentCompactType = 'compact' | 'wide';
interface Props extends HTMLAttributes<HTMLElement> {
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

export default function LayoutContent({
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
}: Props) {
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
    <main
      className={cn('bg-background-deep relative', className)}
      ref={contentElementRef}
      style={mergedStyle}
      {...rest}
    >
      <Slot style={overlayStyle}>{overlay}</Slot>
      {children}
    </main>
  );
}
