// context.ts
import type { MenuItemClicked, MenuItemRegistered, MenuProps } from './types';

import { createContext } from 'react';

// 集中管理所有 Symbol
export const MenuSymbols = {
  MENU: Symbol('menu'),
  SUBMENU: Symbol('submenu'),
} as const;

// 基础接口，包含共同的属性
interface BaseContextType {
  addSubMenu: (subMenu: MenuItemRegistered) => void;
  mouseInChild: React.MutableRefObject<boolean>;
  removeSubMenu: (subMenu: MenuItemRegistered) => void;
}

// 继承基础接口，添加特定属性
interface MenuContextType extends BaseContextType {
  activePath: string;
  addMenuItem: (item: MenuItemRegistered) => void;
  closeMenu: (path: string, parentPaths: string[]) => void;
  handleMenuItemClick: (data: MenuItemClicked) => void;
  handleSubMenuClick: (data: MenuItemRegistered) => void;
  isMenuPopup: boolean;
  items: Record<string, MenuItemRegistered>;
  openedMenus: string[];
  openMenu: (path: string, parentPaths: string[]) => void;
  path: string;
  props: MenuProps;
  removeMenuItem: (item: MenuItemRegistered) => void;
  subMenus: Record<string, MenuItemRegistered>;
  theme: string;
  type: typeof MenuSymbols.MENU;
}

interface SubMenuContextType extends BaseContextType {
  handleMouseleave?: (deepDispatch: boolean) => void;
  handleParentMouseEnter?: (
    event: React.FocusEvent | React.MouseEvent,
    showTimeout?: number,
  ) => void;
  level: number;
  parent: MenuContextType | SubMenuContextType;
  path: string;
  type: typeof MenuSymbols.SUBMENU;
}

// Context 创建和 hooks
export const MenuContext = createContext<MenuContextType>(
  {} as MenuContextType,
);
export const SubMenuContext = createContext<SubMenuContextType>(
  {} as SubMenuContextType,
);
// 类型保护函数
export function isMenuContext(
  context: MenuContextType | SubMenuContextType,
): context is MenuContextType {
  return context.type === MenuSymbols.MENU;
}

export function isSubMenuContext(
  context: MenuContextType | SubMenuContextType,
): context is SubMenuContextType {
  return context.type === MenuSymbols.SUBMENU;
}

export type { MenuContextType, SubMenuContextType };
