import type {
  Icon as IconType,
  MenuRecordBadgeRaw,
  ThemeModeType,
} from '@xpress-core/typings';
import type { PropsWithChildren } from 'react';

interface MenuProps {
  /**
   * @zh_CN 是否开启手风琴模式
   * @default true
   */
  accordion?: boolean;

  /**
   * @zh_CN 菜单项
   */
  children: React.ReactNode;

  /**
   * @zh_CN 菜单是否折叠
   * @default false
   */
  collapse?: boolean;

  /**
   * @zh_CN 菜单折叠时是否显示菜单名称
   * @default false
   */
  collapseShowTitle?: boolean;

  /**
   * @zh_CN 默认激活的菜单
   */
  defaultActive?: string;

  /**
   * @zh_CN 默认展开的菜单
   */
  defaultOpeneds?: string[];

  /**
   * @zh_CN 菜单模式
   * @default vertical
   */
  mode?: 'horizontal' | 'vertical';

  onClose?: (path: string, parentPaths: string[]) => void;
  onOpen?: (path: string, parentPaths: string[]) => void;

  onSelect?: (path: string, parentPaths: string[]) => void;
  /**
   * @zh_CN 是否圆润风格
   * @default true
   */
  rounded?: boolean;
  /**
   * @zh_CN 菜单主题
   * @default dark
   */
  theme?: ThemeModeType;
}

interface MenuItemClicked {
  openedMenus?: string[];
  parentPaths: string[];
  path: string;
}
interface MenuItemRegistered {
  active: boolean;
  parentPaths: string[];
  path: string;
}
interface MenuItemProps extends MenuRecordBadgeRaw {
  /**
   * @zh_CN 激活时的图标
   */
  activeIcon?: IconType;
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
  // menuItemClick?: () => void;
  /**
   * @zh_CN 路径
   */
  path: string;
  /**
   * @zh_CN 标题
   */
  title?: React.ReactNode;
}

interface SubMenuProps extends MenuRecordBadgeRaw, PropsWithChildren {
  /**
   * @zh_CN 激活图标
   */
  activeIcon?: IconType;
  /**
   * @zh_CN 是否禁用
   */
  disabled?: boolean;
  /**
   * @zh_CN 图标
   */
  icon?: IconType;
  /**
   * @zh_CN submenu 名称
   */
  path: string;
  /**
   * @zh_CN submenu 名称
   */
  title: React.ReactNode;
}
export type {
  MenuItemClicked,
  MenuItemProps,
  MenuItemRegistered,
  MenuProps,
  SubMenuProps,
};
