import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["sr", "en", "ru"] as const,
  defaultLocale: "sr",
  localePrefix: "always",
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];

export const htmlLangFor = (locale: string) =>
  locale === "sr" ? "sr-Latn" : locale;

export const ogLocaleFor = (locale: string) => {
  if (locale === "sr") return "sr_RS";
  if (locale === "ru") return "ru_RU";
  return "en_US";
};
