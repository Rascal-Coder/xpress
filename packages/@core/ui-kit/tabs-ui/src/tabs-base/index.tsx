import { Pin, X } from '@xpress-core/icons';
import { XpressContextMenu, XpressIcon } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import { type MouseEvent } from 'react';
import { useMemo } from 'react';

import { DraggableTabs } from '../components/DraggableTabs';
import { SortableTab } from '../components/SortableTab';
import { useDraggableTabs } from '../hooks/useDraggableTabs';
import { type TabConfig, type TabDefinition, type TabsProps } from '../types';

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
}: TabsProps) {
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

  // 使用自定义hook处理拖拽逻辑
  const { activeId, activeTab, handleDragEnd, handleDragStart, isDragging } =
    useDraggableTabs({
      onSort,
      tabs: tabView,
    });

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

  function onMouseDown(e: MouseEvent<HTMLDivElement>, tab: TabDefinition) {
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

  function onTabClick(tab: TabDefinition) {
    onClick?.(tab);
  }

  // 渲染拖拽预览内容
  const renderTabContent = (tab: TabConfig) => (
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

  // 拖拽预览的Overlay内容
  const dragOverlay = activeTab && (
    <div
      className={cn(
        'tab-item translate-all group relative flex cursor-pointer select-none opacity-80',
        typeWithClass.content,
        activeId === active && 'is-active dark:bg-accent bg-primary/15',
        activeId !== active && 'bg-background rounded-md shadow-lg',
      )}
      style={{ cursor: 'grabbing', zIndex: 50 }}
    >
      {renderTabContent(activeTab)}
    </div>
  );

  return (
    <DraggableTabs
      activeId={activeId}
      activeTab={activeTab}
      className={cn('h-full w-max items-center pr-6', contentClass)}
      isDragging={isDragging}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      overlayContent={dragOverlay}
      tabs={tabView}
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
            {renderTabContent(tab)}
          </XpressContextMenu>
        </SortableTab>
      ))}
    </DraggableTabs>
  );
}
