import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server client bound to the current request's cookies.
 * Use in server components, server actions, and route handlers
 * that need to read/write the authenticated user's session.
 */
export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    },
  );
}
