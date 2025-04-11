/* eslint-disable @typescript-eslint/no-unused-vars */
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import {
  ariaDescribedByIds,
  type BaseInputTemplateProps,
  examplesId,
  type FormContextType,
  getInputProps,
  labelValue,
  type RJSFSchema,
  type StrictRJSFSchema,
} from '@rjsf/utils';
import { type ChangeEvent, type FocusEvent } from 'react';

const TYPES_THAT_SHRINK_LABEL = new Set([
  'date',
  'datetime-local',
  'file',
  'time',
]);

/** The `BaseInputTemplate` is the template to use to render the basic `<input>` component for the `core` theme.
 * It is used as the template for rendering many of the <input> based widgets that differ by `type` and callbacks only.
 * It can be customized/overridden for other themes or individual implementations as needed.
 *
 * @param props - The `WidgetProps` for this template
 */
export default function BaseInputTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: BaseInputTemplateProps<T, S, F>) {
  const {
    id,
    name, // remove this from textFieldProps
    placeholder,
    required,
    readonly,
    disabled,
    type,
    label,
    hideLabel,
    hideError,
    value,
    onChange,
    onChangeOverride,
    onBlur,
    onFocus,
    autofocus,
    options,
    schema,
    uiSchema,
    rawErrors = [],
    errorSchema,
    formContext,
    registry,
    InputLabelProps,
    ...textFieldProps
  } = props;
  const inputProps = getInputProps<T, S, F>(schema, type, options);
  // Now we need to pull out the step, min, max into an inner `inputProps` for material-ui
  const { step, min, max, accept, ...rest } = inputProps;
  const htmlInputProps = {
    step,
    min,
    max,
    accept,
    ...(schema.examples ? { list: examplesId<T>(id) } : undefined),
  };
  const _onChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
    onChange(value === '' ? options.emptyValue : value);
  const _onBlur = ({ target }: FocusEvent<HTMLInputElement>) =>
    onBlur(id, target && target.value);
  const _onFocus = ({ target }: FocusEvent<HTMLInputElement>) =>
    onFocus(id, target && target.value);
  const DisplayInputLabelProps = TYPES_THAT_SHRINK_LABEL.has(type)
    ? {
        ...InputLabelProps,
        shrink: true,
      }
    : InputLabelProps;

  return (
    <>
      <TextField
        autoFocus={autofocus}
        disabled={disabled || readonly}
        id={id}
        label={labelValue(label || undefined, hideLabel, undefined)}
        name={id}
        placeholder={placeholder}
        required={required}
        slotProps={{
          htmlInput: htmlInputProps,
        }}
        {...rest}
        error={rawErrors.length > 0}
        InputLabelProps={DisplayInputLabelProps}
        onBlur={_onBlur}
        onChange={onChangeOverride || _onChange}
        onFocus={_onFocus}
        value={value || value === 0 ? value : ''}
        {...(textFieldProps as TextFieldProps)}
        aria-describedby={ariaDescribedByIds<T>(id, !!schema.examples)}
      />
      {Array.isArray(schema.examples) && (
        <datalist id={examplesId<T>(id)}>
          {[
            ...(schema.examples as string[]),
            ...(schema.default && !schema.examples.includes(schema.default)
              ? [schema.default as string]
              : []),
          ].map((example: any) => {
            return <option key={example} value={example} />;
          })}
        </datalist>
      )}
    </>
  );
}
