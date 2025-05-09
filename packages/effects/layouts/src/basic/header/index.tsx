import { type Router } from '@xpress/router';
import { usePreferencesContext } from '@xpress-core/preferences';
import { cn } from '@xpress-core/shared/utils';

import { useMemo } from 'react';

import {
  Breadcrumb,
  Fullscreen,
  GlobalSearch,
  LanguageToggle,
  Notification,
  Preferences,
  Reload,
  ThemeToggle,
} from '../../widgets';

interface HeaderProps {
  /**
   * 菜单
   */
  menu?: React.ReactNode;
  /**
   * 显示头部导航
   */
  showHeaderNav?: boolean;
  /**
   * 路由
   */
  router: Router;
  /**
   * 用户下拉菜单
   */
  userDropdown: React.ReactNode;
}
const REFERENCE_VALUE = 50;
const Header = ({ menu, showHeaderNav, router, userDropdown }: HeaderProps) => {
  const { preferences, preferencesButtonPosition } = usePreferencesContext();

  const rightSlots = useMemo(() => {
    const list = [{ index: REFERENCE_VALUE + 100, name: 'user-dropdown' }];
    if (preferences.widget.globalSearch) {
      list.push({
        index: REFERENCE_VALUE,
        name: 'global-search',
      });
    }

    if (preferencesButtonPosition.header) {
      list.push({
        index: REFERENCE_VALUE + 10,
        name: 'preferences',
      });
    }
    if (preferences.widget.themeToggle) {
      list.push({
        index: REFERENCE_VALUE + 20,
        name: 'theme-toggle',
      });
    }
    if (preferences.widget.languageToggle) {
      list.push({
        index: REFERENCE_VALUE + 30,
        name: 'language-toggle',
      });
    }
    if (preferences.widget.fullscreen) {
      list.push({
        index: REFERENCE_VALUE + 40,
        name: 'fullscreen',
      });
    }
    if (preferences.widget.notification) {
      list.push({
        index: REFERENCE_VALUE + 50,
        name: 'notification',
      });
    }
    return list.sort((a, b) => a.index - b.index);
  }, [preferences.widget, preferencesButtonPosition]);
  const rightComponents = rightSlots.map(({ name }) => {
    switch (name) {
      case 'fullscreen': {
        return <Fullscreen className="mr-1" key={name} />;
      }
      case 'global-search': {
        return (
          <GlobalSearch className="mr-1 sm:mr-4" key={name} router={router} />
        );
      }
      case 'language-toggle': {
        return <LanguageToggle className="mr-1" key={name} />;
      }
      case 'notification': {
        return <Notification key={name} />;
      }
      case 'preferences': {
        return <Preferences className="mr-1" key={name} />;
      }
      case 'theme-toggle': {
        return <ThemeToggle className="mr-1" key={name} />;
      }
      case 'user-dropdown': {
        return <div key={name}>{userDropdown}</div>;
      }
      default: {
        return null;
      }
    }
  });

  return (
    <>
      {preferences.widget.refresh && <Reload />}
      {!showHeaderNav && preferences.breadcrumb.enable && (
        <Breadcrumb
          hideWhenOnlyOne={preferences.breadcrumb.hideOnlyOne}
          router={router}
          showHome={preferences.breadcrumb.showHome}
          showIcon={preferences.breadcrumb.showIcon}
          type={preferences.breadcrumb.styleType}
        />
      )}
      <div
        className={cn(
          `menu-align-${preferences.header.menuAlign}`,
          'flex h-full w-full min-w-0 flex-1 items-center',
        )}
      >
        {showHeaderNav && <div className="w-full">{menu}</div>}
      </div>
      <div className="flex h-full min-w-0 flex-shrink-0 items-center">
        {rightComponents}
      </div>
    </>
  );
};

export default Header;
