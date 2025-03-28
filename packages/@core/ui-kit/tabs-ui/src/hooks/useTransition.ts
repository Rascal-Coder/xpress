import { type Variants } from 'framer-motion';

type TransitionType =
  | 'fade'
  | 'fade-down'
  | 'fade-scale'
  | 'fade-slide'
  | 'fade-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up';

type TransitionReturn = {
  animate: 'animate';
  exit: 'exit';
  initial: 'initial';
  layoutTransition?: {
    duration: number;
    ease: number[];
  };
  variants: Variants;
};

export function useTransition(
  type: TransitionType = 'slide-left',
): TransitionReturn {
  const transitions: Record<TransitionType, Variants> = {
    fade: {
      animate: {
        opacity: 1,
        transition: { duration: 0.3, ease: [0.25, 0.8, 0.5, 1] },
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.3, ease: [0.25, 0.8, 0.5, 1] },
      },
      initial: { opacity: 0 },
    },
    'fade-down': {
      animate: {
        opacity: 1,
        transition: { duration: 0.3, ease: [0.25, 0.8, 0.5, 1] },
        y: 0,
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.3, ease: [0.25, 0.8, 0.5, 1] },
        y: '10%',
      },
      initial: { opacity: 0, y: '-10%' },
    },
    'fade-scale': {
      animate: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.3, ease: [0.25, 0.8, 0.5, 1] },
      },
      exit: {
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.3, ease: [0.25, 0.8, 0.5, 1] },
      },
      initial: { opacity: 0, scale: 1.2 },
    },
    'fade-slide': {
      animate: {
        opacity: 1,
        transition: { duration: 0.3, ease: [0.25, 0.8, 0.5, 1] },
        x: 0,
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.3, ease: [0.25, 0.8, 0.5, 1] },
        x: '30px',
      },
      initial: { opacity: 0, x: '-30px' },
    },
    'fade-up': {
      animate: {
        opacity: 1,
        transition: { duration: 0.3, ease: [0.25, 0.8, 0.5, 1] },
        y: 0,
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.3, ease: [0.25, 0.8, 0.5, 1] },
        y: '-10%',
      },
      initial: { opacity: 0, y: '10%' },
    },
    'slide-down': {
      animate: {
        opacity: 1,
        transition: { duration: 0.2, ease: [0.25, 0.8, 0.5, 1] },
        y: 0,
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.2, ease: [0.25, 0.8, 0.5, 1] },
        y: 10,
      },
      initial: { opacity: 0, y: -10 },
    },
    'slide-left': {
      animate: {
        opacity: 1,
        transition: { duration: 0.2, ease: [0.25, 0.8, 0.5, 1] },
        x: 0,
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.2, ease: [0.25, 0.8, 0.5, 1] },
        x: -10,
      },
      initial: { opacity: 0, x: -10 },
    },
    'slide-right': {
      animate: {
        opacity: 1,
        transition: { duration: 0.2, ease: [0.25, 0.8, 0.5, 1] },
        x: 0,
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.2, ease: [0.25, 0.8, 0.5, 1] },
        x: 10,
      },
      initial: { opacity: 0, x: -10 },
    },
    'slide-up': {
      animate: {
        opacity: 1,
        transition: { duration: 0.2, ease: [0.25, 0.8, 0.5, 1] },
        y: 0,
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.2, ease: [0.25, 0.8, 0.5, 1] },
        y: -10,
      },
      initial: { opacity: 0, y: 10 },
    },
  };

  return {
    animate: 'animate',
    exit: 'exit',
    initial: 'initial',
    layoutTransition: {
      duration: 0.2,
      ease: [0.25, 0.8, 0.5, 1],
    },
    variants: transitions[type],
  };
}
