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
  setState: (
    v:
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

export function useForm<T extends ObjectShape>(
  schema: OptionalObjectSchema<T>,
  initial: Partial<InferType<OptionalObjectSchema<T>>>,
  onSubmit: (v: InferType<OptionalObjectSchema<T>>) => Promise<void>,
  onSubmissionError?: (error: Error) => void
): IFormHook<T> {
  // Loading state for form submission Promise
  const [loading, setLoading] = useState(false);

  // Merge default form value and initial form value
  const defaultForm = useMemo(() => {
    return lodash.merge(schema.getDefault(), initial);
  }, [schema, initial]);

  // Set default form value
  const [form, setForm] =
    useState<Partial<InferType<OptionalObjectSchema<T>>>>(defaultForm);

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
  const submitButtonProps: IFormSubmitButtonProps = {
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
    submitButtonProps: submitButtonProps,
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
function getFieldSchemas<T extends ObjectShape>(
  schema: OptionalObjectSchema<T>
) {
  const fieldInfo: IFieldInfo[] = [];

  Object.keys(schema.fields).forEach((k) => {
    fieldInfo.push({
      key: k,
      schema: schema.fields[k] as BaseSchema<unknown>,
    });
  });

  return fieldInfo;
}

function getFields<T extends ObjectShape>(
  schema: OptionalObjectSchema<T>,
  form: Partial<InferType<OptionalObjectSchema<T>>>,
  errors: ValidationError[],
  setForm: (v: Partial<InferType<OptionalObjectSchema<T>>>) => void
) {
  const fields = {} as {
    [Property in keyof InferType<OptionalObjectSchema<T>>]: IFormFieldProps<
      InferType<OptionalObjectSchema<T>>[Property]
    >;
  };

  const fieldSchemas = getFieldSchemas(schema);

  fieldSchemas.forEach((f) => {
    const key = f.key as keyof InferType<OptionalObjectSchema<T>>;

    const validationError = errors?.find((err) => err.path === f.key);

    const { description = '', placeholder = '' } = f.schema.spec?.meta ?? {};

    fields[key] = {
      label: f.schema.spec?.label,
      description: description,
      placeholder: placeholder,
      value: form[key] as any,
      error: validationError,
      required: f.schema.spec.presence === 'required',
      onChangeValue: (value) => setForm({ ...form, [key]: value }),
    };
  });

  return fields;
}
