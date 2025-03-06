import type { MenuRecordRaw } from '@xpress-core/typings';

import { useCallback } from 'react';

export const useFindMenu = () => {
  const findMenuByPath = useCallback(
    (list: MenuRecordRaw[], path?: string): MenuRecordRaw | null => {
      for (const menu of list) {
        if (menu.path === path) {
          return menu;
        }
        const findMenu = menu.children && findMenuByPath(menu.children, path);
        if (findMenu) {
          const pathArray: string[] = [];
          const segments = findMenu.path.split('/').filter(Boolean);
          let currentPath = '';
          for (const segment of segments) {
            currentPath += `/${segment}`;
            pathArray.push(currentPath);
          }
          findMenu.parents = pathArray;
          return findMenu;
        }
      }
      return null;
    },
    [],
  );
  const findRootMenuByPath = useCallback(
    (menus: MenuRecordRaw[], path: string, level = 0) => {
      const findMenu = findMenuByPath(menus, path);
      const rootMenuPath = findMenu?.parents?.[level];
      const rootMenu = rootMenuPath
        ? menus.find((item) => item.path === rootMenuPath)
        : null;
      return {
        findMenu,
        rootMenu,
        rootMenuPath,
      };
    },
    [findMenuByPath],
  );
  return {
    findMenuByPath,
    findRootMenuByPath,
  };
};
