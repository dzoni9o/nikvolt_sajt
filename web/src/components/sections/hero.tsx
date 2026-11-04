import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Phone, ShieldCheck, Clock4, CheckCircle2 } from "lucide-react";
import { site, assessHref } from "@/lib/site-config";
import { ContactLink } from "@/components/site/contact-link";
// Statički uvoz, a ne putanja u stringu: odatle Next sam zna širinu, visinu i
// blurDataURL, pa nema skoka u rasporedu dok se slika učitava.
import tablaPosle from "../../../public/photos/tabla-posle.jpg";

export async function Hero() {
  const t = await getTranslations("Hero");
  const tCta = await getTranslations("Cta");
  return (
    <section>
      <div className="container-page pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-ink-soft">
              <span className="h-2 w-2 shrink-0 rounded-full bg-emergency" />
              {t("availability", {
                city: site.city,
                responseTime: t("responseTime"),
              })}
            </div>

            <h1 className="font-display text-balance text-[2rem] leading-[1.1] font-bold text-foreground sm:text-4xl lg:text-5xl">
              {t("h1Lead", { city: site.city })}{" "}
              <span className="relative inline-block">
                <span className="relative z-10">{t("h1Highlight")}</span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 -z-0 h-3 rounded-sm bg-brand/70 sm:h-4"
                />
              </span>{" "}
              {t("h1Tail")}
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-lg text-ink-soft sm:text-xl">
              {t("lead")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={assessHref}
                className="group inline-flex items-center justify-center gap-2 rounded-lg border border-foreground bg-foreground px-6 py-4 text-base font-semibold text-background hover:bg-brand hover:text-brand-foreground hover:border-brand"
              >
                {tCta("sendProblem")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <ContactLink
                channel="phone"
                source="hero"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-4 text-base font-semibold text-foreground hover:bg-muted"
              >
                <Phone className="h-4 w-4" />{" "}
                {tCta("callWithNumber", { phone: site.phoneDisplay })}
              </ContactLink>
            </div>

            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-soft">
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-foreground" /> {t("badgeLicensed")}</li>
              <li className="flex items-center gap-2"><Clock4 className="h-4 w-4 text-foreground" /> {t("badgeSameDay")}</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-foreground" /> {t("badgeJobs", { count: site.jobsCompleted })}</li>
            </ul>
          </div>

          <HeroPhoto />
        </div>
      </div>
    </section>
  );
}

/**
 * Ovde je ranije stajala maketa aplikacije: prozor sa tačkicama kao na macOS-u,
 * kartica „Procena" i u njoj izmišljena cena i izmišljen termin. Izgledalo je
 * kao stvarna ponuda, a nije bilo ništa — zato je sklonjeno, iz istog razloga
 * zbog kog su ranije uklonjene lažne recenzije iz JSON-LD-a. Na njenom mestu
 * stoji fotografija stvarnog posla.
 */
async function HeroPhoto() {
  const t = await getTranslations("Hero");
  return (
    <figure className="relative mx-auto m-0 w-full max-w-md lg:max-w-none">
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        {/* Bez priority: u ovom rasporedu slika na telefonu pada ispod
            preloma, a telefon je 77% poseta. Eager bi ga naterao da je
            preuzme pre nego što je vidi, a LCP tamo je ionako naslov. */}
        <Image
          src={tablaPosle}
          alt={t("photoAlt")}
          placeholder="blur"
          // Puna širina na telefonu, pola mreže od 80rem na desktopu.
          sizes="(min-width: 1024px) 36rem, 100vw"
          className="h-auto w-full object-cover"
        />
      </div>
      <figcaption className="mt-3 text-sm text-ink-soft">
        {t("photoCaption")}
      </figcaption>
    </figure>
  );
}
