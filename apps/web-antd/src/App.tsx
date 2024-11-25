import type { XpressLayoutProps } from '@xpress-core/layout-ui';

import { unmountGlobalLoading } from '@xpress/utils';
import { XpressLayout } from '@xpress-core/layout-ui';

import { useEffect, useState } from 'react';

function App() {
  const [layoutConfig, setLayoutConfig] = useState<Partial<XpressLayoutProps>>({
    // 基础布局
    contentPadding: 24,
    footerEnable: true,
    footerFixed: true,
    footerHeight: 48,
    headerHeight: 50,
    headerMode: 'fixed',
    headerVisible: true,
    isMobile: false,
    layout: 'sidebar-nav',
    // 侧边栏
    sidebarCollapseShowTitle: false,
    sidebarHidden: false,
    sideCollapseWidth: 64,
    sidebarTheme: 'dark',
    sidebarWidth: 200,
    // 标签页
    tabbarEnable: true,
    tabbarHeight: 40,
    // 其他
    zIndex: 1000,
  });

  useEffect(() => {
    unmountGlobalLoading();
  }, []);

  const handleSideMouseLeave = () => {};

  const handleToggleSidebar = () => {};

  return (
    <>
      <div className="h-10 bg-red-500">hello xpress</div>
      <div>hello xpress</div>
      <div className="fixed right-0 top-0 z-[2000] p-4">
        <button
          onClick={() =>
            setLayoutConfig((prev) => ({ ...prev, isMobile: !prev.isMobile }))
          }
        >
          切换移动端
        </button>
        <button
          onClick={() =>
            setLayoutConfig((prev) => ({
              ...prev,
              layout:
                prev.layout === 'header-nav' ? 'sidebar-nav' : 'header-nav',
            }))
          }
        >
          切换布局模式
        </button>
        <button
          onClick={() =>
            setLayoutConfig((prev) => ({
              ...prev,
              sidebarTheme: prev.sidebarTheme === 'dark' ? 'light' : 'dark',
            }))
          }
        >
          切换主题
        </button>
      </div>
      <XpressLayout
        {...layoutConfig}
        onSideMouseLeave={handleSideMouseLeave}
        onToggleSidebar={handleToggleSidebar}
      />
    </>
  );
}

export default App;
