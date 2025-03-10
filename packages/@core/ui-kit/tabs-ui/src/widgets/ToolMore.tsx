import { ChevronDown } from '@xpress-core/icons';
import {
  type IContextMenuItem,
  XpressContextMenu,
} from '@xpress-core/shadcn-ui';

export function ToolMore({ menus }: { menus: IContextMenuItem[] }) {
  return (
    <XpressContextMenu menus={() => menus} modal={false}>
      <div className="flex-center hover:bg-muted hover:text-foreground text-muted-foreground border-border h-full cursor-pointer border-l px-2 text-lg font-semibold">
        <ChevronDown className="size-4" />
      </div>
    </XpressContextMenu>
  );
}
