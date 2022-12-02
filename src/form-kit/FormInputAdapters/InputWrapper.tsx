import { Box, Stack, Typography } from '@mui/material';
import { IFormFieldProps } from '../UseFormHandler';

export function InputWrapper(
  props: IFormFieldProps<any> & { children: React.ReactNode }
) {
  return (
    <Stack gap={1} flex={1}>
      <Box>
        <Typography>
          {props.label}{' '}
          <Box sx={{ color: 'error.main' }} component="span">
            {props.required && '*'}
          </Box>
        </Typography>
        {props.children}
      </Box>
      <Typography variant="body2" color="text.secondary">
        {props.description}
      </Typography>
      <Typography variant="body2" color="error">
        {props.error}
      </Typography>
    </Stack>
  );
}
