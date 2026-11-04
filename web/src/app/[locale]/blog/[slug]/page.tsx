import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MdxBody } from "@/components/mdx-body";
import { ArrowRight, Phone, Send } from "lucide-react";
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
import { ContactLink } from "@/components/site/contact-link";
import { alternatesForEntry } from "@/lib/seo";
import { JsonLd } from "@/components/site/json-ld";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Backlinks } from "@/components/site/backlinks";
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
      <div className="container-page pt-8">
        <Breadcrumbs
          trail={[
            { name: site.name, href: "/" },
            { name: t("kicker"), href: "/blog" },
            { name: post.title, href: href },
          ]}
        />
      </div>

      <header className="container-page mt-6 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-ink-soft">
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
        <h1 className="mt-3 font-display text-balance text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-pretty text-lg text-ink-soft sm:text-xl">{post.description}</p>
      </header>

      <CoverArt
        cover={post.cover}
        photo={post.photo}
        alt={post.photoAlt}
        sizes="(min-width: 1024px) 60rem, 100vw"
        className="container-page mt-10 aspect-[16/8] !p-0"
      />

      <div className="container-page mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="prose-electric max-w-none">
          <MdxBody source={post.content} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-sm font-semibold text-ink-soft">
              {tSidebar("headline")}
            </div>
            <p className="mt-2 text-sm text-foreground">{tSidebar("lead")}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link href={{ pathname: "/", hash: "assess" }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-3 text-sm font-semibold text-background">
                <Send className="h-4 w-4" /> {tSidebar("send")}
              </Link>
              <ContactLink channel="phone" source="blog-sidebar" className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground">
                <Phone className="h-4 w-4" /> {site.phoneDisplay}
              </ContactLink>
            </div>
          </div>

          {post.tags.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-sm font-semibold text-ink-soft">
                {tSidebar("tags")}
              </div>
              <p className="mt-1.5 text-sm text-ink-soft">
                {post.tags.join(" · ")}
              </p>
            </div>
          )}
        </aside>
      </div>

      <Backlinks locale={locale} collection="blog" slug={post.slug} />

      <section className="container-page mt-20">
        <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
          {t("readNext")}
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {others.map((p) => (
            <Link
              key={p.slug}
              href={{ pathname: "/blog/[slug]", params: { slug: p.slug } }}
              className="group overflow-hidden rounded-3xl border border-border bg-card"
            >
              <CoverArt cover={p.cover} photo={p.photo} sizes="(min-width: 768px) 22rem, 100vw" className="aspect-[16/10]" />
              <div className="p-5">
                <div className="text-xs font-semibold text-ink-soft">{p.category}</div>
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
