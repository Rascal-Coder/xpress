import { BasicLayout } from '@xpress/layouts';
import { usePreferencesContext } from '@xpress-core/preferences';

// import { useMemo } from 'react';

import { useEffect } from 'react';

import { overridesPreferences } from '#/preferences';
import router, { useRouter } from '#/router';

import { generateMenuItems } from './utils';

function Layout() {
  const { routes } = useRouter(router);
  const { menuItems } = generateMenuItems(routes);
  const { updatePreferences } = usePreferencesContext();
  useEffect(() => {
    updatePreferences(overridesPreferences);
  });
  return <BasicLayout sidebarMenus={menuItems} />;
}
export default Layout;
