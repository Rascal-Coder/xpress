import { XpressLayout } from '@xpress-core/layout-ui';
import {
  PreferencesProvider,
  usePreferences,
  usePreferencesContext,
} from '@xpress-core/preferences';
import { XpressLogo } from '@xpress-core/shadcn-ui';

import { useMemo } from 'react';

function BasicLayout() {
  const {
    isDark,
    isHeaderNav,
    isMixedNav,
    isMobile,
    isSideMixedNav,
    isHeaderMixedNav,
    layout,
    sidebarCollapsed,
    theme,
  } = usePreferences();
  const { preferences, updatePreferences } = usePreferencesContext();
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

  const _isMenuRounded = useMemo(() => {
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

  return (
    <PreferencesProvider>
      <XpressLayout
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
        onSidebarCollapseChange={(value: boolean) =>
          updatePreferences({ sidebar: { collapsed: value } })
        }
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
    </PreferencesProvider>
  );
}

export default BasicLayout;
