import type { FC } from 'react';

import type { XpressLayoutProps } from './types';

import {
  useEnhancedScroll,
  useLayoutFooterStyle,
  useLayoutHeaderStyle,
  useShow,
} from '@xpress-core/hooks';
import { Menu } from '@xpress-core/icons';
import { XpressIconButton } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import { useEventListener, useThrottleFn } from 'ahooks';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutSidebar,
  LayoutTabbar,
} from '../components';
import { useLayout } from '../hooks';
import { useLayoutContext } from './context';
import { LayoutProvider } from './LayoutProvider';

const XpressLayoutInner: FC<XpressLayoutProps> = ({
  components,
  contentCompact = 'wide',
  contentCompactWidth = 1200,
  contentPadding = 0,
  contentPaddingBottom = 0,
  contentPaddingLeft = 0,
  contentPaddingRight = 0,
  contentPaddingTop = 0,
  footerEnable = false,
  footerFixed = true,
  footerHeight = 32,
  headerHeight = 50,
  headerHidden = false,
  headerMode = 'fixed',
  headerTheme,
  headerToggleSidebarButton = true,
  headerVisible = true,
  isMobile = false,
  layout = 'sidebar-nav',
  logo,
  menu,
  mixedMenu,
  onToggleSidebar,
  sidebarCollapseShowTitle = false,
  sidebarExtraCollapsedWidth = 60,
  sidebarHidden = false,
  sidebarMixedWidth = 80,
  sidebarTheme = 'dark',
  sidebarWidth = 180,
  sideCollapseWidth = 60,
  sideExtra,
  sideExtraTitle,
  tabbarEnable = true,
  tabbarHeight = 40,
  zIndex = 200,
}) => {
  const {
    setSidebarCollapse,
    sidebarCollapse,
    sidebarEnable,
    sidebarExpandOnHover,
    sidebarExpandOnHovering,
    sidebarExtraCollapse,
    sidebarExtraVisible,
  } = useLayoutContext();
  const [headerIsHidden, setHeaderIsHidden] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const {
    arrivedState,
    directions,
    isScrolling,
    y: scrollY,
  } = useEnhancedScroll(document);

  const {
    currentLayout,
    isFullContent,
    isHeaderNav,
    isMixedNav,
    isSidebarMixedNav,
  } = useLayout({ isMobile, layout });

  const [mouseY, setMouseY] = useState(0);
  useEventListener(
    'mousemove',
    (e) => {
      setMouseY(e.clientY);
    },
    { target: contentRef },
  );
  /**
   * 顶栏是否自动隐藏
   */
  const isHeaderAutoMode = useMemo(() => {
    return headerMode === 'auto';
  }, [headerMode]);

  const headerWrapperHeight = useMemo(() => {
    let height = 0;
    if (headerVisible && !headerHidden) {
      height += headerHeight;
    }
    if (tabbarEnable) {
      height += tabbarHeight;
    }
    return height;
  }, [headerVisible, headerHidden, tabbarEnable, tabbarHeight, headerHeight]);

  const getSideCollapseWidth = useMemo(() => {
    const collapseWidth =
      sidebarCollapseShowTitle || isSidebarMixedNav
        ? sidebarMixedWidth
        : sideCollapseWidth;

    return collapseWidth;
  }, [
    sidebarCollapseShowTitle,
    isSidebarMixedNav,
    sidebarMixedWidth,
    sideCollapseWidth,
  ]);

  /**
   * 动态获取侧边区域是否可见
   */
  const sidebarEnableState = useMemo(() => {
    return !isHeaderNav && sidebarEnable;
  }, [isHeaderNav, sidebarEnable]);

  /**
   * 侧边区域离顶部高度
   */
  const sidebarMarginTop = useMemo(() => {
    return isMixedNav && !isMobile ? headerHeight : 0;
  }, [isMixedNav, isMobile, headerHeight]);

  /**
   * 动态获取侧边宽度
   */
  const getSidebarWidth = useMemo(() => {
    let width = 0;

    if (sidebarHidden) {
      return width;
    }

    if (
      !sidebarEnable ||
      (sidebarHidden && !isSidebarMixedNav && !isMixedNav)
    ) {
      return width;
    }

    if (isSidebarMixedNav && !isMobile) {
      width = sidebarMixedWidth;
    } else if (sidebarCollapse) {
      width = isMobile ? 0 : getSideCollapseWidth;
    } else {
      width = sidebarWidth;
    }
    return width;
  }, [
    sidebarHidden,
    sidebarEnable,
    isSidebarMixedNav,
    isMixedNav,
    isMobile,
    sidebarMixedWidth,
    sidebarCollapse,
    getSideCollapseWidth,
    sidebarWidth,
  ]);

  /**
   * 获取扩展区域宽度
   */
  const sidebarExtraWidth = useMemo(() => {
    return sidebarExtraCollapse ? sidebarExtraCollapsedWidth : sidebarWidth;
  }, [sidebarExtraCollapse, sidebarExtraCollapsedWidth, sidebarWidth]);

  /**
   * 是否侧边栏模式，包含混合侧边
   */
  const isSideMode = useMemo(() => {
    return (
      currentLayout === 'mixed-nav' ||
      currentLayout === 'sidebar-mixed-nav' ||
      currentLayout === 'sidebar-nav' ||
      currentLayout === 'header-sidebar-nav'
    );
  }, [currentLayout]);

  /**
   * header fixed值
   */
  const headerFixed = useMemo(() => {
    return (
      isMixedNav ||
      headerMode === 'fixed' ||
      headerMode === 'auto-scroll' ||
      headerMode === 'auto'
    );
  }, [isMixedNav, headerMode]);

  const showSidebar = useMemo(() => {
    return isSideMode && sidebarEnable && !sidebarHidden;
  }, [isSideMode, sidebarEnable, sidebarHidden]);

  /**
   * 遮罩可见性
   */
  const maskVisible = useMemo(() => {
    return !sidebarCollapse && isMobile;
  }, [sidebarCollapse, isMobile]);

  /**
   * 主要内容区域样式
   */
  const mainStyle = useMemo(() => {
    let width = '100%';
    let sidebarAndExtraWidth = 'unset';

    if (
      headerFixed &&
      currentLayout !== 'header-nav' &&
      currentLayout !== 'mixed-nav' &&
      showSidebar &&
      !isMobile
    ) {
      // fixed模式下生效
      const isSideNavEffective =
        isSidebarMixedNav && sidebarExpandOnHover && sidebarExtraVisible;

      if (isSideNavEffective) {
        const sideCollapseWidth = sidebarCollapse
          ? getSideCollapseWidth
          : sidebarMixedWidth;
        const sideWidth = sidebarExtraCollapse
          ? sidebarExtraCollapsedWidth
          : sidebarWidth;

        // 100% - 侧边菜单混合宽度 - 菜单宽度
        sidebarAndExtraWidth = `${sideCollapseWidth + sideWidth}px`;
        width = `calc(100% - ${sidebarAndExtraWidth})`;
      } else {
        sidebarAndExtraWidth =
          sidebarExpandOnHovering && !sidebarExpandOnHover
            ? `${getSideCollapseWidth}px`
            : `${getSidebarWidth}px`;

        width = `calc(100% - ${sidebarAndExtraWidth})`;
        if (currentLayout === 'header-sidebar-nav') {
          width = `100%`;
        }
      }
    }
    return {
      sidebarAndExtraWidth,
      width,
    };
  }, [
    headerFixed,
    currentLayout,
    showSidebar,
    isMobile,
    isSidebarMixedNav,
    sidebarExpandOnHover,
    sidebarExtraVisible,
    sidebarCollapse,
    getSideCollapseWidth,
    sidebarMixedWidth,
    sidebarExtraCollapse,
    sidebarExtraCollapsedWidth,
    sidebarWidth,
    sidebarExpandOnHovering,
    getSidebarWidth,
  ]);

  /**
   * 计算tabbar样式
   */
  const tabbarStyle = useMemo(() => {
    let width = '';
    let marginLeft = 0;

    if (!isMixedNav || sidebarHidden) {
      width = '100%';
    } else if (sidebarEnable) {
      const onHoveringWidth = sidebarExpandOnHover
        ? sidebarWidth
        : getSideCollapseWidth;

      marginLeft = sidebarCollapse ? getSideCollapseWidth : onHoveringWidth;

      width = `calc(100% - ${sidebarCollapse ? getSidebarWidth : onHoveringWidth}px)`;
    } else {
      width = '100%';
    }

    return {
      marginLeft: `${marginLeft}px`,
      width,
    };
  }, [
    isMixedNav,
    sidebarHidden,
    sidebarEnable,
    sidebarExpandOnHover,
    sidebarWidth,
    getSideCollapseWidth,
    sidebarCollapse,
    getSidebarWidth,
  ]);

  /**
   * 内容区域样式
   */
  const contentStyle = useMemo(() => {
    const fixed = headerFixed;

    return {
      marginTop:
        fixed &&
        !isFullContent &&
        !headerIsHidden &&
        (!isHeaderAutoMode || scrollY < headerWrapperHeight)
          ? `${headerWrapperHeight}px`
          : 0,
      paddingBottom: `${footerEnable && footerFixed ? footerHeight : 0}px`,
    };
  }, [
    headerFixed,
    isFullContent,
    headerIsHidden,
    isHeaderAutoMode,
    scrollY,
    headerWrapperHeight,
    footerEnable,
    footerFixed,
    footerHeight,
  ]);

  /**
   * 头部z-index
   */
  const headerZIndex = useMemo(() => {
    const offset = isMixedNav ? 1 : 0;
    return zIndex + offset;
  }, [isMixedNav, zIndex]);

  /**
   * 头部包装器样式
   */
  const headerWrapperStyle = useMemo(() => {
    const fixed = headerFixed;
    return {
      height: isFullContent ? '0' : `${headerWrapperHeight}px`,
      left: isMixedNav ? 0 : mainStyle.sidebarAndExtraWidth,
      position: fixed ? ('fixed' as const) : ('static' as const),
      top: headerIsHidden || isFullContent ? `-${headerWrapperHeight}px` : 0,
      width: mainStyle.width,
      zIndex: headerZIndex,
    };
  }, [
    headerFixed,
    isFullContent,
    headerWrapperHeight,
    isMixedNav,
    mainStyle,
    headerIsHidden,
    headerZIndex,
  ]);

  /**
   * 侧边栏z-index
   */
  const sidebarZIndex = useMemo(() => {
    let offset = isMobile || isSideMode ? 1 : -1;

    if (isMixedNav) {
      offset += 1;
    }

    return zIndex + offset;
  }, [isMobile, isSideMode, isMixedNav, zIndex]);

  /**
   * 页脚宽度
   */
  const footerWidth = useMemo(() => {
    if (!footerFixed) {
      return '100%';
    }
    return mainStyle.width;
  }, [footerFixed, mainStyle]);

  /**
   * 遮罩样式
   */
  const maskStyle = useMemo(() => {
    return { zIndex };
  }, [zIndex]);

  /**
   * 是否显示头部切换按钮
   */
  const showHeaderToggleButton = useMemo(() => {
    return (
      isMobile ||
      (headerToggleSidebarButton &&
        isSideMode &&
        !isSidebarMixedNav &&
        !isMixedNav &&
        !isMobile)
    );
  }, [
    isMobile,
    headerToggleSidebarButton,
    isSideMode,
    isSidebarMixedNav,
    isMixedNav,
  ]);

  /**
   * 是否显示头部logo
   */
  const showHeaderLogo = useMemo(() => {
    return !isSideMode || isMixedNav || isMobile;
  }, [isSideMode, isMixedNav, isMobile]);

  const { setLayoutHeaderHeight } = useLayoutHeaderStyle();
  const { setLayoutFooterHeight } = useLayoutFooterStyle();

  // 监听isMobile变化
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapse(true);
    }
  }, [isMobile, setSidebarCollapse]);

  // 监听headerWrapperHeight和isFullContent变化
  useEffect(() => {
    setLayoutHeaderHeight(isFullContent ? 0 : headerWrapperHeight);
  }, [headerWrapperHeight, isFullContent, setLayoutHeaderHeight]);

  // 监听footerHeight变化
  useEffect(() => {
    setLayoutFooterHeight(footerHeight);
  }, [footerHeight, setLayoutFooterHeight]);

  // 监听鼠标移动和headerMode
  useEffect(() => {
    const handleMouseMove = () => {
      setHeaderIsHidden(mouseY > headerWrapperHeight);
    };

    if (!isHeaderAutoMode || isMixedNav || isFullContent) {
      if (headerMode !== 'auto-scroll') {
        setHeaderIsHidden(false);
      }
      return;
    }

    setHeaderIsHidden(true);
    handleMouseMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerMode, mouseY]);

  // 处理滚动相关的header隐藏逻辑
  const checkHeaderIsHidden = useThrottleFn(
    (isScrollingUp: boolean, isScrollingDown: boolean, topArrived: boolean) => {
      if (scrollY < headerWrapperHeight) {
        setHeaderIsHidden(false);
        return;
      }
      if (topArrived) {
        setHeaderIsHidden(false);
        return;
      }

      if (isScrollingUp) {
        setHeaderIsHidden(false);
      } else if (isScrollingDown) {
        setHeaderIsHidden(true);
      }
    },
    { wait: 300 },
  );

  useEffect(() => {
    if (headerMode !== 'auto-scroll' || isMixedNav || isFullContent) {
      return;
    }

    if (isScrolling) {
      checkHeaderIsHidden.run(
        directions === 'up',
        directions === 'down',
        arrivedState.top,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollY, headerMode]);

  /**
   * 处理遮罩点击事件
   */
  const handleClickMask = () => {
    setSidebarCollapse(true);
  };

  /**
   * 处理头部切换按钮点击事件
   */
  const handleHeaderToggle = () => {
    if (isMobile) {
      setSidebarCollapse(false);
    } else {
      onToggleSidebar();
    }
  };

  /**
   * 是否显示Logo
   */
  const showLogo = useMemo(() => {
    return isSideMode && !isMixedNav;
  }, [isSideMode, isMixedNav]);

  const SCROLL_FIXED_CLASS = `_scroll__fixed_`;

  // 侧边栏渲染
  const sidebarNode = useShow(sidebarEnableState, () => (
    <LayoutSidebar
      collapseWidth={getSideCollapseWidth}
      domVisible={!isMobile}
      extra={sideExtra}
      extraTitle={sideExtraTitle}
      extraWidth={sidebarExtraWidth}
      fixedExtra={sidebarExpandOnHover}
      headerHeight={isMixedNav ? 0 : headerHeight}
      isSidebarMixed={isSidebarMixedNav}
      logo={logo}
      marginTop={sidebarMarginTop}
      mixedWidth={sidebarMixedWidth}
      show={showSidebar}
      showLogo={showLogo}
      theme={sidebarTheme}
      width={getSidebarWidth}
      zIndex={sidebarZIndex}
    >
      {isSidebarMixedNav ? mixedMenu : menu}
    </LayoutSidebar>
  ));

  // 头部渲染
  const headerNode = useShow(
    headerVisible && !isFullContent && !headerIsHidden,
    () => (
      <LayoutHeader
        fullWidth={!isSideMode}
        height={headerHeight}
        isMobile={isMobile}
        logo={showHeaderLogo ? logo : undefined}
        show={true}
        // sidebarWidth={getSidebarWidth}
        theme={headerTheme}
        toggleButton={
          showHeaderToggleButton && (
            <XpressIconButton
              className="my-0 ml-2 mr-1 rounded-md"
              onClick={handleHeaderToggle}
            >
              <Menu className="size-4" />
            </XpressIconButton>
          )
        }
      >
        {components?.header}
      </LayoutHeader>
    ),
  );

  // 标签栏渲染
  const tabbarNode = useShow(tabbarEnable, () => (
    <LayoutTabbar
      className="layout-tabbar"
      height={tabbarHeight}
      style={tabbarStyle}
    >
      {components?.tabbar}
    </LayoutTabbar>
  ));

  // 页脚渲染
  const footerNode = useShow(footerEnable && !isFullContent, () => (
    <LayoutFooter
      fixed={footerFixed}
      height={footerHeight}
      show={true}
      width={footerWidth}
      zIndex={zIndex}
    >
      {components?.footer}
    </LayoutFooter>
  ));

  // 遮罩层渲染
  const maskNode = useShow(maskVisible, () => (
    <div
      className="bg-overlay fixed left-0 top-0 h-full w-full transition-[background-color] duration-200"
      onClick={handleClickMask}
      style={maskStyle}
    />
  ));

  return (
    <div className="relative flex min-h-full w-full">
      {sidebarNode}
      <div
        className="flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in"
        ref={contentRef}
      >
        <div
          className={cn(
            SCROLL_FIXED_CLASS,
            `overflow-hidden transition-all duration-200 ${
              scrollY > 20 ? 'shadow-[0_16px_24px_hsl(var(--background))]' : ''
            }`,
          )}
          style={headerWrapperStyle}
        >
          {headerNode}
          {tabbarNode}
        </div>

        <LayoutContent
          className="transition-[margin-top] duration-200"
          contentCompact={contentCompact}
          contentCompactWidth={contentCompactWidth}
          overlay={components?.['content-overlay']}
          padding={contentPadding}
          paddingBottom={contentPaddingBottom}
          paddingLeft={contentPaddingLeft}
          paddingRight={contentPaddingRight}
          paddingTop={contentPaddingTop}
          style={contentStyle}
        >
          {components?.content}
        </LayoutContent>

        {footerNode}
      </div>

      {components?.extra}
      {maskNode}
    </div>
  );
};

const XpressLayout: FC<XpressLayoutProps> = (props) => {
  return (
    <LayoutProvider
      onSidebarCollapseChange={props.onSidebarCollapseChange}
      onSidebarEnableChange={props.onSidebarEnableChange}
      onSidebarExpandOnHoverChange={props.onSidebarExpandOnHoverChange}
      onSidebarExtraCollapseChange={props.onSidebarExtraCollapseChange}
      onSidebarExtraVisibleChange={props.onSidebarExtraVisibleChange}
      onSideMouseLeave={props.onSideMouseLeave}
      sidebarCollapse={props.sidebarCollapse ?? false}
      sidebarEnable={props.sidebarEnable ?? true}
      sidebarExpandOnHover={props.sidebarExpandOnHover ?? false}
      sidebarExtraCollapse={props.sidebarExtraCollapse ?? false}
      sidebarExtraVisible={props.sidebarExtraVisible ?? false}
    >
      <XpressLayoutInner {...props} />
    </LayoutProvider>
  );
};

export default XpressLayout;
