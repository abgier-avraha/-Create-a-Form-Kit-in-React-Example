// TODO: research and explain adapter pattern

import { TextField } from '@mui/material';
import { IFormFieldProps } from '../UseFormHandler';
import { InputWrapper } from './InputWrapper';

export function DateAdapter<T extends Date | null | undefined>(
  props: IFormFieldProps<T>
) {
  return (
    <InputWrapper {...props}>
      <TextField
        error={props.error !== undefined}
        fullWidth
        placeholder={props.placeholder}
        value={props.value?.toLocaleString()}
      />
    </InputWrapper>
  );
}
