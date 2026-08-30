import type { StaticAppPathname } from "@/i18n/routing";

export const site = {
  name: "nik volt",
  city: "Beograd",
  country: "Srbija",
  url: "https://nikvolt.com",
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
  { id: "tools", href: "/alati" },
  { id: "pricing", href: { pathname: "/", hash: "pricing" } },
  { id: "contact", href: { pathname: "/", hash: "contact" } },
];

/** The homepage fault-assessment form — the primary CTA target sitewide. */
export const assessHref = { pathname: "/", hash: "assess" } as const;
