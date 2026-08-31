import { Award, Wrench, MapPin } from "lucide-react";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getEntries } from "@/lib/mdx";
import { site } from "@/lib/site-config";

const credentials = [
  { id: "licensed", icon: Award },
  { id: "instruments", icon: Wrench },
] as const;

export async function About() {
  const t = await getTranslations("About");
  const tHero = await getTranslations("Hero");
  const f = await getFormatter();
  const locale = await getLocale();

  // Sourced from the location pages rather than site.coverage, so the coverage
  // claimed here and the pages that back it up can never drift apart — and so
  // the homepage links into all five of them.
  const areas = getEntries("lokacije", locale);

  return (
    <section id="about" className="container-page py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
            {t("kicker")}
          </p>
          <h2 className="mt-3 font-display text-balance text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-5 max-w-xl text-base text-ink-soft sm:text-lg">
            {t("lead")}
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {credentials.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {t(`credentials.${c.id}.title`)}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-ink-soft">
                    {t(`credentials.${c.id}.body`)}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="mt-8">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="h-4 w-4" /> {t("coverageTitle")}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {areas.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={{ pathname: "/lokacije/[slug]", params: { slug: a.slug } }}
                    className="inline-block rounded-full border border-border bg-paper px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {a.area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-border bg-foreground p-8 text-background shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-background/60">
              {t("statsHeading")}
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-y-8 gap-x-6">
              <Stat label={t("statsYears")} value={String(site.yearsExperience)} />
              <Stat
                label={t("statsJobs")}
                value={`${f.number(site.jobsCompleted)}+`}
              />
              <Stat label={t("statsResponse")} value={tHero("responseTime")} />
            </dl>
            <div className="mt-8 rounded-2xl border border-background/10 bg-background/5 p-4 text-sm">
              <p className="text-background/80">{t("quote")}</p>
            </div>
          </div>

          <div
            aria-hidden
            className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-brand/30 to-transparent blur-2xl"
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-background/60">{label}</dt>
      <dd className="font-display text-3xl font-bold tabular-nums sm:text-4xl">{value}</dd>
    </div>
  );
}
