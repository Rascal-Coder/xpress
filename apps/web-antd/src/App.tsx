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
    sidebarTheme: 'light',
    sidebarWidth: 200,
    // 标签页
    tabbarEnable: true,
    tabbarHeight: 40,
    // sidebarCollapse: false,
    // 其他
    zIndex: 1000,
  });

  useEffect(() => {
    unmountGlobalLoading();
  }, []);

  const handleSideMouseLeave = () => {};

  const handleToggleSidebar = () => {};

  // 生成大量测试菜单项
  const testMenuItems = Array.from({ length: 50 }, (_, index) => (
    <div
      className="mx-2 mb-2 rounded bg-white/10 p-4 hover:bg-white/20"
      key={index}
    >
      菜单项 {index + 1}
    </div>
  ));

  return (
    <>
      <div className="fixed right-0 top-0 z-[2000] flex flex-col gap-2 p-4">
        <button
          className="rounded bg-blue-500 px-3 py-1 text-white"
          onClick={() =>
            setLayoutConfig((prev) => ({ ...prev, isMobile: !prev.isMobile }))
          }
        >
          切换移动端
        </button>
        <button
          className="rounded bg-blue-500 px-3 py-1 text-white"
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
          className="rounded bg-blue-500 px-3 py-1 text-white"
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
        menu={testMenuItems}
        onSideMouseLeave={handleSideMouseLeave}
        onToggleSidebar={handleToggleSidebar}
      />
    </>
  );
}

export default App;
