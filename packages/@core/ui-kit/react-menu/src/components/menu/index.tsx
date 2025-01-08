import type { MenuItemClicked, MenuProps } from '../types';

import { useNamespace } from '@xpress-core/hooks';
import { Ellipsis } from '@xpress-core/icons';
import { cn, isHttpUrl } from '@xpress-core/shared/utils';

import { useDebounceFn, useSize } from 'ahooks';
import { produce } from 'immer';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import SubMenuView from '../../SubMenuView';
import { MenuContext, type MenuContextType } from '../contexts';
import { useMenuStyle } from '../hooks';
import SubMenu from '../sub-menu';

import './styles.scss';

interface Props extends MenuProps {}

export default function Menu(props: Props) {
  const {
    accordion = true,
    collapse = false,
    defaultActive = '',
    defaultOpeneds,
    mode = 'vertical',
    onClose,
    onOpen,
    onSelect,
    rounded = true,
    theme = 'dark',
    children,
  } = props;

  const { b, is } = useNamespace('menu');
  const menuRef = useRef<HTMLUListElement>(null);
  const menuStyle = useMenuStyle();
  const [sliceIndex, setSliceIndex] = useState(-1);
  const [openedMenus, setOpenedMenus] = useState(
    defaultOpeneds && !collapse ? [...defaultOpeneds] : [],
  );
  const [activePath, setActivePath] = useState(defaultActive);
  const [items, setItems] = useState<MenuContextType['items']>({});
  const [subMenus, setSubMenus] = useState<MenuContextType['subMenus']>({});
  const [mouseInChild, setMouseInChild] = useState(false);

  const isMenuPopup = useMemo(() => {
    return mode === 'horizontal' || (mode === 'vertical' && collapse);
  }, [collapse, mode]);

  const childrenArray = React.Children.toArray(children);
  const defaultChildren =
    sliceIndex === -1 ? childrenArray : childrenArray.slice(0, sliceIndex);
  const moreChildren = sliceIndex === -1 ? [] : childrenArray.slice(sliceIndex);

  const getActivePaths = useCallback(() => {
    const activeItem = activePath && items[activePath];
    if (!activeItem || mode === 'horizontal' || collapse) {
      return [];
    }
    return activeItem.parentPaths;
  }, [activePath, collapse, items, mode]);

  /**
   * 点击展开菜单
   */
  const openMenu = useCallback(
    (path: string, parentPaths: string[]) => {
      if (openedMenus.includes(path)) {
        return;
      }
      // 手风琴模式菜单
      if (accordion) {
        const activeParentPaths = getActivePaths();
        if (activeParentPaths.includes(path)) {
          parentPaths = activeParentPaths;
        }
        setOpenedMenus(
          openedMenus.filter((path: string) => parentPaths.includes(path)),
        );
      }
      setOpenedMenus([...openedMenus, path]);
      onOpen?.(path, parentPaths);
    },
    [openedMenus, onOpen, accordion, getActivePaths],
  );

  const close = useCallback(
    (path: string) => {
      const i = openedMenus.indexOf(path);

      if (i !== -1) {
        setOpenedMenus(openedMenus.filter((p) => p !== path));
      }
    },
    [openedMenus],
  );

  /**
   * 关闭、折叠菜单
   */
  const closeMenu = useCallback(
    (path: string, parentPaths: string[]) => {
      if (accordion) {
        setOpenedMenus(subMenus[path]?.parentPaths ?? []);
      }

      close(path);

      onClose?.(path, parentPaths);
    },
    [accordion, close, onClose, subMenus],
  );
  const handleSubMenuClick = useCallback(
    ({ parentPaths, path }: MenuItemClicked) => {
      const isOpened = openedMenus.includes(path);

      if (isOpened) {
        closeMenu(path, parentPaths);
      } else {
        openMenu(path, parentPaths);
      }
    },

    [closeMenu, openMenu, openedMenus],
  );

  const handleMenuItemClick = useCallback(
    ({ parentPaths, path }: MenuItemClicked) => {
      if (mode === 'horizontal' || collapse) {
        setOpenedMenus([]);
      }
      if (!path || !parentPaths) {
        return;
      }
      if (!isHttpUrl(path)) {
        setActivePath(path);
      }

      onSelect?.(path, parentPaths);
    },
    [mode, collapse, setActivePath, onSelect],
  );
  /**
   * 初始化菜单
   */
  const initMenu = useCallback(() => {
    const parentPaths = getActivePaths();
    // console.log('parentPaths', parentPaths);
    // 展开该菜单项的路径上所有子菜单
    // expand all subMenus of the menu item
    parentPaths.forEach((path) => {
      const subMenu = subMenus[path];
      subMenu && openMenu(path, subMenu.parentPaths);
    });
  }, [subMenus, getActivePaths, openMenu]);

  function calcMenuItemWidth(menuItem: HTMLElement) {
    const computedStyle = getComputedStyle(menuItem);
    const marginLeft = Number.parseInt(computedStyle.marginLeft, 10);
    const marginRight = Number.parseInt(computedStyle.marginRight, 10);
    return menuItem.offsetWidth + marginLeft + marginRight || 0;
  }
  const calcSliceIndex = useCallback(() => {
    if (!menuRef.current) {
      return -1;
    }
    const items = [...menuRef.current.children] as HTMLElement[];

    const moreItemWidth = 46;
    const computedMenuStyle = getComputedStyle(menuRef.current);

    const paddingLeft = Number.parseInt(computedMenuStyle.paddingLeft, 10);
    const paddingRight = Number.parseInt(computedMenuStyle.paddingRight, 10);
    const menuWidth = menuRef.current?.clientWidth - paddingLeft - paddingRight;

    let calcWidth = 0;
    let sliceIndex = 0;
    items.forEach((item, index) => {
      calcWidth += calcMenuItemWidth(item);
      if (calcWidth <= menuWidth - moreItemWidth) {
        sliceIndex = index + 1;
      }
    });
    return sliceIndex === items.length ? -1 : sliceIndex;
  }, [menuRef]);

  const size = useSize(mode === 'horizontal' ? menuRef : null);
  const isFirstTimeRenderRef = useRef(true);
  const updateSliceIndex = useCallback(() => {
    setSliceIndex(-1);
    requestAnimationFrame(() => {
      setSliceIndex(calcSliceIndex());
    });
  }, [calcSliceIndex]);
  const handleResize = useCallback(() => {
    if (sliceIndex === calcSliceIndex()) {
      return;
    }

    if (isFirstTimeRenderRef.current) {
      updateSliceIndex();
      isFirstTimeRenderRef.current = false;
    } else {
      requestAnimationFrame(() => {
        setSliceIndex(calcSliceIndex());
      });
    }
  }, [sliceIndex, calcSliceIndex, updateSliceIndex]);

  const { run: debouncedHandleResize } = useDebounceFn(handleResize, {
    wait: 200,
  });

  useEffect(() => {
    if (collapse) {
      setOpenedMenus([]);
    }
  }, [collapse]);

  useEffect(() => {
    const itemsInData = items;
    const item =
      itemsInData[defaultActive] ||
      (activePath && itemsInData[activePath]) ||
      itemsInData[defaultActive || ''];
    setActivePath(item ? item.path : defaultActive);
  }, [defaultActive, items, activePath]);

  useEffect(() => {
    if (mode === 'horizontal' && size) {
      debouncedHandleResize();
    }
  }, [size, mode, debouncedHandleResize]);
  // 注册默认数据
  useEffect(() => {
    const registerSubMenus = (
      children: any[] | React.ReactNode,
      parentPath = '',
      parentPaths: string[] = [],
    ) => {
      // 如果children是数组对象，需要先转换成SubMenuView组件
      if (
        Array.isArray(children) &&
        typeof children[0] === 'object' &&
        !React.isValidElement(children[0])
      ) {
        children = children.map((child) => (
          <SubMenuView key={child.path} menu={child} />
        ));
      }

      React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) return;

        if (child.type === SubMenuView) {
          const typedChild = child as React.ReactElement<
            ReturnType<typeof SubMenuView>['props']
          >;
          const path = typedChild.props.menu.path;
          const isSubMenu = typedChild.props.menu.children?.length > 0;

          // 构建parentPaths数组
          const currentParentPaths = parentPath
            ? [...parentPaths, path] // 包含当前路径
            : [path]; // 如果是根节点，只包含自身
          if (isSubMenu) {
            setSubMenus(
              produce((draft) => {
                draft[path] = {
                  active: currentParentPaths.includes(activePath),
                  handleClick: handleSubMenuClick,
                  handleMouseleave: () => {},
                  mouseInChild,
                  parentPaths: currentParentPaths,
                  path,
                  setMouseInChild,
                };
              }),
            );
            if (typedChild.props.menu.children?.length) {
              registerSubMenus(
                typedChild.props.menu.children,
                path,
                currentParentPaths,
              );
            }
          } else {
            setItems(
              produce((draft) => {
                draft[path] = {
                  active: currentParentPaths.includes(activePath),
                  handleClick: handleMenuItemClick,
                  parentPaths: currentParentPaths,
                  path,
                };
              }),
            );
          }
        }
      });
    };

    registerSubMenus(children);
    // console.log('items', items);
    // console.log('subMenus', subMenus);

    return () => {
      setSubMenus({});
      setItems({});
    };
    // TODO: 需要修改
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  useEffect(() => {
    initMenu();
  }, [items, subMenus, initMenu]);

  const menuProviderValue = useMemo<MenuContextType>(() => {
    return {
      activePath,
      closeMenu,
      isMenuPopup,
      openedMenus,
      openMenu,
      props,
      subMenus,
      theme,
      items,
    };
  }, [
    activePath,
    closeMenu,
    isMenuPopup,
    openedMenus,
    openMenu,
    props,
    subMenus,
    theme,
    items,
  ]);

  return (
    <MenuContext.Provider value={menuProviderValue}>
      <ul
        className={cn(
          theme,
          b(),
          is(mode, true),
          is(theme, true),
          is('rounded', rounded),
          is('collapse', collapse),
        )}
        ref={menuRef}
        role="menu"
        style={menuStyle}
      >
        {mode === 'horizontal' && moreChildren.length > 0 ? (
          <>
            {defaultChildren}
            <SubMenu
              path="sub-menu-more"
              title={<Ellipsis className={'size-4'} />}
            >
              {moreChildren}
            </SubMenu>
          </>
        ) : (
          children
        )}
      </ul>
    </MenuContext.Provider>
  );
}
