import { site } from "@/lib/site-config";
import { urlFor, type SeoHref } from "@/lib/seo";
import type { FaqItem } from "@/lib/mdx";

/**
 * schema.org builders.
 *
 * Everything hangs off one Electrician node addressed by @id, so Google sees a
 * single business with services, articles and FAQs attached, rather than five
 * unrelated blobs. The @type is a constant here on purpose: it used to come
 * from a translation key, which meant the schema type could differ per locale.
 *
 * Nothing in here may assert something the business has not earned. Fake
 * reviews and an invented aggregateRating were removed from this site in an
 * earlier commit; aggregateRating comes back only when real reviews exist.
 */

const BUSINESS_ID = `${site.url}/#business`;
const WEBSITE_ID = `${site.url}/#website`;

type Json = Record<string, unknown>;

/** Reference to the single business node, for use inside other schema objects. */
export const businessRef = { "@id": BUSINESS_ID };

export function localBusiness(opts: {
  locale: string;
  description: string;
  /** Localized municipality names for areaServed. */
  areaServed: string[];
}): Json {
  return {
    "@type": "Electrician",
    "@id": BUSINESS_ID,
    name: site.name,
    description: opts.description,
    url: urlFor("/", opts.locale),
    telephone: site.phoneTel,
    email: site.email,
    image: `${site.url}/icon.png`,
    logo: `${site.url}/icon.png`,
    priceRange: site.priceRange,
    currenciesAccepted: "RSD",
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: "RS",
      ...(site.streetAddress ? { streetAddress: site.streetAddress } : {}),
      ...(site.postalCode ? { postalCode: site.postalCode } : {}),
    },
    ...(site.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: site.geo.lat,
            longitude: site.geo.lng,
          },
        }
      : {}),
    areaServed: opts.areaServed.map((name) => ({ "@type": "City", name })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    ...(site.googleBusinessProfile ? { hasMap: site.googleBusinessProfile } : {}),
    sameAs: [
      site.socials.instagram,
      site.socials.tiktok,
      site.googleBusinessProfile,
    ].filter(Boolean),
  };
}

export function webSite(locale: string): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: urlFor("/", locale),
    name: site.name,
    inLanguage: locale === "sr" ? "sr-Latn" : locale,
    publisher: businessRef,
  };
}

export function service(opts: {
  locale: string;
  name: string;
  description: string;
  href: SeoHref;
  priceFrom?: number;
  areaServed: string[];
}): Json {
  return {
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    serviceType: opts.name,
    url: urlFor(opts.href, opts.locale),
    provider: businessRef,
    areaServed: opts.areaServed.map((name) => ({ "@type": "City", name })),
    ...(opts.priceFrom
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "RSD",
            // A floor, not a fixed price — the site is explicit that the final
            // figure comes from an on-site inspection.
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice: opts.priceFrom,
              priceCurrency: "RSD",
              valueAddedTaxIncluded: true,
            },
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

export function blogPosting(opts: {
  locale: string;
  title: string;
  description: string;
  href: SeoHref;
  datePublished: string;
  keywords: string[];
}): Json {
  const url = urlFor(opts.href, opts.locale);
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: opts.title,
    description: opts.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: opts.datePublished,
    dateModified: opts.datePublished,
    inLanguage: opts.locale === "sr" ? "sr-Latn" : opts.locale,
    author: businessRef,
    publisher: businessRef,
    keywords: opts.keywords.join(", "),
    image: `${url}/opengraph-image`,
  };
}

export function breadcrumbs(
  locale: string,
  trail: { name: string; href: SeoHref }[],
): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: urlFor(step.href, locale),
    })),
  };
}

export function faqPage(items: FaqItem[]): Json | null {
  if (items.length === 0) return null;
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** Wrap one or more nodes into a single @graph document. */
export function graph(nodes: (Json | null | undefined)[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  });
}

/**
 * A glossary entry. DefinedTerm is what tells Google this page answers "what is
 * X" outright, which is also the shape assistants quote from.
 */
export function definedTerm(opts: {
  locale: string;
  name: string;
  description: string;
  href: SeoHref;
}): Json {
  const url = urlFor(opts.href, opts.locale);
  return {
    "@type": "DefinedTerm",
    "@id": `${url}#term`,
    name: opts.name,
    description: opts.description,
    url,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      "@id": `${site.url}/#pojmovnik`,
      name: "nik volt — pojmovnik",
      url: urlFor("/pojmovnik", opts.locale),
    },
  };
}
