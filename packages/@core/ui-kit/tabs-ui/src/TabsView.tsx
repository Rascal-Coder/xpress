import { ChevronLeft, ChevronRight } from '@xpress-core/icons';
import { XpressScrollbar } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import { useEffect, useRef } from 'react';

import { TabsBase } from './tabs-base';
import { TabsChrome } from './tabs-chrome';
import { type TabsProps } from './types';
import { useTabsViewScroll } from './use-tabs-view-scroll';

interface Props extends TabsProps {
  onClick?: (tab: Record<string, any>) => void;
  onClose?: (tab: Record<string, any>) => void;
  unpin?: (tab: Record<string, any>) => void;
}
export function TabsView(props: Props) {
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const {
    handleScrollAt,
    handleWheel,
    scrollDirection,
    scrollIsAtLeft,
    scrollIsAtRight,
    showScrollButton,
  } = useTabsViewScroll(props, scrollbarRef);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function wheelHandler(e: globalThis.WheelEvent) {
      if (props.wheelable) {
        handleWheel(e);
        e.stopPropagation();
        e.preventDefault();
      }
    }

    container.addEventListener('wheel', wheelHandler, { passive: false });
    return () => {
      container.removeEventListener('wheel', wheelHandler);
    };
  }, [props.wheelable, handleWheel]);

  return (
    <div className="flex h-full flex-1 overflow-hidden">
      {showScrollButton && (
        <span
          className={cn(
            'border-r px-2',
            !scrollIsAtLeft &&
              'hover:bg-muted text-muted-foreground cursor-pointer',
            scrollIsAtLeft && 'pointer-events-none opacity-30',
          )}
          onClick={() => scrollDirection('left')}
        >
          <ChevronLeft className="size-4 h-full" />
        </span>
      )}

      <div
        className={cn(
          'size-full flex-1 overflow-hidden',
          props.styleType === 'chrome' && 'pt-[3px]',
        )}
        ref={containerRef}
      >
        <XpressScrollbar
          className="h-full"
          horizontal
          onScrollAt={handleScrollAt.run}
          ref={scrollbarRef}
          scrollBarClass="z-10 hidden"
          shadow
          shadowBottom={false}
          shadowLeft
          shadowRight
          shadowTop={false}
        >
          {props.styleType === 'chrome' ? (
            <TabsChrome {...props} />
          ) : (
            <TabsBase {...props} />
          )}
        </XpressScrollbar>
      </div>

      {showScrollButton && (
        <span
          className={cn(
            'cursor-pointer border-l px-2',
            scrollIsAtRight && 'pointer-events-none opacity-30',
            !scrollIsAtRight && 'hover:bg-muted',
          )}
          onClick={() => scrollDirection('right')}
        >
          <ChevronRight className="size-4 h-full" />
        </span>
      )}
    </div>
  );
}
