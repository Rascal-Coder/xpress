import type { Dispatch, SetStateAction } from 'react';

import { useCallback, useState } from 'react';

export interface ModelOptions<T> {
  defaultValue?: T;
  onChange?: (value: T) => void;
}

export function useModel<T>(
  props: {
    defaultValue?: T;
    onChange?: (value: T) => void;
    value?: T;
  },
  options: ModelOptions<T> = {},
): [T, Dispatch<SetStateAction<T>>] {
  const { defaultValue = options.defaultValue, onChange, value } = props;

  const [innerValue, setInnerValue] = useState<T>(
    value === undefined ? (defaultValue as T) : value,
  );

  const handleChange = useCallback(
    (val: SetStateAction<T>) => {
      const newValue =
        typeof val === 'function'
          ? (val as (prevState: T) => T)(
              value === undefined ? innerValue : value,
            )
          : val;

      if (value === undefined) {
        setInnerValue(newValue);
      }
      onChange?.(newValue);
    },
    [value, innerValue, onChange],
  );

  return [value === undefined ? innerValue : value, handleChange];
}
