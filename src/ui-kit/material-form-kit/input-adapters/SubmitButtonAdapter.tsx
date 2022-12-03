import { LoadingButton } from '@mui/lab';
import { IFormSubmitButtonProps } from '../../../form-kit/UseFormHandler';

export const SubmitButtonAdapter = (props: IFormSubmitButtonProps) => {
  return (
    <LoadingButton
      loading={props.loading}
      disabled={props.disabled}
      variant="contained"
      onClick={props.onClick}
      size="large"
    >
      Submit
    </LoadingButton>
  );
};
