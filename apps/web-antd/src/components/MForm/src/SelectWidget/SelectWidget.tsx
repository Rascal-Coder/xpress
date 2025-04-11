/* eslint-disable @typescript-eslint/no-unused-vars */
import MenuItem from '@mui/material/MenuItem';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import {
  ariaDescribedByIds,
  enumOptionsIndexForValue,
  enumOptionsValueForIndex,
  type FormContextType,
  labelValue,
  type RJSFSchema,
  type StrictRJSFSchema,
  type WidgetProps,
} from '@rjsf/utils';
import { type ChangeEvent, type FocusEvent } from 'react';

/** The `SelectWidget` is a widget for rendering dropdowns.
 *  It is typically used with string properties constrained with enum options.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function SelectWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  schema,
  id,
  name, // remove this from textFieldProps
  options,
  label,
  hideLabel,
  required,
  disabled,
  placeholder,
  readonly,
  value,
  multiple,
  autofocus,
  onChange,
  onBlur,
  onFocus,
  errorSchema,
  rawErrors = [],
  registry,
  uiSchema,
  hideError,
  formContext,
  ...textFieldProps
}: WidgetProps<T, S, F>) {
  const { enumOptions, enumDisabled, emptyValue: optEmptyVal } = options;

  multiple = multiple === undefined ? false : !!multiple;

  const emptyValue = multiple ? [] : '';
  const isEmpty =
    value === undefined ||
    (multiple && value.length === 0) ||
    (!multiple && value === emptyValue);

  const _onChange = ({ target: { value } }: ChangeEvent<{ value: string }>) =>
    onChange(enumOptionsValueForIndex<S>(value, enumOptions, optEmptyVal));
  const _onBlur = ({ target }: FocusEvent<HTMLInputElement>) =>
    onBlur(
      id,
      enumOptionsValueForIndex<S>(
        target && target.value,
        enumOptions,
        optEmptyVal,
      ),
    );
  const _onFocus = ({ target }: FocusEvent<HTMLInputElement>) =>
    onFocus(
      id,
      enumOptionsValueForIndex<S>(
        target && target.value,
        enumOptions,
        optEmptyVal,
      ),
    );
  const selectedIndexes = enumOptionsIndexForValue<S>(
    value,
    enumOptions,
    multiple,
  );
  const {
    InputLabelProps,
    SelectProps,
    autocomplete,
    ...textFieldRemainingProps
  } = textFieldProps;
  const showPlaceholderOption = !multiple && schema.default === undefined;

  return (
    <TextField
      autoComplete={autocomplete}
      autoFocus={autofocus}
      disabled={disabled || readonly}
      error={rawErrors.length > 0}
      id={id}
      label={labelValue(label || undefined, hideLabel, undefined)}
      name={id}
      onBlur={_onBlur}
      onChange={_onChange}
      onFocus={_onFocus}
      placeholder={placeholder}
      required={required}
      value={
        !isEmpty && selectedIndexes !== undefined ? selectedIndexes : emptyValue
      }
      {...(textFieldRemainingProps as TextFieldProps)}
      aria-describedby={ariaDescribedByIds<T>(id)}
      InputLabelProps={{
        ...InputLabelProps,
        shrink: !isEmpty,
      }}
      select // Apply this and the following props after the potential overrides defined in textFieldProps
      SelectProps={{
        ...SelectProps,
        multiple,
      }}
    >
      {showPlaceholderOption && <MenuItem value="">{placeholder}</MenuItem>}
      {Array.isArray(enumOptions) &&
        enumOptions.map(({ value, label }, i: number) => {
          const disabled: boolean =
            Array.isArray(enumDisabled) && enumDisabled.includes(value);
          return (
            <MenuItem disabled={disabled} key={i} value={String(i)}>
              {label}
            </MenuItem>
          );
        })}
    </TextField>
  );
}
