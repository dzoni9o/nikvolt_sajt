import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { site } from "@/lib/site-config";
import { routing } from "@/i18n/routing";

const localizedPath = (locale: string, path: string) =>
  `${site.url}/${locale}${path === "/" ? "" : path}`;

const buildAlternates = (path: string) => ({
  languages: Object.fromEntries(
    routing.locales.map((l) => [l, localizedPath(l, path)]),
  ),
});

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const posts = getAllPosts();
  const paths: { path: string; lastModified: Date; priority: number }[] = [
    { path: "/", lastModified: now, priority: 1 },
    { path: "/blog", lastModified: now, priority: 0.8 },
    ...posts.map((p) => ({
      path: `/blog/${p.slug}`,
      lastModified: new Date(p.date),
      priority: 0.6,
    })),
  ];

  return paths.flatMap(({ path, lastModified, priority }) =>
    routing.locales.map((locale) => ({
      url: localizedPath(locale, path),
      lastModified,
      changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
      priority,
      alternates: buildAlternates(path),
    })),
  );
}
