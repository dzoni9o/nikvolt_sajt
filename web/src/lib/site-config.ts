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

export const navigation: { id: NavItemId; href: string }[] = [
  { id: "services", href: "#services" },
  { id: "emergency", href: "#emergency" },
  { id: "blog", href: "/blog" },
  { id: "tools", href: "/alati" },
  { id: "pricing", href: "#pricing" },
  { id: "contact", href: "#contact" },
];
