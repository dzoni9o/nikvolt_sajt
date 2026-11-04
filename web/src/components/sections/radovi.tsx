import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { photos, type PhotoName } from "@/lib/photos";

/**
 * Fotografije stvarnih radova na naslovnoj.
 *
 * Namerno bez verzalnog natpisa iznad naslova: takvih sitnih „kicker" redova
 * na sajtu već ima 59 i oni su najjači razlog zašto stranica deluje kao
 * softverska, a ne kao majstorska. Ova sekcija ne dodaje šezdeseti.
 *
 * Dimenzije dolaze iz manifesta koji piše scripts/photos.mjs, pa nema skoka u
 * rasporedu dok se slike učitavaju.
 */

const GRID: PhotoName[] = [
  "dnevna-soba-rasveta",
  "zlebovi-i-kutije",
  "led-traka-dvoriste",
  "kafic-rasveta",
  "profesionalna-kuhinja",
  // Ne „linijska-rasveta": to je ista dnevna soba kao prva slika u mreži, samo
  // iz drugog ugla, pa je izgledalo kao da nema više od jednog posla.
  "kanalice-na-zidu",
];

const PAR = { pre: "tabla-pre", posle: "tabla-posle" } as const;

export async function Radovi() {
  const t = await getTranslations("Radovi");

  return (
    <section id="radovi" className="container-page py-20 md:py-28">
      <h2 className="font-display text-balance text-2xl font-bold text-foreground sm:text-3xl">
        {t("title")}
      </h2>
      <p className="mt-3 max-w-xl text-base text-ink-soft sm:text-lg">
        {t("lead")}
      </p>

      {/* Jedini pravi par pre/posle koji postoji: ista tabla, isti stan. */}
      <figure className="mt-10 m-0 max-w-2xl">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="mb-1.5 text-sm font-semibold text-foreground">
              {t("pre")}
            </div>
            <Image
              src={`/photos/${PAR.pre}.jpg`}
              alt={t("parAltPre")}
              width={photos[PAR.pre].w}
              height={photos[PAR.pre].h}
              sizes="(min-width: 768px) 20rem, 45vw"
              className="h-auto w-full rounded-xl border border-border"
            />
          </div>
          <div>
            <div className="mb-1.5 text-sm font-semibold text-foreground">
              {t("posle")}
            </div>
            <Image
              src={`/photos/${PAR.posle}.jpg`}
              alt={t("parAltPosle")}
              width={photos[PAR.posle].w}
              height={photos[PAR.posle].h}
              sizes="(min-width: 768px) 20rem, 45vw"
              className="h-auto w-full rounded-xl border border-border"
            />
          </div>
        </div>
        <figcaption className="mt-3 text-sm text-ink-soft">
          {t("parOpis")}
        </figcaption>
      </figure>

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
        {GRID.map((ime) => (
          <figure key={ime} className="m-0">
            <Image
              src={`/photos/${ime}.jpg`}
              alt={t(`slike.${ime}.alt`)}
              width={photos[ime].w}
              height={photos[ime].h}
              sizes="(min-width: 768px) 24rem, 45vw"
              className="aspect-[4/3] w-full rounded-xl border border-border object-cover"
            />
            <figcaption className="mt-2 text-sm text-ink-soft">
              {t(`slike.${ime}.opis`)}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
