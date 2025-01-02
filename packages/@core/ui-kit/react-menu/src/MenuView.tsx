import type { MenuRecordRaw } from '@xpress-core/typings';

import type { MenuProps } from './components/types';

import Menu from './components/menu';
import SubMenuView from './SubMenuView';

interface Props extends Omit<MenuProps, 'children'> {
  menus: MenuRecordRaw[];
}

function MenuView({ collapse = false, menus, ...props }: Props) {
  return (
    <Menu collapse={collapse} {...props}>
      {menus.map((menu) => (
        <SubMenuView key={menu.path} menu={menu} />
      ))}
    </Menu>
  );
}

export default MenuView;
