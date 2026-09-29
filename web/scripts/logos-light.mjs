/**
 * Generates the light-ground cut of the client logos.
 *
 * The thirteen supplied marks in `public/clients/` were normalised for v1's
 * hero, which is a near-black band: every painted fill is `#fff`, and the two
 * files that carry a knockout (UPS's shield, DocuSign's tile) use `#05080d`
 * for the holes. On a WHITE page that set renders as nothing at all.
 *
 * This writes `public/clients-light/` with the two roles swapped:
 *
 *     #fff     -> #14181A   the mark itself, in the system's near-black
 *     #05080d  -> #ffffff   the knockouts, which must now be the page
 *
 * A swap, not a filter. `brightness-0` in CSS would flatten BOTH roles to
 * black and fill in the UPS shield and the DocuSign tile — the same bug v1's
 * comment warns about, arriving from the other direction.
 *
 * The strip renders these at ~55% opacity, so they read as grey without a
 * third set of files.
 *
 * Re-run after replacing any mark:  node scripts/logos-light.mjs
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SRC = "public/clients";
const OUT = "public/clients-light";

/** The mark. `--ink` from the design system. */
const INK = "#14181A";
/** The holes. Must match the page they sit on, not "transparent" — these are
    painted shapes stacked over the mark, not cut-outs in it. */
const HOLE = "#ffffff";

mkdirSync(OUT, { recursive: true });

let written = 0;
for (const file of readdirSync(SRC).filter((f) => f.endsWith(".svg"))) {
  const src = readFileSync(join(SRC, file), "utf8");
  /* Via a sentinel, because the two roles swap INTO each other's values: a
     naive two-pass turns the knockouts white and then the second rule, which
     is looking for white, turns them straight back to ink. */
  const out = src
    .replace(/fill="#05080d"/gi, 'fill="__HOLE__"')
    .replace(/fill="#fff(?:fff)?"/gi, `fill="${INK}"`)
    .replaceAll('fill="__HOLE__"', `fill="${HOLE}"`);
  writeFileSync(join(OUT, file), out);
  const holes = (src.match(/#05080d/gi) ?? []).length;
  console.log(`  ${file.padEnd(20)} ${holes ? `${holes} knockout(s) -> white` : "flat mark"}`);
  written++;
}
console.log(`\n${written} marks written to ${OUT}`);
