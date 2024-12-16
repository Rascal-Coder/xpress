/* eslint-disable @typescript-eslint/no-unused-vars */
import type { SubMenuProps } from '../types';

import { useNamespace } from '@xpress-core/hooks';
import { XpressHoverCard } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import CollapseTransition from '../collapse-transition';
import {
  type MenuContextType,
  MenuSymbols,
  SubMenuContext,
  type SubMenuContextType,
} from '../contexts';
import {
  useMenu,
  useMenuContext,
  useMenuStyle,
  useSubMenuContext,
} from '../hooks';
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
  const { parentMenu, parentPaths } = useMenu();
  const { b, is } = useNamespace('sub-menu');
  const nsMenu = useNamespace('menu');
  const rootMenu = useMenuContext();
  const subMenu = useSubMenuContext();
  const subMenuStyle = useMenuStyle(subMenu);

  const mouseInChild = useRef(false);

  const [items, setItems] = useState<MenuContextType['items']>({});
  const [subMenus, setSubMenus] = useState<MenuContextType['subMenus']>({});
  const timer = useRef<null | ReturnType<typeof setTimeout>>(null);
  // 确保必需的值存在
  if (!rootMenu) {
    throw new Error('SubMenu must be used within a Menu component');
  }

  const opened = useMemo(() => {
    return rootMenu?.openedMenus.includes(path);
  }, [path, rootMenu?.openedMenus]);
  const isTopLevelMenuSubmenu = useMemo(() => {
    return parentMenu?.type === MenuSymbols.MENU;
  }, [parentMenu?.type]);
  const mode = useMemo(() => {
    return rootMenu?.props.mode ?? 'vertical';
  }, [rootMenu?.props.mode]);

  const rounded = useMemo(() => {
    return rootMenu?.props.rounded;
  }, [rootMenu?.props.rounded]);

  const currentLevel = useMemo(() => {
    return subMenu?.level ?? 0;
  }, [subMenu?.level]);

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

  const active = useMemo(() => {
    let isActive = false;

    Object.values(items).forEach((item) => {
      if (item.active) {
        isActive = true;
      }
    });

    Object.values(subMenus).forEach((subItem) => {
      if (subItem.active) {
        isActive = true;
      }
    });
    return isActive;
  }, [items, subMenus]);

  /**
   * 点击submenu展开/关闭
   */
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

    rootMenu?.handleSubMenuClick({
      active,
      parentPaths,
      path,
    });
  }
  const subMenuRef = useRef<HTMLLIElement>(null);
  const handleMouseEnter = useCallback(
    (event: React.FocusEvent | React.MouseEvent, showTimeout = 300) => {
      // 忽略 focus 事件
      if (event.type === 'focus') {
        return;
      }

      // 检查是否应该处理鼠标进入
      if (
        (!rootMenu?.props.collapse && rootMenu?.props.mode === 'vertical') ||
        disabled
      ) {
        if (subMenu) {
          subMenu.mouseInChild.current = true;
        }
        return;
      }

      // 更新鼠标状态
      if (subMenu) {
        subMenu.mouseInChild.current = true;
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
    [disabled, subMenu, rootMenu, path, parentPaths],
  );
  function handleMouseleave(deepDispatch = false) {
    if (
      !rootMenu?.props.collapse &&
      rootMenu?.props.mode === 'vertical' &&
      subMenu
    ) {
      subMenu.mouseInChild.current = false;
      return;
    }

    timer.current && window.clearTimeout(timer.current);

    if (subMenu) {
      subMenu.mouseInChild.current = false;
    }
    timer.current = setTimeout(() => {
      !mouseInChild.current && rootMenu?.closeMenu(path, parentPaths);
    }, 300);

    if (deepDispatch) {
      subMenu?.handleMouseleave?.(true);
    }
  }
  const menuIcon = useMemo(() => {
    return active ? activeIcon || icon : icon;
  }, [active, activeIcon, icon]);

  useEffect(() => {
    subMenu?.addSubMenu({
      active,
      parentPaths,
      path,
    });
    rootMenu?.addSubMenu({
      active,
      parentPaths,
      path,
    });
    return () => {
      subMenu?.removeSubMenu({
        active,
        parentPaths,
        path,
      });
      rootMenu?.removeSubMenu({
        active,
        parentPaths,
        path,
      });
    };
  }, [active, menuIcon, parentPaths, path, rootMenu, subMenu]);
  const subMenuProviderValue = useMemo<SubMenuContextType>(() => {
    return {
      addSubMenu: subMenu?.addSubMenu ?? rootMenu.addSubMenu,
      handleParentMouseEnter: handleMouseEnter,
      level: (subMenu?.level ?? 0) + 1,
      mouseInChild,
      parent: subMenu ?? rootMenu,
      path,
      removeSubMenu: subMenu?.removeSubMenu ?? rootMenu.removeSubMenu,
      type: MenuSymbols.SUBMENU,
    };
  }, [subMenu, rootMenu, handleMouseEnter, path]);

  return (
    <SubMenuContext.Provider value={subMenuProviderValue}>
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
                onClick={handleClick}
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
              onClick={handleClick}
              path={path}
              title={title}
            />
            {content}
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
    </SubMenuContext.Provider>
  );
}

export default SubMenu;
