import { Fullscreen, Minimize2 } from '@xpress-core/icons';

export function ToolScreen({
  screen,
  toggleScreen,
}: {
  screen: boolean;
  toggleScreen: (value: boolean) => void;
}) {
  return (
    <div
      className="flex-center hover:bg-muted hover:text-foreground text-muted-foreground border-border h-full cursor-pointer border-l px-2 text-lg font-semibold"
      onClick={() => toggleScreen(!screen)}
    >
      {screen ? (
        <Minimize2 className="size-4" />
      ) : (
        <Fullscreen className="size-4" />
      )}
    </div>
  );
}
