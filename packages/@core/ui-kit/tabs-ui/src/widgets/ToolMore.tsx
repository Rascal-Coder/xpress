import { ChevronDown } from '@xpress-core/icons';
import { XpressDropdownMenu } from '@xpress-core/shadcn-ui';

export function TabsToolMore({ menus }: { menus: any[] }) {
  return (
    <XpressDropdownMenu menus={menus}>
      <div className="flex-center hover:bg-muted hover:text-foreground text-muted-foreground border-border h-full cursor-pointer border-l px-2 text-lg font-semibold">
        <ChevronDown className="size-4" />
      </div>
    </XpressDropdownMenu>
  );
}
