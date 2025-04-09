import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {
  type ArrayFieldTemplateItemType,
  type ArrayFieldTemplateProps,
  type FormContextType,
  getTemplate,
  getUiOptions,
  type RJSFSchema,
  type StrictRJSFSchema,
} from '@rjsf/utils';

/** The `ArrayFieldTemplate` component is the template used to render all items in an array.
 *
 * @param props - The `ArrayFieldTemplateItemType` props for the component
 */
export default function ArrayFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: ArrayFieldTemplateProps<T, S, F>) {
  const {
    canAdd,
    disabled,
    idSchema,
    uiSchema,
    items,
    onAddClick,
    readonly,
    registry,
    required,
    schema,
    title,
  } = props;
  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const ArrayFieldDescriptionTemplate = getTemplate<
    'ArrayFieldDescriptionTemplate',
    T,
    S,
    F
  >('ArrayFieldDescriptionTemplate', registry, uiOptions);
  const ArrayFieldItemTemplate = getTemplate<'ArrayFieldItemTemplate', T, S, F>(
    'ArrayFieldItemTemplate',
    registry,
    uiOptions,
  );
  const ArrayFieldTitleTemplate = getTemplate<
    'ArrayFieldTitleTemplate',
    T,
    S,
    F
  >('ArrayFieldTitleTemplate', registry, uiOptions);
  // Button templates are not overridden in the uiSchema
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;
  return (
    <Paper elevation={2}>
      <Box p={2}>
        <ArrayFieldTitleTemplate
          idSchema={idSchema}
          registry={registry}
          required={required}
          schema={schema}
          title={uiOptions.title || title}
          uiSchema={uiSchema}
        />
        <ArrayFieldDescriptionTemplate
          description={uiOptions.description || schema.description}
          idSchema={idSchema}
          registry={registry}
          schema={schema}
          uiSchema={uiSchema}
        />
        {items &&
          items.map(
            ({ key, ...itemProps }: ArrayFieldTemplateItemType<T, S, F>) => (
              <ArrayFieldItemTemplate key={key} {...itemProps} />
            ),
          )}
        {canAdd && (
          <Grid container justifyContent="flex-end">
            <Grid>
              <Box mt={2}>
                <AddButton
                  className="array-item-add"
                  disabled={disabled || readonly}
                  onClick={onAddClick}
                  registry={registry}
                  uiSchema={uiSchema}
                />
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    </Paper>
  );
}
