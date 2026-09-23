/**
 * Optical scale for the client rail, measured rather than guessed.
 *
 * Every supplied vector carries a different amount of empty space inside its
 * viewBox — Sandoz's wordmark fills 15% of its box height, Alcon's fills 100% —
 * so one CSS height gives thirteen different apparent sizes. That is what made
 * the first rail come out with some marks four times the weight of others.
 *
 * So: render each file, find the bounding box of the actual ink, and normalise.
 * The weight is `inkFillH x ratio^0.35`, not a true geometric mean: a geometric
 * mean weights width and height equally, which is right for a symbol and wrong
 * for a wordmark, and twelve of these thirteen are wordmarks where the eye reads
 * cap height first.
 *
 * Re-run this whenever a logo file is replaced, and paste the result into
 * `LOGOS.items` in `src/lib/home-content.ts`. Do not hand-tune the numbers.
 *
 * Needs the dev server on :3000 — the canvas read has to be same-origin, and a
 * file:// image on about:blank taints it.
 *
 *   node scripts/inkscale.mjs
 */
import { chromium } from "playwright";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const ORIGIN = process.env.QA_ORIGIN ?? "http://localhost:3000";
const dir = fileURLToPath(new URL("../public/clients", import.meta.url));
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".svg"));

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 800, height: 400 } });
await page.goto(ORIGIN, { waitUntil: "domcontentloaded" });

const rows = [];
for (const f of files) {
  const r = await page.evaluate(
    (url) =>
      new Promise((res) => {
        const img = new Image();
        img.onload = () => {
          const H = 400;
          const W = Math.max(1, Math.round((img.naturalWidth / img.naturalHeight) * H));
          const cv = document.createElement("canvas");
          cv.width = W;
          cv.height = H;
          const ctx = cv.getContext("2d");
          ctx.drawImage(img, 0, 0, W, H);
          const d = ctx.getImageData(0, 0, W, H).data;
          let x0 = W,
            y0 = H,
            x1 = -1,
            y1 = -1;
          for (let y = 0; y < H; y++)
            for (let x = 0; x < W; x++) {
              // Alpha AND brightness. The knockout paths are painted in the
              // band's own ground colour, so they are opaque but are holes in
              // the mark, not ink — counting them inflates the bounding box.
              const i = (y * W + x) << 2;
              if (d[i + 3] < 24) continue;
              if (d[i] + d[i + 1] + d[i + 2] < 90) continue;
              if (x < x0) x0 = x;
              if (x > x1) x1 = x;
              if (y < y0) y0 = y;
              if (y > y1) y1 = y;
            }
          res(x1 < 0 ? null : { boxW: W, boxH: H, inkW: x1 - x0 + 1, inkH: y1 - y0 + 1 });
        };
        img.onerror = () => res(null);
        img.src = url;
      }),
    `${ORIGIN}/clients/${f}`,
  );
  if (!r) {
    console.log(`FAILED  ${f} — no ink found, or the file did not load`);
    continue;
  }
  rows.push({ f, fillH: r.inkH / r.boxH, ratio: r.inkW / r.inkH });
}
await browser.close();

const weight = (r) => r.fillH * Math.pow(r.ratio, 0.35);
const median = rows.map(weight).sort((a, b) => a - b)[Math.floor(rows.length / 2)];

console.log("file                     inkFillH  ratio   scale");
for (const r of rows.sort((a, b) => a.f.localeCompare(b.f))) {
  // Clamped: a mark needing more than 3.5x is fighting its own file, and blowing
  // it up that far only makes the trace's roughness visible. Recrop it instead.
  const s = Math.min(3.5, Math.max(0.35, median / weight(r)));
  console.log(
    `${r.f.padEnd(24)} ${r.fillH.toFixed(2)}     ${r.ratio.toFixed(2).padStart(5)}   ${s.toFixed(2)}`,
  );
}
