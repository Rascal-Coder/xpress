import type { SubMenuProps } from '../types';

import { useNamespace } from '@xpress-core/hooks';
import { XpressHoverCard } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import { useCallback, useMemo, useRef } from 'react';

import CollapseTransition from '../collapse-transition';
import { useMenuContext, useMenuStyle } from '../hooks';
import SubMenuContent from '../sub-menu-content';

interface Props extends SubMenuProps {
  className?: string;
  isSubMenuMore?: boolean;
}

function SubMenu({
  activeIcon,
  className,
  disabled = false,
  icon,
  isSubMenuMore = false,
  path,
  title,
  children,
}: Props) {
  const { b, is } = useNamespace('sub-menu');
  const nsMenu = useNamespace('menu');
  const rootMenu = useMenuContext();
  const currentSubMenu = rootMenu?.subMenus[path];
  const parentPaths = useMemo(
    () => currentSubMenu?.parentPaths ?? [],
    [currentSubMenu?.parentPaths],
  );
  const level = useMemo(() => {
    const level = parentPaths.length - 1;
    return level;
  }, [parentPaths.length]);
  const subMenuStyle = useMenuStyle(level);

  const mouseInChild = useRef(false);
  const timer = useRef<null | ReturnType<typeof setTimeout>>(null);

  const opened = useMemo(() => {
    return rootMenu?.openedMenus.includes(path);
  }, [path, rootMenu?.openedMenus]);

  const active = useMemo(() => {
    const hasActiveItem = Object.values(rootMenu.items).some(
      (item) => item.parentPaths.includes(path) && item.active,
    );
    const hasActiveSubMenu = currentSubMenu?.active;
    return hasActiveItem || hasActiveSubMenu;
  }, [currentSubMenu?.active, path, rootMenu.items]);

  // TODO: 需要修改 找到父节点 type=== Menu
  const isTopLevelMenuSubmenu = useMemo(() => {
    return parentPaths.length - 1 === 0;
  }, [parentPaths.length]);

  const mode = useMemo(() => {
    return rootMenu?.props.mode ?? 'vertical';
  }, [rootMenu?.props.mode]);

  const rounded = useMemo(() => {
    return rootMenu?.props.rounded;
  }, [rootMenu?.props.rounded]);

  const currentLevel = useMemo(() => {
    return parentPaths.length;
  }, [parentPaths.length]);

  const isFirstLevel = useMemo(() => {
    return currentLevel === 1;
  }, [currentLevel]);

  const contentProps = useMemo(() => {
    const isHorizontal = mode === 'horizontal';
    const side = isHorizontal && isFirstLevel ? 'bottom' : 'right';
    return {
      collisionPadding: { top: 20 },
      side: side as 'bottom' | 'right',
      sideOffset: isHorizontal ? 5 : 10,
    };
  }, [isFirstLevel, mode]);

  const menuIcon = useMemo(() => {
    return active ? activeIcon || icon : icon;
  }, [active, activeIcon, icon]);

  function handleClick() {
    const mode = rootMenu?.props.mode;
    if (
      // 当前菜单禁用时，不展开
      disabled ||
      (rootMenu?.props.collapse && mode === 'vertical') ||
      // 水平模式下不展开
      mode === 'horizontal'
    ) {
      return;
    }
    currentSubMenu?.handleClick?.({
      parentPaths,
      path,
    });
  }
  const subMenuRef = useRef<HTMLLIElement | null>(null);
  const handleMouseEnter = useCallback(
    (event: React.FocusEvent | React.MouseEvent, showTimeout = 100) => {
      // 忽略 focus 事件
      if (event.type === 'focus') {
        return;
      }

      // 检查是否应该处理鼠标进入
      if (
        (!rootMenu?.props.collapse && rootMenu?.props.mode === 'vertical') ||
        disabled
      ) {
        if (currentSubMenu) {
          currentSubMenu.setMouseInChild(true);
        }
        return;
      }

      // 更新鼠标状态
      if (currentSubMenu) {
        currentSubMenu.setMouseInChild(true);
      }

      // 清除现有定时器
      if (timer.current) {
        window.clearTimeout(timer.current);
      }

      // 设置新的定时器来打开菜单
      timer.current = window.setTimeout(() => {
        rootMenu?.openMenu(path, parentPaths);
      }, showTimeout);

      // 触发父元素的鼠标进入事件
      const parentElement = subMenuRef.current?.parentElement;
      if (parentElement) {
        const mouseEvent = new MouseEvent('mouseenter', {
          bubbles: true,
          cancelable: true,
          view: window,
        });
        parentElement.dispatchEvent(mouseEvent);
      }
    },
    [rootMenu, disabled, currentSubMenu, timer, subMenuRef, path, parentPaths],
  );

  // TODO: 需要修改
  function handleMouseleave(deepDispatch = false) {
    if (
      !rootMenu?.props.collapse &&
      rootMenu?.props.mode === 'vertical' &&
      currentSubMenu
    ) {
      currentSubMenu.setMouseInChild(false);
      return;
    }

    timer.current && window.clearTimeout(timer.current);

    if (currentSubMenu) {
      currentSubMenu.setMouseInChild(false);
    }
    timer.current = setTimeout(() => {
      !mouseInChild.current && rootMenu?.closeMenu(path, parentPaths);
    }, 100);
    // 如果需要深度传递，则调用父级子菜单的handleMouseleave
    if (deepDispatch) {
      // 获取父级子菜单
      const parentPath = parentPaths[parentPaths.length - 2];
      const parentSubMenu = parentPath ? rootMenu?.subMenus[parentPath] : null;

      if (parentSubMenu?.handleMouseleave) {
        // 触发父级子菜单的鼠标离开事件
        parentSubMenu.handleMouseleave(true);
      }
    }
  }
  return (
    <li
      className={cn(
        b(),
        is('opened', opened),
        is('active', active),
        is('disabled', disabled),
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => handleMouseleave()}
      ref={subMenuRef}
    >
      {rootMenu.isMenuPopup ? (
        <XpressHoverCard
          contentClass={cn(
            rootMenu.theme,
            nsMenu.e('popup-container'),
            is(rootMenu.theme, true),
            opened ? '' : 'hidden',
          )}
          contentProps={contentProps}
          open
          openDelay={0}
          trigger={
            <SubMenuContent
              className={cn(is('active', active))}
              icon={menuIcon}
              isMenuMore={isSubMenuMore}
              isTopLevelMenuSubMenu={isTopLevelMenuSubmenu}
              level={currentLevel}
              menuItemClick={handleClick}
              path={path}
              title={title}
            />
          }
        >
          <div
            className={cn(nsMenu.e('popup'), nsMenu.is(mode, true))}
            onFocus={(e) => handleMouseEnter(e, 100)}
            onMouseEnter={(e) => handleMouseEnter(e, 100)}
            onMouseLeave={() => handleMouseleave(true)}
          >
            <ul
              className={cn(nsMenu.b(), is('rounded', rounded))}
              style={subMenuStyle}
            >
              {children}
            </ul>
          </div>
        </XpressHoverCard>
      ) : (
        <>
          <SubMenuContent
            className={cn(is('active', active))}
            icon={menuIcon}
            isMenuMore={isSubMenuMore}
            isTopLevelMenuSubMenu={isTopLevelMenuSubmenu}
            level={currentLevel}
            menuItemClick={handleClick}
            path={path}
            title={title}
          />
          {/* {content}2222222222 */}
          {opened && (
            <CollapseTransition>
              <ul
                className={cn(nsMenu.b(), is('rounded', rounded))}
                style={subMenuStyle}
              >
                {children}
              </ul>
            </CollapseTransition>
          )}
        </>
      )}
    </li>
  );
}

export default SubMenu;
