import type { FC } from 'react';

import type { LayoutSidebarProps } from './types';

import { useScrollLock, useShow } from '@xpress-core/hooks';
import { XpressScrollbar } from '@xpress-core/shadcn-ui';

import { useDebounceFn } from 'ahooks';
import { useCallback, useEffect, useRef } from 'react';

import { useLayoutContext } from '../../xpress-layout/context';
import { SidebarCollapseButton, SidebarFixedButton } from '../widgets';
import { useLayoutStyles } from './useLayoutStyles';

const LayoutSidebar: FC<LayoutSidebarProps> = ({
  collapseHeight = 42,
  collapseWidth = 48,
  domVisible = true,
  extra,
  extraTitle,
  extraWidth,
  fixedExtra = false,
  headerHeight,
  isSidebarMixed = false,
  logo,
  marginTop = 0,
  mixedWidth = 70,
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
  const {
    onSideMouseLeave,
    setSidebarCollapse,
    setSidebarExpandOnHovering,
    setSidebarExtraVisible,
    sidebarCollapse,
    sidebarExpandOnHover,
    sidebarExpandOnHovering,
    sidebarExtraCollapse,
    sidebarExtraVisible,
  } = useLayoutContext();

  const {
    collapseStyle,
    contentStyle,
    extraContentStyle,
    extraStyle,
    extraTitleStyle,
    headerStyle,
    hiddenSideStyle,
    style,
  } = useLayoutStyles({
    collapse: sidebarCollapse,
    collapseHeight,
    collapseWidth,
    expandOnHover: sidebarExpandOnHover,
    expandOnHovering: sidebarExpandOnHovering,
    extraVisible: sidebarExtraVisible,
    extraWidth,
    fixedExtra,
    headerHeight,
    isSidebarMixed,
    marginTop,
    mixedWidth,
    paddingTop,
    show,
    width,
    zIndex,
  });

  // 使用 useDebounceFn 处理展开
  const { run: handleExpand } = useDebounceFn(
    () => {
      if (!sidebarExpandOnHovering) {
        setSidebarCollapse(false);
      }

      if (isSidebarMixed) {
        lock?.();
      }

      setSidebarExpandOnHovering(true);
    },
    { wait: 100 },
  );

  // 使用 useDebounceFn 处理收起
  const { run: handleCollapse } = useDebounceFn(
    () => {
      onSideMouseLeave?.();
      if (isSidebarMixed) {
        unlock?.();
      }
      if (!sidebarExpandOnHover) {
        setSidebarExpandOnHovering(false);
        setSidebarCollapse(true);
        setSidebarExtraVisible(false);
      }
    },
    { wait: 100 },
  );

  const handleMouseenter = useCallback(() => {
    // if (e.nativeEvent.offsetX < 10) return;
    if (sidebarExpandOnHover) return;
    handleExpand();
  }, [sidebarExpandOnHover, handleExpand]);

  const handleMouseleave = useCallback(() => {
    handleCollapse();
  }, [handleCollapse]);

  useEffect(() => {
    if (fixedExtra) {
      setSidebarExtraVisible(true);
    }
  }, [fixedExtra, setSidebarExtraVisible]);

  // 隐藏的侧边栏渲染
  const hiddenSidebarNode = useShow(domVisible, () => (
    <div
      className={`h-full transition-all duration-150 ${theme}`}
      style={hiddenSideStyle}
    />
  ));

  // 固定按钮渲染
  const fixedButtonNode = useShow(!sidebarCollapse && !isSidebarMixed, () => (
    <SidebarFixedButton />
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
    () => <SidebarCollapseButton />,
  );

  // 混合模式下的折叠按钮
  const mixedCollapseButtonNode = useShow(
    isSidebarMixed && sidebarExpandOnHover,
    () => <SidebarCollapseButton />,
  );

  // 混合模式下的固定按钮和标题
  const mixedFixedContentNode = useShow(!sidebarExtraCollapse, () => (
    <>
      <SidebarFixedButton />
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
        sidebarExtraVisible ? 'border-l' : ''
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
        className={`fixed left-0 top-0 h-full transition-all duration-200 ${theme} ${
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
