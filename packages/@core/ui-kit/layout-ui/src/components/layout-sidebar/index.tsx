import type { FC } from 'react';

import type { LayoutSidebarProps } from './types';

import { useScrollLock, useShow } from '@xpress-core/hooks';
import { XpressScrollbar } from '@xpress-core/shadcn-ui';

import { useDebounceFn } from 'ahooks';
import { useCallback, useEffect, useRef } from 'react';

import { useLayoutContext } from '../../xpress-layout/context';
import { SidebarCollapseButton, SidebarFixedButton } from '../widgets';
import { useLayoutStyles } from './useLayoutStyles';

/**
 * 布局侧边栏组件
 * @param collapseHeight - 折叠时的高度
 * @param collapseWidth - 折叠时的宽度
 * @param domVisible - 是否渲染占位侧边栏
 * @param extra - 额外的侧边栏内容
 * @param extraTitle - 额外侧边栏的标题
 * @param extraWidth - 额外侧边栏的宽度
 * @param fixedExtra - 是否固定额外侧边栏
 * @param headerHeight - 头部高度
 * @param isSidebarMixed - 是否为混合模式侧边栏
 * @param logo - Logo组件
 * @param marginTop - 上边距
 * @param mixedWidth - 混合模式下的宽度
 * @param paddingTop - 内边距顶部
 * @param show - 是否显示侧边栏
 * @param showCollapseButton - 是否显示折叠按钮
 * @param showLogo - 是否显示Logo
 * @param theme - 主题
 * @param width - 侧边栏宽度
 * @param zIndex - 层级
 */
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
  openMaskMenu,
  paddingTop = 0,
  show = true,
  showCollapseButton = true,
  showLogo = true,
  theme,
  width,
  zIndex = 0,
  children,
}) => {
  // 侧边栏DOM引用
  const asideRef = useRef<HTMLDivElement>(null);
  // 控制body滚动锁定的hooks
  const { lock, unlock } = useScrollLock(document.body);

  // 从布局上下文中获取状态和方法
  const {
    onSideMouseLeave,
    setSidebarCollapse,
    setSidebarExpandOnHover,
    setSidebarExpandOnHovering,
    setSidebarExtraCollapse,
    setSidebarExtraVisible,
    sidebarCollapse,
    sidebarExpandOnHover,
    sidebarExpandOnHovering,
    sidebarExtraCollapse,
    sidebarExtraVisible,
  } = useLayoutContext();

  // 获取各种样式配置
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

  // 防抖处理侧边栏展开
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

  // 防抖处理侧边栏收起
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

  // 处理鼠标进入事件
  const handleMouseenter = useCallback(() => {
    if (sidebarExpandOnHover) return;
    handleExpand();
  }, [sidebarExpandOnHover, handleExpand]);

  // 处理鼠标离开事件
  const handleMouseleave = useCallback(() => {
    handleCollapse();
  }, [handleCollapse]);

  // 处理固定额外侧边栏的效果
  useEffect(() => {
    if (fixedExtra) {
      setSidebarExtraVisible(true);
    }
  }, [fixedExtra, setSidebarExtraVisible]);

  /**
   * 隐藏的侧边栏节点
   * 作用：
   * 1. 当实际侧边栏隐藏时，作为占位符保持布局稳定
   * 2. 防止页面布局突然跳动
   * 3. 提供平滑的过渡效果
   */
  const hiddenSidebarNode = useShow(domVisible, () => (
    <div
      className={`h-full transition-all duration-150 ${theme}`}
      style={hiddenSideStyle}
    />
  ));

  // 固定按钮节点 - 控制侧边栏是否固定展开
  const fixedButtonNode = useShow(!sidebarCollapse && !isSidebarMixed, () => (
    <SidebarFixedButton
      setSidebarExpandOnHover={setSidebarExpandOnHover}
      sidebarExpandOnHover={sidebarExpandOnHover}
    />
  ));

  // Logo节点 - 显示应用程序logo
  const logoNode = useShow(showLogo && !!logo, () => (
    <div className="flex h-[50px] items-center" style={headerStyle}>
      {logo}
    </div>
  ));

  // 折叠按钮节点 - 控制侧边栏的展开/收起
  const collapseButtonNode = useShow(
    showCollapseButton && !isSidebarMixed,
    () => (
      <SidebarCollapseButton
        setSidebarCollapse={setSidebarCollapse}
        sidebarCollapse={sidebarCollapse}
      />
    ),
  );

  // 混合模式下的折叠按钮
  const mixedCollapseButtonNode = useShow(
    isSidebarMixed && sidebarExpandOnHover,
    () => (
      <SidebarCollapseButton
        setSidebarCollapse={setSidebarExtraCollapse}
        sidebarCollapse={sidebarExtraCollapse}
      />
    ),
  );

  // 混合模式下的固定按钮和标题区域
  const mixedFixedContentNode = useShow(!sidebarExtraCollapse, () => (
    <>
      <SidebarFixedButton
        setSidebarExpandOnHover={setSidebarExpandOnHover}
        sidebarExpandOnHover={sidebarExpandOnHover}
      />
      {extraTitle && (
        <div className="flex items-center pl-2" style={extraTitleStyle}>
          {extraTitle}
        </div>
      )}
    </>
  ));

  // 混合模式下的额外侧边栏 - 提供额外的导航或功能区域
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
      {
        <aside
          className={`fixed left-0 top-0 h-full transition-all duration-200 ${theme} ${
            isSidebarMixed
              ? 'bg-sidebar-deep'
              : 'bg-sidebar border-border border-r'
          } ${domVisible || openMaskMenu ? '' : 'hidden'}`}
          onMouseEnter={handleMouseenter}
          onMouseLeave={handleMouseleave}
          style={style}
        >
          {fixedButtonNode}
          {logoNode}
          <XpressScrollbar
            shadow={true}
            shadowBorder={true}
            style={contentStyle}
          >
            {children}
          </XpressScrollbar>
          <div style={collapseStyle} />
          {collapseButtonNode}
          {mixedSidebarNode}
        </aside>
      }
    </>
  );
};

export default LayoutSidebar;
