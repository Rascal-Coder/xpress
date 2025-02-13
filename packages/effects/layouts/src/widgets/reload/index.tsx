import { RotateCw } from '@xpress/icons';
import { XpressButton } from '@xpress-core/shadcn-ui';

export function Reload() {
  return (
    <XpressButton
      onClick={() => {}}
      size="icon"
      style={{ padding: '7px' }}
      variant="icon"
    >
      <RotateCw className="size-4" />
    </XpressButton>
  );
}
