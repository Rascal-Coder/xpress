import { Bell } from '@xpress/icons';
import { XpressButton } from '@xpress-core/shadcn-ui';

export function Notification() {
  return (
    <div className="flex-center mr-2 h-full">
      <XpressButton
        className="xpress-bell-button text-foreground relative"
        size="icon"
        variant="icon"
      >
        <span className="bg-primary absolute right-0.5 top-0.5 h-2 w-2 rounded"></span>
        <Bell className="size-4" />
      </XpressButton>
    </div>
  );
}
