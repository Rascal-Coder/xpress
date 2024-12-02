import type { CSSProperties, FC } from 'react';

import type { LayoutSidebarProps } from './types';

import { useScrollLock, useShow } from '@xpress-core/hooks';
import { XpressScrollbar } from '@xpress-core/shadcn-ui';

import { useDebounceFn } from 'ahooks';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { SidebarCollapseButton, SidebarFixedButton } from '../widgets';

const LayoutSidebar: FC<LayoutSidebarProps> = ({
  collapse,
  collapseHeight = 42,
  collapseWidth = 48,
  domVisible = true,
  expandOnHover,
  expandOnHovering,
  extra,
  extraCollapse,
  extraTitle,
  extraVisible,
  extraWidth,
  fixedExtra = false,
  headerHeight,
  isSidebarMixed = false,
  logo,
  marginTop = 0,
  mixedWidth = 70,
  onCollapseChange,
  onExpandOnHoverChange,
  onExpandOnHoveringChange,
  onExtraCollapseChange,
  onExtraVisibleChange,
  onLeave,
  paddingTop = 0,
  show = true,
  showCollapseButton = true,
  showLogo = true,
  theme,
  width,
  zIndex = 0,
  children,
}) => {
  const asideRef = useRef<HTMLDivElement>(null);
  const { lock, unlock } = useScrollLock(document.body);

  // const {
  //   setSidebarCollapse,
  //   setSidebarExpandOnHover,
  //   setSidebarExpandOnHovering,
  //   sidebarCollapse,
  //   sidebarExpandOnHover,
  //   sidebarExpandOnHovering,
  // } = useXpressLayout();

  // 计算菜单宽度样式
  const calcMenuWidthStyle = useCallback(
    (isHiddenDom: boolean): CSSProperties => {
      let widthValue = `${width + (isSidebarMixed && fixedExtra && extraVisible ? extraWidth : 0)}px`;

      if (isHiddenDom && expandOnHovering && !expandOnHover) {
        widthValue = `${collapseWidth}px`;
      }

      return {
        ...(widthValue === '0px' ? { overflow: 'hidden' } : {}),
        flex: `0 0 ${widthValue}`,
        marginLeft: show ? 0 : `-${widthValue}`,
        maxWidth: widthValue,
        minWidth: widthValue,
        width: widthValue,
      };
    },
    [
      width,
      isSidebarMixed,
      fixedExtra,
      extraVisible,
      extraWidth,
      expandOnHovering,
      expandOnHover,
      collapseWidth,
      show,
    ],
  );

  const hiddenSideStyle = useMemo(
    () => calcMenuWidthStyle(true),
    [calcMenuWidthStyle],
  );

  const style = useMemo(
    () => ({
      '--scroll-shadow': 'var(--sidebar)',
      ...calcMenuWidthStyle(false),
      height: `calc(100% - ${marginTop}px)`,
      marginTop: `${marginTop}px`,
      paddingTop: `${paddingTop}px`,
      zIndex,
      ...(isSidebarMixed && extraVisible ? { transition: 'none' } : {}),
    }),
    [
      marginTop,
      paddingTop,
      zIndex,
      isSidebarMixed,
      extraVisible,
      calcMenuWidthStyle,
    ],
  );

  const extraStyle = useMemo(() => {
    return {
      left: `${width}px`,
      width: extraVisible && show ? `${extraWidth}px` : 0,
      zIndex,
    };
  }, [width, extraWidth, show, extraVisible, zIndex]);

  // 使用 useDebounceFn 处理展开
  const { run: handleExpand } = useDebounceFn(
    () => {
      if (!expandOnHovering) {
        onCollapseChange(false);
      }

      if (isSidebarMixed) {
        lock();
      }

      onExpandOnHoveringChange(true);
    },
    { wait: 100 },
  );

  // 使用 useDebounceFn 处理收起
  const { run: handleCollapse } = useDebounceFn(
    () => {
      onLeave?.();
      if (isSidebarMixed) {
        unlock();
      }
      if (!expandOnHover) {
        onExpandOnHoveringChange(false);
        onCollapseChange(true);
        onExtraVisibleChange(false);
      }
    },
    { wait: 100 },
  );

  const handleMouseenter = useCallback(() => {
    // if (e.nativeEvent.offsetX < 10) return;
    if (expandOnHover) return;
    handleExpand();
  }, [expandOnHover, handleExpand]);

  const handleMouseleave = useCallback(() => {
    handleCollapse();
  }, [handleCollapse]);

  useEffect(() => {
    if (fixedExtra) {
      onExtraVisibleChange(true);
    }
  }, [fixedExtra, onExtraVisibleChange]);

  // 额外标题样式
  const extraTitleStyle = useMemo((): CSSProperties => {
    return {
      height: `${headerHeight - 1}px`,
    };
  }, [headerHeight]);

  // 内容宽度样式
  const contentWidthStyle = useMemo((): CSSProperties => {
    if (isSidebarMixed && fixedExtra) {
      return { width: `${collapse ? collapseWidth : mixedWidth}px` };
    }
    return {};
  }, [isSidebarMixed, fixedExtra, collapse, collapseWidth, mixedWidth]);

  // 内容样式
  const contentStyle = useMemo((): CSSProperties => {
    return {
      height: `calc(100% - ${headerHeight + collapseHeight}px)`,
      paddingTop: '8px',
      ...contentWidthStyle,
    };
  }, [headerHeight, collapseHeight, contentWidthStyle]);

  // 头部样式
  const headerStyle = useMemo((): CSSProperties => {
    return {
      ...(isSidebarMixed ? { display: 'flex', justifyContent: 'center' } : {}),
      height: `${headerHeight}px`,
      ...contentWidthStyle,
    };
  }, [isSidebarMixed, headerHeight, contentWidthStyle]);

  // 额外内容样式
  const extraContentStyle = useMemo((): CSSProperties => {
    return {
      height: `calc(100% - ${headerHeight + collapseHeight}px)`,
    };
  }, [headerHeight, collapseHeight]);

  // 折叠样式
  const collapseStyle = useMemo((): CSSProperties => {
    return {
      height: `${collapseHeight}px`,
    };
  }, [collapseHeight]);

  // 隐藏的侧边栏渲染
  const hiddenSidebarNode = useShow(domVisible, () => (
    <div
      className={`h-full transition-all duration-150 ${theme}`}
      style={hiddenSideStyle}
    />
  ));

  // 固定按钮渲染
  const fixedButtonNode = useShow(!collapse && !isSidebarMixed, () => (
    <SidebarFixedButton
      expandOnHover={expandOnHover}
      onExpandOnHoverChange={onExpandOnHoverChange}
    />
  ));

  // Logo渲染
  const logoNode = useShow(showLogo && !!logo, () => (
    <div
      className="flex h-[50px] items-center justify-center"
      style={headerStyle}
    >
      {logo}
    </div>
  ));

  // 折叠按钮渲染
  const collapseButtonNode = useShow(
    showCollapseButton && !isSidebarMixed,
    () => (
      <SidebarCollapseButton
        collapsed={collapse}
        onCollapsedChange={onCollapseChange}
      />
    ),
  );

  // 混合模式下的折叠按钮
  const mixedCollapseButtonNode = useShow(
    isSidebarMixed && expandOnHover,
    () => (
      <SidebarCollapseButton
        collapsed={extraCollapse}
        onCollapsedChange={onExtraCollapseChange}
      />
    ),
  );

  // 混合模式下的固定按钮和标题
  const mixedFixedContentNode = useShow(!extraCollapse, () => (
    <>
      <SidebarFixedButton
        expandOnHover={expandOnHover}
        onExpandOnHoverChange={onExpandOnHoverChange}
      />
      {extraTitle && (
        <div className="flex items-center pl-2" style={extraTitleStyle}>
          {extraTitle}
        </div>
      )}
    </>
  ));

  // 混合模式下的额外侧边栏渲染
  const mixedSidebarNode = useShow(isSidebarMixed, () => (
    <div
      className={`border-border bg-sidebar fixed top-0 h-full overflow-hidden border-r transition-all duration-200 ${
        extraVisible ? 'border-l' : ''
      }`}
      ref={asideRef}
      style={extraStyle}
    >
      {mixedCollapseButtonNode}
      {mixedFixedContentNode}
      <XpressScrollbar
        className="border-border py-2"
        shadow={true}
        shadowBorder={true}
        style={extraContentStyle}
      >
        {extra}
      </XpressScrollbar>
    </div>
  ));

  return (
    <>
      {hiddenSidebarNode}
      <aside
        className={`fixed left-0 top-0 h-full transition-all duration-150 ${theme} ${
          isSidebarMixed
            ? 'bg-sidebar-deep'
            : 'bg-sidebar border-border border-r'
        }`}
        onMouseEnter={handleMouseenter}
        onMouseLeave={handleMouseleave}
        style={style}
      >
        {fixedButtonNode}
        {logoNode}
        <XpressScrollbar shadow={true} shadowBorder={true} style={contentStyle}>
          {children}
        </XpressScrollbar>
        <div style={collapseStyle} />
        {collapseButtonNode}
        {mixedSidebarNode}
      </aside>
    </>
  );
};

export default LayoutSidebar;
