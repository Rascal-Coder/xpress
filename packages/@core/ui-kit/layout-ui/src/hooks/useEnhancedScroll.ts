import { useScroll } from 'ahooks';
import { useCallback, useEffect, useRef, useState } from 'react';

type Directions = 'down' | 'left' | 'none' | 'right' | 'up';

interface ScrollState {
  arrivedState: {
    bottom: boolean;
    left: boolean;
    right: boolean;
    top: boolean;
  };
  directions: Directions;
  isScrolling: boolean;
  x: number;
  y: number;
}

const SCROLL_END_DELAY = 200;

export const useEnhancedScroll = (
  target: Document | HTMLElement,
): ScrollState => {
  const position = useScroll(target);
  const [directions, setDirections] = useState<Directions>('none');
  const [isScrolling, setIsScrolling] = useState(false);
  const prevScroll = useRef<{ left: number; top: number }>({ left: 0, top: 0 });
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout>>();

  const { left = 0, top = 0 } = position || {};

  const getScrollDirection = (
    currentTop: number,
    currentLeft: number,
    prevTop: number,
    prevLeft: number,
  ): Directions => {
    if (currentTop > prevTop) return 'down';
    if (currentTop < prevTop) return 'up';
    if (currentLeft > prevLeft) return 'right';
    if (currentLeft < prevLeft) return 'left';
    return 'none';
  };

  const handleScroll = useCallback(() => {
    const currentTop = top;
    const currentLeft = left;
    const { left: prevLeft, top: prevTop } = prevScroll.current;

    const newDirection = getScrollDirection(
      currentTop,
      currentLeft,
      prevTop,
      prevLeft,
    );

    setDirections(newDirection);
    prevScroll.current = { left: currentLeft, top: currentTop };
  }, [top, left]);

  const handleScrollStart = useCallback(() => {
    setIsScrolling(true);
  }, []);

  const handleScrollEnd = useCallback(() => {
    setIsScrolling(false);
  }, []);

  useEffect(() => {
    if (!target) return;

    const scrollElement =
      target === document ? document.documentElement : (target as HTMLElement);

    const debouncedScrollEnd = () => {
      if (scrollEndTimer.current) {
        clearTimeout(scrollEndTimer.current);
      }
      scrollEndTimer.current = setTimeout(handleScrollEnd, SCROLL_END_DELAY);
    };

    scrollElement.addEventListener('scroll', handleScroll);
    scrollElement.addEventListener('scroll', handleScrollStart);
    scrollElement.addEventListener('scroll', debouncedScrollEnd);

    return () => {
      if (scrollEndTimer.current) {
        clearTimeout(scrollEndTimer.current);
      }
      scrollElement.removeEventListener('scroll', handleScroll);
      scrollElement.removeEventListener('scroll', handleScrollStart);
      scrollElement.removeEventListener('scroll', debouncedScrollEnd);
    };
  }, [target, handleScroll, handleScrollStart, handleScrollEnd]);

  const arrivedState = {
    bottom:
      target instanceof HTMLElement
        ? Math.abs(top + target.clientHeight - target.scrollHeight) < 1
        : false,
    left: left === 0,
    right:
      target instanceof HTMLElement
        ? Math.abs(left + target.clientWidth - target.scrollWidth) < 1
        : false,
    top: top === 0,
  };

  return {
    arrivedState,
    directions,
    isScrolling,
    x: left,
    y: top,
  };
};
