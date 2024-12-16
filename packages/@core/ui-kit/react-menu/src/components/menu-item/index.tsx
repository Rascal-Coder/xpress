import type { MenuItemProps } from '../types';

import { useNamespace } from '@xpress-core/hooks';
import { XpressIcon, XpressTooltip } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import { useEffect, useMemo } from 'react';

import { MenuSymbols } from '../contexts';
import { useMenu, useMenuContext, useSubMenuContext } from '../hooks';
import MenuBadge from '../menu-badge';

interface Props extends MenuItemProps {
  children: React.ReactNode;
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
    children,
  } = props;
  const { b, e, is } = useNamespace('menu-item');
  const nsMenu = useNamespace('menu');
  const rootMenu = useMenuContext();
  const subMenu = useSubMenuContext();
  const { parentMenu, parentPaths } = useMenu();

  const active = useMemo(() => {
    return rootMenu?.activePath === path;
  }, [path, rootMenu?.activePath]);

  const menuIcon = useMemo(() => {
    return active ? activeIcon || icon : icon;
  }, [active, activeIcon, icon]);

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

  useEffect(() => {
    subMenu.addSubMenu({
      active,
      parentPaths,
      path,
    });
    rootMenu.addMenuItem({
      active,
      parentPaths,
      path,
    });
    return () => {
      subMenu.removeSubMenu({
        active,
        parentPaths,
        path,
      });
      rootMenu.removeMenuItem({
        active,
        parentPaths,
        path,
      });
    };
  }, [active, parentPaths, path, rootMenu, subMenu]);

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
      {/* {children} */}
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
              {children}
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
          {children}
          {title}
        </div>
      )}
    </li>
  );
}

export default MenuItem;
