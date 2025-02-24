import type { MenuItemProps } from '../types';

import { useNamespace } from '@xpress-core/hooks';
import { XpressIcon, XpressTooltip } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import { useMemo } from 'react';

import { useMenuContext } from '../hooks';
import MenuBadge from '../menu-badge';

interface Props extends MenuItemProps {
  className?: string;
}

function MenuItem(props: Props) {
  const { activeIcon, className, disabled = false, icon, path, title } = props;
  const { b, e, is } = useNamespace('menu-item');
  const nsMenu = useNamespace('menu');
  const rootMenu = useMenuContext();
  const currentMenu = rootMenu.items[path];
  const currentMenuParentPaths = currentMenu?.parentPaths ?? [];
  const active = useMemo(() => {
    return rootMenu?.activePath === path;
  }, [rootMenu?.activePath, path]);

  const menuIcon = useMemo(() => {
    return active ? activeIcon || icon : icon;
  }, [active, activeIcon, icon]);
  const isTopLevelMenuItem = useMemo(() => {
    return currentMenuParentPaths.length === 1;
  }, [currentMenuParentPaths.length]);

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
    const menuItem = rootMenu.items[path];
    if (!menuItem) return;

    menuItem.handleClick({
      parentPaths: currentMenuParentPaths,
      path,
    });
  };

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
          {title}
        </div>
      )}
    </li>
  );
}

export default MenuItem;
