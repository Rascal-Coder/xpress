import type { MenuRecordRaw } from '@xpress-core/typings';

import { NormalMenu, type NormalMenuProps } from '@xpress-core/react-menu';

import { useLocation } from '@tanstack/react-router';
import { useCallback, useEffect } from 'react';

interface MixedMenuProps extends NormalMenuProps {
  onDefaultSelect?: (menu: MenuRecordRaw, rootMenu?: MenuRecordRaw) => void;
}

function MixedMenu({
  menus = [],
  activePath,
  collapse,
  rounded,
  theme,
  onEnter,
  onSelect,
  onDefaultSelect,
}: MixedMenuProps) {
  const location = useLocation();
  const findMenuByPath = useCallback(
    (list: MenuRecordRaw[], path?: string): MenuRecordRaw | null => {
      for (const menu of list) {
        if (menu.path === path) {
          return menu;
        }
        const findMenu = menu.children && findMenuByPath(menu.children, path);
        if (findMenu) {
          return findMenu;
        }
      }
      return null;
    },
    [],
  );
  useEffect(() => {
    const menu = findMenuByPath(menus, location.pathname);
    if (menu) {
      const rootMenu = menus.find((item) => item.path === menu.parents?.[0]);
      onDefaultSelect?.(menu, rootMenu);
    }
  }, [findMenuByPath, location.pathname, menus, onDefaultSelect]);

  return (
    <NormalMenu
      activePath={activePath}
      collapse={collapse}
      menus={menus}
      onEnter={onEnter}
      onSelect={onSelect}
      rounded={rounded}
      theme={theme}
    />
  );
}

export default MixedMenu;
