import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Phone, MessageCircle } from "lucide-react";
import { supabaseServer, SupabaseNotConfiguredError } from "@/lib/supabase/server";
import { SUBMISSIONS_BUCKET } from "@/lib/supabase/service";
import {
  STATUS_LABELS,
  URGENCY_LABELS,
  CATEGORY_LABELS,
  PROPERTY_LABELS,
  formatDateTime,
  statusBadgeClass,
  urgencyBadgeClass,
  riskBadgeClass,
  type SubmissionRow,
} from "@/lib/uvid-helpers";
import { updateSubmission } from "./actions";
import { ConfigNeeded } from "../config-needed";

export const dynamic = "force-dynamic";

export default async function SubmissionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();
  const r = data as SubmissionRow;

  // Generate signed URLs for photos (15-min expiry)
  let signed: { path: string; url: string }[] = [];
  if (r.photo_paths.length > 0) {
    const { data: urls } = await supabase.storage
      .from(SUBMISSIONS_BUCKET)
      .createSignedUrls(r.photo_paths, 60 * 15);
    signed =
      urls?.map((u, i) => ({ path: r.photo_paths[i], url: u.signedUrl ?? "" })) ?? [];
  }

  const flags = [
    r.burning_smell && { label: "Miris paljevine", emoji: "🔥" },
    r.hot_panel && { label: "Topla tabla", emoji: "♨️" },
    r.sparking && { label: "Varničenje", emoji: "⚡" },
  ].filter(Boolean) as { label: string; emoji: string }[];

  const phoneTel = r.phone.replace(/\s/g, "");

  return (
    <div className="space-y-6">
      <Link href="/uvid" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Sve prijave
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{r.name}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {formatDateTime(r.created_at)} · ID <code className="text-[11px]">{r.id.slice(0, 8)}</code>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${urgencyBadgeClass(r.urgency)}`}>
            {URGENCY_LABELS[r.urgency]}
          </span>
          {r.risk_level && (
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${riskBadgeClass(r.risk_level)}`}>
              Rizik: {r.risk_level}
            </span>
          )}
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${statusBadgeClass(r.status)}`}>
            {STATUS_LABELS[r.status]}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* LEFT — submission data + photos */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Telefon">
                <div className="flex items-center gap-2">
                  <a href={`tel:${phoneTel}`} className="font-semibold text-foreground hover:underline">
                    {r.phone}
                  </a>
                  <a
                    href={`tel:${phoneTel}`}
                    className="grid h-7 w-7 place-items-center rounded-full border border-border hover:bg-muted"
                    aria-label="Pozovi"
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`https://wa.me/${phoneTel.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-7 w-7 place-items-center rounded-full border border-border hover:bg-muted"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </a>
                </div>
              </Field>
              <Field label="Lokacija">{r.location}</Field>
              <Field label="Tip objekta">{PROPERTY_LABELS[r.property_type]}</Field>
              <Field label="Kategorija">{CATEGORY_LABELS[r.category]}</Field>
            </div>

            {flags.length > 0 && (
              <div className="mt-5 rounded-xl border border-emergency/30 bg-emergency-soft p-3">
                <div className="text-xs font-semibold uppercase tracking-widest text-emergency">Crveni flagovi</div>
                <ul className="mt-2 flex flex-wrap gap-2 text-sm">
                  {flags.map((f) => (
                    <li key={f.label} className="rounded-full border border-emergency/40 bg-paper px-2.5 py-1">
                      {f.emoji} {f.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {r.description && (
              <div className="mt-5">
                <Field label="Opis">
                  <p className="whitespace-pre-wrap text-sm text-foreground">{r.description}</p>
                </Field>
              </div>
            )}

            {r.risk_callout && (
              <div className="mt-5 rounded-xl border border-border bg-paper p-3 text-sm">
                <span className="text-ink-soft">Auto-procena: </span>
                {r.risk_callout}
              </div>
            )}
          </div>

          {/* Photos */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-bold">Fotografije ({signed.length})</h2>
            {signed.length === 0 ? (
              <p className="mt-3 text-sm text-ink-soft">Nema priloga.</p>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {signed.map((s) => (
                  <a
                    key={s.path}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block aspect-square overflow-hidden rounded-xl border border-border bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.url}
                      alt=""
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — admin workflow */}
        <div className="space-y-6">
          <form action={updateSubmission} className="space-y-4 rounded-2xl border border-border bg-card p-5">
            <input type="hidden" name="id" value={r.id} />

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-ink-soft">Status</label>
              <select
                name="status"
                defaultValue={r.status}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                {(Object.keys(STATUS_LABELS) as (keyof typeof STATUS_LABELS)[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-ink-soft">Cena od (RSD)</label>
                <input
                  type="number"
                  min={0}
                  name="estimated_price_min"
                  defaultValue={r.estimated_price_min ?? ""}
                  className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-ink-soft">Cena do (RSD)</label>
                <input
                  type="number"
                  min={0}
                  name="estimated_price_max"
                  defaultValue={r.estimated_price_max ?? ""}
                  className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-ink-soft">Beleške</label>
              <textarea
                name="admin_notes"
                rows={6}
                defaultValue={r.admin_notes ?? ""}
                placeholder="Šta si video, šta klijent zna, šta treba doneti..."
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background hover:bg-brand hover:text-brand-foreground"
            >
              Sačuvaj
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-widest text-ink-soft">{label}</div>
      <div className="mt-1.5 text-sm">{children}</div>
    </div>
  );
}
