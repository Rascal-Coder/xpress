import type { MenuRecordRaw } from '@xpress-core/typings';

import { BasicLayout } from '@xpress/layouts';
import { PreferencesProvider } from '@xpress-core/preferences';

import { overridesPreferences } from '#/preferences';

function Layout({ menus }: { menus: MenuRecordRaw[] }) {
  const env = import.meta.env.PROD ? 'prod' : 'dev';
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const namespace = `${import.meta.env.VITE_APP_NAMESPACE}-${appVersion}-${env}`;
  return (
    <PreferencesProvider
      options={{ namespace, overrides: overridesPreferences }}
    >
      <BasicLayout sidebarMenus={menus} />
    </PreferencesProvider>
  );
}

export default Layout;
