import { Settings } from '@xpress/icons';
import { XpressButton } from '@xpress-core/shadcn-ui';

export function PreferencesButton() {
  return (
    <XpressButton size="icon" variant="icon">
      <Settings className="text-foreground size-4" />
    </XpressButton>
  );
}
