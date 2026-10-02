import { DOT_PITCH, DOT_ROWS, DOT_TOP } from "./world-dots";

/**
 * The delivery map's geometry: one plate carree frame, in degrees.
 *
 * One unit of the drawing is one degree. x is longitude, y is MINUS latitude
 * (SVG's y runs down), so a place is `[lon, -lat]` and the frame's viewBox is
 * the map. The frame is the whole circle of longitude and 76N to 57S: north of
 * that the land mask paints the Arctic as solid ground, south of it is only
 * Antarctica. Everything here is pure and deterministic — it runs identically
 * on the server and in the browser — except `nightPath`, which takes the time
 * as an argument and is only ever called from an effect.
 */

export const FRAME_TOP = 76;
export const FRAME_SPAN = 133;
export const VIEWBOX = `-180 ${-FRAME_TOP} 360 ${FRAME_SPAN}`;

/** `[longitude, latitude]`, east and north positive. */
export type LonLat = readonly [number, number];
type XY = readonly [number, number];

const xy = ([lon, lat]: LonLat): XY => [lon, -lat];

/** Where a place sits in the frame, as percentages, for HTML laid over it. */
export const placeAt = ([lon, lat]: LonLat) => ({
  left: `${(((lon + 180) / 360) * 100).toFixed(4)}%`,
  top: `${(((FRAME_TOP - lat) / FRAME_SPAN) * 100).toFixed(4)}%`,
});

/* -- the land ------------------------------------------------------------ */

/** Every dot as a zero-length segment in ONE path — round caps draw each as a
    disc. In grid units (one unit is one dot pitch), so a dot is `m1 0h0`;
    `DOTS_TRANSFORM` puts the grid on the frame. ~5,300 dots, ~32KB of path
    that gzip takes to a few: the drawing is in the first paint, before any
    script, rather than waiting for a canvas to hydrate. */
export const DOTS_D = (() => {
  let d = "";
  DOT_ROWS.forEach((runs, j) => {
    for (let k = 0; k < runs.length; k += 2) {
      d += `M${runs[k]} ${j}h0`;
      for (let n = 1; n < runs[k + 1]; n++) d += "m1 0h0";
    }
  });
  return d;
})();
export const DOTS_TRANSFORM = `translate(${-180 + DOT_PITCH / 2} ${-DOT_TOP}) scale(${DOT_PITCH})`;

/* -- the places ---------------------------------------------------------- */

/** [derived] The two delivery entities, at their cities: Coimbatore and
    Penang (George Town). Keyed as `ABOUT.built.entities` is. */
export const CENTRE_AT: Record<string, LonLat> = {
  coimbatore: [76.9558, 11.0168],
  penang: [100.3327, 5.4164],
};

/** [derived] One representative point per region in `ABOUT.built.regions`,
    for an arc to land on — the middle of the United States, central Europe
    and central Australia. Region centres, never client locations: the
    document names regions, not places, and so does the map. */
export const REGION_AT: Record<string, LonLat> = {
  Americas: [-98, 39],
  EMEA: [10, 48],
  APAC: [134, -26],
};

/** Lift per arc, as a share of its chord: how far the control point stands
    above the chord's middle. Solved, not tuned by eye: the two Americas arcs
    pass 18 and 26 degrees clear of EMEA's point on their way over (its glow is
    7), Penang's two westward arcs pass 13 and 15 degrees over Coimbatore, and
    Coimbatore's APAC arc — which has to cross Penang to reach Australia —
    clears it by 13 degrees, more than twice its pulse ring at its widest. */
const LIFT: Record<string, Record<string, number>> = {
  Americas: { coimbatore: 0.55, penang: 0.55 },
  EMEA: { coimbatore: 0.3, penang: 0.3 },
  APAC: { coimbatore: 0.75, penang: 0.3 },
};
const LIFT_DEFAULT = 0.35;

/* -- the arcs ------------------------------------------------------------ */

export type Arc = {
  key: string;
  from: string;
  to: string;
  p0: XY;
  c: XY;
  p1: XY;
  /** Chord length, degrees. */
  len: number;
  d: string;
};

/** A quadratic from `a` to `b`, its control point lifted straight up (north)
    by `lift` of the chord: the arc rises off the map rather than bowing to a
    side, which is what reads as "lifted" in a flat projection. */
function arc(key: string, from: string, to: string, a: LonLat, b: LonLat, lift: number): Arc {
  const p0 = xy(a);
  const p1 = xy(b);
  const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  const c: XY = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 - lift * len];
  const f = (v: number) => Number(v.toFixed(3));
  return {
    key,
    from,
    to,
    p0,
    c,
    p1,
    len,
    d: `M${f(p0[0])} ${f(p0[1])}Q${f(c[0])} ${f(c[1])} ${f(p1[0])} ${f(p1[1])}`,
  };
}

/** Every centre to every region it can be drawn to, centre by centre. */
export function arcsFor(centres: readonly string[], regions: readonly string[]): Arc[] {
  const out: Arc[] = [];
  for (const from of centres) {
    const a = CENTRE_AT[from];
    if (!a) continue;
    for (const to of regions) {
      const b = REGION_AT[to];
      if (!b) continue;
      out.push(arc(`${from}-${to}`, from, to, a, b, LIFT[to]?.[from] ?? LIFT_DEFAULT));
    }
  }
  return out;
}

/** The point at `t` along an arc. */
export function pointOn(a: Arc, t: number): XY {
  const u = 1 - t;
  return [
    u * u * a.p0[0] + 2 * u * t * a.c[0] + t * t * a.p1[0],
    u * u * a.p0[1] + 2 * u * t * a.c[1] + t * t * a.p1[1],
  ];
}

/** The piece of an arc between `t0` and `t1`, as its own quadratic. Its
    control point is the curve's blossom at (t0, t1), so the piece lies
    exactly on the arc. */
export function pieceOf(a: Arc, t0: number, t1: number): string {
  const s = pointOn(a, t0);
  const e = pointOn(a, t1);
  const k0 = (1 - t0) * (1 - t1);
  const k1 = t0 * (1 - t1) + t1 * (1 - t0);
  const k2 = t0 * t1;
  const cx = k0 * a.p0[0] + k1 * a.c[0] + k2 * a.p1[0];
  const cy = k0 * a.p0[1] + k1 * a.c[1] + k2 * a.p1[1];
  return `M${s[0].toFixed(2)} ${s[1].toFixed(2)}Q${cx.toFixed(2)} ${cy.toFixed(2)} ${e[0].toFixed(2)} ${e[1].toFixed(2)}`;
}

/* -- the sun ------------------------------------------------------------- */

const RAD = Math.PI / 180;
/** 2000-01-01T12:00Z, the J2000.0 epoch, in epoch ms. */
const J2000 = 946_728_000_000;

/** Where the sun is overhead at `t` — the low-precision solar position from
    the Astronomical Almanac, good to well under a degree, which is a fraction
    of one dot. Returns `[longitude, declination]`. */
export function subsolar(t: number): LonLat {
  const d = (t - J2000) / 86_400_000;
  const g = (357.529 + 0.98560028 * d) * RAD;
  const q = 280.459 + 0.98564736 * d;
  const L = (q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * RAD;
  const e = (23.439 - 0.00000036 * d) * RAD;
  const ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L)) / RAD;
  const decl = Math.asin(Math.sin(e) * Math.sin(L)) / RAD;
  const gmst = 280.46061837 + 360.98564736629 * d;
  const lon = ((((ra - gmst) % 360) + 540) % 360) - 180;
  return [lon, decl];
}

/** The night side of the world at `t`, as a closed path in the frame's units.
    The terminator is where the sun sits on the horizon: at hour angle `h`
    from the subsolar meridian, `tan(lat) = -cos(h) / tan(decl)`. Night is the
    side of it away from the pole the sun is over. Run 20 degrees past each
    edge so the blur that softens it has no seam to find. */
export function nightPath(t: number): string {
  const [sLon, d0] = subsolar(t);
  // At the equinoxes tan(decl) passes through 0 and the terminator becomes
  // two meridians; holding it a fifth of a degree off keeps the maths finite
  // and moves the line by nothing a reader could see.
  const decl = Math.abs(d0) < 0.2 ? (d0 < 0 ? -0.2 : 0.2) : d0;
  const tanD = Math.tan(decl * RAD);
  let d = "";
  for (let lon = -200; lon <= 200; lon += 2) {
    const lat = Math.atan(-Math.cos((lon - sLon) * RAD) / tanD) / RAD;
    d += `${d ? "L" : "M"}${lon} ${(-lat).toFixed(2)}`;
  }
  const pole = decl > 0 ? 90 : -90;
  return `${d}L200 ${pole}L-200 ${pole}Z`;
}
