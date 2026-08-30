import type { Metadata, MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import {
  routing,
  type AppPathname,
  type Locale,
  type StaticAppPathname,
} from "@/i18n/routing";
import type { Translation } from "@/lib/mdx";
import { site } from "@/lib/site-config";

/**
 * Single source of truth for URL building in metadata and the sitemap.
 *
 * Everything goes through next-intl's getPathname() rather than string
 * concatenation, so localized route segments (/sr/usluge vs /en/services) stay
 * correct in canonicals, hreflang and the sitemap without any page having to
 * know about them.
 *
 * hreflang values stay as plain language subtags (sr/en/ru) even though
 * <html lang> is "sr-Latn". The two serve different consumers, and Google
 * documents language plus optional region for hreflang — a script subtag risks
 * the annotation being dropped entirely.
 */

export type SeoHref = Parameters<typeof getPathname>[0]["href"];

export function pathFor(href: SeoHref, locale: string): string {
  return getPathname({ href, locale: locale as Locale });
}

export function urlFor(href: SeoHref, locale: string): string {
  return `${site.url}${pathFor(href, locale)}`;
}

function build(
  locale: string,
  hrefs: Map<string, SeoHref>,
): Metadata["alternates"] {
  const langs = routing.locales.filter((l) => hrefs.has(l));
  const current = hrefs.get(locale);
  const canonical = current ? pathFor(current, locale) : undefined;
  if (langs.length === 0) return { canonical };

  const xDefault = langs.includes(routing.defaultLocale)
    ? routing.defaultLocale
    : langs[0];

  return {
    canonical,
    languages: {
      ...Object.fromEntries(langs.map((l) => [l, pathFor(hrefs.get(l)!, l)])),
      "x-default": pathFor(hrefs.get(xDefault)!, xDefault),
    },
  };
}

/** Canonical + hreflang for a static route that exists in every locale. */
export function alternatesForRoute(
  href: StaticAppPathname,
  locale: string,
): Metadata["alternates"] {
  return build(locale, new Map(routing.locales.map((l) => [l, href])));
}

/**
 * Canonical + hreflang for a content entry whose slug differs per locale.
 *
 * Only the locales in `translations` are declared, so an article that exists
 * in Serbian and English never claims a Russian version.
 */
export function alternatesForEntry(
  route: AppPathname,
  translations: Translation[],
  locale: string,
): Metadata["alternates"] {
  return build(
    locale,
    new Map(
      translations.map((t) => [
        t.locale,
        { pathname: route, params: { slug: t.slug } } as SeoHref,
      ]),
    ),
  );
}

function sitemapRows(
  hrefs: Map<string, SeoHref>,
  options: {
    lastModified?: Date;
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority?: number;
  },
): MetadataRoute.Sitemap {
  const {
    lastModified = new Date(),
    changeFrequency = "monthly",
    priority = 0.5,
  } = options;
  const langs = routing.locales.filter((l) => hrefs.has(l));
  const languages = Object.fromEntries(
    langs.map((l) => [l, urlFor(hrefs.get(l)!, l)]),
  );

  return langs.map((locale) => ({
    url: urlFor(hrefs.get(locale)!, locale),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

/** One sitemap row per locale for a static route. */
export function sitemapForRoute(
  href: StaticAppPathname,
  options: Parameters<typeof sitemapRows>[1] = {},
): MetadataRoute.Sitemap {
  return sitemapRows(new Map(routing.locales.map((l) => [l, href])), options);
}

/** One sitemap row per locale that actually has this entry. */
export function sitemapForEntry(
  route: AppPathname,
  translations: Translation[],
  options: Parameters<typeof sitemapRows>[1] = {},
): MetadataRoute.Sitemap {
  return sitemapRows(
    new Map(
      translations.map((t) => [
        t.locale,
        { pathname: route, params: { slug: t.slug } } as SeoHref,
      ]),
    ),
    options,
  );
}
