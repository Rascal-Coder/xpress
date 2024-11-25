import { ChevronsLeft, ChevronsRight } from '@xpress-core/icons';

export default function SidebarCollapseButton({
  collapsed,
  onCollapsedChange,
}: {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}) {
  return (
    <div
      className="flex-center hover:text-foreground text-foreground/60 hover:bg-accent-hover bg-accent absolute bottom-2 left-3 z-10 cursor-pointer rounded-sm p-1"
      onClick={() => onCollapsedChange(!collapsed)}
    >
      {collapsed ? (
        <ChevronsRight className="size-3.5" />
      ) : (
        <ChevronsLeft className="size-3.5" />
      )}
    </div>
  );
}
