import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer, SupabaseNotConfiguredError } from "@/lib/supabase/server";
import { ConfigNeeded } from "./config-needed";
import {
  STATUS_LABELS,
  URGENCY_LABELS,
  CATEGORY_LABELS,
  formatDateTime,
  statusBadgeClass,
  urgencyBadgeClass,
  riskBadgeClass,
  type SubmissionRow,
  type SubmissionStatus,
} from "@/lib/uvid-helpers";

export const dynamic = "force-dynamic";

type Search = {
  status?: string;
  urgency?: string;
  q?: string;
};

export default async function UvidPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  let supabase;
  try {
    supabase = await supabaseServer();
  } catch (err) {
    if (err instanceof SupabaseNotConfiguredError) return <ConfigNeeded />;
    throw err;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/uvid/login");

  let query = supabase
    .from("submissions")
    .select(
      "id, created_at, status, name, phone, location, property_type, category, urgency, burning_smell, hot_panel, sparking, photo_paths, risk_level",
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (sp.status && sp.status !== "all") query = query.eq("status", sp.status);
  if (sp.urgency && sp.urgency !== "all") query = query.eq("urgency", sp.urgency);
  if (sp.q) {
    const term = sp.q.replace(/[%_]/g, "");
    query = query.or(
      `name.ilike.%${term}%,phone.ilike.%${term}%,location.ilike.%${term}%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    return (
      <div className="rounded-lg border border-emergency/30 bg-emergency-soft p-4 text-sm text-emergency">
        Greška: {error.message}
      </div>
    );
  }

  const rows = (data ?? []) as Pick<
    SubmissionRow,
    | "id"
    | "created_at"
    | "status"
    | "name"
    | "phone"
    | "location"
    | "property_type"
    | "category"
    | "urgency"
    | "burning_smell"
    | "hot_panel"
    | "sparking"
    | "photo_paths"
    | "risk_level"
  >[];

  const newCount = rows.filter((r) => r.status === "new").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Prijave</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {rows.length} ukupno · <strong>{newCount}</strong> novih
          </p>
        </div>
      </div>

      <FilterBar current={sp} />

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-paper text-xs uppercase tracking-widest text-ink-soft">
            <tr>
              <th className="px-4 py-3 text-left">Datum</th>
              <th className="px-4 py-3 text-left">Klijent</th>
              <th className="px-4 py-3 text-left">Lokacija</th>
              <th className="px-4 py-3 text-left">Kategorija</th>
              <th className="px-4 py-3 text-left">Hitnost</th>
              <th className="px-4 py-3 text-left">Rizik</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">📎</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-ink-soft">
                  Nema prijava za ove filtere.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-paper">
                <td className="whitespace-nowrap px-4 py-3 text-xs text-ink-soft">
                  {formatDateTime(r.created_at)}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/uvid/${r.id}`} className="font-semibold text-foreground hover:underline">
                    {r.name}
                  </Link>
                  <div className="text-xs text-ink-soft">{r.phone}</div>
                </td>
                <td className="px-4 py-3">{r.location}</td>
                <td className="px-4 py-3 text-xs">{CATEGORY_LABELS[r.category]}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${urgencyBadgeClass(r.urgency)}`}>
                    {URGENCY_LABELS[r.urgency]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {r.risk_level && (
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${riskBadgeClass(r.risk_level)}`}>
                      {r.risk_level}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${statusBadgeClass(r.status)}`}>
                    {STATUS_LABELS[r.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-ink-soft">
                  {r.photo_paths.length > 0 ? `${r.photo_paths.length}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterBar({ current }: { current: Search }) {
  const statuses: ("all" | SubmissionStatus)[] = [
    "all",
    "new",
    "reviewing",
    "quoted",
    "scheduled",
    "done",
    "spam",
  ];
  return (
    <form className="flex flex-wrap items-center gap-2" action="/uvid">
      <input
        name="q"
        defaultValue={current.q ?? ""}
        placeholder="Pretraga (ime, telefon, lokacija)"
        className="rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-foreground"
      />
      <select
        name="status"
        defaultValue={current.status ?? "all"}
        className="rounded-full border border-border bg-background px-3 py-2 text-sm"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s === "all" ? "Svi statusi" : STATUS_LABELS[s as SubmissionStatus]}
          </option>
        ))}
      </select>
      <select
        name="urgency"
        defaultValue={current.urgency ?? "all"}
        className="rounded-full border border-border bg-background px-3 py-2 text-sm"
      >
        <option value="all">Sva hitnost</option>
        <option value="urgent">Hitno</option>
        <option value="today">Danas</option>
        <option value="not-urgent">Nije hitno</option>
      </select>
      <button
        type="submit"
        className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background"
      >
        Filtriraj
      </button>
    </form>
  );
}
