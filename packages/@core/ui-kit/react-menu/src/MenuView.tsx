import type { MenuRecordRaw } from '@xpress-core/typings';

import type { MenuProps } from './components/types';

import Menu from './components/menu';
import SubMenuView from './SubMenuView';

interface Props extends MenuProps {
  menus: MenuRecordRaw[];
}
function MenuView({ collapse = false, menus, ...props }: Props) {
  return (
    <Menu collapse={collapse} {...props}>
      {menus.map((menu) => (
        <SubMenuView key={menu.path} menu={menu}></SubMenuView>
      ))}
    </Menu>
  );
}

export default MenuView;