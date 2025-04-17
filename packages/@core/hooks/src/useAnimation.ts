export const slideInFromLeft = (delay: number = 0.5) => ({
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    transition: {
      delay,
      duration: 0.5,
    },
    x: 0,
  },
});

export const slideInFromRight = (delay: number = 0.5) => ({
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    transition: {
      delay,
      duration: 0.5,
    },
    x: 0,
  },
});

export const slideInFromTop = (delay: number = 0.5) => ({
  hidden: { opacity: 0, y: -100 },
  visible: {
    opacity: 1,
    transition: {
      delay,
      duration: 0.5,
    },
    y: 0,
  },
});

export const slideInFromBottom = (delay: number = 0.5) => ({
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    transition: {
      delay,
      duration: 0.5,
    },
    y: 0,
  },
});

export type AnimationDirection = 'bottom' | 'left' | 'right' | 'top';
export const useAnimation = (
  direction: AnimationDirection = 'left',
  delay: number = 0.3,
) => {
  const animations = {
    bottom: slideInFromBottom(delay),
    left: slideInFromLeft(delay),
    right: slideInFromRight(delay),
    top: slideInFromTop(delay),
  };
  return animations[direction];
};
