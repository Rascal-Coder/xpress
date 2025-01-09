import type { MenuRecordRaw } from '@xpress-core/typings';

import { BasicLayout } from '@xpress/layouts';
import {
  PreferencesProvider,
  usePreferencesContext,
} from '@xpress-core/preferences';

import { memo, Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

function Layout({ menus }: { menus: MenuRecordRaw[] }) {
  const LayoutWrapper = memo(({ children }: { children: React.ReactNode }) => {
    const { initPreferences } = usePreferencesContext();
    const env = import.meta.env.PROD ? 'prod' : 'dev';
    const appVersion = import.meta.env.VITE_APP_VERSION;
    const namespace = `${import.meta.env.VITE_APP_NAMESPACE}-${appVersion}-${env}`;
    useEffect(() => {
      initPreferences({ namespace });
    }, [initPreferences, namespace]);
    return <BasicLayout content={children} sidebarMenus={menus} />;
  });
  LayoutWrapper.displayName = 'LayoutWrapper';
  return (
    <PreferencesProvider>
      <LayoutWrapper>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </LayoutWrapper>
    </PreferencesProvider>
  );
}

export default Layout;
