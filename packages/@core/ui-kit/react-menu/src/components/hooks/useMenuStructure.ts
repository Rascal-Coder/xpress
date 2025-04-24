import type { MenuRecordRaw } from '@xpress-core/typings';

import type { MenuStructure, UseMenuStructureProps } from './types';

import React, { useMemo } from 'react';

import SubMenuView from '../../SubMenuView';

export function useMenuStructure(props: UseMenuStructureProps): MenuStructure {
  const {
    accordion,
    defaultActive,
    defaultOpeneds,
    dispatch,
    handleMenuItemClick,
    handleSubMenuClick,
    mouseInChild,
    setMouseInChild,
    children,
  } = props;

  return useMemo(() => {
    const items: MenuStructure['items'] = {};
    const subMenus: MenuStructure['subMenus'] = {};

    function createSubMenuView(child: MenuRecordRaw) {
      return React.createElement(SubMenuView, {
        key: child.path,
        menu: child,
      });
    }

    function processMenuChildren(menuChildren: MenuRecordRaw[]) {
      return menuChildren.map((child) => createSubMenuView(child));
    }

    // 获取父级路径数组（剔除最后一个部分）
    function getParentPathsArray(path?: string): string[] {
      if (!path) return [];
      // 先按/分割，过滤空字符串，只保留前面的部分，然后为每个路径段添加/前缀
      const parts = path.split('/').filter(Boolean);
      // 移除最后一个元素，为前面的部分添加/前缀
      return parts.length > 1
        ? parts.slice(0, -1).map((part) => `/${part}`)
        : [];
    }

    function handleChild(
      child: React.ReactElement,
      parentPath: string,
      parentPaths: string[],
    ) {
      if (child.type !== SubMenuView) return;

      const typedChild = child as React.ReactElement<any>;
      const path = typedChild.props.menu.path;
      const isSubMenu = typedChild.props.menu.children?.length > 0;

      // 构建parentPaths数组
      const currentParentPaths = parentPath
        ? [...parentPaths, path] // 包含当前路径
        : [path]; // 如果是根节点，只包含自身
      if (isSubMenu) {
        const parentPathsArray = getParentPathsArray(defaultActive);

        // 检查两个数组是否有重叠的元素，且currentParentPaths长度不超过parentPathsArray长度
        const hasOverlap =
          parentPathsArray.some((path) =>
            currentParentPaths.some((currentPath) =>
              currentPath.includes(path),
            ),
          ) && currentParentPaths.length <= parentPathsArray.length;

        subMenus[path] = {
          active: hasOverlap,
          handleClick: handleSubMenuClick,
          handleMouseleave: () => {},
          mouseInChild,
          parentPaths: currentParentPaths,
          path,
          setMouseInChild,
        };

        if (typedChild.props.menu.children?.length) {
          registerSubMenus(
            typedChild.props.menu.children,
            path,
            currentParentPaths,
          );
        }
      } else {
        items[path] = {
          active: currentParentPaths.includes(defaultActive),
          handleClick: handleMenuItemClick,
          parentPaths: currentParentPaths,
          path,
        };
      }
    }

    function registerSubMenus(
      menuChildren: React.ReactNode,
      parentPath = '',
      parentPaths: string[] = [],
    ) {
      // 如果children是数组对象，需要先转换成SubMenuView组件
      if (
        Array.isArray(menuChildren) &&
        menuChildren.length > 0 &&
        typeof menuChildren[0] === 'object' &&
        !React.isValidElement(menuChildren[0])
      ) {
        const processedChildren = processMenuChildren(
          menuChildren as MenuRecordRaw[],
        );
        React.Children.forEach(processedChildren, (child) => {
          if (!React.isValidElement(child)) return;
          handleChild(child, parentPath, parentPaths);
        });
        return;
      }

      React.Children.forEach(menuChildren, (child) => {
        if (!React.isValidElement(child)) return;
        handleChild(child, parentPath, parentPaths);
      });
    }

    registerSubMenus(children);

    // 获取当前激活菜单项的所有父级路径
    const getActivePaths = () => {
      const activeItem = defaultActive && items[defaultActive];
      if (!activeItem) {
        return [];
      }
      return activeItem.parentPaths;
    };

    // 初始化展开状态
    if (defaultOpeneds?.length) {
      defaultOpeneds.forEach((path) => {
        dispatch({
          accordion,
          parentPaths: defaultOpeneds,
          path,
          type: 'OPEN_MENU',
        });
      });
    } else {
      const parentPaths = getActivePaths();
      if (parentPaths.length > 0) {
        parentPaths.forEach((path) => {
          dispatch({ accordion, parentPaths, path, type: 'OPEN_MENU' });
        });
      }
    }

    return { subMenus, items };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    children,
    defaultOpeneds,
    defaultActive,
    handleSubMenuClick,
    handleMenuItemClick,
    dispatch,
    accordion,
  ]);
}
