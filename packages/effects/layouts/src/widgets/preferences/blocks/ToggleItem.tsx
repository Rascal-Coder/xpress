import { ToggleGroup, ToggleGroupItem } from '@xpress-core/shadcn-ui';
import { cn } from '@xpress-core/shared/utils';

interface ToggleItemProps {
  children: React.ReactNode;
  disabled?: boolean;
  items: { label: string; value: string }[];
  onChange: (value: string) => void;
  value: string;
}
export const ToggleItem = ({
  children,
  disabled = false,
  items,
  onChange,
  value,
}: ToggleItemProps) => {
  return (
    <div
      className={cn(
        'hover:bg-accent flex w-full items-center justify-between rounded-md px-2 py-2',
        disabled && 'pointer-events-none opacity-50',
      )}
    >
      <span className="text-sm">{children}</span>
      <ToggleGroup
        className="gap-2"
        defaultValue={items?.[0]?.value}
        onValueChange={(newValue) => {
          onChange(newValue || value);
        }}
        size="sm"
        type="single"
        value={value}
        variant="outline"
      >
        {items.map((item) => (
          <ToggleGroupItem
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            key={item.value}
            value={item.value}
          >
            {item.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};
