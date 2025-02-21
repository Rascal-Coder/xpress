import { BasicLayout } from '@xpress/layouts';

import router, { generateMenuItems, useRouter } from '#/router';

function Layout() {
  const { routes } = useRouter(router);

  const { menuItems } = generateMenuItems(routes);

  return <BasicLayout sidebarMenus={menuItems} />;
}
export default Layout;
