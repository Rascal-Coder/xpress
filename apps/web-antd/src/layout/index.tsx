import { BasicLayout } from '@xpress/layouts';

import { useAccessStore } from '#/stores';

function Layout() {
  const menuItems = useAccessStore((state) => state.accessMenus);
  return <BasicLayout sidebarMenus={menuItems} />;
}
export default Layout;
