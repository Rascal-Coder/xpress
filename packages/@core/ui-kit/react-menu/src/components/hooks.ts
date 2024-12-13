import { useContext, useMemo } from 'react';

import {
  MenuContext,
  MenuSymbols,
  SubMenuContext,
  type SubMenuContextType,
} from './contexts';

export function useMenu() {
  const menuContext = useContext(MenuContext);
  const subMenuContext = useContext(SubMenuContext);

  const parentMenu = useMemo(() => {
    // 找到最近的 Menu 或 SubMenu 父组件
    return subMenuContext?.parent || menuContext;
  }, [menuContext, subMenuContext]);

  const parentPaths = useMemo(() => {
    const paths: string[] = [];
    let current = subMenuContext;

    // 收集从当前组件到根 Menu 的路径
    while (current?.type === MenuSymbols.SUBMENU) {
      if ('path' in current) {
        // 类型收窄
        paths.unshift(current.path);
      }
      current = current.parent as SubMenuContextType;
    }

    return paths;
  }, [subMenuContext]);

  if (!menuContext && !subMenuContext) {
    throw new Error('useMenu must be used within a Menu or SubMenu component');
  }

  return {
    parentMenu,
    parentPaths,
  };
}

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenuContext must be used within a MenuProvider');
  }
  return context;
};

export const useSubMenuContext = () => {
  const context = useContext(SubMenuContext);
  if (!context) {
    throw new Error('useSubMenuContext must be used within a SubMenuProvider');
  }
  return context;
};

export function useMenuStyle(menu?: SubMenuContextType) {
  const subMenuStyle = useMemo(() => {
    const level = menu?.level ?? 0;
    return {
      '--menu-level': level + 1,
    } as React.CSSProperties;
  }, [menu?.level]);
  return subMenuStyle;
}
