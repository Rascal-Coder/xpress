import { Pin, X } from '@xpress-core/icons';
import { XpressContextMenu, XpressIcon } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import { memo, useCallback, useMemo } from 'react';
import { type MouseEvent } from 'react';

import { DraggableTabs } from '../components/DraggableTabs';
import { SortableTab } from '../components/SortableTab';
import { useDraggableTabs } from '../hooks/useDraggableTabs';
import { useTransition } from '../hooks/useTransition';
import { type TabConfig, type TabDefinition, type TabsProps } from '../types';

interface TabsChromeProps extends TabsProps {
  onClick?: (tab: TabDefinition) => void;
  onClose?: (tab: TabDefinition) => void;
  onOpenChange?: (tab: TabDefinition) => void;
  onSort?: (oldIndex: number, newIndex: number) => void;
  unpin?: (tab: TabDefinition) => void;
}

// 扩展TabConfig类型添加showIcon属性
interface EnhancedTabConfig extends TabConfig {
  showIcon?: boolean;
}

// 标签页背景SVG组件
const TabBackground = memo(({ isActive }: { isActive?: boolean }) => {
  return (
    <>
      <svg
        className={cn(
          'absolute bottom-0 left-[-1px] fill-transparent transition-all duration-150',
          isActive &&
            'tabs-chrome__background-before group-[.is-active]:fill-primary/15 dark:group-[.is-active]:fill-accent',
        )}
        height="7"
        width="7"
      >
        <path d="M 0 7 A 7 7 0 0 0 7 0 L 7 7 Z" />
      </svg>
      <svg
        className={cn(
          'absolute bottom-0 right-[-1px] fill-transparent transition-all duration-150',
          isActive &&
            'tabs-chrome__background-after group-[.is-active]:fill-primary/15 dark:group-[.is-active]:fill-accent',
        )}
        height="7"
        width="7"
      >
        <path d="M 0 0 A 7 7 0 0 0 7 7 L 0 7 Z" />
      </svg>
    </>
  );
});
TabBackground.displayName = 'TabBackground';

// 将TabContent抽离为独立组件，可以单独memo
const TabContent = memo(
  ({
    active,
    onClose,
    showIcon = true,
    tab,
    tabView,
    unpin,
  }: {
    active: string;
    onClose?: (tab: TabDefinition) => void;
    showIcon?: boolean;
    tab: EnhancedTabConfig;
    tabView: EnhancedTabConfig[];
    unpin?: (tab: TabDefinition) => void;
  }) => {
    const isActiveTab = tab.key === active;

    const handleClose = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose?.(tab);
      },
      [onClose, tab],
    );

    const handleUnpin = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        unpin?.(tab);
      },
      [unpin, tab],
    );

    return (
      <div className="relative size-full px-1">
        <div className="tabs-chrome__background absolute z-[-1] size-full px-[calc(var(--gap)-1px)] py-0 transition-opacity duration-150">
          <div
            className={cn(
              'tabs-chrome__background-content h-full rounded-tl-[var(--gap)] rounded-tr-[var(--gap)] duration-150',
              isActiveTab &&
                'group-[.is-active]:bg-primary/15 dark:group-[.is-active]:bg-accent',
            )}
          ></div>
          <TabBackground isActive={isActiveTab} key={tab.key} />
        </div>

        {/* 右侧关闭或固定图标 */}
        <div className="tabs-chrome__extra absolute right-[var(--gap)] top-1/2 z-[3] size-4 translate-y-[-50%]">
          {!tab.affixTab && tabView.length > 1 && tab.closable && (
            <X
              className="hover:bg-accent stroke-accent-foreground/80 hover:stroke-accent-foreground text-accent-foreground/80 group-[.is-active]:text-accent-foreground mt-[2px] size-3 cursor-pointer rounded-full transition-all"
              onClick={handleClose}
            />
          )}

          {tab.affixTab && tabView.length > 1 && tab.closable && (
            <Pin
              className="hover:text-accent-foreground text-accent-foreground/80 group-[.is-active]:text-accent-foreground mt-[1px] size-3.5 cursor-pointer rounded-full transition-all"
              onClick={handleUnpin}
            />
          )}
        </div>

        {/* 标签主体内容 */}
        <div
          className={cn(
            'tabs-chrome__item-main mx-[calc(var(--gap)*2)] my-0 flex h-full cursor-pointer items-center overflow-hidden rounded-tl-[5px] rounded-tr-[5px] pl-2 pr-4 duration-150',
            isActiveTab &&
              'group-[.is-active]:text-primary dark:group-[.is-active]:text-accent-foreground text-accent-foreground',
          )}
        >
          {showIcon && (
            <div className="mr-1 size-4 overflow-hidden">
              <XpressIcon
                className="flex size-full items-center"
                fallback
                icon={tab.icon}
              />
            </div>
          )}

          <span className="flex-1 overflow-hidden whitespace-nowrap text-sm">
            {tab.title}
          </span>
        </div>
      </div>
    );
  },
);
TabContent.displayName = 'TabContent';

// 将主组件进行memo优化
export const TabsChrome = memo(
  ({
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
  }: TabsChromeProps) => {
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
          showIcon,
          title: (newTabTitle || title) as string,
        } as EnhancedTabConfig;
      });
    }, [tabs, showIcon]);

    // 使用自定义hook处理拖拽逻辑
    const { activeId, activeTab, handleDragEnd, handleDragStart, isDragging } =
      useDraggableTabs({
        onSort,
        tabs: tabView,
      });

    const onMouseDown = useCallback(
      (e: MouseEvent<HTMLDivElement>, tab: TabDefinition) => {
        if (
          e.button === 1 &&
          tab.closable &&
          !tab.affixTab &&
          tabView.length > 1 &&
          props.middleClickToClose
        ) {
          e.preventDefault();
          e.stopPropagation();
          onClose?.(tab as TabDefinition);
        }
      },
      [tabView.length, props.middleClickToClose, onClose],
    );

    const onTabClick = useCallback(
      (tab: TabDefinition) => {
        onClick?.(tab);
      },
      [onClick],
    );

    // 拖拽预览的Overlay内容
    const dragOverlay = useMemo(() => {
      if (!activeTab) return null;

      return (
        <div
          className={cn(
            'tabs-chrome__item draggable translate-all group relative -mr-3 flex h-full select-none items-center opacity-80',
            activeId === active && 'is-active',
            activeId !== active &&
              'bg-background !mx-0 rounded-md !p-0 shadow-lg',
          )}
          style={{ cursor: 'grabbing', zIndex: 50 }}
        >
          <TabContent
            active={active || ''}
            onClose={onClose}
            showIcon={showIcon}
            tab={activeTab as EnhancedTabConfig}
            tabView={tabView}
            unpin={unpin}
          />
        </div>
      );
    }, [activeTab, activeId, active, tabView, onClose, unpin, showIcon]);

    const handleOpenChange = useCallback(
      (tab: TabDefinition) => {
        onOpenChange?.(tab);
      },
      [onOpenChange],
    );

    return (
      <DraggableTabs
        activeId={activeId}
        activeTab={activeTab}
        className={cn(
          'tabs-chrome !flex h-full w-max gap-[2px] overflow-hidden pr-6',
          contentClass,
        )}
        draggable={props.draggable}
        isDragging={isDragging}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        overlayContent={dragOverlay}
        style={style}
        tabs={tabView}
      >
        {tabView.map((tab, i) => (
          <SortableTab
            active={active}
            contentClass={cn(
              'tabs-chrome__item  translate-all group gap-[7px] relative -mr-3 flex h-full select-none items-center',
            )}
            index={i}
            key={tab.key}
            onMouseDown={onMouseDown}
            onTabClick={onTabClick}
            styleType={props.styleType || 'chrome'}
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
                  handleOpenChange(tab);
                }
              }}
            >
              <TabContent
                active={active || ''}
                onClose={onClose}
                showIcon={showIcon}
                tab={tab}
                tabView={tabView}
                unpin={unpin}
              />
            </XpressContextMenu>
          </SortableTab>
        ))}
      </DraggableTabs>
    );
  },
);

TabsChrome.displayName = 'TabsChrome';
