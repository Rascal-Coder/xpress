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
  UserDropdown,
} from '../../widgets';

interface HeaderProps {
  /**
   * 菜单
   */
  menu?: React.ReactNode;
}
const REFERENCE_VALUE = 50;
const Header = ({ menu }: HeaderProps) => {
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
        return <Fullscreen key={name} />;
      }
      case 'global-search': {
        return <GlobalSearch key={name} />;
      }
      case 'language-toggle': {
        return <LanguageToggle key={name} />;
      }
      case 'notification': {
        return <Notification key={name} />;
      }
      case 'preferences': {
        return <Preferences key={name} />;
      }
      case 'theme-toggle': {
        return <ThemeToggle className="mr-1" key={name} />;
      }
      case 'user-dropdown': {
        return <UserDropdown key={name} />;
      }
      default: {
        return null;
      }
    }
  });

  return (
    <>
      {preferences.widget.refresh && <Reload />}
      <Breadcrumb />
      <div
        className={cn(
          `menu-align-${preferences.header.menuAlign}`,
          'flex h-full min-w-0 flex-1 items-center',
        )}
      >
        {menu}
      </div>
      <div className="flex h-full min-w-0 flex-shrink-0 items-center">
        {rightComponents}
      </div>
    </>
  );
};

export default Header;
