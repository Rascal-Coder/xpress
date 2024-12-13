import type { MenuItemClicked, MenuItemRegistered, MenuProps } from '../types';

import { useNamespace } from '@xpress-core/hooks';
import { Ellipsis } from '@xpress-core/icons';
import { cn, isHttpUrl } from '@xpress-core/shared/utils';

import { useSize } from 'ahooks';
import { produce } from 'immer';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  MenuContext,
  type MenuContextType,
  MenuSymbols,
  SubMenuContext,
  type SubMenuContextType,
} from '../contexts';
import { useMenuStyle } from '../hooks';
import SubMenu from '../submenu';

import './styles.module.scss';

interface Props extends MenuProps {}

export default function Menu(props: Props) {
  const {
    accordion = true,
    collapse = false,
    defaultActive = '',
    defaultOpeneds,
    mode = 'vertical',
    onClose,
    onOpen,
    onSelect,
    rounded = true,
    theme = 'dark',
    children,
  } = props;
  const { b, is } = useNamespace('menu');
  const menuRef = useRef<HTMLUListElement>(null);
  const menuStyle = useMenuStyle();
  const [sliceIndex, setSliceIndex] = useState(-1);
  const [openedMenus, setOpenedMenus] = useState(
    defaultOpeneds && !collapse ? [...defaultOpeneds] : [],
  );
  const [activePath, setActivePath] = useState(defaultActive);
  const [items, setItems] = useState<MenuContextType['items']>({});
  const [subMenus, setSubMenus] = useState<MenuContextType['subMenus']>({});
  const mouseInChild = useRef(false);

  const isMenuPopup = useMemo(() => {
    return mode === 'horizontal' || (mode === 'vertical' && collapse);
  }, [collapse, mode]);

  const childrenArray = React.Children.toArray(children);
  const defaultChildren =
    sliceIndex === -1 ? childrenArray : childrenArray.slice(0, sliceIndex);
  const moreChildren = sliceIndex === -1 ? [] : childrenArray.slice(sliceIndex);

  const getActivePaths = useCallback(() => {
    const activeItem = activePath && items[activePath];

    if (!activeItem || mode === 'horizontal' || collapse) {
      return [];
    }

    return activeItem.parentPaths;
  }, [activePath, items, mode, collapse]);
  /**
   * 点击展开菜单
   */
  const openMenu = useCallback(
    (path: string, parentPaths: string[]) => {
      if (openedMenus.includes(path)) {
        return;
      }
      // 手风琴模式菜单
      if (accordion) {
        const activeParentPaths = getActivePaths();
        if (activeParentPaths.includes(path)) {
          parentPaths = activeParentPaths;
        }
        setOpenedMenus(
          openedMenus.filter((path: string) => parentPaths.includes(path)),
        );
      }
      setOpenedMenus([...openedMenus, path]);
      onOpen?.(path, parentPaths);
    },
    [openedMenus, onOpen, accordion, getActivePaths],
  );

  const close = useCallback(
    (path: string) => {
      const i = openedMenus.indexOf(path);

      if (i !== -1) {
        setOpenedMenus(openedMenus.filter((p) => p !== path));
      }
    },
    [openedMenus],
  );

  /**
   * 关闭、折叠菜单
   */
  const closeMenu = useCallback(
    (path: string, parentPaths: string[]) => {
      if (accordion) {
        setOpenedMenus(subMenus[path]?.parentPaths ?? []);
      }

      close(path);

      onClose?.(path, parentPaths);
    },
    [accordion, close, onClose, subMenus],
  );
  const addMenuItem = useCallback((item: MenuItemRegistered) => {
    setItems(
      produce((draft) => {
        draft[item.path] = item;
      }),
    );
  }, []);

  const addSubMenu = useCallback((subMenu: MenuItemRegistered) => {
    setSubMenus(
      produce((draft) => {
        draft[subMenu.path] = subMenu;
      }),
    );
  }, []);

  const removeSubMenu = useCallback((subMenu: MenuItemRegistered) => {
    setSubMenus(
      produce((draft) => {
        Reflect.deleteProperty(draft, subMenu.path);
      }),
    );
  }, []);

  const removeMenuItem = useCallback((item: MenuItemRegistered) => {
    setItems(
      produce((draft) => {
        Reflect.deleteProperty(draft, item.path);
      }),
    );
  }, []);

  const handleSubMenuClick = useCallback(
    ({ parentPaths, path }: MenuItemRegistered) => {
      const isOpened = openedMenus.includes(path);

      if (isOpened) {
        closeMenu(path, parentPaths);
      } else {
        openMenu(path, parentPaths);
      }
    },

    [closeMenu, openMenu, openedMenus],
  );

  const handleMenuItemClick = useCallback(
    (data: MenuItemClicked) => {
      if (mode === 'horizontal' || collapse) {
        setOpenedMenus([]);
      }
      const { parentPaths, path } = data;
      if (!path || !parentPaths) {
        return;
      }
      if (!isHttpUrl(path)) {
        setActivePath(path);
      }

      onSelect?.(path, parentPaths);
    },
    [mode, collapse, setActivePath, onSelect],
  );
  /**
   * 初始化菜单
   */
  const initMenu = useCallback(() => {
    const parentPaths = getActivePaths();

    // 展开该菜单项的路径上所有子菜单
    // expand all subMenus of the menu item
    parentPaths.forEach((path) => {
      const subMenu = subMenus[path];
      subMenu && openMenu(path, subMenu.parentPaths);
    });
  }, [subMenus, getActivePaths, openMenu]);

  const updateActiveName = useCallback(
    (val: string) => {
      const itemsInData = items;
      const item =
        itemsInData[val] ||
        (activePath && itemsInData[activePath]) ||
        itemsInData[defaultActive || ''];

      setActivePath(item ? item.path : val);
    },
    [items, activePath, defaultActive],
  );

  function calcMenuItemWidth(menuItem: HTMLElement) {
    const computedStyle = getComputedStyle(menuItem);
    const marginLeft = Number.parseInt(computedStyle.marginLeft, 10);
    const marginRight = Number.parseInt(computedStyle.marginRight, 10);
    return menuItem.offsetWidth + marginLeft + marginRight || 0;
  }
  const calcSliceIndex = useCallback(() => {
    if (!menuRef.current) {
      return -1;
    }
    const items = [...menuRef.current.children] as HTMLElement[];

    const moreItemWidth = 46;
    const computedMenuStyle = getComputedStyle(menuRef.current);

    const paddingLeft = Number.parseInt(computedMenuStyle.paddingLeft, 10);
    const paddingRight = Number.parseInt(computedMenuStyle.paddingRight, 10);
    const menuWidth = menuRef.current?.clientWidth - paddingLeft - paddingRight;

    let calcWidth = 0;
    let sliceIndex = 0;
    items.forEach((item, index) => {
      calcWidth += calcMenuItemWidth(item);
      if (calcWidth <= menuWidth - moreItemWidth) {
        sliceIndex = index + 1;
      }
    });
    return sliceIndex === items.length ? -1 : sliceIndex;
  }, [menuRef]);

  const size = useSize(mode === 'horizontal' ? menuRef : null);
  const isFirstTimeRenderRef = useRef(true);
  const updateSliceIndex = useCallback(() => {
    setSliceIndex(-1);
    requestAnimationFrame(() => {
      setSliceIndex(calcSliceIndex());
    });
  }, [calcSliceIndex]);
  const handleResize = useCallback(() => {
    if (sliceIndex === calcSliceIndex()) {
      return;
    }

    if (isFirstTimeRenderRef.current) {
      updateSliceIndex();
      isFirstTimeRenderRef.current = false;
    } else {
      requestAnimationFrame(() => {
        setSliceIndex(calcSliceIndex());
      });
    }
  }, [sliceIndex, calcSliceIndex, updateSliceIndex]);

  useEffect(() => {
    if (collapse) {
      setOpenedMenus([]);
    }
  }, [collapse]);

  useEffect(() => {
    if (!items[defaultActive]) {
      setActivePath(defaultActive);
    }
    updateActiveName(defaultActive);
  }, [defaultActive, items, updateActiveName]);
  useEffect(() => {
    if (mode === 'horizontal' && size) {
      handleResize();
    }
  }, [size, mode, handleResize]);
  useEffect(() => {
    initMenu();
  }, [initMenu]);
  const baseProviderValue = useMemo(() => {
    return {
      addSubMenu,
      mouseInChild,
      removeSubMenu,
    };
  }, [addSubMenu, mouseInChild, removeSubMenu]);

  const menuProviderValue = useMemo<MenuContextType>(() => {
    return {
      ...baseProviderValue,
      activePath,
      addMenuItem,
      closeMenu,
      handleMenuItemClick,
      handleSubMenuClick,
      isMenuPopup,
      openedMenus,
      openMenu,
      path: '/',
      props,
      removeMenuItem,
      subMenus,
      theme,
      type: MenuSymbols.MENU,
      items,
    };
  }, [
    baseProviderValue,
    activePath,
    addMenuItem,
    closeMenu,
    handleMenuItemClick,
    handleSubMenuClick,
    isMenuPopup,
    openedMenus,
    openMenu,
    props,
    removeMenuItem,
    subMenus,
    theme,
    items,
  ]);

  const subMenuProviderValue = useMemo<SubMenuContextType>(() => {
    return {
      ...baseProviderValue,
      level: 1,
      parent: menuProviderValue,
      path: '/',
      type: MenuSymbols.SUBMENU,
    };
  }, [baseProviderValue, menuProviderValue]);
  return (
    <MenuContext.Provider value={menuProviderValue}>
      <SubMenuContext.Provider value={subMenuProviderValue}>
        <ul
          className={cn(
            theme,
            b(),
            is(mode, true),
            is(theme, true),
            is('rounded', rounded),
            is('collapse', collapse),
          )}
          ref={menuRef}
          role="menu"
          style={menuStyle}
        >
          {mode === 'horizontal' && moreChildren.length > 0 ? (
            <>
              {defaultChildren}
              <SubMenu
                path="sub-menu-more"
                title={<Ellipsis className={'size-4'} />}
              >
                {moreChildren}
              </SubMenu>
            </>
          ) : (
            children
          )}
        </ul>
      </SubMenuContext.Provider>
    </MenuContext.Provider>
  );
}
