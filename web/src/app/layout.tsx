import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { StickyMobileCTA } from "@/components/site/sticky-mobile-cta";
import { Toaster } from "@/components/ui/sonner";
import { site } from "@/lib/site-config";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Električar u ${site.city}u, bez nagađanja oko cene`,
    template: `%s · ${site.name}`,
  },
  description:
    "Pošalji slike problema i dobij procenu kvara, okvirnu cenu i vreme izlaska na teren. Licencirani električar za Beograd.",
  applicationName: site.name,
  keywords: [
    "električar",
    "električar Beograd",
    "hitan električar",
    "dijagnostika kvarova",
    "zamena elektro table",
    "zamena utičnice",
  ],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — Električar u ${site.city}u`,
    description:
      "Procena kvara na osnovu slika, transparentne okvirne cene, brz izlazak na teren.",
    url: site.url,
    locale: "sr_RS",
    images: [
      {
        url: "/brand/og-image.svg",
        width: 1200,
        height: 630,
        alt: `${site.name} — Električar Beograd`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Električar u ${site.city}u`,
    description: "Procena kvara na osnovu slika. Transparentne cene. Brzi izlasci na teren.",
    images: ["/brand/og-image.svg"],
  },
  alternates: { canonical: site.url },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="sr-Latn"
      className={`${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-paper text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyMobileCTA />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
