import type { MenuRecordRaw } from '@xpress-core/typings';

import type { MenuProps } from './components/types';

import { useState } from 'react';

import Menu from './components/menu';
import { SUB_MENU_MORE_NAME } from './constants';
import SubMenuView from './SubMenuView';

interface Props extends Omit<MenuProps, 'children'> {
  menus: MenuRecordRaw[];
}

function MenuView({ collapse = false, menus, ...props }: Props) {
  const [sliceIndex, setSliceIndex] = useState(-1);
  const sliceMoreMenus = menus.slice(sliceIndex);
  const sliceDefaultMenus = menus.slice(0, sliceIndex);
  let resultMenus = [];
  if (sliceIndex === -1) {
    resultMenus = menus;
  } else {
    const moreMenus = [
      {
        key: SUB_MENU_MORE_NAME,
        name: SUB_MENU_MORE_NAME,
        path: SUB_MENU_MORE_NAME,
        children: sliceMoreMenus,
      },
    ];
    resultMenus = [...sliceDefaultMenus, ...moreMenus];
  }
  return (
    <Menu
      collapse={collapse}
      setSliceIndex={setSliceIndex}
      sliceIndex={sliceIndex}
      {...props}
    >
      {resultMenus.map((menu) => (
        <SubMenuView key={menu.path} menu={menu} />
      ))}
    </Menu>
  );
}

export default MenuView;
