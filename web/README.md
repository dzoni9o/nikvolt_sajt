# nik volt — sajt

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4. Deploy na Vercel.

Javni sajt je statički prerenderovan na tri jezika (`sr` podrazumevani, `en`, `ru`). Admin deo za prijave (`/uvid`) je dinamički i iza prijave.

## Pokretanje

```bash
npm install
cp .env.example .env.local   # pa popuni vrednosti
npm run dev
```

Sajt radi i bez popunjenih varijabli — forma za procenu kvara i `/uvid` tada prikazuju poruku da konfiguracija nedostaje, ostalo je netaknuto.

```bash
npm run build    # pada ako MDX frontmatter nije ispravan
npm run lint
npm run start    # produkcijski server nad build-om
```

## Kako je složeno

| Šta | Gde |
|---|---|
| Rute i lokalizovani URL segmenti | `src/i18n/routing.ts` |
| Sadržaj (blog, usluge, lokacije, pravno) | `src/content/<kolekcija>/<jezik>/<slug>.mdx` |
| Učitavanje i validacija sadržaja | `src/lib/mdx.ts` |
| Canonical, hreflang, sitemap | `src/lib/seo.ts` |
| JSON-LD | `src/lib/schema.ts` |
| Praćenje konverzija | `src/lib/analytics.ts`, `src/components/site/contact-link.tsx` |
| OG slike | `src/lib/og.tsx` + `opengraph-image.tsx` rute |
| Prijave sa forme | `src/app/api/submissions/route.ts` → Supabase + Resend |

## Sadržaj i SEO

Dodavanje tekstova, stranica usluga i opština, pravila za slugove i prevode, kao i keyword mapa — u [`../docs/seo/`](../docs/seo/README.md).

Prevodi UI stringova su u `messages/{sr,en,ru}.json`. Referenca za i18n je [`../docs/i18n.md`](../docs/i18n.md).

## Poznato

`src/components/forms/fault-assessment.tsx` prijavljuje jedno lint upozorenje: `form.watch()` iz react-hook-form nije kompatibilan sa React Compiler-om, pa se komponenta preskače pri optimizaciji. Ostavljeno namerno — prepravka reaktivne logike jedine forme kroz koju stižu poslovi nosi rizik, a dobitak je nula za korisnika.
