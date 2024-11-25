import { Pin, PinOff } from '@xpress-core/icons';

export default function SidebarFixedButton({
  expandOnHover,
  onExpandOnHoverChange,
}: {
  expandOnHover: boolean;
  onExpandOnHoverChange: (fixed: boolean) => void;
}) {
  return (
    <div
      className="flex-center hover:text-foreground text-foreground/60 hover:bg-accent-hover bg-accent absolute bottom-2 right-3 z-10 cursor-pointer rounded-sm p-[5px] transition-all duration-300"
      onClick={() => onExpandOnHoverChange(!expandOnHover)}
    >
      {expandOnHover ? <Pin /> : <PinOff />}
    </div>
  );
}
