import { AlertCircle } from "lucide-react";

/**
 * Error banner rendered inside the login card.
 * Preserves accessibility with role="alert" exactly as in the original.
 *
 * @param {{ message: string }} props
 */
export default function LoginError({ message }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-3 px-4 py-3 mb-6 rounded-xl bg-[#E40101]/10 border border-[#E40101]/30 text-sm text-red-300"
    >
      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#E40101]" />
      <span>{message}</span>
    </div>
  );
}
