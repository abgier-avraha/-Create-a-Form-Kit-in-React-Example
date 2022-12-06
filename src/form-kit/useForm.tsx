import lodash from 'lodash';
import { useMemo, useState } from 'react';
import { InferType } from 'yup';
import { ObjectShape, OptionalObjectSchema } from 'yup/lib/object';
import BaseSchema from 'yup/lib/schema';
import ValidationError from 'yup/lib/ValidationError';

export interface IFormFieldProps<T> {
  label?: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  error?: ValidationError;
  value: T | null | undefined;
  disabled?: boolean;
  onChangeValue: (v: T | null | undefined) => void;
}

export interface IFormSubmitButtonProps {
  loading: boolean;
  isFormValid: boolean;
  onClick: () => Promise<void>;
}

interface IFormHook<T extends ObjectShape> {
  state: Partial<InferType<OptionalObjectSchema<T>>>;
  setState: (v: Partial<InferType<OptionalObjectSchema<T>>>) => void;
  errors: ValidationError[];
  isValid: boolean;
  fields: {
    [Property in keyof InferType<OptionalObjectSchema<T>>]: IFormFieldProps<
      InferType<OptionalObjectSchema<T>>[Property]
    >;
  };
  submitButton: IFormSubmitButtonProps;
}

export function useForm<T extends ObjectShape>(
  schema: OptionalObjectSchema<T>,
  initial: Partial<InferType<OptionalObjectSchema<T>>>,
  onSubmit: (v: InferType<OptionalObjectSchema<T>>) => Promise<void>,
  onSubmissionError?: (error: Error) => void
): IFormHook<T> {
  // Loading state for form submission Promise
  const [loading, setLoading] = useState(false);

  // Set default form value by merging default object with initial values
  const [form, setForm] = useState<Partial<InferType<OptionalObjectSchema<T>>>>(
    lodash.merge(schema.getDefault(), initial)
  );

  // Capture validation errors
  const errors = useMemo(() => {
    try {
      schema.validateSync(form, { abortEarly: false });
    } catch (errors) {
      const casted = errors as ValidationError;
      return casted.inner;
    }
    return [];
  }, [form]);

  // Evaluate if form is valid
  const isValid = useMemo(() => {
    return !errors.some((err) => err.errors.length > 0);
  }, [errors]);

  const fields = useMemo(
    () => getFields(schema, form, errors, setForm),
    [errors, form]
  );

  // Create props for submission button widget
  const submitButton: IFormSubmitButtonProps = {
    onClick: async () => {
      if (isValidForm(form, isValid)) {
        setLoading(true);
        try {
          await onSubmit(form);
        } catch (error: any) {
          onSubmissionError && onSubmissionError(error);
        } finally {
          setLoading(false);
        }
      }
    },
    loading: loading,
    isFormValid: isValid,
  };

  return {
    state: form,
    setState: setForm,
    errors: errors,
    isValid: isValid,
    fields: fields,
    submitButton: submitButton,
  };
}

function isValidForm<T>(value: Partial<T>, isValid: boolean): value is T {
  return isValid;
}

interface IFieldInfo {
  key: string;
  schema: BaseSchema<unknown>;
}

// Does not support getting fields within objects
function getFields<T extends ObjectShape>(
  schema: OptionalObjectSchema<T>,
  form: Partial<InferType<OptionalObjectSchema<T>>>,
  errors: ValidationError[],
  setForm: (v: Partial<InferType<OptionalObjectSchema<T>>>) => void
) {
  // Use the reduce method to create an object containing the properties for each form field
  const initial = {} as {
    [Property in keyof InferType<OptionalObjectSchema<T>>]: IFormFieldProps<
      InferType<OptionalObjectSchema<T>>[Property]
    >;
  };

  return Object.keys(schema.fields).reduce((acc, key) => {
    // Does not support nesting
    const error = errors?.find((err) => err.path === key);

    const fieldSchema: BaseSchema<unknown> = schema.fields[
      key
    ] as BaseSchema<unknown>;

    const { description = '', placeholder = '' } = fieldSchema.spec?.meta ?? {};

    // Add the field properties to the accumulator object
    const fieldProps: IFormFieldProps<any> = {
      label: fieldSchema.spec?.label,
      error: error,
      value: form[key as keyof InferType<OptionalObjectSchema<T>>],
      onChangeValue: (value) => setForm({ ...form, [key]: value }),
      description: description,
      placeholder: placeholder,
      required: fieldSchema.spec.presence === 'required',
    };

    return {
      ...acc,
      [key as keyof InferType<OptionalObjectSchema<T>>]: fieldProps,
    };
  }, initial);
}
