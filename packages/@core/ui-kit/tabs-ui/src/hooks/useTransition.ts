import { type HTMLMotionProps, motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

type TransitionType = 'fade' | 'slide-left';

const transitions = {
  fade: {
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    initial: { opacity: 0 },
    transition: { duration: 0.25 },
  },
  'slide-left': {
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -15 },
    initial: { opacity: 0, x: -15 },
    transition: {
      duration: 0.25,
      ease: [0.25, 0.8, 0.5, 1],
      layout: { duration: 0.3 },
    },
  },
};

export const useTransition = (type: TransitionType = 'fade') => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start('animate');
  }, []);

  return {
    animate: transitions[type].animate,
    as: motion.div,
    exit: transitions[type].exit,
    initial: false,
    transition: transitions[type].transition,
  } as HTMLMotionProps<'div'>;
};
