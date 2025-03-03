import { useMemo } from 'react';

interface LayoutStylesOptions {
  collapse?: boolean;
  collapseHeight?: number;
  collapseWidth?: number;
  expandOnHover?: boolean;
  expandOnHovering?: boolean;
  extraVisible?: boolean;
  extraWidth?: number;
  fixedExtra?: boolean;
  headerHeight?: number | undefined;
  isSidebarMixed?: boolean;
  marginTop?: number;
  mixedWidth?: number;
  paddingTop?: number;
  show?: boolean;
  width?: number | undefined;
  zIndex?: number;
}

export function useLayoutStyles({
  collapse = false,
  collapseHeight = 42,
  collapseWidth = 48,
  expandOnHover = false,
  expandOnHovering = false,
  extraVisible = false,
  extraWidth = 0,
  fixedExtra = false,
  headerHeight = 48,
  isSidebarMixed = false,
  marginTop = 0,
  mixedWidth = 70,
  paddingTop = 0,
  show = true,
  width = 200,
  zIndex = 0,
}: LayoutStylesOptions) {
  const safeWidth = width ?? 200;
  const safeHeaderHeight = headerHeight ?? 48;

  // 基础宽度计算逻辑
  const baseWidthStyle = useMemo(() => {
    const getWidthValue = (isHiddenDom: boolean): string => {
      if (isHiddenDom && expandOnHovering && !expandOnHover) {
        return `${collapseWidth}px`;
      }
      return `${safeWidth + (isSidebarMixed && fixedExtra && extraVisible ? extraWidth : 0)}px`;
    };

    return (isHiddenDom: boolean) => {
      const widthValue = getWidthValue(isHiddenDom);

      return {
        ...(widthValue === '0px' ? { overflow: 'hidden' } : {}),
        flex: `0 0 ${widthValue}`,
        marginLeft: show ? 0 : `-${widthValue}`,
        maxWidth: widthValue,
        minWidth: widthValue,
        width: widthValue,
      };
    };
  }, [
    safeWidth,
    isSidebarMixed,
    fixedExtra,
    extraVisible,
    extraWidth,
    expandOnHovering,
    expandOnHover,
    collapseWidth,
    show,
  ]);

  // 隐藏侧边栏样式
  const hiddenSideStyle = useMemo(() => baseWidthStyle(true), [baseWidthStyle]);

  // 主样式
  const style = useMemo(
    () => ({
      '--scroll-shadow': 'var(--sidebar)',
      ...baseWidthStyle(false),
      height: `calc(100% - ${marginTop}px)`,
      marginTop: `${marginTop}px`,
      paddingTop: `${paddingTop}px`,
      zIndex,
      ...(isSidebarMixed && extraVisible ? { transition: 'none' } : {}),
    }),
    [
      baseWidthStyle,
      marginTop,
      paddingTop,
      zIndex,
      isSidebarMixed,
      extraVisible,
    ],
  );

  // 内容宽度基础样式
  const baseContentStyle = useMemo(() => {
    if (isSidebarMixed && fixedExtra) {
      return { width: `${collapse ? collapseWidth : mixedWidth}px` };
    }
    return {};
  }, [isSidebarMixed, fixedExtra, collapse, collapseWidth, mixedWidth]);

  // 所有派生样式
  const derivedStyles = useMemo(
    () => ({
      collapseStyle: {
        height: `${collapseHeight}px`,
      },
      contentStyle: {
        height: `calc(100% - ${safeHeaderHeight + collapseHeight}px)`,
        paddingTop: '8px',
        ...baseContentStyle,
      },
      extraContentStyle: {
        height: `calc(100% - ${safeHeaderHeight + collapseHeight}px)`,
      },
      extraStyle: {
        left: `${safeWidth}px`,
        width: extraVisible && show ? `${extraWidth}px` : 0,
        zIndex,
      },
      extraTitleStyle: {
        height: `${safeHeaderHeight - 1}px`,
      },
      headerStyle: {
        ...(isSidebarMixed
          ? { display: 'flex', justifyContent: 'center' }
          : {}),
        height: `${safeHeaderHeight}px`,
        ...baseContentStyle,
      },
    }),
    [
      safeWidth,
      extraVisible,
      show,
      extraWidth,
      zIndex,
      safeHeaderHeight,
      collapseHeight,
      baseContentStyle,
      isSidebarMixed,
    ],
  );
  return {
    hiddenSideStyle,
    style,
    ...derivedStyles,
  };
}
