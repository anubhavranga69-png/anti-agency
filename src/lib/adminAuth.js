import { supabase } from "@/lib/supabaseClient";

/**
 * Checks if the current authenticated user has an entry in public.admin_users.
 * Returns:
 *   session: current Supabase session or null
 *   user: current Supabase user or null
 *   isAdmin: boolean (true if user ID exists in public.admin_users)
 */
export async function verifyAdminSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { session: null, user: null, isAdmin: false };
  }

  const { data: adminRecord, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (error || !adminRecord) {
    return { session, user: session.user, isAdmin: false };
  }

  return { session, user: session.user, isAdmin: true };
}
