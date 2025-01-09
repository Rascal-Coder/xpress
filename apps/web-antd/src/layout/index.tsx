import type { MenuRecordRaw } from '@xpress-core/typings';

import { BasicLayout } from '@xpress/layouts';
import {
  PreferencesProvider,
  usePreferencesContext,
} from '@xpress-core/preferences';

import { useEffect } from 'react';

function Layout({ menus }: { menus: MenuRecordRaw[] }) {
  const LayoutWrapper = () => {
    const { initPreferences } = usePreferencesContext();
    const env = import.meta.env.PROD ? 'prod' : 'dev';
    const appVersion = import.meta.env.VITE_APP_VERSION;
    const namespace = `${import.meta.env.VITE_APP_NAMESPACE}-${appVersion}-${env}`;
    useEffect(() => {
      initPreferences({ namespace });
    }, [initPreferences, namespace]);
    return <BasicLayout sidebarMenus={menus} />;
  };
  return (
    <PreferencesProvider>
      <LayoutWrapper></LayoutWrapper>
    </PreferencesProvider>
  );
}

export default Layout;
