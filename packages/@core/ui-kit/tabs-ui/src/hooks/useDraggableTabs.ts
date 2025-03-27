import { type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { useState } from 'react';

import { type TabConfig } from '../types';

interface UseDraggableTabsProps {
  onSort?: (oldIndex: number, newIndex: number) => void;
  tabs: TabConfig[];
}

interface UseDraggableTabsReturn {
  activeId: null | string;
  activeTab: null | TabConfig;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragStart: (event: DragStartEvent) => void;
  isDragging: boolean;
}

/**
 * Hook for managing draggable tabs state and logic
 * Handles drag start/end events and manages active tab state
 */
export function useDraggableTabs({
  onSort,
  tabs,
}: UseDraggableTabsProps): UseDraggableTabsReturn {
  const [activeId, setActiveId] = useState<null | string>(null);
  const [isDragging, setIsDragging] = useState(false);
  const activeTab = activeId
    ? tabs.find((tab) => tab.key === activeId) || null
    : null;

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedTab = tabs.find((tab) => tab.key === active.id);

    // 如果是固定标签，不允许拖拽
    if (draggedTab?.affixTab) {
      return;
    }

    setActiveId(active.id as string);
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setIsDragging(false);

    // 使用setTimeout防止重影
    setTimeout(() => {
      setActiveId(null);
    }, 50);

    if (active.id !== over?.id && over?.id) {
      const activeTab = tabs.find((tab) => tab.key === active.id);
      const overTab = tabs.find((tab) => tab.key === over.id);

      // 如果两个标签都是固定标签，不执行排序
      if (activeTab?.affixTab && overTab?.affixTab) {
        return;
      }

      const oldIndex = tabs.findIndex((item) => item.key === active.id);
      const newIndex = tabs.findIndex((item) => item.key === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onSort?.(oldIndex, newIndex);
      }
    }
  };

  return {
    activeId,
    activeTab,
    handleDragEnd,
    handleDragStart,
    isDragging,
  };
}
