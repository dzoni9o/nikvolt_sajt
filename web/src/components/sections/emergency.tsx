import { Phone, AlertTriangle, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { emergencyCardsConfig } from "@/lib/content";
import { site } from "@/lib/site-config";
import { ContactLink } from "@/components/site/contact-link";

export async function Emergency() {
  const t = await getTranslations("Emergency");
  const tCta = await getTranslations("Cta");
  return (
    <section id="emergency" className="relative isolate">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-emergency/[0.04] via-emergency/[0.02] to-transparent"
      />
      <div className="container-page py-20 md:py-24">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emergency/30 bg-emergency-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emergency">
              <AlertTriangle className="h-3.5 w-3.5" /> {t("kicker")}
            </div>
            <h2 className="mt-4 font-display text-balance text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-3 max-w-lg text-base text-ink-soft">
              {t("lead", { city: site.city })}
            </p>
          </div>
          <ContactLink
            channel="phone"
            source="emergency-section"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-emergency px-6 py-3.5 text-base font-semibold text-emergency-foreground shadow-emergency transition-all hover:-translate-y-0.5"
          >
            <Phone className="h-4 w-4" />{" "}
            {tCta("callWithNumber", { phone: site.phoneDisplay })}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </ContactLink>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {emergencyCardsConfig.map((card) => {
            const Icon = card.icon;
            return (
              <ContactLink
                key={card.id}
                channel="phone"
                source="emergency-section"
                className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-emergency/40 hover:shadow-md"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emergency-soft text-emergency">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-foreground">
                      {t(`cards.${card.id}.title`)}
                    </h3>
                    <ArrowRight className="h-4 w-4 shrink-0 text-ink-soft transition-all group-hover:translate-x-0.5 group-hover:text-emergency" />
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">
                    {t(`cards.${card.id}.description`)}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emergency">
                    <Phone className="h-3.5 w-3.5" /> {tCta("callNow")}
                  </span>
                </div>
              </ContactLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
