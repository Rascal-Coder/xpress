import { cn } from '@xpress-core/shared/utils';

import {
  type ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useSegmentedContext } from './index';

// import './tabs-indicator.css';

interface TabsIndicatorProps extends ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode;
  className?: string;
}

export const TabsIndicator = ({
  className,
  children,
  ...props
}: TabsIndicatorProps) => {
  const context = useSegmentedContext();
  const [indicatorStyle, setIndicatorStyle] = useState<{
    position: null | number;
    size: null | number;
  }>({
    position: null,
    size: null,
  });

  const rafRef = useRef<number>();

  const updateIndicatorStyle = useCallback(() => {
    if (!context.activeTabRef) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (!context.activeTabRef) return;

      if (context.orientation === 'horizontal') {
        setIndicatorStyle({
          position: context.activeTabRef.offsetLeft,
          size: context.activeTabRef.offsetWidth,
        });
      } else {
        setIndicatorStyle({
          position: context.activeTabRef.offsetTop,
          size: context.activeTabRef.offsetHeight,
        });
      }
    });
  }, [context.activeTabRef, context.orientation]);

  useEffect(() => {
    updateIndicatorStyle();

    const resizeObserver = new ResizeObserver(() => {
      updateIndicatorStyle();
    });

    if (context.activeTabRef) {
      resizeObserver.observe(context.activeTabRef);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [context.activeTabRef, updateIndicatorStyle]);

  return (
    <>
      {typeof indicatorStyle.size === 'number' && (
        <div
          {...props}
          className={cn(
            'absolute bottom-0 left-0 z-10 h-full w-1/2 translate-x-[--xpress-tabs-indicator-position] rounded-full px-0 py-1 pr-1 transition-[width,transform] duration-300',
            className,
          )}
          style={
            {
              '--xpress-tabs-indicator-position': `${indicatorStyle.position}px`,
              width: `${indicatorStyle.size}px`,
            } as React.CSSProperties
          }
        >
          <div className="bg-background text-foreground inline-flex h-full w-full items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            {children}
          </div>
        </div>
      )}
    </>
  );
};
