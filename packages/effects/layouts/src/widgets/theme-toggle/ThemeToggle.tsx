import { usePreferencesContext } from '@xpress-core/preferences';

import { ThemeButton } from './ThemeButton';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { isDark, updatePreferences } = usePreferencesContext();

  const handleChange = (isDark: boolean) => {
    updatePreferences({
      theme: { mode: isDark ? 'dark' : 'light' },
    });
  };

  return (
    <div className={className}>
      <ThemeButton handleChange={handleChange} isDark={isDark} type="icon" />
    </div>
  );
}
