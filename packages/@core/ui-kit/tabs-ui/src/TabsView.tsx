import { ChevronLeft, ChevronRight } from '@xpress-core/icons';
import { XpressScrollbar } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

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
  const {
    handleScrollAt,
    handleWheel,
    scrollDirection,
    scrollIsAtLeft,
    showScrollButton,
  } = useTabsViewScroll(props);

  function onWheel(e: WheelEvent) {
    if (props.wheelable) {
      handleWheel(e);
      e.stopPropagation();
      e.preventDefault();
    }
  }

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
      >
        <XpressScrollbar
          className="h-full"
          horizontal
          onScrollAt={handleScrollAt.run}
          onWheel={onWheel}
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
          className="hover:bg-muted text-muted-foreground cursor-pointer border-l px-2"
          onClick={() => scrollDirection('right')}
        >
          <ChevronRight className="size-4 h-full" />
        </span>
      )}
    </div>
  );
}
