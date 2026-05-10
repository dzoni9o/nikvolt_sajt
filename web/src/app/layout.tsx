import type { Viewport } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { routing, htmlLangFor } from "@/i18n/routing";

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

// Derive locale from the URL. We avoid next-intl's getLocale() here because
// this root layout also wraps non-localized routes like /uvid where next-intl
// has no request context to read from.
async function detectLocale(): Promise<string> {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";
  const seg = pathname.split("/").filter(Boolean)[0];
  if (seg && routing.locales.includes(seg as (typeof routing.locales)[number])) {
    return seg;
  }
  return routing.defaultLocale;
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await detectLocale();
  return (
    <html
      lang={htmlLangFor(locale)}
      className={`${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-paper text-foreground">
        {children}
      </body>
    </html>
  );
}
