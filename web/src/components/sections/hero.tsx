import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Phone, ShieldCheck, Camera, Clock4, CheckCircle2 } from "lucide-react";
import { site } from "@/lib/site-config";

export async function Hero() {
  const t = await getTranslations("Hero");
  const tCta = await getTranslations("Cta");
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-bg [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />
      <div
        aria-hidden
        className="absolute -top-32 right-[-10%] -z-10 h-[520px] w-[520px] rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(255, 214, 10, 0.55), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute bottom-[-30%] left-[-15%] -z-10 h-[600px] w-[600px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, oklch(0.62 0.22 28 / 0.35), transparent 70%)" }}
      />

      <div className="container-page pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-ink-soft backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emergency opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emergency" />
              </span>
              {t("availability", {
                city: site.city,
                responseTime: t("responseTime"),
              })}
            </div>

            <h1 className="font-display text-balance text-[2.6rem] leading-[1.02] font-bold tracking-[-0.02em] text-foreground sm:text-6xl lg:text-[4.25rem]">
              {t("h1Lead", { city: site.city })}{" "}
              <span className="relative inline-block">
                <span className="relative z-10">{t("h1Highlight")}</span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 -z-0 h-3 rounded-sm bg-brand/70 sm:h-4"
                />
              </span>{" "}
              {t("h1Tail")}
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-lg text-ink-soft sm:text-xl">
              {t("lead")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="#assess"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-foreground bg-foreground px-6 py-4 text-base font-semibold text-background shadow-cta transition-all hover:-translate-y-0.5 hover:bg-brand hover:text-brand-foreground hover:border-brand"
              >
                {tCta("sendProblem")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={`tel:${site.phoneTel}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-4 text-base font-semibold text-foreground hover:bg-muted"
              >
                <Phone className="h-4 w-4" />{" "}
                {tCta("callWithNumber", { phone: site.phoneDisplay })}
              </a>
            </div>

            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-soft">
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-foreground" /> {t("badgeLicensed")}</li>
              <li className="flex items-center gap-2"><Clock4 className="h-4 w-4 text-foreground" /> {t("badgeSameDay")}</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-foreground" /> {t("badgeJobs", { count: site.jobsCompleted })}</li>
            </ul>
          </div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

async function HeroVisual() {
  const t = await getTranslations("Hero");
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-brand/30 via-transparent to-emergency/20 blur-2xl"
      />
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
        <div className="flex items-center gap-2 border-b border-border bg-paper/60 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-emergency/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/30" />
          <span className="ml-3 text-xs font-medium text-ink-soft">{t("visualHeader")}</span>
        </div>
        <div className="space-y-4 p-5">
          <div className="grid grid-cols-3 gap-2">
            <PhotoTile label={t("photoTabla")} tone="warn" />
            <PhotoTile label={t("photoUticnica")} tone="ok" />
            <PhotoTile label={t("photoKabl")} tone="bad" />
          </div>

          <div className="rounded-2xl border border-border bg-paper/70 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-ink-soft">
              <Camera className="h-3.5 w-3.5" /> {t("symptoms")}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[t("symSparking"), t("symBurning"), t("symHotPanel")].map((c) => (
                <span key={c} className="rounded-full border border-emergency/30 bg-emergency-soft px-2.5 py-1 text-xs font-medium text-emergency">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-foreground/10 bg-foreground p-4 text-background">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-background/60">{t("estimateLabel")}</div>
                <div className="mt-1.5 text-base font-semibold leading-tight">{t("estimateText")}</div>
              </div>
              <span className="shrink-0 rounded-full bg-emergency px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emergency-foreground">{t("riskHigh")}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-background/10 p-2.5">
                <div className="text-[11px] uppercase tracking-wider text-background/60">{t("indicative")}</div>
                <div className="text-sm font-semibold">{t("indicativeRange")}</div>
              </div>
              <div className="rounded-lg bg-background/10 p-2.5">
                <div className="text-[11px] uppercase tracking-wider text-background/60">{t("earliest")}</div>
                <div className="text-sm font-semibold">{t("earliestValue")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-5 -left-5 hidden rotate-[-4deg] rounded-2xl border border-border bg-card p-3 shadow-lg sm:block">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-brand-foreground">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground">{t("insulationOk")}</div>
            <div className="text-[11px] text-ink-soft">{t("insulationNote")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhotoTile({ label, tone }: { label: string; tone: "ok" | "warn" | "bad" }) {
  const palette: Record<typeof tone, string> = {
    ok: "from-foreground/5 to-foreground/10",
    warn: "from-brand/30 to-brand/10",
    bad: "from-emergency/35 to-emergency/10",
  };
  return (
    <div className={`relative aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-br ${palette[tone]}`}>
      <div className="absolute inset-0 grid place-items-center">
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-foreground/40" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="11" r="1.6" />
          <path d="m3 17 6-5 5 4 4-3 3 2" />
        </svg>
      </div>
      <span className="absolute bottom-1.5 left-1.5 rounded-md bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-foreground backdrop-blur">{label}</span>
    </div>
  );
}
