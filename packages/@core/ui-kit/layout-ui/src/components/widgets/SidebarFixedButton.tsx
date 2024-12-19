import { Pin, PinOff } from '@xpress-core/icons';

import { useLayoutContext } from '../../xpress-layout/context';

export default function SidebarFixedButton() {
  const { setSidebarExpandOnHover, sidebarExpandOnHover } = useLayoutContext();

  return (
    <div
      className="flex-center hover:text-foreground text-foreground/60 hover:bg-accent-hover bg-accent absolute bottom-2 right-3 z-10 cursor-pointer rounded-sm p-[5px] transition-all duration-300"
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
