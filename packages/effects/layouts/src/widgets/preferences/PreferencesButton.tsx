import { Settings } from '@xpress/icons';
import { XpressButton } from '@xpress-core/shadcn-ui';

import { useState } from 'react';

// import { usePopup } from '@xpress-core/popup-ui';
import { Drawer } from './Drawer';

export function PreferencesButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <XpressButton onClick={() => setIsOpen(true)} size="icon" variant="icon">
        <Settings className="text-foreground size-4" />
      </XpressButton>
      <Drawer isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
