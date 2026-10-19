import { getEntryByKey, localesWith } from "@/lib/mdx";
import { navigation, type NavHref, type NavItemId } from "@/lib/site-config";

/**
 * Navigation for one locale.
 *
 * Two things happen here, and both need the locale, which is why the nav table
 * in site-config stays declarative:
 *
 *  - The glossary item is dropped where no terms exist. A menu entry leading
 *    to a 404 is worse than a shorter menu.
 *  - Entries that name a service by key are resolved to that locale's slug,
 *    so /sr gets /usluge/hitne-intervencije and /en gets
 *    /services/emergency-electrician. An entry whose service is missing in
 *    this locale is dropped for the same reason as the glossary.
 */
export function navigationFor(
  locale: string,
): { id: NavItemId; href: NavHref }[] {
  const hasGlossary = localesWith("pojmovnik").includes(locale);

  return navigation
    .filter((item) => item.id !== "glossary" || hasGlossary)
    .map((item) => {
      if (!("serviceKey" in item)) return item;

      const entry = getEntryByKey("usluge", locale, item.serviceKey);
      if (!entry) return null;

      return {
        id: item.id,
        href: {
          pathname: "/usluge/[slug]" as const,
          params: { slug: entry.slug },
        },
      };
    })
    .filter((item): item is { id: NavItemId; href: NavHref } => item !== null);
}
