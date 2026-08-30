import { Space_Grotesk, Geist_Mono } from "next/font/google";

// Shared by both root layouts (src/app/[locale]/layout.tsx and
// src/app/uvid/layout.tsx). next/font dedupes by call site, so declaring the
// families once here keeps a single preloaded copy across the whole app.

export const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const fontVariables = `${spaceGrotesk.variable} ${geistMono.variable}`;
