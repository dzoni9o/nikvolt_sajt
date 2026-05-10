import type { Metadata } from "next";
import Link from "next/link";
import { supabaseServer, SupabaseNotConfiguredError } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Uvid",
  robots: { index: false, follow: false, nocache: true },
};

export default async function UvidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: { email?: string | null } | null = null;
  let configError = false;
  try {
    const supabase = await supabaseServer();
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    user = u;
  } catch (err) {
    if (err instanceof SupabaseNotConfiguredError) {
      configError = true;
    } else {
      throw err;
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-30 border-b border-border bg-paper/95 backdrop-blur">
        <div className="container-page flex h-14 items-center justify-between">
          <Link href="/uvid" className="text-sm font-bold tracking-tight">
            <span>uvid</span>
            <span className="text-brand">·</span>
            <span className="text-ink-soft font-medium">nik volt</span>
          </Link>
          {user && (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-ink-soft">{user.email}</span>
              <form action="/uvid/logout" method="post">
                <button
                  type="submit"
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                >
                  Odjavi se
                </button>
              </form>
            </div>
          )}
        </div>
      </header>
      <main className="container-page py-8">
        {configError ? <ConfigNeeded /> : children}
      </main>
    </div>
  );
}

function ConfigNeeded() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 shadow-sm">
      <h1 className="font-display text-2xl font-bold tracking-tight">
        Admin nije konfigurisan
      </h1>
      <p className="mt-3 text-sm text-ink-soft">
        Supabase varijable okruženja nedostaju na ovom okruženju. Dodaj ih u
        Vercel → Project → Settings → Environment Variables i ponovo deployuj.
      </p>
      <ul className="mt-5 space-y-2 text-sm">
        <li className="flex items-start gap-2">
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_URL</code>
          <span className="text-ink-soft">— iz Supabase Project Settings → API</span>
        </li>
        <li className="flex items-start gap-2">
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
          <span className="text-ink-soft">— iz Supabase Project Settings → API</span>
        </li>
        <li className="flex items-start gap-2">
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">SUPABASE_SERVICE_ROLE_KEY</code>
          <span className="text-ink-soft">— server-only, za API rute</span>
        </li>
      </ul>
    </div>
  );
}
