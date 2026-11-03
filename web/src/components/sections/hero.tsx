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
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-bg [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />
      <div
        aria-hidden
        className="absolute -top-32 right-[-10%] -z-10 h-[520px] w-[520px] rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(255, 214, 10, 0.55), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute bottom-[-30%] left-[-15%] -z-10 h-[600px] w-[600px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, oklch(0.62 0.22 28 / 0.35), transparent 70%)" }}
      />

      <div className="container-page pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-ink-soft backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emergency opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emergency" />
              </span>
              {t("availability", {
                city: site.city,
                responseTime: t("responseTime"),
              })}
            </div>

            <h1 className="font-display text-balance text-[2.6rem] leading-[1.02] font-bold tracking-[-0.02em] text-foreground sm:text-6xl lg:text-[4.25rem]">
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
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-foreground bg-foreground px-6 py-4 text-base font-semibold text-background shadow-cta transition-all hover:-translate-y-0.5 hover:bg-brand hover:text-brand-foreground hover:border-brand"
              >
                {tCta("sendProblem")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <ContactLink
                channel="phone"
                source="hero"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-4 text-base font-semibold text-foreground hover:bg-muted"
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
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
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
