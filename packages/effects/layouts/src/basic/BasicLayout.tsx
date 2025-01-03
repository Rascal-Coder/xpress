import type { MenuRecordRaw } from '@xpress-core/typings';

import { XpressLayout } from '@xpress-core/layout-ui';
import { usePreferencesContext } from '@xpress-core/preferences';
import { XpressLogo } from '@xpress-core/shadcn-ui';

import { useRouter } from '@tanstack/react-router';
import { useMemo } from 'react';

import Copyright from './copyright';
import LayoutFooter from './footer';
import { Menu, MixedMenu } from './menu';

interface Props {
  /**
   * 侧边菜单
   */
  sidebarMenus: MenuRecordRaw[];
  /**
   * 内容
   */
  content: React.ReactNode;
}
function BasicLayout({ sidebarMenus, content }: Props) {
  const router = useRouter();
  const defaultActive = router.state.location.pathname;
  const {
    preferences,
    updatePreferences,
    isDark,
    isHeaderNav,
    isMixedNav,
    isMobile,
    isSideMixedNav,
    isHeaderMixedNav,
    layout,
    sidebarCollapsed,
    theme,
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
    if (isHeaderNav || isMixedNav) {
      return false;
    }
    return sidebarCollapsed || isSideMixedNav || isHeaderMixedNav;
  }, [
    isHeaderMixedNav,
    isHeaderNav,
    isMixedNav,
    isMobile,
    isSideMixedNav,
    sidebarCollapsed,
  ]);

  const showHeaderNav = useMemo(() => {
    return !isMobile && (isHeaderNav || isMixedNav || isHeaderMixedNav);
  }, [isHeaderMixedNav, isHeaderNav, isMixedNav, isMobile]);

  const handleSideMouseLeave = () => {
    // console.log('handleSideMouseLeave');
  };

  const handleToggleSidebar = () => {
    // console.log('handleToggleSidebar');
  };

  const handleOpen = () => {
    // console.log('handleOpen');
  };

  const handleSelect = () => {
    // console.log('handleSelect');
  };

  return (
    <XpressLayout
      components={{
        // 头部
        header: <div>header</div>,
        // 页脚
        footer: preferences.footer.enable && (
          <LayoutFooter>
            {preferences.copyright.enable && (
              <Copyright {...preferences.copyright} />
            )}
          </LayoutFooter>
        ),
        // 标签栏
        tabbar: <div>tabbar</div>,
        // 内容
        content,
        // 内容覆盖层
        // 'content-overlay': <div>content-overlay</div>,
        // 额外内容
        extra: <div>extra</div>,
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
        preferences.logo.enable ? (
          <XpressLogo
            className={logoClass}
            collapsed={logoCollapsed}
            src={preferences.logo.source}
            text={preferences.app.name}
            theme={showHeaderNav ? headerTheme : theme}
          />
        ) : null
      }
      // 侧边菜单区域
      menu={
        <Menu
          accordion={preferences.navigation.accordion}
          collapse={preferences.sidebar.collapsed}
          collapseShowTitle={preferences.sidebar.collapsedShowTitle}
          defaultActive={defaultActive}
          menus={sidebarMenus}
          mode="vertical"
          onOpen={handleOpen}
          onSelect={handleSelect}
          rounded={isMenuRounded}
          // defaultOpenKeys={sidebarActive}
          theme={theme}
        />
      }
      mixedMenu={<MixedMenu />}
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
      onSidebarExtraVisibleChange={(_value: boolean) => {
        // console.log('onSidebarExtraVisibleChange', value);
      }}
      onSideMouseLeave={handleSideMouseLeave}
      onToggleSidebar={handleToggleSidebar}
      sidebarCollapse={preferences.sidebar.collapsed}
      sidebarCollapseShowTitle={preferences.sidebar.collapsedShowTitle}
      // sidebarEnable={sidebarVisible}
      sidebarExpandOnHover={preferences.sidebar.expandOnHover}
      sidebarExtraCollapse={preferences.sidebar.extraCollapse}
      sidebarHidden={preferences.sidebar.hidden}
      sidebarTheme={sidebarTheme}
      sidebarWidth={preferences.sidebar.width}
      tabbarEnable={preferences.tabbar.enable}
      tabbarHeight={preferences.tabbar.height}
    ></XpressLayout>
  );
}

export default BasicLayout;
