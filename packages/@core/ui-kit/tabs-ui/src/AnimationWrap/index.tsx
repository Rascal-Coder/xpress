import { cn } from '@xpress-core/shared/utils';

import { type HTMLMotionProps, motion } from 'framer-motion';
import { forwardRef, type PropsWithChildren } from 'react';

const AnimationWrap = forwardRef<
  HTMLDivElement,
  PropsWithChildren<HTMLMotionProps<'div'>>
>((props, ref) => {
  const { children, ...rest } = props;

  return (
    <motion.div
      ref={ref}
      {...rest}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(rest.className)}
      exit={{ opacity: 0, scale: 0 }}
      initial={{ opacity: 0, scale: 0 }}
      layout
      transition={{ damping: 40, stiffness: 900, type: 'spring' }}
    >
      {children}
    </motion.div>
  );
});

AnimationWrap.displayName = 'AnimationWrap';

export default AnimationWrap;
