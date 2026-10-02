/**
 * The land under About's delivery map, as a grid of dots.
 *
 * cobe (already a dependency — it draws What we do's globe) ships its land as
 * a 1-bit equirectangular mask, 256x128, inlined in its bundle as a base64
 * PNG. That is the whole world at 1.40625 degrees a pixel, which is all a
 * dotted map at hero size needs, and it is already ours to use (MIT).
 *
 * So: lift the PNG out of the bundle, decode it, PROVE the projection before
 * trusting it — known land is land, known sea is sea, and three coastlines
 * fall where an atlas puts them — then resample it onto the map's own grid
 * and write the result as run-length rows.
 *
 * Resampling is by area, not by nearest pixel: each grid cell is probed at
 * 5x5 points and counts as land when at least `LAND` of them are. Nearest-
 * pixel sampling at a pitch that is not a multiple of the source's aliases
 * into a moire of missing rows along every coast.
 *
 * The output is `src/components/about/world-dots.ts`. Re-run this only to
 * change the pitch or the crop, and never hand-edit the result:
 *
 *   node scripts/world-dots.mjs
 *
 * Run from `web/`. sharp is resolved from this project's node_modules (it
 * arrives with Next), not installed for this.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require(path.resolve("node_modules/sharp"));

/** Degrees between neighbouring dots, both ways. */
const PITCH = 1.8;
/** The crop: north of 76 the mask paints the Arctic as solid land, and south
    of -56 there is only Antarctica, which is also a solid band in it. */
const TOP = 76;
const ROWS = 74; // TOP down to TOP - 73 * PITCH = -55.4
const COLS = Math.round(360 / PITCH); // 200
/** Share of a cell's probes that must be land. */
const LAND = 0.36;
const PROBES = 5;

const OUT = path.resolve("src/components/about/world-dots.ts");

/* -- the mask ----------------------------------------------------------- */
const bundle = fs.readFileSync(path.resolve("node_modules/cobe/dist/index.esm.js"), "utf8");
const found = bundle.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/);
if (!found) throw new Error("cobe's land mask was not found in its bundle");
const { data, info } = await sharp(Buffer.from(found[1], "base64"))
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
if (W !== 2 * H) throw new Error(`expected a 2:1 equirectangular mask, got ${W}x${H}`);

/** Land at a pixel. */
const px = (x, y) => data[(y * W + x) * C] > 127;
/** Land at a longitude/latitude: x = 0 is 180W, y = 0 is 90N. */
const at = (lon, lat) => {
  const x = Math.min(W - 1, Math.max(0, Math.floor(((lon + 180) / 360) * W)));
  const y = Math.min(H - 1, Math.max(0, Math.floor(((90 - lat) / 180) * H)));
  return px(x, y);
};

/* -- prove the projection ----------------------------------------------- */
const LANDS = [
  ["the Deccan", 18, 78],
  ["the Sahara", 23, 10],
  ["central Australia", -25, 134],
  ["the Amazon", -6, -60],
  ["Kansas", 39, -98],
  ["Siberia", 62, 100],
  ["Coimbatore", 11.0168, 76.9558],
];
const SEAS = [
  ["the mid-Pacific", 0, -150],
  ["the mid-Atlantic", 30, -40],
  ["the Indian Ocean", -20, 80],
  ["the Bay of Bengal", 15, 88],
  ["the Tasman Sea", -38, 160],
];
const wrong = [
  ...LANDS.filter(([, lat, lon]) => !at(lon, lat)).map(([n]) => `${n} reads as sea`),
  ...SEAS.filter(([, lat, lon]) => at(lon, lat)).map(([n]) => `${n} reads as land`),
];

/* Coastlines along a parallel: [first land, last land] inside a window, which
   an atlas puts within a pixel and a half of these. */
const COASTS = [
  ["Africa at the equator", 0, [0, 60], [9.3, 42]],
  ["South America at 30S", -30, [-90, -30], [-71.5, -50]],
  ["Australia at 30S", -30, [100, 170], [115, 153.2]],
];
for (const [name, lat, [from, to], [west, east]] of COASTS) {
  let first = null;
  let last = null;
  for (let lon = from; lon <= to; lon += 0.1) {
    if (at(lon, lat)) {
      first ??= lon;
      last = lon;
    }
  }
  const slack = (360 / W) * 1.5;
  if (first === null || Math.abs(first - west) > slack || Math.abs(last - east) > slack)
    wrong.push(`${name}: ${first?.toFixed(1)}..${last?.toFixed(1)}, expected ${west}..${east}`);
}
if (wrong.length) throw new Error(`the mask is not the projection assumed:\n  ${wrong.join("\n  ")}`);

/* -- resample ----------------------------------------------------------- */
const rows = [];
let dots = 0;
for (let j = 0; j < ROWS; j++) {
  const lat = TOP - j * PITCH;
  const runs = [];
  let start = -1;
  for (let i = 0; i <= COLS; i++) {
    let land = false;
    if (i < COLS) {
      const lon = -180 + (i + 0.5) * PITCH;
      let hits = 0;
      for (let a = 0; a < PROBES; a++)
        for (let b = 0; b < PROBES; b++)
          if (
            at(
              lon + ((a + 0.5) / PROBES - 0.5) * PITCH,
              lat + ((b + 0.5) / PROBES - 0.5) * PITCH,
            )
          )
            hits++;
      land = hits / (PROBES * PROBES) >= LAND;
    }
    if (land && start < 0) start = i;
    if (!land && start >= 0) {
      runs.push(start, i - start);
      dots += i - start;
      start = -1;
    }
  }
  rows.push(runs);
}

/* -- write -------------------------------------------------------------- */
const body = rows.map((r) => `  [${r.join(",")}],`).join("\n");
const src = `/**
 * The land under About's delivery map — GENERATED by \`scripts/world-dots.mjs\`
 * from cobe's equirectangular land mask. Do not edit; re-run the script.
 *
 * A ${COLS} x ${ROWS} grid, one cell every ${PITCH} degrees: column \`i\` is centred on
 * longitude \`-180 + (i + 0.5) * ${PITCH}\`, row \`j\` on latitude \`${TOP} - j * ${PITCH}\`.
 * Each row is its land as run-length pairs — start column, number of cells.
 * ${dots} dots.
 */
export const DOT_PITCH = ${PITCH};
export const DOT_TOP = ${TOP};
export const DOT_COLS = ${COLS};

export const DOT_ROWS: readonly (readonly number[])[] = [
${body}
];
`;
fs.writeFileSync(OUT, src);

/* A look at what was written, for the terminal. */
console.log(
  rows
    .map((r) => {
      const line = Array(COLS).fill(" ");
      for (let k = 0; k < r.length; k += 2) for (let n = 0; n < r[k + 1]; n++) line[r[k] + n] = "o";
      return line.join("");
    })
    .join("\n"),
);
console.log(`\n${dots} dots in ${ROWS} rows; ${(src.length / 1024).toFixed(1)} KB -> ${path.relative(process.cwd(), OUT)}`);
