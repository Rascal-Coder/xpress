import type { PropsWithChildren } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

interface Props extends PropsWithChildren {
  show?: boolean;
}

function CollapseTransition({ show = true, children }: Props) {
  return (
    <AnimatePresence initial={false} mode="wait">
      {show && (
        <motion.div
          animate={{
            height: 'auto',
            opacity: 1,
          }}
          exit={{
            height: 0,
            opacity: 0,
          }}
          initial={{
            height: 0,
            opacity: 0,
          }}
          style={{ overflow: 'hidden' }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1], // 使用 Material Design 的缓动函数
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CollapseTransition;
