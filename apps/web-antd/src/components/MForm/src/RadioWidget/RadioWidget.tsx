import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import {
  ariaDescribedByIds,
  enumOptionsIndexForValue,
  enumOptionsValueForIndex,
  type FormContextType,
  labelValue,
  optionId,
  type RJSFSchema,
  type StrictRJSFSchema,
  type WidgetProps,
} from '@rjsf/utils';
import { type FocusEvent } from 'react';

/** The `RadioWidget` is a widget for rendering a radio group.
 *  It is typically used with a string property constrained with enum options.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function RadioWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  id,
  options,
  value,
  required,
  disabled,
  readonly,
  label,
  hideLabel,
  onChange,
  onBlur,
  onFocus,
}: WidgetProps<T, S, F>) {
  const { enumOptions, enumDisabled, emptyValue } = options;

  const _onChange = (_: any, value: any) =>
    onChange(enumOptionsValueForIndex<S>(value, enumOptions, emptyValue));
  const _onBlur = ({ target }: FocusEvent<HTMLInputElement>) =>
    onBlur(
      id,
      enumOptionsValueForIndex<S>(
        target && target.value,
        enumOptions,
        emptyValue,
      ),
    );
  const _onFocus = ({ target }: FocusEvent<HTMLInputElement>) =>
    onFocus(
      id,
      enumOptionsValueForIndex<S>(
        target && target.value,
        enumOptions,
        emptyValue,
      ),
    );

  const row = options ? options.inline : false;
  const selectedIndex = enumOptionsIndexForValue<S>(value, enumOptions) ?? null;

  return (
    <>
      {labelValue(
        <FormLabel htmlFor={id} required={required}>
          {label || undefined}
        </FormLabel>,
        hideLabel,
      )}
      <RadioGroup
        aria-describedby={ariaDescribedByIds<T>(id)}
        id={id}
        name={id}
        onBlur={_onBlur}
        onChange={_onChange}
        onFocus={_onFocus}
        row={row as boolean}
        value={selectedIndex}
      >
        {Array.isArray(enumOptions) &&
          enumOptions.map((option, index) => {
            const itemDisabled =
              Array.isArray(enumDisabled) &&
              enumDisabled.includes(option.value);
            const radio = (
              <FormControlLabel
                control={
                  <Radio color="primary" id={optionId(id, index)} name={id} />
                }
                disabled={disabled || itemDisabled || readonly}
                key={index}
                label={option.label}
                value={String(index)}
              />
            );

            return radio;
          })}
      </RadioGroup>
    </>
  );
}
