import { XpressIcon } from '@xpress-core/shadcn-ui';

import React from 'react';

import './styles.scss';

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
  activeIcon?: ((...args: any[]) => any) | React.ComponentType | string;
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
  icon?: ((...args: any[]) => any) | React.ComponentType | string;
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
const DEFAULT_NAMESPACE = 'xpress';
const statePrefix = 'is-';

const _bem = (
  namespace: string,
  block: string,
  blockSuffix: string,
  element: string,
  modifier: string,
) => {
  let cls = `${namespace}-${block}`;
  if (blockSuffix) {
    cls += `-${blockSuffix}`;
  }
  if (element) {
    cls += `__${element}`;
  }
  if (modifier) {
    cls += `--${modifier}`;
  }
  return cls;
};

const is: {
  (name: string): string;
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  (name: string, state: boolean | undefined): string;
} = (name: string, ...args: [] | [boolean | undefined]) => {
  const state = args.length > 0 ? args[0] : true;
  return name && state ? `${statePrefix}${name}` : '';
};
const useNamespace = (block: string) => {
  const namespace = DEFAULT_NAMESPACE;
  const b = (blockSuffix = '') => _bem(namespace, block, blockSuffix, '', '');
  const e = (element?: string) =>
    element ? _bem(namespace, block, '', element, '') : '';
  const m = (modifier?: string) =>
    modifier ? _bem(namespace, block, '', '', modifier) : '';
  const be = (blockSuffix?: string, element?: string) =>
    blockSuffix && element
      ? _bem(namespace, block, blockSuffix, element, '')
      : '';
  const em = (element?: string, modifier?: string) =>
    element && modifier ? _bem(namespace, block, '', element, modifier) : '';
  const bm = (blockSuffix?: string, modifier?: string) =>
    blockSuffix && modifier
      ? _bem(namespace, block, blockSuffix, '', modifier)
      : '';
  const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
    blockSuffix && element && modifier
      ? _bem(namespace, block, blockSuffix, element, modifier)
      : '';

  // for css var
  // --el-xxx: value;
  const cssVar = (object: Record<string, string>) => {
    const styles: Record<string, string> = {};
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace}-${key}`] = object[key];
      }
    }
    return styles;
  };
  // with block
  const cssVarBlock = (object: Record<string, string>) => {
    const styles: Record<string, string> = {};
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace}-${block}-${key}`] = object[key];
      }
    }
    return styles;
  };

  const cssVarName = (name: string) => `--${namespace}-${name}`;
  const cssVarBlockName = (name: string) => `--${namespace}-${block}-${name}`;

  return {
    b,
    be,
    bem,
    bm,
    // css
    cssVar,
    cssVarBlock,
    cssVarBlockName,
    cssVarName,
    e,
    em,
    is,
    m,
    namespace,
  };
};

const NormalMenu: React.FC<NormalMenuProps> = ({
  activePath = '',
  collapse = false,
  menus = [],
  onEnter,
  onSelect,
  rounded = false,
  theme = 'dark',
}) => {
  const { b, e, is } = useNamespace('normal-menu');

  const menuIcon = (menu: MenuRecordRaw) => {
    return activePath === menu.path ? menu.activeIcon || menu.icon : menu.icon;
  };

  return (
    <ul
      className={[
        theme,
        b(),
        is('collapse', collapse),
        is(theme, true),
        is('rounded', rounded),
        'relative',
      ].join(' ')}
    >
      {menus.map((menu) => (
        <li
          className={[e('item'), is('active', activePath === menu.path)].join(
            ' ',
          )}
          key={menu.path}
          onClick={() => onSelect?.(menu)}
          onMouseEnter={() => onEnter?.(menu)}
        >
          <XpressIcon className={e('icon')} fallback icon={menuIcon(menu)} />
          <span className={`${e('name')} truncate`}>{menu.name}</span>
        </li>
      ))}
    </ul>
  );
};

export default NormalMenu;
