import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { servicesConfig } from "@/lib/content";
import { getEntryByKey } from "@/lib/mdx";

/**
 * Šest redova umesto deset kartica.
 *
 * Ovo je bila najduža sekcija na naslovnoj — 2.472 px na telefonu — jer je
 * deset kartica u mreži koja ide do pet kolona na telefonu postaje deset
 * blokova jedan ispod drugog, svaki sa ikonicom u kvadratiću i opisom.
 * Ostalih pet usluga nisu nestale: stoje na /usluge, u podnožju i u tekstu.
 */
const NA_NASLOVNOJ = [
  "diagnostics",
  "panels",
  "new-installation",
  "outlet-replacement",
  "lighting",
  "grounding",
] as const;

export async function Services() {
  const t = await getTranslations("Services");
  const f = await getFormatter();
  const locale = await getLocale();

  const rows = NA_NASLOVNOJ.map((id) => ({
    id,
    cfg: servicesConfig.find((s) => s.id === id),
    entry: getEntryByKey("usluge", locale, id),
  })).filter((r) => r.entry);

  return (
    <section id="services" className="border-b border-border">
      <div className="container-page py-14 md:py-16">
        <h2 className="font-display text-balance text-2xl font-bold text-foreground sm:text-3xl">
          {t("title")}
        </h2>

        <ul className="mt-7 max-w-2xl">
          {rows.map(({ id, cfg, entry }) => (
            <li key={id} className="border-b border-border last:border-0">
              <Link
                href={{ pathname: "/usluge/[slug]", params: { slug: entry!.slug } }}
                className="flex min-h-[52px] items-center gap-3 py-1 text-foreground"
              >
                <span className="flex-1 text-base font-semibold">
                  {t(`items.${id}.title`)}
                </span>
                {cfg?.fromAmount !== undefined ? (
                  <span className="text-sm text-ink-soft tabular-nums">
                    {t("fromPrice", { amount: f.number(cfg.fromAmount) })}
                  </span>
                ) : null}
                <ChevronRight className="h-4 w-4 shrink-0 text-ink-soft" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/usluge"
          className="mt-6 inline-block text-sm font-semibold text-foreground underline decoration-brand decoration-2 underline-offset-4"
        >
          {t("allServices", { count: servicesConfig.length })}
        </Link>
      </div>
    </section>
  );
}
