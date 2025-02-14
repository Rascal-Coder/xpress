import { cn } from '@xpress-core/shared/utils';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface LoadingProps {
  className?: string;
  /**
   * @zh_CN 最小加载时间
   * @en_US Minimum loading time
   */
  minLoadingTime?: number;
  /**
   * @zh_CN loading状态开启
   */
  spinning?: boolean;
  /**
   * @zh_CN 文字
   */
  text?: string;
}

export const XpressLoading = ({
  className,
  minLoadingTime = 50,
  spinning = false,
  text = '',
}: LoadingProps) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!spinning) {
      setShowSpinner(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      return;
    }

    timerRef.current = setTimeout(() => {
      setShowSpinner(true);
    }, minLoadingTime);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [spinning, minLoadingTime]);

  const dotVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.2,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  };

  const dotItemVariants = {
    animate: {
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 1.2,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  };

  return (
    <AnimatePresence>
      {showSpinner && (
        <motion.div
          animate={{ opacity: 1 }}
          className={cn(
            'z-100 dark:bg-overlay bg-overlay-content pointer-events-none absolute left-0 top-0 flex size-full flex-col items-center justify-center',
            className,
          )}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            animate="animate"
            className="relative inline-block size-9 text-3xl"
            style={{ transformOrigin: 'center' }}
            variants={dotVariants}
          >
            {[0, 1, 2, 3].map((index) => (
              <motion.i
                animate="animate"
                className="bg-primary absolute block size-4 origin-[50%_50%] scale-75 rounded-full"
                initial="initial"
                key={index}
                style={{
                  bottom: index === 2 || index === 3 ? 0 : 'auto',
                  left: index === 0 || index === 3 ? 0 : 'auto',
                  right: index === 1 || index === 2 ? 0 : 'auto',
                  top: index === 0 || index === 1 ? 0 : 'auto',
                }}
                transition={{
                  delay: index * 0.3,
                  duration: 1.2,
                  ease: 'linear',
                  repeat: Infinity,
                }}
                variants={dotItemVariants}
              />
            ))}
          </motion.span>

          {text && <div className="mt-4 text-xs">{text}</div>}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
