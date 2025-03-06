import { Maximize, Minimize } from '@xpress/icons';
import { useFullscreen } from '@xpress-core/hooks';
import { XpressButton } from '@xpress-core/shadcn-ui';

export function Fullscreen({ className }: { className?: string }) {
  const targetRef = document.querySelector('#root');
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(targetRef);

  return (
    <XpressButton
      className={className}
      onClick={toggleFullscreen}
      size="icon"
      variant="icon"
    >
      {isFullscreen ? (
        <Minimize className="text-foreground size-4" />
      ) : (
        <Maximize className="text-foreground size-4" />
      )}
    </XpressButton>
  );
}
