import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx-components";
import { ArrowLeft, ArrowRight, Phone, Send } from "lucide-react";
import { hasLocale } from "next-intl";
import {
  getFormatter,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { getAllPosts, getPostBySlug, getPostParams, getPostLocales } from "@/lib/blog";
import { CoverArt } from "@/components/blog/cover-art";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site-config";
import { alternatesForEntry } from "@/lib/seo";
import { JsonLd } from "@/components/site/json-ld";
import { blogPosting, breadcrumbs, graph } from "@/lib/schema";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  // Only real files: a post that has no Russian translation gets no /ru URL,
  // rather than a Russian URL serving Serbian prose.
  return getPostParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const post = getPostBySlug(locale, slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: alternatesForEntry(
      "/blog/[slug]",
      getPostLocales(post.key),
      locale,
    ),
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getPostBySlug(locale, slug);
  if (!post) notFound();

  const t = await getTranslations("Blog");
  const tSidebar = await getTranslations("Blog.sidebar");
  const f = await getFormatter();

  const others = getAllPosts(locale)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const href = { pathname: "/blog/[slug]" as const, params: { slug: post.slug } };
  const data = graph([
    blogPosting({
      locale,
      title: post.title,
      description: post.description,
      href,
      datePublished: post.date,
      keywords: post.tags,
    }),
    breadcrumbs(locale, [
      { name: site.name, href: "/" },
      { name: t("kicker"), href: "/blog" },
      { name: post.title, href },
    ]),
  ]);

  return (
    <article className="pb-16">
      <JsonLd data={data} />
      <div className="container-page pt-10">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {t("allArticles")}
        </Link>
      </div>

      <header className="container-page mt-6 max-w-3xl">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-ink-soft">
          <span>{post.category}</span>
          <span>·</span>
          <span>{t("readingTime", { minutes: post.readingTime })}</span>
          <span>·</span>
          <time dateTime={post.date}>
            {f.dateTime(new Date(post.date), {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>
        <h1 className="mt-3 font-display text-balance text-4xl font-bold leading-tight tracking-[-0.02em] text-foreground sm:text-5xl md:text-6xl">
          {post.title}
        </h1>
        <p className="mt-4 text-pretty text-lg text-ink-soft sm:text-xl">{post.description}</p>
      </header>

      <CoverArt cover={post.cover} className="container-page mt-10 aspect-[16/8] !p-0" />

      <div className="container-page mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="prose-electric max-w-none">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
              {tSidebar("headline")}
            </div>
            <p className="mt-2 text-sm text-foreground">{tSidebar("lead")}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link href={{ pathname: "/", hash: "assess" }} className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background">
                <Send className="h-4 w-4" /> {tSidebar("send")}
              </Link>
              <a href={`tel:${site.phoneTel}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-semibold text-foreground">
                <Phone className="h-4 w-4" /> {site.phoneDisplay}
              </a>
            </div>
          </div>

          {post.tags.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
                {tSidebar("tags")}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {post.tags.map((tg) => (
                  <span key={tg} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">{tg}</span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <section className="container-page mt-20">
        <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
          {t("readNext")}
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {others.map((p) => (
            <Link
              key={p.slug}
              href={{ pathname: "/blog/[slug]", params: { slug: p.slug } }}
              className="group overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <CoverArt cover={p.cover} className="aspect-[16/10]" />
              <div className="p-5">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-ink-soft">{p.category}</div>
                <h3 className="mt-2 text-base font-semibold leading-snug text-foreground">{p.title}</h3>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  {t("read")} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
