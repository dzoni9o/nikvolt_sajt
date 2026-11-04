import { Space_Grotesk, Source_Sans_3 } from "next/font/google";

// Shared by both root layouts (src/app/[locale]/layout.tsx and
// src/app/uvid/layout.tsx). next/font dedupes by call site, so declaring the
// families once here keeps a single preloaded copy across the whole app.

/**
 * Space Grotesk is a geometric display face. It is the brand — the wordmark is
 * set in it — and it is right for headings. It is not right for 68 characters
 * a line of article text, which is what it was doing before: --font-sans,
 * --font-heading and --font-display all pointed here, so every `font-display`
 * in the codebase was visually inert.
 */
export const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "700"],
  display: "swap",
});

/**
 * Body text. Humanist, quiet, and carries Cyrillic so the Russian pages get the
 * same face as the Serbian ones instead of falling back to a system font.
 */
export const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "600"],
  display: "swap",
});

export const fontVariables = `${spaceGrotesk.variable} ${sourceSans.variable}`;
