import { createClient } from "@supabase/supabase-js";

// These are NEXT_PUBLIC_ vars — safe to use in client-side code.
// They are baked into the static bundle at build time.
// Set them in .env.local (see .env.local.example).
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Singleton Supabase browser client — uses only the public anon key.
// The service-role key is NEVER used in client-side code.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
