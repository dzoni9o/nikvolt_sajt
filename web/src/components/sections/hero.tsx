import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Phone, MessageCircle } from "lucide-react";
import { site, assessHref } from "@/lib/site-config";
import { ContactLink } from "@/components/site/contact-link";
// Statički uvoz, a ne putanja u stringu: odatle Next sam zna širinu, visinu i
// blurDataURL, pa nema skoka u rasporedu dok se slika učitava.
//
// Položena, a ne uspravna: uspravna tabla preko cele širine telefona zauzme
// 930 px i gurne naslov i dugme s telefonom ispod preloma. Poruka je ista —
// nova tabla sa automatskim osiguračima i FID sklopkom — samo u pravom obliku.
import tablaNova from "../../../public/photos/tabla-dva-reda.jpg";

/**
 * Hero.
 *
 * Ranije je ovde stajala maketa aplikacije sa izmišljenom cenom, naslov je
 * govorio o cenkanju („bez nagađanja oko cene"), uvod je bio o slanju slika, a
 * prvo dugme je vodilo na formu od deset polja — koja je za tri meseca donela
 * dva do pet zahteva. Sada fotografija vodi, naslov kaže šta i gde, a prvo
 * dugme je telefon.
 *
 * Slika je u DOM-u prva, pa je na telefonu i prva na ekranu; na širokom ekranu
 * je `lg:order-2` vraća desno, gde joj je mesto uz tekst.
 */
export async function Hero() {
  const t = await getTranslations("Hero");
  const tCta = await getTranslations("Cta");

  return (
    <section className="border-b border-border">
      <div className="container-page grid items-center gap-8 pb-12 pt-6 lg:grid-cols-[1fr_1fr] lg:gap-14 lg:pb-20 lg:pt-14">
        <figure className="m-0 lg:order-2">
          <div className="overflow-hidden rounded-xl border border-border">
            <Image
              src={tablaNova}
              alt={t("photoAlt")}
              placeholder="blur"
              priority
              sizes="(min-width: 1024px) 34rem, 100vw"
              className="h-auto w-full object-cover"
            />
          </div>
          <figcaption className="mt-2 text-sm text-ink-soft">
            {t("photoCaption")}
          </figcaption>
        </figure>

        <div className="lg:order-1">
          <h1 className="font-display text-balance text-[2rem] font-bold leading-[1.1] text-foreground sm:text-4xl lg:text-5xl">
            {t("h1Lead", { city: site.city })}
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-lg text-ink-soft">
            {t("lead")}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {/* Telefon je prvo dugme, i jedino žuto na ovom ekranu. */}
            <ContactLink
              channel="phone"
              source="hero"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-4 text-lg font-bold text-brand-foreground hover:brightness-95"
            >
              <Phone className="h-5 w-5" />
              {site.phoneDisplay}
            </ContactLink>
            <ContactLink
              channel="whatsapp"
              source="hero"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-4 text-base font-semibold text-foreground hover:bg-muted"
            >
              <MessageCircle className="h-5 w-5" />
              {tCta("whatsapp")}
            </ContactLink>
          </div>

          <p className="mt-5 text-sm text-ink-soft">
            {t("claims", {
              years: site.yearsExperience,
              jobs: site.jobsCompleted,
              responseTime: t("responseTime"),
            })}
          </p>

          {/* Forma nije sklonjena, samo je prestala da bude prvi potez. */}
          <Link
            href={assessHref}
            className="mt-3 inline-block text-sm font-semibold text-foreground underline decoration-brand decoration-2 underline-offset-4"
          >
            {t("orSendPhoto")}
          </Link>
        </div>
      </div>
    </section>
  );
}
