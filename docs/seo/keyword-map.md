# Keyword mapa

Izvor istine za to koja stranica cilja koji upit. Pravilo je **jedan URL po nameri**: kad dva teksta cilaju isti upit, oni se ne takmiče sa konkurencijom nego jedan sa drugim, i oba gube. Kad se preklope — spajaju se u jedan i stari se preusmerava.

Kolona *namera* određuje kako se piše:

- **hitna** — čovek ima problem sad. Telefon iznad svega, tekst kratak, CTA na vrhu.
- **komercijalna** — traži izvođača ili cenu. Cena, obim posla, garancija, dokaz.
- **informativna** — hoće da razume. Tekst nosi, CTA je na kraju i nenametljiv.

---

## Početna

| Upit | Namera |
|---|---|
| električar Beograd | komercijalna |
| hitan električar Beograd | hitna |
| električar 24h Beograd | hitna |

`/sr` · H1: „Električar u Beogradu bez nagađanja oko cene."

Početna ne cilja nijednu pojedinačnu uslugu — ona nosi brend i najširi upit, i deli saobraćaj ka uslugama i opštinama.

---

## Stranice usluga

| URL | Primarni upit | Sekundarni | Namera |
|---|---|---|---|
| `/sr/usluge/elektro-table` | zamena elektro table Beograd | prerada razvodnog ormana, cena elektro table | komercijalna |
| `/sr/usluge/zamena-osiguraca` | zamena osigurača | ugradnja FID sklopke, FID iskače | komercijalna |
| `/sr/usluge/zamena-uticnica` | zamena utičnice | pregorela utičnica, utičnica ne radi | komercijalna |
| `/sr/usluge/dijagnostika-kvarova` | dijagnostika elektro kvarova | merenje izolacije, traženje kvara u instalaciji | komercijalna |
| `/sr/usluge/uzemljenje` | provera uzemljenja | merenje otpora uzemljenja, uzemljenje cena | komercijalna |
| `/sr/usluge/nova-elektroinstalacija` | nova elektroinstalacija stan | cena instalacije po tački, elektroinstalacija cena | komercijalna |
| `/sr/usluge/rasveta` | ugradnja rasvete | postavljanje lustera, ugradnja spotova | komercijalna |
| `/sr/usluge/led-sistemi` | LED trake ugradnja | LED profil, LED drajver | komercijalna |
| `/sr/usluge/pametna-kuca` | pametna kuća Beograd | Shelly ugradnja, Sonoff, Zigbee | komercijalna |
| `/sr/usluge/industrijske-instalacije` | industrijske elektroinstalacije | trofazni razvod, komandni orman | komercijalna |

---

## Stranice opština

Sve ciljaju obrazac **„električar + opština"**, namera hitna do komercijalna.

| URL | Primarni upit |
|---|---|
| `/sr/elektricar/novi-beograd` | električar Novi Beograd |
| `/sr/elektricar/zemun` | električar Zemun |
| `/sr/elektricar/vozdovac` | električar Voždovac |
| `/sr/elektricar/vracar` | električar Vračar |
| `/sr/elektricar/stari-grad` | električar Stari grad |

**Rizik koji ove stranice nose:** ako budu iste rečenice sa promenjenim imenom opštine, Google ih tretira kao *doorway* stranice — ignoriše ih ili kažnjava. Zato svaka ima sadržaj koji postoji samo tamo: blokovska gradnja i trofazni šporeti na Novom Beogradu, tkaninska izolacija i zaštićeni objekti na Starom gradu, nemereni uzemljivači u zemunskim kućama, dvostruki stambeni fond na Voždovcu, međuratne zgrade i prekinuta nula na Vračaru.

**Pravilo za buduće opštine:** nova stranica se pravi tek kad postoji bar tri konkretne stvari koje važe za tu opštinu a ne za ostale. Ako ih nema, bolje je da stranica ne postoji.

---

## Blog

| URL | Primarni upit | Namera | Vodi na |
|---|---|---|---|
| `/sr/blog/zamena-elektro-table-beograd-cena` | koliko košta zamena elektro table | komercijalna | `/usluge/elektro-table` |
| `/sr/blog/zasto-fid-iskace` | zašto iskače FID sklopka | informativna | `/usluge/zamena-osiguraca` |
| `/sr/blog/kako-proveriti-uticnicu` | kako proveriti utičnicu | informativna | `/usluge/zamena-uticnica` |
| `/sr/blog/lose-uzemljenje` | loše uzemljenje simptomi | informativna | `/usluge/uzemljenje` |
| `/sr/blog/opasna-instalacija-znaci` | opasna elektroinstalacija | hitna | `/usluge/dijagnostika-kvarova` |

Svaki tekst ima `service:` u frontmatteru — to je veza ka usluzi koju cilja i ona se koristi i za interno linkovanje.

---

## Kadenca i šta pisati

**Dva teksta mesečno.** Srpski je izvorni jezik: tekst se piše na srpskom, pa se prevodi na engleski i ruski. Nikad obrnuto — prevod sa engleskog na srpski čita se kao prevod i ne pogađa reči kojima ljudi ovde stvarno pretražuju.

Obrasci koji donose pozive, po redu isplativosti:

1. **„koliko košta …"** — najviša komercijalna namera od svih informativnih upita. Čovek koji traži cenu je već odlučio da zove nekoga.
2. **„zašto … iskače / vari / greje"** — visok obim, i vodi pravo na uslugu koja to rešava.
3. **„kako proveriti …"** — donosi poverenje i linkove; konvertuje sporije ali gradi autoritet.
4. **„hitno / šta odmah uraditi"** — mali obim, ali najviša stopa poziva.

### Sledeći kandidati

- Koliko košta elektroinstalacija u stanu od 60 m²
- Zašto se greje utičnica
- Aluminijumska instalacija — kada se mora menjati
- Šta uraditi kad nestane struja samo u jednom delu stana
- Koliko košta ugradnja klime — elektro deo
- Kako se čita elektro tabla

Pre pisanja proveriti u ovoj tabeli da upit već nije pokriven. Ako jeste — dopuniti postojeći tekst umesto pisanja novog.

---

## Šta pratiti

U Search Console-u, mesečno:

- **Pozicija po upitima iz ove tabele.** Ako stranica rangira za nešto što nije u tabeli, dopuniti tabelu — to je stvarna namera koju smo promašili.
- **Stranice bez prikaza posle 8 nedelja** — ili nisu indeksirane, ili ciljaju upit koji niko ne traži.
- **Dva URL-a na istom upitu** — kanibalizacija, spojiti ih.

U Vercel Analytics-u:

- **`contact` događaji po `source`** — koje stranice zaista donose pozive. Stranica sa mnogo poseta i nula poziva ima problem sa CTA ili sa namerom, ne sa saobraćajem.
- **`assessment_submitted`** — prijave kroz formu, glavna konverzija.
