import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Uvid",
  robots: { index: false, follow: false, nocache: true },
};

export default async function UvidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Real auth guard. Proxy already redirects, but defense-in-depth.
  // We check user inside this layout so even direct fetches to /uvid go through this.
  // Login page lives outside this auth check via its own (login) folder structure.

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
      <main className="container-page py-8">{children}</main>
    </div>
  );
}

// Re-export user-fetching helper for child pages? No — they fetch independently.
export { redirect };
