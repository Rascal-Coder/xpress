import type { MenuItemProps } from '../types';

import { useNamespace } from '@xpress-core/hooks';
import { XpressIcon, XpressTooltip } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import { useEffect, useMemo, useRef } from 'react';

import { MenuSymbols } from '../contexts';
import { useMenu, useMenuContext, useSubMenuContext } from '../hooks';
import MenuBadge from '../menu-badge';

interface Props extends MenuItemProps {
  className?: string;
}

function MenuItem(props: Props) {
  const {
    activeIcon,
    className,
    disabled = false,
    icon,
    onClick,
    path,
    title,
  } = props;
  const { b, e, is } = useNamespace('menu-item');
  const nsMenu = useNamespace('menu');
  const rootMenu = useMenuContext();
  const subMenu = useSubMenuContext();
  const { parentMenu, parentPaths } = useMenu();

  // const active = rootMenu?.activePath === path;
  const active = useMemo(() => {
    return rootMenu?.activePath === path;
  }, [rootMenu?.activePath, path]);

  const menuIcon = useMemo(() => {
    return active ? activeIcon || icon : icon;
  }, [active, activeIcon, icon]);

  // const menuIcon = active ? activeIcon || icon : icon;
  const isTopLevelMenuItem = useMemo(() => {
    return parentMenu?.type === MenuSymbols.MENU;
  }, [parentMenu?.type]);

  const collapseShowTitle = useMemo(() => {
    return (
      rootMenu.props?.collapseShowTitle &&
      isTopLevelMenuItem &&
      rootMenu.props.collapse
    );
  }, [
    isTopLevelMenuItem,
    rootMenu.props?.collapseShowTitle,
    rootMenu.props.collapse,
  ]);

  const showTooltip = useMemo(() => {
    return (
      rootMenu.props.mode === 'vertical' &&
      isTopLevelMenuItem &&
      rootMenu.props?.collapse &&
      title
    );
  }, [
    rootMenu.props.mode,
    rootMenu.props?.collapse,
    isTopLevelMenuItem,
    title,
  ]);

  /**
   * 菜单项点击事件
   */
  const handleClick = () => {
    if (disabled) return;
    rootMenu.handleMenuItemClick({
      parentPaths,
      path,
    });
    onClick?.({
      active,
      parentPaths,
      path,
    });
  };
  // TODO
  // const [menuItemData, setMenuItemData] = useState({
  //   active: false,
  //   parentPaths: [] as string[],
  //   path: '',
  // });

  // useEffect(() => {
  //   setMenuItemData({ active, parentPaths, path });
  // }, [active, parentPaths, path]);

  // 使用 useRef 存储注册数据
  const registryData = useRef({
    active: false,
    parentPaths: [] as string[],
    path: '',
  });

  // 更新数据但不触发重渲染
  useEffect(() => {
    registryData.current = {
      active,
      parentPaths,
      path,
    };
  }, [active, parentPaths, path]);

  // 只在挂载和卸载时注册/注销
  useEffect(() => {
    subMenu.addSubMenu(registryData.current);
    rootMenu.addMenuItem(registryData.current);

    return () => {
      subMenu.removeSubMenu(registryData.current);
      rootMenu.removeMenuItem(registryData.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 空依赖数组，只在挂载和卸载时执行

  return (
    <li
      className={cn(
        rootMenu.theme,
        b(),
        is('active', active),
        is('disabled', disabled),
        is('collapse-show-title', collapseShowTitle),
        className,
      )}
      onClick={handleClick}
      role="menuitem"
    >
      {showTooltip ? (
        <XpressTooltip
          contentClass={rootMenu.theme}
          side="right"
          trigger={
            <div className={cn(nsMenu.be('tooltip', 'trigger'))}>
              <XpressIcon
                className={nsMenu.e('icon')}
                fallback
                icon={menuIcon}
              ></XpressIcon>
              {/* {children} */}
              {collapseShowTitle && (
                <span className={cn(nsMenu.e('name'))}>{title}</span>
              )}
            </div>
          }
        >
          {title}
        </XpressTooltip>
      ) : (
        <div className={cn(e('content'))}>
          {rootMenu.props.mode !== 'horizontal' && (
            <MenuBadge className="right-2" {...props}></MenuBadge>
          )}
          <XpressIcon
            className={nsMenu.e('icon')}
            fallback
            icon={menuIcon}
          ></XpressIcon>
          {/* {children} */}
          {title}
        </div>
      )}
    </li>
  );
}

export default MenuItem;
