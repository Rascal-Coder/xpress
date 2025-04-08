import { usePreferencesContext } from '@xpress-core/preferences';
import { cn } from '@xpress-core/shared/utils';

import { useMemo } from 'react';

import { ThemeToggle } from '../widgets';

export const Toolbar = ({ toolbarList }: { toolbarList: string[] }) => {
  const { preferences } = usePreferencesContext();
  const showTheme = useMemo(() => {
    return toolbarList.includes('theme') && preferences.widget.themeToggle;
  }, [toolbarList, preferences.widget.themeToggle]);
  return (
    <div
      className={cn(
        'flex-center absolute right-2 top-4 z-10',
        toolbarList.length > 1 && 'bg-accent rounded-3xl px-3 py-1',
      )}
    >
      {showTheme && <ThemeToggle />}
    </div>
  );
};
