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
  error?: string;
  value: T | null | undefined;
  onChangeValue: (v: T | null | undefined) => void;
}

export interface IFormSubmitButtonProps {
  onClick: () => Promise<void>;
  loading: boolean;
  disabled: boolean;
}

export function useForm<T extends ObjectShape>(
  schema: OptionalObjectSchema<T>,
  initial: Partial<InferType<OptionalObjectSchema<T>>>,
  onSubmit: (v: InferType<OptionalObjectSchema<T>>) => Promise<void>
): IFormHandler<T> {
  const [loading, setLoading] = useState(false);

  // Merge default form value and initial form value
  const defaultForm = useMemo(() => {
    return lodash.merge(schema.getDefault(), initial);
  }, [schema, initial]);

  // Set default form value
  const [form, setForm] =
    useState<Partial<InferType<OptionalObjectSchema<T>>>>(defaultForm);

  // Capture YUP validation errors
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

  const fields = useMemo(() => {
    // TODO: clean this up
    const fields = {} as {
      [Property in keyof InferType<OptionalObjectSchema<T>>]: IFormFieldProps<
        InferType<OptionalObjectSchema<T>>[Property]
      >;
    };
    Object.keys(schema.fields).forEach((k) => {
      const key = k as keyof InferType<OptionalObjectSchema<T>>;
      // TODO: key is not always the path like in nested fields
      const error = errors
        ?.find((err) => err.path === k)
        ?.errors.find(() => true);
      // TODO: remove casting and figure out why fields like 'spec' are not accessible statically
      const fieldSchema: BaseSchema<unknown> = schema.fields[
        key
      ] as BaseSchema<unknown>;

      const { description = '', placeholder = '' } =
        fieldSchema.spec?.meta ?? {};

      fields[key] = {
        label: fieldSchema.spec?.label,
        error: error,
        value: form[key] as unknown as any,
        onChangeValue: (value) => setForm({ ...form, [key]: value }),
        description: description,
        placeholder: placeholder,
        required: fieldSchema.spec.presence === 'required',
      };
    });
    return fields;
  }, [errors, form]);

  // Create props for submission button widget
  const submitButtonProps: IFormSubmitButtonProps = {
    onClick: async () => {
      if (formTypeGuard(form, isValid)) {
        setLoading(true);
        await onSubmit(form);
        setLoading(false);
      }
    },
    loading: loading,
    disabled: !isValid,
  };

  return {
    state: form,
    setState: setForm,
    errors: errors,
    isValid: isValid,
    fields: fields,
    submitButtonProps: submitButtonProps,
  };
}

function formTypeGuard<T>(value: Partial<T>, isValid: boolean): value is T {
  return isValid;
}

interface IFormHandler<T extends ObjectShape> {
  state: Partial<InferType<OptionalObjectSchema<T>>>;
  setState: (
    n:
      | Partial<InferType<OptionalObjectSchema<T>>>
      | ((
          curState: Partial<InferType<OptionalObjectSchema<T>>>
        ) => Partial<InferType<OptionalObjectSchema<T>>>)
  ) => void;
  errors: ValidationError[];
  isValid: boolean;
  fields: {
    [Property in keyof InferType<OptionalObjectSchema<T>>]: IFormFieldProps<
      InferType<OptionalObjectSchema<T>>[Property]
    >;
  };
  submitButtonProps: IFormSubmitButtonProps;
}
