import { Loader2 } from "lucide-react";

/**
 * Full-screen loading spinner shown while checking the existing Supabase session.
 * Preserves the exact original loading state UI.
 */
export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#E40101] animate-spin" />
    </div>
  );
}
