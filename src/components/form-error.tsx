import { FormMessage } from "./form-message";

interface FormErrorProps {
  message?: string;
}

/**
 * @deprecated Use FormMessage with type="error" instead
 */
export const FormError = ({ message }: FormErrorProps) => {
  return <FormMessage message={message} type="error" />;
};
