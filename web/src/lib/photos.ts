// Generisano: node scripts/photos.mjs — ne menjati ručno.
// Dimenzije svake fotografije u public/photos, da <Foto> ne mora da
// pretpostavlja odnos stranica niti da seče sliku.

export const photos = {
  "tabla-pre": { w: 929, h: 901 },
  "tabla-posle": { w: 1085, h: 1450 },
  "tabla-dva-reda": { w: 1800, h: 1350 },
  "zlebovi-i-kutije": { w: 1800, h: 1350 },
  "novo-kolo-u-zidu": { w: 1800, h: 1350 },
  "vodovi-po-plafonu": { w: 1350, h: 1800 },
  "utp-i-struja": { w: 1800, h: 1350 },
  "kuhinja-u-radu": { w: 1800, h: 1350 },
  "dnevna-soba-rasveta": { w: 1800, h: 1013 },
  "linijska-rasveta": { w: 1800, h: 1013 },
  "visilice-nad-stolom": { w: 1350, h: 1800 },
  "spotovi-u-hodniku": { w: 1350, h: 1800 },
  "led-traka-dvoriste": { w: 1800, h: 1350 },
  "led-traka-dvoriste-2": { w: 1800, h: 1350 },
  "kafic-rasveta": { w: 1800, h: 1350 },
  "profesionalna-kuhinja": { w: 1449, h: 1085 },
  "kanalice-na-zidu": { w: 1448, h: 1086 },
  "led-ispod-elemenata": { w: 1450, h: 1085 },
  "nikola-na-terenu": { w: 1200, h: 1600 },
} as const;

export type PhotoName = keyof typeof photos;
