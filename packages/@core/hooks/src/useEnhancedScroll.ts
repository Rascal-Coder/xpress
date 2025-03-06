import { useDebounceFn, useEventListener, useThrottleFn } from 'ahooks';
import { useRef, useState } from 'react';

type Direction = 'down' | 'left' | 'none' | 'right' | 'up';

/** 到达状态的阈值（像素） */
const ARRIVED_STATE_THRESHOLD_PIXELS = 1;
/** 节流等待时间（毫秒），约等于60fps的刷新率 */
const THROTTLE_WAIT = 16;

/**
 * 增强的滚动监听 Hook，提供滚动位置、方向和状态的监听
 *
 * @param target - 需要监听滚动的目标元素，可以是 Document 或 HTMLElement
 *
 * @returns {object} 返回滚动相关的状态对象
 * @property {object} arrivedState - 到达边界的状态
 * @property {boolean} arrivedState.top - 是否到达顶部
 * @property {boolean} arrivedState.bottom - 是否到达底部
 * @property {boolean} arrivedState.left - 是否到达左侧
 * @property {boolean} arrivedState.right - 是否到达右侧
 * @property {Direction} directions - 当前滚动方向
 * @property {boolean} isScrolling - 是否正在滚动
 * @property {number} x - 当前水平滚动位置
 * @property {number} y - 当前垂直滚动位置
 *
 * @example
 * ```tsx
 * const ScrollComponent = () => {
 *   const { isScrolling, directions, arrivedState, x, y } = useEnhancedScroll(document);
 *
 *   return (
 *     <div>
 *       <p>滚动位置: ({x}, {y})</p>
 *       <p>滚动方向: {directions}</p>
 *       <p>是否滚动中: {isScrolling ? '是' : '否'}</p>
 *     </div>
 *   );
 * };
 * ```
 */
export const useEnhancedScroll = (target: Document | HTMLElement) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isScrolling, setIsScrolling] = useState(false);
  const [direction, setDirection] = useState<Direction>('none');
  const prevPosition = useRef({ x: 0, y: 0 });
  const resetScrollingState = useDebounceFn(
    () => {
      setIsScrolling(false);
      setDirection('none');
    },
    { wait: 150 },
  );
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

      setIsScrolling(true);
      resetScrollingState.run();
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
