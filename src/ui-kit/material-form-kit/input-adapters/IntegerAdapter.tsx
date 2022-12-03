// TODO: research and explain adapter pattern

import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { NumberType } from '../../../form-kit/FormKit';
import { IFormFieldProps } from '../../../form-kit/UseFormHandler';
import { InputWrapper } from './InputWrapper';

export function IntegerAdapter(props: IFormFieldProps<NumberType>) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (Number.isSafeInteger(props.value)) {
      setValue(props.value?.toString() ?? '');
    }
  }, [props.value]);

  return (
    <InputWrapper {...props}>
      <TextField
        label={props.label}
        helperText={props.description}
        required={props.required}
        error={props.error !== undefined}
        fullWidth
        placeholder={props.placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);

          const parsed = parseInt(e.target.value);
          if (Number.isSafeInteger(parsed)) {
            props.onChangeValue(parsed);
            return;
          }
          props.onChangeValue(NaN);
        }}
      />
    </InputWrapper>
  );
}
