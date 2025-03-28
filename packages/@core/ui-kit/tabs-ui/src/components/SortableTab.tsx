import type { TabsStyleType } from '@xpress-core/typings';

import type { TabDefinition } from '../types';

import { cn } from '@xpress-core/shared/utils';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type MouseEvent, useMemo } from 'react';

import AnimationWrap from '../AnimationWrap';

interface SortableTabProps {
  active: string | undefined;
  children: React.ReactNode;
  contentClass?: string;
  index: number;
  isDraggingDisabled?: boolean;
  onMouseDown: (e: MouseEvent<HTMLDivElement>, tab: TabDefinition) => void;
  onTabClick: (tab: TabDefinition) => void;
  styleType: TabsStyleType;
  tab: TabDefinition;
  transition?: any;
}

/**
 * 可排序的标签页组件
 * 封装了@dnd-kit/sortable的useSortable hook
 */
export function SortableTab({
  active,
  contentClass,
  index,
  isDraggingDisabled = false,
  onMouseDown,
  onTabClick,
  styleType,
  tab,
  transition,
  children,
}: SortableTabProps) {
  // 固定标签页不能拖拽
  const sortableConfig =
    tab.affixTab || isDraggingDisabled
      ? { disabled: true, id: tab.key }
      : { id: tab.key };
  // console.log('styleType', styleType);

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition: sortableTransition,
  } = useSortable(sortableConfig);

  const style: React.CSSProperties = {
    cursor: isDragging ? 'grabbing' : 'default',
    transform: CSS.Transform.toString(
      transform && { ...transform, scaleX: 1, y: 0 },
    ),
    transition: isDragging ? 'none' : sortableTransition,
    zIndex: isDragging ? 2 : 1,
  };

  // 只对非固定标签页应用拖拽监听器
  const dragAttributes =
    tab.affixTab || isDraggingDisabled ? {} : { ...listeners };
  const className = useMemo(() => {
    const baseClass =
      'translate-all group relative flex cursor-pointer select-none';
    const draggableClass = {
      'affix-tab': tab.affixTab,
      draggable: !tab.affixTab && !isDraggingDisabled,
    };
    const activeClass =
      styleType === 'chrome'
        ? {
            'is-active': tab.key === active,
          }
        : {
            'is-active dark:bg-accent bg-primary/15': tab.key === active,
          };
    return cn(baseClass, contentClass, draggableClass, activeClass, {
      isDragging,
    });
  }, [
    active,
    contentClass,
    isDragging,
    isDraggingDisabled,
    styleType,
    tab.affixTab,
    tab.key,
  ]);
  return (
    <AnimationWrap
      className={className}
      data-active-tab={active}
      data-index={index}
      data-tab-item="true"
      ref={setNodeRef}
      style={style}
      whileTap={{ scale: tab.key === active ? 1 : 0.9 }}
      {...transition}
      {...attributes}
      {...dragAttributes}
      onClick={() => onTabClick(tab)}
      onMouseDown={(e) => onMouseDown(e, tab)}
    >
      {children}
    </AnimationWrap>
  );
}
