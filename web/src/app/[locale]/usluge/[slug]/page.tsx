import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx-components";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight, MapPin, Phone, Send } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/components/site/json-ld";
import { FaqList } from "@/components/sections/faq";
import { areaNames } from "@/lib/areas";
import {
  getEntries,
  getEntry,
  getEntryByKey,
  getTranslations as getEntryTranslations,
  staticParamsFor,
} from "@/lib/mdx";
import {
  breadcrumbs,
  faqPage,
  graph,
  localBusiness,
  service as serviceSchema,
} from "@/lib/schema";
import { alternatesForEntry } from "@/lib/seo";
import { assessHref, site } from "@/lib/site-config";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return staticParamsFor("usluge");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const entry = getEntry("usluge", locale, slug);
  if (!entry) return {};

  return {
    title: entry.title,
    description: entry.description,
    alternates: alternatesForEntry(
      "/usluge/[slug]",
      getEntryTranslations("usluge", entry.key),
      locale,
    ),
    openGraph: {
      type: "article",
      title: entry.title,
      description: entry.description,
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const entry = getEntry("usluge", locale, slug);
  if (!entry) notFound();

  const t = await getTranslations("ServicePage");
  const tNav = await getTranslations("Nav");
  const tMeta = await getTranslations("Meta.Home");
  const areas = areaNames(locale);

  // Related content is referenced by translation key, so a Serbian service page
  // links to Serbian locations and articles without any per-locale wiring.
  const relatedLocations = entry.relatedLocations
    .map((key) => getEntryByKey("lokacije", locale, key))
    .filter((x) => x !== null);
  const relatedPosts = entry.relatedPosts
    .map((key) => getEntryByKey("blog", locale, key))
    .filter((x) => x !== null);
  const otherServices = getEntries("usluge", locale)
    .filter((s) => s.slug !== entry.slug)
    .slice(0, 6);

  const data = graph([
    localBusiness({ locale, description: tMeta("description"), areaServed: areas }),
    serviceSchema({
      locale,
      name: entry.title,
      description: entry.description,
      href: { pathname: "/usluge/[slug]", params: { slug: entry.slug } },
      priceFrom: entry.priceFrom,
      areaServed: areas,
    }),
    faqPage(entry.faq),
    breadcrumbs(locale, [
      { name: site.name, href: "/" },
      { name: tNav("services"), href: "/usluge" },
      {
        name: entry.title,
        href: { pathname: "/usluge/[slug]", params: { slug: entry.slug } },
      },
    ]),
  ]);

  return (
    <article className="pb-16">
      <JsonLd data={data} />

      <div className="container-page pt-10">
        <Link
          href="/usluge"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {t("allServices")}
        </Link>
      </div>

      <header className="container-page mt-6 max-w-3xl">
        <h1 className="font-display text-balance text-4xl font-bold leading-tight tracking-[-0.02em] text-foreground sm:text-5xl md:text-6xl">
          {entry.h1}
        </h1>
        <p className="mt-5 text-pretty text-lg text-ink-soft sm:text-xl">
          {entry.description}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={assessHref}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background"
          >
            <Send className="h-4 w-4" /> {t("sendProblem")}
          </Link>
          <a
            href={`tel:${site.phoneTel}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-foreground"
          >
            <Phone className="h-4 w-4" /> {site.phoneDisplay}
          </a>
        </div>

        {entry.priceFrom && (
          <p className="mt-6 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-ink-soft">
            <span className="font-semibold text-foreground">
              {t("priceFrom", { amount: entry.priceFrom.toLocaleString("sr-Latn") })}
            </span>
            {entry.priceNote ? ` · ${entry.priceNote}` : ""}
          </p>
        )}
      </header>

      <div className="container-page prose-electric mt-12 max-w-3xl">
        <MDXRemote source={entry.content} components={mdxComponents} />
      </div>

      {entry.faq.length > 0 && (
        <section className="container-page mt-16 max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
            {t("faqTitle")}
          </h2>
          <FaqList items={entry.faq} />
        </section>
      )}

      {relatedLocations.length > 0 && (
        <section className="container-page mt-16">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
            {t("whereTitle")}
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {relatedLocations.map((loc) => (
              <Link
                key={loc.slug}
                href={{ pathname: "/lokacije/[slug]", params: { slug: loc.slug } }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                <MapPin className="h-3.5 w-3.5 text-ink-soft" /> {loc.area}
              </Link>
            ))}
          </div>
        </section>
      )}

      {relatedPosts.length > 0 && (
        <section className="container-page mt-16">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
            {t("readTitle")}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {relatedPosts.map((post) => (
              <Link
                key={post.slug}
                href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
                className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="text-base font-semibold leading-snug text-foreground">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-ink-soft">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {otherServices.length > 0 && (
        <section className="container-page mt-20">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
            {t("otherTitle")}
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {otherServices.map((s) => (
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
    </article>
  );
}
