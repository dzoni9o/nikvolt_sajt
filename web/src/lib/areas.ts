import { getEntries } from "@/lib/mdx";
import { site } from "@/lib/site-config";

/**
 * Municipality names for schema.org areaServed, in the current locale.
 *
 * Sourced from the location pages so the coverage claimed in structured data
 * and the coverage the site actually has a page for can never drift apart.
 * Falls back to the static list while location pages are still being written.
 */
export function areaNames(locale: string): string[] {
  const entries = getEntries("lokacije", locale);
  if (entries.length === 0) return site.coverage;
  return [site.city, ...entries.map((e) => e.area)];
}
