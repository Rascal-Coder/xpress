import { cn } from '@xpress-core/shared/utils';

import { type HTMLMotionProps, motion } from 'framer-motion';
import { forwardRef, memo, type PropsWithChildren } from 'react';

// 创建常量动画配置，避免每次渲染重新创建对象
const ANIMATION_CONFIG = {
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0 },
  initial: { opacity: 0, scale: 0 },
};

// 简化的过渡配置，减少计算开销
const TRANSITION_CONFIG = {
  duration: 0.12, // 减少动画时间
  ease: 'easeOut', // 使用简单的缓动函数
  type: 'tween', // 使用tween替代spring可以减少计算
};

const AnimationWrap = memo(
  forwardRef<HTMLDivElement, PropsWithChildren<HTMLMotionProps<'div'>>>(
    (props, ref) => {
      const { children, ...rest } = props;

      // 尽量避免layoutId，它会导致额外的布局计算
      const { layoutId, ...otherProps } = rest;

      return (
        <motion.div
          ref={ref}
          {...otherProps}
          {...ANIMATION_CONFIG}
          className={cn(rest.className)}
          // 禁用布局动画 - 这是性能开销的主要来源
          layout={false}
          // 只在明确需要layout功能时才使用layoutId
          layoutId={layoutId}
          transition={TRANSITION_CONFIG}
        >
          {children}
        </motion.div>
      );
    },
  ),
);

AnimationWrap.displayName = 'AnimationWrap';

export default AnimationWrap;
