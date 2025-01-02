import type { MenuRecordRaw } from '@xpress-core/typings';

import { useMemo } from 'react';

import { MenuBadge, MenuItem, SubMenu } from './components';

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
  // const menuItemClick = useCallback(() => {
  //   // eslint-disable-next-line no-console
  //   console.info('menuItemClick', menu);
  // }, [menu]);
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
      // menuItemClick={menuItemClick}
      path={menu.path}
      title={menu.name}
    ></MenuItem>
  );
}

export default SubMenuView;
