import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  ariaDescribedByIds,
  descriptionId,
  type FormContextType,
  getTemplate,
  labelValue,
  type RJSFSchema,
  schemaRequiresTrueValue,
  type StrictRJSFSchema,
  type WidgetProps,
} from '@rjsf/utils';
import { type FocusEvent } from 'react';

/** The `CheckBoxWidget` is a widget for rendering boolean properties.
 *  It is typically used to represent a boolean.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function CheckboxWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: WidgetProps<T, S, F>) {
  const {
    schema,
    id,
    value,
    disabled,
    readonly,
    label = '',
    hideLabel,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    registry,
    options,
    uiSchema,
  } = props;
  const DescriptionFieldTemplate = getTemplate<
    'DescriptionFieldTemplate',
    T,
    S,
    F
  >('DescriptionFieldTemplate', registry, options);
  // Because an unchecked checkbox will cause html5 validation to fail, only add
  // the "required" attribute if the field value must be "true", due to the
  // "const" or "enum" keywords
  const required = schemaRequiresTrueValue<S>(schema);

  const _onChange = (_: any, checked: boolean) => onChange(checked);
  const _onBlur = ({ target }: FocusEvent<HTMLButtonElement>) =>
    onBlur(id, target && target.value);
  const _onFocus = ({ target }: FocusEvent<HTMLButtonElement>) =>
    onFocus(id, target && target.value);
  const description = options.description ?? schema.description;

  return (
    <>
      {!hideLabel && !!description && (
        <DescriptionFieldTemplate
          description={description}
          id={descriptionId<T>(id)}
          registry={registry}
          schema={schema}
          uiSchema={uiSchema}
        />
      )}
      <FormControlLabel
        control={
          <Checkbox
            aria-describedby={ariaDescribedByIds<T>(id)}
            autoFocus={autofocus}
            checked={value === undefined ? false : Boolean(value)}
            disabled={disabled || readonly}
            id={id}
            name={id}
            onBlur={_onBlur}
            onChange={_onChange}
            onFocus={_onFocus}
            required={required}
          />
        }
        label={labelValue(label, hideLabel, false)}
      />
    </>
  );
}
