import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getBacklinks, type Collection } from "@/lib/mdx";

const ROUTE: Record<string, "/blog/[slug]" | "/usluge/[slug]" | "/lokacije/[slug]" | "/pojmovnik/[slug]"> = {
  blog: "/blog/[slug]",
  usluge: "/usluge/[slug]",
  lokacije: "/lokacije/[slug]",
  pojmovnik: "/pojmovnik/[slug]",
};

/**
 * "Mentioned in" — the pages whose prose points here.
 *
 * Derived from the actual link graph rather than a curated list, so it cannot
 * go stale, and it is what turns a set of separate pages into something a
 * reader can wander around in: every page offers a way back out into the rest
 * of the site, in both directions.
 */
export async function Backlinks({
  locale,
  collection,
  slug,
}: {
  locale: string;
  collection: Collection;
  slug: string;
}) {
  const links = getBacklinks(locale, collection, slug);
  if (links.length === 0) return null;

  const t = await getTranslations("Backlinks");

  return (
    <section className="container-page mt-16">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
          {t("title")}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {links.map((l) => (
            <li key={`${l.collection}/${l.slug}`}>
              <Link
                href={{ pathname: ROUTE[l.collection], params: { slug: l.slug } }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-paper px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {l.title}
                <ArrowUpRight className="h-3.5 w-3.5 text-ink-soft" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
