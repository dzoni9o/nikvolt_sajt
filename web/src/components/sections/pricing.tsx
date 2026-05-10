import { Link } from "@/i18n/navigation";
import { ArrowRight, Info } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { pricingRowIds } from "@/lib/content";

export async function Pricing() {
  const t = await getTranslations("Pricing");
  return (
    <section id="pricing" className="container-page py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
            {t("kicker")}
          </p>
          <h2 className="mt-3 font-display text-balance text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl">
            {t("title1")}
            <br />
            <span className="text-ink-soft">{t("title2Lead")}</span>{" "}
            {t("title2Tail")}
          </h2>
          <p className="mt-4 max-w-md text-base text-ink-soft">{t("lead")}</p>
          <Link
            href="#assess"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background hover:-translate-y-0.5 transition-transform"
          >
            {t("cta")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full divide-y divide-border text-left">
            <thead className="bg-paper">
              <tr>
                <th scope="col" className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-ink-soft">
                  {t("tableService")}
                </th>
                <th scope="col" className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-widest text-ink-soft">
                  {t("tablePriceFrom")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pricingRowIds.map((id) => {
                const note = t.has(`rows.${id}.note`)
                  ? t(`rows.${id}.note`)
                  : null;
                return (
                  <tr key={id} className="hover:bg-paper/60">
                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-foreground">
                        {t(`rows.${id}.label`)}
                      </div>
                      {note && (
                        <div className="mt-0.5 text-xs text-ink-soft">{note}</div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right text-sm font-semibold text-foreground tabular-nums">
                      {t(`amounts.${id}`)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex items-start gap-3 border-t border-border bg-paper px-5 py-4 text-xs text-ink-soft">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{t("info")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
