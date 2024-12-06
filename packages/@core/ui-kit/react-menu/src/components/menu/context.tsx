import { createContext, useContext } from 'react';

interface MenuItemRegistered {
  parentPaths: string[];
  path: string;
}

interface MenuContextValue {
  activePath?: string;
  addMenuItem: (item: MenuItemRegistered) => void;
  addSubMenu: (subMenu: MenuItemRegistered) => void;
  closeMenu: (path: string, parentPaths: string[]) => void;
  handleMenuItemClick: (data: MenuItemRegistered) => void;
  handleSubMenuClick: (data: MenuItemRegistered) => void;
  isMenuPopup: boolean;
  items: Record<string, MenuItemRegistered>;
  mouseInChild: boolean;
  openedMenus: string[];
  openMenu: (path: string, parentPaths: string[]) => void;
  removeMenuItem: (item: MenuItemRegistered) => void;
  removeSubMenu: (subMenu: MenuItemRegistered) => void;
  subMenus: Record<string, MenuItemRegistered>;
  theme: 'dark' | 'light';
}

export const MenuContext = createContext<MenuContextValue | null>(null);

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}

export interface SubMenuContextValue {
  addSubMenu: (subMenu: MenuItemRegistered) => void;
  level: number;
  mouseInChild: boolean;
  removeSubMenu: (subMenu: MenuItemRegistered) => void;
}

export const SubMenuContext = createContext<null | SubMenuContextValue>(null);

export function useSubMenu() {
  const context = useContext(SubMenuContext);
  if (!context) {
    throw new Error('useSubMenu must be used within a SubMenuProvider');
  }
  return context;
}
