import { createContext, useContext } from 'react';

export interface MenuItemRegistered {
  active: boolean;
  parentPaths: string[];
  path: string;
}

export interface MenuItemClicked {
  parentPaths: string[];
  path: string;
}

export interface MenuContextType {
  activePath: string;
  addMenuItem: (item: MenuItemRegistered) => void;
  addSubMenu: (item: MenuItemRegistered) => void;
  closeMenu: (path: string, parentLinks: string[]) => void;
  handleMenuItemClick: (item: MenuItemClicked) => void;
  handleSubMenuClick: (subMenu: MenuItemRegistered) => void;
  isMenuPopup: boolean;
  items: Record<string, MenuItemRegistered>;
  openedMenus: string[];
  openMenu: (path: string, parentLinks: string[]) => void;
  removeMenuItem: (item: MenuItemRegistered) => void;

  removeSubMenu: (item: MenuItemRegistered) => void;
  subMenus: Record<string, MenuItemRegistered>;
  theme: string;
}

export interface SubMenuContextType {
  addSubMenu: (item: MenuItemRegistered) => void;
  handleMouseleave?: (deepDispatch: boolean) => void;
  level: number;
  mouseInChild: boolean;
  removeSubMenu: (item: MenuItemRegistered) => void;
}

export const MenuContext = createContext<MenuContextType | undefined>(
  undefined,
);
export const SubMenuContext = createContext<SubMenuContextType | undefined>(
  undefined,
);

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenuContext must be used within a MenuProvider');
  }
  return context;
};

export const useSubMenuContext = () => {
  const context = useContext(SubMenuContext);
  if (!context) {
    throw new Error('useSubMenuContext must be used within a SubMenuProvider');
  }
  return context;
};
