import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { photos, type PhotoName } from "@/lib/photos";

/**
 * Galerija fotografija: na telefonu i tabletu traka koja se prevlači prstom,
 * na monitoru mreža manjih sličica.
 *
 * Prevlačenje radi na nativnom `scroll-snap`, bez ijednog bajta JavaScripta i
 * bez `"use client"` — isti HTML, a razliku u ponašanju pravi samo CSS:
 *
 *   telefon i tablet (< lg)     monitor (>= lg)
 *   flex + overflow-x-auto      grid
 *   snap-x snap-mandatory       snap-none
 *   86% širine, na tabletu 46%  po 2 ili 3 u redu
 *   traka ide od ivice do ivice unutar kontejnera
 *
 * Granica je `lg`, a ne `md`, jer hero tek na `lg` postaje dvokolonski. Na
 * 768 px je mreža stajala iznad naslova i zauzimala ceo prvi ekran: posetilac
 * je video šest fotografija, a ni naslov ni broj telefona. Tablet je uz to
 * dodirni uređaj, pa mu prevlačenje ionako leži.
 *
 * Nema tačkica ispod trake: aktivna tačkica mora da prati skrol, a to je
 * JavaScript i stanje. Umesto toga sledeća slika viri sa desne strane, što je
 * jasniji znak da ima još, pa ispod stoji i koliko ih je ukupno.
 *
 * Dimenzije dolaze iz `src/lib/photos.ts` (piše ga `scripts/photos.mjs`), pa
 * nema skoka u rasporedu dok se slike učitavaju.
 *
 * Opisi dolaze iz jednog prostora imena `Fotografije.<ime>`, zajedničkog za
 * sva mesta gde se slika pojavi. Ranije je svaka sekcija imala svoje, pa je
 * zamena slike ostavljala potpis napisan za prethodnu — tako je nastala tvrdnja
 * da na tabli stoji FID sklopka, koje na njoj nije bilo. Isto pravilo kao u
 * `foto.tsx`: alt i opis govore samo ono što se nesporno vidi na slici.
 */

type Varijanta = "traka" | "mreza";

const SIZES: Record<Varijanta, string> = {
  // Traka: 86vw na telefonu, 46vw na tabletu, pa dve kolone u desnoj polovini
  // heroja, pa tri u istoj polovini na najširem ekranu.
  traka:
    "(min-width: 1280px) 12rem, (min-width: 1024px) 14rem, (min-width: 768px) 46vw, 86vw",
  mreza: "(min-width: 768px) 22rem, 45vw",
};

// Negativna margina mora da poništi tačno `container-page`: 1.25rem (`5`) na
// telefonu, 2rem (`8`) od 768 px naviše. `scroll-px-*` drži isti razmak i kad
// traka stane na sledeću sliku, pa se slike poravnavaju sa tekstom iznad.
const OKVIR: Record<Varijanta, string> = {
  traka:
    "-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1 " +
    "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden " +
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground " +
    "md:-mx-8 md:scroll-px-8 md:px-8 " +
    "lg:mx-0 lg:grid lg:snap-none lg:grid-cols-2 lg:gap-3 lg:overflow-visible lg:px-0 " +
    "xl:grid-cols-3",
  mreza: "grid grid-cols-2 gap-4 md:grid-cols-3",
};

export async function Galerija({
  imena,
  varijanta,
  prioritetPrve = false,
  className = "",
}: {
  imena: PhotoName[];
  varijanta: Varijanta;
  prioritetPrve?: boolean;
  className?: string;
}) {
  const t = await getTranslations("Fotografije");
  const tG = await getTranslations("Galerija");
  const traka = varijanta === "traka";

  return (
    // `min-w-0` nije kozmetika. Stavka u gridu ima podrazumevano
    // `min-width: auto`, što znači „ne skupljaj se ispod sadržaja". Traka sa
    // negativnim marginama time razvuče celu kolonu: hero je na ekranu od
    // 390 px bio širok 432 px i stranica se skrolovala i levo-desno. Sa
    // `min-w-0` kolona ostaje 350 px, a traka ide tačno od ivice do ivice.
    <div className={`min-w-0 ${className}`}>
      <ul
        className={`m-0 list-none p-0 ${OKVIR[varijanta]}`}
        // Traka se pomera samo prevlačenjem, pa bez ovoga do slika iza prve
        // ne može da se dođe tastaturom.
        {...(traka
          ? { tabIndex: 0, role: "group", "aria-label": tG("ariaLabel") }
          : {})}
      >
        {imena.map((ime, i) => (
          <li
            key={ime}
            className={
              traka ? "shrink-0 basis-[86%] snap-start md:basis-[46%]" : undefined
            }
          >
            <figure className="m-0">
              <Image
                src={`/photos/${ime}.jpg`}
                alt={t(`${ime}.alt`)}
                width={photos[ime].w}
                height={photos[ime].h}
                sizes={SIZES[varijanta]}
                // Samo prva slika ide odmah; ostale se preuzimaju kad se do
                // njih prevuče ili skroluje. U vodoravnoj traci pregledač
                // slike van ekrana računa kao van ekrana, pa `lazy` radi i tu.
                //
                // Ne `priority`: u Next-u 16 je zastareo. Uputstvo za
                // `next/image` kaže da je za sliku koja je LCP bolje
                // `loading="eager"` sa `fetchPriority`, nego `preload`, koji
                // ubacuje <link> u <head>.
                {...(prioritetPrve && i === 0
                  ? { loading: "eager" as const, fetchPriority: "high" as const }
                  : { loading: "lazy" as const })}
                className="aspect-[4/3] w-full rounded-xl border border-border object-cover"
              />
              <figcaption className="mt-2 text-sm text-ink-soft">
                {t(`${ime}.opis`)}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {traka ? (
        <p className="mt-3 text-sm text-ink-soft lg:hidden">
          {tG("hint", { count: imena.length })}
        </p>
      ) : null}
    </div>
  );
}
