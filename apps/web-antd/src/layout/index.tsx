import { CircleHelp, MdiGithub } from '@xpress/icons';
import { BasicLayout, UserDropdown } from '@xpress/layouts';
import { resetAllStores, useAccessStore } from '@xpress/stores';
import { openWindow } from '@xpress/utils';
import { useWatermark } from '@xpress-core/hooks';
import { usePreferencesContext } from '@xpress-core/preferences';

import { useEffect } from 'react';

import { baseUrl } from '#/constants/baseurl';
import router, { generateMenuItems } from '#/router';

function Layout() {
  const { preferences } = usePreferencesContext();
  const { updateWatermark, destroyWatermark } = useWatermark();
  useEffect(() => {
    if (preferences.app.watermark) {
      updateWatermark({
        content: preferences.app.name,
      });
    } else {
      destroyWatermark();
    }
    return () => {
      destroyWatermark();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences.app.watermark]);
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
      await fetch(`${baseUrl}/api/auth/logout`);
    } catch {
      // 不做任何处理
    }
    resetAllStores();
  };
  const initMenuItems = () => {
    if (!useAccessStore.getState().accessToken) {
      return;
    }
    const { menuItems } = generateMenuItems(router.routes);
    useAccessStore.getState().setAccessMenus(menuItems);
  };
  useEffect(() => {
    initMenuItems();
  }, []);
  return (
    <BasicLayout
      router={router}
      userDropdown={
        <UserDropdown
          avatarSrc="/images/avatar.png"
          description="rascal-coder@163.com"
          menus={menus}
          onLogout={handleLogout}
          tagText="Pro"
          text="Rascal-Coder"
        />
      }
    />
  );
}
export default Layout;
