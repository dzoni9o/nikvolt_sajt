import { defineRouting } from "next-intl/routing";

/**
 * The keys of `pathnames` are internal route ids that match the file system
 * under src/app/[locale]/. The values are what visitors and crawlers actually
 * see. Keeping them separate means a Russian visitor gets /ru/uslugi/... rather
 * than a Serbian slug, and every canonical, hreflang and sitemap URL is derived
 * from this one table via getPathname() (see src/lib/seo.ts).
 */
export const pathnames = {
  "/": "/",

  // Blog slugs stay identical across locales: the slug is part of the article's
  // identity, and per-locale slugs would fragment inbound links for no gain.
  "/blog": "/blog",
  "/blog/[slug]": "/blog/[slug]",

  "/alati": {
    sr: "/alati",
    en: "/tools",
    ru: "/instrumenty",
  },
  "/usluge": {
    sr: "/usluge",
    en: "/services",
    ru: "/uslugi",
  },
  "/usluge/[slug]": {
    sr: "/usluge/[slug]",
    en: "/services/[slug]",
    ru: "/uslugi/[slug]",
  },
  "/lokacije": {
    sr: "/elektricar",
    en: "/electrician",
    ru: "/elektrik",
  },
  "/lokacije/[slug]": {
    sr: "/elektricar/[slug]",
    en: "/electrician/[slug]",
    ru: "/elektrik/[slug]",
  },
  "/privatnost": {
    sr: "/privatnost",
    en: "/privacy",
    ru: "/konfidencialnost",
  },
  "/uslovi": {
    sr: "/uslovi",
    en: "/terms",
    ru: "/usloviya",
  },
} as const;

export const routing = defineRouting({
  locales: ["sr", "en", "ru"] as const,
  defaultLocale: "sr",
  localePrefix: "always",
  localeDetection: true,
  pathnames,
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof pathnames;

/** Routes with no dynamic segment — usable as an href without params. */
export type StaticAppPathname = Exclude<AppPathname, `${string}[${string}`>;

/**
 * BCP-47 tag for <html lang>. Serbian content is locked to Latin script, and
 * "sr-Latn" is what tells browsers and screen readers so. This deliberately
 * differs from the hreflang values, which stay plain "sr" — see src/lib/seo.ts.
 */
export const htmlLangFor = (locale: string) =>
  locale === "sr" ? "sr-Latn" : locale;

export const ogLocaleFor = (locale: string) => {
  if (locale === "sr") return "sr_RS";
  if (locale === "ru") return "ru_RU";
  return "en_US";
};
