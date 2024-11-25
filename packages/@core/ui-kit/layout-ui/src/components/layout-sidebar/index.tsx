import type { CSSProperties, FC, MouseEvent } from 'react';

// import { VbenScrollbar } from '@vben-core/shadcn-ui';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useScrollLock } from '../../hooks/useScrollLock';
import { SidebarCollapseButton, SidebarFixedButton } from '../widgets';

interface Props {
  /** 子组件 */
  children?: React.ReactNode;
  /**
   * 折叠
   */
  collapse: boolean;
  /**
   * 折叠区域高度
   * @default 42
   */
  collapseHeight?: number;
  /**
   * 折叠宽度
   * @default 48
   */
  collapseWidth?: number;
  /**
   * 隐藏的dom是否可见
   * @default true
   */
  domVisible?: boolean;
  /**
   * 展开时是否悬停
   */
  expandOnHover: boolean;
  /**
   * 展开时是否悬停
   */
  expandOnHovering: boolean;
  /** 额外内容 */
  extra?: React.ReactNode;
  /** 扩展区域折叠状态 */
  extraCollapse: boolean;
  /** 额外内容标题 */
  extraTitle?: React.ReactNode;
  /** 扩展区域可见性 */
  extraVisible: boolean;
  /**
   * 扩展区域宽度
   */
  extraWidth: number;
  /**
   * 固定扩展区域
   * @default false
   */
  fixedExtra?: boolean;

  /**
   * 头部高度
   */
  headerHeight: number;
  /**
   * 是否侧边混合模式
   * @default false
   */
  isSidebarMixed?: boolean;

  /** Logo组件 */
  logo?: React.ReactNode;
  /**
   * 顶部margin
   * @default 60
   */
  marginTop?: number;
  /**
   * 混合菜单宽度
   * @default 80
   */
  mixedWidth?: number;
  /**
   * 折叠变化
   */
  onCollapseChange: (collapse: boolean) => void;
  /**
   * 展开时是否悬停变化
   */
  onExpandOnHoverChange: (expandOnHover: boolean) => void;
  /**
   * 展开时是否悬停变化
   */
  onExpandOnHoveringChange: (expandOnHovering: boolean) => void;

  /** 扩展区域折叠状态改变事件 */
  onExtraCollapseChange: (collapse: boolean) => void;

  /** 扩展区域可见性改变事件 */
  onExtraVisibleChange: (visible: boolean) => void;
  onLeave: () => void;

  /**
   * 顶部padding
   * @default 60
   */
  paddingTop?: number;

  /**
   * 是否显示
   * @default true
   */
  show?: boolean;

  /**
   * 显示折叠按钮
   * @default false
   */
  showCollapseButton?: boolean;

  /** 是否显示Logo */
  showLogo?: boolean;

  /**
   * 主题
   */
  theme: string;

  /**
   * 宽度
   */
  width: number;

  /**
   * zIndex
   * @default 0
   */
  zIndex?: number;
}

const LayoutSidebar: FC<Props> = ({
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

  const handleMouseenter = useCallback(
    (e: MouseEvent) => {
      if (e.nativeEvent.offsetX < 10) return;
      if (expandOnHover) return;

      if (!expandOnHovering) {
        onCollapseChange(false);
      }

      if (isSidebarMixed) {
        lock();
      }

      onExpandOnHoveringChange(true);
    },
    [
      expandOnHover,
      expandOnHovering,
      isSidebarMixed,
      lock,
      onCollapseChange,
      onExpandOnHoveringChange,
    ],
  );

  const handleMouseleave = useCallback(() => {
    onLeave();
    if (isSidebarMixed) {
      unlock();
    }
    if (expandOnHover) return;

    onExpandOnHoveringChange(false);
    onCollapseChange(true);
    onExtraVisibleChange(false);
  }, [
    isSidebarMixed,
    expandOnHover,
    unlock,
    onLeave,
    onExpandOnHoveringChange,
    onCollapseChange,
    onExtraVisibleChange,
  ]);

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

  return (
    <>
      {domVisible && (
        <div
          className={`h-full transition-all duration-150 ${theme}`}
          style={hiddenSideStyle}
        />
      )}

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
        {!collapse && !isSidebarMixed && (
          <SidebarFixedButton
            expandOnHover={expandOnHover}
            onExpandOnHoverChange={onExpandOnHoverChange}
          />
        )}

        {showLogo && logo && (
          <div
            className="flex h-[50px] items-center justify-center"
            style={headerStyle}
          >
            {logo}
          </div>
        )}

        <div className="flex-1 overflow-hidden" style={contentStyle}>
          {children}
        </div>

        <div style={collapseStyle} />

        {showCollapseButton && !isSidebarMixed && (
          <SidebarCollapseButton
            collapsed={collapse}
            onCollapsedChange={onCollapseChange}
          />
        )}

        {isSidebarMixed && (
          <div
            className={`border-border bg-sidebar fixed top-0 h-full overflow-hidden border-r transition-all duration-200 ${
              extraVisible ? 'border-l' : ''
            }`}
            ref={asideRef}
            style={extraStyle}
          >
            {isSidebarMixed && expandOnHover && (
              <SidebarCollapseButton
                collapsed={extraCollapse}
                onCollapsedChange={onExtraCollapseChange}
              />
            )}

            {!extraCollapse && (
              <SidebarFixedButton
                expandOnHover={expandOnHover}
                onExpandOnHoverChange={onExpandOnHoverChange}
              />
            )}

            {!extraCollapse && extraTitle && (
              <div className="flex items-center pl-2" style={extraTitleStyle}>
                {extraTitle}
              </div>
            )}

            <div className="flex-1 overflow-hidden" style={extraContentStyle}>
              {extra}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default LayoutSidebar;
