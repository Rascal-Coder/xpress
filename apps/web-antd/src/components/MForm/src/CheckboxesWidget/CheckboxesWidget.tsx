import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import {
  ariaDescribedByIds,
  enumOptionsDeselectValue,
  enumOptionsIsSelected,
  enumOptionsSelectValue,
  enumOptionsValueForIndex,
  type FormContextType,
  labelValue,
  optionId,
  type RJSFSchema,
  type StrictRJSFSchema,
  type WidgetProps,
} from '@rjsf/utils';
import { type ChangeEvent, type FocusEvent } from 'react';

/** The `CheckboxesWidget` is a widget for rendering checkbox groups.
 *  It is typically used to represent an array of enums.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function CheckboxesWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  label,
  hideLabel,
  id,
  disabled,
  options,
  value,
  autofocus,
  readonly,
  required,
  onChange,
  onBlur,
  onFocus,
}: WidgetProps<T, S, F>) {
  const { enumOptions, enumDisabled, inline, emptyValue } = options;
  const checkboxesValues = Array.isArray(value) ? value : [value];

  const _onChange =
    (index: number) =>
    ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
      if (checked) {
        onChange(enumOptionsSelectValue(index, checkboxesValues, enumOptions));
      } else {
        onChange(
          enumOptionsDeselectValue(index, checkboxesValues, enumOptions),
        );
      }
    };

  const _onBlur = ({ target }: FocusEvent<HTMLButtonElement>) =>
    onBlur(
      id,
      enumOptionsValueForIndex<S>(
        target && target.value,
        enumOptions,
        emptyValue,
      ),
    );
  const _onFocus = ({ target }: FocusEvent<HTMLButtonElement>) =>
    onFocus(
      id,
      enumOptionsValueForIndex<S>(
        target && target.value,
        enumOptions,
        emptyValue,
      ),
    );

  return (
    <>
      {labelValue(
        <FormLabel htmlFor={id} required={required}>
          {label || undefined}
        </FormLabel>,
        hideLabel,
      )}
      <FormGroup id={id} row={!!inline}>
        {Array.isArray(enumOptions) &&
          enumOptions.map((option, index: number) => {
            const checked = enumOptionsIsSelected<S>(
              option.value,
              checkboxesValues,
            );
            const itemDisabled =
              Array.isArray(enumDisabled) &&
              enumDisabled.includes(option.value);
            const checkbox = (
              <Checkbox
                aria-describedby={ariaDescribedByIds<T>(id)}
                autoFocus={autofocus && index === 0}
                checked={checked}
                disabled={disabled || itemDisabled || readonly}
                id={optionId(id, index)}
                name={id}
                onBlur={_onBlur}
                onChange={_onChange(index)}
                onFocus={_onFocus}
              />
            );
            return (
              <FormControlLabel
                control={checkbox}
                key={index}
                label={option.label}
              />
            );
          })}
      </FormGroup>
    </>
  );
}
