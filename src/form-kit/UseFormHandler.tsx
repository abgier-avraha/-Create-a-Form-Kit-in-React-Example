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
  value: T;
  onChangeValue: (old: T) => T;
}

export interface IFormSubmitButtonProps {
  onClick: () => Promise<void>;
  loading: boolean;
  disabled: boolean;
}

interface IFormHandler<Structure, ErrorStructure> {
  state: Structure;
  setState: (n: Structure | ((curState: Structure) => Structure)) => void;
  errors: ErrorStructure | undefined;
  isValid: boolean;
  fields: {
    [Property in keyof Structure]: IFormFieldProps<Structure[Property]>;
  };
  submitButtonProps: IFormSubmitButtonProps;
}

export function useFormHandler<T extends ObjectShape>(
  schema: OptionalObjectSchema<T>,
  initial: Partial<InferType<OptionalObjectSchema<T>>>,
  onSubmit: (v: InferType<OptionalObjectSchema<T>>) => Promise<void>
): IFormHandler<InferType<OptionalObjectSchema<T>>, ValidationError[]> {
  const [loading, setLoading] = useState(false);

  // Merge default form value and initial form value
  const defaultForm = useMemo(() => {
    return lodash.merge(schema.getDefault(), initial);
  }, [schema, initial]);

  // Set default form value
  const [form, setForm] =
    useState<InferType<OptionalObjectSchema<T>>>(defaultForm);

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
      const error = errors
        ?.find((err) => err.path === k)
        ?.errors.find(() => true);
      const schemaField: BaseSchema<unknown> = schema.fields[
        key
      ] as unknown as BaseSchema<unknown>;

      const { description = '', placeholder = '' } =
        schemaField.spec?.meta ?? {};

      fields[key] = {
        label: schemaField.spec?.label,
        error: error,
        value: form[key],
        onChangeValue: (value) => setForm({ ...form, [key]: value }),
        description: description,
        placeholder: placeholder,
        required: schemaField.spec.presence === 'required',
      };
    });
    return fields;
  }, [errors, form]);

  // Create props for submission button widget
  const submitButtonProps: IFormSubmitButtonProps = {
    onClick: async () => {
      if (!isValid) {
        return;
      }
      setLoading(true);
      await onSubmit(form);
      setLoading(false);
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
