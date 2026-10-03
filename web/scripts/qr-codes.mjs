/**
 * Writes and checks the Berg page's two store QR codes, the generated block in
 * `src/components/berg/qr-codes.ts`.
 *
 * Run from web/. Neither `qrcode` nor `jsqr` is a dependency of this app, and
 * neither should become one for two strings that change once a year, so they
 * are installed for the run only (`--no-save` leaves package.json and the lock
 * alone; the next plain `npm install` prunes them again):
 *
 *   npm i --no-save qrcode jsqr && node scripts/qr-codes.mjs --check
 *
 *   --check   (the default) verifies what ships, and exits 1 on any failure:
 *             1. the block in qr-codes.ts is exactly what --write would write
 *                from URLS below, so a hand edit to a `url` or a `path`, or a
 *                URL changed here without a --write, fails;
 *             2. each SHIPPED path is rendered at 400px, dark on white, by
 *                sharp (an independent SVG rasterizer, not this script's own
 *                matrix), decoded with jsQR, and the text must equal its
 *                `url` exactly;
 *             3. both codes are the same size.
 *   --write   regenerates the block from URLS (only the lines between the
 *             @@generated markers change), then runs the check.
 *
 * Already have the two packages somewhere else? `NODE_PATH=<that>/node_modules
 * node scripts/qr-codes.mjs --check` resolves them from there. sharp needs no
 * install: it arrives with next.
 *
 * How a code is drawn:
 *   1. `QRCode.create(url, { errorCorrectionLevel: "M", version })` gives the
 *      module matrix. Level M survives about 15% damage; Q and H buy
 *      robustness against stickers and scuffs that a code on a screen never
 *      suffers, and pay for it in density.
 *   2. ONE version for every code, the smallest that holds the longest URL, so
 *      two codes on identical tiles have identical modules. Today that is
 *      version 5 (37 modules): the Play Store URL is 83 bytes and 5-M holds
 *      84, so one more character moves both codes to version 6 (41).
 *   3. Every horizontal run of dark modules becomes one closed rectangle,
 *      `m<dx> <dy>h<n>v1h-<n>z`, relative to the previous run's start, so a
 *      whole code is a single path.
 *   4. A 4-module quiet zone on every side, which is what the spec asks for:
 *      `size` is the matrix plus 8, and the viewBox is `0 0 size size`.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

/** The two store listings. The web app's address is not here: it has no code
    (see `BERG_APP_URL` in lib/berg-content.ts). */
const URLS = {
  android: "https://play.google.com/store/apps/details?id=com.shrewd.berg&pcampaignid=web_share",
  ios: "https://apps.apple.com/in/app/berg-hazeberg/id6756188557",
};

const LEVEL = "M";
const QUIET = 4;
const RENDER_PX = 400;
const FILE = fileURLToPath(new URL("../src/components/berg/qr-codes.ts", import.meta.url));
const BLOCK = /(\/\/ @@generated:start)\r?\n[\s\S]*?(\r?\n[ \t]*\/\/ @@generated:end)/;

const require = createRequire(import.meta.url);
function need(name) {
  try {
    return require(name);
  } catch {
    console.error(`qr-codes: cannot find "${name}". From web/: npm i --no-save qrcode jsqr`);
    process.exit(2);
  }
}

/* -- generate ------------------------------------------------------------- */

function generate() {
  const QRCode = need("qrcode");
  const version = Math.max(
    ...Object.values(URLS).map((url) => QRCode.create(url, { errorCorrectionLevel: LEVEL }).version),
  );
  const codes = {};
  for (const [key, url] of Object.entries(URLS)) {
    const qr = QRCode.create(url, { errorCorrectionLevel: LEVEL, version });
    const n = qr.modules.size;
    let d = "";
    let px = 0;
    let py = 0;
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; ) {
        if (!qr.modules.get(y, x)) {
          x++;
          continue;
        }
        let len = 1;
        while (x + len < n && qr.modules.get(y, x + len)) len++;
        const ax = x + QUIET;
        const ay = y + QUIET;
        d += d ? `m${ax - px} ${ay - py}` : `M${ax} ${ay}`;
        d += `h${len}v1h-${len}z`;
        px = ax;
        py = ay;
        x += len;
      }
    }
    codes[key] = { url, version: qr.version, modules: n, size: n + QUIET * 2, path: d };
  }
  return codes;
}

function serialize(codes) {
  return Object.entries(codes)
    .map(
      ([key, c]) =>
        `  ${key}: {\n    url: ${JSON.stringify(c.url)},\n    size: ${c.size},\n    path: ${JSON.stringify(c.path)},\n  },`,
    )
    .join("\n");
}

function shippedBlock(src) {
  const m = src.match(BLOCK);
  if (!m) throw new Error(`qr-codes: no @@generated markers in ${FILE}`);
  return m[0].replace(/^\/\/ @@generated:start\r?\n/, "").replace(/\r?\n[ \t]*\/\/ @@generated:end$/, "");
}

function shippedCodes(block) {
  const re = /(\w+): \{\s*url: ("(?:[^"\\]|\\.)*"),\s*size: (\d+),\s*path: ("(?:[^"\\]|\\.)*"),\s*\}/g;
  const out = {};
  for (const m of block.matchAll(re)) {
    out[m[1]] = { url: JSON.parse(m[2]), size: Number(m[3]), path: JSON.parse(m[4]) };
  }
  return out;
}

/* -- check ---------------------------------------------------------------- */

async function check() {
  const sharp = need("sharp");
  const jsQR = need("jsqr");
  const src = readFileSync(FILE, "utf8");
  const block = shippedBlock(src);
  const expected = generate();
  const shipped = shippedCodes(block);
  let ok = true;
  const fail = (msg) => {
    ok = false;
    console.log(`  FAIL ${msg}`);
  };

  const inSync = block.replace(/\r\n/g, "\n") === serialize(expected);
  console.log(`qr-codes.ts block ${inSync ? "matches" : "DIFFERS FROM"} a fresh --write`);
  if (!inSync) fail("the shipped block is stale or hand-edited; run --write");

  for (const key of Object.keys(URLS)) {
    if (!shipped[key]) fail(`${key}: missing from qr-codes.ts`);
  }

  for (const [key, c] of Object.entries(shipped)) {
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${c.size} ${c.size}" width="${RENDER_PX}" height="${RENDER_PX}" shape-rendering="crispEdges">` +
      `<rect width="${c.size}" height="${c.size}" fill="#ffffff"/><path d="${c.path}" fill="#14181A"/></svg>`;
    const { data, info } = await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const hit = jsQR(new Uint8ClampedArray(data), info.width, info.height);
    const got = hit ? hit.data : null;
    const match = got === c.url;
    console.log(
      `${key}: ${info.width}x${info.height}px, viewBox ${c.size} -> ${JSON.stringify(got)}` +
        ` (version ${hit ? hit.version : "-"}) ${match ? "MATCH" : "MISMATCH"}`,
    );
    if (!match) fail(`${key}: decodes to ${JSON.stringify(got)}, expected ${JSON.stringify(c.url)}`);
    if (URLS[key] !== c.url) fail(`${key}: ships ${c.url}, this script says ${URLS[key]}`);
  }

  const sizes = new Set(Object.values(shipped).map((c) => c.size));
  if (sizes.size > 1) fail(`codes differ in size (${[...sizes].join(", ")}): their modules will not match`);

  console.log(ok ? "ok" : "FAILED");
  if (!ok) process.exitCode = 1;
}

/* -- main ----------------------------------------------------------------- */

if (process.argv.includes("--write")) {
  const codes = generate();
  for (const [key, c] of Object.entries(codes)) {
    console.log(`${key}: version ${c.version}, ${c.modules} modules, viewBox ${c.size}, path ${c.path.length} chars`);
  }
  const src = readFileSync(FILE, "utf8");
  const eol = src.includes("\r\n") ? "\r\n" : "\n";
  const next = src.replace(BLOCK, (_, start, end) => `${start}${eol}${serialize(codes).replace(/\n/g, eol)}${end}`);
  if (next === src) {
    console.log("qr-codes.ts already up to date");
  } else {
    writeFileSync(FILE, next);
    console.log(`wrote ${FILE}`);
  }
}
await check();
