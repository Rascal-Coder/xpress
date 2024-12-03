import type { ThemeModeType, XpressLayoutProps } from '@xpress-core/layout-ui';

import { unmountGlobalLoading } from '@xpress/utils';
import { XpressLayout } from '@xpress-core/layout-ui';

import { useEffect, useMemo, useState } from 'react';

function App() {
  const [sidebarHidden, setSidebarHidden] = useState(false);

  const [layoutConfig, setLayoutConfig] = useState<Partial<XpressLayoutProps>>({
    sidebarCollapse: false,
    footerEnable: false,
    tabbarEnable: true,
    sidebarTheme: 'light' as ThemeModeType,
  });

  const memoizedLayoutConfig = useMemo(
    () => ({
      sidebarHidden,
      contentPadding: 24,
      sidebarCollapseShowTitle: true,
      sideCollapseWidth: 64,
      sidebarTheme: 'light',
      sidebarWidth: 200,
      tabbarEnable: true,
      tabbarHeight: 40,
      zIndex: 1000,
    }),
    [sidebarHidden],
  );

  useEffect(() => {
    setLayoutConfig((prev: Partial<XpressLayoutProps>) => ({
      ...prev,
      sidebarHidden,
      contentPaddingTop: 16,
      contentPaddingBottom: 16,
      contentPaddingLeft: 16,
      contentPaddingRight: 16,
      sidebarCollapseShowTitle: true,
      sideCollapseWidth: 48,
      sidebarTheme: 'light' as ThemeModeType,
      sidebarWidth: 200,
      tabbarEnable: true,
      tabbarHeight: 40,
      zIndex: 1000,
    }));
  }, [memoizedLayoutConfig, sidebarHidden]);

  const onToggleSidebar = () => {
    setSidebarHidden(!sidebarHidden);
  };

  // 处理布局变化
  const handleLayoutChange = (key: keyof XpressLayoutProps, value: any) => {
    setLayoutConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 控制面板
  const renderControlPanel = () => (
    <div
      style={{
        position: 'fixed',
        right: 20,
        top: 80,
        zIndex: 1001,
        background: '#fff',
        padding: 20,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label>
            <input
              checked={layoutConfig.sidebarCollapse}
              onChange={(e) =>
                handleLayoutChange('sidebarCollapse', e.target.checked)
              }
              type="checkbox"
            />
            侧边栏折叠
          </label>
        </div>
        <div>
          <label>
            <input
              checked={layoutConfig.footerEnable}
              onChange={(e) =>
                handleLayoutChange('footerEnable', e.target.checked)
              }
              type="checkbox"
            />
            显示页脚
          </label>
        </div>
        <div>
          <label>
            <input
              checked={layoutConfig.tabbarEnable}
              onChange={(e) =>
                handleLayoutChange('tabbarEnable', e.target.checked)
              }
              type="checkbox"
            />
            显示标签页
          </label>
        </div>
        <div>
          <span>主题：</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleLayoutChange('sidebarTheme', 'light')}
              style={{
                padding: '4px 8px',
                background:
                  layoutConfig.sidebarTheme === 'light' ? '#1890ff' : '#f0f0f0',
                color: layoutConfig.sidebarTheme === 'light' ? '#fff' : '#000',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              亮色
            </button>
            <button
              onClick={() => handleLayoutChange('sidebarTheme', 'dark')}
              style={{
                padding: '4px 8px',
                background:
                  layoutConfig.sidebarTheme === 'dark' ? '#1890ff' : '#f0f0f0',
                color: layoutConfig.sidebarTheme === 'dark' ? '#fff' : '#000',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              暗色
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // 菜单配置
  const menuItems = useMemo(
    () => [
      {
        key: 'home',
        label: '首页',
      },
      {
        key: 'user',
        label: '用户管理',
        children: [
          {
            key: 'user-list',
            label: '用户列表',
          },
          {
            key: 'user-permissions',
            label: '权限管理',
          },
        ],
      },
    ],
    [],
  );

  useEffect(() => {
    unmountGlobalLoading();
  }, []);

  return (
    <>
      {renderControlPanel()}
      <XpressLayout
        {...layoutConfig}
        menu={
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {menuItems.map((item) => (
              <li key={item.key} style={{ padding: '8px 16px' }}>
                {item.label}
                {item.children && (
                  <ul style={{ listStyle: 'none', padding: '0 0 0 16px' }}>
                    {item.children.map((child) => (
                      <li key={child.key} style={{ padding: '8px 0' }}>
                        {child.label}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        }
        onSidebarCollapseChange={(collapsed) => {
          setLayoutConfig((prev) => ({
            ...prev,
            sidebarCollapse: collapsed,
          }));
        }}
        onSidebarEnableChange={(enable) => {
          setLayoutConfig((prev) => ({
            ...prev,
            sidebarEnable: enable,
          }));
        }}
        onSidebarExpandOnHoverChange={(expandOnHover) => {
          setLayoutConfig((prev) => ({
            ...prev,
            sidebarExpandOnHover: expandOnHover,
          }));
        }}
        onSidebarExtraCollapseChange={(collapsed) => {
          setLayoutConfig((prev) => ({
            ...prev,
            sidebarExtraCollapse: collapsed,
          }));
        }}
        onSidebarExtraVisibleChange={(visible) => {
          setLayoutConfig((prev) => ({
            ...prev,
            sidebarExtraVisible: visible,
          }));
        }}
        onToggleSidebar={onToggleSidebar}
      >
        {{
          content: <div>页面内容</div>,
        }}
      </XpressLayout>
    </>
  );
}

export default App;
