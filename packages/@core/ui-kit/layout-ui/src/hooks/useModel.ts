import type { SetStateAction } from 'react';

import { useCallback, useMemo, useState } from 'react';

export interface UseModelOptions<T> {
  defaultValue: T;
  onChange?: (value: T) => void;
  value?: T;
}

export function useModel<T>({
  defaultValue,
  onChange,
  value,
}: UseModelOptions<T>) {
  const [innerValue, setInnerValue] = useState<T>(
    value === undefined ? defaultValue : value,
  );

  const currentValue = useMemo(
    () => (value === undefined ? innerValue : value),
    [value, innerValue],
  );

  const handleChange = useCallback(
    (val: SetStateAction<T>) => {
      const newValue =
        typeof val === 'function'
          ? (val as (prevState: T) => T)(currentValue)
          : val;

      if (value === undefined) {
        setInnerValue(newValue);
      }
      onChange?.(newValue);
    },
    [value, currentValue, onChange],
  );

  return [currentValue, handleChange] as const;
}
