import type { BreadcrumbProps } from './type';

import { useNamespace } from '@xpress-core/hooks';
import { cn } from '@xpress-core/shared/utils';

import { AnimatePresence, motion } from 'framer-motion';

import { XpressIcon } from '../icon';

import './style.css';

export function XpressBreadcrumbBackground({
  breadcrumbs,
  className,
  onSelect,
  showIcon = false,
}: BreadcrumbProps) {
  const { b } = useNamespace('breadcrumb');
  const handleClick = (index: number, path?: string, defaultPath?: string) => {
    if (!path || index === breadcrumbs.length - 1) {
      return;
    }
    onSelect?.(path, defaultPath);
  };

  return (
    <ul className={cn('flex', b(), className)}>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key={breadcrumbs.map((item) => item.path).join('-')}
          transition={{
            duration: 0.2,
            ease: 'easeInOut',
          }}
        >
          <div className="flex">
            {breadcrumbs.map((item, index) => (
              <motion.li
                animate={{
                  opacity: 1,
                  skewX: 0,
                  x: 0,
                }}
                initial={{
                  opacity: 0,
                  x: 30,
                }}
                key={`${item.path}-${item.title}-${index}`}
                transition={{
                  damping: 30,
                  delay: index * 0.05,
                  mass: 2,
                  stiffness: 450,
                  type: 'spring',
                }}
              >
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClick(index, item.path, item.defaultPath);
                  }}
                >
                  <span className="flex-center z-10 h-full">
                    {showIcon && item.icon && (
                      <XpressIcon
                        className="mr-1 size-4 flex-shrink-0"
                        icon={item.icon}
                      />
                    )}
                    <span
                      className={
                        index === breadcrumbs.length - 1
                          ? 'text-foreground font-normal'
                          : ''
                      }
                    >
                      {item.title}
                    </span>
                  </span>
                </a>
              </motion.li>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </ul>
  );
}
