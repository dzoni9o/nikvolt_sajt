import type { Metadata } from "next";
import Link from "next/link";
import { supabaseServer, SupabaseNotConfiguredError } from "@/lib/supabase/server";
import { ConfigNeeded } from "./config-needed";

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
            <span className="font-medium text-ink-soft">nik volt</span>
          </Link>
          {user && (
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-ink-soft sm:inline">{user.email}</span>
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
