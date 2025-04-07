import { Pin, X } from '@xpress-core/icons';
import { XpressContextMenu, XpressIcon } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import { memo, useMemo } from 'react';
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

  // 使用自定义hook处理拖拽逻辑
  const { activeId, activeTab, handleDragEnd, handleDragStart, isDragging } =
    useDraggableTabs({
      onSort,
      tabs: tabView,
    });

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
      onClose?.(tab as TabDefinition);
    }
  }

  function onTabClick(tab: TabDefinition) {
    onClick?.(tab);
  }

  // 渲染标签页内容
  const renderTabContent = (tab: TabConfig) => {
    if (!tab) return null;

    const isActiveTab = tab.key === active;

    return (
      <div className="relative size-full px-1">
        {/* 标签分隔线 - 仅在非激活状态显示 */}
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

        {/* 标签主体内容 */}
        <div
          className={cn(
            'tabs-chrome__item-main mx-[calc(var(--gap)*2)] my-0 flex h-full items-center overflow-hidden rounded-tl-[5px] rounded-tr-[5px] pl-2 pr-4 duration-150',
            isActiveTab &&
              'group-[.is-active]:text-primary dark:group-[.is-active]:text-accent-foreground text-accent-foreground',
          )}
        >
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
    );
  };

  // 拖拽预览的Overlay内容
  const dragOverlay = activeTab && (
    <div
      className={cn(
        'tabs-chrome__item draggable translate-all group relative -mr-3 flex h-full select-none items-center opacity-80',
        activeId === active && 'is-active',
        activeId !== active && 'bg-background !mx-0 rounded-md !p-0 shadow-lg',
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
                onOpenChange?.(tab);
              }
            }}
          >
            {/* 展示标签内容 */}
            <div className="group relative size-full px-1">
              {i !== 0 && tab.key !== active && (
                <div className="tabs-chrome__divider bg-border absolute left-[var(--gap)] top-1/2 z-0 h-4 w-[1px] translate-y-[-50%] transition-all"></div>
              )}
              <div
                className={cn(
                  'tabs-chrome__background absolute z-[-1] size-full px-[calc(var(--gap)-1px)] py-0 transition-opacity duration-150',
                  tab.key !== active && 'group-hover:pb-[2px]',
                )}
              >
                <div
                  className={cn(
                    'tabs-chrome__background-content group-[.is-active]:bg-primary/15 dark:group-[.is-active]:bg-accent h-full rounded-tl-[var(--gap)] rounded-tr-[var(--gap)] duration-150',
                    tab.key !== active &&
                      'group-hover:bg-accent group-hover:rounded-sm',
                  )}
                ></div>
                <TabBackground isActive={tab.key === active} key={tab.key} />
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

              <div className="tabs-chrome__item-main group-[.is-active]:text-primary dark:group-[.is-active]:text-accent-foreground text-accent-foreground mx-[calc(var(--gap)*2)] my-0 flex h-full !cursor-pointer items-center overflow-hidden rounded-tl-[5px] rounded-tr-[5px] pl-2 pr-4 duration-150">
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
    </DraggableTabs>
  );
}
