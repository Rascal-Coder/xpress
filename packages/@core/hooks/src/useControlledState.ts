import { useCallback, useEffect, useState } from 'react';

interface Props<T> {
  defaultValue?: T;
  modelValue?: T;
  onModelValueChange?: (value: T) => void;
}

export const useControlledState = <T>(props: Props<T>) => {
  const [value, setValue] = useState<T>(
    props.modelValue ?? props.defaultValue ?? (null as T),
  );

  useEffect(() => {
    if (props.modelValue !== undefined) {
      setValue(props.modelValue);
    }
  }, [props.modelValue]);

  const handleChange = useCallback(
    (newValue: T) => {
      setValue(newValue);
      props.onModelValueChange?.(newValue);
    },
    [props],
  );

  return [value, handleChange] as const;
};
