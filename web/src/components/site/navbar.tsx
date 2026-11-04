import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Phone, MessageCircle } from "lucide-react";
import { Logo } from "./logo";
import { site, type NavItemId, type NavHref } from "@/lib/site-config";
import { ContactLink } from "@/components/site/contact-link";

/**
 * Zaglavlje.
 *
 * Ranije je ovo bila klijentska komponenta sa scroll listenerom, prekidačem za
 * temu, biračem jezika i hamburgerom iza koga je, ispod 1024 px, stajao **ceo**
 * meni. Pošto 77% prikaza dolazi sa telefona, to je značilo da većina
 * posetilaca nikad ne vidi nijednu stavku menija.
 *
 * Sada: logo i telefon u prvom redu, meni u drugom, vidljiv, pomera se prstom.
 * Nema stanja, pa nema ni "use client" — zaglavlje se renderuje na serveru i ne
 * šalje nijedan bajt JavaScripta.
 */
export async function Navbar({
  navItems,
}: {
  navItems: { id: NavItemId; href: NavHref }[];
}) {
  const t = await getTranslations("Nav");
  const tCta = await getTranslations("Cta");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container-page flex h-14 items-center justify-between gap-4">
        <Logo size={24} />

        <div className="flex items-center gap-2">
          <ContactLink
            channel="whatsapp"
            source="navbar"
            className="hidden h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted sm:inline-flex"
            ariaLabel={tCta("whatsapp")}
          >
            <MessageCircle className="h-4 w-4" />
          </ContactLink>
          {/* Telefon je vidljiv na svakoj širini. To je ono zbog čega ljudi
              dolaze na sajt električara. */}
          <ContactLink
            channel="phone"
            source="navbar"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background hover:bg-brand hover:text-brand-foreground"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">{site.phoneDisplay}</span>
            <span className="sm:hidden">{tCta("call")}</span>
          </ContactLink>
        </div>
      </div>

      <nav
        aria-label={t("menu")}
        className="border-t border-border [-ms-overflow-style:none] [scrollbar-width:none] overflow-x-auto [&::-webkit-scrollbar]:hidden"
      >
        <ul className="container-page flex items-center gap-5 whitespace-nowrap py-2.5 text-sm font-semibold">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className="text-ink-soft hover:text-foreground">
                {t(item.id)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
