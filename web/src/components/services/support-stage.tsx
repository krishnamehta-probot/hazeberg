"use client";

import { useEffect, useId, useRef, type ReactNode, type RefObject } from "react";
import { motion, type Transition } from "motion/react";

/*
 * The support models' stage: ONE team of five Hazeberg consultants, drawn
 * three ways. The section's claim is "the same team behind each", so the
 * drawing never swaps a picture for another picture — the same five figures,
 * each keeping its identity, walk from one arrangement to the next, and the
 * scenery round them (the system, the bank of time, your team's room) fades in
 * behind them once they are on their way. The walk is the claim.
 *
 *   managed        the five stand round "Your Workday" on one closed ring —
 *                  the agreed service levels — which draws itself shut from
 *                  twelve o'clock, and a short run of light keeps going round
 *                  it: owned end to end
 *   flexible       the five sit in a column beside a bank of expert time;
 *                  requests come in along five lanes, a consultant goes out to
 *                  meet each one, and every request met draws a cell of the
 *                  bank down. When the bank has given five, it is topped up
 *   augmentation   your team's room, a lead at its head marked in amber, lines
 *                  of direction running from the lead to everyone in it — and
 *                  two of ours seated in the row among your people, the other
 *                  three standing just outside it, behind them
 *
 * Everything is one 400 x 360 box, never stretched (the default `meet`, in a
 * box of the same 10:9 shape), so a stroke is the same weight everywhere and
 * the dashes on `pathLength` render as drawn. The words in it are HTML, placed
 * by the same numbers as shares of the box, so they stay 11px however large
 * the drawing is. All of it is decoration: every word a reader needs is on the
 * cards, which assistive technology reads. The stage is `aria-hidden`.
 *
 * **The markup is the finished picture**, as the industry motifs have it. The
 * server renders the arrangement the section opens on (managed), and every
 * scene's resting frame is in the markup — flexible's included: a consultant
 * out on a lane meeting a request, the next one on its way in, one cell of the
 * bank gone. Reduced motion, a paused loop and the server all show that frame;
 * the loop starts from it and passes back through it every cycle.
 *
 * Motion, and what reduced motion keeps:
 *   - the walk is a spring per figure (motion's `x`/`y`, which on SVG is a
 *     transform, so it composes with the loop's own transform underneath it).
 *     Reduced motion cuts to the new arrangement
 *   - scenery fades out fast and in late, so the old scene is gone before the
 *     figures leave it and the new one arrives as they do. Reduced motion
 *     cuts
 *   - the ring's run of light is CSS, paused unless the stage is near the
 *     screen (`data-run`) and the ring is showing and drawn shut
 *     (`data-shut`); never drawn under reduced motion
 *   - flexible's loop is a timeline of Web Animations (`TRACKS`), built when
 *     flexible is first shown on screen, paused off it, and never started
 *     under reduced motion
 */

export type Arrangement = "managed" | "flexible" | "augmentation";
const ORDER = ["managed", "flexible", "augmentation"] as const satisfies readonly Arrangement[];

/** Keyed by the model's [derived] key rather than its place, so reordering the
    three in the CMS cannot hand the managed service the bank of hours. An
    unknown key falls back to its position. */
export function arrangementOf(key: string, index: number): Arrangement {
  return ORDER.find((a) => a === key) ?? ORDER[index % ORDER.length];
}

/* Presentation, not content: the drawing's own words, each lifted from the
   models' copy — "your Workday", "agreed service levels", "expert time",
   "as requests come in", "inside your team, under your direction", "our
   consultants". No figure, no claim the cards do not make. */
const LABEL = {
  workday: "Your Workday",
  levels: "Agreed service levels",
  time: "Expert time",
  requests: "Requests",
  team: "Your team",
  lead: "Your lead",
  ours: "Our consultants",
} as const;

/* ------------------------------------------------------------------------ */
/* the box                                                                   */

const W = 400;
const H = 360;
const CX = 200;
const CY = 180;
/** A person: 16 units, so 24px on a 360px phone and 46px at its largest. */
const R = 16;

type Pt = readonly [x: number, y: number];

/** Rounded, so the server's string and the browser's are the same string —
    trigonometry may differ in its last digit between engines. */
const r2 = (v: number) => Math.round(v * 100) / 100;
const pct = (v: number, of: number) => `${r2((v / of) * 100)}%`;

/* -- managed: five on a ring of 112, the first at twelve -------------------- */
const RING = 112;
const CORE = 52;
const onRing = (i: number, r = RING): Pt => {
  const a = ((-90 + 72 * i) * Math.PI) / 180;
  return [r2(CX + r * Math.cos(a)), r2(CY + r * Math.sin(a))];
};

/* -- flexible: a bank on the left, five seats in a shallow arc beside it, and
   a lane from each seat to the right edge. 42 between seats: two people and
   ten units of air. A consultant meets a request with its center at MEET and
   the request's at DESK — 5 units between the ticket and the figure. */
const BANK = { x: 34, y: 84, w: 68, h: 192 };
const CELLS = 8;
const CELL = { x: 44, y: 94, w: 48, h: 18, gap: 4 };
const LANE_Y = [96, 138, 180, 222, 264] as const;
const SEAT_X = [144, 156, 160, 156, 144] as const;
const LANE_FROM = 184;
const LANE_TO = 392;
const MEET = 236;
const DESK = 272;
/** Which lane each consultant sits in, by identity (see `SEATS`). */
const LANE_OF = [0, 3, 2, 4, 1] as const;
/** The lanes, in the order their requests arrive in one cycle. */
const VISITS = [1, 3, 0, 4, 2] as const;
/** The resting frame is the second request being met. */
const OUT_LANE = VISITS[1];

/* -- augmentation: your team's room, its lead at the head, a row of five under
   the lead (three of yours, two of ours between them), and the rest of ours
   on a bench just outside the room. */
const ROOM = { x: 28, y: 88, w: 262, h: 216 };
const LEAD: Pt = [159, 138];
const ROW_Y = 242;
const ROW_X = [66, 112.5, 159, 205.5, 252] as const;
const YOURS = [0, 2, 4] as const;
const BENCH = { x: 322, y: 124, w: 44, h: 144 };
const BENCH_X = 344;

/**
 * Where each of the five stands, by arrangement. Index = identity: consultant
 * `k` is the one at `k` places clockwise from twelve on the managed ring.
 *
 * The five walk in step, each in a straight line, so who goes where decides
 * whether two of them brush past each other on the way. These seats were
 * chosen by searching every assignment of lanes and room places (120 x 120)
 * for the one whose closest pass, over all three walks, is widest: 42 units,
 * so no two figures ever overlap and even their halos only meet. No path
 * crosses another.
 */
const SEATS: Record<Arrangement, readonly Pt[]> = {
  managed: [onRing(0), onRing(1), onRing(2), onRing(3), onRing(4)],
  flexible: LANE_OF.map((lane): Pt => [lane === OUT_LANE ? MEET : SEAT_X[lane], LANE_Y[lane]]),
  augmentation: [
    [BENCH_X, 152],
    [BENCH_X, 240],
    [ROW_X[3], ROW_Y],
    [ROW_X[1], ROW_Y],
    [BENCH_X, 196],
  ],
};

/* ------------------------------------------------------------------------ */
/* flexible's loop                                                           */

/** One cycle, ms: five requests two seconds apart, then the top-up. */
const T = 13000;
/** The resting frame, in the cycle: the second request met. Every value the
    markup carries is the timeline's value here, and the loop starts here. */
const AT = 5000;
/** The loop waits this long after flexible is chosen, so the five have
    finished walking to their seats before anything else moves. */
const SETTLE = 650;
const STEP = 2000;
/** A request comes in from just past the right edge. */
const FROM_X = 412;

const LIN = "linear";
const OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const IO = "cubic-bezier(0.65, 0, 0.35, 1)";

type Prop = "transform" | "opacity";
/** [time in the cycle (ms), value, the easing from this frame to the next] */
type Frame = readonly [t: number, value: number, easing?: string];
type Track = { readonly prop: Prop; readonly frames: readonly Frame[] };

/** Holds a track's first value from the start of the cycle and its last to
    the end, so every track spans exactly one cycle. */
function span(frames: Frame[]): Frame[] {
  const out = [...frames];
  if (out[0][0] > 0) out.unshift([0, out[0][1]]);
  const last = out[out.length - 1];
  if (last[0] < T) out.push([T, last[1]]);
  return out;
}

/** A track's value at `t`, straight between frames. Exact at `AT`, because
    `AT` falls on a held or a linear stretch of every track — never inside an
    eased one. */
function valueAt(frames: readonly Frame[], t: number) {
  for (let i = 1; i < frames.length; i++) {
    const [t0, v0] = frames[i - 1];
    const [t1, v1] = frames[i];
    if (t <= t1) return t1 === t0 ? v1 : v0 + ((v1 - v0) * (t - t0)) / (t1 - t0);
  }
  return frames[frames.length - 1][1];
}

/**
 * The timeline, keyed by the `data-k` each element carries. Per request `v`,
 * arriving at `s = v * STEP`:
 *
 *   t{v}  the request drifts in along its lane (linear, 2.6s), settles at the
 *         desk (0.4s), and fades once it has been met
 *   k{v}  its tick: the ticket turns blue as it is met
 *   c{k}  the consultant on that lane goes out to it as it settles, waits
 *         while it is met, and walks back — relative to the seat the markup
 *         gives it, which for the resting frame's consultant is already out
 *   b{v}  the bank's v-th cell from the top drains as the request is met, and
 *         every drained cell refills, bottom first, at the end of the cycle
 *
 * At `AT` (5.0s): request 1 is at the desk and its consultant out to meet it,
 * request 2 is a third of the way in, request 0 is done and the top cell gone.
 */
const TRACKS: Readonly<Record<string, readonly Track[]>> = (() => {
  const out: Record<string, Track[]> = {};
  VISITS.forEach((lane, v) => {
    const s = v * STEP;
    const k = LANE_OF.indexOf(lane as (typeof LANE_OF)[number]);
    const d = MEET - SEAT_X[lane];
    const base = lane === OUT_LANE ? d : 0;
    const refill = 12000 + (VISITS.length - 1 - v) * 80;
    out[`c${k}`] = [
      {
        prop: "transform",
        frames: span([
          [s + 2500, -base, OUT],
          [s + 3000, d - base],
          [s + 3900, d - base, IO],
          [s + 4500, -base],
        ]),
      },
    ];
    out[`t${v}`] = [
      {
        prop: "transform",
        frames: span([
          [s, FROM_X, LIN],
          [s + 2600, 290, OUT],
          [s + 3000, DESK],
        ]),
      },
      {
        prop: "opacity",
        frames: span([
          [s, 0, LIN],
          [s + 500, 1],
          [s + 3500, 1, IO],
          [s + 3800, 0],
        ]),
      },
    ];
    out[`k${v}`] = [{ prop: "opacity", frames: span([[s + 3150, 0, OUT], [s + 3350, 1]]) }];
    out[`b${v}`] = [
      {
        prop: "opacity",
        frames: span([
          [s + 3150, 1, IO],
          [s + 3450, 0],
          [refill, 0, OUT],
          [refill + 300, 1],
        ]),
      },
    ];
  });
  return out;
})();

/** What the markup carries for an element: its timeline's value at `AT`. */
function rest(key: string, prop: Prop, fallback: number) {
  const track = TRACKS[key]?.find((t) => t.prop === prop);
  return track ? r2(valueAt(track.frames, AT)) : fallback;
}

const css = (prop: Prop, v: number) => (prop === "transform" ? `translateX(${v}px)` : String(v));

/**
 * Plays the timeline on every `[data-k]` element under `root`. All of it in
 * one task, so the animations share a start time and stay in step through
 * every pause after it. Each starts at `AT` (`iterationStart`) after
 * `SETTLE`; until then it has no effect, so the markup — the same frame —
 * shows.
 */
function startLoop(root: Element): Animation[] {
  const out: Animation[] = [];
  root.querySelectorAll<SVGElement>("[data-k]").forEach((el) => {
    for (const track of TRACKS[el.dataset.k ?? ""] ?? []) {
      const frames = track.frames.map(([t, v, easing]): Keyframe => ({
        offset: t / T,
        easing: easing ?? LIN,
        [track.prop]: css(track.prop, v),
      }));
      out.push(
        el.animate(frames, { duration: T, iterations: Infinity, iterationStart: AT / T, delay: SETTLE }),
      );
    }
  });
  return out;
}

/**
 * Takes one animation off the stage when flexible stops showing. Requests and
 * cells only pause where they are — their scene is fading out, and they are
 * canceled when flexible next starts. A consultant cannot simply be canceled:
 * it may be out on a lane, and dropping it back to its seat would jump while
 * the walk to the next arrangement is under way. So it is let go from where
 * it is and eased back to its markup position, under the walk.
 */
function park(a: Animation): Animation[] {
  const el = a.effect instanceof KeyframeEffect ? a.effect.target : null;
  if (!(el instanceof SVGElement) || !el.dataset.k?.startsWith("c")) {
    a.pause();
    return [a];
  }
  const tf = getComputedStyle(el).transform;
  const x = tf && tf !== "none" ? new DOMMatrixReadOnly(tf).m41 : 0;
  a.cancel();
  if (Math.abs(x) < 0.5) return [];
  return [el.animate([{ transform: `translateX(${x}px)` }, { transform: "translateX(0px)" }], { duration: 520, easing: OUT })];
}

/**
 * Runs flexible's timeline while flexible is the arrangement showing and the
 * stage is near the screen. Built the first time both are true, not on mount,
 * so a reader who never opens flexible costs nothing; paused, not rebuilt,
 * when the stage leaves the screen, so it keeps its place.
 *
 * Reduced motion never builds it and cancels it if it turns on mid-visit. It
 * decides only whether to START anything — the markup is the same for
 * everyone — so the store's server value (`quiet` until hydrated) cannot make
 * the first client render disagree with the HTML.
 */
function useFlexLoop(
  scope: RefObject<SVGSVGElement | null>,
  showing: boolean,
  near: boolean,
  quiet: boolean,
) {
  const live = useRef<Animation[]>([]);
  const parked = useRef<Animation[]>([]);

  useEffect(() => {
    const root = scope.current;
    const list = live.current;
    const old = parked.current;
    if (!root) return;
    if (quiet) {
      [...list, ...old].forEach((a) => a.cancel());
      list.length = 0;
      old.length = 0;
      return;
    }
    if (!showing) {
      list.forEach((a) => old.push(...park(a)));
      list.length = 0;
      return;
    }
    if (!near) {
      list.forEach((a) => a.pause());
      return;
    }
    if (!list.length) {
      /* The paused requests and cells go; a consultant still easing back is
         left to land — it ends on its markup position, and the new loop does
         not move it until `SETTLE`, after it has. */
      old.forEach((a) => {
        if (a.playState === "paused") a.cancel();
      });
      old.length = 0;
      list.push(...startLoop(root));
    }
    list.forEach((a) => a.play());
  }, [scope, showing, near, quiet]);

  useEffect(() => {
    const list = live.current;
    const old = parked.current;
    return () => {
      [...list, ...old].forEach((a) => a.cancel());
      list.length = 0;
      old.length = 0;
    };
  }, []);
}

/* ------------------------------------------------------------------------ */
/* motion                                                                    */

const EASE = [0.22, 1, 0.36, 1] as const;
const INSTANT: Transition = { duration: 0 };
/** The walk: all five in step, as one team, over about 0.85s, arriving with
    the smallest settle rather than a bounce. In step is also what the seats
    were searched against (`SEATS`). */
const WALK: Transition = { type: "spring", visualDuration: 0.85, bounce: 0.12 };

/** Scenery: out fast, in once the figures are well on their way. */
const fade = (on: boolean, quiet: boolean): Transition =>
  quiet ? INSTANT : on ? { duration: 0.45, delay: 0.35, ease: EASE } : { duration: 0.2, ease: "easeOut" };

/** A stroke that draws itself: in after the scene has arrived, out quickly. */
const draw = (on: boolean, quiet: boolean, delay: number): Transition =>
  quiet ? INSTANT : on ? { duration: 1.1, delay, ease: EASE } : { duration: 0.3, ease: "easeOut" };

/* ------------------------------------------------------------------------ */
/* the stage                                                                 */

const pad = (i: number) => String(i + 1).padStart(2, "0");

/**
 * The stage: a white instrument on the section's gray, with a dot field under
 * the drawing — a plotted map rather than shapes on paper, as the flow hub's
 * ring has it. Three rows: a readout (which model the drawing shows, and the
 * auto-advance's timer when there is one), the drawing, and its key.
 *
 * The drawing never grows taller than the screen leaves room for beside the
 * cards (`100svh` less the header and the stage's own rows), because from lg
 * the stage rides beside them as a sticky column; under lg it is held to 30rem
 * so a tablet's stage is not a wall.
 */
export function SupportStage({
  arrangement,
  names,
  active,
  seen,
  near,
  quiet,
  held,
  timer,
}: {
  arrangement: Arrangement;
  /** The models' names, for the readout. */
  names: readonly string[];
  active: number;
  /** The section has been revealed: the ring may draw itself shut. */
  seen: boolean;
  /** The stage is on or near the screen: loops may run. */
  near: boolean;
  /** Reduced motion, as the store reads it (`true` on the server). */
  quiet: boolean;
  /** The auto-advance is holding for a pointer or focus. */
  held: boolean;
  /** The auto-advance's timer, when it is running at all. */
  timer: ReactNode;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const svg = useRef<SVGSVGElement>(null);
  const is = (a: Arrangement) => arrangement === a;
  const n = names.length;

  useFlexLoop(svg, is("flexible"), near, quiet);

  return (
    <div
      aria-hidden
      data-mode={arrangement}
      data-run={near && !quiet ? "" : undefined}
      className="sm-stage relative isolate overflow-hidden rounded-2xl bg-canvas shadow-xl shadow-primary/6 ring-1 ring-border"
    >
      <span className="sm-field pointer-events-none absolute inset-0" />

      {/* -- the readout ------------------------------------------------------ */}
      <div className="relative flex items-center gap-3 px-5 pt-4 sm:px-6 sm:pt-5">
        <span className="shrink-0 font-mono text-[0.6875rem] tracking-caps text-ink-subtle tabular-nums">
          <span className="text-ink">{pad(active)}</span>
          <span className="hidden sm:inline"> / {pad(n - 1)}</span>
        </span>
        <span className="hidden h-px w-4 shrink-0 bg-border-strong sm:block" />
        <span className="grid min-w-0 flex-1">
          {names.map((name, i) => (
            <span
              key={i}
              className={`col-start-1 row-start-1 font-mono text-[0.6875rem] leading-snug tracking-caps text-balance text-ink uppercase transition-opacity ease-brand ${
                i === active ? "opacity-100 delay-150 duration-300 motion-reduce:delay-0" : "opacity-0 duration-150"
              }`}
            >
              {name}
            </span>
          ))}
        </span>
        {/* The track keeps its room with no timer in it (the server's markup,
            reduced motion, stopped) and only goes clear: if it came and went,
            the names beside it would rewrap — "Flexible support packages" is
            196px and has 192px beside the track at 360px — and the stage would
            change height under a reader's tap. */}
        <span
          className={`relative h-[3px] w-12 shrink-0 overflow-hidden rounded-pill bg-border transition-opacity dur-base ease-brand ${
            !timer ? "opacity-0" : held ? "opacity-45" : ""
          }`}
        >
          {timer}
        </span>
      </div>

      {/* -- the drawing ------------------------------------------------------ */}
      <div className="relative px-2 py-3 sm:px-5 sm:py-4">
        <div className="relative mx-auto aspect-[10/9] w-full max-w-[30rem] lg:max-w-[calc((100svh_-_var(--header-h)_-_11rem)*10/9)]">
          <svg ref={svg} viewBox={`0 0 ${W} ${H}`} fill="none" className="absolute inset-0 size-full">
            <defs>
              {/* `.disc-blue`'s stops, written out: a gradient stop is the one
                  place a CSS variable is not trusted. */}
              <radialGradient id={`${uid}-disc`} cx="32%" cy="24%" r="85%">
                <stop offset="0" stopColor="#1f8ce8" />
                <stop offset="0.42" stopColor="#0d6fc4" />
                <stop offset="0.74" stopColor="#12599b" />
                <stop offset="1" stopColor="#0a3d68" />
              </radialGradient>
              {/* The client's blue, light to deep (`--grad-primary`). */}
              <linearGradient id={`${uid}-cell`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#008eff" />
                <stop offset="1" stopColor="#1972b9" />
              </linearGradient>
              <radialGradient id={`${uid}-pool`}>
                <stop offset="0" stopColor="#008eff" stopOpacity="0.14" />
                <stop offset="1" stopColor="#008eff" stopOpacity="0" />
              </radialGradient>
              {/* A person's bust, cut to their disc. In the user space of
                  whoever draws it, so one clip serves every figure. */}
              <clipPath id={`${uid}-bust`}>
                <circle r={R - 0.75} />
              </clipPath>
            </defs>

            <Managed uid={uid} on={is("managed")} seen={seen} quiet={quiet} />
            <Flexible uid={uid} on={is("flexible")} quiet={quiet} />
            <Augmentation uid={uid} on={is("augmentation")} quiet={quiet} />

            {/* -- the team: the same five, over every scene ----------------- */}
            {SEATS[arrangement].map(([x, y], k) => (
              <motion.g
                key={k}
                initial={false}
                animate={{ x, y }}
                transition={quiet ? INSTANT : WALK}
              >
                <g data-k={`c${k}`}>
                  <Person uid={uid} kind="ours" />
                </g>
              </motion.g>
            ))}
          </svg>

          {/* -- the words: HTML, so they stay 11px at any size ---------------- */}
          <Tag at={[CX, CY]} on={is("managed")} className="text-center leading-[1.45] text-ink">
            {LABEL.workday.split(" ").map((w) => (
              <span key={w} className="block">
                {w}
              </span>
            ))}
          </Tag>
          {/* The ring's own words, in its blue: 5.06:1 on white. */}
          <Tag at={[CX, 322]} on={is("managed")} className="text-primary">
            {LABEL.levels}
          </Tag>
          <Tag at={[BANK.x + BANK.w / 2, 64]} on={is("flexible")}>
            {LABEL.time}
          </Tag>
          <Tag at={[LANE_TO, 64]} on={is("flexible")} align="end">
            {LABEL.requests}
          </Tag>
          <Tag at={[ROOM.x + 8, 70]} on={is("augmentation")} align="start">
            {LABEL.team}
          </Tag>
          <Tag at={[LEAD[0] + 24, LEAD[1]]} on={is("augmentation")} align="start">
            {LABEL.lead}
          </Tag>
        </div>
      </div>

      {/* -- the key ---------------------------------------------------------- */}
      <div className="relative flex items-center gap-2.5 px-5 pb-4 font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase sm:px-6 sm:pb-5">
        <svg viewBox="-21 -21 42 42" className="size-5 shrink-0">
          <Person uid={uid} kind="ours" />
        </svg>
        {LABEL.ours}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* the three scenes                                                          */

/**
 * Managed: your Workday in the middle, the ring of agreed service levels round
 * it, and a dotted spoke from the system out to each of the five. The ring
 * waits for the section's reveal and then draws itself shut from twelve
 * o'clock, where the first consultant stands; once shut, a run of light goes
 * round it (`.sm-orbit`).
 */
function Managed({ uid, on, seen, quiet }: { uid: string; on: boolean; seen: boolean; quiet: boolean }) {
  const shut = on && seen;
  return (
    <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={fade(on, quiet)}>
      <circle cx={CX} cy={CY} r={CORE + 44} fill={`url(#${uid}-pool)`} />
      {/* The ring's halo, then the ring. */}
      <circle cx={CX} cy={CY} r={RING} className="stroke-primary/10" strokeWidth={14} />
      {Array.from({ length: 5 }, (_, i) => {
        const [x1, y1] = onRing(i, CORE + 9);
        const [x2, y2] = onRing(i, RING - R - 9);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className="stroke-ink/20"
            strokeWidth={1.25}
            strokeDasharray="1.5 4.5"
            strokeLinecap="round"
          />
        );
      })}
      <g transform={`rotate(-90 ${CX} ${CY})`}>
        <motion.circle
          cx={CX}
          cy={CY}
          r={RING}
          className="stroke-primary"
          strokeWidth={2.25}
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: shut ? 1 : 0 }}
          transition={draw(shut, quiet, 0.3)}
        />
      </g>
      {/* The run of light: on `pathLength` 1 in a box that is never stretched,
          so the dash is the length it is drawn. It turns only once the ring
          is shut (`data-shut`) — invisible before then, so not turning. */}
      <g
        className="sm-orbit"
        data-shut={shut ? "" : undefined}
        style={{ opacity: shut ? 1 : 0, transition: `opacity 600ms ${shut && !quiet ? "1.2s" : "0s"}` }}
      >
        <circle
          cx={CX}
          cy={CY}
          r={RING}
          pathLength={1}
          strokeDasharray="0.04 0.96"
          strokeLinecap="round"
          strokeWidth={3.5}
          stroke="#008eff"
        />
      </g>
      {/* The system. */}
      <circle cx={CX} cy={CY} r={CORE} className="fill-canvas stroke-border-strong" strokeWidth={1.25} />
      <circle
        cx={CX}
        cy={CY}
        r={CORE - 8}
        className="stroke-primary/30"
        strokeWidth={1.25}
        strokeDasharray="1 4.5"
        strokeLinecap="round"
      />
    </motion.g>
  );
}

/**
 * Flexible: the bank of expert time, five lanes out to the right, and the
 * requests on them. Every value an element of the loop carries in the markup
 * is its timeline's value at `AT`, so the resting frame and the loop's first
 * frame are one frame.
 */
function Flexible({ uid, on, quiet }: { uid: string; on: boolean; quiet: boolean }) {
  return (
    <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={fade(on, quiet)}>
      {LANE_Y.map((y) => (
        <line
          key={y}
          x1={LANE_FROM}
          y1={y}
          x2={LANE_TO}
          y2={y}
          className="stroke-ink/15"
          strokeWidth={1.25}
          strokeDasharray="1.5 6"
          strokeLinecap="round"
        />
      ))}

      {/* The bank: eight cells, drawn down from the top. */}
      <rect
        x={BANK.x}
        y={BANK.y}
        width={BANK.w}
        height={BANK.h}
        rx={16}
        className="fill-canvas stroke-border-strong"
        strokeWidth={1.25}
      />
      {Array.from({ length: CELLS }, (_, i) => {
        const y = CELL.y + i * (CELL.h + CELL.gap);
        const k = i < VISITS.length ? `b${i}` : undefined;
        return (
          <g key={i}>
            <rect
              x={CELL.x}
              y={y}
              width={CELL.w}
              height={CELL.h}
              rx={5}
              className="stroke-primary/25"
              strokeWidth={1}
            />
            <rect
              data-k={k}
              x={CELL.x}
              y={y}
              width={CELL.w}
              height={CELL.h}
              rx={5}
              fill={`url(#${uid}-cell)`}
              style={k ? { opacity: rest(k, "opacity", 1) } : undefined}
            />
          </g>
        );
      })}

      {/* The requests: a ticket each, ticked blue as it is met. */}
      {VISITS.map((lane, v) => (
        <g key={v} transform={`translate(0 ${LANE_Y[lane]})`}>
          <g
            data-k={`t${v}`}
            style={{
              transform: `translateX(${rest(`t${v}`, "transform", FROM_X)}px)`,
              opacity: rest(`t${v}`, "opacity", 0),
            }}
          >
            <rect x={-15} y={-11} width={30} height={22} rx={6} className="fill-canvas stroke-primary/50" strokeWidth={1.25} />
            <path d="M-8 -3.5H8M-8 3.5H3" className="stroke-ink/35" strokeWidth={1.75} strokeLinecap="round" />
            <g data-k={`k${v}`} style={{ opacity: rest(`k${v}`, "opacity", 0) }}>
              <rect x={-15} y={-11} width={30} height={22} rx={6} className="fill-primary" />
              <path
                d="M-5.5 0.5L-1.75 4.25L5.5 -3.5"
                className="stroke-on-panel"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </g>
      ))}
    </motion.g>
  );
}

/**
 * Augmentation: your team's room — the surface gray, a dashed wall — with
 * its lead at the head, the one amber in the drawing (a fill, never a word),
 * and a line of direction from the lead to everyone in the row, ours
 * included. The bench outside holds the rest of the team, behind the two who
 * are in.
 */
function Augmentation({ uid, on, quiet }: { uid: string; on: boolean; quiet: boolean }) {
  return (
    <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={fade(on, quiet)}>
      <rect
        x={BENCH.x}
        y={BENCH.y}
        width={BENCH.w}
        height={BENCH.h}
        rx={BENCH.w / 2}
        className="fill-primary/5 stroke-primary/20"
        strokeWidth={1}
      />
      <rect
        x={ROOM.x}
        y={ROOM.y}
        width={ROOM.w}
        height={ROOM.h}
        rx={28}
        className="fill-surface stroke-ink/35"
        strokeWidth={1.25}
        strokeDasharray="5 5"
      />
      {ROW_X.map((x, i) => (
        <motion.path
          key={x}
          d={`M${LEAD[0]} ${LEAD[1] + R + 5}L${x} ${ROW_Y - R - 5}`}
          className="stroke-ink/30"
          strokeWidth={1.25}
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: on ? 1 : 0 }}
          transition={draw(on, quiet, 0.45 + i * 0.05)}
        />
      ))}
      <g transform={`translate(${LEAD[0]} ${LEAD[1]})`}>
        <Person uid={uid} kind="lead" />
      </g>
      {YOURS.map((slot) => (
        <g key={slot} transform={`translate(${ROW_X[slot]} ${ROW_Y})`}>
          <Person uid={uid} kind="yours" />
        </g>
      ))}
    </motion.g>
  );
}

/* ------------------------------------------------------------------------ */
/* parts                                                                     */

/**
 * A person, at the origin: a head and shoulders cut to a disc. Ours are the
 * brand's blue glass with a white bust and a faint halo; yours are white with
 * a gray bust, and the lead carries an amber dot.
 */
function Person({ uid, kind }: { uid: string; kind: "ours" | "yours" | "lead" }) {
  const ours = kind === "ours";
  return (
    <>
      {ours ? <circle r={R + 5} className="fill-primary/8" /> : null}
      {ours ? (
        <circle r={R} fill={`url(#${uid}-disc)`} />
      ) : (
        <circle r={R} className="fill-canvas stroke-ink/30" strokeWidth={1.25} />
      )}
      <g clipPath={`url(#${uid}-bust)`} className={ours ? "fill-on-panel" : "fill-ink/30"}>
        <circle cy={-4.5} r={5.2} />
        <path d="M-10.5 18C-10.5 8.2-5.9 3.6 0 3.6S10.5 8.2 10.5 18Z" />
      </g>
      {kind === "lead" ? <circle cx={11.5} cy={-11.5} r={5.5} className="fill-accent stroke-canvas" strokeWidth={2} /> : null}
    </>
  );
}

/** A word in the drawing, placed by the drawing's own numbers. */
function Tag({
  at: [x, y],
  on,
  align = "middle",
  className = "text-ink-subtle",
  children,
}: {
  at: Pt;
  on: boolean;
  align?: "start" | "middle" | "end";
  className?: string;
  children: ReactNode;
}) {
  const shift =
    align === "start"
      ? "-translate-y-1/2"
      : align === "end"
        ? "-translate-x-full -translate-y-1/2"
        : "-translate-x-1/2 -translate-y-1/2";
  return (
    <span
      style={{ left: pct(x, W), top: pct(y, H) }}
      className={`pointer-events-none absolute font-mono text-[0.6875rem] whitespace-nowrap tracking-caps uppercase transition-opacity ease-brand ${shift} ${
        on ? "opacity-100 delay-300 duration-500 motion-reduce:delay-0" : "opacity-0 duration-200"
      } ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * Each arrangement in miniature, 24 x 24, for the cards: the ring of five
 * round the system; the bank, two seats and one going out to a request; the
 * room with its lead, your two and one of ours between them. One color
 * (`currentColor`), so the card decides it — white on the lit card's blue
 * disc, gray on an unlit one. Ours are solid, yours are outlines.
 */
export function ArrangementGlyph({ arrangement, className = "" }: { arrangement: Arrangement; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      {arrangement === "managed" ? (
        <>
          <circle cx={12} cy={12} r={8} stroke="currentColor" strokeOpacity={0.55} strokeWidth={1.3} />
          <rect x={9.6} y={9.6} width={4.8} height={4.8} rx={1.3} fill="currentColor" fillOpacity={0.55} />
          {Array.from({ length: 5 }, (_, i) => {
            const a = ((-90 + 72 * i) * Math.PI) / 180;
            return <circle key={i} cx={r2(12 + 8 * Math.cos(a))} cy={r2(12 + 8 * Math.sin(a))} r={2} fill="currentColor" />;
          })}
        </>
      ) : arrangement === "flexible" ? (
        <>
          <rect x={2.5} y={4} width={5.5} height={16} rx={1.6} stroke="currentColor" strokeOpacity={0.55} strokeWidth={1.2} />
          <rect x={4.15} y={10} width={2.2} height={3.6} rx={0.6} fill="currentColor" />
          <rect x={4.15} y={14.6} width={2.2} height={3.6} rx={0.6} fill="currentColor" />
          <circle cx={11.5} cy={6.5} r={1.9} fill="currentColor" />
          <circle cx={11.5} cy={17.5} r={1.9} fill="currentColor" />
          <circle cx={15} cy={12} r={1.9} fill="currentColor" />
          <rect x={18.4} y={9.9} width={3.6} height={4.2} rx={1} stroke="currentColor" strokeWidth={1.2} />
        </>
      ) : (
        <>
          <rect
            x={2.5}
            y={4}
            width={19}
            height={16}
            rx={4}
            stroke="currentColor"
            strokeOpacity={0.6}
            strokeWidth={1.2}
            strokeDasharray="2 1.8"
          />
          <circle cx={12} cy={8.75} r={1.75} stroke="currentColor" strokeWidth={1.2} />
          <circle cx={7.25} cy={14.75} r={1.75} stroke="currentColor" strokeWidth={1.2} />
          <circle cx={12} cy={14.75} r={2} fill="currentColor" />
          <circle cx={16.75} cy={14.75} r={1.75} stroke="currentColor" strokeWidth={1.2} />
        </>
      )}
    </svg>
  );
}
