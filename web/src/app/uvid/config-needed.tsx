export function ConfigNeeded() {
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
