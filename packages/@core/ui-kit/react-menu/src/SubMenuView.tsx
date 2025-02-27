import type { MenuRecordRaw } from '@xpress-core/typings';

import { Ellipsis } from '@xpress-core/icons';

import { useMemo } from 'react';

import { MenuBadge, MenuItem, SubMenu } from './components';
import { SUB_MENU_MORE_NAME } from './constants';

interface Props {
  /**
   * 菜单项
   */
  menu: MenuRecordRaw;
}
function SubMenuView({ menu }: Props) {
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
      content={
        <MenuBadge
          badge={menu.badge}
          badgeType={menu.badgeType}
          badgeVariants={menu.badgeVariants}
          className="right-6"
        ></MenuBadge>
      }
      icon={menu.icon}
      isSubMenuMore={menu.name === SUB_MENU_MORE_NAME}
      key={`${menu.path}_sub`}
      path={menu.path}
      title={
        menu.name === SUB_MENU_MORE_NAME ? (
          <Ellipsis className={'size-4'} />
        ) : (
          menu.name
        )
      }
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
    ></MenuItem>
  );
}

export default SubMenuView;
