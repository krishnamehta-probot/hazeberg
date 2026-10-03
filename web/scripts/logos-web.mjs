/**
 * Imports the client marks that were NOT supplied, from each company's own
 * website, and normalises them for the hero's dark rail.
 *
 * The thirteen in `public/clients/` arrived as vectors (`design/clients-source/`)
 * and were normalised once at import. The owner's list of 2026-10-03 named three
 * direct clients with no file in the project — ScribeAmerica, Ramsay Health Care
 * and JMAN Group — so these are taken from the header of each company's own
 * site and put through the same normalisation:
 *
 *   - every painted fill forced to `#fff`, because the rail is `--void`
 *   - every DARK painted fill forced to `#05080d` instead, because on these
 *     traces a dark fill is a knockout, not a mark — the rule that keeps the UPS
 *     shield from turning into a blank slab. None of the three sources has one
 *     today; the rule is here so a replaced source cannot sneak one past it.
 *
 * Fills inside a `<mask>` are left exactly as they came. They are not paint, they
 * are the mask's own luminance, and `scripts/logos-light.mjs` must not find them:
 * it swaps `#fff` for ink, and an ink-coloured luminance mask would hide the very
 * mark it clips.
 *
 * **ScribeAmerica only offers a raster.** Its header logo is a 2560x293 PNG, the
 * largest the site serves (WordPress's `-scaled` cap; the unscaled original is not
 * public). The file written here is still an `.svg`: the PNG's alpha becomes a
 * mask, and the paint is one `<rect fill="#fff">` under it. That is what lets this
 * mark go through the same two scripts as the vectors without either of them
 * changing — `inkscale.mjs` only reads `.svg`, and `logos-light.mjs` recolours by
 * swapping `fill` attributes, which a bitmap has none of. The pixels are not
 * resampled; only their colour is dropped.
 *
 * Geometry is never touched (rule: supplied assets are not redrawn). viewBoxes,
 * paths and the raster's dimensions are kept as served.
 *
 * WEB-SOURCED, NOT SUPPLIED. Every URL below is the company's own, and the owner
 * should confirm each mark before launch. ScribeAmerica's site answers HTML
 * requests from here with a Cloudflare 403, so its header was read from the
 * Internet Archive's capture of 2026-09-29; the PNG itself is fetched live from
 * scribeamerica.com. Ramsay's group site (ramsayhealth.com) carries only a JPEG
 * in its header, so the vector is the one in the header of Ramsay Health Care's
 * own Australian site.
 *
 *   node scripts/logos-web.mjs
 *
 * Then, in this order:
 *   node scripts/logos-light.mjs   the light cut for /v2
 *   node scripts/inkscale.mjs      (dev server on :3000) and paste the scales
 *                                  into `LOGOS.items` in `src/lib/home-content.ts`
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const OUT = fileURLToPath(new URL("../public/clients/", import.meta.url));

/* A browser's user agent: two of the three sites refuse the default one. */
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const SOURCES = [
  {
    file: "scribeamerica.svg",
    name: "ScribeAmerica",
    /* The `<img>` in `header.main-header .site-logo` on https://www.scribeamerica.com/ */
    url: "https://www.scribeamerica.com/wp-content/uploads/sites/2/2025/11/SA-Logo-Full-Color-scaled.png",
    kind: "raster",
  },
  {
    file: "ramsay-health-care.svg",
    name: "Ramsay Health Care",
    /* The header logo on https://www.ramsayhealth.com.au/ — inlined there as
       SVG and served at this path. Its blue hover twin is
       `/globalassets/images/all-sites-images/logos/rhc-blue-hover-logo.svg`. */
    url: "https://www.ramsayhealth.com.au/globalassets/images/rhc-logo-nav.svg",
    kind: "vector",
  },
  {
    file: "jman-group.svg",
    name: "JMAN Group",
    /* The `img.astra-logo-svg` in the header of https://jmangroup.com/ */
    url: "https://cdn.jmangroup.com/wp-content/uploads/2024/04/26045830/Link-%E2%86%92-SVG-1.svg",
    kind: "vector",
  },
];

const KNOCKOUT = "#05080d";

const NAMED = { white: "#ffffff", black: "#000000" };

/** sRGB hex (3 or 6 digits, or a named white/black) to relative luminance. */
function luminance(value) {
  const hex = (NAMED[value.toLowerCase()] ?? value).replace("#", "");
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(full.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Painted fills to `#fff` (or the knockout), mask contents untouched. */
function normaliseVector(src) {
  const counts = { mark: 0, knockout: 0, mask: 0 };
  /* Split on mask boundaries so a fill can be told apart by where it sits.
     Masks in these files do not nest inside each other, only inside groups. */
  const parts = src.split(/(<mask[\s\S]*?<\/mask>)/);
  const out = parts
    .map((part) => {
      if (part.startsWith("<mask")) {
        counts.mask += (part.match(/fill="/g) ?? []).length;
        return part;
      }
      return part.replace(/fill="([^"]*)"/g, (whole, value) => {
        if (value === "none") return whole;
        const l = luminance(value);
        if (l === null) throw new Error(`logos-web: unreadable fill "${value}"`);
        /* The same cut as the original import: a fill this dark is a hole. */
        if (l < 0.05) {
          counts.knockout++;
          return `fill="${KNOCKOUT}"`;
        }
        counts.mark++;
        return 'fill="#fff"';
      });
    })
    .join("");
  return { svg: out, note: `${counts.mark} fill(s) -> #fff, ${counts.knockout} knockout(s), ${counts.mask} mask fill(s) kept` };
}

/** The PNG's alpha as a mask over one white rectangle. */
async function wrapRaster(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  /* Colour dropped, coverage kept. White as well as the original alpha, so the
     mask reads the same under `mask-type: alpha` and the luminance default. */
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
  }
  const png = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
  const { width: w, height: h } = info;
  const svg =
    `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">\n` +
    `<mask id="ink" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}">\n` +
    `<image width="${w}" height="${h}" href="data:image/png;base64,${png.toString("base64")}"/>\n` +
    `</mask>\n` +
    `<rect width="${w}" height="${h}" fill="#fff" mask="url(#ink)"/>\n` +
    `</svg>\n`;
  return { svg, note: `raster ${w}x${h}, alpha kept as a mask (${png.length} B png)` };
}

for (const s of SOURCES) {
  const res = await fetch(s.url, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`logos-web: ${s.url} answered ${res.status}`);
  const { svg, note } =
    s.kind === "raster"
      ? await wrapRaster(Buffer.from(await res.arrayBuffer()))
      : normaliseVector(await res.text());
  writeFileSync(OUT + s.file, svg);
  console.log(`  ${s.file.padEnd(24)} ${note}`);
}
console.log(`\n${SOURCES.length} marks written to public/clients/`);
