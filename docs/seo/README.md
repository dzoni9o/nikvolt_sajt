# SEO

## Šta je gde

- [`keyword-map.md`](./keyword-map.md) — koja stranica cilja koji upit, kadenca pisanja i šta pratiti
- [`gbp-checklist.md`](./gbp-checklist.md) — Google Business Profile, recenzije i lokalni katalozi (nije kod)

## Kako je sajt složen

| Šta | Gde |
|---|---|
| Učitavanje sadržaja, validacija frontmattera, prevodi | `web/src/lib/mdx.ts` |
| Canonical, hreflang, sitemap URL-ovi | `web/src/lib/seo.ts` |
| JSON-LD graditelji | `web/src/lib/schema.ts` |
| Graf linkova i backlinkovi | `web/src/lib/mdx.ts` (`buildLinkGraph`), `web/scripts/check-links.mjs` |
| Lokalizovani URL segmenti | `web/src/i18n/routing.ts` |
| Praćenje konverzija | `web/src/lib/analytics.ts`, `web/src/components/site/contact-link.tsx` |
| OG slike | `web/src/lib/og.tsx` + `opengraph-image.tsx` rute |

## Dodavanje sadržaja

Novi tekst, usluga ili opština je jedan MDX fajl po jeziku:

```
web/src/content/<kolekcija>/<jezik>/<slug>.mdx
```

Kolekcije su `blog`, `usluge`, `lokacije`, `pojmovnik`, `pravno`. Jezici su `sr`, `en`, `ru`.

Pojmovnik je srpski samo. Nav stavka i indeks se prikazuju samo tamo gde ima sadržaja, pa `/en/glossary` vraća 404 umesto prazne stranice.

Dva pravila koja build proverava i obara se ako se prekrše:

1. **Ime fajla mora da bude jednako `slug` polju** u frontmatteru.
2. **`key` polje povezuje prevode.** Isti `key` u sr, en i ru znači da su to isti unos na tri jezika. Slugovi se razlikuju i to je namerno — `zasto-fid-iskace` / `why-rcd-trips` / `pochemu-srabatyvaet-uzo`.

Prevod postoji samo ako fajl postoji. Dok tekst nema ruski prevod, `/ru` URL za njega ne postoji, nije u sitemapu i hreflang ga ne pominje. To je namerno: prijaviti prevod koji ne postoji je gore nego ne prijaviti ništa.

### Interni linkovi u MDX-u

Pišu se u **internom** obliku — ime direktorijuma kolekcije plus slug tog jezika:

```md
[prerada elektro table](/usluge/elektro-table)
```

next-intl to renderuje kao `/sr/usluge/…`, `/en/services/…`, `/ru/uslugi/…` zavisno od toga kom jeziku tekst pripada. Ne pisati `/sr/usluge/...` ručno.

## Provera pre puštanja

```bash
cd web
npm run check:links   # graf linkova — pokvareni, siročad, gustina
npm run build         # pokreće check:links kao prebuild, pa pada i na to
npm run lint
npm run start         # pa proveriti sitemap, hreflang i JSON-LD
```

`check:links` obara build ako link vodi nikuda, ako neka stranica nema nijedan dolazni link iz teksta, ili ako ima manje od 3 linka u telu. Cilj je da se sa svake stranice može dalje kroz rečenicu, a ne samo kroz meni — a to se održava proverom, ne dobrom voljom.

Korisne provere na pokrenutom serveru:

```bash
curl -s localhost:3000/sitemap.xml | grep -c "<loc>"
curl -s localhost:3000/sr/usluge/uzemljenje | grep -o '<link rel="alternate"[^>]*>'
curl -sI localhost:3000/sr/opengraph-image | grep -i content-type   # mora image/png
```

JSON-LD provući kroz [Rich Results Test](https://search.google.com/test/rich-results).

## Šta još nije urađeno

- `streetAddress`, `postalCode`, `geo` i `googleBusinessProfile` u `web/src/lib/site-config.ts` su prazni. Dok su prazni, ne emituju se u JSON-LD. Popuniti sa Google Business Profile-a, slovo u slovo.
- `GOOGLE_SITE_VERIFICATION` treba dodati u Vercel environment varijable posle otvaranja Search Console property-ja.
- Cene u tekstovima treba da potvrdi Nikola — preuzete su iz postojećeg cenovnika i iz zatečenog teksta o elektro tabli.
