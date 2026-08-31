import { localesWith } from "@/lib/mdx";
import { navigation } from "@/lib/site-config";

/**
 * Navigation for one locale.
 *
 * The glossary is Serbian-only, so on /en and /ru the item is dropped rather
 * than pointing at a route with no content behind it. Menu entries that lead to
 * a 404 are worse than a shorter menu.
 */
export function navigationFor(locale: string) {
  const hasGlossary = localesWith("pojmovnik").includes(locale);
  return navigation.filter((item) => item.id !== "glossary" || hasGlossary);
}
