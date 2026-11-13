import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "../config/site";

let client: SupabaseClient | null = null;

/** Shared Supabase client (only loaded by the Careers pages, so the rest of the site stays light). */
export function supabase(): SupabaseClient {
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: true, storageKey: "zhostel-careers-auth" },
    });
  }
  return client;
}
