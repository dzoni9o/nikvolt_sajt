# Google Business Profile — šta doterati

Za lokalnog majstora GBP obično donosi više poziva nego organski rezultati na sajtu. Profil postoji ali je zapušten; ovo je redosled po isplativosti.

Ništa od ovoga nije kod. Sve se radi na [business.google.com](https://business.google.com).

---

## 1. Podaci koji moraju da se poklope sa sajtom

Google upoređuje ime, adresu i telefon (**NAP**) sa sajtom i sa svim katalozima. Neslaganje slabi lokalno rangiranje, a najčešće nastaje slučajno — jednom „nik volt", drugi put „NikVolt d.o.o.".

| Polje | Šta mora da stoji |
|---|---|
| Ime | `nik volt` — malim slovima, razmak, bez dodataka tipa „elektroinstalacije Beograd" |
| Telefon | `+381 60 353 9985` |
| Sajt | `https://nikvolt.com` |
| Adresa | ista kao ona koju treba uneti u `web/src/lib/site-config.ts` |

**Dopunjavanje ključnih reči u ime profila je kršenje Google smernica** i razlog za suspenziju profila. Ne raditi.

### Šta posle toga ide u kod

Kada se adresa i koordinate potvrde na profilu, unose se u `web/src/lib/site-config.ts`:

```ts
streetAddress: "",            // ulica i broj sa GBP-a, slovo u slovo
postalCode: "",               // npr. "11000"
geo: null,                    // { lat: 44.xxxx, lng: 20.xxxx } — iz URL-a mape
googleBusinessProfile: "",    // javni link profila
```

Dok su prazni, ne emituju se u JSON-LD. To je namerno: podatak koji se ne poklapa sa profilom šteti više nego podatak koji nedostaje.

---

## 2. Kategorije

**Primarna:** Električar (`Electrician`). Primarna kategorija nosi najveću težinu za „električar Beograd" tip upita — ne menjati je na nešto uže.

**Sekundarne** (do 9, birati samo one koje se stvarno rade):
- Usluga elektroinstalacija
- Popravka elektroinstalacija
- Hitna elektro služba
- Instalater rasvete

Ako se neka kategorija ne radi redovno, izostaviti je — lažne kategorije donose pozive koji se odbijaju, a odbijeni pozivi kvare signal.

---

## 3. Usluge

Uneti **svaku uslugu pojedinačno**, ne kao jedan opis. Spisak se poklapa sa stranicama na sajtu:

| Usluga na GBP-u | Stranica |
|---|---|
| Zamena utičnica | `/sr/usluge/zamena-uticnica` |
| Zamena osigurača i FID sklopki | `/sr/usluge/zamena-osiguraca` |
| Prerada i zamena elektro table | `/sr/usluge/elektro-table` |
| Nova elektroinstalacija | `/sr/usluge/nova-elektroinstalacija` |
| Ugradnja rasvete | `/sr/usluge/rasveta` |
| LED sistemi i trake | `/sr/usluge/led-sistemi` |
| Pametna kuća | `/sr/usluge/pametna-kuca` |
| Dijagnostika kvarova | `/sr/usluge/dijagnostika-kvarova` |
| Industrijske instalacije | `/sr/usluge/industrijske-instalacije` |
| Provera i izrada uzemljenja | `/sr/usluge/uzemljenje` |

Svaka usluga dobija kratak opis (2–3 rečenice) i, gde postoji, cenu „od". Cene moraju da se poklope sa cenovnikom na sajtu.

---

## 4. Područje rada

Uneti pet opština koje imaju svoju stranicu:

Novi Beograd · Zemun · Voždovac · Vračar · Stari grad

Ne unositi ceo Beograd plus svaku opštinu ponaosob — Google ne nagrađuje širinu, a preširoko područje razblažuje relevantnost za centar tog područja.

---

## 5. Radno vreme

`Otvoreno 24 sata` svih sedam dana, da se poklopi sa `openingHoursSpecification` u JSON-LD i sa tvrdnjom „0–24" na sajtu. Ako se noću stvarno ne odgovara, promeniti **i profil i sajt** — nepoklapanje između obećanja i stvarnosti pravi loše recenzije brže nego što donosi pozive.

---

## 6. Fotografije

Ovo je stavka koja se najviše zapušta i najbrže popravlja.

- **Nedeljno po 2–3 fotografije sa terena.** Google meri svežinu profila, a fotografije sa lica mesta su najjači signal aktivnog naloga.
- Šta slikati: tabla pre i posle, uredan razvod, merni instrument sa očitavanjem, vozilo, alat.
- Šta ne slikati: prepoznatljive delove tuđeg stana bez pitanja, dokumenta, brojila sa vidljivim podacima vlasnika.
- Slike sa terena su iste one koje idu i u galeriju na sajtu — jedan posao, dva mesta.

---

## 7. Recenzije

Lažne recenzije su ispravno uklonjene sa sajta (commit `5fe66d6`). Sada treba prave, a za to treba **tok, ne nada**.

**Kako:**
1. Uzeti kratki link za recenziju sa GBP-a (`Zatraži recenzije` → kopiraj link).
2. Poslati ga preko WhatsAppa **isti dan po završenom poslu**, dok je utisak svež. Posle tri dana odziv pada višestruko.
3. Poruka kratka i bez pritiska: *„Hvala na poverenju. Ako ti nije problem, par reči ovde mnogo znači: [link]"*

**Šta ne raditi:**
- Ne nuditi popust za recenziju — kršenje smernica i razlog za brisanje svih recenzija.
- Ne tražiti recenzije u seriji sa jednog uređaja ili mreže.
- Ne pisati ih sam. Google prepoznaje obrasce, a kazna pogađa ceo profil.

**Odgovarati na svaku recenziju**, i na lošu. Odgovor na lošu recenziju čitaju budući klijenti, ne onaj ko ju je napisao — zato odgovor treba da bude činjeničan i bez odbrane.

Tek kada bude stvarnih recenzija, `aggregateRating` sme nazad u JSON-LD (`web/src/lib/schema.ts`).

---

## 8. Objave

GBP objava traje 6 meseci i pojavljuje se u profilu. Jedna na dve nedelje je dovoljna. Najbolje rade:

- sezonske teme (grejalice zimi, klime leti, gromobrani u proleće)
- kratak opis konkretne intervencije sa fotografijom
- link na novi tekst sa bloga

---

## 9. Pitanja i odgovori

Sekcija Q&A na profilu je javna i **svako sme da odgovori** — uključujući konkurenciju. Popuniti je sam, sa istim pitanjima koja su već na sajtu u FAQ sekciji:

- Koliko košta izlazak na teren?
- Koliko brzo možete da dođete?
- Dajete li garanciju na radove?
- Da li izlazite van užeg centra?

Postaviti pitanje sa jednog naloga, odgovoriti sa profila. To je dozvoljeno i preporučeno.

---

## 10. Lokalni katalozi

Isti NAP podaci, slovo u slovo, na:

- 011info
- Zlatne strane
- Bizniskatalog
- KupujemProdajem — usluge
- Mojkvadrat

Nema smisla ići dalje od ovoga. Deset kvalitetnih unosa vredi više od stotinu automatski generisanih, a nekonzistentan NAP na pedeset mesta aktivno šteti.

---

## Redosled ako se radi po malo

1. NAP i kategorije (jedan sat, najveći efekat)
2. Usluge i područje rada (jedan sat)
3. Tok za recenzije (najsporije daje rezultat, zato krenuti odmah)
4. Fotografije — nedeljna navika
5. Q&A i katalozi
6. Objave — kad ostalo radi
