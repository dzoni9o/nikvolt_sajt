#!/usr/bin/env node
/**
 * Link-graph check. Runs as `prebuild`, so a broken content structure fails the
 * build instead of shipping.
 *
 * The site's goal is that a reader who lands anywhere can keep going through
 * the prose — not through the menu. That only stays true if it is enforced:
 * the moment somebody adds a page and forgets to link it, it becomes a dead
 * end and nothing complains. This does.
 *
 * Rules (Serbian only — it is the source language and the only locale with the
 * full page set; the commercial pages in en/ru are checked for broken links but
 * not for density, since their web of educational content does not exist):
 *
 *   1. No broken links   — every /collection/slug target must exist.
 *   2. No orphans        — every page must be linked from at least one body.
 *   3. Minimum outbound  — every content page needs MIN_OUTBOUND body links.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = path.join(process.cwd(), "src", "content");
const LINKABLE = ["blog", "usluge", "lokacije", "pojmovnik"];
const BODY_LINK = /\]\(\/(blog|usluge|lokacije|pojmovnik)\/([a-z0-9-]+)\)/g;

/** The source locale carries the full web and is held to the density rules. */
const PRIMARY = "sr";
const MIN_OUTBOUND = 3;

/**
 * Index pages link to every entry in their collection from the page body, so
 * entries are never truly orphaned in the crawl sense. This rule is about the
 * prose: a page nobody mentions in a sentence is a page no reader wanders into.
 */

function readLocale(locale) {
  const pages = new Map(); // "collection/slug" -> { collection, slug, file, content }
  for (const collection of LINKABLE) {
    const dir = path.join(ROOT, collection, locale);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const body = raw.replace(/^---\n[\s\S]*?\n---\n/, "");
      pages.set(`${collection}/${slug}`, {
        collection,
        slug,
        file: `src/content/${collection}/${locale}/${file}`,
        content: body,
      });
    }
  }
  return pages;
}

function analyse(locale) {
  const pages = readLocale(locale);
  const outbound = new Map();
  const inbound = new Map();
  const broken = [];

  for (const id of pages.keys()) {
    outbound.set(id, new Set());
    inbound.set(id, new Set());
  }

  for (const [id, page] of pages) {
    for (const m of page.content.matchAll(BODY_LINK)) {
      const to = `${m[1]}/${m[2]}`;
      if (to === id) continue;
      if (!pages.has(to)) {
        broken.push({ from: id, to, file: page.file });
        continue;
      }
      outbound.get(id).add(to);
      inbound.get(to).add(id);
    }
  }

  return { pages, outbound, inbound, broken };
}

let failed = false;
const problem = (msg) => {
  failed = true;
  console.error(`  ✗ ${msg}`);
};

for (const locale of fs
  .readdirSync(path.join(ROOT, "usluge"))
  .filter((d) => fs.statSync(path.join(ROOT, "usluge", d)).isDirectory())
  .sort()) {
  const { pages, outbound, inbound, broken } = analyse(locale);
  const isPrimary = locale === PRIMARY;

  console.log(
    `\n${locale}  ${pages.size} stranica` + (isPrimary ? "  (izvorni jezik)" : ""),
  );

  for (const b of broken) {
    problem(`${b.file}: link na /${b.to} — ta stranica ne postoji u "${locale}"`);
  }

  if (!isPrimary) {
    console.log("  linkovi provereni; gustina se ne proverava van izvornog jezika");
    continue;
  }

  const orphans = [...pages.keys()].filter((id) => inbound.get(id).size === 0);
  for (const id of orphans) {
    problem(
      `${pages.get(id).file}: siroče — nijedan tekst ne upućuje na ovu stranicu`,
    );
  }

  const thin = [...pages.keys()].filter(
    (id) => outbound.get(id).size < MIN_OUTBOUND,
  );
  for (const id of thin) {
    problem(
      `${pages.get(id).file}: samo ${outbound.get(id).size} linka u telu (minimum ${MIN_OUTBOUND})`,
    );
  }

  if (!failed) {
    const totalLinks = [...outbound.values()].reduce((n, s) => n + s.size, 0);
    const leastLinked = [...pages.keys()]
      .sort((a, b) => inbound.get(a).size - inbound.get(b).size)
      .slice(0, 3)
      .map((id) => `${id} (${inbound.get(id).size})`);
    console.log(`  ✓ 0 pokvarenih, 0 siročadi`);
    console.log(`  ✓ ${totalLinks} linkova u telu, prosek ${(totalLinks / pages.size).toFixed(1)} po stranici`);
    console.log(`  najslabije povezane: ${leastLinked.join(", ")}`);
  }
}

if (failed) {
  console.error(
    "\nProvera linkova nije prošla. Cilj je da se sa svake stranice može dalje kroz tekst — " +
      "popravi gore navedeno ili promeni pravila u scripts/check-links.mjs.\n",
  );
  process.exit(1);
}

console.log("\n✓ Provera linkova prošla.\n");
