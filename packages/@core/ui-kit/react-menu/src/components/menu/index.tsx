import type { MenuItemClicked, MenuProps } from '../types';

import { useNamespace } from '@xpress-core/hooks';
import { cn } from '@xpress-core/shared/utils';

import { useDebounceFn, useSize } from 'ahooks';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import { SUB_MENU_MORE_WIDTH } from '../../constants';
import { MenuContext, type MenuContextType } from '../contexts';
import { useMenuStyle } from '../hooks';
import { useMenuStructure } from '../hooks/useMenuStructure';
import { menuReducer } from './menuReducer';

interface Props extends MenuProps {
  setSliceIndex: React.Dispatch<React.SetStateAction<number>>;
  sliceIndex: number;
}

// 抽离纯计算函数以减少重新计算
function calcMenuItemWidth(menuItem: HTMLElement) {
  const computedStyle = getComputedStyle(menuItem);
  const marginLeft = Number.parseInt(computedStyle.marginLeft, 10);
  const marginRight = Number.parseInt(computedStyle.marginRight, 10);
  const result = menuItem.offsetWidth + marginLeft + marginRight || 0;

  return result;
}

/**
 * Menu 组件 - 一个功能丰富的菜单组件，支持垂直和水平布局、折叠展开、手风琴模式等特性
 *
 * @component
 * @param props - 组件属性
 * @param props.accordion - 是否启用手风琴模式，默认为 true
 * @param props.collapse - 是否折叠菜单，默认为 false
 * @param props.defaultActive - 默认激活的菜单项路径，默认为空字符串
 * @param props.defaultOpeneds - 默认展开的子菜单路径数组
 * @param props.mode - 菜单模式，可选 'vertical' | 'horizontal'，默认为 'vertical'
 * @param props.onClose - 子菜单关闭时的回调函数
 * @param props.onOpen - 子菜单打开时的回调函数
 * @param props.onSelect - 菜单项选中时的回调函数
 * @param props.rounded - 是否使用圆角样式，默认为 true
 * @param props.theme - 菜单主题，可选 'dark' | 'light'，默认为 'dark'
 * @param props.children - 菜单内容
 * @param props.sliceIndex - 当前切片索引
 * @param props.setSliceIndex - 设置切片索引的函数
 *
 * @returns React 组件
 */
function MenuComponent(props: Props) {
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
    setSliceIndex,
    sliceIndex,
    theme = 'dark',
    children,
  } = props;

  const { b, is } = useNamespace('menu');
  const menuRef = useRef<HTMLUListElement>(null);
  const menuStyle = useMenuStyle();

  const [mouseInChild, setMouseInChild] = useState(false);
  /**
   * 初始化菜单展开状态
   * 当提供了 defaultOpeneds 且菜单未折叠时，使用默认展开的菜单列表
   * 否则使用空数组作为初始状态
   */
  const [openedMenus, dispatch] = useReducer(
    menuReducer,
    defaultOpeneds && !collapse ? [...defaultOpeneds] : [],
  );

  const [calcWidth, setCalcWidth] = useState<number[]>([]);

  // 使用useCallback优化calcWidth的计算
  const updateCalcWidth = useCallback(() => {
    if (!menuRef.current) return;

    const childrenArray = [...menuRef.current.children] as HTMLElement[];
    const newCalcWidth = childrenArray.map((item) => calcMenuItemWidth(item));
    setCalcWidth(newCalcWidth);
  }, []);

  // 只在组件挂载和依赖项变化时计算一次宽度
  useEffect(() => {
    if (mode === 'horizontal') {
      updateCalcWidth();
    }
  }, [mode, updateCalcWidth, children]);

  /**
   * 判断菜单是否需要弹出显示
   */
  const isMenuPopup = useMemo(() => {
    return mode === 'horizontal' || (mode === 'vertical' && collapse);
  }, [collapse, mode]);

  /**
   * 打开指定路径的菜单
   * @param path - 要打开的菜单路径
   * @param parentPaths - 父菜单路径列表
   */
  const openMenu = useCallback(
    (path: string, parentPaths: string[]) => {
      dispatch({
        accordion,
        parentPaths,
        path,
        type: 'OPEN_MENU',
      });

      onOpen?.(path, parentPaths);
    },
    [accordion, onOpen],
  );

  /**
   * 关闭指定路径的菜单
   * @param path - 要关闭的菜单路径
   * @param parentPaths - 父菜单路径列表
   */
  const closeMenu = useCallback(
    (path: string, parentPaths: string[]) => {
      dispatch({ path, type: 'CLOSE_MENU' });
      onClose?.(path, parentPaths);
    },
    [onClose],
  );

  /**
   * 处理子菜单的点击事件
   * @param param0 - 菜单点击事件参数
   * @param param0.openedMenus - 当前打开的菜单列表
   * @param param0.parentPaths - 父菜单路径列表
   * @param param0.path - 当前点击的菜单路径
   */
  const handleSubMenuClick = useCallback(
    ({
      openedMenus: currentOpenedMenus,
      parentPaths,
      path,
    }: MenuItemClicked) => {
      if (currentOpenedMenus && currentOpenedMenus?.includes(path)) {
        closeMenu(path, parentPaths);
      } else {
        openMenu(path, parentPaths);
      }
    },
    [closeMenu, openMenu],
  );

  /**
   * 处理菜单项的点击事件
   * @param param0 - 菜单项点击事件参数
   * @param param0.parentPaths - 父菜单路径列表
   * @param param0.path - 当前点击的菜单项路径
   */
  const handleMenuItemClick = useCallback(
    ({ parentPaths, path }: MenuItemClicked) => {
      if (mode === 'horizontal' || collapse) {
        dispatch({ type: 'RESET_MENUS' });
      }
      if (!path || !parentPaths) {
        return;
      }

      onSelect?.(path, parentPaths);
    },
    [mode, collapse, onSelect],
  );

  const { subMenus, items } = useMenuStructure({
    accordion,
    defaultActive,
    defaultOpeneds,
    dispatch,
    handleMenuItemClick,
    handleSubMenuClick,
    mouseInChild,
    setMouseInChild,
    children,
  });

  /**
   * 计算水平模式下需要移入更多菜单的切片索引
   * @returns 切片索引，-1 表示不需要更多菜单
   */
  const calcSliceIndex = useCallback(() => {
    if (!menuRef.current || calcWidth.length === 0) {
      return -1;
    }
    // 菜单的当前宽度
    const computedMenuStyle = getComputedStyle(menuRef.current);

    const paddingLeft = Number.parseInt(computedMenuStyle.paddingLeft, 10);
    const paddingRight = Number.parseInt(computedMenuStyle.paddingRight, 10);
    const menuWidth = menuRef.current?.clientWidth - paddingLeft - paddingRight;

    let _calcWidth = 0;
    let sliceIndex = 0;
    calcWidth.forEach((item, index) => {
      _calcWidth += item;
      if (_calcWidth <= menuWidth - SUB_MENU_MORE_WIDTH) {
        sliceIndex = index + 1;
      }
    });

    return sliceIndex === calcWidth.length ? -1 : sliceIndex;
  }, [calcWidth]);

  // 只在水平模式下监听尺寸变化
  const size = useSize(mode === 'horizontal' ? menuRef.current : null);
  const isFirstTimeRenderRef = useRef(true);

  /**
   * 更新切片索引，用于处理水平模式下的响应式布局
   */
  const updateSliceIndex = useCallback(() => {
    setSliceIndex(-1);
    requestAnimationFrame(() => {
      setSliceIndex(() => calcSliceIndex());
    });
  }, [calcSliceIndex, setSliceIndex]);

  /**
   * 处理窗口大小变化，更新菜单布局
   */
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
  }, [sliceIndex, calcSliceIndex, updateSliceIndex, setSliceIndex]);

  const { run: debouncedHandleResize } = useDebounceFn(handleResize, {
    wait: 200,
  });

  /**
   * 监听折叠状态变化和水平模式
   * 当菜单被折叠时，重置所有已展开的菜单
   * 当菜单处于水平模式时，重置所有已展开的菜单
   */
  useEffect(() => {
    if (collapse) {
      dispatch({ type: 'RESET_MENUS' });
    }
  }, [collapse]);

  /**
   * 监听水平模式下的尺寸变化
   * 当菜单处于水平模式且尺寸发生变化时，重新计算更多菜单的显示
   */
  useEffect(() => {
    if (mode === 'horizontal' && size) {
      debouncedHandleResize();
    }
  }, [size, mode, debouncedHandleResize]);

  /**
   * 创建菜单上下文值
   */
  const menuProviderValue = useMemo<MenuContextType>(() => {
    return {
      activePath: defaultActive,
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
    defaultActive,
    closeMenu,
    isMenuPopup,
    openedMenus,
    openMenu,
    props,
    subMenus,
    theme,
    items,
  ]);

  const menuClassName = useMemo(() => {
    return cn(
      theme,
      b(),
      is(mode, true),
      is(theme, true),
      is('rounded', rounded),
      is('collapse', collapse),
      is('menu-align', mode === 'horizontal'),
    );
  }, [b, collapse, is, mode, rounded, theme]);

  return (
    <MenuContext.Provider value={menuProviderValue}>
      <ul className={menuClassName} ref={menuRef} role="menu" style={menuStyle}>
        {children}
      </ul>
    </MenuContext.Provider>
  );
}

// 使用memo包装组件以避免不必要的重渲染
export default memo(MenuComponent);
