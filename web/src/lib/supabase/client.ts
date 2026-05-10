"use client";
import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser client. Used by the /uvid login form to sign in.
 */
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
