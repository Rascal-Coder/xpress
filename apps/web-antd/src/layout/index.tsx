import { BasicLayout } from '@xpress/layouts';
import { PreferencesProvider } from '@xpress-core/preferences';

// import { useMemo } from 'react';

import { overridesPreferences } from '#/preferences';
import router, { useRouter } from '#/router';

import { generateMenuItems } from './utils';

function Layout() {
  const env = import.meta.env.PROD ? 'prod' : 'dev';
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const namespace = `${import.meta.env.VITE_APP_NAMESPACE}-${appVersion}-${env}`;
  const { routes } = useRouter(router);
  const { menuItems } = generateMenuItems(routes);
  return (
    <PreferencesProvider
      options={{ namespace, overrides: overridesPreferences }}
    >
      <BasicLayout sidebarMenus={menuItems} />
    </PreferencesProvider>
  );
}
export default Layout;
