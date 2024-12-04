import type {
  Icon as IconType,
  MenuRecordBadgeRaw,
} from '@xpress-core/typings';

import { useNamespace } from '@xpress-core/hooks';
import { XpressIcon as Icon, XpressTooltip } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import { useEffect, useMemo } from 'react';

import { MenuBadge } from '../menu-badge';
import {
  useCollapseShowTitle,
  useMenu,
  useParentPaths,
  useShowTooltip,
  useSubMenu,
} from './context';

interface MenuItemRegistered {
  active: boolean;
  parentPaths: string[];
  path: string;
}
export interface MenuItemProps extends MenuRecordBadgeRaw {
  /**
   * @zh_CN 激活时的图标
   */
  activeIcon?: string;
  /**
   * @zh_CN 徽标配置
   */
  /**
   * @zh_CN 子元素
   */
  children?: React.ReactNode;
  /**
   * @zh_CN 是否禁用
   */
  disabled?: boolean;
  /**
   * @zh_CN 图标
   */
  icon?: IconType;
  /**
   * @zh_CN 点击事件
   */
  onClick?: (item: MenuItemRegistered) => void;
  /**
   * @zh_CN 路径
   */
  path: string;
  /**
   * @zh_CN 标题
   */
  title?: React.ReactNode;
}

export function MenuItem({
  activeIcon,
  badge = '',
  disabled = false,
  icon,
  onClick,
  path,
  title,
  children,
}: MenuItemProps) {
  const { b, e, is } = useNamespace('menu-item');
  const nsMenu = useNamespace('menu');
  const rootMenu = useMenu();
  const subMenu = useSubMenu();
  const parentPaths = useParentPaths();

  // 激活状态
  const active = useMemo(
    () => path === rootMenu.activePath,
    [path, rootMenu.activePath],
  );

  // 菜单图标
  const menuIcon = useMemo(
    () => (active ? activeIcon || icon : icon),
    [active, activeIcon, icon],
  );

  // 是否显示tooltip
  const showTooltip = useShowTooltip(!!title);
  // 折叠时是否显示标题
  const collapseShowTitle = useCollapseShowTitle();

  // 菜单项数据
  const item = useMemo(
    () => ({
      active,
      parentPaths,
      path,
    }),
    [active, parentPaths, path],
  );

  // 注册/注销菜单项
  useEffect(() => {
    subMenu?.addSubMenu?.(item);
    rootMenu.addMenuItem?.(item);
    return () => {
      subMenu?.removeSubMenu?.(item);
      rootMenu.removeMenuItem?.(item);
    };
  }, [rootMenu, subMenu, item]);

  // 点击处理
  const handleClick = () => {
    if (disabled) {
      return;
    }
    rootMenu.handleMenuItemClick?.({
      parentPaths,
      path,
    });
    onClick?.(item);
  };

  // 渲染内容
  const renderContent = () => (
    <>
      <Icon className={nsMenu.e('icon')} fallback icon={menuIcon} />
      {children}
      {!rootMenu.props?.collapse && (
        <span className={nsMenu.e('name')}>{title}</span>
      )}
      {badge && rootMenu.props?.mode !== 'horizontal' && (
        <MenuBadge badge={badge} className="right-2" />
      )}
    </>
  );

  return (
    <li
      className={cn(
        rootMenu.theme,
        b(),
        is('active', active),
        is('disabled', disabled),
        is('collapse-show-title', collapseShowTitle),
      )}
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      role="menuitem"
    >
      {showTooltip ? (
        <XpressTooltip
          content-class={cn(rootMenu.theme)}
          side="right"
          trigger={
            <div className={cn(nsMenu.be('tooltip', 'trigger'))}>
              <Icon className={nsMenu.e('icon')} fallback icon={menuIcon} />
              {collapseShowTitle && (
                <span className={nsMenu.e('name')}>{title}</span>
              )}
              {children}
            </div>
          }
        >
          {title}
        </XpressTooltip>
      ) : (
        <div className={e('content')}>{renderContent()}</div>
      )}
    </li>
  );
}
