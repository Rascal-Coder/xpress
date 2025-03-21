import type { Router } from '@xpress-core/router';

import { XpressLayout } from '@xpress-core/layout-ui';
import { usePreferencesContext } from '@xpress-core/preferences';
import { XpressLogo } from '@xpress-core/shadcn-ui';

import { useMemo } from 'react';

import MemoContent from './content-components/content';
import Copyright from './copyright';
import { Extra } from './extra';
import LayoutFooter from './footer';
import Header from './header';
import { ExtraMenu, Menu, MixedMenu } from './menu';
import { Tabbar } from './tabbar';
import { useExtraMenu } from './use-extra-menu';
import { useMixedMenu } from './use-mixed-menu';

function BasicLayout({ router }: { router: Router }) {
  const {
    preferences,
    updatePreferences,
    isDark,
    isHeaderNav,
    isMixedNav,
    isMobile,
    isSideMixedNav,
    layout,
    sidebarCollapsed,
    theme,
    isHeaderSidebarNav,
  } = usePreferencesContext();

  const sidebarTheme = useMemo(() => {
    const dark = isDark || preferences.theme.semiDarkSidebar;

    return dark ? 'dark' : 'light';
  }, [isDark, preferences.theme.semiDarkSidebar]);

  const headerTheme = useMemo(() => {
    const dark = isDark || preferences.theme.semiDarkHeader;
    return dark ? 'dark' : 'light';
  }, [isDark, preferences.theme.semiDarkHeader]);

  const logoClass = useMemo(() => {
    const { collapsedShowTitle } = preferences.sidebar;
    const classes: string[] = [];

    if (collapsedShowTitle && sidebarCollapsed && !isMixedNav) {
      classes.push('mx-auto');
    }

    if (isSideMixedNav) {
      classes.push('flex-center');
    }

    return classes.join(' ');
  }, [isMixedNav, isSideMixedNav, preferences.sidebar, sidebarCollapsed]);

  const isMenuRounded = useMemo(() => {
    return preferences.navigation.styleType === 'rounded';
  }, [preferences.navigation.styleType]);

  const logoCollapsed = useMemo(() => {
    if (isMobile && sidebarCollapsed) {
      return true;
    }
    if (isHeaderNav || isMixedNav || isHeaderSidebarNav) {
      return false;
    }
    return sidebarCollapsed || isSideMixedNav;
  }, [
    isHeaderNav,
    isHeaderSidebarNav,
    isMixedNav,
    isMobile,
    isSideMixedNav,
    sidebarCollapsed,
  ]);

  const showHeaderNav = useMemo(() => {
    return !isMobile && (isHeaderNav || isMixedNav);
  }, [isHeaderNav, isMixedNav, isMobile]);

  const {
    sidebarMenus,
    handleMenuSelect,
    headerMenus,
    sidebarVisible,
    mixHeaderMenus,
    handleMenuOpen,
    sidebarActive,
    headerActive,
  } = useMixedMenu(router);

  // 侧边多列菜单
  const {
    extraActiveMenu,
    extraMenus,
    handleDefaultSelect,
    handleMenuMouseEnter,
    handleMixedMenuSelect,
    handleSideMouseLeave,
    sidebarExtraVisible,
  } = useExtraMenu(router);
  const handleToggleSidebar = () => {
    updatePreferences({
      sidebar: {
        hidden: !preferences.sidebar.hidden,
      },
    });
  };

  return (
    <XpressLayout
      components={{
        // 头部
        header: (
          <Header
            menu={
              <Menu
                defaultActive={headerActive}
                menus={headerMenus}
                mode="horizontal"
                onSelect={(path) => handleMenuSelect(path, 'horizontal')}
                rounded={isMenuRounded}
                theme={theme}
              ></Menu>
            }
            router={router}
            showHeaderNav={showHeaderNav}
          ></Header>
        ),
        // 页脚
        footer: preferences.footer.enable && (
          <LayoutFooter>
            {preferences.copyright.enable && (
              <Copyright {...preferences.copyright} />
            )}
          </LayoutFooter>
        ),
        // 标签栏
        tabbar: <Tabbar router={router} />,
        // 内容
        content: <MemoContent></MemoContent>,
        // 内容覆盖层
        // 'content-overlay': <div>content-overlay</div>,
        // 额外内容
        extra: <Extra />,
      }}
      contentCompact={preferences.app.contentCompact}
      footerEnable={preferences.footer.enable}
      footerFixed={preferences.footer.fixed}
      headerHidden={preferences.header.hidden}
      headerMode={preferences.header.mode}
      headerTheme={headerTheme}
      headerToggleSidebarButton={preferences.widget.sidebarToggle}
      headerVisible={preferences.header.enable}
      isMobile={preferences.app.isMobile}
      layout={layout}
      logo={
        preferences.logo.enable && (
          <XpressLogo
            className={logoClass}
            collapsed={logoCollapsed}
            src={preferences.logo.source}
            text={preferences.app.name}
            theme={showHeaderNav ? headerTheme : theme}
          />
        )
      }
      // 侧边菜单区域
      menu={
        <Menu
          accordion={preferences.navigation.accordion}
          collapse={preferences.sidebar.collapsed}
          collapseShowTitle={preferences.sidebar.collapsedShowTitle}
          defaultActive={sidebarActive}
          menus={sidebarMenus}
          mode="vertical"
          onOpen={handleMenuOpen}
          onSelect={(path) => handleMenuSelect(path, 'vertical')}
          rounded={isMenuRounded}
          theme={theme}
        />
      }
      mixedMenu={
        <MixedMenu
          activePath={extraActiveMenu}
          menus={mixHeaderMenus}
          onDefaultSelect={handleDefaultSelect}
          onEnter={handleMenuMouseEnter}
          onSelect={handleMixedMenuSelect}
          rounded={isMenuRounded}
          theme={sidebarTheme}
        />
      }
      onSidebarCollapseChange={(value: boolean) => {
        updatePreferences({ sidebar: { collapsed: value } });
      }}
      onSidebarEnableChange={(value: boolean) =>
        updatePreferences({ sidebar: { enable: value } })
      }
      onSidebarExpandOnHoverChange={(value: boolean) =>
        updatePreferences({ sidebar: { expandOnHover: value } })
      }
      onSidebarExtraCollapseChange={(value: boolean) =>
        updatePreferences({ sidebar: { extraCollapse: value } })
      }
      onSideMouseLeave={handleSideMouseLeave}
      onToggleSidebar={handleToggleSidebar}
      sidebarCollapse={preferences.sidebar.collapsed}
      sidebarCollapseShowTitle={preferences.sidebar.collapsedShowTitle}
      sidebarEnable={sidebarVisible}
      sidebarExpandOnHover={preferences.sidebar.expandOnHover}
      sidebarExtraCollapse={preferences.sidebar.extraCollapse}
      sidebarExtraVisible={sidebarExtraVisible}
      sidebarHidden={preferences.sidebar.hidden}
      sidebarTheme={sidebarTheme}
      sidebarWidth={preferences.sidebar.width}
      sideExtra={
        <ExtraMenu
          accordion={preferences.navigation.accordion}
          collapse={preferences.sidebar.extraCollapse}
          menus={extraMenus}
          rounded={isMenuRounded}
          theme={sidebarTheme}
        />
      }
      tabbarEnable={preferences.tabbar.enable}
      tabbarHeight={preferences.tabbar.height}
    ></XpressLayout>
  );
}

export default BasicLayout;
