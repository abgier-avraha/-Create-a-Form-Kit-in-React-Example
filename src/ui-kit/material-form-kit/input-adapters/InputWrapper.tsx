import { Box, Stack, Tooltip } from '@mui/material';
import { IFormFieldProps } from '../../../form-kit/useForm';

export function InputWrapper(
  props: IFormFieldProps<any> & { children: React.ReactNode }
) {
  return (
    <Stack gap={1} flex={1}>
      <Tooltip
        placement="bottom-start"
        color="error"
        title={props.error?.errors.join(' ')}
      >
        <Box>{props.children}</Box>
      </Tooltip>
    </Stack>
  );
}
