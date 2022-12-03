// TODO: research and explain adapter pattern

import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { DateType } from '../../../form-kit/FormKit';
import { IFormFieldProps } from '../../../form-kit/UseFormHandler';
import { InputWrapper } from './InputWrapper';

export function DateAdapter(props: IFormFieldProps<DateType>) {
  return (
    <InputWrapper {...props}>
      <DatePicker
        label={props.label}
        value={props.value !== undefined ? props.value : null}
        onChange={(newValue) => {
          props.onChangeValue(newValue);
        }}
        renderInput={(params) => (
          <TextField
            required={props.required}
            helperText={props.description}
            error={props.error !== undefined}
            sx={{ mt: 1 }}
            fullWidth
            {...params}
          />
        )}
      />
    </InputWrapper>
  );
}
