import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MdxBody } from "@/components/mdx-body";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight, Clock, Phone, Send } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/components/site/json-ld";
import { Backlinks } from "@/components/site/backlinks";
import { FaqList } from "@/components/sections/faq";
import { areaNames } from "@/lib/areas";
import {
  getEntries,
  getEntry,
  getEntryByKey,
  getTranslations as getEntryTranslations,
  staticParamsFor,
} from "@/lib/mdx";
import { breadcrumbs, faqPage, graph, localBusiness } from "@/lib/schema";
import { alternatesForEntry } from "@/lib/seo";
import { assessHref, site } from "@/lib/site-config";
import { ContactLink } from "@/components/site/contact-link";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return staticParamsFor("lokacije");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const entry = getEntry("lokacije", locale, slug);
  if (!entry) return {};

  return {
    title: entry.title,
    description: entry.description,
    alternates: alternatesForEntry(
      "/lokacije/[slug]",
      getEntryTranslations("lokacije", entry.key),
      locale,
    ),
    openGraph: {
      type: "article",
      title: entry.title,
      description: entry.description,
    },
  };
}

export default async function LocationPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const entry = getEntry("lokacije", locale, slug);
  if (!entry) notFound();

  const t = await getTranslations("LocationPage");
  const tNav = await getTranslations("Nav");

  const featured = entry.featuredServices
    .map((key) => getEntryByKey("usluge", locale, key))
    .filter((x) => x !== null);
  const otherAreas = getEntries("lokacije", locale).filter(
    (l) => l.slug !== entry.slug,
  );

  const data = graph([
    // areaServed stays the full coverage list. The business node is addressed by
    // one @id across the whole site, so narrowing it here would leave a single
    // entity claiming two different service areas depending on which page you
    // read. The local focus is already carried by the H1, breadcrumb and copy.
    localBusiness({
      locale,
      description: entry.description,
      areaServed: areaNames(locale),
    }),
    faqPage(entry.faq),
    breadcrumbs(locale, [
      { name: site.name, href: "/" },
      { name: tNav("areas"), href: "/lokacije" },
      {
        name: entry.area,
        href: { pathname: "/lokacije/[slug]", params: { slug: entry.slug } },
      },
    ]),
  ]);

  return (
    <article className="pb-16">
      <JsonLd data={data} />

      <div className="container-page pt-10">
        <Link
          href="/lokacije"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {t("allAreas")}
        </Link>
      </div>

      <header className="container-page mt-6 max-w-3xl">
        <h1 className="font-display text-balance text-4xl font-bold leading-tight tracking-[-0.02em] text-foreground sm:text-5xl md:text-6xl">
          {entry.h1}
        </h1>
        <p className="mt-5 text-pretty text-lg text-ink-soft sm:text-xl">
          {entry.description}
        </p>

        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground">
          <Clock className="h-4 w-4 text-ink-soft" />
          {t("responseTime", { time: entry.responseTime })}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ContactLink
            channel="phone"
            source="location-page"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background"
          >
            <Phone className="h-4 w-4" /> {site.phoneDisplay}
          </ContactLink>
          <Link
            href={assessHref}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-foreground"
          >
            <Send className="h-4 w-4" /> {t("sendProblem")}
          </Link>
        </div>
      </header>

      <div className="container-page prose-electric mt-12 max-w-3xl">
        <MdxBody source={entry.content} />
      </div>

      {entry.faq.length > 0 && (
        <section className="container-page mt-16 max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
            {t("faqTitle")}
          </h2>
          <FaqList items={entry.faq} />
        </section>
      )}

      {featured.length > 0 && (
        <section className="container-page mt-16">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
            {t("servicesTitle", { area: entry.area })}
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <Link
                key={s.slug}
                href={{ pathname: "/usluge/[slug]", params: { slug: s.slug } }}
                className="group inline-flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm font-semibold text-foreground hover:bg-muted"
              >
                {s.title}
                <ArrowRight className="h-4 w-4 shrink-0 text-ink-soft transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <Backlinks locale={locale} collection="lokacije" slug={entry.slug} />

      {otherAreas.length > 0 && (
        <section className="container-page mt-16">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
            {t("otherAreasTitle")}
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {otherAreas.map((l) => (
              <Link
                key={l.slug}
                href={{ pathname: "/lokacije/[slug]", params: { slug: l.slug } }}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                {l.area}
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
