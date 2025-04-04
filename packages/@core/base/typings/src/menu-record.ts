// import type { Icon } from '@xpress-core/shadcn-ui/src/components/base/icon/icon';
import type { Icon } from './basic';

interface MenuRecordBadgeRaw {
  /**
   * 徽标
   */
  badge?: string;
  /**
   * 徽标类型
   */
  badgeType?: 'dot' | 'normal';
  /**
   * 徽标颜色
   */
  badgeVariants?: 'destructive' | 'primary' | string;
}

/**
 * 菜单原始对象
 */
interface MenuRecordRaw extends MenuRecordBadgeRaw {
  /**
   * 激活时的图标名
   */
  activeIcon?: Icon;
  /**
   * 子菜单
   */
  children?: MenuRecordRaw[];
  /**
   * 是否禁用菜单
   * @default false
   */
  disabled?: boolean;
  /**
   * 图标名
   */
  icon?: Icon;
  /**
   * 菜单唯一标识
   */
  key: string;
  /**
   * 菜单名
   */
  name: string;
  /**
   * 排序号
   */
  order?: number;
  /**
   * 父级路径
   */
  parent?: string;
  /**
   * 所有父级路径
   */
  parents?: string[];
  /**
   * 菜单路径，唯一，可当作key
   */
  path: string;
  /**
   * 是否显示菜单
   * @default true
   */
  show?: boolean;
}
export type { MenuRecordBadgeRaw, MenuRecordRaw };
