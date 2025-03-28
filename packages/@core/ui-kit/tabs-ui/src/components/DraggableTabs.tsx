import { cn } from '@xpress-core/shared/utils';

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { useRef } from 'react';

import { type TabConfig } from '../types';

interface DraggableTabsProps {
  activeId: null | string;
  activeTab: null | TabConfig;
  children: React.ReactNode;
  className?: string;
  draggable?: boolean;
  isDragging: boolean;
  onDragEnd: (event: DragEndEvent) => void;
  onDragStart: (event: DragStartEvent) => void;
  overlayContent?: React.ReactNode;
  overlayRender?: (tab: TabConfig) => React.ReactNode;
  style?: React.CSSProperties;
  tabs: TabConfig[];
}

/**
 * 可拖拽标签页的容器组件
 * 提供DndContext和SortableContext的包装
 */
export function DraggableTabs({
  activeId,
  activeTab,
  className,
  draggable = true,
  isDragging,
  onDragEnd,
  onDragStart,
  overlayContent,
  overlayRender,
  style,
  tabs,
  children,
}: DraggableTabsProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: draggable ? 10 : Infinity },
    }),
  );

  return (
    <DndContext
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      sensors={sensors}
    >
      <motion.div
        className={cn('relative !flex overflow-hidden', className)}
        ref={contentRef}
        style={style}
      >
        <SortableContext
          items={tabs.map((tab) => tab.key)}
          strategy={horizontalListSortingStrategy}
        >
          {children}
        </SortableContext>

        <DragOverlay
          dropAnimation={{
            duration: 50,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}
        >
          {activeId && isDragging && activeTab && (
            <>{overlayContent || (overlayRender && overlayRender(activeTab))}</>
          )}
        </DragOverlay>
      </motion.div>
    </DndContext>
  );
}
