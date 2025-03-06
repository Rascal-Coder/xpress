import { useEventListener, useThrottleFn } from 'ahooks';
import { useRef, useState } from 'react';

type Direction = 'down' | 'left' | 'none' | 'right' | 'up';

const ARRIVED_STATE_THRESHOLD_PIXELS = 1;
const THROTTLE_WAIT = 16; // 约60fps的刷新率

export const useEnhancedScroll = (target: Document | HTMLElement) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isScrolling, setIsScrolling] = useState(false);
  const [direction, setDirection] = useState<Direction>('none');
  const prevPosition = useRef({ x: 0, y: 0 });
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleScroll = useThrottleFn(
    () => {
      const scrollElement =
        target === document
          ? document.documentElement
          : (target as HTMLElement);

      const x = scrollElement.scrollLeft;
      const y =
        scrollElement.scrollTop ||
        (target === document ? document.body.scrollTop : 0);

      setPosition({ x, y });

      // 计算滚动方向
      if (y > prevPosition.current.y) {
        setDirection('down');
      } else if (y < prevPosition.current.y) {
        setDirection('up');
      } else if (x > prevPosition.current.x) {
        setDirection('right');
      } else if (x < prevPosition.current.x) {
        setDirection('left');
      }
      prevPosition.current = { x, y };

      // 处理滚动状态
      setIsScrolling(true);
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
      scrollTimer.current = setTimeout(() => {
        setIsScrolling(false);
        setDirection('none');
      }, 150);
    },
    { wait: THROTTLE_WAIT },
  );

  useEventListener('scroll', handleScroll.run, { target });

  return {
    arrivedState: {
      bottom:
        Math.abs(
          position.y +
            window.innerHeight -
            document.documentElement.scrollHeight,
        ) <= ARRIVED_STATE_THRESHOLD_PIXELS,
      left: position.x === 0,
      right:
        Math.abs(
          position.x + window.innerWidth - document.documentElement.scrollWidth,
        ) <= ARRIVED_STATE_THRESHOLD_PIXELS,
      top: position.y === 0,
    },
    directions: direction,
    isScrolling,
    x: position.x,
    y: position.y,
  };
};
