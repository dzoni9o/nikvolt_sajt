import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { routing } from "@/i18n/routing";

/**
 * Locale-aware MDX loader shared by the blog, service pages, location pages
 * and the legal pages.
 *
 * The directory layout is src/content/<collection>/<locale>/<slug>.mdx. The
 * per-locale directory is the whole point: the previous flat layout meant one
 * English article was served byte-identically at /sr, /en and /ru while the
 * pages cross-declared hreflang, telling Google three translations existed
 * where there was one. Here a translation exists only if its file exists, and
 * getTranslations() is what every hreflang and sitemap entry is built from.
 */

const CONTENT_ROOT = path.join(process.cwd(), "src", "content");

const baseFrontmatter = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  /**
   * The URL segment, localized. Serbian readers search Serbian words, so the
   * Serbian version of an article is "zasto-fid-iskace" while the English one
   * is "why-rcd-trips" — the slug is a ranking signal and translating it is the
   * whole point.
   */
  slug: z.string().regex(/^[a-z0-9-]+$/, "slug must be kebab-case"),
  /**
   * Stable, locale-independent id tying translations of the same entry
   * together. Because slugs differ per locale, this is the only thing that can
   * answer "which locales is this available in" — and hreflang depends on
   * exactly that answer.
   */
  key: z.string().regex(/^[a-z0-9-]+$/, "key must be kebab-case"),
});

const blogFrontmatter = baseFrontmatter.extend({
  category: z.string().min(1),
  readingTime: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  cover: z.string().min(1),
  tags: z.array(z.string()).default([]),
  /** Internal route id of the service this article should funnel readers to. */
  service: z.string().optional(),
});

const faqItem = z.object({ q: z.string().min(1), a: z.string().min(1) });

const serviceFrontmatter = baseFrontmatter.extend({
  h1: z.string().min(1),
  priceFrom: z.number().int().positive().optional(),
  priceNote: z.string().optional(),
  faq: z.array(faqItem).default([]),
  relatedLocations: z.array(z.string()).default([]),
  relatedPosts: z.array(z.string()).default([]),
});

const locationFrontmatter = baseFrontmatter.extend({
  /** Display name of the municipality, already inflected for the locale. */
  area: z.string().min(1),
  h1: z.string().min(1),
  /** Approximate travel time from base, shown as a concrete promise. */
  responseTime: z.string().min(1),
  faq: z.array(faqItem).default([]),
  featuredServices: z.array(z.string()).default([]),
});

const legalFrontmatter = baseFrontmatter.extend({
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "updated must be YYYY-MM-DD"),
});

const schemas = {
  blog: blogFrontmatter,
  usluge: serviceFrontmatter,
  lokacije: locationFrontmatter,
  pravno: legalFrontmatter,
} as const;

export type Collection = keyof typeof schemas;

export type FrontmatterOf<C extends Collection> = z.infer<(typeof schemas)[C]>;
export type Entry<C extends Collection> = FrontmatterOf<C> & {
  content: string;
  locale: string;
};

export type BlogEntry = Entry<"blog">;
export type ServiceEntry = Entry<"usluge">;
export type LocationEntry = Entry<"lokacije">;
export type LegalEntry = Entry<"pravno">;

export type FaqItem = z.infer<typeof faqItem>;

// Content never changes within a build, and these are read from
// generateStaticParams, generateMetadata, the page body and the sitemap — so
// without a cache the same files get parsed dozens of times per build.
const cache = new Map<string, unknown>();

function readCollection<C extends Collection>(
  collection: C,
  locale: string,
): Entry<C>[] {
  const key = `${collection}:${locale}`;
  const cached = cache.get(key);
  if (cached) return cached as Entry<C>[];

  const dir = path.join(CONTENT_ROOT, collection, locale);
  if (!fs.existsSync(dir)) {
    cache.set(key, []);
    return [];
  }

  const schema = schemas[collection];
  const entries = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        // Fail the build rather than silently shipping a broken page.
        throw new Error(
          `Invalid frontmatter in src/content/${collection}/${locale}/${file}:\n` +
            parsed.error.issues
              .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
              .join("\n"),
        );
      }
      const expectedSlug = file.replace(/\.mdx$/, "");
      if (parsed.data.slug !== expectedSlug) {
        throw new Error(
          `Slug mismatch in src/content/${collection}/${locale}/${file}: ` +
            `frontmatter says "${parsed.data.slug}" but the filename says "${expectedSlug}". ` +
            `They must match so URLs stay stable across locales.`,
        );
      }
      return { ...parsed.data, content, locale } as unknown as Entry<C>;
    });

  cache.set(key, entries);
  return entries;
}

/** All entries of a collection in one locale. Blog entries come back newest first. */
export function getEntries<C extends Collection>(
  collection: C,
  locale: string,
): Entry<C>[] {
  const entries = [...readCollection(collection, locale)];
  if (collection === "blog") {
    return (entries as unknown as BlogEntry[])
      .sort((a, b) => b.date.localeCompare(a.date)) as unknown as Entry<C>[];
  }
  return entries.sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getEntry<C extends Collection>(
  collection: C,
  locale: string,
  slug: string,
): Entry<C> | null {
  return readCollection(collection, locale).find((e) => e.slug === slug) ?? null;
}

export function getEntryByKey<C extends Collection>(
  collection: C,
  locale: string,
  key: string,
): Entry<C> | null {
  return readCollection(collection, locale).find((e) => e.key === key) ?? null;
}

export type Translation = { locale: string; slug: string };

/**
 * Every locale this entry actually exists in, with that locale's slug.
 *
 * This is what hreflang and the sitemap are built from, so the site never
 * advertises a translation it does not have — and, because slugs are
 * localized, it is also the only way to point /en/blog/why-rcd-trips at
 * /sr/blog/zasto-fid-iskace as its Serbian counterpart.
 */
export function getTranslations(
  collection: Collection,
  key: string,
): Translation[] {
  return routing.locales.flatMap((locale) => {
    const entry = readCollection(collection, locale).find((e) => e.key === key);
    return entry ? [{ locale, slug: entry.slug }] : [];
  });
}

/** Every translation key present in at least one locale. */
export function getAllKeys(collection: Collection): string[] {
  const keys = new Set<string>();
  for (const locale of routing.locales) {
    for (const entry of readCollection(collection, locale)) keys.add(entry.key);
  }
  return [...keys].sort();
}

/** { locale, slug } pairs for generateStaticParams — only real files. */
export function staticParamsFor(collection: Collection): {
  locale: string;
  slug: string;
}[] {
  return routing.locales.flatMap((locale) =>
    readCollection(collection, locale).map((e) => ({ locale, slug: e.slug })),
  );
}

/**
 * slug-in-any-locale → { locale: slug-in-that-locale }, per dynamic route.
 *
 * The locale switcher runs on the client and needs this: because slugs are
 * localized, switching to English on /sr/blog/zasto-fid-iskace has to land on
 * /en/blog/why-rcd-trips, not on a 404 with the Serbian slug. The map is built
 * on the server and handed down as a prop, so no content ships to the browser.
 */
export type SlugMap = Record<string, Record<string, Record<string, string>>>;

const ROUTE_FOR_COLLECTION: Partial<Record<Collection, string>> = {
  blog: "/blog/[slug]",
  usluge: "/usluge/[slug]",
  lokacije: "/lokacije/[slug]",
};

export function buildSlugMap(): SlugMap {
  const map: SlugMap = {};
  for (const [collection, route] of Object.entries(ROUTE_FOR_COLLECTION)) {
    const byRoute: Record<string, Record<string, string>> = {};
    for (const key of getAllKeys(collection as Collection)) {
      const translations = getTranslations(collection as Collection, key);
      const byLocale = Object.fromEntries(
        translations.map((t) => [t.locale, t.slug]),
      );
      // Every locale's slug is a valid entry point into the same row.
      for (const t of translations) byRoute[t.slug] = byLocale;
    }
    map[route] = byRoute;
  }
  return map;
}
