"use client";

import { Fragment, useEffect, useId, useRef } from "react";
import { useReducedMotion } from "motion/react";

import {
  WORDMARK_BIRDS,
  WORDMARK_FLIP,
  WORDMARK_LETTERS,
  WORDMARK_VIEWBOX,
} from "@/components/brand/hazeberg-wordmark";

/**
 * The header's wordmark: its three birds as a flock, and over "berg", the berg.
 *
 * The first version squashed the marks and slid a gradient across them, and the
 * client was right that it did not feel like anything. These are handled as
 * birds instead, one physics loop driving all three:
 *
 *   at rest   each glides on its own bob and rock, and every few seconds beats
 *             its wings — the mark BENDS, tips up and down about the body, the
 *             way a wing does seen side on, rather than squashing flat. A gold
 *             glint slides along each wing and jumps with the beat, like light
 *             catching feathers. Every 15-23s one of them takes a small loop
 *             and lands again.
 *   nearby    as the pointer comes within ~180px they notice it: lean towards
 *             it and beat far more often, before anything has been touched
 *   hover     they take off one after another and chase each other round the
 *             cursor — smaller, banking into the turn, beating hard on the climb
 *             and gliding on the dive — trailing blue-to-gold contrails, and the
 *             letters under each bird light up as it passes over them
 *   leave     they fly home, grow back to size as they arrive, and settle with
 *             two beats
 *   press     they scatter and regroup
 *   tap       phones have no hover, so a tap sends all three round the loop,
 *             one after another
 *   keyboard  focusing the link sends them round the middle of the wordmark
 *
 * The berg — HIDDEN for now (`SHOW_BERG`), built and ready. Added 2026-09-30,
 * because people wanted the mountain in it too and the name is half mountain;
 * the client then asked for it off. A small alpine ridge over "berg", balancing the flock
 * over "aze". Three snow-capped summits, blue rock, its foot dissolving into
 * haze — Haze-berg, literally.
 *
 *   load      the ridge line draws itself left to right, then the rock and snow
 *             rise out of the haze (CSS, so it runs from the first paint)
 *   at rest   mist drifts across the lower slopes, and every 6-9s a glint of
 *             sun runs along the ridge
 *   nearby    a first glow shows behind the peaks — the sky before sunrise —
 *             and the range slides a touch against the pointer, being further
 *             off than the birds
 *   hover     dawn: the sun rises in the notch between the two right-hand peaks
 *             and the summits turn gold, while the flock is in the air; it sets
 *             again as they land. Focus and a tap bring it up too.
 *
 * The letters stay `currentColor`, so the bar's ink-to-white switch over dark
 * sections still works; the birds carry the colour. Blue is #1E88E5 rather than
 * the brand's #1972B9, which all but vanishes on the dark hero.
 *
 * Everything is written straight to the DOM from one rAF loop — three paths,
 * three transforms and a few gradient stops a frame — so React never re-renders
 * for it. `prefers-reduced-motion` gets the still wordmark in colour and no loop.
 */

type Pt = [number, number];
type Seg = [number, number, number, number, number, number];
type Bird = { start: Pt; segs: Seg[]; cx: number; cy: number; hw: number; lift: number };

/** The source draws at 10x, y-up (`WORDMARK_FLIP`). The birds are re-drawn in the
    viewBox's own units, so they can be moved, turned and bent directly. */
const view = (x: number, y: number): Pt => [x / 10, 78 - y / 10];

/** Reads one bird's path (M, relative c and l, z — all the three use) into
    absolute cubics; a line becomes a straight cubic so every segment bends alike. */
function readBird(d: string): Bird {
  const toks = d.match(/[a-z]|-?\d*\.?\d+/gi) ?? [];
  const segs: Seg[] = [];
  let start: Pt = [0, 0];
  let cmd = "";
  let x = 0;
  let y = 0;
  let i = 0;
  const next = () => Number(toks[i++]);
  while (i < toks.length) {
    if (/[a-z]/i.test(toks[i])) {
      cmd = toks[i++];
      continue;
    }
    if (cmd === "M") {
      x = next();
      y = next();
      start = view(x, y);
    } else if (cmd === "c") {
      const c = [x + next(), y + next(), x + next(), y + next(), x + next(), y + next()];
      segs.push([...view(c[0], c[1]), ...view(c[2], c[3]), ...view(c[4], c[5])]);
      x = c[4];
      y = c[5];
    } else if (cmd === "l") {
      const [ax, ay] = view(x, y);
      x += next();
      y += next();
      const [bx, by] = view(x, y);
      segs.push([ax + (bx - ax) / 3, ay + (by - ay) / 3, ax + ((bx - ax) * 2) / 3, ay + ((by - ay) * 2) / 3, bx, by]);
    } else {
      throw new Error(`wordmark bird: unexpected "${cmd}"`);
    }
  }
  const xs = [start[0], ...segs.map((s) => s[4])];
  const ys = [start[1], ...segs.map((s) => s[5])];
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const hw = (x1 - x0) / 2;
  return {
    start,
    segs,
    cx: x0 + hw,
    cy: (Math.min(...ys) + Math.max(...ys)) / 2,
    hw,
    /* How far a wingtip travels at the top of a beat. */
    lift: Math.min(0.3 * hw, 5.5),
  };
}

const BIRDS = WORDMARK_BIRDS.map(readBird);

/**
 * A bird with its wings at `s`: -1 fully down, 0 as drawn, 1 fully up. Each
 * point moves by the square of its distance from the body, so the body holds
 * still and the tips travel furthest, and the span draws in a little as the wing
 * leaves the plane.
 */
function shape(b: Bird, s: number) {
  const squeeze = 1 - 0.1 * Math.abs(s);
  const lift = b.lift * s;
  const pt = (x: number, y: number) => {
    const u = (x - b.cx) / b.hw;
    return `${(b.cx + (x - b.cx) * squeeze).toFixed(2)} ${(y - lift * u * u).toFixed(2)}`;
  };
  let d = `M${pt(b.start[0], b.start[1])}C`;
  for (const g of b.segs) d += `${pt(g[0], g[1])} ${pt(g[2], g[3])} ${pt(g[4], g[5])} `;
  return `${d.trimEnd()}Z`;
}

type Mark = { x: number; y: number; t: number };

/** A contrail: a ribbon through the bird's recent positions, full width at the
    bird and tapering to nothing at `TRAIL` seconds old. */
function ribbon(trail: Mark[], now: number, width: number) {
  const n = trail.length;
  if (n < 3) return "";
  const left: string[] = [];
  const right: string[] = [];
  for (let j = 0; j < n; j++) {
    const a = trail[Math.max(0, j - 1)];
    const c = trail[Math.min(n - 1, j + 1)];
    const len = Math.hypot(c.x - a.x, c.y - a.y) || 1;
    const nx = -(c.y - a.y) / len;
    const ny = (c.x - a.x) / len;
    const w = width * Math.max(0, 1 - (now - trail[j].t) / TRAIL);
    const p = trail[j];
    left.push(`${(p.x + nx * w).toFixed(2)} ${(p.y + ny * w).toFixed(2)}`);
    right.push(`${(p.x - nx * w).toFixed(2)} ${(p.y - ny * w).toFixed(2)}`);
  }
  return `M${left.join("L")}L${right.reverse().join("L")}Z`;
}

/** Where the chase path was at time `t`, between the two samples either side. */
function sample(path: Mark[], t: number) {
  if (t <= path[0].t) return path[0];
  for (let j = path.length - 1; j >= 0; j--) {
    if (path[j].t <= t) {
      const a = path[j];
      const b = path[j + 1] ?? a;
      const u = b.t > a.t ? (t - a.t) / (b.t - a.t) : 0;
      return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, t };
    }
  }
  return path[0];
}

const TAU = Math.PI * 2;
const BLUE = "#1E88E5";
const GOLD = "#FEC00F";

/** Each bird's own bob period, so the three never move as one block. */
const DRIFT = [3.6, 4.2, 4.8];
/** In the chase: the lead flies tightest, the other two lag like followers. */
const K_FLY = [120, 92, 76];
/** Seconds between one bird and the next round the loop. */
const LAG = 0.16;
/** The loop they fly round the cursor, in viewBox units (1 unit ≈ 0.43px). */
const ORBIT = { rx: 40, ry: 16, period: 1.5 };
/** How far the loop's centre may follow the cursor — it keeps them in the bar. */
const ROOM = { x0: 80, x1: 230, y0: 14, y1: 57 };
/** The wordmark's middle: what they circle when the link has keyboard focus. */
const MIDDLE = { x: 155.1, y: 35.5 };
const FLY_SCALE = 0.8;
const TRAIL = 0.34;
const LAP = 1.5;

/** The berg is built but switched off — the client's call, 2026-09-30: the
    flock stays, the mountain waits. Set true to bring it back; everything it
    needs (drawing, loop, CSS draw-on) is still here. */
const SHOW_BERG = false;

/**
 * The berg, over "berg" (x 154-242; the letters' tops are at y 34). The highest
 * summit sits over the join of "e" and "r", with a notch to its right for the
 * sun to come up in. Straight runs rather than curves: at 12px tall, a jagged
 * line is what reads as rock.
 */
const RIDGE =
  "M156 34 L166.5 26.5 L171.5 28 L183 18.5 L188 21 L201 6.5 L206.5 11.2 L210.5 9.8 L221.5 20 L228.5 16.5 L239.5 27 L250 34";
const MOUNTAIN = `${RIDGE} Z`;
/** The east faces, in shade. */
const SHADE = "M201 6.5 L206.5 11.2 L210.5 9.8 L221.5 20 L228.5 16.5 L239.5 27 L250 34 L212 34 L205 21 Z";
/** Snow on the three summits, cut along the ridge with a ragged lower edge. */
const SNOW = [
  "M194.7 13.5 L201 6.5 L206.5 11.2 L210.5 9.8 L215 14 L212.5 13.2 L210 15.2 L207.5 13.4 L204.5 15.8 L202 13.6 L199.5 15.4 L197 13.2 Z",
  "M223.5 19 L228.5 16.5 L231.6 19.5 L229.5 19 L227.5 20.3 L225.5 19.2 Z",
  "M179.4 21.5 L183 18.5 L186.4 20.2 L184.5 20 L183 21.6 L181.2 20.6 Z",
];
/** Everything above the ridge. The sun is clipped to it, so it comes up from
    behind the rock rather than in front of it. */
const SKY = `M146 34 L${RIDGE.slice(1)} L262 34 L262 -40 L146 -40 Z`;
/** The sun: in the notch, below the ridge (so hidden) at rest, clear of it at
    full dawn. */
const SUN = { x: 221.5, down: 31, up: 11, r: 5.5 };
/** Mist on the lower slopes: soft patches that thin the rock where they pass,
    each on its own speed, wrapping round. */
const MIST = [
  { x: 168, y: 25, rx: 15, ry: 3.2, v: 2.6 },
  { x: 214, y: 28.5, rx: 20, ry: 3.8, v: 1.7 },
  { x: 242, y: 21.5, rx: 11, ry: 2.6, v: 3.4 },
];
const MIST_SPAN = { x0: 130, x1: 275 };

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const clamp01 = (v: number) => clamp(v, 0, 1);
const easeInOut = (a: number) => (a < 0.5 ? 2 * a * a : 1 - (-2 * a + 2) ** 2 / 2);

type Mode = "home" | "fly" | "back" | "lap";
type Flier = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** scale: 1 at home, FLY_SCALE in the air */
  k: number;
  /** degrees */
  bank: number;
  /** wing phase and depth in flight */
  phase: number;
  amp: number;
  mode: Mode;
  since: number;
  /** a set of beats: [start, end, Hz] */
  burst: [number, number, number];
  trail: Mark[];
};

export function AnimatedHazebergWordmark({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const uid = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const bodies = useRef<(SVGGElement | null)[]>([]);
  const wings = useRef<(SVGPathElement | null)[]>([]);
  const glints = useRef<(SVGLinearGradientElement | null)[]>([]);
  const trails = useRef<(SVGPathElement | null)[]>([]);
  const trailInks = useRef<(SVGLinearGradientElement | null)[]>([]);
  const lights = useRef<(SVGGElement | null)[]>([]);
  const lamps = useRef<(SVGRadialGradientElement | null)[]>([]);
  const range = useRef<SVGGElement>(null);
  const sun = useRef<SVGCircleElement>(null);
  const halo = useRef<SVGCircleElement>(null);
  const alpen = useRef<SVGGElement>(null);
  const shine = useRef<SVGPathElement>(null);
  const mists = useRef<(SVGEllipseElement | null)[]>([]);

  useEffect(() => {
    const svg = svgRef.current;
    if (reduce || !svg) return;
    const link: Element = svg.closest("a") ?? svg.parentElement ?? svg;

    const now = () => performance.now() / 1000;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const t0 = now();

    const flock: Flier[] = BIRDS.map((b, i) => {
      /* Waking up: three beats each, one bird after another, as the page lands. */
      const wake = t0 + 0.35 + i * 0.22;
      return {
        x: b.cx,
        y: b.cy,
        vx: 0,
        vy: 0,
        k: 1,
        bank: 0,
        phase: 0,
        amp: 0,
        mode: "home",
        since: t0,
        burst: [wake, wake + 3 / 3.6, 3.6],
        trail: [],
      };
    });

    let pointer: { x: number; y: number } | null = null;
    let hovering = false;
    let focused = false;
    let flying = false;
    let near = 0;
    let nearTo = 0;
    let theta = 0;
    let nextLap = t0 + 7;
    const centre = { ...MIDDLE };
    const path: Mark[] = [];
    const lit = [false, false, false];
    /* The berg: how far the sun is up (0-1), until when a tap holds it up, the
       range's slide against the pointer, and the ridge glint's clock. */
    let dawn = 0;
    let drawnDawn = -1;
    let dawnUntil = 0;
    let shift = 0;
    let nextShine = t0 + 2.4;
    let shineAt = -10;

    const toView = (cx: number, cy: number) => {
      const m = svg.getScreenCTM();
      if (!m) return null;
      const p = new DOMPoint(cx, cy).matrixTransform(m.inverse());
      return { x: p.x, y: p.y };
    };

    const takeOff = () => {
      if (flying) return;
      flying = true;
      const t = now();
      const aim = hovering && pointer ? pointer : MIDDLE;
      centre.x = clamp(aim.x, ROOM.x0, ROOM.x1);
      centre.y = clamp(aim.y, ROOM.y0, ROOM.y1);
      /* Start the loop where the lead bird already is, so it leaves in a curve
         rather than a jump. */
      const lead = flock[0];
      theta = Math.atan2((lead.y - centre.y) / ORBIT.ry, (lead.x - centre.x) / ORBIT.rx);
      path.length = 0;
      for (const f of flock) {
        f.mode = "fly";
        f.since = t;
      }
    };

    const land = () => {
      if (!flying) return;
      flying = false;
      const t = now();
      /* A loop that fell due while they were up waits — landing and going
         straight back up reads as a glitch, not a bird. */
      nextLap = Math.max(nextLap, t + rand(10, 16));
      for (const f of flock) {
        if (f.mode === "fly") {
          f.mode = "back";
          f.since = t;
        }
      }
    };

    const scatter = () => {
      const t = now();
      flock.forEach((f, i) => {
        const b = BIRDS[i];
        /* In the air, outward from the loop; at home, up and a little apart. */
        const dx = flying ? f.x - centre.x : (i - 1) * 2.5;
        const dy = flying ? f.y - centre.y : -6;
        const len = Math.hypot(dx, dy) || 1;
        const push = flying ? 150 : 75 + (b.hw > 20 ? 0 : 15);
        f.vx += (dx / len) * push;
        f.vy += (dy / len) * push;
        f.burst = [t, t + 4 / 7, 7];
      });
    };

    /* Phones: the tap is the only thing that reaches the logo, so it gets the
       show — all three take the loop, one after another. */
    const flurry = () => {
      const t = now();
      flock.forEach((f, i) => {
        if (f.mode === "home" || f.mode === "lap") {
          f.mode = "lap";
          f.since = t + i * 0.12;
        }
      });
      nextLap = Math.max(nextLap, t + rand(12, 18));
      dawnUntil = t + 2.6;
    };
    const onDown = (e: Event) => {
      if ((e as PointerEvent).pointerType === "touch" && !flying) flurry();
      else scatter();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointer = toView(e.clientX, e.clientY);
      const r = link.getBoundingClientRect();
      const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      nearTo = clamp01(1 - Math.hypot(dx, dy) / 180);
    };
    const onEnter = (e: Event) => {
      const pe = e as PointerEvent;
      if (pe.pointerType === "touch") return;
      hovering = true;
      pointer = toView(pe.clientX, pe.clientY);
      takeOff();
    };
    const onLeave = (e: Event) => {
      if ((e as PointerEvent).pointerType === "touch") return;
      hovering = false;
      if (!focused) land();
    };
    const onFocus = () => {
      if (!link.matches(":focus-visible")) return;
      focused = true;
      takeOff();
    };
    const onBlur = () => {
      focused = false;
      if (!hovering) land();
    };
    const onGone = () => {
      nearTo = 0;
      pointer = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onGone);
    link.addEventListener("pointerenter", onEnter);
    link.addEventListener("pointerleave", onLeave);
    link.addEventListener("pointerdown", onDown);
    link.addEventListener("focus", onFocus);
    link.addEventListener("blur", onBlur);

    let last = now();
    let raf = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const t = now();
      const dt = Math.min(0.05, t - last);
      last = t;
      near += (nearTo - near) * (1 - Math.exp(-dt * 4));

      /* The chase: a loop round the cursor that the lead flies and the others
         follow `LAG` behind, along the same line. Its centre trails the cursor,
         and it swells and shrinks a little so no two laps are the same. */
      if (flying) {
        const aim = hovering && pointer ? pointer : MIDDLE;
        const ease = 1 - Math.exp(-dt * 5);
        centre.x += (clamp(aim.x, ROOM.x0, ROOM.x1) - centre.x) * ease;
        centre.y += (clamp(aim.y, ROOM.y0, ROOM.y1) - centre.y) * ease;
        theta += (dt * TAU) / ORBIT.period;
        const swell = 1 + 0.14 * Math.sin(t * 1.7);
        path.push({
          x: centre.x + ORBIT.rx * swell * Math.cos(theta),
          y: centre.y + ORBIT.ry * swell * Math.sin(theta),
          t,
        });
        while (path.length > 2 && path[0].t < t - 1) path.shift();
      }

      /* The berg. Dawn comes up while the flock is in the air (hover, focus, a
         tap); as the pointer comes near, only a first glow behind the peaks. */
      if (SHOW_BERG) {
        const dawnTo = flying || t < dawnUntil ? 1 : 0.2 * near;
        dawn += (dawnTo - dawn) * (1 - Math.exp(-dt * (dawnTo > dawn ? 2.4 : 1.8)));
        if (Math.abs(dawn - drawnDawn) > 0.0005) {
          drawnDawn = dawn;
          const cy = (SUN.down - (SUN.down - SUN.up) * dawn).toFixed(2);
          sun.current?.setAttribute("cy", cy);
          halo.current?.setAttribute("cy", cy);
          halo.current?.setAttribute("opacity", dawn.toFixed(3));
          /* The summits warm once the sun is well up, not the moment it starts. */
          alpen.current?.setAttribute("opacity", clamp01((dawn - 0.25) / 0.75).toFixed(3));
        }
        /* Depth: the range is further off than the flock, so it slides a little
           the other way to the pointer. */
        const shiftTo = pointer ? clamp((205 - pointer.x) * 0.02, -1.2, 1.2) * near : 0;
        shift += (shiftTo - shift) * (1 - Math.exp(-dt * 3));
        range.current?.setAttribute("transform", `translate(${shift.toFixed(3)} 0)`);
        const span = MIST_SPAN.x1 - MIST_SPAN.x0;
        MIST.forEach((m, j) => {
          const x = MIST_SPAN.x0 + ((((m.x - MIST_SPAN.x0 + m.v * (t - t0)) % span) + span) % span);
          mists.current[j]?.setAttribute("cx", x.toFixed(2));
        });
        /* A glint of sun along the ridge now and then — but not while the sun
           is up, when the whole ridge is lit anyway. */
        if (t >= nextShine) {
          if (dawn < 0.2) shineAt = t;
          nextShine = t + rand(6, 9);
        }
        const sp = (t - shineAt) / 1.3;
        if (sp >= 0 && sp <= 1.05) {
          shine.current?.setAttribute("stroke-dashoffset", (6 - 106 * easeInOut(clamp01(sp))).toFixed(2));
        }
      }

      /* Now and then, one bird takes a loop on its own — only when nobody is
         near the logo and the whole flock is sitting. */
      if (!flying && t >= nextLap) {
        if (near < 0.15 && flock.every((f) => f.mode === "home")) {
          const f = flock[Math.floor(Math.random() * flock.length)];
          f.mode = "lap";
          f.since = t;
          nextLap = t + rand(15, 23);
        } else {
          nextLap = t + 3;
        }
      }

      flock.forEach((f, i) => {
        const b = BIRDS[i];
        const bob = TAU / DRIFT[i];
        let tx = b.cx;
        let ty = b.cy;
        let K = 140;
        let zeta = 0.8;
        let kTo = 1;
        let bankTo: number;

        if (f.mode === "home") {
          /* Gliding in place, leaning towards the pointer as it comes close. */
          const lx = pointer ? pointer.x - b.cx : 0;
          const ly = pointer ? pointer.y - b.cy : 0;
          const ll = Math.hypot(lx, ly) || 1;
          tx = b.cx + 0.45 * Math.sin(t * bob * 0.7 + i) + (lx / ll) * 2.4 * near;
          ty = b.cy + (0.9 + 0.5 * near) * Math.sin(t * bob + i * 1.7) + (ly / ll) * 1.4 * near;
          bankTo = 1.6 * Math.sin(t * bob + i * 1.7 + 1) + (lx / ll) * 6 * near;
        } else {
          if (f.mode === "fly") {
            /* One after another off the mark. */
            if (t >= f.since + i * 0.09) {
              const p = sample(path, t - i * LAG);
              tx = p.x;
              ty = p.y;
              K = K_FLY[i];
              zeta = 0.62;
              kTo = FLY_SCALE;
            }
          } else if (f.mode === "back") {
            K = 60;
            zeta = 0.9;
            const d = Math.hypot(f.x - b.cx, f.y - b.cy);
            kTo = 1 - (1 - FLY_SCALE) * clamp01(d / 24);
            if (d < 0.35 && Math.hypot(f.vx, f.vy) < 4) {
              f.mode = "home";
              f.since = t;
              f.burst = [t, t + 2 / 4.2, 4.2];
            }
          } else {
            /* The idle loop: up and over, and back down onto the mark. */
            const a = clamp01((t - f.since) / LAP);
            const e = easeInOut(a) * TAU;
            tx = b.cx + 11 * Math.sin(e);
            ty = b.cy - 7 * (1 - Math.cos(e));
            K = 320;
            zeta = 0.85;
            kTo = 1 - 0.25 * Math.sin(Math.PI * a);
            if (a >= 1) {
              f.mode = "home";
              f.since = t;
              f.burst = [t, t + 2 / 4.2, 4.2];
            }
          }
          /* Bank into the direction of travel. */
          bankTo = clamp(f.vx * 0.2, -28, 28);
        }

        /* A damped spring towards the target, in small fixed steps so a slow
           frame cannot make it blow up. */
        const D = 2 * zeta * Math.sqrt(K);
        const steps = Math.max(1, Math.ceil(dt * 120));
        const h = dt / steps;
        for (let s = 0; s < steps; s++) {
          f.vx += (K * (tx - f.x) - D * f.vx) * h;
          f.vy += (K * (ty - f.y) - D * f.vy) * h;
          f.x += f.vx * h;
          f.y += f.vy * h;
        }
        f.k += (kTo - f.k) * (1 - Math.exp(-dt * 9));
        f.bank += (bankTo - f.bank) * (1 - Math.exp(-dt * 10));

        /* Wings. A set of beats (waking, landing, startled, or the idle ones)
           plays as a clean run of whole beats from level; otherwise at home they
           are held still, and in the air they beat hard on the climb and glide,
           tips raised, on the dive. */
        let s = 0;
        if (t >= f.burst[0] && t < f.burst[1]) {
          const u = t - f.burst[0];
          s = Math.sin(TAU * f.burst[2] * u) * Math.min(1, u / 0.06, (f.burst[1] - t) / 0.06);
          f.phase = TAU * f.burst[2] * u;
          f.amp = 1;
        } else if (f.mode === "home") {
          if (t >= f.burst[1]) {
            const hz = rand(3.2, 4);
            const at = t + rand(2.2, 5.4) * (1 - 0.6 * near);
            f.burst = [at, at + (Math.random() < 0.6 ? 2 : 3) / hz, hz];
          }
        } else {
          const climb = clamp01(-f.vy / 50);
          const dive = clamp01(f.vy / 50);
          const ampTo = 0.95 - 0.75 * dive;
          f.amp += (ampTo - f.amp) * (1 - Math.exp(-dt * 8));
          f.phase += TAU * (4.4 + 3.4 * climb) * dt;
          s = f.amp * Math.sin(f.phase) + (1 - f.amp) * 0.3;
        }

        const flight = clamp01((1 - f.k) / (1 - FLY_SCALE));

        bodies.current[i]?.setAttribute(
          "transform",
          `translate(${f.x.toFixed(2)} ${f.y.toFixed(2)}) rotate(${f.bank.toFixed(2)}) scale(${f.k.toFixed(3)}) translate(${-b.cx} ${-b.cy})`,
        );
        wings.current[i]?.setAttribute("d", shape(b, s));

        /* The glint: sways along the wing on its own, and jumps with the beat. */
        const g = 0.55 * Math.sin(t * 0.8 + i * 2.1) + 0.3 * s;
        glints.current[i]?.setAttribute("gradientTransform", `translate(${g.toFixed(3)} 0)`);

        /* Contrail, only while off the mark. */
        if (flight > 0.05) f.trail.push({ x: f.x, y: f.y, t });
        while (f.trail.length && f.trail[0].t < t - TRAIL) f.trail.shift();
        const trail = trails.current[i];
        if (trail && (f.trail.length || trail.getAttribute("d"))) {
          trail.setAttribute("d", ribbon(f.trail, t, 1.1 * f.k));
          const head = f.trail[f.trail.length - 1];
          const tail = f.trail[0];
          const ink = trailInks.current[i];
          if (ink && head && tail) {
            ink.setAttribute("x1", head.x.toFixed(2));
            ink.setAttribute("y1", head.y.toFixed(2));
            ink.setAttribute("x2", tail.x.toFixed(2));
            ink.setAttribute("y2", tail.y.toFixed(2));
          }
        }

        /* The light each bird throws on the letters under it — drawn in the
           letters' own 10x, y-up space. */
        const light = lights.current[i];
        if (light && (flight > 0.01 || lit[i])) {
          lit[i] = flight > 0.01;
          light.setAttribute("opacity", lit[i] ? (flight * 0.95).toFixed(3) : "0");
          const lamp = lamps.current[i];
          lamp?.setAttribute("cx", (f.x * 10).toFixed(1));
          lamp?.setAttribute("cy", ((78 - f.y) * 10).toFixed(1));
        }
      });
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onGone);
      link.removeEventListener("pointerenter", onEnter);
      link.removeEventListener("pointerleave", onLeave);
      link.removeEventListener("pointerdown", onDown);
      link.removeEventListener("focus", onFocus);
      link.removeEventListener("blur", onBlur);
    };
  }, [reduce]);

  return (
    <svg
      ref={svgRef}
      viewBox={WORDMARK_VIEWBOX}
      role="img"
      aria-label="Hazeberg"
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
      data-wordmark="flock"
      /* The link around it takes the pointer; the birds fly outside the box and
         must not catch it on the way. */
      className={`pointer-events-none ${className}`}
    >
      <defs>
        {BIRDS.map((_, i) => (
          <Fragment key={i}>
            <linearGradient
              id={`${uid}-wing${i}`}
              ref={(el) => {
                glints.current[i] = el;
              }}
            >
              <stop offset="0" stopColor={BLUE} />
              <stop offset="0.34" stopColor={BLUE} />
              <stop offset="0.5" stopColor={GOLD} />
              <stop offset="0.66" stopColor={BLUE} />
              <stop offset="1" stopColor={BLUE} />
            </linearGradient>
            <linearGradient
              id={`${uid}-trail${i}`}
              gradientUnits="userSpaceOnUse"
              ref={(el) => {
                trailInks.current[i] = el;
              }}
            >
              <stop offset="0" stopColor={BLUE} stopOpacity="0.6" />
              <stop offset="0.5" stopColor={GOLD} stopOpacity="0.4" />
              <stop offset="1" stopColor={GOLD} stopOpacity="0" />
            </linearGradient>
            <radialGradient
              id={`${uid}-light${i}`}
              gradientUnits="userSpaceOnUse"
              cx="0"
              cy="0"
              r="220"
              ref={(el) => {
                lamps.current[i] = el;
              }}
            >
              <stop offset="0" stopColor={i === 1 ? GOLD : BLUE} />
              <stop offset="0.45" stopColor={i === 1 ? BLUE : GOLD} stopOpacity="0.85" />
              <stop offset="1" stopColor={BLUE} stopOpacity="0" />
            </radialGradient>
          </Fragment>
        ))}

        {/* the berg */}
        {SHOW_BERG ? (
          <>
            <linearGradient id={`${uid}-rock`} gradientUnits="userSpaceOnUse" x1="0" y1="6" x2="0" y2="34">
              <stop offset="0" stopColor={BLUE} stopOpacity="0.55" />
              <stop offset="0.6" stopColor={BLUE} stopOpacity="0.22" />
              <stop offset="1" stopColor={BLUE} stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`${uid}-shade`} gradientUnits="userSpaceOnUse" x1="0" y1="6" x2="0" y2="34">
              <stop offset="0" stopColor="#0B4C86" stopOpacity="0.45" />
              <stop offset="1" stopColor="#0B4C86" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`${uid}-alpen`} gradientUnits="userSpaceOnUse" x1="0" y1="6" x2="0" y2="27">
              <stop offset="0" stopColor={GOLD} stopOpacity="0.9" />
              <stop offset="1" stopColor={GOLD} stopOpacity="0" />
            </linearGradient>
            <radialGradient id={`${uid}-sun`} cx="0.4" cy="0.35">
              <stop offset="0" stopColor="#FFF4C7" />
              <stop offset="0.55" stopColor={GOLD} />
              <stop offset="1" stopColor="#F1B403" />
            </radialGradient>
            <radialGradient id={`${uid}-halo`}>
              <stop offset="0" stopColor={GOLD} stopOpacity="0.55" />
              <stop offset="1" stopColor={GOLD} stopOpacity="0" />
            </radialGradient>
            <clipPath id={`${uid}-sky`}>
              <path d={SKY} />
            </clipPath>
            {/* The haze: the foot of the range fades to nothing, and the mist
                patches thin it further where they drift. A luminance mask, so the
                haze is simply whatever the bar is showing — it works on the white
                bar and the dark hero alike. */}
            <linearGradient id={`${uid}-fade`} gradientUnits="userSpaceOnUse" x1="0" y1="18" x2="0" y2="35">
              <stop offset="0" stopColor="#fff" />
              <stop offset="1" stopColor="#000" />
            </linearGradient>
            <radialGradient id={`${uid}-mist`}>
              <stop offset="0" stopColor="#000" stopOpacity="0.7" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </radialGradient>
            <mask id={`${uid}-haze`} maskUnits="userSpaceOnUse" x="130" y="-20" width="150" height="60">
              <rect x="130" y="-20" width="150" height="60" fill={`url(#${uid}-fade)`} />
              {MIST.map((m, j) => (
                <ellipse
                  key={j}
                  ref={(el) => {
                    mists.current[j] = el;
                  }}
                  cx={m.x}
                  cy={m.y}
                  rx={m.rx}
                  ry={m.ry}
                  fill={`url(#${uid}-mist)`}
                />
              ))}
            </mask>
          </>
        ) : null}
      </defs>

      {/* The berg — behind the letters, so "berg" stands in front of its
          mountain, and behind the birds, which fly in front of it. */}
      {SHOW_BERG ? (
        <g ref={range} data-berg>
          <g clipPath={`url(#${uid}-sky)`}>
            <circle ref={halo} cx={SUN.x} cy={SUN.down} r={16} fill={`url(#${uid}-halo)`} opacity={0} />
            <circle ref={sun} data-berg-sun cx={SUN.x} cy={SUN.down} r={SUN.r} fill={`url(#${uid}-sun)`} />
          </g>
          <g mask={`url(#${uid}-haze)`}>
            <g className="berg-rise">
              <path d={MOUNTAIN} fill={`url(#${uid}-rock)`} />
              <path d={SHADE} fill={`url(#${uid}-shade)`} />
              {SNOW.map((d) => (
                <path key={d} d={d} fill="#fff" fillOpacity={0.95} />
              ))}
            </g>
            <path
              className="berg-draw"
              d={RIDGE}
              pathLength={100}
              strokeDasharray="100 100"
              fill="none"
              stroke={BLUE}
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
            {/* alpenglow: the summits catching the sunrise */}
            <g ref={alpen} data-berg-glow opacity={0}>
              <path d={MOUNTAIN} fill={`url(#${uid}-alpen)`} />
              <path d={RIDGE} fill="none" stroke={GOLD} strokeWidth={1.5} strokeLinejoin="round" />
            </g>
            <path
              ref={shine}
              data-berg-shine
              d={RIDGE}
              pathLength={100}
              strokeDasharray="6 200"
              strokeDashoffset={6}
              fill="none"
              stroke={GOLD}
              strokeWidth={1.9}
              strokeLinejoin="round"
            />
          </g>
        </g>
      ) : null}

      <g transform={WORDMARK_FLIP} fill="currentColor" stroke="none">
        {WORDMARK_LETTERS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {BIRDS.map((_, i) => (
        <g
          key={i}
          ref={(el) => {
            lights.current[i] = el;
          }}
          transform={WORDMARK_FLIP}
          fill={`url(#${uid}-light${i})`}
          opacity={0}
        >
          {WORDMARK_LETTERS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      ))}

      {BIRDS.map((_, i) => (
        <path
          key={i}
          ref={(el) => {
            trails.current[i] = el;
          }}
          fill={`url(#${uid}-trail${i})`}
        />
      ))}

      {BIRDS.map((b, i) => (
        <g
          key={i}
          ref={(el) => {
            bodies.current[i] = el;
          }}
        >
          <path
            ref={(el) => {
              wings.current[i] = el;
            }}
            d={shape(b, 0)}
            fill={`url(#${uid}-wing${i})`}
          />
        </g>
      ))}
    </svg>
  );
}
