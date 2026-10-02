"use client";

import { type ComponentType, type ReactNode } from "react";

import {
  at,
  BACK,
  DASH,
  Disc,
  ease,
  EDGE,
  FB,
  HIDDEN,
  IN,
  IO,
  LIN,
  OUT,
  Plate,
  Pool,
  px,
  rad,
  sc,
  tr,
  useSvgId,
  type Frame,
  type Track,
} from "./industry-motifs";

/*
 * The six drawings on Extend's "Where Extend fits" cards: one small story per
 * kind of app, and all six are the same story — the section's own sentence,
 * "work that depends on Workday data but happens somewhere else", told as work
 * coming in. They illustrate the card's name and line and add no words of
 * their own, so every one is `aria-hidden`.
 *
 * **One grammar, six times.** Every drawing is split the same way:
 *
 *   outside   the left third. Where the work lives today — an email, a
 *             spreadsheet, a note, a slide, a paper credential, a chat — drawn
 *             LOOSE: dashed, neutral, set a few degrees off square
 *   the door  a dashed route to a short blue bar on Workday's edge. The one
 *             way in, in the same place on every card
 *   inside    the right half. Workday: a solid white frame on a pool of blue
 *             light, with the module's own header, and in it the work in its
 *             native form — a task in an inbox, a register row with a status,
 *             a badge on the worker record, live capacity, a credential matched
 *             to the record, leave booked on the calendar
 *
 * and in each one the piece of work that came in is marked by the drawing's
 * one amber fill — never a stroke, never type — so the eye finds the same
 * thing on every card: what moved.
 *
 * **The markup is the finished picture, and the finished picture is "after".**
 * What the server sends, what a reduced-motion visitor sees and what a card
 * rests on between its turns is one frame: the work already inside Workday,
 * and its old home still drawn outside as an empty dashed outline, joined to
 * the door. That still frame tells the story without moving — something was
 * out there, now it is in here.
 *
 * **The motion is a beat, not a loop.** Each drawing has one `Beat`: it opens
 * on the finished frame, takes it apart in a quick rewind (the native element
 * goes, the source reappears outside), then plays the work's way in — through
 * the door, landing, and the amber arriving — and ends on the finished frame
 * again. The grid (`uses-grid.tsx`) plays the beats one card at a time, so
 * the section reads as one sentence told six times; nothing here loops.
 * Like the industries' motifs (`industry-motifs.tsx`), a beat is data — per
 * element, [offset, value, easing] — played with the Web Animations API, and
 * every flight is SAMPLED from the route the drawing actually draws, so the
 * traveler runs down its own dashed line and through its own door.
 *
 * Every drawing is the industries' 192 x 120 box, in the same well, so the two
 * pages' drawings share one scale and one stroke weight. Color as there: the
 * brand blue (`currentColor` is `--primary`; the gradients are the client's
 * #008EFF -> #1972B9, written out because a gradient stop cannot read a
 * token), neutrals from the tokens, one amber fill.
 *
 * **One hand with the industries' drawings, literally.** The plate, the
 * gradients, the easings, the dash that draws a stroke, the track builder and
 * the small number helpers are imported from `industry-motifs.tsx`, not
 * copied, so the two pages cannot drift apart. What is Extend's own is below:
 * the beat (one pass, not a loop), its rewind timings, and the flights.
 */

/* ------------------------------------------------------------------------ */
/* the timeline                                                              */

export type Beat = {
  /** The whole story, in milliseconds. Every track runs the same length. */
  readonly duration: number;
  /** Keyed by the `data-k` the drawing puts on the element. */
  readonly tracks: Readonly<Record<string, readonly Track[]>>;
};

/* Strokes that draw are `pathLength={1}` with the industries' `DASH`: an
   offset of `HIDDEN` hides the whole dash and its round cap, `EDGE` is "just
   about to appear". The SVG is never stretched (it keeps its aspect), so the
   dashes measure true in every browser. */

const sxy = (x: number, y: number) => `scale(${x}, ${y})`;

/** The rewind every beat opens with: the finished frame holds to `TAKE`, and
    whatever has to go is gone by `GONE` (a fifth of a second or so). That is
    why `pop`, `refade` and `redraw` below are Extend's own rather than the
    industries': an exit here takes 0.04 of a 3.6-4.4s beat, about 150ms,
    where theirs take 0.05-0.06 of a 6.8-9.2s loop, closer to 400ms. */
const TAKE = 0.06;
const GONE = 0.1;

/** Gone at `out`, back at `back` with a little overshoot. */
const pop = (out: number, back: number): Track =>
  at("transform", [0, sc(1)], [out, sc(1), IN], [out + 0.04, sc(0)], [back, sc(0), BACK], [back + 0.05, sc(1)], [1, sc(1)]);

/** On in the markup: off at `out`, on again from `from` to `to`. */
const refade = (out: number, from: number, to: number): Track =>
  at("opacity", [0, 1], [out, 1, IO], [out + 0.04, 0], [from, 0, OUT], [to, 1], [1, 1]);

/** A drawn stroke: retracts at `out`, draws again from `from` to `to`. */
const redraw = (out: number, from: number, to: number): Track =>
  at("strokeDashoffset", [0, 0], [out, 0, IN], [out + 0.04, HIDDEN], [from, EDGE, OUT], [to, 0], [1, 0]);

/** Grows along x from its left edge: gone at `out`, out to full by `to`. */
const grow = (out: number, from: number, to: number): Track =>
  at("transform", [0, sxy(1, 1)], [out, sxy(1, 1), IN], [out + 0.04, sxy(0, 1)], [from, sxy(0, 1), OUT], [to, sxy(1, 1)], [1, sxy(1, 1)]);

/** The door answering: a short stretch as the work passes through it. */
const knock = (t: number): Track =>
  at("transform", [0, sxy(1, 1)], [t - 0.02, sxy(1, 1), OUT], [t + 0.02, sxy(1, 1.7)], [t + 0.12, sxy(1, 1)], [1, sxy(1, 1)]);

/** One ring of light leaving whatever just arrived. Hidden in the markup. */
const ring = (t: number, to = 1.5): Track[] => [
  at("opacity", [0, 0], [t, 0, LIN], [t + 0.02, 0.6, OUT], [t + 0.2, 0], [1, 0]),
  at("transform", [0, sc(1)], [t + 0.02, sc(1), OUT], [t + 0.2, sc(to)], [1, sc(to)]),
];

/**
 * Plays a drawing's beat once, inside `root`. The animations start together,
 * in one task, so they share a start time and stay in step. Each starts and
 * ends on the markup's own values, and none fills, so a finished (or
 * cancelled) beat leaves exactly the server's picture behind.
 */
export function playBeat(root: Element, beat: Beat, delay = 0): Animation[] {
  const out: Animation[] = [];
  root.querySelectorAll<SVGElement>("[data-k]").forEach((el) => {
    for (const track of beat.tracks[el.dataset.k ?? ""] ?? []) {
      const frames = track.frames.map(([offset, value, easing]) => {
        const frame: Keyframe = { offset, easing: easing ?? IO };
        frame[track.prop] = String(value);
        return frame;
      });
      out.push(el.animate(frames, { duration: beat.duration, delay }));
    }
  });
  return out;
}

/* ------------------------------------------------------------------------ */
/* flights                                                                   */

type Pt = { readonly x: number; readonly y: number };
/** Where a traveler is: its center, its turn, its scale. */
type Pose = { readonly c: Pt; readonly r: number; readonly sx: number; readonly sy: number };

const P = (x: number, y: number): Pt => ({ x, y });
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** `p` turned `deg` (clockwise, as SVG and CSS turn) about `c`. */
function turn(p: Pt, c: Pt, deg: number): Pt {
  const a = rad(deg);
  const dx = p.x - c.x;
  const dy = p.y - c.y;
  return P(c.x + dx * Math.cos(a) - dy * Math.sin(a), c.y + dx * Math.sin(a) + dy * Math.cos(a));
}

/** A traveler's pose as the transform that puts it there. The element turns
    and scales about `o` (its `transform-origin`, in the drawing's units), so
    the translation is simply from `o` to the pose's center. One function list
    in every frame, so the browser interpolates each part on its own. */
const place = (o: Pt, p: Pose) =>
  `translate(${px(p.c.x - o.x)}px, ${px(p.c.y - o.y)}px) rotate(${px(p.r)}deg) scale(${p.sx.toFixed(3)}, ${p.sy.toFixed(3)})`;

const origin = (o: Pt) => ({ transformOrigin: `${o.x}px ${o.y}px` });

function cubic(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return P(a * p0.x + b * p1.x + c * p2.x + d * p3.x, a * p0.y + b * p1.y + c * p2.y + d * p3.y);
}

/**
 * A way in: from the traveler's pose outside, along a cubic to the door, then
 * straight on to where it lands. `c1` and `c2` are the cubic's handles; every
 * flight here moves left to right, so the curve's x only ever grows.
 */
type Flight = { readonly o: Pt; readonly from: Pose; readonly c1: Pt; readonly c2: Pt; readonly door: Pt; readonly to: Pose };

/** The share of the journey spent reaching the door, by length. */
function doorShare(f: Flight) {
  let a = 0;
  let prev = f.from.c;
  for (let k = 1; k <= 24; k++) {
    const p = cubic(f.from.c, f.c1, f.c2, f.door, k / 24);
    a += Math.hypot(p.x - prev.x, p.y - prev.y);
    prev = p;
  }
  const b = Math.hypot(f.to.c.x - f.door.x, f.to.c.y - f.door.y);
  return a / (a + b);
}

function poseOn(f: Flight, u: number): Pose {
  const share = doorShare(f);
  const c =
    u <= share
      ? cubic(f.from.c, f.c1, f.c2, f.door, share ? u / share : 1)
      : P(lerp(f.door.x, f.to.c.x, (u - share) / (1 - share)), lerp(f.door.y, f.to.c.y, (u - share) / (1 - share)));
  return { c, r: lerp(f.from.r, f.to.r, u), sx: lerp(f.from.sx, f.to.sx, u), sy: lerp(f.from.sy, f.to.sy, u) };
}

/* A journey eases in and out with the industries' `ease`, as their mover
   travels. */

/** When, in a flight from `start` to `end`, the traveler passes the door. */
function doorAt(f: Flight, start: number, end: number) {
  const share = doorShare(f);
  let lo = 0;
  let hi = 1;
  for (let k = 0; k < 24; k++) {
    const m = (lo + hi) / 2;
    if (ease(m) < share) lo = m;
    else hi = m;
  }
  return start + (end - start) * lo;
}

const STEPS = 16;
/**
 * A flight, sampled: sixteen even steps in time, eased along the route, and
 * one more exactly at the door. The door falls near the journey's fastest
 * point, where a straight run between two samples would cut the corner and
 * miss it by most of a unit; with its own frame the traveler goes THROUGH it.
 */
function fly(f: Flight, start: number, end: number): Frame[] {
  const steps: Frame[] = Array.from(
    { length: STEPS + 1 },
    (_, k) => [start + ((end - start) * k) / STEPS, place(f.o, poseOn(f, ease(k / STEPS))), LIN] as const,
  );
  const door: Frame = [doorAt(f, start, end), place(f.o, poseOn(f, doorShare(f))), LIN];
  return [...steps, door].sort((a, b) => a[0] - b[0]);
}

/** The dashed route the drawing shows: the flight's own cubic, from where it
    leaves the source (`fromX`) to the door — the same curve the traveler
    runs, cut by de Casteljau at the source's edge. */
function route(f: Flight, fromX: number) {
  const { c1, c2, door } = f;
  const p0 = f.from.c;
  let lo = 0;
  let hi = 1;
  for (let k = 0; k < 30; k++) {
    const m = (lo + hi) / 2;
    if (cubic(p0, c1, c2, door, m).x < fromX) lo = m;
    else hi = m;
  }
  const t = lo;
  const mix = (a: Pt, b: Pt) => P(lerp(a.x, b.x, t), lerp(a.y, b.y, t));
  const ab = mix(p0, c1);
  const bc = mix(c1, c2);
  const cd = mix(c2, door);
  const abc = mix(ab, bc);
  const bcd = mix(bc, cd);
  const s = mix(abc, bcd);
  return `M${px(s.x)} ${px(s.y)}C${px(bcd.x)} ${px(bcd.y)} ${px(cd.x)} ${px(cd.y)} ${px(door.x)} ${px(door.y)}`;
}

/* ------------------------------------------------------------------------ */
/* the frame every drawing shares                                            */

/** Grows from its own left edge (`FB`, the industries', is its center). */
const FB_LEFT = "[transform-box:fill-box] origin-left";

/** Workday, the same frame on every card; the door is on its left edge. */
const WD = { x: 90, y: 14, w: 88, h: 92 } as const;
const DOOR_X = WD.x;

/** The outside's hand: dashed, neutral. */
const LOOSE = { strokeWidth: 1, strokeDasharray: "2 2", className: "stroke-ink-subtle/45" } as const;
/** The source itself, before it moves: paper-white, a fine solid line. */
const PAPER = "fill-canvas stroke-ink-subtle/55";

/** The gradients every drawing uses: the light Workday sits in and the module
    chip in its header — the industries' `Pool` and `Disc` — and the client's
    blue for a capacity bar, deep at its root and lit at the end that measures
    (the industries' `Bright` runs the other way, so this one is Extend's). */
function Kit({ id }: { id: string }) {
  return (
    <>
      <Pool id={`${id}-pool`} strength={0.13} />
      <Disc id={`${id}-disc`} />
      <linearGradient id={`${id}-bright`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#1972b9" />
        <stop offset="1" stopColor="#008eff" />
      </linearGradient>
    </>
  );
}

/**
 * Workday: the route in, the frame on its pool of light, the header (the
 * module's blue chip and a title), whatever the drawing puts inside, and the
 * door over the frame's edge, on top of the route's end. `head` replaces the
 * header's right-hand bar.
 */
function Inside({
  id,
  door,
  path,
  k,
  head,
  children,
}: {
  id: string;
  /** The door's height on the frame's edge. */
  door: number;
  /** The dashed route to it. */
  path: string;
  /** The door's `data-k`, so the beat can knock on it. */
  k: string;
  head?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <ellipse cx={134} cy={60} rx={58} ry={54} fill={`url(#${id}-pool)`} />
      <path d={path} strokeWidth={1} strokeDasharray="1.5 3" strokeLinecap="round" className="stroke-primary/45" />
      <rect x={WD.x} y={WD.y} width={WD.w} height={WD.h} rx={9} strokeWidth={1} className="fill-canvas stroke-border-strong" />
      <circle cx={100} cy={24} r={3.4} fill={`url(#${id}-disc)`} />
      <rect x={107} y={22} width={28} height={4} rx={2} className="fill-surface-3" />
      {head ?? <rect x={156} y={22} width={14} height={4} rx={2} className="fill-surface-2" />}
      {children}
      <rect data-k={k} x={DOOR_X - 1.25} y={door - 6} width={2.5} height={12} rx={1.25} className={`fill-primary ${FB}`} />
    </>
  );
}

/** A five-pointed star, point up. */
function star(cx: number, cy: number, R: number, r: number) {
  let d = "";
  for (let k = 0; k < 10; k++) {
    const a = rad(-90 + k * 36);
    const l = k % 2 ? r : R;
    d += `${k ? "L" : "M"}${px(cx + l * Math.cos(a))} ${px(cy + l * Math.sin(a))}`;
  }
  return `${d}Z`;
}

/* ------------------------------------------------------------------------ */
/* Requests and approvals — "requests that currently live in email"          */

const RQ_ENV = { c: P(44, 52), w: 44, h: 30, tilt: -7 } as const;
const RQ_DOOR = 44;
const RQ_PITCH = 15;
/** The inbox: the new task on top, three older ones under it. */
const RQ_NEW = { y: 44, t: 30, s: 22 } as const;
const RQ_ROWS = [
  { y: 59, t: 26, s: 32 },
  { y: 74, t: 36, s: 18 },
  { y: 89, t: 22, s: 28 },
] as const;

const RQ_FLIGHT: Flight = {
  o: RQ_ENV.c,
  from: { c: RQ_ENV.c, r: RQ_ENV.tilt, sx: 1, sy: 1 },
  c1: P(60, 52),
  c2: P(76, RQ_DOOR),
  door: P(DOOR_X, RQ_DOOR),
  /* Into the door, folded small: an envelope does not fit through a door. */
  to: { c: P(94, RQ_DOOR), r: 0, sx: 0.2, sy: 0.2 },
};
const RQ_FLY = { start: 0.27, end: 0.47 } as const;
const RQ_PATH = route(RQ_FLIGHT, 67);

const RQ_BEAT: Beat = {
  duration: 3600,
  tracks: {
    /* The rewind: the task leaves the inbox, the older three close up over
       its place, and the email is back outside. */
    "rq-new": [
      refade(TAKE, 0.47, 0.56),
      at("transform", [0, tr(0, 0)], [TAKE, tr(0, 0), IO], [GONE, tr(-4, 0)], [0.47, tr(-8, 0), OUT], [0.58, tr(0, 0)], [1, tr(0, 0)]),
    ],
    "rq-act": [pop(TAKE, 0.63)],
    "rq-rows": [
      at("transform", [0, tr(0, 0)], [0.08, tr(0, 0), IO], [0.16, tr(0, -RQ_PITCH)], [0.46, tr(0, -RQ_PITCH), IO], [0.56, tr(0, 0)], [1, tr(0, 0)]),
    ],
    /* The email: pops in where it lives, sits a moment, then folds through
       the door. */
    "rq-mail": [
      at("opacity", [0, 0], [0.11, 0, OUT], [0.17, 1], [0.41, 1, IN], [0.465, 0], [1, 0]),
      at(
        "transform",
        [0, place(RQ_FLIGHT.o, { ...RQ_FLIGHT.from, sx: 0.9, sy: 0.9 })],
        [0.11, place(RQ_FLIGHT.o, { ...RQ_FLIGHT.from, sx: 0.9, sy: 0.9 }), BACK],
        [0.17, place(RQ_FLIGHT.o, RQ_FLIGHT.from), LIN],
        ...fly(RQ_FLIGHT, RQ_FLY.start, RQ_FLY.end),
        [1, place(RQ_FLIGHT.o, RQ_FLIGHT.to)],
      ),
    ],
    "rq-door": [knock(doorAt(RQ_FLIGHT, RQ_FLY.start, RQ_FLY.end))],
  },
};

function InboxRow({ y, t, s, fresh, id }: { y: number; t: number; s: number; fresh?: boolean; id: string }) {
  return (
    <>
      {fresh ? (
        <circle cx={101} cy={y} r={3.6} fill={`url(#${id}-disc)`} />
      ) : (
        <circle cx={101} cy={y} r={3.6} strokeWidth={1} className="fill-canvas stroke-border-strong" />
      )}
      <rect x={108} y={y - 4} width={t} height={3.5} rx={1.75} className={fresh ? "fill-primary/40" : "fill-surface-3"} />
      <rect x={108} y={y + 1} width={s} height={3} rx={1.5} className="fill-surface-2" />
      {fresh ? null : <rect x={155} y={y - 2.5} width={14} height={5} rx={2.5} className="fill-primary/20" />}
    </>
  );
}

/**
 * An email outside — the request as it lives today — and Workday's inbox
 * inside, with the request on top as a task: the module's blue on its sender,
 * its row lit, and the amber chip that asks for the approval. The beat sends
 * the email down the route and folds it through the door, the older tasks
 * make room, and the new one slides in under the door.
 */
function RequestsArt() {
  const id = useSvgId();
  const { c, w, h, tilt } = RQ_ENV;
  const x0 = c.x - w / 2;
  const y0 = c.y - h / 2;
  const flap = `M${x0 + 1.5} ${y0 + 1.5}L${c.x} ${c.y + 1}L${x0 + w - 1.5} ${y0 + 1.5}`;
  return (
    <Plate>
      <defs>
        <Kit id={id} />
      </defs>

      <g transform={`rotate(${tilt} ${c.x} ${c.y})`}>
        <rect x={x0} y={y0} width={w} height={h} rx={3} {...LOOSE} />
        <path d={flap} {...LOOSE} strokeLinejoin="round" />
      </g>

      <Inside id={id} door={RQ_DOOR} path={RQ_PATH} k="rq-door">
        <g data-k="rq-rows">
          {RQ_ROWS.map((r) => (
            <InboxRow key={r.y} id={id} {...r} />
          ))}
        </g>
        <g data-k="rq-new">
          <rect x={95} y={RQ_NEW.y - 7.5} width={78} height={15} rx={4} className="fill-primary/8" />
          <InboxRow id={id} fresh {...RQ_NEW} />
        </g>
        <rect data-k="rq-act" x={155} y={RQ_NEW.y - 2.5} width={14} height={5} rx={2.5} className={`fill-accent ${FB}`} />
      </Inside>

      <g data-k="rq-mail" opacity={0} style={origin(RQ_FLIGHT.o)}>
        <rect x={x0} y={y0} width={w} height={h} rx={3} strokeWidth={1} className={PAPER} />
        <path d={flap} strokeWidth={1} strokeLinejoin="round" className="stroke-ink-subtle/55" />
      </g>
    </Plate>
  );
}

/* ------------------------------------------------------------------------ */
/* Trackers and registers — "kept in spreadsheets"                           */

const TR_SHEET = { c: P(42, 60), tilt: -5 } as const;
const TR_COLS = [16, 25, 39, 53, 68] as const;
const TR_LINES = [33, 41, 52.5, 64, 75.5, 87] as const;
/** The row that leaves: the sheet's last, between these lines — at the same
    height as the register's last row, so the way in is nearly level. */
const TR_FROM = { x0: 25, x1: 68, y0: 75.5, y1: 87 } as const;
const TR_GONE = 3;
/** The register: three rows already in it, and the one that arrives. */
const TR_ROWS = [
  { y: 51, w: 24 },
  { y: 64, w: 18 },
  { y: 77, w: 28 },
] as const;
const TR_ROW = { x: 95, y: 84, w: 78, h: 12 } as const;
const TR_DOOR = TR_ROW.y + TR_ROW.h / 2;

const TR_O = P(TR_ROW.x + TR_ROW.w / 2, TR_DOOR);
const TR_REST: Pose = {
  c: turn(P((TR_FROM.x0 + TR_FROM.x1) / 2, (TR_FROM.y0 + TR_FROM.y1) / 2), TR_SHEET.c, TR_SHEET.tilt),
  r: TR_SHEET.tilt,
  sx: (TR_FROM.x1 - TR_FROM.x0) / TR_ROW.w,
  sy: (TR_FROM.y1 - TR_FROM.y0) / TR_ROW.h,
};
/** Lifted off the sheet before it goes. */
const TR_LIFT: Pose = { ...TR_REST, c: P(TR_REST.c.x, TR_REST.c.y - 1.5), sx: TR_REST.sx * 1.08, sy: TR_REST.sy * 1.08 };
const TR_FLIGHT: Flight = {
  o: TR_O,
  from: TR_LIFT,
  c1: P(TR_LIFT.c.x + 16, TR_LIFT.c.y),
  c2: P(74, TR_DOOR),
  door: P(DOOR_X, TR_DOOR),
  to: { c: TR_O, r: 0, sx: 1, sy: 1 },
};
const TR_FLY = { start: 0.28, end: 0.54 } as const;
const TR_PATH = route(TR_FLIGHT, 71.2);

const TR_BEAT: Beat = {
  duration: 3600,
  tracks: {
    /* The row fades out of the register, is put back on the sheet unseen,
       and fades in there; lifts; and runs the route into the register. */
    "tr-row": [
      at("opacity", [0, 1], [TAKE, 1, IO], [GONE, 0], [0.12, 0, OUT], [0.19, 1], [1, 1]),
      at(
        "transform",
        [0, place(TR_O, TR_FLIGHT.to)],
        [GONE, place(TR_O, TR_FLIGHT.to), LIN],
        [GONE + 0.005, place(TR_O, TR_REST)],
        [0.22, place(TR_O, TR_REST), BACK],
        [TR_FLY.start, place(TR_O, TR_LIFT), LIN],
        ...fly(TR_FLIGHT, TR_FLY.start, TR_FLY.end),
        [1, place(TR_O, TR_FLIGHT.to)],
      ),
    ],
    /* Lit as it lands; the status arrives a beat later. */
    "tr-lit": [refade(TAKE, TR_FLY.end, 0.62)],
    "tr-status": [pop(TAKE, 0.62)],
    "tr-door": [knock(doorAt(TR_FLIGHT, TR_FLY.start, TR_FLY.end))],
  },
};

/**
 * A spreadsheet outside, its last row empty — and inside, Workday's
 * register: the same record as a row in it, lit, with its status in amber.
 * The beat puts the row back on the sheet, lifts it, and runs it along the
 * route into the register, where it straightens, takes the register's width,
 * and gets its status.
 */
function TrackersArt() {
  const id = useSvgId();
  const [left, , , , right] = TR_COLS;
  const top = TR_LINES[0];
  const foot = TR_LINES[TR_LINES.length - 1];
  const mids = TR_LINES.slice(1, -1).map((y, i) => (y + TR_LINES[i + 2]) / 2);
  const grid =
    TR_COLS.slice(1, -1).map((x) => `M${x} ${top}V${foot}`).join("") +
    TR_LINES.slice(1, -1).map((y) => `M${left} ${y}H${right}`).join("");
  return (
    <Plate>
      <defs>
        <Kit id={id} />
      </defs>

      <g transform={`rotate(${TR_SHEET.tilt} ${TR_SHEET.c.x} ${TR_SHEET.c.y})`}>
        <rect x={left} y={top} width={right - left} height={foot - top} rx={2} {...LOOSE} />
        <path d={grid} strokeWidth={0.75} strokeDasharray="1.5 2" className="stroke-ink-subtle/30" />
        {/* The header, the row numbers, and every row's cells but the one
            that has gone. */}
        {[27, 41, 55].map((x) => (
          <rect key={x} x={x} y={35.8} width={8} height={2.4} rx={1.2} className="fill-ink-subtle/25" />
        ))}
        {mids.map((y, i) => (
          <g key={y}>
            <rect x={19} y={y - 1.2} width={3} height={2.4} rx={1.2} className="fill-ink-subtle/20" />
            {i === TR_GONE
              ? null
              : [
                  [27, 10 - i],
                  [41, 8],
                  [55, 7 + i],
                ].map(([x, w]) => (
                  <rect key={x} x={x} y={y - 1.5} width={w} height={3} rx={1.5} className="fill-ink-subtle/20" />
                ))}
          </g>
        ))}
      </g>

      <Inside id={id} door={TR_DOOR} path={TR_PATH} k="tr-door">
        {[
          [99, 12],
          [127, 10],
          [150, 10],
        ].map(([x, w]) => (
          <rect key={x} x={x} y={37.5} width={w} height={2.5} rx={1.25} className="fill-surface-3" />
        ))}
        <path d="M95 44.5H173M95 57.5H173M95 70.5H173" strokeWidth={0.75} className="stroke-border" />
        {TR_ROWS.map((r) => (
          <g key={r.y}>
            <rect x={99} y={r.y - 1.75} width={r.w} height={3.5} rx={1.75} className="fill-surface-3" />
            <rect x={127} y={r.y - 1.75} width={14} height={3.5} rx={1.75} className="fill-surface-2" />
            <rect x={150} y={r.y - 3} width={18} height={6} rx={3} className="fill-primary/20" />
          </g>
        ))}
      </Inside>

      {/* The record — on the sheet before the beat, in the register after. */}
      <g data-k="tr-row" style={origin(TR_O)}>
        <rect x={TR_ROW.x} y={TR_ROW.y} width={TR_ROW.w} height={TR_ROW.h} rx={3} strokeWidth={1} className={PAPER} />
        <rect data-k="tr-lit" x={TR_ROW.x} y={TR_ROW.y} width={TR_ROW.w} height={TR_ROW.h} rx={3} className="fill-primary/10" />
        <rect x={99} y={TR_DOOR - 1.75} width={22} height={3.5} rx={1.75} className="fill-primary/40" />
        <rect x={127} y={TR_DOOR - 1.75} width={14} height={3.5} rx={1.75} className="fill-surface-3" />
        <rect x={150} y={TR_DOOR - 3} width={18} height={6} rx={3} strokeWidth={0.75} className="stroke-border-strong" />
        <rect data-k="tr-status" x={150} y={TR_DOOR - 3} width={18} height={6} rx={3} className={`fill-accent ${FB}`} />
      </g>
    </Plate>
  );
}

/* ------------------------------------------------------------------------ */
/* Workforce programs — "tied to the worker record"                          */

const PG_NOTE = { c: P(40, 59), w: 38, h: 44, tilt: 6 } as const;
const PG_STAR = P(40, 51);
const PG_AVATAR = { c: P(112, 49), r: 11 } as const;
/** On the avatar's rim, at half past four. Rounded, because it is written
    into the markup, and two engines' cosines may disagree in the last bit. */
const PG_BADGE = P(
  Number(px(PG_AVATAR.c.x + PG_AVATAR.r * Math.cos(rad(45)))),
  Number(px(PG_AVATAR.c.y + PG_AVATAR.r * Math.sin(rad(45)))),
);
const PG_DOOR = 38;

const PG_FROM: Pose = { c: turn(PG_STAR, PG_NOTE.c, PG_NOTE.tilt), r: PG_NOTE.tilt, sx: 1, sy: 1 };
const PG_FLIGHT: Flight = {
  o: PG_STAR,
  from: PG_FROM,
  /* Up off the note and over, into the door from above. */
  c1: P(PG_FROM.c.x + 8, PG_FROM.c.y - 28),
  c2: P(76, 30),
  door: P(DOOR_X, PG_DOOR),
  /* Turning as it flies, to land upright like the badge's own star. */
  to: { c: PG_BADGE, r: 144, sx: 0.5, sy: 0.5 },
};
const PG_FLY = { start: 0.25, end: 0.56 } as const;
const PG_PATH = route(PG_FLIGHT, 50);

const PG_BEAT: Beat = {
  duration: 3800,
  tracks: {
    "pg-badge": [pop(TAKE, 0.55)],
    "pg-chip": [grow(TAKE, 0.62, 0.72)],
    "pg-ring": ring(0.57, 1.45),
    "pg-star": [
      at("opacity", [0, 0], [0.11, 0, OUT], [0.18, 1], [0.53, 1, IN], [0.57, 0], [1, 0]),
      at(
        "transform",
        [0, place(PG_STAR, { ...PG_FROM, sx: 0.5, sy: 0.5 })],
        [0.11, place(PG_STAR, { ...PG_FROM, sx: 0.5, sy: 0.5 }), BACK],
        [0.18, place(PG_STAR, PG_FROM), LIN],
        ...fly(PG_FLIGHT, PG_FLY.start, PG_FLY.end),
        [1, place(PG_STAR, PG_FLIGHT.to)],
      ),
    ],
    "pg-door": [knock(doorAt(PG_FLIGHT, PG_FLY.start, PG_FLY.end))],
  },
};

/**
 * A thank-you note outside, its star gone — and inside, the worker record:
 * the person, their programs as chips, and the recognition pinned to their
 * picture as an amber badge. The beat lifts the star off the note, flies it
 * over and in through the door, turning, and pins it to the avatar, where it
 * becomes the badge and the record gains a program.
 */
function ProgramsArt() {
  const id = useSvgId();
  const { c, w, h, tilt } = PG_NOTE;
  const { c: av, r: ar } = PG_AVATAR;
  return (
    <Plate>
      <defs>
        <Kit id={id} />
      </defs>

      <g transform={`rotate(${tilt} ${c.x} ${c.y})`}>
        <rect x={c.x - w / 2} y={c.y - h / 2} width={w} height={h} rx={4} {...LOOSE} />
        <path d={star(PG_STAR.x, PG_STAR.y, 7.5, 3.2)} {...LOOSE} strokeLinejoin="round" />
        <rect x={27} y={65} width={26} height={2.6} rx={1.3} className="fill-ink-subtle/20" />
        <rect x={27} y={71} width={18} height={2.6} rx={1.3} className="fill-ink-subtle/20" />
      </g>

      <Inside id={id} door={PG_DOOR} path={PG_PATH} k="pg-door">
        <circle cx={av.x} cy={av.y} r={ar} strokeWidth={1} className="fill-surface-2 stroke-border-strong" />
        <circle cx={av.x} cy={av.y - 3.5} r={3.8} className="fill-ink-subtle/30" />
        <path d={`M${av.x - 7} ${av.y + 8}a7 5.5 0 0 1 14 0Z`} className="fill-ink-subtle/30" />
        <circle data-k="pg-ring" cx={av.x} cy={av.y} r={ar} opacity={0} strokeWidth={1} stroke="currentColor" className={FB} />

        <rect x={129} y={41} width={32} height={4.5} rx={2.25} className="fill-surface-3" />
        <rect x={129} y={49} width={22} height={3.5} rx={1.75} className="fill-surface-2" />

        <rect x={99} y={70} width={22} height={7} rx={3.5} className="fill-primary/15" />
        <rect x={124} y={70} width={18} height={7} rx={3.5} className="fill-primary/15" />
        <rect data-k="pg-chip" x={145} y={70} width={24} height={7} rx={3.5} className={`fill-primary/35 ${FB_LEFT}`} />

        <rect x={99} y={85} width={44} height={3} rx={1.5} className="fill-surface-2" />
        <rect x={99} y={92} width={30} height={3} rx={1.5} className="fill-surface-2" />

        <g data-k="pg-badge" style={origin(PG_BADGE)}>
          <circle cx={PG_BADGE.x} cy={PG_BADGE.y} r={5} strokeWidth={1.5} className="fill-accent stroke-canvas" />
          <path d={star(PG_BADGE.x, PG_BADGE.y, 2.7, 1.15)} className="fill-accent-ink" />
        </g>
      </Inside>

      <path
        data-k="pg-star"
        d={star(PG_STAR.x, PG_STAR.y, 7.5, 3.2)}
        opacity={0}
        strokeWidth={1}
        strokeLinejoin="round"
        style={origin(PG_STAR)}
        className={PAPER}
      />
    </Plate>
  );
}

/* ------------------------------------------------------------------------ */
/* Planning views — "built on live Workday data"                             */

const PL_SLIDE = { c: P(40, 60), w: 46, h: 46, tilt: -4 } as const;
/** Three people's capacity: the share of it they are booked for. The slide's
    snapshot is out of date — two under, one well over. */
const PL_LIVE = [0.82, 0.5, 0.94] as const;
const PL_STALE = [0.55, 0.78, 0.4] as const;
const PL_ROWS = [47, 63, 79] as const;
const PL_TRACK = { x: 110, w: 56, h: 6 } as const;
/** The slide is the view in miniature: its bars start here, at this scale. */
const PL_ANCHOR = P(22, 62);
const PL_MINI = 40 / PL_TRACK.w;
const PL_O = P(PL_TRACK.x, PL_ROWS[1]);
const PL_DOOR = PL_ROWS[1];

const PL_FLIGHT: Flight = {
  o: PL_O,
  from: { c: turn(PL_ANCHOR, PL_SLIDE.c, PL_SLIDE.tilt), r: PL_SLIDE.tilt, sx: PL_MINI, sy: PL_MINI },
  c1: P(PL_ANCHOR.x + 22, PL_ANCHOR.y),
  c2: P(78, PL_DOOR),
  door: P(DOOR_X, PL_DOOR),
  to: { c: PL_O, r: 0, sx: 1, sy: 1 },
};
const PL_FLY = { start: 0.24, end: 0.5 } as const;
const PL_PATH = route(PL_FLIGHT, 64.5);
/** Where each bar sits on the slide, and how long it is there. */
const PL_MINI_ROWS = PL_ROWS.map((y, i) => ({
  y: PL_ANCHOR.y + PL_MINI * (y - PL_O.y),
  w: PL_STALE[i] * PL_TRACK.w * PL_MINI,
}));

const PL_BEAT: Beat = {
  duration: 3800,
  tracks: {
    /* The snapshot: back on the slide, then in through the door as a block,
       landing on the tracks at its old lengths. */
    "pl-old": [
      at("opacity", [0, 0], [0.12, 0, OUT], [0.19, 1], [PL_FLY.end, 1, IO], [PL_FLY.end + 0.05, 0], [1, 0]),
      at("transform", [0, place(PL_O, PL_FLIGHT.from)], [PL_FLY.start, place(PL_O, PL_FLIGHT.from), LIN], ...fly(PL_FLIGHT, PL_FLY.start, PL_FLY.end), [1, place(PL_O, PL_FLIGHT.to)]),
    ],
    /* Each live bar takes over at the snapshot's length, then measures the
       real figure — growing or shrinking, a little past it, and settling. */
    ...Object.fromEntries(
      PL_LIVE.map((live, i) => {
        const was = PL_STALE[i] / live;
        return [
          `pl-bar-${i}`,
          [
            refade(TAKE, PL_FLY.end, PL_FLY.end + 0.05),
            at(
              "transform",
              [0, sxy(1, 1)],
              [GONE, sxy(1, 1), LIN],
              [GONE + 0.005, sxy(was, 1)],
              [0.57 + 0.035 * i, sxy(was, 1), BACK],
              [0.7 + 0.035 * i, sxy(1, 1)],
              [1, sxy(1, 1)],
            ),
          ],
        ];
      }),
    ),
    "pl-live": [pop(TAKE, 0.66)],
    "pl-ring": ring(0.68, 2.6),
    "pl-door": [knock(doorAt(PL_FLIGHT, PL_FLY.start, PL_FLY.end))],
  },
};

/**
 * A slide outside, its chart's bars gone — and inside, Workday's capacity
 * view: three people, each with a track and how much of it they are booked
 * for, in the module's blue, and the amber dot by the header that says the
 * figures are live. The beat flies the slide's bars in through the door as a
 * block; they land at the snapshot's lengths, and each bar then measures its
 * real figure.
 */
function PlanningArt() {
  const id = useSvgId();
  const { c, w, h, tilt } = PL_SLIDE;
  const ticks = Array.from({ length: 5 }, (_, k) => `M${PL_TRACK.x + 14 * k} 90V92.5`).join("");
  return (
    <Plate>
      <defs>
        <Kit id={id} />
      </defs>

      <g transform={`rotate(${tilt} ${c.x} ${c.y})`}>
        <rect x={c.x - w / 2} y={c.y - h / 2} width={w} height={h} rx={4} {...LOOSE} />
        <rect x={22} y={42} width={16} height={3} rx={1.5} className="fill-ink-subtle/20" />
        {PL_MINI_ROWS.map((b) => (
          <rect
            key={b.y}
            x={PL_ANCHOR.x}
            y={b.y - (PL_TRACK.h * PL_MINI) / 2}
            width={b.w}
            height={PL_TRACK.h * PL_MINI}
            rx={(PL_TRACK.h * PL_MINI) / 2}
            strokeWidth={0.75}
            strokeDasharray="1.5 1.5"
            className="stroke-ink-subtle/40"
          />
        ))}
        <path d="M22 79.5H58" {...LOOSE} strokeWidth={0.75} />
      </g>

      <Inside
        id={id}
        door={PL_DOOR}
        path={PL_PATH}
        k="pl-door"
        head={
          <>
            <rect x={148} y={22} width={12} height={4} rx={2} className="fill-surface-2" />
            <circle data-k="pl-ring" cx={166} cy={24} r={2.6} opacity={0} strokeWidth={0.75} stroke="currentColor" className={FB} />
            <circle data-k="pl-live" cx={166} cy={24} r={2.6} className={`fill-accent ${FB}`} />
          </>
        }
      >
        {PL_ROWS.map((y, i) => (
          <g key={y}>
            <circle cx={100.5} cy={y} r={4.2} strokeWidth={1} className="fill-surface-2 stroke-border-strong" />
            <rect x={PL_TRACK.x} y={y - PL_TRACK.h / 2} width={PL_TRACK.w} height={PL_TRACK.h} rx={3} className="fill-surface-2" />
            <rect
              data-k={`pl-bar-${i}`}
              x={PL_TRACK.x}
              y={y - PL_TRACK.h / 2}
              width={PL_LIVE[i] * PL_TRACK.w}
              height={PL_TRACK.h}
              rx={3}
              fill={`url(#${id}-bright)`}
              className={FB_LEFT}
            />
          </g>
        ))}
        <path d={`M${PL_TRACK.x} 90H${PL_TRACK.x + PL_TRACK.w}${ticks}`} strokeWidth={0.75} className="stroke-border-strong" />
      </Inside>

      <g data-k="pl-old" opacity={0} style={origin(PL_O)}>
        {PL_ROWS.map((y, i) => (
          <rect
            key={y}
            x={PL_TRACK.x}
            y={y - PL_TRACK.h / 2}
            width={PL_STALE[i] * PL_TRACK.w}
            height={PL_TRACK.h}
            rx={3}
            className="fill-ink-subtle/35"
          />
        ))}
      </g>
    </Plate>
  );
}

/* ------------------------------------------------------------------------ */
/* Sector-specific records — "credential checks", "attestations"             */

/** The credential lands beside the record, the same shape and layout, so a
    match is the same field at the same height on both. */
const SC_CARD = { x: 96, y: 40, w: 32, h: 40 } as const;
const SC_RECORD = { x: 140, y: 40, w: 32, h: 40 } as const;
const SC_OUT = { c: P(40, 59), s: 1.25, tilt: -6 } as const;
const SC_O = P(SC_CARD.x + SC_CARD.w / 2, SC_CARD.y + SC_CARD.h / 2);
const SC_DOOR = SC_O.y;
/** The fields compared, by height: the photo, then two lines of the text. */
const SC_MATCH = [50.5, 63.5, 69.5] as const;
const SC_SEAL = P(134, 91);

const SC_FROM: Pose = { c: SC_OUT.c, r: SC_OUT.tilt, sx: SC_OUT.s, sy: SC_OUT.s };
const SC_FLIGHT: Flight = {
  o: SC_O,
  from: SC_FROM,
  c1: P(SC_OUT.c.x + 14, SC_OUT.c.y),
  c2: P(76, SC_DOOR),
  door: P(DOOR_X, SC_DOOR),
  to: { c: SC_O, r: 0, sx: 1, sy: 1 },
};
const SC_FLY = { start: 0.25, end: 0.48 } as const;
const SC_PATH = route(SC_FLIGHT, 61.6);

const SC_BEAT: Beat = {
  duration: 3800,
  tracks: {
    "sc-card": [
      at("opacity", [0, 1], [TAKE, 1, IO], [GONE, 0], [0.12, 0, OUT], [0.19, 1], [1, 1]),
      at(
        "transform",
        [0, place(SC_O, SC_FLIGHT.to)],
        [GONE, place(SC_O, SC_FLIGHT.to), LIN],
        [GONE + 0.005, place(SC_O, SC_FROM)],
        [SC_FLY.start, place(SC_O, SC_FROM), LIN],
        ...fly(SC_FLIGHT, SC_FLY.start, SC_FLY.end),
        [1, place(SC_O, SC_FLIGHT.to)],
      ),
    ],
    "sc-lit": [refade(TAKE, SC_FLY.end, 0.54)],
    /* Field by field, down the two: photo, then the two lines. */
    ...Object.fromEntries(SC_MATCH.map((_, i) => [`sc-match-${i}`, [redraw(TAKE, 0.54 + 0.05 * i, 0.6 + 0.05 * i)]])),
    "sc-seal": [pop(TAKE, 0.71)],
    "sc-ring": ring(0.73, 1.6),
    "sc-door": [knock(doorAt(SC_FLIGHT, SC_FLY.start, SC_FLY.end))],
  },
};

/** A credential or a record: a photo, two lines beside it, two under it. */
function Fields({ x, y }: { x: number; y: number }) {
  return (
    <>
      <rect x={x + 4} y={y + 5} width={9} height={11} rx={1.5} className="fill-surface-3" />
      <rect x={x + 16} y={y + 6} width={12} height={3} rx={1.5} className="fill-surface-3" />
      <rect x={x + 16} y={y + 12} width={8} height={3} rx={1.5} className="fill-surface-2" />
      <rect x={x + 4} y={y + 22} width={24} height={3} rx={1.5} className="fill-surface-3" />
      <rect x={x + 4} y={y + 28} width={16} height={3} rx={1.5} className="fill-surface-2" />
    </>
  );
}

/**
 * A paper credential outside — a license, a registration, an attestation —
 * and inside, the worker's record with the credential now beside it: the same
 * fields at the same heights, a blue line joining each pair as it matches,
 * and the amber seal under the two that says it checked. The beat sends the
 * credential in through the door to the record's side, and checks it field
 * by field.
 */
function SectorArt() {
  const id = useSvgId();
  const big = (v: number) => v * SC_OUT.s;
  /* The outside credential is the landed one at 1.25x, about its center. */
  const ox = SC_OUT.c.x - big(SC_CARD.w / 2);
  const oy = SC_OUT.c.y - big(SC_CARD.h / 2);
  return (
    <Plate>
      <defs>
        <Kit id={id} />
      </defs>

      <g transform={`rotate(${SC_OUT.tilt} ${SC_OUT.c.x} ${SC_OUT.c.y})`}>
        <rect x={ox} y={oy} width={big(SC_CARD.w)} height={big(SC_CARD.h)} rx={5} {...LOOSE} />
        <rect x={ox + big(4)} y={oy + big(5)} width={big(9)} height={big(11)} rx={2} {...LOOSE} />
        <circle cx={ox + big(26)} cy={oy + big(34.5)} r={big(2.6)} {...LOOSE} />
      </g>

      <Inside id={id} door={SC_DOOR} path={SC_PATH} k="sc-door">
        <rect
          x={SC_RECORD.x}
          y={SC_RECORD.y}
          width={SC_RECORD.w}
          height={SC_RECORD.h}
          rx={4}
          strokeWidth={1}
          className="fill-surface stroke-border-strong"
        />
        <Fields x={SC_RECORD.x} y={SC_RECORD.y} />
        {SC_MATCH.map((y, i) => (
          <path
            key={y}
            data-k={`sc-match-${i}`}
            d={`M${SC_CARD.x + SC_CARD.w + 2.5} ${y}H${SC_RECORD.x - 2.5}`}
            pathLength={1}
            strokeDasharray={DASH}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        ))}
        <circle data-k="sc-ring" cx={SC_SEAL.x} cy={SC_SEAL.y} r={5.5} opacity={0} strokeWidth={1} stroke="currentColor" className={FB} />
        <g data-k="sc-seal" style={origin(SC_SEAL)}>
          <circle cx={SC_SEAL.x} cy={SC_SEAL.y} r={5.5} className="fill-accent" />
          <path
            d={`M${SC_SEAL.x - 2.4} ${SC_SEAL.y + 0.2}L${SC_SEAL.x - 0.6} ${SC_SEAL.y + 2}L${SC_SEAL.x + 2.6} ${SC_SEAL.y - 1.6}`}
            strokeWidth={1.3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-accent-ink"
          />
        </g>
      </Inside>

      {/* The credential — outside before the beat, beside the record after. */}
      <g data-k="sc-card" style={origin(SC_O)}>
        <rect x={SC_CARD.x} y={SC_CARD.y} width={SC_CARD.w} height={SC_CARD.h} rx={4} strokeWidth={1} className={PAPER} />
        <Fields x={SC_CARD.x} y={SC_CARD.y} />
        <circle cx={SC_CARD.x + 26} cy={SC_CARD.y + 34.5} r={2.6} strokeWidth={0.75} className="stroke-ink-subtle/50" />
        <rect
          data-k="sc-lit"
          x={SC_CARD.x}
          y={SC_CARD.y}
          width={SC_CARD.w}
          height={SC_CARD.h}
          rx={4}
          strokeWidth={1.25}
          className="stroke-primary/60"
        />
      </g>
    </Plate>
  );
}

/* ------------------------------------------------------------------------ */
/* AI assistants and agents — "answered in chat, completed in Workday"       */

/** The question, and the assistant's answer below it, as chat bubbles. */
const AS_Q = "M21 24H49A9 9 0 0 1 49 42H27L19 47.5L21 42A9 9 0 0 1 21 24Z";
const AS_A = "M36 50H62A10 10 0 0 1 62 70L68 75.5L56 70H36A10 10 0 0 1 36 50Z";
const AS_DOTS = [41, 47, 53] as const;
/** The calendar: a week a row, a day a cell. */
const AS_CAL = { x: 99, y: 41, pitch: 10, row: 11, cell: 8 } as const;
/** Leave, booked: three days in the second week. */
const AS_LEAVE = { col: 1, row: 1, days: 3 } as const;
const AS_DOOR = AS_CAL.y + AS_LEAVE.row * AS_CAL.row + AS_CAL.cell / 2;
const AS_LAND = P(AS_CAL.x + AS_LEAVE.col * AS_CAL.pitch + 3, AS_DOOR);

const AS_FROM: Pose = { c: P(66, 60.5), r: 0, sx: 1, sy: 1 };
const AS_FLIGHT: Flight = {
  o: AS_LAND,
  from: AS_FROM,
  c1: P(77, 60.5),
  c2: P(80, AS_DOOR),
  door: P(DOOR_X, AS_DOOR),
  to: { c: AS_LAND, r: 0, sx: 1, sy: 1 },
};
const AS_FLY = { start: 0.5, end: 0.64 } as const;
const AS_PATH = route(AS_FLIGHT, 74);

const AS_BEAT: Beat = {
  duration: 4400,
  tracks: {
    /* The conversation is cleared, the question asked again, the answer
       typed — and its action leaves the chat for Workday. */
    "as-q": [
      at("opacity", [0, 1], [0.05, 1, IO], [0.09, 0], [0.12, 0, OUT], [0.17, 1], [1, 1]),
      at("transform", [0, sc(1)], [0.09, sc(1), LIN], [0.095, sc(0.85)], [0.12, sc(0.85), BACK], [0.18, sc(1)], [1, sc(1)]),
    ],
    "as-a": [
      at("opacity", [0, 1], [0.05, 1, IO], [0.09, 0], [0.21, 0, OUT], [0.25, 1], [1, 1]),
      at("transform", [0, sc(1)], [0.09, sc(1), LIN], [0.095, sc(0.85)], [0.21, sc(0.85), BACK], [0.27, sc(1)], [1, sc(1)]),
    ],
    "as-text": [refade(0.05, 0.4, 0.45)],
    "as-dots": [at("opacity", [0, 0], [0.25, 0, OUT], [0.28, 1], [0.38, 1, IN], [0.41, 0], [1, 0])],
    ...Object.fromEntries(
      AS_DOTS.map((_, k) => {
        const b = 0.28 + 0.02 * k;
        const up = tr(0, -1.8);
        const down = tr(0, 0);
        return [
          `as-dot-${k}`,
          [at("transform", [0, down], [b, down, IO], [b + 0.02, up, IO], [b + 0.04, down], [b + 0.05, down, IO], [b + 0.07, up, IO], [b + 0.09, down], [1, down])],
        ];
      }),
    ),
    "as-chip": [
      at("opacity", [0, 0], [0.46, 0, LIN], [0.47, 1], [0.66, 1, IN], [0.7, 0], [1, 0]),
      at(
        "transform",
        [0, place(AS_LAND, { ...AS_FROM, sx: 0, sy: 0 })],
        [0.46, place(AS_LAND, { ...AS_FROM, sx: 0, sy: 0 }), BACK],
        [AS_FLY.start, place(AS_LAND, AS_FROM), LIN],
        ...fly(AS_FLIGHT, AS_FLY.start, AS_FLY.end),
        [1, place(AS_LAND, AS_FLIGHT.to)],
      ),
    ],
    "as-leave": [grow(0.05, 0.65, 0.78)],
    "as-door": [knock(doorAt(AS_FLIGHT, AS_FLY.start, AS_FLY.end))],
  },
};

/**
 * A chat outside — a question, and the assistant's answer — and inside,
 * Workday's calendar with the leave the answer booked across three days, in
 * amber. The beat clears the chat, asks again, types the answer, and sends its
 * action down the route and in through the door, where it lands on the
 * calendar and the leave runs out across the days.
 */
function AssistantsArt() {
  const id = useSvgId();
  const cells = Array.from({ length: 4 * 7 }, (_, n) => ({ r: Math.floor(n / 7), c: n % 7 }));
  const cx = (c: number) => AS_CAL.x + c * AS_CAL.pitch;
  const cy = (r: number) => AS_CAL.y + r * AS_CAL.row;
  return (
    <Plate>
      <defs>
        <Kit id={id} />
      </defs>

      <g data-k="as-q" style={origin(P(35, 34))}>
        <path d={AS_Q} {...LOOSE} strokeLinejoin="round" />
        <rect x={19} y={29.5} width={26} height={2.6} rx={1.3} className="fill-ink-subtle/25" />
        <rect x={19} y={34.5} width={17} height={2.6} rx={1.3} className="fill-ink-subtle/25" />
      </g>
      <g data-k="as-a" style={origin(P(49, 61))}>
        <path d={AS_A} strokeWidth={1} strokeDasharray="2 2" strokeLinejoin="round" className="fill-primary/5 stroke-primary/45" />
        <g data-k="as-text">
          <rect x={33} y={55.5} width={30} height={2.6} rx={1.3} className="fill-primary/35" />
          <rect x={33} y={61.5} width={20} height={2.6} rx={1.3} className="fill-primary/35" />
        </g>
        <g data-k="as-dots" opacity={0}>
          {AS_DOTS.map((x, k) => (
            <circle key={x} data-k={`as-dot-${k}`} cx={x} cy={60} r={1.7} className="fill-primary/70" />
          ))}
        </g>
      </g>

      <Inside id={id} door={AS_DOOR} path={AS_PATH} k="as-door">
        {Array.from({ length: 7 }, (_, c) => (
          <rect key={c} x={cx(c) + 2} y={35.5} width={4} height={2} rx={1} className="fill-surface-3" />
        ))}
        {cells.map(({ r, c }) => (
          <rect
            key={`${r}-${c}`}
            x={cx(c)}
            y={cy(r)}
            width={AS_CAL.cell}
            height={AS_CAL.cell}
            rx={2}
            className={c > 4 ? "fill-surface" : "fill-surface-2"}
          />
        ))}
        {/* Today. */}
        <rect x={cx(3)} y={cy(0)} width={AS_CAL.cell} height={AS_CAL.cell} rx={2} strokeWidth={1} className="stroke-primary/55" />
        <rect
          data-k="as-leave"
          x={cx(AS_LEAVE.col)}
          y={cy(AS_LEAVE.row)}
          width={AS_LEAVE.days * AS_CAL.pitch - (AS_CAL.pitch - AS_CAL.cell)}
          height={AS_CAL.cell}
          rx={2.5}
          className={`fill-accent ${FB_LEFT}`}
        />
        <rect x={99} y={89} width={40} height={3} rx={1.5} className="fill-surface-2" />
        <rect x={99} y={95} width={26} height={3} rx={1.5} className="fill-surface-2" />
      </Inside>

      <g data-k="as-chip" opacity={0} style={origin(AS_LAND)}>
        <rect x={AS_LAND.x - 7} y={AS_LAND.y - 3.5} width={14} height={7} rx={3.5} className="fill-primary" />
        <path
          d={`M${AS_LAND.x - 3.5} ${AS_LAND.y}H${AS_LAND.x + 3}M${AS_LAND.x + 0.6} ${AS_LAND.y - 2.2}L${AS_LAND.x + 3} ${AS_LAND.y}L${AS_LAND.x + 0.6} ${AS_LAND.y + 2.2}`}
          strokeWidth={1.1}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-canvas"
        />
      </g>
    </Plate>
  );
}

/* ------------------------------------------------------------------------ */
/* anything else                                                             */

/**
 * For a kind of app the CMS adds before it has a drawing of its own: the
 * grammar with nothing specific in it — an empty dashed page outside, the
 * route and the door, and Workday with a blue block inside. Still, and given
 * no beat, so the relay passes it by.
 */
function FallbackArt() {
  const id = useSvgId();
  const path = route(
    { o: P(40, 60), from: { c: P(40, 60), r: 0, sx: 1, sy: 1 }, c1: P(56, 60), c2: P(76, 60), door: P(DOOR_X, 60), to: { c: P(120, 60), r: 0, sx: 1, sy: 1 } },
    62,
  );
  return (
    <Plate>
      <defs>
        <Kit id={id} />
      </defs>
      <g transform="rotate(-5 40 60)">
        <rect x={20} y={40} width={40} height={40} rx={4} {...LOOSE} />
      </g>
      <Inside id={id} door={60} path={path} k="fb-door">
        <rect x={99} y={40} width={70} height={18} rx={4} className="fill-primary/15" />
        <rect x={99} y={64} width={44} height={3.5} rx={1.75} className="fill-surface-3" />
        <rect x={99} y={72} width={58} height={3} rx={1.5} className="fill-surface-2" />
        <rect x={99} y={79} width={36} height={3} rx={1.5} className="fill-surface-2" />
      </Inside>
    </Plate>
  );
}

/* ------------------------------------------------------------------------ */

export type UseMotif = { Art: ComponentType; beat: Beat | null };

/** Keyed by the kind of app, not by position, so reordering the six in the
    CMS cannot hand the trackers the inbox. */
export const USE_MOTIFS: Readonly<Record<string, UseMotif>> = {
  requests: { Art: RequestsArt, beat: RQ_BEAT },
  trackers: { Art: TrackersArt, beat: TR_BEAT },
  programs: { Art: ProgramsArt, beat: PG_BEAT },
  planning: { Art: PlanningArt, beat: PL_BEAT },
  sector: { Art: SectorArt, beat: SC_BEAT },
  assistants: { Art: AssistantsArt, beat: AS_BEAT },
};

export const FALLBACK_USE: UseMotif = { Art: FallbackArt, beat: null };
