import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/components/site/json-ld";
import { getEntries } from "@/lib/mdx";
import { breadcrumbs, graph } from "@/lib/schema";
import { alternatesForRoute } from "@/lib/seo";
import { site } from "@/lib/site-config";

type Props = { params: Promise<{ locale: string }> };

/**
 * Only locales that actually have terms. The glossary is Serbian-only for now,
 * and an empty index at /en/glossary would be a thin page advertising nothing.
 */
export function generateStaticParams() {
  return routing.locales
    .filter((locale) => getEntries("pojmovnik", locale).length > 0)
    .map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Meta.Glossary" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesForRoute("/pojmovnik", locale),
  };
}

export default async function GlossaryIndex({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const terms = getEntries("pojmovnik", locale);
  if (terms.length === 0) notFound();

  const t = await getTranslations("Glossary");
  const tNav = await getTranslations("Nav");

  // Grouped so the index reads like a table of contents rather than a wall.
  const groups = [...new Set(terms.map((x) => x.group))].sort((a, b) =>
    a.localeCompare(b, "sr-Latn"),
  );

  const data = graph([
    breadcrumbs(locale, [
      { name: site.name, href: "/" },
      { name: tNav("glossary"), href: "/pojmovnik" },
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
          {t("title")}
        </h1>
        <p className="mt-5 text-base text-ink-soft sm:text-lg">{t("lead")}</p>
      </header>

      <nav className="mt-10 flex flex-wrap gap-2" aria-label={t("groups")}>
        {groups.map((g) => (
          <a
            key={g}
            href={`#${encodeURIComponent(g.toLowerCase())}`}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            {g}
          </a>
        ))}
      </nav>

      {groups.map((group) => (
        <section
          key={group}
          id={encodeURIComponent(group.toLowerCase())}
          className="mt-14 scroll-mt-24"
        >
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
            {group}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {terms
              .filter((x) => x.group === group)
              .map((x) => (
                <Link
                  key={x.slug}
                  href={{ pathname: "/pojmovnik/[slug]", params: { slug: x.slug } }}
                  className="group flex flex-col rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <h3 className="text-lg font-semibold leading-snug text-foreground">
                    {x.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-ink-soft">{x.shortAnswer}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    {t("read")}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
