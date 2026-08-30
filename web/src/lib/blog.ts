import {
  getEntries,
  getEntry,
  getTranslations,
  staticParamsFor,
  type BlogEntry,
  type Translation,
} from "@/lib/mdx";

/**
 * Thin locale-aware wrapper over the generic MDX loader. Kept so blog pages
 * read naturally; all the real work (frontmatter validation, caching, which
 * locales a post exists in) lives in src/lib/mdx.ts.
 */

export type BlogPost = BlogEntry;

export function getAllPosts(locale: string): BlogPost[] {
  return getEntries("blog", locale);
}

export function getPostBySlug(locale: string, slug: string): BlogPost | null {
  return getEntry("blog", locale, slug);
}

export function getCategories(locale: string): string[] {
  return Array.from(new Set(getAllPosts(locale).map((p) => p.category)));
}

export function getPostLocales(key: string): Translation[] {
  return getTranslations("blog", key);
}

export function getPostParams(): { locale: string; slug: string }[] {
  return staticParamsFor("blog");
}
