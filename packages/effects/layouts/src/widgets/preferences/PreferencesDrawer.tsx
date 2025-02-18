import type { DrawerApi } from '@xpress-core/popup-ui';

import { Button } from '@xpress-core/shadcn-ui';

interface PreferencesDrawerProps {
  drawerApi: DrawerApi;
  onTitleChange: (title: string) => void;
}

export function PreferencesDrawer({
  drawerApi,
  onTitleChange,
}: PreferencesDrawerProps) {
  // 更新抽屉标题
  const handleUpdateTitle = () => {
    const newTitle = '偏好设置 - 已更新';
    onTitleChange(newTitle);
    drawerApi.update({ title: newTitle });
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-semibold">偏好设置</h2>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span>深色模式</span>
          <Button size="sm" variant="outline">
            切换
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <span>自动更新</span>
          <Button size="sm" variant="outline">
            开启
          </Button>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button onClick={() => drawerApi.close()} variant="outline">
          取消
        </Button>
        <Button onClick={handleUpdateTitle}>更新标题</Button>
      </div>
    </div>
  );
}
