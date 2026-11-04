import { Link } from "@/i18n/navigation";
import { Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Logo } from "./logo";
import { site } from "@/lib/site-config";
import { navigationFor } from "@/lib/navigation";
import { ContactLink } from "@/components/site/contact-link";
import { getEntries, getEntryByKey, type SlugMap } from "@/lib/mdx";
import { LocaleSwitcher } from "./locale-switcher";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
}

export async function Footer({ slugMap }: { slugMap: SlugMap }) {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");
  const tHours = await getTranslations("Hours");
  const tCta = await getTranslations("Cta");
  const locale = await getLocale();

  const navItems = navigationFor(locale);

  // Podnožje je ranije nosilo 45 linkova: sve usluge, osam pojmova, svih deset
  // opština. To je bio zid na dnu svake stranice, a na telefonu 2.000 px.
  // Dugački spiskovi pripadaju indeksima; ovde stoji po pet najtraženijih i
  // link na ceo spisak, pa je put do bilo koje stranice i dalje dva klika.
  const services = ["panels", "emergency-callout", "new-installation", "outlet-replacement", "diagnostics"]
    .map((key) => getEntryByKey("usluge", locale, key))
    .filter((e) => e !== null && e !== undefined);
  const areas = getEntries("lokacije", locale)
    .filter((a) => ["zvezdara", "vracar", "novi-beograd", "zemun", "vozdovac"].includes(a.key))
    .slice(0, 5);

  return (
    <footer className="mt-20 border-t border-border bg-secondary">
      <div className="container-page py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo size={26} />
            <p className="max-w-xs text-sm text-ink-soft">{t("tagline")}</p>
            <div className="flex gap-2 pt-1">
              <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-muted">
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a href={site.socials.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-muted">
                <TikTokIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">{t("siteHeading")}</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="text-ink-soft hover:text-foreground">
                    {tNav(item.id)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/alati" className="text-ink-soft hover:text-foreground">{tNav("tools")}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">{tNav("services")}</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={{ pathname: "/usluge/[slug]", params: { slug: s.slug } }} className="text-ink-soft hover:text-foreground">
                    {s.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/usluge" className="font-semibold text-foreground hover:underline">{t("allServices")}</Link>
              </li>
            </ul>

            <h3 className="mt-7 text-sm font-semibold text-foreground">{tNav("areas")}</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {areas.map((a) => (
                <li key={a.slug}>
                  <Link href={{ pathname: "/lokacije/[slug]", params: { slug: a.slug } }} className="text-ink-soft hover:text-foreground">
                    {a.area}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/lokacije" className="font-semibold text-foreground hover:underline">{t("allAreas")}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">{t("contactHeading")}</h3>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-ink-soft" /><ContactLink channel="phone" source="footer">{site.phoneDisplay}</ContactLink></li>
              <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-ink-soft" /><ContactLink channel="whatsapp" source="footer">{tCta("whatsapp")}</ContactLink></li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-ink-soft" /><ContactLink channel="email" source="footer">{site.email}</ContactLink></li>
              <li className="flex items-center gap-2 text-ink-soft"><Clock className="h-4 w-4" />{tHours("alwaysDay")} {tHours("alwaysHours")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-sm text-ink-soft md:flex-row md:items-center">
          <div className="space-y-1">
            <p>{t("copyright", { year: new Date().getFullYear(), name: site.name, city: site.city })}</p>
            {/* Identifikacija privrednog subjekta. Registrovani naziv namerno
                nije ovde: kod preduzetnika sadrži lično ime, pa stoji na
                pravnim stranicama. Bez oba broja se red ne renderuje. */}
            {site.registrationNumber && site.taxNumber ? (
              <p>{t("legal", { reg: site.registrationNumber, tax: site.taxNumber })}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/privatnost" className="hover:text-foreground">{t("privacy")}</Link>
            <Link href="/uslovi" className="hover:text-foreground">{t("terms")}</Link>
            {/* Birač jezika je bio u zaglavlju, na najboljem mestu na ekranu.
                Srbija, Hrvatska i BiH nose 90% klikova; ruski je 254 prikaza i
                2 klika za kvartal. Ovde mu je mesto. */}
            <LocaleSwitcher slugMap={slugMap} />
          </div>
        </div>
      </div>
    </footer>
  );
}
