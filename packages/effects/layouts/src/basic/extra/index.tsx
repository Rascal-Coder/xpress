import { Settings } from '@xpress/icons';
import { usePreferencesContext } from '@xpress-core/preferences';
import { XpressButton } from '@xpress-core/shadcn-ui';

import { useState } from 'react';

import { CheckUpdates } from '../../widgets/check-updates';
import { PreferencesDrawer } from '../../widgets/preferences/PreferencesDrawer';

export const Extra = () => {
  const { preferencesButtonPosition, preferences } = usePreferencesContext();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {preferencesButtonPosition.fixed && (
        <div className="z-100 fixed bottom-20 right-0">
          <XpressButton
            className="bg-primary flex-col-center size-10 cursor-pointer rounded-l-lg rounded-r-none border-none"
            onClick={() => setIsOpen(true)}
            title="设置"
          >
            <Settings className="size-5" />
          </XpressButton>
          <PreferencesDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      )}
      {preferences.app.enableCheckUpdates && (
        <CheckUpdates
        // checkUpdatesInterval={preferences.app.checkUpdatesInterval}
        // checkUpdateUrl={preferences.app.checkUpdateUrl}
        />
      )}
    </>
  );
};
