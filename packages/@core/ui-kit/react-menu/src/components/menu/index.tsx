import { useNamespace } from '@xpress-core/hooks';
import { cn } from '@xpress-core/shared/utils';

import {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { MenuContext, SubMenuContext } from './context';
// import SubMenu from './sub-menu';

interface MenuItemRegistered {
  parentPaths: string[];
  path: string;
}

interface MenuProps {
  accordion?: boolean;
  children?: React.ReactNode;
  collapse?: boolean;
  collapseShowTitle?: boolean;
  defaultActive?: string;
  defaultOpeneds?: string[];
  mode?: 'horizontal' | 'vertical';
  onClose?: (key: string, openeds: string[]) => void;
  onOpen?: (key: string, openeds: string[]) => void;
  onSelect?: (key: string, item: string[]) => void;
  rounded?: boolean;
  theme?: 'dark' | 'light';
}

const Menu: React.FC<MenuProps> = ({
  accordion = true,
  collapse = false,
  defaultActive,
  defaultOpeneds = [],
  mode = 'vertical',
  onClose,
  onOpen,
  onSelect,
  rounded = true,
  theme = 'light' as const,
  children,
}) => {
  const { b, is } = useNamespace('menu');
  const menuRef = useRef<HTMLUListElement>(null);
  const [openedMenus, setOpenedMenus] = useState<string[]>(
    defaultOpeneds && !collapse ? [...defaultOpeneds] : [],
  );
  const [activePath, setActivePath] = useState<string | undefined>(
    defaultActive,
  );
  const [items, setItems] = useState<Record<string, MenuItemRegistered>>({});
  const [subMenus, setSubMenus] = useState<Record<string, MenuItemRegistered>>(
    {},
  );
  const [mouseInChild, _setMouseInChild] = useState(false);
  const [sliceIndex, _setSliceIndex] = useState(-1);

  const isMenuPopup = useMemo(() => {
    return mode === 'horizontal' || (mode === 'vertical' && collapse);
  }, [mode, collapse]);

  // 处理水平模式且有更多菜单项时，显示分割后的内容
  const slots = useMemo(() => {
    const childrenArray = Children.toArray(children);
    const defaultSlot =
      sliceIndex === -1 ? childrenArray : childrenArray.slice(0, sliceIndex);

    const moreSlot = sliceIndex === -1 ? [] : childrenArray.slice(sliceIndex);

    return {
      defaultSlot,
      moreSlot,
      showSlotMore: moreSlot.length > 0,
    };
  }, [children, sliceIndex]);

  // 监听折叠状态
  useEffect(() => {
    if (collapse) {
      setOpenedMenus([]);
    }
  }, [collapse]);

  const getActivePaths = useCallback(() => {
    const activeItem = activePath && items[activePath];
    if (!activeItem || mode === 'horizontal' || collapse) {
      return [];
    }
    return activeItem.parentPaths;
  }, [activePath, items, mode, collapse]);

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

  const handleMenuItemClick = useCallback(
    (data: MenuItemRegistered) => {
      if (mode === 'horizontal' || collapse) {
        setOpenedMenus([]);
      }

      const { parentPaths, path } = data;
      if (!path || !parentPaths) return;

      setActivePath(path);
      onSelect?.(path, parentPaths);
    },
    [mode, collapse, onSelect],
  );

  const closeMenu = useCallback(
    (path: string, parentPaths: string[]) => {
      if (accordion) {
        setOpenedMenus(subMenus[path]?.parentPaths ?? []);
      } else {
        setOpenedMenus((prev) => prev.filter((p) => p !== path));
      }
      onClose?.(path, parentPaths);
    },
    [accordion, subMenus, onClose],
  );

  const openMenu = useCallback(
    (path: string, parentPaths: string[]) => {
      if (openedMenus.includes(path)) return;

      if (accordion) {
        const activeParentPaths = getActivePaths();
        if (activeParentPaths.includes(path)) {
          parentPaths = activeParentPaths;
        }
        setOpenedMenus((prev) =>
          prev.filter((path: string) => parentPaths.includes(path)),
        );
      }

      setOpenedMenus((prev) => [...prev, path]);
      onOpen?.(path, parentPaths);
    },
    [accordion, openedMenus, getActivePaths, onOpen],
  );

  const handleSubMenuClick = useCallback(
    ({ parentPaths, path }: MenuItemRegistered) => {
      const isOpened = openedMenus.includes(path);
      if (isOpened) {
        closeMenu(path, parentPaths);
      } else {
        openMenu(path, parentPaths);
      }
    },
    [openedMenus, closeMenu, openMenu],
  );

  const addMenuItem = useCallback((item: MenuItemRegistered) => {
    setItems((prev) => ({ ...prev, [item.path]: item }));
  }, []);

  const addSubMenu = useCallback((subMenu: MenuItemRegistered) => {
    setSubMenus((prev) => ({ ...prev, [subMenu.path]: subMenu }));
  }, []);

  const removeMenuItem = useCallback((item: MenuItemRegistered) => {
    setItems((prev) => {
      const { [item.path]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const removeSubMenu = useCallback((subMenu: MenuItemRegistered) => {
    setSubMenus((prev) => {
      const { [subMenu.path]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // Context values
  const menuContextValue = useMemo(
    () => ({
      activePath,
      addMenuItem,
      addSubMenu,
      closeMenu,
      handleMenuItemClick,
      handleSubMenuClick,
      isMenuPopup,
      mouseInChild,
      openedMenus,
      openMenu,
      removeMenuItem,
      removeSubMenu,
      subMenus,
      theme,
      items,
    }),
    [
      activePath,
      isMenuPopup,
      openedMenus,
      theme,
      items,
      subMenus,
      mouseInChild,
      addMenuItem,
      addSubMenu,
      removeMenuItem,
      removeSubMenu,
      handleMenuItemClick,
      handleSubMenuClick,
      openMenu,
      closeMenu,
    ],
  );

  const subMenuContextValue = useMemo(
    () => ({
      addSubMenu,
      level: 1,
      mouseInChild,
      removeSubMenu,
    }),
    [mouseInChild, addSubMenu, removeSubMenu],
  );
  // Watch defaultActive
  useEffect(() => {
    if (defaultActive !== undefined) {
      if (!items[defaultActive]) {
        setActivePath('');
      }
      updateActiveName(defaultActive);
    }
  }, [defaultActive, items, updateActiveName]);
  return (
    <MenuContext.Provider value={menuContextValue}>
      <SubMenuContext.Provider value={subMenuContextValue}>
        <ul
          className={cn(
            b(),
            is(mode, true),
            is(theme, true),
            is('rounded', rounded),
            is('collapse', collapse),
          )}
          ref={menuRef}
          role="menu"
        >
          {mode === 'horizontal' && slots.showSlotMore ? (
            <>
              {slots.defaultSlot}
              {/* <SubMenu isSubMenuMore path="sub-menu-more">
                {slots.moreSlot}
              </SubMenu> */}
            </>
          ) : (
            children
          )}
        </ul>
      </SubMenuContext.Provider>
    </MenuContext.Provider>
  );
};

export default Menu;
