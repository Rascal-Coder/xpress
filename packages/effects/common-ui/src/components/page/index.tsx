import type { CSSProperties, ReactNode } from 'react';

import type { PageProps } from './types';

import { CSS_VARIABLE_LAYOUT_CONTENT_HEIGHT } from '@xpress-core/shared/constants';
import { cn } from '@xpress-core/shared/utils';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const XpressPage = ({
  title,
  description,
  contentClass,
  autoContentHeight = false,
  headerClass,
  footerClass,
  children,
  headerExtra,
  headerTitle,
  headerDescription,
  footer,
}: {
  children?: ReactNode;
  footer?: ReactNode;
  headerDescription?: ReactNode;
  headerExtra?: ReactNode;
  headerTitle?: ReactNode;
} & PageProps) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [shouldAutoHeight, setShouldAutoHeight] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const contentStyle = useMemo((): CSSProperties => {
    if (autoContentHeight) {
      return {
        height: `calc(var(${CSS_VARIABLE_LAYOUT_CONTENT_HEIGHT}) - ${headerHeight}px)`,
        overflowY: shouldAutoHeight ? 'auto' : ('unset' as 'auto' | 'unset'),
      };
    }
    return {};
  }, [autoContentHeight, headerHeight, shouldAutoHeight]);

  const calcContentHeight = useCallback(async () => {
    if (!autoContentHeight) {
      return;
    }
    setHeaderHeight(headerRef.current?.offsetHeight || 0);

    setTimeout(() => {
      setShouldAutoHeight(true);
    }, 30);
  }, [autoContentHeight]);

  useEffect(() => {
    calcContentHeight();
  }, [autoContentHeight, calcContentHeight]);

  const showHeader =
    description || headerDescription || title || headerTitle || headerExtra;

  return (
    <div className="relative">
      {showHeader && (
        <div
          className={cn(
            'bg-card border-border relative flex items-end border-b px-6 py-4',
            headerClass,
          )}
          ref={headerRef}
        >
          <div className="flex-auto">
            {headerTitle ||
              (title && (
                <div className="mb-2 flex text-lg font-semibold">{title}</div>
              ))}

            {headerDescription ||
              (description && (
                <p className="text-muted-foreground">{description}</p>
              ))}
          </div>

          {headerExtra && <div>{headerExtra}</div>}
        </div>
      )}

      <div className={cn('p-4', contentClass)} style={contentStyle}>
        {children}
      </div>

      {footer && (
        <div
          className={cn(
            'bg-card align-center absolute bottom-0 left-0 right-0 flex px-6 py-4',
            footerClass,
          )}
          ref={footerRef}
        >
          {footer}
        </div>
      )}
    </div>
  );
};
