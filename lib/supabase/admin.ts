import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. This bypasses Row Level Security, so it
 * must NEVER be imported into a Client Component and must NEVER have its
 * result exposed directly to the browser.
 *
 * The `server-only` import above will throw a build error if any client
 * component accidentally imports this file.
 *
 * Use this only for privileged admin-side writes (e.g. deleting a property
 * and its dependent rows in one transaction) where RLS as the logged-in
 * admin user is not sufficient. Prefer the regular server client
 * (lib/supabase/server.ts) wherever RLS-scoped access is enough.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
