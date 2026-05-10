import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "Supabase env vars missing — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
}

/**
 * Server client bound to the current request's cookies.
 * Throws SupabaseNotConfiguredError if env vars are missing — callers should
 * catch this and render a config-needed page instead of letting it 500.
 */
export async function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new SupabaseNotConfiguredError();

  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(toSet) {
        try {
          for (const { name, value, options } of toSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Setting cookies in a Server Component throws — ignored when called
          // from a context (RSC) where mutation isn't possible. Proxy refreshes
          // the session cookie for us before we get here.
        }
      },
    },
  });
}
