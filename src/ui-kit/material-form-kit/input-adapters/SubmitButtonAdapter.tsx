import { LoadingButton } from '@mui/lab';
import { IFormSubmitButtonProps } from '../../../form-kit/useForm';

export const SubmitButtonAdapter = (props: IFormSubmitButtonProps) => {
  return (
    <LoadingButton
      loading={props.loading}
      disabled={!props.isFormValid}
      variant="contained"
      onClick={props.onClick}
      size="large"
    >
      Submit
    </LoadingButton>
  );
};
