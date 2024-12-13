import type { MenuRecordRaw } from '@xpress-core/typings';

interface NormalMenuProps {
  /**
   * 菜单数据
   */
  activePath?: string;
  /**
   * 是否折叠
   */
  collapse?: boolean;
  /**
   * 菜单项
   */
  menus?: MenuRecordRaw[];
  onEnter?: (menu: MenuRecordRaw) => void;
  onSelect?: (menu: MenuRecordRaw) => void;
  /**
   * @zh_CN 是否圆润风格
   * @default true
   */
  rounded?: boolean;
  /**
   * 主题
   */
  theme?: 'dark' | 'light';
}
export type { NormalMenuProps };
