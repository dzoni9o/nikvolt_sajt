import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { StickyMobileCTA } from "@/components/site/sticky-mobile-cta";
import { ThemeProvider } from "@/components/site/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { routing, ogLocaleFor, htmlLangFor } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { buildSlugMap } from "@/lib/mdx";
import { site } from "@/lib/site-config";
import { alternatesForRoute } from "@/lib/seo";

// This is a root layout (there is no src/app/layout.tsx). Next.js explicitly
// supports placing the root layout under a dynamic segment for i18n, and doing
// so is what keeps the public site statically prerendered: the previous root
// layout read headers() to derive the locale, which opted every public route
// into dynamic rendering. Here the locale comes from params instead.
// The admin area has its own root layout at src/app/uvid/layout.tsx.

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Meta.Home" });

  return {
    metadataBase: new URL(site.url),
    title: {
      default: t("title", { name: site.name, city: site.city }),
      template: `%s · ${site.name}`,
    },
    description: t("description"),
    applicationName: site.name,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/icon.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    },
    // Fill GOOGLE_SITE_VERIFICATION in Vercel once the property is created in
    // Search Console. Absent the env var the tag is simply omitted.
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : undefined,
    alternates: alternatesForRoute("/", locale),
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
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle", { name: site.name, city: site.city }),
      description: t("twitterDescription"),
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
    <html
      lang={htmlLangFor(locale)}
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-paper text-foreground">
        <ThemeProvider>
          <NextIntlClientProvider>
            <Navbar slugMap={buildSlugMap()} />
            <main className="flex-1">{children}</main>
            <Footer />
            <StickyMobileCTA />
            <Toaster richColors position="top-center" />
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
