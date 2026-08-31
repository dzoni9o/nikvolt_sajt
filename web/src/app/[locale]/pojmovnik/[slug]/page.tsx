import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx-components";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/components/site/json-ld";
import { Backlinks } from "@/components/site/backlinks";
import {
  getEntries,
  getEntry,
  getEntryByKey,
  getTranslations as getEntryTranslations,
  staticParamsFor,
} from "@/lib/mdx";
import { breadcrumbs, definedTerm, graph } from "@/lib/schema";
import { alternatesForEntry } from "@/lib/seo";
import { site } from "@/lib/site-config";
import { ContactLink } from "@/components/site/contact-link";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return staticParamsFor("pojmovnik");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const entry = getEntry("pojmovnik", locale, slug);
  if (!entry) return {};

  return {
    title: entry.title,
    description: entry.description,
    alternates: alternatesForEntry(
      "/pojmovnik/[slug]",
      getEntryTranslations("pojmovnik", entry.key),
      locale,
    ),
    openGraph: { type: "article", title: entry.title, description: entry.description },
  };
}

export default async function TermPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const entry = getEntry("pojmovnik", locale, slug);
  if (!entry) notFound();

  const t = await getTranslations("TermPage");
  const tNav = await getTranslations("Nav");

  const seeAlso = entry.seeAlso
    .map((key) => getEntryByKey("pojmovnik", locale, key))
    .filter((x) => x !== null);

  // Same group, so the reader who wants more of the same has somewhere to go.
  const sameGroup = getEntries("pojmovnik", locale)
    .filter((x) => x.group === entry.group && x.slug !== entry.slug)
    .slice(0, 6);

  const href = { pathname: "/pojmovnik/[slug]" as const, params: { slug: entry.slug } };
  const data = graph([
    definedTerm({
      locale,
      name: entry.title,
      description: entry.shortAnswer,
      href,
    }),
    breadcrumbs(locale, [
      { name: site.name, href: "/" },
      { name: tNav("glossary"), href: "/pojmovnik" },
      { name: entry.title, href },
    ]),
  ]);

  return (
    <article className="pb-16">
      <JsonLd data={data} />

      <div className="container-page pt-10">
        <Link
          href="/pojmovnik"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {t("allTerms")}
        </Link>
      </div>

      <header className="container-page mt-6 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
          {entry.group}
        </p>
        <h1 className="mt-3 font-display text-balance text-4xl font-bold leading-tight tracking-[-0.02em] text-foreground sm:text-5xl">
          {entry.h1}
        </h1>
        {/* The one-line answer sits above the fold on purpose: most readers came
            for exactly this sentence and should not have to hunt for it. */}
        <p className="mt-6 border-l-4 border-brand bg-brand-soft/40 py-4 pl-5 pr-4 text-pretty text-lg font-medium text-foreground sm:text-xl">
          {entry.shortAnswer}
        </p>
      </header>

      <div className="container-page prose-electric mt-10 max-w-3xl">
        <MDXRemote source={entry.content} components={mdxComponents} />
      </div>

      {seeAlso.length > 0 && (
        <section className="container-page mt-14 max-w-3xl">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
            {t("seeAlso")}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {seeAlso.map((x) => (
              <Link
                key={x.slug}
                href={{ pathname: "/pojmovnik/[slug]", params: { slug: x.slug } }}
                className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="text-base font-semibold text-foreground">{x.title}</h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">
                  {x.shortAnswer}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Backlinks locale={locale} collection="pojmovnik" slug={entry.slug} />

      {sameGroup.length > 0 && (
        <section className="container-page mt-14">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
            {t("moreInGroup", { group: entry.group })}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {sameGroup.map((x) => (
              <Link
                key={x.slug}
                href={{ pathname: "/pojmovnik/[slug]", params: { slug: x.slug } }}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                {x.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container-page mt-16">
        <div className="flex flex-col items-start justify-between gap-5 rounded-3xl border border-border bg-foreground p-7 text-background sm:flex-row sm:items-center sm:p-9">
          <div className="max-w-md">
            <h2 className="font-display text-xl font-bold sm:text-2xl">{t("ctaTitle")}</h2>
            <p className="mt-2 text-sm text-background/70">{t("ctaLead")}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <ContactLink
              channel="phone"
              source="glossary"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground"
            >
              <Phone className="h-4 w-4" /> {site.phoneDisplay}
            </ContactLink>
            <Link
              href="/usluge"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-background/30 px-5 py-3 text-sm font-semibold"
            >
              {t("ctaServices")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
