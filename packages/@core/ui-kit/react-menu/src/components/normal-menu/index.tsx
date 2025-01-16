import type { MenuRecordRaw } from '@xpress-core/typings';

import type { NormalMenuProps } from './types';

import { useNamespace } from '@xpress-core/hooks';
import { XpressIcon } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import React from 'react';

const NormalMenu: React.FC<NormalMenuProps> = ({
  activePath = '',
  collapse = false,
  menus = [],
  onEnter,
  onSelect,
  rounded = true,
  theme = 'dark',
}) => {
  const { b, e, is } = useNamespace('normal-menu');

  const menuIcon = (menu: MenuRecordRaw) => {
    return activePath === menu.path ? menu.activeIcon || menu.icon : menu.icon;
  };

  return (
    <ul
      className={cn(theme, b(), 'relative', {
        [is('collapse')]: collapse,
        [is('rounded')]: rounded,
        [is(theme)]: true,
      })}
    >
      {menus.map((menu) => (
        <li
          className={cn(e('item'), {
            [is('active')]: activePath === menu.path,
          })}
          key={menu.path}
          onClick={() => onSelect?.(menu)}
          onMouseEnter={() => onEnter?.(menu)}
        >
          <XpressIcon className={e('icon')} fallback icon={menuIcon(menu)} />
          <span className={cn(e('name'), 'truncate')}>{menu.name}</span>
        </li>
      ))}
    </ul>
  );
};

export default NormalMenu;
