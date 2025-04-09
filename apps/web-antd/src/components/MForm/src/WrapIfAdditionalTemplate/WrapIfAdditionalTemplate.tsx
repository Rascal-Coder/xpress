import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import {
  ADDITIONAL_PROPERTY_FLAG,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
  TranslatableString,
  type WrapIfAdditionalTemplateProps,
} from '@rjsf/utils';
import { type CSSProperties, type FocusEvent } from 'react';

/** The `WrapIfAdditional` component is used by the `FieldTemplate` to rename, or remove properties that are
 * part of an `additionalProperties` part of a schema.
 *
 * @param props - The `WrapIfAdditionalProps` for this component
 */
export default function WrapIfAdditionalTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: WrapIfAdditionalTemplateProps<T, S, F>) {
  const {
    children,
    classNames,
    style,
    disabled,
    id,
    label,
    onDropPropertyClick,
    onKeyChange,
    readonly,
    required,
    schema,
    uiSchema,
    registry,
  } = props;
  const { templates, translateString } = registry;
  // Button templates are not overridden in the uiSchema
  const { RemoveButton } = templates.ButtonTemplates;
  const keyLabel = translateString(TranslatableString.KeyLabel, [label]);
  const additional = ADDITIONAL_PROPERTY_FLAG in schema;
  const btnStyle: CSSProperties = {
    flex: 1,
    paddingLeft: 6,
    paddingRight: 6,
    fontWeight: 'bold',
  };

  if (!additional) {
    return (
      <div className={classNames} style={style}>
        {children}
      </div>
    );
  }

  const handleBlur = ({ target }: FocusEvent<HTMLInputElement>) =>
    onKeyChange(target && target.value);

  return (
    <Grid
      alignItems="center"
      className={classNames}
      container
      key={`${id}-key`}
      spacing={2}
      style={style}
    >
      <Grid sx={{ flex: 1 }}>
        <TextField
          defaultValue={label}
          disabled={disabled || readonly}
          fullWidth={true}
          id={`${id}-key`}
          label={keyLabel}
          name={`${id}-key`}
          onBlur={readonly ? undefined : handleBlur}
          required={required}
          type="text"
        />
      </Grid>
      <Grid sx={{ flex: 1 }}>{children}</Grid>
      <Grid>
        <RemoveButton
          disabled={disabled || readonly}
          iconType="default"
          onClick={onDropPropertyClick(label)}
          registry={registry}
          style={btnStyle}
          uiSchema={uiSchema}
        />
      </Grid>
    </Grid>
  );
}
