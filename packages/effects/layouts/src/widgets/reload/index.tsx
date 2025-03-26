import { RotateCw } from '@xpress/icons';
import { useTabbar } from '@xpress/stores';
import { XpressButton } from '@xpress-core/shadcn-ui';

export function Reload() {
  const { refresh } = useTabbar();
  return (
    <XpressButton
      onClick={() => {
        refresh();
      }}
      size="icon"
      style={{ padding: '7px' }}
      variant="icon"
    >
      <RotateCw className="size-4" />
    </XpressButton>
  );
}
