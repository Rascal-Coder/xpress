import { CircleHelp } from '@xpress/icons';
import { Input, XpressTooltip } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

import { type ReactNode } from 'react';

export const InputItem = ({
  tip,
  disabled,
  onChange,
  value,
  children,
}: {
  children?: ReactNode;
  disabled?: boolean;
  onChange: (value: string) => void;
  tip?: ReactNode;
  value: string;
}) => {
  return (
    <div
      className={cn(
        'my-1 flex w-full items-center justify-between rounded-md px-2 py-1',
        !tip && 'hover:bg-accent',
        disabled && 'pointer-events-none opacity-50',
      )}
    >
      <span className="flex items-center text-sm">
        {children}

        <XpressTooltip
          side="bottom"
          trigger={<CircleHelp className="ml-1 size-3 cursor-help" />}
        >
          {tip}
        </XpressTooltip>
      </span>
      <Input
        className="h-8 w-[165px]"
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
    </div>
  );
};
