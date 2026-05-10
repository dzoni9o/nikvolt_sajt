import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts, getCategories } from "@/lib/blog";
import { CoverArt } from "@/components/blog/cover-art";
import { ArrowRight } from "lucide-react";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "DIY tips & electrical education",
  description:
    "Practical, no-nonsense articles on common faults, safe DIY checks, and recognizing dangerous installations.",
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const categories = getCategories();
  const [feature, ...rest] = posts;

  return (
    <div className="container-page py-16 md:py-24">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">Blog</p>
        <h1 className="mt-3 font-display text-balance text-4xl font-bold tracking-[-0.02em] text-foreground sm:text-5xl md:text-6xl">
          Things every {site.city} apartment should know about electricity.
        </h1>
        <p className="mt-5 text-base text-ink-soft sm:text-lg">
          Diagnostics, safe DIY, and the warning signs we see every week. Written
          to be skim-readable while standing in front of a panel.
        </p>
      </header>

      <div className="mt-10 flex flex-wrap gap-2">
        <span className="rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background">All</span>
        {categories.map((c) => (
          <span key={c} className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-ink-soft">{c}</span>
        ))}
      </div>

      {feature && (
        <Link
          href={`/blog/${feature.slug}`}
          className="group mt-10 grid overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md md:grid-cols-2"
        >
          <CoverArt cover={feature.cover} className="aspect-[16/10] md:aspect-auto md:h-full" />
          <div className="flex flex-col justify-center gap-4 p-8 md:p-10">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-ink-soft">
              <span>Featured</span>
              <span>·</span>
              <span>{feature.category}</span>
              <span>·</span>
              <span>{feature.readingTime} min</span>
            </div>
            <h2 className="font-display text-balance text-2xl font-bold leading-tight text-foreground sm:text-3xl md:text-4xl">
              {feature.title}
            </h2>
            <p className="max-w-md text-base text-ink-soft">{feature.description}</p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">Read <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
          </div>
        </Link>
      )}

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <CoverArt cover={p.cover} className="aspect-[16/10]" />
            <div className="p-5">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-ink-soft">
                <span>{p.category}</span>
                <span>·</span>
                <span>{p.readingTime} min</span>
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
