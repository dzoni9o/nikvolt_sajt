import { Phone, ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { emergencyCardsConfig } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import { getEntryByKey } from "@/lib/mdx";
import { site } from "@/lib/site-config";
import { ContactLink } from "@/components/site/contact-link";

/**
 * Šest redova umesto šest kartica.
 *
 * Svaka kartica je ranije nosila ikonicu u obojenom kvadratiću, naslov,
 * opis, strelicu i sitno „Pozovi odmah" — pa je sekcija bila 1.493 px na
 * telefonu za šest stavki. Sada je red: tačka, ime kvara, i reč o tome da li
 * se čeka jutro. Isto mesto na ekranu nosi tri puta više.
 *
 * Crvena tačka stoji samo uz ono što stvarno gori. Kad je crveno svuda, ništa
 * nije hitno.
 */
const ODMAH = new Set(["sparking", "burning-smell", "hot-panel", "shock"]);

export async function Emergency({ locale }: { locale: string }) {
  const t = await getTranslations("Emergency");
  const tCta = await getTranslations("Cta");
  const emergencyPage = getEntryByKey("usluge", locale, "emergency-callout");

  return (
    <section id="emergency" className="border-b border-border">
      <div className="container-page py-14 md:py-16">
        <h2 className="font-display text-balance text-2xl font-bold text-foreground sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-2 max-w-lg text-base text-ink-soft">
          {t("lead", { city: site.city })}
        </p>

        <ul className="mt-7 max-w-2xl">
          {emergencyCardsConfig.map((card) => {
            const odmah = ODMAH.has(card.id);
            return (
              <li key={card.id} className="border-b border-border last:border-0">
                <ContactLink
                  channel="phone"
                  source="emergency-section"
                  className="flex min-h-[52px] items-center gap-3 py-1 text-foreground"
                >
                  <span
                    aria-hidden
                    className={`h-2 w-2 shrink-0 rounded-full ${odmah ? "bg-emergency" : "bg-border"}`}
                  />
                  <span className="flex-1 text-base font-semibold">
                    {t(`cards.${card.id}.title`)}
                  </span>
                  {odmah ? (
                    <span className="text-sm font-bold text-emergency">
                      {tCta("callNow")}
                    </span>
                  ) : (
                    <ChevronRight className="h-4 w-4 text-ink-soft" aria-hidden />
                  )}
                </ContactLink>
              </li>
            );
          })}
        </ul>

        <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <ContactLink
            channel="phone"
            source="emergency-section"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emergency px-6 py-3.5 text-base font-semibold text-emergency-foreground"
          >
            <Phone className="h-4 w-4" />
            {tCta("callWithNumber", { phone: site.phoneDisplay })}
          </ContactLink>
          {/* Za onoga kome se ne žuri: cela stranica objašnjava šta je stvarno
              hitno, a šta bezbedno čeka jutro. */}
          {emergencyPage ? (
            <Link
              href={{ pathname: "/usluge/[slug]", params: { slug: emergencyPage.slug } }}
              className="text-sm font-semibold text-foreground underline decoration-brand decoration-2 underline-offset-4"
            >
              {t("more")}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
