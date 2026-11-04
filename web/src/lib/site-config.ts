import type { StaticAppPathname } from "@/i18n/routing";

export const site = {
  name: "nik volt",
  city: "Beograd",
  region: "Beograd",
  country: "Srbija",
  url: "https://nikvolt.com",

  // --- Local SEO fields ---
  // Google's local pack leans heavily on a consistent name/address/phone across
  // the site, the Business Profile and every directory listing.
  //
  // This is a service-area business: the work happens at the customer's
  // address, there is no shopfront, and no street address is published.
  // streetAddress therefore stays empty on purpose — schema.org allows a
  // PostalAddress without one, and areaServed (see src/lib/areas.ts, derived
  // from the municipality pages) carries the coverage instead. The Business
  // Profile must be configured the same way, with the address hidden.
  streetAddress: "",
  postalCode: "11000",
  // TODO(nikola): koordinate su opcione za service-area posao i emituju se
  // samo ako se popune. Ako ih uneseš, uzmi ih sa Business Profile-a, ne sa
  // mape napamet.
  geo: null as { lat: number; lng: number } | null,
  // TODO(nikola): nalepi ovde link profila (Google Maps → Share → Copy link).
  // Dok je prazan, ne emituje se ni u sameAs ni u hasMap.
  googleBusinessProfile: "",

  // --- Identifikacija privrednog subjekta ---
  // Isto pravilo kao gore: prazno polje se ne renderuje nigde, ni u futeru, ni
  // na pravnim stranicama, ni u JSON-LD-u. Bolje ništa nego pogrešan broj.
  // TODO(nikola): unesi iz rešenja APR-a.
  /**
   * Pun registrovani naziv. Kod preduzetnika sadrži lično ime, pa stoji samo
   * na pravnim stranicama, ne i u futeru.
   */
  legalName: "NIKOLA MILANOVIĆ PR POSTAVLJANJE ELEKTRIČNIH INSTALACIJA NIKVOLT DONJI VRATARI",
  /** Matični broj, osam cifara. */
  registrationNumber: "68708940",
  /** PIB, devet cifara. */
  taxNumber: "115873702",
  /**
   * Nije u sistemu PDV-a, pa su cene na sajtu konačne. Odatle i izostanak
   * vatID u JSON-LD-u: PIB je poreski broj, ali nije PDV broj dok subjekt
   * nije u sistemu.
   */
  vatRegistered: false,
  /** schema.org priceRange. "$$" reads as mid-market, matching the price table. */
  priceRange: "$$",
  phone: "+381603539985",
  phoneDisplay: "+381 60 353 9985",
  phoneTel: "+381603539985",
  whatsappLink: "https://wa.me/381603539985",
  viberLink: "viber://chat?number=%2B381603539985",
  email: "kontakt@nikvolt.com",
  coverage: [
    "Beograd",
    "Novi Beograd",
    "Zemun",
    "Voždovac",
    "Vračar",
    "Stari Grad",
  ],
  socials: {
    instagram: "https://instagram.com/nikvolt_elektroinstalacije",
    tiktok: "https://www.tiktok.com/@nikvolt_elektro",
  },
  yearsExperience: 14,
  jobsCompleted: 900,
};

export type NavItemId =
  | "services"
  | "emergency"
  | "blog"
  | "glossary"
  | "tools"
  | "pricing"
  | "areas";

/**
 * Anchors are written as { pathname: "/", hash } rather than bare "#pricing"
 * so they also work from /blog, /usluge and the rest — a bare hash on a
 * subpage links to nothing.
 */
export type NavHref =
  | StaticAppPathname
  | { pathname: StaticAppPathname; hash: string }
  | { pathname: "/usluge/[slug]"; params: { slug: string } };

/**
 * A nav entry is either a fixed href, or a service named by its translation
 * key. The second form exists because service slugs are localized: only
 * navigationFor() knows the locale, so only it can turn the key into a URL.
 */
export type NavItem =
  | { id: NavItemId; href: NavHref }
  | { id: NavItemId; serviceKey: string };

/**
 * Šest stavki, redom po tome zbog čega ljudi dolaze.
 *
 * Tri natpisa su ranije lagala: "Najčešći kvarovi" je vodio na stranicu hitnih
 * intervencija, "DIY saveti" na blog (električar ne poziva ljude da sami rade),
 * a "Alati" je spisak njegovih instrumenata, ne alatke za posetioca — taj je
 * izašao iz menija i ostao u podnožju. "Opštine" je dodat: deset stranica
 * opština ranije nije bilo u meniju uopšte. "Kontakt" je izašao jer telefon
 * sada stoji u zaglavlju na svakoj stranici.
 */
export const navigation: NavItem[] = [
  // Emergencies are the highest-intent thing this business sells, so the nav
  // leads to the page that can rank for it rather than to a homepage section.
  { id: "emergency", serviceKey: "emergency-callout" },
  { id: "services", href: "/usluge" },
  { id: "pricing", href: { pathname: "/", hash: "pricing" } },
  { id: "areas", href: "/lokacije" },
  { id: "glossary", href: "/pojmovnik" },
  { id: "blog", href: "/blog" },
];

/** The homepage fault-assessment form — the primary CTA target sitewide. */
export const assessHref = { pathname: "/", hash: "assess" } as const;
