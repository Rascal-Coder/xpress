import type { MenuRecordRaw } from '@xpress-core/typings';

import { useFindMenu } from '@xpress-core/hooks';
import { NormalMenu, type NormalMenuProps } from '@xpress-core/react-menu';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
  const { findMenuByPath } = useFindMenu();
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
