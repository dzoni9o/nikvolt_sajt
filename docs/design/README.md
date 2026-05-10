# Nick Wolt — Brand assets (Wink edition)

This folder is the complete logo + brand package for **Nick Wolt** (electrician, Beograd). The mark is the **winking-plug mascot** (dot eye on the left, lightning-bolt eye on the right, confident smirk). SVG-first; works offline; no raster files required.

---

## File map

```
brand/
├── README.md                    ← you are here
├── tokens.css                   ← brand colors, fonts, button styles (drop into <head>)
├── Logo.jsx                     ← React component (default export). Self-contained.
└── svg/
    ├── mark.svg                 ← primary mark — black plug, white face, yellow bolt eye
    ├── mark-light.svg           ← light variant for dark backgrounds (white plug, dark face)
    ├── mark-mono.svg            ← single-color version (currentColor)
    ├── favicon.svg              ← 32×32 rounded-square favicon
    └── og-image.svg             ← 1200×630 social card (Open Graph / Twitter)
└── examples/
    └── logo-horizontal.html     ← pasteable HTML lockup (light + dark variants)
```

---

## Brand colors

| Token              | Hex       | Use                                   |
|--------------------|-----------|---------------------------------------|
| `--nw-ink`         | `#0A0A0A` | Plug body, headlines, primary text    |
| `--nw-paper`       | `#FFFFFF` | Default background, face features     |
| `--nw-yellow`      | `#FFD60A` | Bolt eye, CTAs, hover/accent          |
| `--nw-yellow-2`    | `#FFC700` | Yellow on press/hover-down            |
| `--nw-cream`       | `#FAFAF7` | Soft alt section background           |
| `--nw-line`        | `rgba(10,10,10,.10)` | Hairline dividers          |
| `--nw-mute`        | `rgba(10,10,10,.55)` | Secondary text              |

All available as CSS vars in `tokens.css`.

---

## Typography

Single family: **Space Grotesk** (Google Fonts). Weights: 400 / 500 / 600 / 700.

Add to `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Wordmark setting: `font-weight: 700; letter-spacing: -0.045em; text-transform: lowercase;`

---

## How to use the logo

### Option A — React component (preferred for Next.js / React)

```jsx
import Logo from "./brand/Logo";

<header>
  <Logo size={36} />                    {/* horizontal, default */}
  <Logo size={48} variant="stacked" />  {/* icon over wordmark */}
  <Logo size={40} variant="mark" />     {/* plug face only */}
  <Logo size={28} tone="light" />       {/* on dark backgrounds */}
</header>
```

### Option B — Plain HTML

```html
<a href="/" class="nw-logo" style="font-size: 32px;">
  <svg width="1.6em" height="auto" viewBox="0 0 100 110" aria-hidden="true">
    <rect x="20" y="38" width="60" height="50" rx="14" fill="#0A0A0A"/>
    <rect x="32" y="14" width="9" height="26" rx="3" fill="#0A0A0A"/>
    <rect x="59" y="14" width="9" height="26" rx="3" fill="#0A0A0A"/>
    <path d="M50 88 Q50 104 36 104 Q22 104 22 92"
          fill="none" stroke="#0A0A0A" stroke-width="6" stroke-linecap="round"/>
    <circle cx="38" cy="55" r="3.2" fill="#FFFFFF"/>
    <path d="M64 49 L57 58 L62 58 L60 65 L68 56 L63.5 56 L66 49 Z" fill="#FFD60A"/>
    <path d="M40 74 Q50 80 60 74" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
  </svg>
  <span>nick<span class="nw-logo__dot">·</span>wolt</span>
</a>
```

For dark backgrounds, use `brand/svg/mark-light.svg` instead (white plug, dark face features).

---

## Anatomy of the mark

| Part        | Color       | Notes                                                         |
|-------------|-------------|---------------------------------------------------------------|
| Plug body   | Ink / Paper | Switches with theme (`tone="dark"` or `"light"` in React).    |
| Dot eye     | Inverse     | Always inverse of plug body — paper on ink, ink on paper.     |
| Bolt eye    | Yellow      | **Always** brand yellow `#FFD60A`. Never recolor.             |
| Smirk       | Inverse     | Same color as the dot eye. Tone-matched to plug body.         |
| Cable curl  | Same as plug body |                                                         |

**Don't:** flip the wink to the other side, swap the bolt and dot positions, recolor the bolt eye, remove the smirk for the primary mark, or distort the plug shape.

---

## Favicons & social meta

```html
<link rel="icon" type="image/svg+xml" href="/brand/svg/favicon.svg">

<meta property="og:title" content="Nick Wolt — Električar Beograd">
<meta property="og:description" content="Licencirani električar. Brze intervencije, garantovan rad.">
<meta property="og:image" content="https://your-domain.com/brand/svg/og-image.svg">
<meta name="twitter:card" content="summary_large_image">
```

> Some platforms prefer rasterised OG images. If you need a PNG, render `og-image.svg` to PNG once with any SVG-to-PNG tool (e.g. `resvg`, ImageMagick, or Figma export) and serve `og-image.png` instead.

---

## Clear space & minimum size

- **Clear space:** at least the height of the plug-prong (≈ 25% of the mark's height) on every side.
- **Minimum size:** 28 px tall for the mark (the eyes need a bit more room than the plain version), 16 px for the wordmark text.
- **At very small sizes** (< 24 px tall), use `favicon.svg` instead — it's already simplified for tiny rendering.

---

## Quick start (paste into Claude Code)

```
Add the Nick Wolt brand to this project.

1. Copy the brand/ folder into the project root.

2. In the main HTML <head>, add:
   <link rel="icon" type="image/svg+xml" href="/brand/svg/favicon.svg">
   <link rel="stylesheet" href="/brand/tokens.css">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">

3. Render the logo in the site header:
   • React: import Logo from "./brand/Logo"; then <Logo size={32} />
   • Plain HTML: copy the lockup snippet from brand/examples/logo-horizontal.html
   • For dark backgrounds, pass tone="light" (React) or use brand/svg/mark-light.svg

4. Use brand vars throughout the site:
   • --nw-ink     for headlines and primary text
   • --nw-yellow  for CTA buttons and accents
   • --nw-cream   for soft alt section backgrounds

5. Add Open Graph meta with /brand/svg/og-image.svg (or rasterise to PNG if your host requires it).

The bolt eye on the mark is the brand's signature element — never recolor it from #FFD60A.
```
