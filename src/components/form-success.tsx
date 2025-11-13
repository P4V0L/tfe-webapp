import { FormMessage } from "./form-message";

interface FormSuccessProps {
  message?: string;
}

/**
 * @deprecated Use FormMessage with type="success" instead
 */
export const FormSuccess = ({ message }: FormSuccessProps) => {
  return <FormMessage message={message} type="success" />;
};
