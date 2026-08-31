import type { MetadataRoute } from "next";
import { getAllKeys, getEntries, getTranslations } from "@/lib/mdx";
import { routing } from "@/i18n/routing";
import { sitemapForEntry, sitemapForRoute } from "@/lib/seo";

/**
 * Every URL is produced from next-intl's pathname table and from files that
 * actually exist, so localized segments stay correct and no entry is listed in
 * a locale it has not been translated into.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Newest post date drives lastModified for the blog index.
  const latestPost = routing.locales
    .flatMap((l) => getEntries("blog", l))
    .map((p) => p.date)
    .sort()
    .at(-1);

  const staticRoutes: MetadataRoute.Sitemap = [
    ...sitemapForRoute("/", { lastModified: now, changeFrequency: "weekly", priority: 1 }),
    ...sitemapForRoute("/usluge", { changeFrequency: "monthly", priority: 0.9 }),
    ...sitemapForRoute("/lokacije", { changeFrequency: "monthly", priority: 0.8 }),
    ...sitemapForRoute("/blog", {
      lastModified: latestPost ? new Date(latestPost) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
    ...sitemapForRoute("/pojmovnik", { changeFrequency: "monthly", priority: 0.7 }),
    ...sitemapForRoute("/alati", { changeFrequency: "monthly", priority: 0.5 }),
    ...sitemapForRoute("/privatnost", { changeFrequency: "yearly", priority: 0.1 }),
    ...sitemapForRoute("/uslovi", { changeFrequency: "yearly", priority: 0.1 }),
  ];

  const services = getAllKeys("usluge").flatMap((key) =>
    sitemapForEntry("/usluge/[slug]", getTranslations("usluge", key), {
      changeFrequency: "monthly",
      priority: 0.9,
    }),
  );

  const locations = getAllKeys("lokacije").flatMap((key) =>
    sitemapForEntry("/lokacije/[slug]", getTranslations("lokacije", key), {
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  const terms = getAllKeys("pojmovnik").flatMap((key) =>
    sitemapForEntry("/pojmovnik/[slug]", getTranslations("pojmovnik", key), {
      changeFrequency: "yearly",
      priority: 0.6,
    }),
  );

  const posts = getAllKeys("blog").flatMap((key) => {
    const translations = getTranslations("blog", key);
    const dates = translations
      .map((t) => getEntries("blog", t.locale).find((p) => p.slug === t.slug)?.date)
      .filter((d): d is string => Boolean(d))
      .sort();
    return sitemapForEntry("/blog/[slug]", translations, {
      lastModified: dates.at(-1) ? new Date(dates.at(-1)!) : now,
      changeFrequency: "yearly",
      priority: 0.6,
    });
  });

  return [...staticRoutes, ...services, ...locations, ...terms, ...posts];
}
