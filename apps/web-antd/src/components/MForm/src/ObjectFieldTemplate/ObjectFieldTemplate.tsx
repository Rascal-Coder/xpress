import Grid from '@mui/material/Grid';
import {
  canExpand,
  descriptionId,
  type FormContextType,
  getTemplate,
  getUiOptions,
  type ObjectFieldTemplateProps,
  type RJSFSchema,
  type StrictRJSFSchema,
  titleId,
} from '@rjsf/utils';

/** The `ObjectFieldTemplate` is the template to use to render all the inner properties of an object along with the
 * title and description if available. If the object is expandable, then an `AddButton` is also rendered after all
 * the properties.
 *
 * @param props - The `ObjectFieldTemplateProps` for this component
 */
export default function ObjectFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: ObjectFieldTemplateProps<T, S, F>) {
  const {
    description,
    title,
    properties,
    required,
    disabled,
    readonly,
    uiSchema,
    idSchema,
    schema,
    formData,
    onAddClick,
    registry,
  } = props;
  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const TitleFieldTemplate = getTemplate<'TitleFieldTemplate', T, S, F>(
    'TitleFieldTemplate',
    registry,
    uiOptions,
  );
  const DescriptionFieldTemplate = getTemplate<
    'DescriptionFieldTemplate',
    T,
    S,
    F
  >('DescriptionFieldTemplate', registry, uiOptions);
  // Button templates are not overridden in the uiSchema
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;
  return (
    <>
      {title && (
        <TitleFieldTemplate
          id={titleId<T>(idSchema)}
          registry={registry}
          required={required}
          schema={schema}
          title={title}
          uiSchema={uiSchema}
        />
      )}
      {description && (
        <DescriptionFieldTemplate
          description={description}
          id={descriptionId<T>(idSchema)}
          registry={registry}
          schema={schema}
          uiSchema={uiSchema}
        />
      )}
      <Grid container spacing={2} sx={{ marginTop: '10px' }}>
        {properties.map((element, index) =>
          element.hidden ? (
            element.content
          ) : (
            <Grid key={index} sx={{ marginBottom: '10px', width: '100%' }}>
              {element.content}
            </Grid>
          ),
        )}
        {canExpand<T, S, F>(schema, uiSchema, formData) && (
          <Grid container sx={{ justifyContent: 'flex-end' }}>
            <Grid>
              <AddButton
                className="object-property-expand"
                disabled={disabled || readonly}
                onClick={onAddClick(schema)}
                registry={registry}
                uiSchema={uiSchema}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
}
