import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/lib/site-config";

// With no single root layout (the public site and /uvid each have their own),
// Next.js has nothing to compose a 404 from — global-not-found.tsx fills that
// gap and must bring its own <html>, styles and fonts.

export const metadata: Metadata = {
  title: "Stranica nije pronađena · nik volt",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="sr-Latn" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full bg-paper text-foreground">
        <main className="container-page flex min-h-screen flex-col items-center justify-center py-24 text-center">
          <p className="font-mono text-sm font-semibold uppercase tracking-widest text-ink-soft">
            404
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-[-0.02em] sm:text-5xl">
            Ova stranica ne postoji.
          </h1>
          <p className="mt-4 max-w-md text-base text-ink-soft">
            Link je verovatno zastareo ili pogrešno otkucan. Ako ti hitno treba
            električar, pozovi direktno — brže je od traženja po sajtu.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={`tel:${site.phoneTel}`}
              className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background"
            >
              {site.phoneDisplay}
            </a>
            <Link
              href="/sr"
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold"
            >
              Nazad na početnu
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
