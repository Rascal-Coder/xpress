import { type FC, type ReactNode } from 'react';

import {
  MenuContext,
  type MenuContextType,
  SubMenuContext,
  type SubMenuContextType,
} from './context';

interface MenuProviderProps extends MenuContextType, SubMenuContextType {
  children: ReactNode;
}

export const MenuProvider: FC<MenuProviderProps> = ({
  level,
  mouseInChild,
  children,
  ...menuContext
}) => {
  return (
    <MenuContext.Provider value={menuContext}>
      <SubMenuContext.Provider
        value={{
          addSubMenu: menuContext.addSubMenu,
          level,
          mouseInChild,
          removeSubMenu: menuContext.removeSubMenu,
        }}
      >
        {children}
      </SubMenuContext.Provider>
    </MenuContext.Provider>
  );
};
