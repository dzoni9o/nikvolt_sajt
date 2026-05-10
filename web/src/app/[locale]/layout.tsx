import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { StickyMobileCTA } from "@/components/site/sticky-mobile-cta";
import { Toaster } from "@/components/ui/sonner";
import { routing, ogLocaleFor } from "@/i18n/routing";
import { site } from "@/lib/site-config";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Meta.Home" });
  const tk = await getTranslations({ locale, namespace: "Meta.Keywords" });

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}`]),
  );

  return {
    metadataBase: new URL(site.url),
    title: {
      default: t("title", { name: site.name, city: site.city }),
      template: `%s · ${site.name}`,
    },
    description: t("description"),
    applicationName: site.name,
    keywords: [tk("k1"), tk("k2"), tk("k3"), tk("k4"), tk("k5"), tk("k6")],
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    },
    alternates: {
      canonical: `/${locale}`,
      languages: { ...languages, "x-default": `/${routing.defaultLocale}` },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: t("ogTitle", { name: site.name, city: site.city }),
      description: t("ogDescription"),
      url: `${site.url}/${locale}`,
      locale: ogLocaleFor(locale),
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map(ogLocaleFor),
      images: [
        {
          url: "/brand/og-image.svg",
          width: 1200,
          height: 630,
          alt: t("ogImageAlt", { name: site.name }),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle", { name: site.name, city: site.city }),
      description: t("twitterDescription"),
      images: ["/brand/og-image.svg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyMobileCTA />
      <Toaster richColors position="top-center" />
    </NextIntlClientProvider>
  );
}
