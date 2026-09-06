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
  legalName: "",
  /** Matični broj, osam cifara. */
  registrationNumber: "",
  /** PIB, devet cifara. */
  taxNumber: "",
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
  | "contact";

/**
 * Anchors are written as { pathname: "/", hash } rather than bare "#pricing"
 * so they also work from /blog, /usluge and the rest — a bare hash on a
 * subpage links to nothing.
 */
export type NavHref =
  | StaticAppPathname
  | { pathname: StaticAppPathname; hash: string };

export const navigation: { id: NavItemId; href: NavHref }[] = [
  // Services now have real indexable pages, so the nav points at those rather
  // than at the homepage anchor.
  { id: "services", href: "/usluge" },
  { id: "emergency", href: { pathname: "/", hash: "emergency" } },
  { id: "blog", href: "/blog" },
  { id: "glossary", href: "/pojmovnik" },
  { id: "tools", href: "/alati" },
  { id: "pricing", href: { pathname: "/", hash: "pricing" } },
  { id: "contact", href: { pathname: "/", hash: "contact" } },
];

/** The homepage fault-assessment form — the primary CTA target sitewide. */
export const assessHref = { pathname: "/", hash: "assess" } as const;
