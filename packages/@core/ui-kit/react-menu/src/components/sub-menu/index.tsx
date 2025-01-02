import type { SubMenuProps } from '../types';

import { useNamespace } from '@xpress-core/hooks';
import { XpressHoverCard } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import CollapseTransition from '../collapse-transition';
import {
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
  const timer = useRef<null | ReturnType<typeof setTimeout>>(null);
  // 确保必需的值存在
  if (!rootMenu) {
    throw new Error('SubMenu must be used within a Menu component');
  }

  const opened = useMemo(() => {
    return rootMenu?.openedMenus.includes(path);
  }, [path, rootMenu?.openedMenus]);

  const active = useMemo(() => {
    const hasActiveItem = Object.values(rootMenu.items).some(
      (item) => item.active,
    );
    const hasActiveSubMenu = Object.values(rootMenu.subMenus).some(
      (subMenu) => subMenu.active,
    );
    return hasActiveItem || hasActiveSubMenu;
  }, [rootMenu.items, rootMenu.subMenus]);

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

    rootMenu?.handleSubMenuClick({
      active,
      parentPaths,
      path,
    });
  }
  const subMenuRef = useRef<HTMLLIElement | null>(null);
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
    [rootMenu, disabled, subMenu, timer, subMenuRef, path, parentPaths],
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
  // TODO
  // const subMenuInfo = useRef({
  //   active,
  //   parentPaths,
  //   path,
  // });
  // useEffect(() => {
  //   rootMenu?.addSubMenu(subMenuInfo.current);
  //   subMenu.addSubMenu(subMenuInfo.current);
  //   return () => {
  //     rootMenu?.removeSubMenu(subMenuInfo.current);
  //     subMenu.removeSubMenu(subMenuInfo.current);
  //   };
  // }, [parentPaths, path, rootMenu, subMenu]);

  // const [subMenuData, setSubMenuData] = useState({
  //   active: false,
  //   parentPaths: [] as string[],
  //   path: '',
  // });

  // useEffect(() => {
  //   setSubMenuData({ active, parentPaths, path });
  // }, [active, parentPaths, path]);

  // 使用 useRef 存储注册数据
  const registryData = useRef({
    active: false,
    parentPaths: [] as string[],
    path: '',
  });

  // 更新数据但不触发重渲染
  useEffect(() => {
    registryData.current = {
      active,
      parentPaths,
      path,
    };
  }, [active, parentPaths, path]);

  // 只在挂载和卸载时注册/注销
  useEffect(() => {
    rootMenu?.addSubMenu(registryData.current);
    subMenu.addSubMenu(registryData.current);

    return () => {
      rootMenu?.removeSubMenu(registryData.current);
      subMenu.removeSubMenu(registryData.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 空依赖数组，只在挂载和卸载时执行

  const subMenuProviderValue = useMemo<SubMenuContextType>(
    () => ({
      addSubMenu: rootMenu.addSubMenu,
      handleParentMouseEnter: handleMouseEnter,
      level: (subMenu?.level ?? 0) + 1,
      mouseInChild,
      parent: parentMenu,
      path,
      removeSubMenu: rootMenu.removeSubMenu,
      type: MenuSymbols.SUBMENU,
    }),
    [
      rootMenu.addSubMenu,
      rootMenu.removeSubMenu,
      handleMouseEnter,
      subMenu?.level,
      mouseInChild,
      parentMenu,
      path,
    ],
  );

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
