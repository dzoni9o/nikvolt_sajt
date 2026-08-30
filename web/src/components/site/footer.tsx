import { Link } from "@/i18n/navigation";
import { Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Logo } from "./logo";
import { site, navigation } from "@/lib/site-config";
import { ContactLink } from "@/components/site/contact-link";
import { getEntries } from "@/lib/mdx";

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

export async function Footer() {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");
  const tHours = await getTranslations("Hours");
  const tCta = await getTranslations("Cta");
  const locale = await getLocale();

  // The footer is the main crawl path to the service and location pages: it is
  // on every page, so one hop from anywhere reaches all of them.
  const services = getEntries("usluge", locale);
  const areas = getEntries("lokacije", locale);

  return (
    <footer className="mt-24 border-t border-border bg-paper">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4">
            <Logo size={28} />
            <p className="max-w-xs text-sm text-ink-soft">{t("tagline")}</p>
            <div className="flex gap-2 pt-1">
              <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-muted">
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a href={site.socials.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-muted">
                <TikTokIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">{t("siteHeading")}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {navigation.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="text-foreground/90 hover:text-foreground">
                    {tNav(item.id)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/blog" className="text-foreground/90 hover:text-foreground">{t("blog")}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">{tNav("services")}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={{ pathname: "/usluge/[slug]", params: { slug: s.slug } }}
                    className="text-foreground/90 hover:text-foreground"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">{tNav("areas")}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {areas.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={{ pathname: "/lokacije/[slug]", params: { slug: a.slug } }}
                    className="text-foreground/90 hover:text-foreground"
                  >
                    {a.area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">{t("contactHeading")}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-ink-soft" /><ContactLink channel="phone" source="footer">{site.phoneDisplay}</ContactLink></li>
              <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-ink-soft" /><ContactLink channel="whatsapp" source="footer">{tCta("whatsapp")}</ContactLink></li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-ink-soft" /><ContactLink channel="email" source="footer">{site.email}</ContactLink></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">{t("hoursHeading")}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-ink-soft" />{tHours("alwaysDay")}</span>
                <span className="font-semibold text-foreground">{tHours("alwaysHours")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-ink-soft md:flex-row md:items-center">
          <p>
            {t("copyright", {
              year: new Date().getFullYear(),
              name: site.name,
              city: site.city,
            })}
          </p>
          <div className="flex gap-5">
            <Link href="/privatnost" className="hover:text-foreground">{t("privacy")}</Link>
            <Link href="/uslovi" className="hover:text-foreground">{t("terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
