import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getAllPosts } from "@/lib/blog";
import { CoverArt } from "@/components/blog/cover-art";

export async function BlogTeaser() {
  const t = await getTranslations("BlogTeaser");
  const posts = getAllPosts().slice(0, 3);
  return (
    <section id="blog-teaser" className="container-page py-20 md:py-28">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
            {t("kicker")}
          </p>
          <h2 className="mt-3 font-display text-balance text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
        </div>
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:underline underline-offset-4 decoration-brand decoration-2">
          {t("all")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {posts.map((p) => (
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
                <span>{t("readingTime", { minutes: p.readingTime })}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-snug text-foreground group-hover:underline underline-offset-4 decoration-brand decoration-2">
                {p.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{p.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
