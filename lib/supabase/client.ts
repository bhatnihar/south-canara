import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use in Client Components.
 * Uses the public anon key only — safe to ship to the browser.
 * Row Level Security policies govern what this client can actually read/write.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
