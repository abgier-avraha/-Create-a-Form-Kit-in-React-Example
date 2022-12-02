// TODO: research and explain adapter pattern

import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { IFormFieldProps } from '../UseFormHandler';
import { InputWrapper } from './InputWrapper';

export function IntegerAdapter<T extends number | null | undefined>(
  props: IFormFieldProps<T>
) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (Number.isSafeInteger(props.value)) {
      setValue(props.value?.toString() ?? '');
    }
  }, [props.value]);

  return (
    <InputWrapper {...props}>
      <TextField
        error={props.error !== undefined}
        fullWidth
        placeholder={props.placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);

          const parsed = parseInt(e.target.value);
          if (Number.isSafeInteger(parsed)) {
            props.onChangeValue(parsed as T);
            return;
          }
          props.onChangeValue(NaN as T);
        }}
      />
    </InputWrapper>
  );
}
