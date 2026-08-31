# Google Search Console — kako uvesti sajt u indeks

Sajt ima 169 URL-ova, sitemap, canonical i hreflang na svakoj stranici. Ništa
od toga Google ne vidi dok se ne otvori nalog i ne preda sitemap.

Ovo nije kod. Sve se radi na [search.google.com/search-console](https://search.google.com/search-console),
osim jedne stavke u Vercelu koja je izričito označena.

---

## 0. Pre svega: da li Googlebot uopšte može da uđe

Dve stvari obaraju sve ostalo, pa se proveravaju prve.

**Vercel Deployment Protection mora biti isključen za produkciju.** Ako je
uključen, svaki poseta bez kolačića dobija 401, uključujući Googlebot. Provera
je u Vercelu, Settings → Deployment Protection. Za `nikvolt.com` mora stajati
Disabled ili Only Preview Deployments.

**Sajt mora odgovarati na golom domenu.** Otvori u anonimnom prozoru:

- `https://nikvolt.com/robots.txt` → mora ispisati `Allow: /` i liniju `Sitemap:`
- `https://nikvolt.com/sitemap.xml` → mora se otvoriti XML sa `<loc>` linijama
- `https://nikvolt.com/` → mora prebaciti na `/sr`

Ako bilo šta od toga ne radi, dalje nema smisla.

## 1. Kreiranje naloga

Postoje dva tipa i **biraj Domain**.

**Domain property** (`nikvolt.com`) pokriva odjednom http i https, www i bez
www, i sve poddomene. Potvrđuje se TXT zapisom kod registrara domena, ne na
sajtu. Ovo je preporuka.

**URL prefix property** (`https://nikvolt.com`) pokriva samo tačno tu varijantu.
Potvrđuje se meta tagom, koji sajt već ume da ispiše: u Vercelu se doda promenljiva
okruženja `GOOGLE_SITE_VERIFICATION` sa vrednošću koju Google da (samo sadržaj
`content` atributa, bez navodnika i bez ostatka taga), pa se pokrene novi deploy.
Kod je u `web/src/app/[locale]/layout.tsx`; dok promenljive nema, tag se ne ispisuje.

Ako ideš na Domain, ovu promenljivu uopšte ne moraš da diraš.

## 2. Predaja sitemapa

Sitemaps → unesi `sitemap.xml` → Submit.

Status posle nekoliko sati treba da bude **Success** i **Discovered URLs: 169**.
Ako piše „Couldn't fetch", nije problem u sitemapu nego u tački 0.

Sitemap se generiše iz fajlova (`web/src/app/sitemap.ts`), pa se sam ažurira sa
svakim deployom. Predaje se **jednom** i nikad više.

## 3. Prvo ubrzanje: ručno traženje indeksiranja

URL Inspection → nalepi URL → **Request indexing**. Kvota je oko deset dnevno,
zato se ne troši na sve. Redosled po vrednosti:

1. `https://nikvolt.com/sr`
2. `https://nikvolt.com/sr/usluge`
3. `https://nikvolt.com/sr/elektricar` (indeks opština)
4. `https://nikvolt.com/sr/usluge/dijagnostika-kvarova`
5. `https://nikvolt.com/sr/usluge/elektro-table`
6. `https://nikvolt.com/sr/usluge/uzemljenje`
7. `https://nikvolt.com/sr/elektricar/novi-beograd`
8. `https://nikvolt.com/sr/elektricar/vracar`
9. `https://nikvolt.com/sr/blog/zasto-fid-iskace`
10. `https://nikvolt.com/sr/pojmovnik`

Ostalih 159 stranica ne treba dirati. Google ih nalazi kroz sitemap i kroz
linkove u tekstu, a upravo zato su svih 87 srpskih stranica dostupne u tri klika.
Ručno traženje za sve redom ne ubrzava ništa i samo troši kvotu.

## 4. Šta gledati posle, i kada

Indeksiranje novog domena traje. Realna očekivanja:

| Kada | Šta treba da se vidi |
|---|---|
| 1–3 dana | Sitemap Success, prvih desetak stranica indeksirano |
| 2–4 nedelje | Većina od 169 URL-ova u izveštaju Pages |
| 2–3 meseca | Prvi stabilni pregledi u Performance za brendirane upite |
| 4–6 meseci | Netbrendirani upiti tipa „električar Novi Beograd" |

Izveštaj **Pages** je jedini koji vredi otvarati redovno. U njemu se gleda
razlog neindeksiranja:

- **Discovered – currently not indexed** — Google zna za stranicu ali je nije
  posetio. Normalno na novom domenu, prolazi samo od sebe. Ne dirati.
- **Crawled – currently not indexed** — posetio ju je i odlučio da je ne uzme.
  Ovo je jedini znak koji nešto znači: stranica mu deluje tanko ili preklopljeno
  sa drugom. Ako se pojavi na više opština odjednom, to znači da tekstovi nisu
  dovoljno različiti međusobno.
- **Alternate page with proper canonical tag** — očekivano i ispravno. To su
  najčešće varijante koje pokazuju na drugu verziju.
- **Excluded by ‘noindex’ tag** — sme se pojaviti samo za `/uvid` i 404.
  Bilo šta drugo ovde je greška.

**Duplicate without user-selected canonical** ne bi trebalo da se pojavi. Ako
se pojavi na parovima sr/en ili sr/ru, znači da hreflang nije prihvaćen i tada
me zovi, jer je to kod.

## 5. Ostalo u konzoli, po redu isplativosti

**Sitemaps → Coverage.** Jednom mesečno, samo da broj otkrivenih URL-ova prati
broj koji sajt stvarno ima.

**Performance → Queries.** Ovde se vidi za šta te ljudi stvarno traže, a to
skoro nikad nije ono što smo pretpostavili. Posle dva-tri meseca ova lista je
najbolji izvor tema za nove tekstove: upit koji donosi preglede a nema klikova
znači da stranica postoji ali naslov ne ubeđuje.

**Enhancements → Breadcrumbs, FAQ, Merchant listings.** Ovde se vidi da li je
Google prihvatio JSON-LD. Greške ovde su kod i one su moje.

**Links.** Pokazuje ko te linkuje spolja. Na početku prazno, i to je normalno.

## 6. Šta radi više za pozive nego sve gore

Za lokalnog majstora, Google Business Profile donosi više poziva nego organski
rezultati. Sajt i profil rade zajedno: profil daje lokalni paket, sajt daje
dubinu i potvrdu. Redosled je u [`gbp-checklist.md`](./gbp-checklist.md).

Uz to, u `web/src/lib/site-config.ts` i dalje stoje prazna polja
`streetAddress`, `postalCode`, `geo` i `googleBusinessProfile`. Dok su prazna,
namerno se ne emituju u JSON-LD, jer je bolje ništa nego podatak koji se ne
poklapa sa profilom. Kad se popune tačno onako kako stoje na profilu, sajt
počne da šalje Googlu istu adresu sa dva mesta, a to je signal koji lokalni
paket stvarno koristi.

## 7. Čega se kloniti

**Ne predavati sitemap više puta.** Ne ubrzava ništa i pravi zabunu u izveštaju.

**Ne tražiti ručno indeksiranje istog URL-a u krug.** Kvota se troši, red se ne
pomera.

**Ne dodavati `noindex` „privremeno".** Google ga zapamti duže nego što misliš.

**Ne menjati slugove posle indeksiranja.** Svaka promena je nova stranica i
gubitak istorije. Ako mora, radi se sa 301 redirekcijom i to je kod, ne konzola.

**Ne paničiti prvih mesec dana.** Prazna konzola u prvoj nedelji je normalno
stanje, a ne kvar.
