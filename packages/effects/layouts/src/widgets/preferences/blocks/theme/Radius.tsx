import { usePreferencesContext } from '@xpress-core/preferences';
import { ToggleGroup, ToggleGroupItem } from '@xpress-core/shadcn-ui';

const items = [
  { label: '0', value: '0' },
  { label: '0.25', value: '0.25' },
  { label: '0.5', value: '0.5' },
  { label: '0.75', value: '0.75' },
  { label: '1', value: '1' },
];
export const Radius = () => {
  const { updatePreferences, preferences } = usePreferencesContext();
  const handleValueChange = (value: string) => {
    updatePreferences({ theme: { radius: value } });
  };
  return (
    <ToggleGroup
      className="gap-2"
      defaultValue={preferences.theme.radius ?? '0.5'}
      onValueChange={handleValueChange}
      size="sm"
      type="single"
      variant="outline"
    >
      {items.map((item) => {
        return (
          <div key={item.value}>
            <ToggleGroupItem
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground h-7 w-16 rounded-sm"
              value={item.value}
            >
              {item.label}
            </ToggleGroupItem>
          </div>
        );
      })}
    </ToggleGroup>
  );
};
