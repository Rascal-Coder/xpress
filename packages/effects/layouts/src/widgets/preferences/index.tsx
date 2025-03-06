import { Settings } from '@xpress/icons';
import { XpressButton } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import { useState } from 'react';

import { PreferencesDrawer } from './PreferencesDrawer';

export function Preferences({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className={cn('flex items-center gap-2', className)}>
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
