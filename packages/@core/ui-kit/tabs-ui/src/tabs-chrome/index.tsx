import { Pin, X } from '@xpress-core/icons';
import { XpressContextMenu, XpressIcon } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import {
  DndContext,
  type DragEndEvent,
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
import { useMemo, useRef } from 'react';
import { type MouseEvent } from 'react';

import AnimationWrap from '../AnimationWrap';
import { useTransition } from '../hooks/useTransition';
import { type TabConfig, type TabsProps } from '../types';

interface TabsChromeProps extends TabsProps {
  onClick?: (tab: Record<string, any>) => void;
  onClose?: (tab: Record<string, any>) => void;
  onOpenChange?: (tab: Record<string, any>) => void;
  onSort?: (oldIndex: number, newIndex: number) => void;
  unpin?: (tab: Record<string, any>) => void;
}

function SortableTab({ index, tab, ...props }: any) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: tab.key });

  const style: React.CSSProperties = {
    ...props.style,
    cursor: isDragging ? 'grabbing' : 'default',
    transform: CSS.Transform.toString(
      transform && { ...transform, scaleX: 1, y: 0 },
    ),
    transition: isDragging ? 'none' : transition,
    zIndex: isDragging ? 2 : 1,
  };

  return (
    <AnimationWrap
      className={cn(
        'tabs-chrome__item draggable translate-all group relative -mr-3 flex h-full select-none items-center',
        {
          'affix-tab': tab.affixTab,
          draggable: !tab.affixTab,
          'is-active': tab.key === props.active,
          isDragging,
        },
      )}
      data-active-tab={props.active}
      data-index={index}
      data-tab-item="true"
      ref={setNodeRef}
      style={style}
      whileTap={{ scale: tab.key === props.active ? 1 : 0.9 }}
      {...props.transition}
      {...attributes}
      {...listeners}
      onClick={() => props.onTabClick(tab)}
      onMouseDown={(e: MouseEvent<HTMLDivElement>) => props.onMouseDown(e, tab)}
    >
      {props.children}
    </AnimationWrap>
  );
}

export function TabsChrome({
  active,
  contentClass = 'xpress-tabs-content',
  contextMenus = () => [],
  gap = 7,
  onClick,
  onClose,
  onOpenChange,
  onSort,
  showIcon = true,
  tabs = [],
  unpin,
  ...props
}: TabsChromeProps) {
  const transition = useTransition('slide-left');
  const style = useMemo(() => {
    return {
      '--gap': `${gap}px`,
    } as React.CSSProperties;
  }, [gap]);

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

  function onMouseDown(
    e: MouseEvent<HTMLDivElement>,
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

  function onDragEnd({ active, over }: DragEndEvent) {
    if (active.id !== over?.id) {
      const oldIndex = tabView.findIndex((item) => item.key === active.id);
      const newIndex = tabView.findIndex((item) => item.key === over?.id);
      onSort?.(oldIndex, newIndex);
    }
  }

  const TabBackground = () => {
    return (
      <>
        <svg
          className="tabs-chrome__background-before group-[.is-active]:fill-primary/15 dark:group-[.is-active]:fill-accent absolute bottom-0 left-[-1px] fill-transparent transition-all duration-150"
          height="7"
          width="7"
        >
          <path d="M 0 7 A 7 7 0 0 0 7 0 L 7 7 Z" />
        </svg>
        <svg
          className="tabs-chrome__background-after group-[.is-active]:fill-primary/15 dark:group-[.is-active]:fill-accent absolute bottom-0 right-[-1px] fill-transparent transition-all duration-150"
          height="7"
          width="7"
        >
          <path d="M 0 0 A 7 7 0 0 0 7 7 L 0 7 Z" />
        </svg>
      </>
    );
  };

  return (
    <DndContext onDragEnd={onDragEnd} sensors={sensors}>
      <motion.div
        className={cn(
          'tabs-chrome !flex h-full w-max overflow-hidden pr-6',
          contentClass,
        )}
        ref={contentRef}
        style={style}
      >
        <SortableContext
          items={tabView.map((tab) => tab.key)}
          strategy={horizontalListSortingStrategy}
        >
          {tabView.map((tab, i) => (
            <SortableTab
              active={active}
              index={i}
              key={tab.key}
              onMouseDown={onMouseDown}
              onTabClick={onTabClick}
              tab={tab}
              transition={transition}
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
                <div className="relative size-full px-1">
                  {i !== 0 && tab.key !== active && (
                    <div className="tabs-chrome__divider bg-border absolute left-[var(--gap)] top-1/2 z-0 h-4 w-[1px] translate-y-[-50%] transition-all"></div>
                  )}

                  <div className="tabs-chrome__background absolute z-[-1] size-full px-[calc(var(--gap)-1px)] py-0 transition-opacity duration-150">
                    <div className="tabs-chrome__background-content group-[.is-active]:bg-primary/15 dark:group-[.is-active]:bg-accent h-full rounded-tl-[var(--gap)] rounded-tr-[var(--gap)] duration-150"></div>
                    <TabBackground />
                  </div>

                  <div className="tabs-chrome__extra absolute right-[var(--gap)] top-1/2 z-[3] size-4 translate-y-[-50%]">
                    {!tab.affixTab && tabView.length > 1 && tab.closable && (
                      <X
                        className="hover:bg-accent stroke-accent-foreground/80 hover:stroke-accent-foreground text-accent-foreground/80 group-[.is-active]:text-accent-foreground mt-[2px] size-3 cursor-pointer rounded-full transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose?.(tab);
                        }}
                      />
                    )}

                    {tab.affixTab && tabView.length > 1 && tab.closable && (
                      <Pin
                        className="hover:text-accent-foreground text-accent-foreground/80 group-[.is-active]:text-accent-foreground mt-[1px] size-3.5 cursor-pointer rounded-full transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          unpin?.(tab);
                        }}
                      />
                    )}
                  </div>

                  <div className="tabs-chrome__item-main group-[.is-active]:text-primary dark:group-[.is-active]:text-accent-foreground text-accent-foreground z-[2] mx-[calc(var(--gap)*2)] my-0 flex h-full items-center overflow-hidden rounded-tl-[5px] rounded-tr-[5px] pl-2 pr-4 duration-150">
                    {showIcon && (
                      <XpressIcon
                        className="mr-1 flex size-4 items-center overflow-hidden"
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
      </motion.div>
    </DndContext>
  );
}
