import { Star } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { reviewsConfig } from "@/lib/content";
import { site } from "@/lib/site-config";

export async function Reviews() {
  const t = await getTranslations("Reviews");
  return (
    <section id="reviews" className="container-page py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
            {t("kicker")}
          </p>
          <h2 className="mt-3 font-display text-balance text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl">
            {t("title1")}
            <br /> {t("title2", { city: site.city })}
          </h2>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-brand text-brand" />
              ))}
            </div>
            <p className="text-sm font-semibold text-foreground">{t("rating")}</p>
            <span className="text-sm text-ink-soft">{t("ratingSource")}</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {reviewsConfig.map((r, i) => (
            <figure
              key={r.id}
              className="break-inside-avoid rounded-2xl border border-border bg-card p-6 shadow-sm"
              style={{ transform: i % 2 === 0 ? "translateY(0)" : "translateY(28px)" }}
            >
              <div className="flex">
                {Array.from({ length: 5 }).map((_, n) => (
                  <Star key={n} className="h-4 w-4 fill-brand text-brand" />
                ))}
              </div>
              <blockquote className="mt-3 text-balance text-base leading-relaxed text-foreground">
                &ldquo;{t(`items.${r.id}`)}&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">
                  {r.author.split(" ").map((s) => s[0]).join("")}
                </span>
                <div>
                  <div className="text-sm font-semibold text-foreground">{r.author}</div>
                  {r.source && (
                    <div className="text-xs text-ink-soft">
                      {t("via", { source: r.source })}
                    </div>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
