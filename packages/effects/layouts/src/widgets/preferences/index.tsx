import { Settings } from '@xpress/icons';
import { useDrawer } from '@xpress-core/popup-ui';
import { XpressButton } from '@xpress-core/shadcn-ui';

import { useState } from 'react';

import { PreferencesDrawer } from './PreferencesDrawer';

export function Preferences() {
  const [title, setTitle] = useState('偏好设置');
  const [DrawerComponent, drawerApi] = useDrawer({
    connectedComponent: PreferencesDrawer,
    title,
  });

  return (
    <>
      <div className="flex items-center gap-2">
        <XpressButton
          onClick={() => drawerApi.open()}
          size="icon"
          variant="icon"
        >
          <Settings className="text-foreground size-4" />
        </XpressButton>
      </div>
      <DrawerComponent
        connectedProps={{ onTitleChange: setTitle }}
        title={title}
      />
    </>
  );
}
