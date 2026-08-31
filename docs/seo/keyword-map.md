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
| `/sr/elektricar/cukarica` | električar Čukarica |
| `/sr/elektricar/palilula` | električar Palilula |
| `/sr/elektricar/rakovica` | električar Rakovica |
| `/sr/elektricar/savski-venac` | električar Savski venac |
| `/sr/elektricar/zvezdara` | električar Zvezdara |

**Rizik koji ove stranice nose:** ako budu iste rečenice sa promenjenim imenom opštine, Google ih tretira kao *doorway* stranice — ignoriše ih ili kažnjava. Zato svaka ima sadržaj koji postoji samo tamo: blokovska gradnja i trofazni šporeti na Novom Beogradu, tkaninska izolacija i zaštićeni objekti na Starom gradu, nemereni uzemljivači u zemunskim kućama, dvostruki stambeni fond na Voždovcu, međuratne zgrade i prekinuta nula na Vračaru.

**Pravilo za buduće opštine:** nova stranica se pravi tek kad postoji bar tri konkretne stvari koje važe za tu opštinu a ne za ostale. Ako ih nema, bolje je da stranica ne postoji.

**Prigradske opštine namerno nisu uzete.** Barajevo, Grocka, Lazarevac, Mladenovac, Obrenovac, Sopot i Surčin bi dodali sedam stranica i nešto saobraćaja, ali stranica koja obećava izlazak u Mladenovac donosi pozive koji se odbijaju — a odbijeni pozivi kvare i profil i reputaciju. Ako se domet stvarno proširi, stranice se dodaju tada.

---

## Pojmovnik

Osamnaest pojmova pod `/sr/pojmovnik/`, ciljaju obrazac **„šta je …"** — informativna namera, ali sa najvišom stopom zadržavanja na sajtu jer svaki pojam vodi u sledeći.

| Pojam | Primarni upit |
|---|---|
| fid-sklopka | šta je FID sklopka |
| automatski-osiguraci | šta je automatski osigurač |
| uzemljenje | šta je uzemljenje |
| kratak-spoj | šta je kratak spoj |
| presek-kabla | presek kabla mm2 |
| suko-uticnica | šuko utičnica |
| elektro-tabla | šta je elektro tabla |
| jednofazno-i-trofazno | razlika jednofazno trofazno |
| kilovat-sat | kako se čita brojilo |
| prenaponska-zastita | prenaponska zaštita |
| struja-curenja | struja curenja |
| razvodna-kutija | razvodna kutija |
| faza-nula-zastitni | faza nula zaštitni provodnik |
| karakteristika-osiguraca | osigurač B ili C |
| naizmenicni-prekidac | naizmenični prekidač |
| ip-zastita | IP44 IP65 |
| dimer | dimer za LED |
| led-drajver | LED drajver |

Samo srpski. Ruski ekspat koji traži „электрик Земун" je mušterija; onaj koji traži „что такое УЗО" će pročitati ruski sajt.

## Blog

| URL | Primarni upit | Namera | Vodi na |
|---|---|---|---|
| `/sr/blog/zamena-elektro-table-beograd-cena` | koliko košta zamena elektro table | komercijalna | `/usluge/elektro-table` |
| `/sr/blog/zasto-fid-iskace` | zašto iskače FID sklopka | informativna | `/usluge/zamena-osiguraca` |
| `/sr/blog/kako-proveriti-uticnicu` | kako proveriti utičnicu | informativna | `/usluge/zamena-uticnica` |
| `/sr/blog/lose-uzemljenje` | loše uzemljenje simptomi | informativna | `/usluge/uzemljenje` |
| `/sr/blog/opasna-instalacija-znaci` | opasna elektroinstalacija | hitna | `/usluge/dijagnostika-kvarova` |
| `/sr/blog/zasto-treperi-sijalica` | zašto treperi sijalica | informativna | `/usluge/rasveta` |
| `/sr/blog/zasto-se-greje-uticnica` | zašto se greje utičnica | hitna | `/usluge/zamena-uticnica` |
| `/sr/blog/zasto-pucaju-sijalice` | zašto pucaju sijalice | informativna | `/usluge/rasveta` |
| `/sr/blog/nestala-struja-u-delu-stana` | nestala struja u delu stana | hitna | `/usluge/dijagnostika-kvarova` |
| `/sr/blog/koliko-trosi-bojler` | koliko troši bojler | informativna | `/usluge/dijagnostika-kvarova` |
| `/sr/blog/koliko-trosi-klima` | koliko troši klima | informativna | `/usluge/dijagnostika-kvarova` |
| `/sr/blog/zasto-klima-izbacuje-osiguraca` | klima izbacuje osigurač | komercijalna | `/usluge/zamena-osiguraca` |
| `/sr/blog/koliko-uticnica-po-sobi` | koliko utičnica po sobi | informativna | `/usluge/nova-elektroinstalacija` |
| `/sr/blog/udar-struje-prva-pomoc` | strujni udar prva pomoć | hitna | `/usluge/dijagnostika-kvarova` |
| `/sr/blog/zasto-adapter-zuji` | adapter zuji | informativna | `/usluge/dijagnostika-kvarova` |

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
- Aluminijumska instalacija — kada se mora menjati
- Koliko košta ugradnja klime — elektro deo
- Zašto zvoni na vratima ne radi
- Koliko traje elektro instalacija i kada zvati koga
- Šta pregledati pri kupovini stana

Pre pisanja proveriti u ovoj tabeli da upit već nije pokriven. Ako jeste — dopuniti postojeći tekst umesto pisanja novog.

---

## Povezivanje

Cilj je da čovek koji dođe na bilo koju stranicu može dalje **kroz tekst**, ne kroz meni. To se ne održava dobrom voljom nego proverom.

`web/scripts/check-links.mjs` je vezan na `prebuild` i obara build ako:

- link vodi na stranicu koja ne postoji u tom jeziku
- stranica nema nijedan dolazni link iz nečijeg teksta (siroče)
- stranica ima manje od 3 linka u svom telu

Uz to, `buildLinkGraph()` gradi obrnuti indeks pa svaka stranica dole prikazuje „Pominje se u". Ta lista je izvedena iz stvarnih linkova, ne iz ručno održavanog polja, pa ne može da zastari.

Trenutno: 266 linkova u telu, prosek 5 po stranici, svih 53 stranice sa sadržajem dohvatljive sa početne u najviše tri klika kroz sam tekst.

**Pri pisanju novog teksta:** najmanje tri linka u telu, i bar jedna postojeća stranica mora da dobije link ka novoj. Inače build ne prolazi.

## Šta pratiti

U Search Console-u, mesečno:

- **Pozicija po upitima iz ove tabele.** Ako stranica rangira za nešto što nije u tabeli, dopuniti tabelu — to je stvarna namera koju smo promašili.
- **Stranice bez prikaza posle 8 nedelja** — ili nisu indeksirane, ili ciljaju upit koji niko ne traži.
- **Dva URL-a na istom upitu** — kanibalizacija, spojiti ih.

U Vercel Analytics-u:

- **`contact` događaji po `source`** — koje stranice zaista donose pozive. Stranica sa mnogo poseta i nula poziva ima problem sa CTA ili sa namerom, ne sa saobraćajem.
- **`assessment_submitted`** — prijave kroz formu, glavna konverzija.
