import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  type FormContextType,
  getSubmitButtonOptions,
  type RJSFSchema,
  type StrictRJSFSchema,
  type SubmitButtonProps,
} from '@rjsf/utils';

/** The `SubmitButton` renders a button that represent the `Submit` action on a form
 */
export default function SubmitButton<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({ uiSchema }: SubmitButtonProps<T, S, F>) {
  const {
    submitText,
    norender,
    props: submitButtonProps = {},
  } = getSubmitButtonOptions<T, S, F>(uiSchema);
  if (norender) {
    return null;
  }
  return (
    <Box marginTop={3}>
      <Button
        color="primary"
        type="submit"
        variant="contained"
        {...submitButtonProps}
      >
        {submitText}
      </Button>
    </Box>
  );
}
