import { CircleHelp, MdiGithub } from '@xpress/icons';
import { BasicLayout, UserDropdown } from '@xpress/layouts';
import { resetAllStores } from '@xpress/stores';
import { openWindow } from '@xpress-core/shared/utils';

import router from '#/router';

function Layout() {
  const menus = [
    {
      handler: () => {
        openWindow('https://github.com/Rascal-Coder/xpress', {
          target: '_blank',
        });
      },
      icon: MdiGithub,
      text: 'GitHub',
    },
    {
      handler: () => {
        openWindow('https://github.com/Rascal-Coder/xpress/issues', {
          target: '_blank',
        });
      },
      icon: CircleHelp,
      text: '问题 & 帮助',
    },
  ];
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5320/api/auth/logout');
    } catch {
      // 不做任何处理
    }
    resetAllStores();
  };
  return (
    <BasicLayout
      router={router}
      userDropdown={
        <UserDropdown
          menus={menus}
          onLogout={handleLogout}
          tagText="Pro"
          text="Ann"
        />
      }
    />
  );
}
export default Layout;
