import { BasicLayout } from '@xpress/layouts';

import router, { useRouter } from '#/router';

import { generateMenuItems } from './utils';

function Layout() {
  const { routes } = useRouter(router);
  const { menuItems } = generateMenuItems(routes);
  return <BasicLayout sidebarMenus={menuItems} />;
}
export default Layout;
