import type { Icon } from '@xpress-core/typings';

import { cn } from '@xpress-core/shared/utils';

import {
  type ContextMenuContentProps,
  type ContextMenuProps,
  ContextMenuSeparator,
} from '@radix-ui/react-context-menu';
import { useMemo } from 'react';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '../../ui';

interface IContextMenuItem {
  /**
   * @zh_CN 是否禁用
   */
  disabled?: boolean;
  /**
   * @zh_CN 点击事件处理
   * @param data
   */
  handler?: (data: any) => void;
  /**
   * @zh_CN 图标
   */
  icon?: Icon;
  /**
   * @zh_CN 是否显示图标
   */
  inset?: boolean;
  /**
   * @zh_CN 唯一标识
   */
  key: string;
  /**
   * @zh_CN 是否是分割线
   */
  separator?: boolean;
  /**
   * @zh_CN 快捷键
   */
  shortcut?: string;
  /**
   * @zh_CN 标题
   */
  text: string;
}
type Props = {
  class?: string;
  contentClass?: string;
  contentProps?: ContextMenuContentProps;
  handlerData?: Record<string, any>;
  itemClass?: string;
  menus: (data: any) => IContextMenuItem[];
} & ContextMenuProps;
export const XpressContextMenu = ({
  contentClass,
  onOpenChange,
  children,
  ...props
}: Props) => {
  const menusView = useMemo(() => {
    return props.menus?.(props.handlerData);
  }, [props]);
  const handleClick = (menu: IContextMenuItem) => {
    if (menu.disabled) {
      return;
    }
    menu?.handler?.(props.handlerData);
  };
  return (
    <ContextMenu {...props} onOpenChange={onOpenChange}>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className={cn('side-content z-popup', contentClass)}>
        {menusView.map((menu) => {
          return (
            <ContextMenuItem
              className={cn('cursor-pointer', props.itemClass)}
              disabled={menu.disabled}
              inset={menu.inset || !menu.icon}
              key={menu.key}
              onClick={() => handleClick(menu)}
            >
              {menu.icon && <menu.icon className="mr-2 size-4 text-lg" />}
              {menu.text}
              {menu.shortcut && (
                <ContextMenuShortcut>{menu.shortcut}</ContextMenuShortcut>
              )}
              {menu.separator && <ContextMenuSeparator />}
            </ContextMenuItem>
          );
        })}
      </ContextMenuContent>
    </ContextMenu>
  );
};
