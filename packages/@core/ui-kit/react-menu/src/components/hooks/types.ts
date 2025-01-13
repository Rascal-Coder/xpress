import type { MenuAction } from '../menu/menuReducer';
import type { MenuItemClicked } from '../types';

export interface MenuStructure {
  items: Record<
    string,
    {
      active: boolean;
      handleClick: (data: MenuItemClicked) => void;
      parentPaths: string[];
      path: string;
    }
  >;
  subMenus: Record<
    string,
    {
      active: boolean;
      handleClick: (data: MenuItemClicked) => void;
      handleMouseleave?: (deepDispatch: boolean) => void;
      mouseInChild: boolean;
      parentPaths: string[];
      path: string;
      setMouseInChild: (value: boolean) => void;
    }
  >;
}

export interface UseMenuStructureProps {
  // accordion: boolean;
  children: React.ReactNode;
  defaultActive: string;
  defaultOpeneds?: string[];
  dispatch: React.Dispatch<MenuAction>;
  handleMenuItemClick: (data: MenuItemClicked) => void;
  handleSubMenuClick: (data: MenuItemClicked) => void;
  mouseInChild: boolean;
  setMouseInChild: (value: boolean) => void;
}
