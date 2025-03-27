import { Pin, X } from '@xpress-core/icons';
import { XpressContextMenu, XpressIcon } from '@xpress-core/shadcn-ui';
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
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { type MouseEvent } from 'react';
import { useMemo, useRef, useState } from 'react';

import AnimationWrap from '../AnimationWrap';
import { type TabConfig, type TabsProps } from '../types';

function SortableTab({
  active,
  index,
  onMouseDown,
  onTabClick,
  tab,
  ...props
}: any) {
  const sortableConfig = tab.affixTab
    ? { disabled: true, id: tab.key }
    : { id: tab.key };

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable(sortableConfig);

  const style: React.CSSProperties = {
    ...props.style,
    cursor: isDragging ? 'grabbing' : 'default',
    transform: CSS.Transform.toString(
      transform && { ...transform, scaleX: 1, y: 0 },
    ),
    transition: isDragging ? 'none' : transition,
    zIndex: isDragging ? 2 : 1,
  };

  const dragAttributes = tab.affixTab ? {} : { ...listeners };

  return (
    <AnimationWrap
      className={cn(
        'tab-item translate-all group relative flex cursor-pointer select-none',
        props.contentClass,
        active === tab.key && 'is-active dark:bg-accent bg-primary/15',
        !tab.affixTab && 'draggable',
        tab.affixTab && 'affix-tab',
        isDragging && 'isDragging',
        active !== tab.key && '[&:not(.is-active)]:hover:bg-accent',
      )}
      data-index={index}
      data-tab-item="true"
      key={tab.key}
      onClick={() => onTabClick(tab)}
      onMouseDown={(e: MouseEvent<HTMLDivElement>) => onMouseDown(e, tab)}
      ref={setNodeRef}
      style={style}
      whileTap={{
        scale: tab.key === active ? 1 : 0.9,
      }}
      {...attributes}
      {...dragAttributes}
    >
      {props.children}
    </AnimationWrap>
  );
}

interface Props extends TabsProps {
  onClick?: (tab: Record<string, any>) => void;
  onClose?: (tab: Record<string, any>) => void;
  onOpenChange?: (tab: Record<string, any>) => void;
  onSort?: (oldIndex: number, newIndex: number) => void;
  unpin?: (tab: Record<string, any>) => void;
}
export function TabsBase({
  active,
  contentClass = '',
  contextMenus = () => [],
  onClick,
  onClose,
  onOpenChange,
  onSort,
  tabs = [],
  unpin,
  ...props
}: Props) {
  const tabView = useMemo(() => {
    return tabs.map((tab) => {
      const { fullPath, meta, path } = tab || {};
      const { affixTab, icon, newTabTitle, tabClosable, title } = meta || {};
      return {
        affixTab: !!affixTab,
        closable: Reflect.has(meta, 'tabClosable') ? !!tabClosable : true,
        fullPath,
        icon: icon as string,
        key: fullPath || path,
        meta,
        path,
        title: (newTabTitle || title) as string,
      } as TabConfig;
    });
  }, [tabs]);

  const contentRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<null | string>(null);
  const [isDragging, setIsDragging] = useState(false);
  const activeTab = activeId
    ? tabView.find((tab) => tab.key === activeId)
    : null;

  const typeWithClass = useMemo(() => {
    const typeClasses: Record<string, { content: string }> = {
      brisk: {
        content: `h-full after:content-['']  after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-primary after:scale-x-0 after:transition-[transform] after:ease-out after:duration-300 hover:after:scale-x-100 after:origin-left [&.is-active]:after:scale-x-100 [&:not(:first-child)]:border-l last:border-r last:border-r border-border`,
      },
      card: {
        content: 'h-[calc(100%-6px)] rounded-md ml-2 border border-border ',
      },
      plain: {
        content:
          'h-full [&:not(:first-child)]:border-l last:border-r border-border',
      },
    };

    return typeClasses[props.styleType || 'plain'] || { content: '' };
  }, [props.styleType]);

  function onMouseDown(
    e: React.MouseEvent<HTMLDivElement>,
    tab: Record<string, any>,
  ) {
    if (
      e.button === 1 &&
      tab.closable &&
      !tab.affixTab &&
      tabView.length > 1 &&
      props.middleClickToClose
    ) {
      e.preventDefault();
      e.stopPropagation();
      onClose?.(tab);
    }
  }
  function onTabClick(tab: Record<string, any>) {
    onClick?.(tab);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const draggedTab = tabView.find((tab) => tab.key === active.id);

    if (draggedTab?.affixTab) {
      return;
    }

    setActiveId(active.id as string);
    setIsDragging(true);
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    setIsDragging(false);

    setTimeout(() => {
      setActiveId(null);
    }, 50);

    if (active.id !== over?.id) {
      const activeTab = tabView.find((tab) => tab.key === active.id);
      const overTab = tabView.find((tab) => tab.key === over?.id);

      if (activeTab?.affixTab && overTab?.affixTab) {
        return;
      }

      const oldIndex = tabView.findIndex((item) => item.key === active.id);
      const newIndex = tabView.findIndex((item) => item.key === over?.id);
      onSort?.(oldIndex, newIndex);
    }
  }

  // 渲染拖拽预览内容
  const renderTabContent = (tab: TabConfig) => {
    if (!tab) return null;

    return (
      <div className="relative flex size-full items-center">
        <div className="absolute right-1.5 top-1/2 z-[3] translate-y-[-50%] overflow-hidden">
          {!tab.affixTab && tabView.length > 1 && tab.closable && (
            <X
              className="hover:bg-accent stroke-accent-foreground/80 hover:stroke-accent-foreground dark:group-[.is-active]:text-accent-foreground group-[.is-active]:text-primary size-3 cursor-pointer rounded-full transition-all"
              onClick={(e) => {
                e.stopPropagation();
                onClose?.(tab);
              }}
            ></X>
          )}
          {tab.affixTab && tabView.length > 1 && tab.closable && (
            <Pin
              className="hover:bg-accent hover:stroke-accent-foreground group-[.is-active]:text-primary dark:group-[.is-active]:text-accent-foreground mt-[1px] size-3.5 cursor-pointer rounded-full transition-all"
              onClick={(e) => {
                e.stopPropagation();
                unpin?.(tab);
              }}
            ></Pin>
          )}
        </div>
        <div className="text-accent-foreground group-[.is-active]:text-primary dark:group-[.is-active]:text-accent-foreground mx-3 mr-4 flex h-full items-center overflow-hidden rounded-tl-[5px] rounded-tr-[5px] pr-3 transition-all duration-300">
          {props.showIcon && (
            <XpressIcon
              className="mr-2 flex size-4 items-center overflow-hidden"
              fallback
              icon={tab.icon}
            />
          )}
          <span className="flex-1 overflow-hidden whitespace-nowrap text-sm">
            {tab.title}
          </span>
        </div>
      </div>
    );
  };

  return (
    <DndContext
      onDragEnd={onDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <motion.div
        className={cn(
          'relative !flex h-full w-max items-center overflow-hidden pr-6',
          contentClass,
        )}
        ref={contentRef}
      >
        <SortableContext
          items={tabView.map((tab) => tab.key)}
          strategy={horizontalListSortingStrategy}
        >
          {tabView.map((tab, index) => (
            <SortableTab
              active={active}
              contentClass={typeWithClass.content}
              index={index}
              key={tab.key}
              onMouseDown={onMouseDown}
              onTabClick={onTabClick}
              tab={tab}
            >
              <XpressContextMenu
                handlerData={tab}
                itemClass="pr-6"
                menus={contextMenus}
                modal={false}
                onOpenChange={(open) => {
                  if (open) {
                    onOpenChange?.(tab);
                  }
                }}
              >
                <div className="relative flex size-full items-center">
                  <div className="absolute right-1.5 top-1/2 z-[3] translate-y-[-50%] overflow-hidden">
                    {!tab.affixTab && tabView.length > 1 && tab.closable && (
                      <X
                        className="hover:bg-accent stroke-accent-foreground/80 hover:stroke-accent-foreground dark:group-[.is-active]:text-accent-foreground group-[.is-active]:text-primary size-3 cursor-pointer rounded-full transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose?.(tab);
                        }}
                      ></X>
                    )}
                    {tab.affixTab && tabView.length > 1 && tab.closable && (
                      <Pin
                        className="hover:bg-accent hover:stroke-accent-foreground group-[.is-active]:text-primary dark:group-[.is-active]:text-accent-foreground mt-[1px] size-3.5 cursor-pointer rounded-full transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          unpin?.(tab);
                        }}
                      ></Pin>
                    )}
                  </div>
                  <div className="text-accent-foreground group-[.is-active]:text-primary dark:group-[.is-active]:text-accent-foreground mx-3 mr-4 flex h-full items-center overflow-hidden rounded-tl-[5px] rounded-tr-[5px] pr-3 transition-all duration-300">
                    {props.showIcon && (
                      <XpressIcon
                        className="mr-2 flex size-4 items-center overflow-hidden"
                        fallback
                        icon={tab.icon}
                      />
                    )}
                    <span className="flex-1 overflow-hidden whitespace-nowrap text-sm">
                      {tab.title}
                    </span>
                  </div>
                </div>
              </XpressContextMenu>
            </SortableTab>
          ))}
        </SortableContext>

        <DragOverlay
          dropAnimation={{
            duration: 50,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}
        >
          {activeId && isDragging ? (
            <div
              className={cn(
                'tab-item translate-all group relative flex cursor-pointer select-none opacity-80',
                typeWithClass.content,
                activeId === active && 'is-active dark:bg-accent bg-primary/15',
                activeId !== active && 'bg-background rounded-md shadow-lg',
              )}
              style={{ cursor: 'grabbing', zIndex: 50 }}
            >
              {renderTabContent(activeTab as TabConfig)}
            </div>
          ) : null}
        </DragOverlay>
      </motion.div>
    </DndContext>
  );
}
