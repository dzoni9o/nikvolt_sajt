// Priprema terenskih fotografija za sajt.
//
// Telefon pravi slike od 4096x3072 i 4 MB. Takve ne ulaze u repo: izvorni JPEG
// je samo master iz koga Next pravi AVIF i WebP u više širina, pa mu je 1800 px
// duže ivice sasvim dovoljno i za dupli piksel na desktopu.
//
// Metapodaci se brišu u celosti. GPS u ovoj seriji jeste bio prazan, ali slike
// dolaze iz tuđih stanova i nema razloga da model telefona i vreme snimanja
// putuju na javni sajt.
//
// Pokretanje:  FOTKE=/putanja/do/originala node scripts/photos.mjs [ime ...]
// Bez imena obrađuje sve. Originali se ne čuvaju u repou — u njemu stoji samo
// obrađena verzija; ovaj fajl pamti iz čega je i kako nastala.

import sharp from "sharp";
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const SRC = process.env.FOTKE;
if (!SRC) {
  console.error("Nedostaje FOTKE — direktorijum sa originalnim fotografijama.");
  console.error("Primer: FOTKE=~/Downloads/nikvolt node scripts/photos.mjs");
  process.exit(1);
}
const OUT = path.join(import.meta.dirname, "..", "public", "photos");

const MAX_EDGE = 1800;
const QUALITY = 78;

/**
 * `crop` je u udelima širine/visine izvorne slike, ne u pikselima, da ne zavisi
 * od toga da li je slika u međuvremenu zamenjena drugom rezolucijom.
 */
const PHOTOS = [
  // Jedini pravi par "pre i posle" — ista tabla, isti stan.
  {
    out: "tabla-pre",
    src: "79900236-image.jpg",
    // Kadar iz snimka ekrana: gore statusna traka telefona, dole sistemska crta.
    crop: { left: 0.07, top: 0.095, width: 0.86, height: 0.385 },
  },
  { out: "tabla-posle", src: "9b0a8394-image.jpg" },

  { out: "tabla-dva-reda", src: "a3620a3f-image.jpg" },
  { out: "zlebovi-i-kutije", src: "75cdeb2e-image.jpg" },
  { out: "novo-kolo-u-zidu", src: "4aefbdd1-image.jpg" },
  { out: "vodovi-po-plafonu", src: "351f468b-image.jpg" },
  { out: "utp-i-struja", src: "4e14a283-image.jpg" },
  { out: "kuhinja-u-radu", src: "4ef3788b-image.jpg" },
  { out: "dnevna-soba-rasveta", src: "3f63ca66-image.jpg" },
  { out: "linijska-rasveta", src: "0ef37bcc-image.jpg" },
  { out: "visilice-nad-stolom", src: "b0dcfb08-image.jpg" },
  { out: "spotovi-u-hodniku", src: "6db9cc01-image.jpg" },
  { out: "led-traka-dvoriste", src: "52303ed7-image.jpg" },
  { out: "led-traka-dvoriste-2", src: "955cc1ff-image.jpg" },
  { out: "kafic-rasveta", src: "bc04e419-image.jpg" },
  { out: "profesionalna-kuhinja", src: "7c15be3e-image.png" },
  { out: "kanalice-na-zidu", src: "72e4f655-image.png" },
  { out: "led-ispod-elemenata", src: "cf603563-image.png" },
  // Trava i zemlja se loše sabijaju, pa ova jedina traži niži kvalitet da ne
  // bude dvostruko teža od svih ostalih.
  { out: "nikola-na-terenu", src: "ccce2e5b-image.jpg", quality: 62 },
];

const only = new Set(process.argv.slice(2));
const todo = only.size ? PHOTOS.filter((p) => only.has(p.out)) : PHOTOS;
if (only.size && todo.length !== only.size) {
  const missing = [...only].filter((n) => !PHOTOS.some((p) => p.out === n));
  console.error(`Nepoznato ime: ${missing.join(", ")}`);
  process.exit(1);
}

await mkdir(OUT, { recursive: true });

let total = 0;
for (const p of todo) {
  const inPath = path.join(SRC, p.src);
  let img = sharp(inPath).rotate(); // rotate() bez ugla primenjuje EXIF orijentaciju

  if (p.crop) {
    const meta = await sharp(inPath).rotate().metadata();
    img = img.extract({
      left: Math.round(meta.width * p.crop.left),
      top: Math.round(meta.height * p.crop.top),
      width: Math.round(meta.width * p.crop.width),
      height: Math.round(meta.height * p.crop.height),
    });
  }

  const outPath = path.join(OUT, `${p.out}.jpg`);
  await img
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: p.quality ?? QUALITY, progressive: true, mozjpeg: true })
    .toFile(outPath);

  const { size } = await stat(outPath);
  const meta = await sharp(outPath).metadata();
  total += size;
  const warn = size > 400 * 1024 ? "  ← preko 400 KB" : "";
  console.log(
    `${p.out.padEnd(22)} ${String(meta.width).padStart(4)}x${String(meta.height).padEnd(4)} ` +
      `${(size / 1024).toFixed(0).padStart(4)} KB${warn}`,
  );
}

console.log(`${"UKUPNO".padEnd(22)} ${" ".repeat(9)} ${(total / 1024 / 1024).toFixed(2)} MB`);

// Stare slike koje izlaze ne brišemo odavde — to ide kroz git, da se vidi u diffu.
const left = (await readdir(OUT)).filter((f) => f.endsWith(".jpg")).length;
console.log(`U public/photos ima ${left} fajlova.`);

// Manifest se piše uvek iz svih slika, ne samo iz obrađenih u ovom pozivu, da
// se ne razilazi od onoga što stvarno stoji u public/photos. Komponenta iz
// njega čita tačnu širinu i visinu, pa ne mora da seče sliku u zadati odnos
// niti da ostavi prazninu dok se učitava.
const manifest = {};
for (const p of PHOTOS) {
  const m = await sharp(path.join(OUT, `${p.out}.jpg`)).metadata();
  manifest[p.out] = { w: m.width, h: m.height };
}
const lines = Object.entries(manifest)
  .map(([k, v]) => `  "${k}": { w: ${v.w}, h: ${v.h} },`)
  .join("\n");
await writeFile(
  path.join(import.meta.dirname, "..", "src", "lib", "photos.ts"),
  `// Generisano: node scripts/photos.mjs — ne menjati ručno.\n` +
    `// Dimenzije svake fotografije u public/photos, da <Foto> ne mora da\n` +
    `// pretpostavlja odnos stranica niti da seče sliku.\n\n` +
    `export const photos = {\n${lines}\n} as const;\n\n` +
    `export type PhotoName = keyof typeof photos;\n`,
  "utf-8",
);
console.log(`Manifest: src/lib/photos.ts, ${Object.keys(manifest).length} slika.`);
