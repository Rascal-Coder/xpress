import type { ThemeModeType } from '@xpress-core/typings';

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

export type { MenuProps };
