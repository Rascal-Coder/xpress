import type { MenuRecordRaw } from '@xpress-core/typings';

import { useFindMenu } from '@xpress-core/hooks';
import { NormalMenu, type NormalMenuProps } from '@xpress-core/react-menu';
import { useLocation } from '@xpress-core/router';

import { useEffect } from 'react';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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
