import { handleSubmit } from '../../utils';
import { useFormContext } from './Form.context';
import zod from 'zod';

// TODO: add support for defaultValue at the form level
// It would take an object and based on the field name, it would set the defaultValue for that field

// TODO: add support for enableSubmitOnChange
// It would enable submitting the form when the user changes the value of a field
// Also this should affect the submit button UI

// TODO: use this when costumizing global error messages
// const customErrorMap: zod.ZodErrorMap = (error, ctx) => {
//   switch (error.code) {
//   case zod.ZodIssueCode.invalid_type:
//     if (error.expected === 'string') {
//       return { message: 'This ain\'t a string!' };
//     }
//     break;
//   case zod.ZodIssueCode.custom:
//     // produce a custom message using error.params
//     // error.params won't be set unless you passed
//     // a `params` arguments into a custom validator
//     const params = error.params || {};
//     if (params.myField) {
//       return { message: `Bad input: ${params.myField}` };
//     }
//     break;
//   }

//   // fall back to default message!
//   return { message: ctx.defaultError };
// };

// zod.setErrorMap(customErrorMap);

type ErrorsType<T extends Record<string, any>> = Partial<Record<keyof T, string>> & { errorMessage?: string };

type SubmitHandlerReturnType<T extends Record<string, any>> = void | null | false | undefined | ErrorsType<T>;

export type FormProps<T extends Record<string, any>> = {
  children: React.ReactNode | (({ errors, pending }: { errors: ErrorsType<T>, pending: boolean, resetErrors: () => void }) => React.ReactNode);
  onSubmit: (data: T) => Promise<SubmitHandlerReturnType<T>> | SubmitHandlerReturnType<T>;
  getValidationSchema?: (root: typeof zod) => zod.ZodRawShape;
  encType?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
  className?: string;
}

export default function Form<FormData extends Record<string, any>>({
  children,
  onSubmit,
  getValidationSchema,
  encType,
  className,
}: FormProps<FormData>) {
  const { errors, setErrors, pending, setPending } = useFormContext();

  return (
    <form
      className={className}
      method="post"
      encType={encType}
      onSubmit={(e: any) => {
        e.preventDefault();

        handleSubmit(async (data: FormData) => {

          if (getValidationSchema) {
            const schema = zod.object(getValidationSchema?.(zod) || {});
            const err = schema.safeParse(data);

            const indexedErrors: Record<string, any> = {};

            if (!err.success) {
              for (const error of err.error.errors) {
                const pathKey = error.path.join('.');
                indexedErrors[pathKey] = error.message;
              }

              setErrors(indexedErrors);

              return;
            }

            setErrors(indexedErrors);
          }

          setPending(true);
          const errors = await onSubmit?.(data);
          setErrors((errors || {}) as Record<string, string>);
          setPending(false);
        })(e);
      }}
    >
      {typeof children === 'function' ? children({ errors: errors as ErrorsType<FormData>, pending, resetErrors: () => setErrors({}) }) : children}
    </form>
  );
}
