import type { AnimationDirection } from '@xpress-core/hooks';

import { motion } from 'framer-motion';

export const PreviewAnimationCell = ({
  direction,
}: {
  direction: AnimationDirection;
}) => {
  const getPreviewAnimation = (direction: AnimationDirection) => {
    const baseTransition = {
      duration: 1.5,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 0.5,
    };

    switch (direction) {
      case 'bottom': {
        return {
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1, transition: baseTransition },
        };
      }
      case 'left': {
        return {
          hidden: { x: -20, opacity: 0 },
          visible: { x: 0, opacity: 1, transition: baseTransition },
        };
      }
      case 'right': {
        return {
          hidden: { x: 20, opacity: 0 },
          visible: { x: 0, opacity: 1, transition: baseTransition },
        };
      }
      case 'top': {
        return {
          hidden: { y: -20, opacity: 0 },
          visible: { y: 0, opacity: 1, transition: baseTransition },
        };
      }
      default: {
        return {
          hidden: { x: 20, opacity: 0 },
          visible: { x: 0, opacity: 1, transition: baseTransition },
        };
      }
    }
  };
  return (
    <motion.div
      animate="visible"
      className="bg-accent h-10 w-12 rounded-md"
      initial="hidden"
      variants={getPreviewAnimation(direction)}
    ></motion.div>
  );
};
