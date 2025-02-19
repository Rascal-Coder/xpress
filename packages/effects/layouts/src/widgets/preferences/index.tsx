import { Settings } from '@xpress/icons';
import { XpressButton } from '@xpress-core/shadcn-ui';

import { useState } from 'react';

import { PreferencesDrawer } from './PreferencesDrawer';

export function Preferences() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="flex items-center gap-2">
        <XpressButton
          onClick={() => setIsOpen(true)}
          size="icon"
          variant="icon"
        >
          <Settings className="text-foreground size-4" />
        </XpressButton>
        <PreferencesDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </>
  );
}
