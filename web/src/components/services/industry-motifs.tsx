"use client";

import { useId, type ComponentType, type ReactNode } from "react";

/*
 * The six workforce motifs on the HCM industries cards: one small drawing per
 * sector, each showing the ONE thing HCM has to get right for that workforce.
 * They illustrate the sector's own line and tags and add no words of their
 * own, so every one is `aria-hidden`.
 *
 * Every drawing is in the same 192 x 120 box, which is narrower for its height
 * than any well it sits in (the narrowest well is 274 x 160, at 640px: 1.71:1
 * against the box's 1.6:1), so a motif is always set by the well's HEIGHT —
 * 1.2x on a phone, 1.33x from sm — and the six drawings side by side always
 * share one stroke weight.
 *
 * **The markup is the finished picture.** What the server sends, what a
 * reduced-motion visitor sees and what a paused loop rests on are one frame:
 * every loop below starts on the elements' own attribute values and ends on
 * them, or on something that draws the same (a full turn of the dial, a ring
 * of light already faded out). So nothing here branches on a preference, and
 * nothing can hydrate into a different state.
 *
 * **The motion is a timeline, not CSS keyframes.** Each loop is data — per
 * element, a list of [offset, value, easing] — played with the Web Animations
 * API by `startLoop`, which the card calls only once its well is on screen and
 * never under reduced motion. Written as data because the sequences are
 * computed from the drawings' own geometry (a node pops the moment the curve
 * reaches it, a bar swells when the wave gets to it), which CSS keyframes —
 * fixed offsets, one set per name — could only fake with forty hand-written
 * rules. As WAAPI animations they also pause, resume and change speed without
 * jumping, which is what the card's hover asks of them.
 *
 * Color: the brand blue throughout (`currentColor` is `--primary`; the two
 * gradients are the client's #008EFF -> #1972B9, written out because a
 * gradient stop cannot read a token), neutrals from the tokens, and at most one
 * amber fill per drawing — never a stroke, never type.
 */

/* ------------------------------------------------------------------------ */
/* the timeline                                                              */

type Prop = "transform" | "opacity" | "strokeDashoffset";
/** [offset 0-1, value, the easing from this frame to the next] */
type Frame = readonly [offset: number, value: string | number, easing?: string];
type Track = { readonly prop: Prop; readonly frames: readonly Frame[]; readonly period?: number };
export type Loop = {
  /** One cycle, in milliseconds. A track may run on its own `period`. */
  readonly period: number;
  /** Keyed by the `data-k` the drawing puts on the element. */
  readonly tracks: Readonly<Record<string, readonly Track[]>>;
};

const IO = "cubic-bezier(0.65, 0, 0.35, 1)";
const OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const IN = "cubic-bezier(0.55, 0, 0.75, 0.2)";
/** A small overshoot — what makes a pop read as arriving rather than scaling. */
const BACK = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const LIN = "linear";

/* Strokes that draw are `pathLength={1}` with a dash of 1 and a gap of 1.2.
   An offset of 1.1 puts the whole dash before the path's start and the next
   one after its end, so a hidden stroke leaves no round cap behind; 1.02 is
   "just about to appear", which is where a draw starts so it starts at once. */
const DASH = "1 1.2";
const HIDDEN = 1.1;
const EDGE = 1.02;

const at = (prop: Prop, ...frames: Frame[]): Track => ({ prop, frames });

/** One track list per item of a list, keyed by whatever `key` names it. */
function keyed<T>(list: readonly T[], key: (item: T, i: number) => string, tracks: (item: T, i: number) => Track[]) {
  const out: Record<string, readonly Track[]> = {};
  list.forEach((item, i) => {
    out[key(item, i)] = tracks(item, i);
  });
  return out;
}

const tr = (x: number, y: number) => `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
const sc = (s: number) => `scale(${s})`;

/** Gone at `out`, back at `back` with a little overshoot. */
const pop = (out: number, back: number): Track =>
  at("transform", [0, sc(1)], [out, sc(1), IN], [out + 0.05, sc(0)], [back, sc(0), BACK], [back + 0.05, sc(1)], [1, sc(1)]);

/** A drawn stroke: retracts at `out`, draws again from `from` to `to`. */
const redraw = (out: number, from: number, to: number): Track =>
  at("strokeDashoffset", [0, 0], [out, 0, IN], [out + 0.05, HIDDEN], [from, EDGE, OUT], [to, 0], [1, 0]);

/** Off at `out`, on again from `from` to `to`. */
const refade = (out: number, from: number, to: number, low = 0): Track =>
  at("opacity", [0, 1], [out, 1, IO], [out + 0.06, low], [from, low, OUT], [to, 1], [1, 1]);

/**
 * Plays a motif's loop on the drawing inside `root`. The animations start
 * together, in one task, so they share a start time and stay in step through
 * every pause and change of speed after it.
 */
export function startLoop(root: Element, loop: Loop, rate: number): Animation[] {
  const out: Animation[] = [];
  root.querySelectorAll<SVGElement>("[data-k]").forEach((el) => {
    for (const track of loop.tracks[el.dataset.k ?? ""] ?? []) {
      const frames = track.frames.map(([offset, value, easing]) => {
        const frame: Keyframe = { offset, easing: easing ?? IO };
        frame[track.prop] = String(value);
        return frame;
      });
      const a = el.animate(frames, { duration: track.period ?? loop.period, iterations: Infinity });
      a.playbackRate = rate;
      out.push(a);
    }
  });
  return out;
}

/* ------------------------------------------------------------------------ */
/* the frame every drawing shares                                            */

/** Scales and turns about the element's own center (or foot), not the box's. */
const FB = "[transform-box:fill-box] origin-center";
const FB_FOOT = "[transform-box:fill-box] origin-bottom";

/** Gradient ids have to be unique on the page; React's are, once the colons
    a CSS `url()` would choke on are gone. */
function useSvgId() {
  return useId().replace(/[^a-zA-Z0-9_-]/g, "");
}

function Plate({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 192 120"
      fill="none"
      className="absolute inset-0 size-full text-primary"
    >
      {children}
    </svg>
  );
}

/** The client's blue, light to deep — the one gradient every drawing uses. */
function Bright({ id, x2 = 1, y2 = 1 }: { id: string; x2?: number; y2?: number }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
      <stop offset="0" stopColor="#008eff" />
      <stop offset="1" stopColor="#1972b9" />
    </linearGradient>
  );
}

/** `.disc-blue`'s stops, for a disc drawn inside an SVG. */
function Disc({ id }: { id: string }) {
  return (
    <radialGradient id={id} cx="32%" cy="24%" r="85%">
      <stop offset="0" stopColor="#1f8ce8" />
      <stop offset="0.42" stopColor="#0d6fc4" />
      <stop offset="0.74" stopColor="#12599b" />
      <stop offset="1" stopColor="#0a3d68" />
    </radialGradient>
  );
}

/** A soft pool of blue light. */
function Pool({ id, strength = 0.16 }: { id: string; strength?: number }) {
  return (
    <radialGradient id={id}>
      <stop offset="0" stopColor="#008eff" stopOpacity={strength} />
      <stop offset="1" stopColor="#008eff" stopOpacity="0" />
    </radialGradient>
  );
}

const rad = (deg: number) => (deg * Math.PI) / 180;
const px = (v: number) => v.toFixed(2);

/* ------------------------------------------------------------------------ */
/* Higher education — "faculty, staff and student workers on one system"     */

/* Three roles, each its own ring, packed around a center 15 apart: 26 between
   any two of them against the 22 two rings need, and a 3.25 gap in the middle
   for the shared record. The shared ring clears the packed three by 5. */
const ROLES = [
  { k: "he-a", x: 96, y: 45, dx: 0, dy: -25 },
  { k: "he-b", x: 108.99, y: 67.5, dx: 43.01, dy: 20.5 },
  { k: "he-c", x: 83.01, y: 67.5, dx: -43.01, dy: 20.5 },
] as const;

const HE_LOOP: Loop = {
  period: 7600,
  tracks: {
    /* Together, apart into their own systems, together again and locked. */
    ...keyed(
      ROLES,
      (r) => r.k,
      (r) => [
        at(
          "transform",
          [0, tr(0, 0)],
          [0.14, tr(0, 0), IO],
          [0.38, tr(r.dx, r.dy)],
          [0.56, tr(r.dx, r.dy), IO],
          [0.8, tr(0, 0)],
          [1, tr(0, 0)],
        ),
      ],
    ),
    /* Each role's own dashed boundary, only while they are apart. */
    "he-halo": [at("opacity", [0, 0], [0.2, 0, OUT], [0.36, 1], [0.58, 1, IO], [0.72, 0], [1, 0])],
    "he-ring": [redraw(0.12, 0.76, 0.92)],
    "he-glow": [refade(0.12, 0.78, 0.94)],
    "he-core": [pop(0.12, 0.82)],
    /* The lock: one ring of light leaving the shared ring. */
    "he-pulse": [
      at("opacity", [0, 0], [0.86, 0, LIN], [0.88, 0.6, OUT], [1, 0]),
      at("transform", [0, sc(1)], [0.88, sc(1), OUT], [1, sc(1.3)]),
    ],
  },
};

/**
 * Three rings — faculty, staff, student workers — that drift apart into their
 * own dashed systems and come back together, and a shared ring that draws
 * around them as they lock. The amber point in the middle is the one record
 * all three now share.
 */
function HigherEducationArt() {
  const id = useSvgId();
  return (
    <Plate>
      <defs>
        <Pool id={`${id}-pool`} />
        <Bright id={`${id}-line`} />
      </defs>
      <circle data-k="he-glow" cx={96} cy={60} r={31} fill={`url(#${id}-pool)`} />
      <path
        data-k="he-ring"
        d="M96 29a31 31 0 1 1 0 62a31 31 0 1 1 0-62"
        pathLength={1}
        strokeDasharray={DASH}
        stroke={`url(#${id}-line)`}
        strokeWidth={1.75}
        strokeLinecap="round"
      />
      <circle
        data-k="he-pulse"
        cx={96}
        cy={60}
        r={31}
        opacity={0}
        stroke="currentColor"
        strokeWidth={1}
        className={FB}
      />
      {ROLES.map((r, i) => (
        <g key={r.k} data-k={r.k}>
          <circle
            data-k="he-halo"
            cx={r.x}
            cy={r.y}
            r={16}
            opacity={0}
            strokeWidth={0.75}
            strokeDasharray="1.5 3"
            className="stroke-primary/45"
          />
          <circle cx={r.x} cy={r.y} r={11} stroke="currentColor" strokeWidth={1.5} className="fill-canvas" />
          {/* Three marks so the three are three people, not one ring thrice. */}
          {i === 0 ? (
            <circle cx={r.x} cy={r.y} r={2.6} className="fill-primary" />
          ) : i === 1 ? (
            <circle cx={r.x} cy={r.y} r={2.6} className="fill-primary/45" />
          ) : (
            <circle cx={r.x} cy={r.y} r={2.6} stroke="currentColor" strokeWidth={1.25} />
          )}
        </g>
      ))}
      <circle data-k="he-core" cx={96} cy={60} r={2.2} className={`fill-accent ${FB}`} />
    </Plate>
  );
}

/* ------------------------------------------------------------------------ */
/* Healthcare — "round-the-clock staffing"                                   */

const DIAL = { x: 96, y: 50 };

function arc(r: number, a0: number, a1: number) {
  const x0 = DIAL.x + r * Math.cos(rad(a0));
  const y0 = DIAL.y + r * Math.sin(rad(a0));
  const x1 = DIAL.x + r * Math.cos(rad(a1));
  const y1 = DIAL.y + r * Math.sin(rad(a1));
  return `M${px(x0)} ${px(y0)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${px(x1)} ${px(y1)}`;
}

/** The face's 24 hours; every sixth runs further in. */
function hourTicks(major: boolean) {
  let d = "";
  for (let h = 0; h < 24; h++) {
    if ((h % 6 === 0) !== major) continue;
    const a = rad(h * 15 - 90);
    const r0 = major ? 18.5 : 21.5;
    d += `M${px(DIAL.x + r0 * Math.cos(a))} ${px(DIAL.y + r0 * Math.sin(a))}L${px(DIAL.x + 24 * Math.cos(a))} ${px(DIAL.y + 24 * Math.sin(a))}`;
  }
  return d;
}

/* Three eight-hour shifts, 110 degrees each with 10 between, around the face.
   Day sits under the "now" mark at rest. */
const SHIFT_ARCS = { day: arc(33, -145, -35), evening: arc(33, -25, 85), night: arc(33, 95, 205) };
const MINOR_TICKS = hourTicks(false);
const MAJOR_TICKS = hourTicks(true);
/** The on-call trace: flat, a small wave, the beat, a small wave, flat. */
const BEAT = "M40 102H78Q81 99 84 102H88L91 92L95 111L98 102H104Q108 97 112 102H152";

const HC_LOOP: Loop = {
  /* One turn a day, at a second an hour: each shift spends eight under the
     mark. Counter-clockwise, so the NEXT shift is the one arriving. */
  period: 24000,
  tracks: {
    "hc-turn": [at("transform", [0, "rotate(0deg)", LIN], [1, "rotate(-360deg)"])],
    /* The beat travels the trace, then the line rests; its light reaches the
       end at 0.51, which is when the on-call point answers. */
    "hc-beat": [{ prop: "strokeDashoffset", period: 2600, frames: [[0, 0.22, LIN], [0.62, -1.02], [1, -1.02]] }],
    "hc-call": [
      {
        prop: "transform",
        period: 2600,
        frames: [[0, sc(1)], [0.5, sc(1), OUT], [0.58, sc(1.7), IO], [0.8, sc(1)], [1, sc(1)]],
      },
    ],
    "hc-ring": [
      { prop: "opacity", period: 2600, frames: [[0, 0], [0.5, 0, LIN], [0.54, 0.6, OUT], [0.9, 0], [1, 0]] },
      { prop: "transform", period: 2600, frames: [[0, sc(1)], [0.54, sc(1), OUT], [0.9, sc(2.4)], [1, sc(2.4)]] },
    ],
  },
};

/**
 * A 24-hour dial with its three shifts — day in the bright blue, evening in
 * the brand blue, night in ink — turning slowly under a fixed "now" mark, and
 * under the dial an on-call trace with a beat running along it. The amber
 * point at its end is the person on call, answering each beat.
 */
function HealthcareArt() {
  const id = useSvgId();
  return (
    <Plate>
      <defs>
        <Pool id={`${id}-pool`} strength={0.12} />
        <Bright id={`${id}-day`} />
        <Bright id={`${id}-beat`} y2={0} />
        <Disc id={`${id}-hub`} />
      </defs>
      <circle cx={DIAL.x} cy={DIAL.y} r={40} fill={`url(#${id}-pool)`} />
      <circle cx={DIAL.x} cy={DIAL.y} r={26.5} strokeWidth={1} className="fill-canvas stroke-border-strong" />
      <path d={MINOR_TICKS} strokeWidth={1} strokeLinecap="round" className="stroke-border-strong" />
      <path d={MAJOR_TICKS} strokeWidth={1.25} strokeLinecap="round" className="stroke-ink-subtle/60" />

      <g data-k="hc-turn" style={{ transformOrigin: `${DIAL.x}px ${DIAL.y}px` }}>
        <path d={SHIFT_ARCS.night} strokeWidth={4.5} strokeLinecap="round" className="stroke-ink/70" />
        <path d={SHIFT_ARCS.evening} strokeWidth={4.5} strokeLinecap="round" stroke="currentColor" />
        <path d={SHIFT_ARCS.day} strokeWidth={4.5} strokeLinecap="round" stroke={`url(#${id}-day)`} />
      </g>

      {/* "Now": the mark over the dial and the hand that points at it. */}
      <path d="M93 6.5H99L96 11Z" className="fill-primary" />
      <path d={`M${DIAL.x} ${DIAL.y}V${DIAL.y - 15}`} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      <circle cx={DIAL.x} cy={DIAL.y} r={2.6} fill={`url(#${id}-hub)`} />

      <path d={BEAT} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" className="stroke-primary/25" />
      <path
        data-k="hc-beat"
        d={BEAT}
        pathLength={1}
        strokeDasharray="0.2 1.2"
        strokeDashoffset={0.22}
        stroke={`url(#${id}-beat)`}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle data-k="hc-ring" cx={152} cy={102} r={2.6} opacity={0} strokeWidth={0.75} stroke="currentColor" className={FB} />
      <circle data-k="hc-call" cx={152} cy={102} r={2.6} className={`fill-accent ${FB}`} />
    </Plate>
  );
}

/* ------------------------------------------------------------------------ */
/* Financial services — "audit-ready approvals"                              */

/* Four approvals down a form, 18 apart, with the trail joining them on the
   left and the seal stamped over the form's lower right corner. The bars stop
   by 119 so the seal (124-156) never sits on one. */
const APPROVALS = [
  { y: 37, w: 38, w2: 14 },
  { y: 55, w: 30, w2: 20 },
  { y: 73, w: 42, w2: 10 },
  { y: 91, w: 26, w2: 18 },
] as const;
/** When each approval lands. The trail reaches each row as its check pops. */
const APPROVED_AT = [0.24, 0.325, 0.41, 0.495] as const;

/** The seal's edge: 14 scallops around a 14.5 radius, peaking near 15.7. */
const SEAL = (() => {
  const n = 14;
  const p = (k: number, r: number) => {
    const a = (k / n) * Math.PI * 2;
    return `${px(140 + r * Math.cos(a))} ${px(88 + r * Math.sin(a))}`;
  };
  let d = `M${p(0, 14.5)}`;
  for (let k = 0; k < n; k++) d += `Q${p(k + 0.5, 17.2)} ${p(k + 1, 14.5)}`;
  return `${d}Z`;
})();

const FS_LOOP: Loop = {
  period: 8000,
  tracks: {
    /* Per row: the disc pops, the check draws over it, the row's bar lights. */
    ...keyed(APPROVED_AT, (_, i) => `fs-disc-${i}`, (t) => [pop(0.13, t)]),
    ...keyed(APPROVED_AT, (_, i) => `fs-tick-${i}`, (t) => [redraw(0.12, t + 0.03, t + 0.08)]),
    ...keyed(APPROVED_AT, (_, i) => `fs-mark-${i}`, (t) => [refade(0.12, t + 0.03, t + 0.1)]),
    /* A third of the trail per approval, arriving as the next one lands. */
    "fs-trail": [
      at(
        "strokeDashoffset",
        [0, 0],
        [0.12, 0, IN],
        [0.17, HIDDEN],
        [0.285, 1, IO],
        [0.325, 0.667],
        [0.37, 0.667, IO],
        [0.41, 0.333],
        [0.455, 0.333, IO],
        [0.495, 0],
        [1, 0],
      ),
    ],
    "fs-seal": [
      at(
        "transform",
        [0, "rotate(0deg) scale(1)"],
        [0.12, "rotate(0deg) scale(1)", IN],
        [0.17, "rotate(0deg) scale(0.4)"],
        [0.58, "rotate(-30deg) scale(0.4)", BACK],
        [0.67, "rotate(0deg) scale(1)"],
        [1, "rotate(0deg) scale(1)"],
      ),
      at("opacity", [0, 1], [0.12, 1, IN], [0.17, 0], [0.58, 0, OUT], [0.61, 1], [1, 1]),
    ],
    "fs-ripple": [
      at("opacity", [0, 0], [0.645, 0, LIN], [0.665, 0.5, OUT], [0.84, 0], [1, 0]),
      at("transform", [0, sc(1)], [0.665, sc(1), OUT], [0.84, sc(1.5)], [1, sc(1.5)]),
    ],
  },
};

/**
 * A form of four approvals, checked one after another down a trail that
 * draws itself from each to the next, and then stamped. The seal is the amber:
 * gold, the color a seal has always been.
 */
function FinancialServicesArt() {
  const id = useSvgId();
  return (
    <Plate>
      <defs>
        <Disc id={`${id}-disc`} />
      </defs>
      <rect x={36} y={14} width={98} height={92} rx={9} strokeWidth={1} className="fill-canvas stroke-border-strong" />
      <rect x={46} y={22} width={30} height={4} rx={2} className="fill-surface-3" />
      <rect x={110} y={22} width={14} height={4} rx={2} className="fill-surface-2" />

      <path d="M50 37V91" strokeWidth={1} strokeDasharray="1.5 2.5" className="stroke-border-strong" />
      <path
        data-k="fs-trail"
        d="M50 37V91"
        pathLength={1}
        strokeDasharray={DASH}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {APPROVALS.map((row, i) => (
        <g key={row.y}>
          <rect x={62} y={row.y - 2.5} width={row.w} height={5} rx={2.5} className="fill-surface-3" />
          <rect data-k={`fs-mark-${i}`} x={62} y={row.y - 2.5} width={row.w} height={5} rx={2.5} className="fill-primary/30" />
          <rect x={67 + row.w} y={row.y - 2.5} width={row.w2} height={5} rx={2.5} className="fill-surface-2" />
          <circle cx={50} cy={row.y} r={6.5} strokeWidth={1} className="fill-canvas stroke-border-strong" />
          <circle data-k={`fs-disc-${i}`} cx={50} cy={row.y} r={6.5} fill={`url(#${id}-disc)`} className={FB} />
          <path
            data-k={`fs-tick-${i}`}
            d={`M46.6 ${row.y + 0.2}L48.9 ${row.y + 2.6}L53.2 ${row.y - 2.2}`}
            pathLength={1}
            strokeDasharray={DASH}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-canvas"
          />
        </g>
      ))}

      <circle data-k="fs-ripple" cx={140} cy={88} r={17} opacity={0} strokeWidth={1} stroke="currentColor" className={FB} />
      {/* Stamped at a slant; the loop turns it in from further round. */}
      <g transform="rotate(-10 140 88)">
        <g data-k="fs-seal" className={FB}>
          <path d={SEAL} className="fill-accent" />
          <circle cx={140} cy={88} r={10.8} strokeWidth={0.75} strokeDasharray="0.8 1.6" className="stroke-accent-ink/40" />
          <path
            d="M134.6 88.2L138.6 92.2L145.6 84.6"
            strokeWidth={1.9}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-accent-ink"
          />
        </g>
      </g>
    </Plate>
  );
}

/* ------------------------------------------------------------------------ */
/* Retail — "large hourly workforces that change with the season"            */

/** Headcount through a retail year, two bars a month: a winter trough, a
    spring and summer climb, the back-to-school bump, then the holiday peak
    across November and December. Out of 70, the tallest bar. */
const YEAR = [
  18, 15, 14, 16, 19, 22, 24, 22, 25, 27, 30, 33, 34, 31, 36, 30, 24, 23, 27, 34, 46, 60, 70, 52,
] as const;
const BAR = { x0: 34, pitch: 5.25, w: 3.2, foot: 96 };
/** The core team: everything above this line is the season. */
const CORE = 22;

const RT_LOOP: Loop = {
  period: 6800,
  tracks: {
    /* Every bar sinks to the off-season in a quick wave left to right, then
       a slower wave brings them back, each swelling past its height and
       settling — and the taller the bar, the bigger the swell, so the holiday
       weeks surge. Bar 23 settles at 0.818, then the year holds. */
    ...keyed(
      YEAR,
      (_, i) => `rt-${i}`,
      (h, i) => {
        const sink = 0.1 + 0.006 * i;
        const rise = 0.28 + 0.016 * i;
        const swell = 1 + 0.06 + 0.16 * (h / 70) ** 2;
        const y = (s: number) => `scaleY(${s.toFixed(3)})`;
        return [
          at(
            "transform",
            [0, y(1)],
            [sink, y(1), IO],
            [sink + 0.1, y(0.22)],
            [rise, y(0.22), OUT],
            [rise + 0.08, y(swell), IO],
            [rise + 0.17, y(1)],
            [1, y(1)],
          ),
        ];
      },
    ),
    /* The season's mark returns as the wave reaches November (bar 20 at 0.6). */
    "rt-season": [refade(0.1, 0.62, 0.74)],
  },
};

/**
 * The year as a row of slim bars — headcount, two to a month — over a dashed
 * line where the core team ends. Each loop the year sinks to the off-season
 * and a wave brings it back, swelling into the holiday peak and settling. The
 * amber under November and December marks the season.
 */
function RetailArt() {
  const id = useSvgId();
  const months = Array.from({ length: 13 }, (_, m) => `M${px(33 + 10.5 * m)} 98.5v2`).join("");
  return (
    <Plate>
      <defs>
        {/* One gradient across the whole chart, not one per bar: only the
            tall bars reach the bright end, so the peak is the lit part. */}
        <linearGradient id={`${id}-bars`} gradientUnits="userSpaceOnUse" x1="0" y1="26" x2="0" y2="96">
          <stop offset="0" stopColor="#008eff" />
          <stop offset="1" stopColor="#1972b9" />
        </linearGradient>
        <Pool id={`${id}-pool`} strength={0.12} />
      </defs>
      <ellipse cx={140} cy={60} rx={40} ry={44} fill={`url(#${id}-pool)`} />
      <path d={`M28 ${BAR.foot - CORE}H164`} strokeWidth={0.75} strokeDasharray="2 3" className="stroke-border-strong" />
      {YEAR.map((h, i) => (
        <rect
          key={i}
          data-k={`rt-${i}`}
          x={px(BAR.x0 + BAR.pitch * i)}
          y={BAR.foot - h}
          width={BAR.w}
          height={h}
          rx={BAR.w / 2}
          fill={`url(#${id}-bars)`}
          opacity={px(0.45 + 0.55 * (h / 70))}
          className={FB_FOOT}
        />
      ))}
      <path d="M28 97.25H164" strokeWidth={1} className="stroke-border-strong" />
      <path d={months} strokeWidth={0.75} className="stroke-border-strong" />
      <rect data-k="rt-season" x={138} y={100.5} width={21} height={2.5} rx={1.25} className="fill-accent" />
    </Plate>
  );
}

/* ------------------------------------------------------------------------ */
/* Fintech — "fast-growing teams", "multi-country teams"                     */

const GROWTH = "M20 95H38V87H56V77H74V65H92V49H108";
/** The steps' corners, and how far along the 134-long curve each one is. */
const STEPS = [
  { x: 38, y: 87, at: 26 / 134 },
  { x: 56, y: 77, at: 54 / 134 },
  { x: 74, y: 65, at: 84 / 134 },
  { x: 92, y: 49, at: 118 / 134 },
] as const;
const HUB = { x: 108, y: 49 };
/** Three countries, fanned out of the hub. */
const LANES = [
  { y: 27, d: "M108 49C118 49 118 27 128 27H172" },
  { y: 49, d: "M108 49H172" },
  { y: 71, d: "M108 49C118 49 118 71 128 71H172" },
] as const;
/** The teams in each country, in the order they are hired: across before
    down, so hiring spreads over all three at once. The newest country is the
    smallest team. */
const HIRES = [
  { x: 142, y: 27 },
  { x: 142, y: 49 },
  { x: 142, y: 71 },
  { x: 154, y: 27 },
  { x: 154, y: 49 },
  { x: 154, y: 71 },
  { x: 166, y: 27 },
  { x: 166, y: 49 },
] as const;
/** The curve draws, at an even speed, between these two. */
const CLIMB = { from: 0.22, to: 0.5 };

const FT_LOOP: Loop = {
  period: 8400,
  tracks: {
    "ft-curve": [at("strokeDashoffset", [0, 0], [0.12, 0, IN], [0.17, HIDDEN], [CLIMB.from, 1, LIN], [CLIMB.to, 0], [1, 0])],
    "ft-area": [refade(0.12, 0.24, 0.52)],
    /* Each step's node pops as the curve reaches it. */
    ...keyed(STEPS, (_, i) => `ft-step-${i}`, (s) => [pop(0.12, CLIMB.from + (CLIMB.to - CLIMB.from) * s.at)]),
    "ft-hub": [pop(0.12, 0.49)],
    ...keyed(LANES, (_, m) => `ft-lane-${m}`, (_, m) => [redraw(0.12, 0.5 + 0.02 * m, 0.64 + 0.02 * m)]),
    ...keyed(LANES, (_, m) => `ft-land-${m}`, (_, m) => [pop(0.12, 0.53 + 0.02 * m)]),
    ...keyed(HIRES, (_, k) => `ft-hire-${k}`, (_, k) => [pop(0.12, 0.62 + 0.022 * k)]),
  },
};

/**
 * Headcount climbing in steps, a node at every step, to a hub that fans out
 * into three country lanes, and the lanes filling with teams. The amber is
 * the newest country.
 */
function FintechArt() {
  const id = useSvgId();
  return (
    <Plate>
      <defs>
        <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#008eff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#008eff" stopOpacity="0" />
        </linearGradient>
        <Bright id={`${id}-line`} y2={0} />
        <Disc id={`${id}-hub`} />
      </defs>
      <path data-k="ft-area" d={`${GROWTH}V95Z`} fill={`url(#${id}-area)`} />
      <path d="M14 95.75H114" strokeWidth={1} className="stroke-border-strong" />
      {LANES.map((lane) => (
        <path
          key={lane.y}
          d={`M128 ${lane.y}H176`}
          strokeWidth={0.75}
          strokeDasharray="2 3"
          className="stroke-border-strong"
        />
      ))}
      <path
        data-k="ft-curve"
        d={GROWTH}
        pathLength={1}
        strokeDasharray={DASH}
        stroke={`url(#${id}-line)`}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {LANES.map((lane, m) => (
        <path
          key={lane.y}
          data-k={`ft-lane-${m}`}
          d={lane.d}
          pathLength={1}
          strokeDasharray={DASH}
          stroke="currentColor"
          strokeWidth={1.25}
          strokeLinecap="round"
        />
      ))}
      {STEPS.map((s, i) => (
        <circle
          key={i}
          data-k={`ft-step-${i}`}
          cx={s.x}
          cy={s.y}
          r={2.6}
          stroke="currentColor"
          strokeWidth={1.25}
          className={`fill-canvas ${FB}`}
        />
      ))}
      {LANES.map((lane, m) =>
        m === LANES.length - 1 ? (
          <circle key={lane.y} data-k={`ft-land-${m}`} cx={128} cy={lane.y} r={3} className={`fill-accent ${FB}`} />
        ) : (
          <circle
            key={lane.y}
            data-k={`ft-land-${m}`}
            cx={128}
            cy={lane.y}
            r={2.6}
            stroke="currentColor"
            strokeWidth={1.25}
            className={`fill-canvas ${FB}`}
          />
        ),
      )}
      {HIRES.map((h, k) => (
        <circle key={k} data-k={`ft-hire-${k}`} cx={h.x} cy={h.y} r={2} className={`fill-primary ${FB}`} />
      ))}
      <g data-k="ft-hub" className={FB}>
        <circle cx={HUB.x} cy={HUB.y} r={4.4} fill={`url(#${id}-hub)`} />
        <circle cx={HUB.x} cy={HUB.y} r={1.3} className="fill-canvas" />
      </g>
    </Plate>
  );
}

/* ------------------------------------------------------------------------ */
/* AI and technology — "talent moves faster than the org chart"              */

/* Two teams of three, each with a place at its open side for the person
   who moves between them. They rest in the right-hand team. */
const TEAM_L = [
  { x: 38, y: 36, r: 3.5 },
  { x: 28, y: 74, r: 3 },
  { x: 60, y: 90, r: 4 },
] as const;
const TEAM_R = [
  { x: 154, y: 30, r: 3 },
  { x: 164, y: 70, r: 4 },
  { x: 132, y: 90, r: 3.5 },
] as const;
const SEAT_L = { x: 68, y: 56 };
const SEAT_R = { x: 126, y: 54 };
/** The move arcs over the top, through this control point. */
const BEND = { x: 97, y: 14 };
const ROUTE = `M${SEAT_R.x} ${SEAT_R.y}Q${BEND.x} ${BEND.y} ${SEAT_L.x} ${SEAT_L.y}`;

/** Where the mover is, as an offset from its seat on the right, `t` of the way
    along the arc to the left. */
function along(t: number) {
  const u = 1 - t;
  const x = u * u * SEAT_R.x + 2 * u * t * BEND.x + t * t * SEAT_L.x;
  const y = u * u * SEAT_R.y + 2 * u * t * BEND.y + t * t * SEAT_L.y;
  return tr(x - SEAT_R.x, y - SEAT_R.y);
}
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
/** A journey, sampled: eight even steps in time, eased along the arc. */
function journey(start: number, span: number, back: boolean): Frame[] {
  return Array.from({ length: 8 }, (_, k) => {
    const p = ease((k + 1) / 8);
    return [start + (span * (k + 1)) / 8, along(back ? 1 - p : p), LIN] as const;
  });
}

const AI_LOOP: Loop = {
  period: 9200,
  tracks: {
    "ai-mover": [
      at("transform", [0, along(0), LIN], [0.2, along(0), LIN], ...journey(0.2, 0.22, false), [0.66, along(1), LIN], ...journey(0.66, 0.22, true), [1, along(0)]),
    ],
    /* The right team lets go as the mover leaves, and takes it back on its
       return; the left one the other way round. One link after another. */
    ...keyed(
      TEAM_R,
      (_, j) => `ai-r-${j}`,
      (_, j) => [
        at(
          "strokeDashoffset",
          [0, 0],
          [0.14 + 0.015 * j, 0, IN],
          [0.22 + 0.015 * j, HIDDEN],
          [0.85 + 0.02 * j, EDGE, OUT],
          [0.94 + 0.02 * j, 0],
          [1, 0],
        ),
      ],
    ),
    ...keyed(
      TEAM_L,
      (_, j) => `ai-l-${j}`,
      (_, j) => [
        at(
          "strokeDashoffset",
          [0, HIDDEN],
          [0.4 + 0.02 * j, EDGE, OUT],
          [0.49 + 0.02 * j, 0],
          [0.62 + 0.015 * j, 0, IN],
          [0.7 + 0.015 * j, HIDDEN],
          [1, HIDDEN],
        ),
      ],
    ),
    "ai-pool-r": [at("opacity", [0, 1], [0.16, 1, IO], [0.34, 0.35], [0.7, 0.35, IO], [0.9, 1], [1, 1])],
    "ai-pool-l": [at("opacity", [0, 0.35], [0.26, 0.35, IO], [0.44, 1], [0.62, 1, IO], [0.8, 0.35], [1, 0.35])],
  },
};

/**
 * A skills graph of two teams, and one person — the amber — moving between
 * them over the org chart's head: the team they leave lets go of them link by
 * link, the team they join takes them on the same way. Then back again,
 * because mobility runs both ways.
 */
function AiTechnologyArt() {
  const id = useSvgId();
  const team = (nodes: readonly { x: number; y: number }[]) =>
    `M${nodes.map((n) => `${n.x} ${n.y}`).join("L")}Z`;
  return (
    <Plate>
      <defs>
        <Pool id={`${id}-pool`} strength={0.14} />
      </defs>
      <circle data-k="ai-pool-l" cx={46} cy={64} r={38} opacity={0.35} fill={`url(#${id}-pool)`} />
      <circle data-k="ai-pool-r" cx={146} cy={62} r={38} fill={`url(#${id}-pool)`} />
      <path d={team(TEAM_L)} strokeWidth={1} strokeLinejoin="round" className="fill-primary/5 stroke-border-strong" />
      <path d={team(TEAM_R)} strokeWidth={1} strokeLinejoin="round" className="fill-primary/5 stroke-border-strong" />
      <path d={ROUTE} strokeWidth={0.75} strokeDasharray="1.5 3" strokeLinecap="round" className="stroke-primary/35" />

      {TEAM_L.map((n, j) => (
        <path
          key={j}
          data-k={`ai-l-${j}`}
          d={`M${n.x} ${n.y}L${SEAT_L.x} ${SEAT_L.y}`}
          pathLength={1}
          strokeDasharray={DASH}
          strokeDashoffset={HIDDEN}
          stroke="currentColor"
          strokeWidth={1.25}
          strokeLinecap="round"
        />
      ))}
      {TEAM_R.map((n, j) => (
        <path
          key={j}
          data-k={`ai-r-${j}`}
          d={`M${n.x} ${n.y}L${SEAT_R.x} ${SEAT_R.y}`}
          pathLength={1}
          strokeDasharray={DASH}
          stroke="currentColor"
          strokeWidth={1.25}
          strokeLinecap="round"
        />
      ))}
      {[...TEAM_L, ...TEAM_R].map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r} stroke="currentColor" strokeWidth={1.25} className="fill-canvas" />
      ))}

      <g data-k="ai-mover">
        <circle cx={SEAT_R.x} cy={SEAT_R.y} r={7} stroke="currentColor" strokeWidth={1} className="fill-canvas" />
        <circle cx={SEAT_R.x} cy={SEAT_R.y} r={3.6} className="fill-accent" />
      </g>
    </Plate>
  );
}

/* ------------------------------------------------------------------------ */
/* anything else                                                             */

/**
 * For a sector the CMS adds before it has a drawing of its own: a plain group
 * of people on one record, still. Better a quiet card than a borrowed picture
 * that says the wrong thing about the workforce.
 */
function FallbackArt() {
  return (
    <Plate>
      <circle cx={96} cy={60} r={30} strokeWidth={1} strokeDasharray="1.5 3" className="stroke-primary/45" />
      {[0, 1, 2, 3, 4].map((k) => {
        const a = rad(k * 72 - 90);
        return (
          <circle
            key={k}
            cx={px(96 + 30 * Math.cos(a))}
            cy={px(60 + 30 * Math.sin(a))}
            r={4}
            stroke="currentColor"
            strokeWidth={1.25}
            className="fill-canvas"
          />
        );
      })}
      <circle cx={96} cy={60} r={5} className="fill-primary" />
    </Plate>
  );
}

/* ------------------------------------------------------------------------ */

export type Motif = { Art: ComponentType; loop: Loop | null };

/** Keyed by sector, not by position, so reordering the six in the CMS cannot
    hand Healthcare the approval trail. */
export const MOTIFS: Readonly<Record<string, Motif>> = {
  "higher-education": { Art: HigherEducationArt, loop: HE_LOOP },
  healthcare: { Art: HealthcareArt, loop: HC_LOOP },
  "financial-services": { Art: FinancialServicesArt, loop: FS_LOOP },
  retail: { Art: RetailArt, loop: RT_LOOP },
  fintech: { Art: FintechArt, loop: FT_LOOP },
  "ai-technology": { Art: AiTechnologyArt, loop: AI_LOOP },
};

export const FALLBACK_MOTIF: Motif = { Art: FallbackArt, loop: null };
