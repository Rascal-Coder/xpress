import type { BreadcrumbProps, IBreadcrumb } from './type';

import { useNamespace } from '@xpress-core/hooks';
import { cn } from '@xpress-core/shared/utils';

import { AnimatePresence, motion } from 'framer-motion';
import { memo } from 'react';

import { XpressIcon } from '../icon';

import './style.css';

// 将动画配置抽离为常量，避免重复创建对象
const MOTION_DIV_TRANSITION = {
  duration: 0.2,
  ease: 'easeInOut',
};

// 创建一个MotionListItem组件，使用memo优化渲染
const MotionListItem = memo(
  ({
    handleClick,
    index,
    isLast,
    item,
    showIcon,
  }: {
    handleClick: (index: number, path?: string, defaultPath?: string) => void;
    index: number;
    isLast: boolean;
    item: IBreadcrumb;
    showIcon: boolean;
  }) => {
    const transitionConfig = {
      damping: 20, // 降低以减少计算
      delay: index * 0.03, // 减少延迟时间
      mass: 1, // 降低以减少计算
      stiffness: 300, // 降低以减少计算
      type: 'spring' as const,
    };

    return (
      <motion.li
        animate={{
          opacity: 1,
          x: 0,
        }}
        initial={{
          opacity: 0,
          x: 15, // 减少x偏移量
        }}
        key={`${item.path}-${item.title}-${index}`}
        transition={transitionConfig}
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
            <span className={isLast ? 'text-foreground font-normal' : ''}>
              {item.title}
            </span>
          </span>
        </a>
      </motion.li>
    );
  },
);

MotionListItem.displayName = 'MotionListItem';

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
          transition={MOTION_DIV_TRANSITION}
        >
          <div className="flex">
            {breadcrumbs.map((item, index) => (
              <MotionListItem
                handleClick={handleClick}
                index={index}
                isLast={index === breadcrumbs.length - 1}
                item={item}
                key={`${item.path}-${item.title}-${index}`}
                showIcon={showIcon}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </ul>
  );
}
