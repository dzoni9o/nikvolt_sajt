import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/components/site/json-ld";
import { areaNames } from "@/lib/areas";
import { getEntries } from "@/lib/mdx";
import { breadcrumbs, graph, localBusiness } from "@/lib/schema";
import { alternatesForRoute } from "@/lib/seo";
import { assessHref, site } from "@/lib/site-config";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Meta.Services" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesForRoute("/usluge", locale),
  };
}

export default async function ServicesIndex({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("ServicesIndex");
  const tNav = await getTranslations("Nav");
  const tMeta = await getTranslations("Meta.Home");
  const services = getEntries("usluge", locale);

  const data = graph([
    localBusiness({
      locale,
      description: tMeta("description"),
      areaServed: areaNames(locale),
    }),
    breadcrumbs(locale, [
      { name: site.name, href: "/" },
      { name: tNav("services"), href: "/usluge" },
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
        <Link
          href={assessHref}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background"
        >
          {t("cta")} <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Link
            key={s.slug}
            href={{ pathname: "/usluge/[slug]", params: { slug: s.slug } }}
            className="group flex flex-col rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold leading-snug text-foreground">
              {s.title}
            </h2>
            <p className="mt-2 flex-1 text-sm text-ink-soft">{s.description}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
              {s.priceFrom
                ? t("fromPrice", { amount: s.priceFrom.toLocaleString("sr-Latn") })
                : t("more")}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
