# Google Search Console — kako uvesti sajt u indeks

Sajt ima 172 URL-a, sitemap, canonical i hreflang na svakoj stranici. Ništa
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

Sitemap se ne šalje nikome mejlom i ne predaje se nikakvoj firmi ni servisu.
Upisuje se u alat same pretraživačke mašine, a to je za Google Search Console.
Fajl ostaje da stoji na sajtu; Googlu se samo kaže gde je.

Zapravo je već i rečeno: `robots.txt` na sajtu sadrži liniju
`Sitemap: https://nikvolt.com/sitemap.xml`, i Google je čita sam. Upis u konzolu
je brži i, za razliku od `robots.txt`, daje izveštaj o tome šta je prihvaćeno.

Klikovi, kad si već ulogovan i nalog je potvrđen:

1. Levo meni → **Indexing** → **Sitemaps**
2. U polju **Add a new sitemap** već stoji `https://nikvolt.com/`, dopiši samo
   `sitemap.xml`
3. **SUBMIT**

Status posle nekoliko sati treba da bude **Success** i **Discovered URLs: 169**.
Ako piše „Couldn't fetch", nije problem u sitemapu nego u tački 0.

Sitemap se generiše iz fajlova (`web/src/app/sitemap.ts`), pa se sam ažurira sa
svakim deployom. Predaje se **jednom** i nikad više.

### Bing, usput

Isti fajl vredi upisati i u [Bing Webmaster Tools](https://www.bing.com/webmasters).
Pri otvaranju naloga postoji dugme **Import from Google Search Console**, koje
prenese i potvrdu vlasništva i sitemap odjednom. Deset minuta posla.

Bing nosi malo saobraćaja u Srbiji, ali ga koriste ChatGPT i Copilot kad
pretražuju web, pa se preko njega upada u odgovore asistenata. Za sajt
napravljen od kratkih pitanja i odgovora to nije zanemarljivo.

Drugim pretraživačima se ne predaje ništa. Yandex ima svoj alat, ali za majstora
u Beogradu ne vredi vremena. Servisi tipa „prijavi sajt na 500 pretraživača" su
prevara i ne treba ih dirati.

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

Uz to, u `web/src/lib/site-config.ts` stoje prazna polja `geo` i
`googleBusinessProfile`. Dok su prazna, namerno se ne emituju u JSON-LD, jer je
bolje ništa nego podatak koji se ne poklapa sa profilom. Kad se popune tačno
onako kako stoje na profilu, sajt počne da šalje Googlu isti podatak sa dva
mesta, a to je signal koji lokalni paket stvarno koristi.

`streetAddress` ostaje prazan i to nije nedovršeno. Nikvolt je terenska
delatnost bez pulta na koji mušterija dolazi, a upisano sedište je privatan
stan. U JSON-LD stoji samo grad i poštanski broj, uz `areaServed` po opštinama.

## 7. Čega se kloniti

**Ne predavati sitemap više puta.** Ne ubrzava ništa i pravi zabunu u izveštaju.

**Ne tražiti ručno indeksiranje istog URL-a u krug.** Kvota se troši, red se ne
pomera.

**Ne dodavati `noindex` „privremeno".** Google ga zapamti duže nego što misliš.

**Ne menjati slugove posle indeksiranja.** Svaka promena je nova stranica i
gubitak istorije. Ako mora, radi se sa 301 redirekcijom i to je kod, ne konzola.

**Ne paničiti prvih mesec dana.** Prazna konzola u prvoj nedelji je normalno
stanje, a ne kvar.

## 8. Polazne brojke, 19. oktobar 2026.

Prvi izvoz iz konzole, tri meseca podataka. Zapisano ovde da bi za mesec dana
postojalo nešto sa čim se poredi, jer bez polazne brojke svaka promena izgleda
kao napredak.

Ceo sajt: **95 klikova, 6.515 prikaza, prosečna pozicija 6,4.** Pozicija je
dobra, klikova nema — problem je naslov u rezultatu, ne rang.

Šest stranica kojima su tog dana prepravljeni `title` i `description`:

| Stranica | Prikazi | CTR | Pozicija |
| --- | --- | --- | --- |
| `/blog/udar-struje-prva-pomoc` | 744 | 0,4% | 6,5 |
| `/pojmovnik/faza-nula-zastitni` | 693 | 0,6% | 6,9 |
| `/pojmovnik/ip-zastita` | 443 | 0% | 7,4 |
| `/blog/koliko-trosi-bojler` | 337 | 0,6% | 6,5 |
| `/pojmovnik/prenaponska-zastita` | 210 | 0,5% | 10,7 |
| `/pojmovnik/presek-kabla` | 158 | 1,27% | — |

Za poređenje, dve stranice koje nisu dirane jer im CTR već radi:
`zasto-se-greje-uticnica` 62 prikaza i **4,8%**, `zasto-klima-izbacuje-osiguraca`
72 prikaza i **4,2%**. To je nivo kojem tih šest teži. Obrazac je jasan: gde je
upit definicija, Google odgovori u rezultatu i čovek ne klikne; gde je upit
simptom, čovek uđe.

**Kalkulator preseka kabla**, `calculator.nikvolt.com`: 19 klikova, 292 prikaza,
**6,51% CTR**. Deset puta iznad proseka sajta, a do tog dana nije bio linkovan
ni sa jedne stranice koja rangira — samo sa `/alati`, koji ima 21 prikaz. Link
je tog dana dodat u telo šest stranica. Meri se broj klikova na poddomen i broj
njegovih prikaza.

**Stranice opština**: osam stranica, 91 prikaz, **nula klikova**. Četiri su
prepravljene nekoliko dana ranije, pa su ove brojke starije od teksta koji sada
stoji na njima. Prvo merenje koje nešto znači je tek sledeći izvoz.

**Komercijalni upiti praktično ne postoje**: pet upita, 39 prikaza, nula klikova
za ceo kvartal. „Električar Beograd" se ne pojavljuje uopšte. „Električar
mirijevo" je pozicija 1,24, ali sa 17 prikaza za tri meseca — to nije pobeda
nego termin koji niko ne kuca, a pozivi iz Mirijeva dolaze preko Business
profila, ne preko sajta.

### Kako se ponavlja merenje

Performance → Pages, opseg 3 meseca, Export → CSV. Isti opseg i isti izvoz
svaki put, inače se brojke ne porede. Gleda se samo CTR tih šest stranica,
klikovi na kalkulator i da li su se opštine pomerile sa nule.

Jedna napomena na kraju: CTR na jednoj stranici skače i bez ikakve promene, jer
zavisi od toga šta je Google tog meseca prikazao iznad nje. Zato se ne gleda
jedna stranica nego sve šest zajedno, i ne posle dve nedelje nego posle mesec
dana.
