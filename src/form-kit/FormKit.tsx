import React, { useContext } from 'react';
import { IFormFieldProps, IFormSubmitButtonProps } from './UseFormHandler';

export type StringType = string | null | undefined;
export type NumberType = number | null | undefined;
export type DateType = Date | null | undefined;

export interface IFormKit {
  Text: (props: IFormFieldProps<StringType>) => JSX.Element | null;
  Integer: (props: IFormFieldProps<NumberType>) => JSX.Element | null;
  Date: (props: IFormFieldProps<DateType>) => JSX.Element | null;
  SubmitButton: (props: IFormSubmitButtonProps) => JSX.Element | null;
}

const FormKitContext = React.createContext<IFormKit>({
  Text: () => null,
  Integer: () => null,
  Date: () => null,
  SubmitButton: () => null,
});

export function FormKitProvider(props: {
  kit: IFormKit;
  children: React.ReactNode;
}) {
  return (
    <FormKitContext.Provider value={props.kit}>
      {props.children}
    </FormKitContext.Provider>
  );
}

export function useFormKit() {
  const kit = useContext(FormKitContext);
  return { FormKit: kit };
}
