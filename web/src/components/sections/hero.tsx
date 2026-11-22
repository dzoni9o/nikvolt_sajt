import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Phone, MessageCircle, Camera } from "lucide-react";
import { site, assessHref } from "@/lib/site-config";
import { ContactLink } from "@/components/site/contact-link";
import { Galerija } from "@/components/site/galerija";
import type { PhotoName } from "@/lib/photos";

/**
 * Hero.
 *
 * Ranije je ovde stajala maketa aplikacije sa izmišljenom cenom, naslov je
 * govorio o cenkanju („bez nagađanja oko cene"), uvod je bio o slanju slika, a
 * prvo dugme je vodilo na formu od deset polja — koja je za tri meseca donela
 * dva do pet zahteva. Sada fotografije vode, naslov kaže šta i gde, a prvo
 * dugme je telefon.
 *
 * Posle toga je ovde stajala jedna jedina slika, ista na svim širinama: na
 * telefonu punom širinom, na monitoru pravougaonik od 34 rem pored naslova.
 * Sada je to galerija — na telefonu se prevlači prstom, na monitoru je mreža
 * manjih sličica, pa se odjednom vidi šest poslova umesto jednog.
 *
 * Galerija je u DOM-u prva, pa je na telefonu i prva na ekranu; na širokom
 * ekranu je `lg:order-2` vraća desno, gde joj je mesto uz tekst.
 */

/**
 * Šest poslova koji zajedno pokrivaju ono čime se Nikola bavi: tabla, nova
 * instalacija pre zatvaranja zida, rasveta u stanu, spoljna rasveta i dva
 * lokala. Sve su položene fotografije, pa ih kadar 4:3 ne seče ružno.
 *
 * Nijedna se ne ponavlja u sekciji „Kako to izgleda" niže na istoj stranici —
 * ta sekcija ima svojih šest. Dve slike iste prostorije (`dnevna-soba-rasveta`
 * i `linijska-rasveta`) namerno su razdvojene, da naslovna ne izgleda kao da
 * postoji samo jedan posao.
 */
const SLIKE: PhotoName[] = [
  "tabla-dva-reda",
  "zlebovi-i-kutije",
  "dnevna-soba-rasveta",
  "led-traka-dvoriste",
  "kafic-rasveta",
  "profesionalna-kuhinja",
];
export async function Hero() {
  const t = await getTranslations("Hero");
  const tCta = await getTranslations("Cta");

  return (
    <section className="border-b border-border">
      <div className="container-page grid items-center gap-8 pb-12 pt-6 lg:grid-cols-[1fr_1fr] lg:gap-14 lg:pb-20 lg:pt-14">
        <Galerija
          imena={SLIKE}
          varijanta="traka"
          prioritetPrve
          className="lg:order-2"
        />

        <div className="lg:order-1">
          <h1 className="font-display text-balance text-[2rem] font-bold leading-[1.1] text-foreground sm:text-4xl lg:text-5xl">
            {t("h1Lead", { city: site.city })}
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-lg text-ink-soft">
            {t("lead")}
          </p>

          <div className="mt-7 flex flex-col gap-3">
            {/* Telefon je prvo dugme, i jedino žuto na ovom ekranu. */}
            <ContactLink
              channel="phone"
              source="hero"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-4 text-lg font-bold text-brand-foreground hover:brightness-95"
            >
              <Phone className="h-5 w-5" />
              {site.phoneDisplay}
            </ContactLink>
            {/* Slanje slike je pravo dugme, ne potpisani link u dnu. */}
            <Link
              href={assessHref}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-6 py-4 text-base font-semibold text-background hover:opacity-90"
            >
              <Camera className="h-5 w-5" />
              {tCta("sendProblem")}
            </Link>
            <ContactLink
              channel="whatsapp"
              source="hero"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-4 text-base font-semibold text-foreground hover:bg-muted"
            >
              <MessageCircle className="h-5 w-5" />
              {tCta("whatsapp")}
            </ContactLink>
          </div>

          {/* Četiri tvrdnje, svaka u svom redu. Ranije su stajale kao jedan
              sivi red razdvojen tačkama, pa se nijedna nije videla. */}
          <ul className="mt-6 space-y-2">
            {[
              t("claimLicensed"),
              t("claimYears", { years: site.yearsExperience }),
              t("claimJobs", { jobs: site.jobsCompleted }),
              t("claimResponse", { responseTime: t("responseTime") }),
            ].map((tvrdnja) => (
              <li key={tvrdnja} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-foreground"
                />
                <span className="text-base font-semibold text-foreground">
                  {tvrdnja}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
