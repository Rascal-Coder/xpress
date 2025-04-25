import { useIsMobile } from '@xpress-core/hooks';
import { Pin, PinOff } from '@xpress-core/icons';

export default function SidebarFixedButton({
  setSidebarExpandOnHover,
  sidebarExpandOnHover,
}: {
  setSidebarExpandOnHover: (value: boolean) => void;
  sidebarExpandOnHover: boolean;
}) {
  const { isMobile } = useIsMobile();
  return (
    <div
      className={`flex-center hover:text-foreground text-foreground/60 hover:bg-accent-hover bg-accent absolute bottom-2 right-3 z-10 cursor-pointer rounded-sm p-[5px] transition-all duration-300 ${
        isMobile ? 'hidden' : ''
      }`}
      onClick={() => setSidebarExpandOnHover(!sidebarExpandOnHover)}
    >
      {sidebarExpandOnHover ? (
        <Pin className="size-3.5" />
      ) : (
        <PinOff className="size-3.5" />
      )}
    </div>
  );
}
