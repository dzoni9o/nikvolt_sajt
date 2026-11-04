import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { photos, type PhotoName } from "@/lib/photos";

/**
 * Slike u telu teksta.
 *
 * MDX u ovom projektu ne prosleđuje izraze u atributima — `heading={false}` je
 * ranije tiho ignorisan — pa sve propse primaju kao obične stringove, bez
 * vitičastih zagrada. Zato se slika bira imenom iz `public/photos`, a ne
 * putanjom, i zato nema nijednog boolean propa.
 *
 *   <Foto ime="zlebovi-i-kutije" alt="..." opis="..." />
 *   <PrePosle pre="tabla-pre" posle="tabla-posle" altPre="..." altPosle="..." opis="..." />
 *
 * Dimenzije dolaze iz `src/lib/photos.ts`, koji piše `scripts/photos.mjs`, pa
 * se slika ne seče u pretpostavljeni odnos i ne ostavlja prazninu dok se
 * učitava.
 *
 * PRAVILO ZA `alt` I `opis`: opisuju samo ono što je nesporno vidljivo na
 * slici. Nijedan uređaj se ne imenuje dok Nikola ne potvrdi šta je. Ovo je
 * napisano posle greške u kojoj je potpis tvrdio da na tabli stoji FID
 * sklopka, a na njoj je nije bilo — potpis je bio napisan za drugu
 * fotografiju i ostao kad je slika zamenjena.
 */

function isKnown(ime: string): ime is PhotoName {
  return ime in photos;
}

function Slika({
  ime,
  alt,
  sizes,
}: {
  ime: PhotoName;
  alt: string;
  sizes: string;
}) {
  const { w, h } = photos[ime];
  return (
    <Image
      src={`/photos/${ime}.jpg`}
      alt={alt}
      width={w}
      height={h}
      sizes={sizes}
      className="h-auto w-full rounded-xl border border-border"
    />
  );
}

/** Nepoznato ime je greška autora teksta; vidi se u logu, stranica ne pada. */
function warnUnknown(gde: string, ime: string) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`<${gde}>: nepoznata slika "${ime}" — vidi src/lib/photos.ts`);
  }
}

export function Foto({
  ime,
  alt,
  opis,
}: {
  ime: string;
  alt: string;
  opis?: string;
}) {
  if (!isKnown(ime)) {
    warnUnknown("Foto", ime);
    return null;
  }
  const { w, h } = photos[ime];
  // Uspravna slika preko cele širine teksta bila bi viša od ekrana telefona,
  // pa se sužava. Položena ide punom širinom kolone.
  const uspravna = h > w;
  return (
    <figure className="my-7" style={uspravna ? { maxWidth: "24rem" } : undefined}>
      <Slika
        ime={ime}
        alt={alt}
        sizes={uspravna ? "(min-width: 768px) 24rem, 90vw" : "(min-width: 768px) 42rem, 100vw"}
      />
      {opis ? (
        <figcaption className="mt-2 text-sm text-ink-soft">{opis}</figcaption>
      ) : null}
    </figure>
  );
}

export async function PrePosle({
  pre,
  posle,
  altPre,
  altPosle,
  opis,
}: {
  pre: string;
  posle: string;
  altPre: string;
  altPosle: string;
  opis?: string;
}) {
  if (!isKnown(pre) || !isKnown(posle)) {
    if (!isKnown(pre)) warnUnknown("PrePosle", pre);
    if (!isKnown(posle)) warnUnknown("PrePosle", posle);
    return null;
  }
  // Natpisi idu kroz prevode: komponenta može da se nađe i u engleskom i u
  // ruskom tekstu, a tamo „Pre“ i „Posle“ ne znače ništa.
  const t = await getTranslations("Foto");
  return (
    <figure className="my-7">
      {/* Natpis stoji iznad slike, ne ispod: dve fotografije retko imaju isti
          odnos stranica, pa bi se natpisi ispod razišli po visini. */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1.5 text-sm font-semibold text-foreground">{t("pre")}</div>
          <Slika ime={pre} alt={altPre} sizes="(min-width: 768px) 20rem, 45vw" />
        </div>
        <div>
          <div className="mb-1.5 text-sm font-semibold text-foreground">{t("posle")}</div>
          <Slika ime={posle} alt={altPosle} sizes="(min-width: 768px) 20rem, 45vw" />
        </div>
      </div>
      {opis ? (
        <figcaption className="mt-2 text-sm text-ink-soft">{opis}</figcaption>
      ) : null}
    </figure>
  );
}
