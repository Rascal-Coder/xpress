import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface MenuItemRegistered {
  active: boolean;
  parentPaths: string[];
  path: string;
}
interface MenuContextValue {
  activePath?: string;
  addMenuItem?: (item: MenuItemRegistered) => void;
  handleMenuItemClick?: (item: { parentPaths: string[]; path: string }) => void;
  items: Record<string, MenuItemRegistered>;
  props?: {
    collapse?: boolean;
    collapseShowTitle?: boolean;
    mode?: 'horizontal' | 'vertical';
  };
  removeMenuItem?: (item: MenuItemRegistered) => void;
  theme?: string;
}

interface SubMenuContextValue {
  addSubMenu?: (item: MenuItemRegistered) => void;
  isTopLevel: boolean;
  level: number;
  parentPath?: string;
  removeSubMenu?: (item: MenuItemRegistered) => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);
const SubMenuContext = createContext<null | SubMenuContextValue>(null);

interface MenuProviderProps {
  children: React.ReactNode;
  collapse?: boolean;
  collapseShowTitle?: boolean;
  defaultActive?: string;
  mode?: 'horizontal' | 'vertical';
  theme?: string;
}

export function MenuProvider({
  collapse = false,
  collapseShowTitle = false,
  defaultActive,
  mode = 'vertical',
  theme = '',
  children,
}: MenuProviderProps) {
  const [activePath, setActivePath] = useState<string | undefined>(
    defaultActive,
  );
  const [items, setItems] = useState<Record<string, MenuItemRegistered>>({});
  const itemsRef = useRef<Record<string, MenuItemRegistered>>(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const addMenuItem = useCallback((item: MenuItemRegistered) => {
    setItems((prev) => ({ ...prev, [item.path]: item }));
  }, []);

  const removeMenuItem = useCallback((item: MenuItemRegistered) => {
    setItems((prev) => {
      const { [item.path]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const handleMenuItemClick = useCallback(
    (item: { parentPaths: string[]; path: string }) => {
      setActivePath(item.path);
    },
    [],
  );

  const value = useMemo(
    () => ({
      activePath,
      addMenuItem,
      handleMenuItemClick,
      props: {
        collapse,
        collapseShowTitle,
        mode,
      },
      removeMenuItem,
      theme,
      items,
    }),
    [
      activePath,
      theme,
      mode,
      collapse,
      collapseShowTitle,
      items,
      addMenuItem,
      removeMenuItem,
      handleMenuItemClick,
    ],
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

interface SubMenuProviderProps {
  children: React.ReactNode;
  isTopLevel?: boolean;
  level: number;
  path?: string;
}

export function SubMenuProvider({
  isTopLevel = false,
  level,
  path,
  children,
}: SubMenuProviderProps) {
  const [items, setItems] = useState<Record<string, MenuItemRegistered>>({});
  const itemsRef = useRef<Record<string, MenuItemRegistered>>(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const addSubMenu = useCallback((item: MenuItemRegistered) => {
    setItems((prev) => ({ ...prev, [item.path]: item }));
  }, []);

  const removeSubMenu = useCallback((item: MenuItemRegistered) => {
    // setItems((prev) => {
    //   const next = { ...prev };
    //   delete next[item.path];
    //   return next;
    // });
    setItems((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([key]) => key !== item.path),
      ),
    );
  }, []);

  const value = useMemo(
    () => ({
      addSubMenu,
      isTopLevel,
      level,
      parentPath: path,
      removeSubMenu,
      items,
    }),
    [level, path, isTopLevel, items, addSubMenu, removeSubMenu],
  );

  return (
    <SubMenuContext.Provider value={value}>{children}</SubMenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}

export function useSubMenu() {
  const context = useContext(SubMenuContext);
  if (!context) {
    throw new Error('useSubMenu must be used within a SubMenuProvider');
  }
  return context;
}

export function useParentPaths() {
  const _menu = useMenu();
  const subMenu = useSubMenu();
  const paths = useMemo(() => {
    const result: string[] = [];
    if (subMenu.parentPath) {
      result.push(subMenu.parentPath);
    }
    return result;
  }, [subMenu.parentPath]);

  return paths;
}

export function useIsTopLevelMenuItem() {
  const subMenu = useSubMenu();
  return subMenu.isTopLevel;
}

export function useShowTooltip(hasTitle: boolean) {
  const menu = useMenu();
  const isTopLevel = useIsTopLevelMenuItem();

  return useMemo(
    () =>
      menu.props?.mode === 'vertical' &&
      isTopLevel &&
      menu.props.collapse &&
      hasTitle,
    [menu.props?.mode, menu.props?.collapse, isTopLevel, hasTitle],
  );
}

export function useCollapseShowTitle() {
  const menu = useMenu();
  const isTopLevel = useIsTopLevelMenuItem();

  return useMemo(
    () => menu.props?.collapseShowTitle && isTopLevel && menu.props.collapse,
    [menu.props?.collapseShowTitle, menu.props?.collapse, isTopLevel],
  );
}
