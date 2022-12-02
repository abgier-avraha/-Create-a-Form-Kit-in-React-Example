import { LoadingButton } from '@mui/lab';
import { DateAdapter } from './FormInputAdapters/DateAdapater';
import { IntegerAdapter } from './FormInputAdapters/IntegerAdapter';
import { TextAdapter } from './FormInputAdapters/TextAdapter';
import { IFormFieldProps, IFormSubmitButtonProps } from './UseFormHandler';

export const FormKit = {
  Text: <T extends string | undefined | null>(props: IFormFieldProps<T>) => (
    <TextAdapter {...props} />
  ),
  Integer: <T extends number | undefined | null>(props: IFormFieldProps<T>) => (
    <IntegerAdapter {...props} />
  ),
  Date: <T extends Date | undefined | null>(props: IFormFieldProps<T>) => (
    <DateAdapter {...props} />
  ),
  SubmitButton: (props: IFormSubmitButtonProps) => (
    <LoadingButton
      loading={props.loading}
      disabled={props.disabled}
      variant="contained"
      onClick={props.onClick}
      size="large"
    >
      Submit
    </LoadingButton>
  ),
};
