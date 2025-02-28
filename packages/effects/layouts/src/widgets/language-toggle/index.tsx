import { Languages } from '@xpress/icons';
import { XpressButton } from '@xpress-core/shadcn-ui';

export function LanguageToggle({ className }: { className?: string }) {
  return (
    <XpressButton className={className} size="icon" variant="icon">
      <Languages className="text-foreground size-4" />
    </XpressButton>
  );
}
