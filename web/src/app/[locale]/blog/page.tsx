import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { getAllPosts, getCategories } from "@/lib/blog";
import { getEntries } from "@/lib/mdx";
import { alternatesForRoute } from "@/lib/seo";
import { CoverArt } from "@/components/blog/cover-art";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Meta.Blog" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesForRoute("/blog", locale),
  };
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Blog");
  const posts = getAllPosts(locale);
  const categories = getCategories(locale);
  const hasGlossary = getEntries("pojmovnik", locale).length > 0;
  const [feature, ...rest] = posts;

  return (
    <div className="container-page py-16 md:py-24">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
          {t("kicker")}
        </p>
        <h1 className="mt-3 font-display text-balance text-4xl font-bold tracking-[-0.02em] text-foreground sm:text-5xl md:text-6xl">
          {t("title", { city: site.city })}
        </h1>
        <p className="mt-5 text-base text-ink-soft sm:text-lg">{t("lead")}</p>
      </header>

      {/* Categories used to be inert <span>s. They now describe what is here and
          hand the reader the glossary, which is the other half of the material. */}
      <div className="mt-10 flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <span
            key={c}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-ink-soft"
          >
            {c}
          </span>
        ))}
        {hasGlossary && (
          <Link
            href="/pojmovnik"
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background"
          >
            {t("toGlossary")} <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      {feature && (
        <Link
          href={{ pathname: "/blog/[slug]", params: { slug: feature.slug } }}
          className="group mt-10 grid overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md md:grid-cols-2"
        >
          <CoverArt cover={feature.cover} className="aspect-[16/10] md:aspect-auto md:h-full" />
          <div className="flex flex-col justify-center gap-4 p-8 md:p-10">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-ink-soft">
              <span>{t("featured")}</span>
              <span>·</span>
              <span>{feature.category}</span>
              <span>·</span>
              <span>{t("minRead", { minutes: feature.readingTime })}</span>
            </div>
            <h2 className="font-display text-balance text-2xl font-bold leading-tight text-foreground sm:text-3xl md:text-4xl">
              {feature.title}
            </h2>
            <p className="max-w-md text-base text-ink-soft">{feature.description}</p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
              {t("read")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      )}

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <Link
            key={p.slug}
            href={{ pathname: "/blog/[slug]", params: { slug: p.slug } }}
            className="group overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <CoverArt cover={p.cover} className="aspect-[16/10]" />
            <div className="p-5">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-ink-soft">
                <span>{p.category}</span>
                <span>·</span>
                <span>{t("minRead", { minutes: p.readingTime })}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-snug text-foreground group-hover:underline underline-offset-4 decoration-brand decoration-2">
                {p.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{p.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
