import type { FC } from 'react';

import type { XpressLayoutProps } from './typings';

import { Menu } from '@xpress-core/icons';
import { XpressIconButton } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import { useMouse, useThrottleFn } from 'ahooks';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutSidebar,
  LayoutTabbar,
} from './components';
import {
  useEnhancedScroll,
  useLayout,
  useLayoutFooterStyle,
  useLayoutHeaderStyle,
} from './hooks';

interface LayoutComponents {
  logo?: React.ReactNode;
  menu?: React.ReactNode;
  mixedMenu?: React.ReactNode;
  sideExtra?: React.ReactNode;
  sideExtraTitle?: React.ReactNode;
}

interface LayoutSlots {
  content?: React.ReactNode;
  'content-overlay'?: React.ReactNode;
  extra?: React.ReactNode;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  tabbar?: React.ReactNode;
}
interface Props extends XpressLayoutProps, LayoutComponents {
  children?: LayoutSlots;
  /** 侧边栏鼠标离开事件 */
  onSideMouseLeave: () => void;
  /** 切换侧边栏事件 */
  onToggleSidebar: () => void;
}

const XpressLayout: FC<Props> = ({
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
  headerToggleSidebarButton = true,
  headerVisible = true,
  isMobile = false,
  layout = 'sidebar-nav',
  logo,
  menu,
  mixedMenu,
  onSideMouseLeave,
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
  children,
}) => {
  const [sidebarCollapse, setSidebarCollapse] = useState(false);
  const [sidebarExtraVisible, setSidebarExtraVisible] = useState(false);
  const [sidebarExtraCollapse, setSidebarExtraCollapse] = useState(false);
  const [sidebarExpandOnHover, setSidebarExpandOnHover] = useState(false);
  const [sidebarEnable, _setSidebarEnable] = useState(true);
  const [sidebarExpandOnHovering, setSidebarExpandOnHovering] = useState(false);
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
  const { clientY: mouseY } = useMouse(contentRef.current);
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
    return sidebarCollapseShowTitle || isSidebarMixedNav
      ? sidebarMixedWidth
      : sideCollapseWidth;
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
      currentLayout === 'sidebar-nav'
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
    return isSideMode && sidebarEnable;
  }, [isSideMode, sidebarEnable]);

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
  }, [isMobile]);

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
  }, [
    headerMode,
    mouseY,
    isHeaderAutoMode,
    isMixedNav,
    isFullContent,
    headerWrapperHeight,
  ]);

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
  }, [
    scrollY,
    headerMode,
    isMixedNav,
    isFullContent,
    isScrolling,
    directions,
    arrivedState.top,
    headerWrapperHeight,
    checkHeaderIsHidden,
  ]);

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
  return (
    <div className="relative flex min-h-full w-full">
      {sidebarEnableState && (
        <LayoutSidebar
          collapse={sidebarCollapse}
          collapseWidth={getSideCollapseWidth}
          domVisible={!isMobile}
          expandOnHover={sidebarExpandOnHover}
          expandOnHovering={sidebarExpandOnHovering}
          extra={sideExtra}
          extraCollapse={sidebarExtraCollapse}
          extraTitle={sideExtraTitle}
          extraVisible={sidebarExtraVisible}
          extraWidth={sidebarExtraWidth}
          fixedExtra={sidebarExpandOnHover}
          headerHeight={isMixedNav ? 0 : headerHeight}
          isSidebarMixed={isSidebarMixedNav}
          logo={logo}
          marginTop={sidebarMarginTop}
          mixedWidth={sidebarMixedWidth}
          onCollapseChange={setSidebarCollapse}
          onExpandOnHoverChange={setSidebarExpandOnHover}
          onExpandOnHoveringChange={setSidebarExpandOnHovering}
          onExtraCollapseChange={setSidebarExtraCollapse}
          onExtraVisibleChange={setSidebarExtraVisible}
          onLeave={onSideMouseLeave}
          show={showSidebar}
          showLogo={showLogo}
          theme={sidebarTheme}
          width={getSidebarWidth}
          zIndex={sidebarZIndex}
        >
          {/* 根据模式选择显示的菜单 */}
          {isSidebarMixedNav ? mixedMenu : menu}
        </LayoutSidebar>
      )}

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
          {headerVisible && (
            <LayoutHeader
              fullWidth={!isSideMode}
              height={headerHeight}
              isMobile={isMobile}
              logo={showHeaderLogo ? logo : undefined}
              show={!isFullContent && !headerIsHidden}
              sidebarWidth={getSidebarWidth}
              theme={sidebarTheme}
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
              {children?.header}
            </LayoutHeader>
          )}

          {tabbarEnable && (
            <LayoutTabbar
              className="layout-tabbar"
              height={tabbarHeight}
              style={tabbarStyle}
            >
              {children?.tabbar}
            </LayoutTabbar>
          )}
        </div>

        <LayoutContent
          className="transition-[margin-top] duration-200"
          contentCompact={contentCompact}
          contentCompactWidth={contentCompactWidth}
          overlay={children?.['content-overlay']}
          padding={contentPadding}
          paddingBottom={contentPaddingBottom}
          paddingLeft={contentPaddingLeft}
          paddingRight={contentPaddingRight}
          paddingTop={contentPaddingTop}
          style={contentStyle}
        >
          {children?.content}
        </LayoutContent>

        {footerEnable && (
          <LayoutFooter
            fixed={footerFixed}
            height={footerHeight}
            show={!isFullContent}
            width={footerWidth}
            zIndex={zIndex}
          >
            {children?.footer}
          </LayoutFooter>
        )}
      </div>

      {children?.extra}

      {maskVisible && (
        <div
          className="bg-overlay fixed left-0 top-0 h-full w-full transition-[background-color] duration-200"
          onClick={handleClickMask}
          style={maskStyle}
        />
      )}
    </div>
  );
};

export default XpressLayout;
