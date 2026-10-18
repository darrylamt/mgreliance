import { createClient } from "@supabase/supabase-js";

/**
 * Cookie-free anon client for public, read-only data. Unlike the cookie-based server client
 * it doesn't opt the route into dynamic rendering, so ISR (`revalidate`) actually caches.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
