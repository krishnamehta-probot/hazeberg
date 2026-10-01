"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CtaPill } from "@/components/ui/cta-pill";
import type { HomeImpact } from "@/lib/home/types";

/**
 * Impact, as four strands converging on one point.
 *
 * The section's own heading is "Better processes. Fewer bottlenecks. Stronger
 * business outcomes." — four separate gains adding up to one result. This is
 * that sentence drawn rather than written, which is the whole reason the device
 * belongs here and not somewhere else on the page.
 *
 * It tells it in three movements, all on scroll:
 *   1. the four strands draw in, each ending in a lit node with its figure;
 *   2. the scene holds while the four gains are told one at a time — the strand
 *      lights, and its figure, label and line take the right half. A pointer
 *      (or a tap) can jump to any of them; the scroll carries on from there;
 *   3. the four ends travel to one point, the point takes the light, and the
 *      sentence the strands were drawing arrives beside it, with the button.
 * A pulse of light runs down every strand the whole time, so the picture is a
 * flow towards the result rather than four lines that stopped.
 *
 * The right half never sat empty waiting for a hover. It used to: the four
 * details were behind a pointer, and for half the pin there was a black half
 * screen beside the drawing for everyone who did not find it.
 *
 * **Drawn in pixels.** The lines were drawn in a 0-100 grid stretched to the
 * pane with `preserveAspectRatio="none"`, and their stroke exempted from the
 * stretch with `vector-effect: non-scaling-stroke`. Chrome then measures a
 * `pathLength` dash in screen pixels rather than along the path, so on a wide
 * screen every strand came out as a row of 90px dashes. The grid is still
 * 0-100 here, but it is multiplied out to the pane's measured size and the SVG
 * is drawn 1:1, so a dash is a fraction of the path again and the lines are
 * solid. Nothing is stretched, so nothing needs exempting.
 *
 * **The phone runs it too**, composed for a tall frame: the strands fall from
 * the top and land on a row of four nodes, each labelled with its figure below
 * it; they gather to a point under the row; and the detail, then the sentence,
 * take the foot of the frame.
 */

/** The point everything arrives at, in the scene's 0-100 space. */
const MEET = { x: 54, y: 50 };
const MEET_NARROW = { x: 50, y: 44 };

/** Where each strand ends before it converges, and the height it enters at.
    Spread wider at the left edge than at the endpoints, so the lines sweep in
    rather than running straight. */
const STRANDS = [
  { end: { x: 30, y: 20 }, enter: 6 },
  { end: { x: 38, y: 39 }, enter: 33 },
  { end: { x: 34, y: 61 }, enter: 67 },
  { end: { x: 27, y: 80 }, enter: 94 },
];

/** The narrow frame: four nodes in a row a third of the way down, the strands
    falling onto them from a little wider than the row. `enter` is an X here.
    Entry order and node order are the same, so no strand ever crosses another —
    these four gains do not run through one another on the way to the result. */
const STRANDS_NARROW = [
  { end: { x: 14, y: 33 }, enter: 4 },
  { end: { x: 38, y: 33 }, enter: 33 },
  { end: { x: 62, y: 33 }, enter: 67 },
  { end: { x: 86, y: 33 }, enter: 96 },
];

/* The scene's timeline, as shares of the pin.
   draw   — the lines arrive
   beats  — the four gains, one at a time
   merge  — the endpoints travel to MEET
   pay    — the outcome and the button arrive */
const DRAW_END = 0.18;
const BEATS_FROM = 0.14;
const BEATS_TO = 0.56;
const MERGE_FROM = 0.56;
const MERGE_TO = 0.84;
const PAY_FROM = 0.72;
const PAY_TO = 0.92;

const EASE = [0.22, 1, 0.36, 1] as const;
const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));
const span = (v: number, a: number, b: number) => ease((v - a) / (b - a));
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const pad = (i: number) => String(i + 1).padStart(2, "0");

/** A strand's endpoint at a given progress, in whichever geometry is running. */
function endAt(i: number, p: number, narrow: boolean) {
  const t = span(p, MERGE_FROM, MERGE_TO);
  const e = (narrow ? STRANDS_NARROW : STRANDS)[i].end;
  const m = narrow ? MEET_NARROW : MEET;
  return { x: e.x + (m.x - e.x) * t, y: e.y + (m.y - e.y) * t };
}

/**
 * The curve, in pixels. Wide, it enters flat off the left edge and arrives flat
 * at its endpoint, so the strands read as paths rather than as spokes. Narrow,
 * it falls from above the top edge, leaves vertical and arrives vertical, so
 * the sideways travel all happens in the middle.
 */
function pathAt(i: number, p: number, narrow: boolean, w: number, h: number) {
  const e = endAt(i, p, narrow);
  const X = (x: number) => ((x * w) / 100).toFixed(1);
  const Y = (y: number) => ((y * h) / 100).toFixed(1);
  if (narrow) {
    const { enter } = STRANDS_NARROW[i];
    return `M ${X(enter)} ${Y(-8)} C ${X(enter)} ${Y(e.y * 0.45)}, ${X(e.x)} ${Y(e.y * 0.55)}, ${X(e.x)} ${Y(e.y)}`;
  }
  const { enter } = STRANDS[i];
  return `M ${X(-12)} ${Y(enter)} C ${X(18)} ${Y(enter)}, ${X(e.x - 26)} ${Y(e.y)}, ${X(e.x)} ${Y(e.y)}`;
}

const noop = () => () => {};
const WIDE = "(min-width: 1024px)";
const onWide = (cb: () => void) => {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export function ImpactScene({ impact }: { impact: HomeImpact }) {
  const track = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const reduce = useReducedMotion();
  /* Pinned only on the client, where there is a scroll to drive it. The server
     and reduced motion get the still version: every figure, the sentence and
     the button, as a page. */
  const pinned = useSyncExternalStore(noop, () => true, () => false);
  const narrow = useSyncExternalStore(onWide, () => !window.matchMedia(WIDE).matches, () => false);
  const [p, setP] = useState(0);
  const [size, setSize] = useState({ w: 0, h: 0 });
  /* Pointer and keyboard pick a gain while they are on it; a tap picks it until
     the scroll reaches the next one. */
  const [hover, setHover] = useState<number | null>(null);
  const [tapped, setTapped] = useState<{ i: number; at: number } | null>(null);

  const still = !pinned || !!reduce;

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [still]);

  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!still) setP(clamp01(v));
  });

  /* The track div is rendered in BOTH branches and always carries the ref.
     Returning a different tree for the unpinned case left `useScroll` pointed at
     a target that did not exist on the first render, and it never re-measured
     when the pinned branch appeared — progress sat at 0 and the whole scene was
     frozen on its first frame. */
  if (still) {
    return (
      <div ref={track}>
        <div className="shell py-[var(--section-y)]">
          <Reveal className="max-w-[46rem]">
            <p className="font-mono text-xs tracking-caps text-on-panel/55 uppercase">{impact.eyebrow}</p>
            <h2 className="mt-5 text-3xl leading-[1.08] font-light tracking-[-0.03em] text-pretty text-on-panel">
              {impact.titleLead} <span className="text-accent">{impact.titleAccent}</span>
            </h2>
            <p className="mt-5 max-w-[56ch] text-base text-on-panel/70">{impact.body}</p>
          </Reveal>

          <RevealGroup as="ul" className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2">
            {impact.cards.map((c) => (
              <RevealItem as="li" key={c.title} className="bg-void p-6 sm:p-7">
                <p className="text-4xl leading-none font-light tracking-[-0.03em] text-on-panel tabular-nums">
                  {c.stat}
                </p>
                <p className="mt-3 font-mono text-[0.6875rem] tracking-caps text-accent uppercase">{c.statLabel}</p>
                <p className="mt-5 text-lg font-medium text-on-panel">{c.title}</p>
                <p className="mt-1.5 text-sm text-on-panel/70">{c.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-10">
            <CtaPill href={impact.cta.href} tone="light">
              {impact.cta.label}
            </CtaPill>
          </div>
        </div>
      </div>
    );
  }

  const { w, h } = size;
  const n = Math.min(impact.cards.length, STRANDS.length);
  const merged = span(p, MERGE_FROM, MERGE_TO);
  const payoff = span(p, PAY_FROM, PAY_TO);
  const beatsShown = span(p, BEATS_FROM - 0.04, BEATS_FROM + 0.02) * (1 - span(p, MERGE_FROM, MERGE_FROM + 0.08));
  /* Picking is only offered while the strands are still four separate things.
     Once they have started to merge, the nodes are on top of each other. */
  const live = p < MERGE_FROM + 0.04;
  const scrolled = Math.min(n - 1, Math.max(0, Math.floor(((p - BEATS_FROM) / (BEATS_TO - BEATS_FROM)) * n)));
  const active = live ? (hover ?? (tapped?.at === scrolled ? tapped.i : scrolled)) : scrolled;
  const card = impact.cards[active];
  const meet = narrow ? MEET_NARROW : MEET;
  const drawn = (i: number) => ease(clamp01((p - i * 0.03) / DRAW_END));
  const flowing = (i: number) => clamp01((drawn(i) - 0.92) / 0.08);

  return (
    <div ref={track} className="h-[300vh]">
      <div ref={frame} className="sticky top-0 h-svh overflow-hidden">
        {/* The light the strands arrive in: it gathers on the meeting point as
            they do. */}
        <div
          aria-hidden
          style={{ left: `${meet.x}%`, top: `${meet.y}%`, opacity: 0.25 + merged * 0.75 }}
          className="pointer-events-none absolute size-[min(56rem,140vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(0_142_255/0.16),rgb(25_114_185/0.05)_55%,transparent)]"
        />

        {w > 0 ? (
          <svg aria-hidden width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="absolute inset-0">
            <defs>
              {STRANDS.slice(0, n).map((_, i) => {
                const e = endAt(i, p, narrow);
                const lit = i === active && beatsShown > 0.5;
                return (
                  /* Along the strand's own direction of travel: nothing at the
                     edge it enters from, full at the node. */
                  <linearGradient
                    key={i}
                    id={`${uid}-s${i}`}
                    gradientUnits="userSpaceOnUse"
                    x1="0"
                    y1="0"
                    x2={narrow ? 0 : (e.x * w) / 100}
                    y2={narrow ? (e.y * h) / 100 : 0}
                  >
                    <stop offset="0" stopColor="#1972b9" stopOpacity="0" />
                    <stop offset="0.45" stopColor="#1972b9" stopOpacity="0.6" />
                    <stop offset="1" stopColor={lit ? "#bfe2ff" : "#2e9bff"} />
                  </linearGradient>
                );
              })}
              <linearGradient id={`${uid}-beam`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="1" stopColor="#2e9bff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {STRANDS.slice(0, n).map((_, i) => {
              const d = pathAt(i, p, narrow, w, h);
              const dr = drawn(i);
              const lit = i === active && beatsShown > 0.5;
              return (
                <g key={i}>
                  <path
                    d={d}
                    pathLength={1}
                    strokeDasharray="1 1"
                    strokeDashoffset={1 - dr}
                    fill="none"
                    stroke="#008eff"
                    strokeOpacity={lit ? 0.3 : 0.1}
                    strokeWidth={lit ? 9 : 6}
                    strokeLinecap="round"
                    className="transition-[stroke-opacity,stroke-width] dur-base ease-brand"
                  />
                  <path
                    d={d}
                    pathLength={1}
                    strokeDasharray="1 1"
                    strokeDashoffset={1 - dr}
                    fill="none"
                    stroke={`url(#${uid}-s${i})`}
                    strokeWidth={lit ? 1.8 : 1.25}
                    strokeLinecap="round"
                  />
                  {/* The pulse: a short bright run of the same path, travelling
                      towards the node, once the strand is fully drawn. */}
                  <path
                    d={d}
                    pathLength={1}
                    strokeDasharray="0.07 0.93"
                    fill="none"
                    stroke="#d6ecff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ opacity: flowing(i), animationDelay: `${-i * 0.8}s` }}
                    className="impact-flow"
                  />
                </g>
              );
            })}

            {/* Wide only: once they have met, a short beam carries the result
                across to the sentence it adds up to. */}
            {!narrow ? (
              <rect
                x={(meet.x * w) / 100 + 14}
                y={(meet.y * h) / 100 - 0.75}
                width={Math.max(0, ((57 - meet.x) * w) / 100 - 14) * payoff}
                height="1.5"
                fill={`url(#${uid}-beam)`}
              />
            ) : null}
          </svg>
        ) : null}

        {/* Nodes, as their own layer so they stay round. */}
        {STRANDS.slice(0, n).map((_, i) => {
          const e = endAt(i, p, narrow);
          const lit = i === active && beatsShown > 0.5;
          return (
            <span
              key={i}
              aria-hidden
              style={{ left: `${e.x}%`, top: `${e.y}%`, opacity: drawn(i) * (1 - merged) }}
              className={`absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-pill ring-4 transition-[background-color,box-shadow,scale] dur-base ease-brand ${
                lit
                  ? "scale-125 bg-white shadow-[0_0_22px_6px_rgb(0_142_255/0.6)] ring-[#2e9bff]/35"
                  : "bg-[#2e9bff] shadow-[0_0_14px_2px_rgb(0_142_255/0.35)] ring-[#2e9bff]/12"
              }`}
            />
          );
        })}

        {/* The meeting point, and the rings it sends out once everything has
            arrived. */}
        <div
          aria-hidden
          style={{ left: `${meet.x}%`, top: `${meet.y}%` }}
          className="pointer-events-none absolute"
        >
          {merged > 0.97 ? (
            <>
              <span className="impact-ripple absolute top-0 left-0 size-14 rounded-pill ring-1 ring-[#2e9bff]/60 lg:size-20" />
              <span
                style={{ animationDelay: "-1.3s" }}
                className="impact-ripple absolute top-0 left-0 size-14 rounded-pill ring-1 ring-[#2e9bff]/60 lg:size-20"
              />
            </>
          ) : null}
          <span
            style={{ opacity: merged, transform: `translate(-50%,-50%) scale(${0.4 + merged * 0.6})` }}
            className="absolute top-0 left-0 size-5 rounded-pill bg-white shadow-[0_0_40px_14px_rgb(0_142_255/0.55)]"
          />
        </div>

        {/* The figures, on the nodes. Buttons: they are a way into the detail,
            and a pointer is not the only way people drive a page. Wide: a glass
            tag above the node, figure and label. Narrow: the figure alone,
            under it — the label is in the detail below. */}
        {impact.cards.slice(0, n).map((c, i) => {
          const e = endAt(i, p, narrow);
          const on = i === active && beatsShown > 0.5;
          return (
            <button
              key={c.title}
              type="button"
              aria-label={`${c.stat} ${c.statLabel}`}
              aria-pressed={on}
              tabIndex={live ? 0 : -1}
              aria-hidden={!live}
              onPointerEnter={(ev) => {
                if (ev.pointerType === "mouse") setHover(i);
              }}
              onPointerLeave={(ev) => {
                if (ev.pointerType === "mouse") setHover((v) => (v === i ? null : v));
              }}
              onFocus={() => setHover(i)}
              onBlur={() => setHover((v) => (v === i ? null : v))}
              onClick={() => setTapped({ i, at: scrolled })}
              style={{
                left: `${e.x}%`,
                top: `${e.y}%`,
                opacity: drawn(i) * (1 - merged),
                pointerEvents: live ? "auto" : "none",
              }}
              className={`absolute flex -translate-x-1/2 cursor-pointer flex-col items-center rounded-xl text-center ring-1 backdrop-blur-sm transition-[background-color,color,box-shadow] dur-base ease-brand ${
                narrow
                  ? "min-h-11 min-w-11 translate-y-3.5 justify-center px-2.5 py-1.5"
                  : "-translate-y-[calc(100%+1rem)] px-3.5 py-2"
              } ${
                on
                  ? "bg-primary/25 text-on-panel shadow-[0_0_28px_-6px_rgb(0_142_255/0.6)] ring-[#2e9bff]/55"
                  : "bg-white/[0.04] text-on-panel/70 ring-white/10 hover:text-on-panel"
              }`}
            >
              <span
                aria-hidden
                className={`leading-none font-light tracking-[-0.02em] whitespace-nowrap tabular-nums ${
                  narrow ? "text-sm font-medium" : "text-xl"
                }`}
              >
                {c.stat}
              </span>
              {!narrow ? (
                <span aria-hidden className="mt-1.5 font-mono text-[0.625rem] tracking-caps whitespace-nowrap uppercase">
                  {c.statLabel}
                </span>
              ) : null}
            </button>
          );
        })}

        {/* The words. Wide: the right half, vertically centred. Narrow: the
            foot of the frame, under the row of nodes. The four gains and the
            sentence share one grid cell, so the block is always as tall as the
            taller of them and never moves when one hands over to the other. */}
        <div
          className={`pointer-events-none absolute flex ${
            narrow
              ? "inset-x-0 bottom-0 items-end px-[var(--gutter)] pb-8"
              : "inset-y-0 right-0 left-[58%] items-center pr-[var(--gutter)]"
          }`}
        >
          <div className="w-full max-w-[30rem]">
            <p className="font-mono text-xs tracking-caps text-on-panel/55 uppercase">{impact.eyebrow}</p>

            <div className="mt-5 grid lg:mt-8">
              <div
                aria-hidden={beatsShown < 0.5}
                style={{ opacity: beatsShown }}
                className={`col-start-1 row-start-1 ${beatsShown > 0.02 ? "" : "invisible"}`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                    transition={{ duration: 0.32, ease: EASE }}
                  >
                    <p className="text-4xl leading-none font-light tracking-[-0.035em] text-on-panel tabular-nums">
                      {card.stat}
                    </p>
                    <p className="mt-3 font-mono text-[0.6875rem] tracking-caps text-accent uppercase lg:mt-4">
                      {card.statLabel}
                    </p>
                    <p className="mt-5 text-xl leading-tight font-light text-on-panel lg:mt-7 lg:text-2xl">
                      {card.title}
                    </p>
                    <p className="mt-2 max-w-[44ch] text-sm text-on-panel/70 sm:text-base lg:mt-3">{card.body}</p>
                  </motion.div>
                </AnimatePresence>

                {/* Where you are in the four. */}
                <div className="mt-6 flex items-center gap-1.5 lg:mt-8">
                  {impact.cards.slice(0, n).map((c, i) => (
                    <span
                      key={c.title}
                      className={`h-[3px] w-7 rounded-pill transition-colors dur-base ease-brand ${
                        i === active ? "bg-on-panel" : i < active ? "bg-on-panel/40" : "bg-white/15"
                      }`}
                    />
                  ))}
                  <span className="ml-2.5 font-mono text-[0.6875rem] tracking-caps text-on-panel/55 tabular-nums">
                    <span className="text-on-panel">{pad(active)}</span> / {pad(n - 1)}
                  </span>
                </div>
              </div>

              <div
                style={{ opacity: payoff, transform: `translateY(${(1 - payoff) * 16}px)` }}
                className={`col-start-1 row-start-1 ${payoff > 0.02 ? "" : "invisible"}`}
              >
                <h2 className="text-2xl leading-[1.08] font-light tracking-[-0.03em] text-balance text-on-panel sm:text-3xl">
                  {impact.titleLead} <span className="text-accent">{impact.titleAccent}</span>
                </h2>
                <p className="mt-4 max-w-[46ch] text-sm text-on-panel/70 sm:text-base lg:mt-5">{impact.body}</p>
                <div className="pointer-events-auto mt-6 lg:mt-8">
                  <CtaPill href={impact.cta.href} tone="light">
                    {impact.cta.label}
                  </CtaPill>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Everything, always, for assistive technology, which should not have
            to drive an animation to reach a section. */}
        <ul className="sr-only">
          {impact.cards.map((c) => (
            <li key={c.title}>
              {c.stat} {c.statLabel}. {c.title}. {c.body}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
