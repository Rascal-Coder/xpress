import { CircleHelp } from '@xpress/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  XpressTooltip,
} from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

interface SelectItemProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  customTip?: boolean;
  placeholder?: string;
  items: { label: string; value: string }[];
  onChange: (value: string) => void;
  defaultValue: string;
}
export const PreferenceSelectItem = ({
  children,
  className,
  disabled = false,
  customTip,
  placeholder = '',
  items = [],
  onChange,
  defaultValue,
}: SelectItemProps) => {
  return (
    <div
      className={cn(
        'my-1 flex w-full items-center justify-between rounded-md px-2 py-1',
        disabled && 'pointer-events-none opacity-50',
        !customTip && 'hover:bg-accent',
        className,
      )}
    >
      <span className="flex items-center text-sm">
        {children}
        {customTip && (
          <XpressTooltip
            side="bottom"
            trigger={<CircleHelp className="ml-1 size-3 cursor-help" />}
          >
            {customTip}
          </XpressTooltip>
        )}
      </span>
      <Select defaultValue={defaultValue} onValueChange={onChange}>
        <SelectTrigger className="h-8 w-[165px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
