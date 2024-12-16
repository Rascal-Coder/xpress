import type { MenuRecordRaw } from '@xpress-core/typings';

import { useMemo } from 'react';

import { MenuItem, SubMenu } from './components';

interface Props {
  children?: React.ReactNode;
  /**
   * 菜单项
   */
  menu: MenuRecordRaw;
}
function SubMenuView({ menu, children }: Props) {
  const hasChildren = useMemo(
    () =>
      Reflect.has(menu, 'children') &&
      !!menu.children &&
      menu.children.length > 0,
    [menu],
  );
  return hasChildren ? (
    <SubMenu
      activeIcon={menu.activeIcon}
      className="right-6"
      icon={menu.icon}
      key={`${menu.path}_sub`}
      path={menu.path}
      title={menu.name}
    >
      {menu.children?.map((child) => (
        <SubMenuView key={child.path} menu={child}></SubMenuView>
      ))}
    </SubMenu>
  ) : (
    <MenuItem
      activeIcon={menu.activeIcon}
      badge={menu.badge}
      badgeType={menu.badgeType}
      badgeVariants={menu.badgeVariants}
      icon={menu.icon}
      key={menu.path}
      path={menu.path}
      title={menu.name}
    >
      {children}
    </MenuItem>
  );
}

export default SubMenuView;
