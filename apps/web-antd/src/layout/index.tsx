import { BasicLayout, UserDropdown } from '@xpress/layouts';

import router from '#/router';

function Layout() {
  // const menus = [
  // {
  //   handler: () => {
  //     openWindow('https://github.com/Rascal-Coder/xpress', {
  //       target: '_blank',
  //     });
  //   },
  //   icon: MdiGithub,
  //   text: 'GitHub',
  // },
  // ];
  return (
    <BasicLayout
      router={router}
      userDropdown={<UserDropdown menus={[]} tagText="Pro" text="Ann" />}
    />
  );
}
export default Layout;
