import { useIsMobile } from '@xpress-core/hooks';
import { ChevronsLeft, ChevronsRight } from '@xpress-core/icons';

export default function SidebarCollapseButton({
  setSidebarCollapse,
  sidebarCollapse,
}: {
  setSidebarCollapse: (value: boolean) => void;
  sidebarCollapse: boolean;
}) {
  const { isMobile } = useIsMobile();

  return (
    <div
      className={`flex-center hover:text-foreground text-foreground/60 hover:bg-accent-hover bg-accent absolute bottom-2 left-3 z-10 cursor-pointer rounded-sm p-1 ${
        isMobile ? 'hidden' : ''
      }`}
      onClick={() => setSidebarCollapse(!sidebarCollapse)}
    >
      {sidebarCollapse ? (
        <ChevronsRight className="size-3.5" />
      ) : (
        <ChevronsLeft className="size-3.5" />
      )}
    </div>
  );
}
