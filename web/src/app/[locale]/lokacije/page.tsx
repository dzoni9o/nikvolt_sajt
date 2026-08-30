import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/components/site/json-ld";
import { areaNames } from "@/lib/areas";
import { getEntries } from "@/lib/mdx";
import { breadcrumbs, graph, localBusiness } from "@/lib/schema";
import { alternatesForRoute } from "@/lib/seo";
import { site } from "@/lib/site-config";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Meta.Areas" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesForRoute("/lokacije", locale),
  };
}

export default async function LocationsIndex({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("AreasIndex");
  const tLoc = await getTranslations("LocationPage");
  const tNav = await getTranslations("Nav");
  const tMeta = await getTranslations("Meta.Home");
  const areas = getEntries("lokacije", locale);

  const data = graph([
    localBusiness({
      locale,
      description: tMeta("description"),
      areaServed: areaNames(locale),
    }),
    breadcrumbs(locale, [
      { name: site.name, href: "/" },
      { name: tNav("areas"), href: "/lokacije" },
    ]),
  ]);

  return (
    <div className="container-page py-16 md:py-24">
      <JsonLd data={data} />

      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
          {t("kicker")}
        </p>
        <h1 className="mt-3 font-display text-balance text-4xl font-bold tracking-[-0.02em] text-foreground sm:text-5xl md:text-6xl">
          {t("title", { city: site.city })}
        </h1>
        <p className="mt-5 text-base text-ink-soft sm:text-lg">{t("lead")}</p>
      </header>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((a) => (
          <Link
            key={a.slug}
            href={{ pathname: "/lokacije/[slug]", params: { slug: a.slug } }}
            className="group flex flex-col rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold leading-snug text-foreground">
              {a.area}
            </h2>
            <p className="mt-2 flex-1 text-sm text-ink-soft">{a.description}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
              <Clock className="h-3.5 w-3.5 text-ink-soft" />
              {tLoc("responseTime", { time: a.responseTime })}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
