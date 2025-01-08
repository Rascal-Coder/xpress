// context.ts
import type { MenuItemClicked, MenuItemRegistered, MenuProps } from './types';

import { createContext } from 'react';

interface ClickHandler {
  handleClick: (data: MenuItemClicked) => void;
}

// MenuItem 类型
interface RegisteredMenu extends MenuItemRegistered, ClickHandler {}
interface SubMenu extends RegisteredMenu {
  handleMouseleave?: (deepDispatch: boolean) => void;
  mouseInChild: boolean;
  setMouseInChild: (mouseInChild: boolean) => void;
}
interface MenuContextType {
  activePath: string;
  closeMenu: (path: string, parentPaths: string[]) => void;
  isMenuPopup: boolean;
  items: Record<string, RegisteredMenu>;
  openedMenus: string[];
  openMenu: (path: string, parentPaths: string[]) => void;
  props: MenuProps;
  subMenus: Record<string, SubMenu>;
  theme: string;
}

// Context 创建和 hooks
export const MenuContext = createContext<MenuContextType>(
  {} as MenuContextType,
);

export type { MenuContextType };
