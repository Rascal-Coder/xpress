import type { SubMenuProps } from '../types';

import { useNamespace } from '@xpress-core/hooks';
import { XpressHoverCard } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import { useCallback, useMemo, useRef, useState } from 'react';

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
  content,
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
  const subMenuStyle = useMenuStyle(level - 1);

  const timer = useRef<null | ReturnType<typeof setTimeout>>(null);
  const [isHovering, setIsHovering] = useState(false);
  const subMenuRef = useRef<HTMLLIElement | null>(null);

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

  const currentLevel = useMemo(() => {
    return parentPaths.length;
  }, [parentPaths.length]);

  const mode = useMemo(() => {
    return rootMenu?.props.mode ?? 'vertical';
  }, [rootMenu?.props.mode]);

  const rounded = useMemo(() => {
    return rootMenu?.props.rounded;
  }, [rootMenu?.props.rounded]);

  const isFirstLevel = useMemo(() => {
    return currentLevel === 1;
  }, [currentLevel]);

  const contentProps = useMemo(() => {
    const isHorizontal = mode === 'horizontal';
    const side =
      (isHorizontal && isFirstLevel) || isSubMenuMore ? 'bottom' : 'right';
    return {
      collisionPadding: { top: 20 },
      side: side as 'bottom' | 'right',
      sideOffset: isHorizontal ? 5 : 10,
    };
  }, [isFirstLevel, isSubMenuMore, mode]);

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
      openedMenus: rootMenu?.openedMenus,
      parentPaths,
      path,
    });
  }

  const handleMouseEnter = useCallback(
    (event: React.FocusEvent | React.MouseEvent, showTimeout = 100) => {
      console.warn('Mouse entered:', { event });
      // 忽略 focus 事件
      if (event.type === 'focus') {
        return;
      }

      setIsHovering(true);
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
    },
    [rootMenu, disabled, currentSubMenu, timer, path, parentPaths],
  );

  function handleMouseleave() {
    console.warn('Mouse left');
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
      !currentSubMenu?.mouseInChild && rootMenu?.closeMenu(path, parentPaths);
      setIsHovering(false);
    }, 100);
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
      {/* mode === 'horizontal' || (mode === 'vertical' && collapse) */}
      {rootMenu.isMenuPopup ? (
        <XpressHoverCard
          contentClass={cn(
            rootMenu.theme,
            nsMenu.e('popup-container'),
            is(rootMenu.theme, true),
            opened ? '' : 'hidden',
          )}
          contentProps={contentProps}
          open={isHovering}
          openDelay={0}
          trigger={
            <SubMenuContent
              className={cn(is('active', active))}
              icon={menuIcon}
              isMenuMore={isSubMenuMore}
              isTopLevelMenuSubMenu={isFirstLevel}
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
            onMouseLeave={() => handleMouseleave()}
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
            isTopLevelMenuSubMenu={isFirstLevel}
            level={currentLevel}
            menuItemClick={handleClick}
            path={path}
            title={title}
          >
            {content}
          </SubMenuContent>
          <CollapseTransition show={opened}>
            <ul
              className={cn(nsMenu.b(), is('rounded', rounded))}
              style={subMenuStyle}
            >
              {children}
            </ul>
          </CollapseTransition>
        </>
      )}
    </li>
  );
}

export default SubMenu;
