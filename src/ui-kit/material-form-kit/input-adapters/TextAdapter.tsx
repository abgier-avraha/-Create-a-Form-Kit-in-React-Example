// TODO: research and explain adapter pattern

import { TextField } from '@mui/material';
import { StringType } from '../../../form-kit/FormKit';
import { IFormFieldProps } from '../../../form-kit/UseFormHandler';
import { InputWrapper } from './InputWrapper';

export function TextAdapter(props: IFormFieldProps<StringType>) {
  return (
    <InputWrapper {...props}>
      <TextField
        label={props.label}
        helperText={props.description}
        required={props.required}
        error={props.error !== undefined}
        fullWidth
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChangeValue(e.target.value)}
      />
    </InputWrapper>
  );
}
