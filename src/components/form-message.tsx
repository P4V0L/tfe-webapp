import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons";

interface FormMessageProps {
  message?: string;
  type: "error" | "success";
}

/**
 * A reusable component for displaying form messages (errors or success).
 * Consolidates FormError and FormSuccess into a single component.
 */
export const FormMessage = ({ message, type }: FormMessageProps) => {
  if (!message) return null;

  const isError = type === "error";
  const Icon = isError ? ExclamationTriangleIcon : CheckCircledIcon;
  const bgColor = isError ? "bg-destructive/15" : "bg-emerald-500/15";
  const textColor = isError ? "text-destructive" : "text-emerald-500";

  return (
    <div className={`${bgColor} p-3 rounded-md flex items-center gap-x-2 text-sm ${textColor}`}>
      <Icon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
