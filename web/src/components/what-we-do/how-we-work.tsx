"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  ClipboardCheck,
  Cog,
  DraftingCompass,
  RefreshCw,
  Rocket,
  Search,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Eyebrow, SectionHead } from "@/components/ui/section";
import type { WHAT_WE_DO } from "@/lib/what-we-do-content";

type Data = (typeof WHAT_WE_DO)["process"];

const STEP_ICON: Record<Data["steps"][number]["key"], LucideIcon> = {
  discover: Search,
  design: DraftingCompass,
  build: Cog,
  test: ClipboardCheck,
  golive: Rocket,
  optimise: TrendingUp,
};

/**
 * How we work — the method as a wheel that never runs out.
 *
 * The client's diagram is six stages in a row with a loop back over the top,
 * labelled "Continuous cycle". A row has a last step; the loop is the row
 * admitting it should not. So the six names are set on a drum instead —
 * huge, light, the one in front sharp and the rest curving away above and
 * below — and scrolling turns it. After Optimize there is no end of the list:
 * Discover comes round again, which is the cycle said by the shape rather than
 * by an arrow. That is when the section's closing statement takes the panel.
 *
 * The section pins while the drum turns (about 2.8 screens of scroll). Each
 * step dwells in front before the drum moves on, so the panel beside it — the
 * step's title and line — has time to be read, and changes only once the word
 * has settled.
 *
 * The drum is real 3D: each word sits on a cylinder (`rotateX` then
 * `translateZ` by the radius) under one perspective. Its position comes from
 * scroll, wrapped the short way round the loop, so word six is word zero's
 * neighbour and the jump from the bottom of the drum to the top happens behind
 * it, where nothing is visible.
 *
 * Screen readers get the six steps, the cycle and the closing as plain text;
 * the drum is decoration over them. Reduced motion gets no pin and no drum:
 * the same six names, large, as a list.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/** Degrees between neighbouring words on the drum: five are in view at once. */
const PITCH = 32;
/** Share of each step's scroll spent standing still before the drum turns. */
const DWELL = 0.42;
/** Scroll held at the end, on the closed loop, in steps. */
const END = 0.7;
/** Scroll per step, in svh. */
const PER_STEP = 40;

/** Ease in and out — one turn of the drum between two steps. */
const turn = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/** Scroll progress 0..1 → drum position 0..n, dwelling on each whole step. */
function wheelAt(v: number, n: number) {
  const t = Math.min(n, Math.max(0, v) * (n + END));
  const k = Math.floor(t);
  if (k >= n) return n;
  const f = (t - k - DWELL) / (1 - DWELL);
  return k + (f <= 0 ? 0 : turn(Math.min(1, f)));
}

/** Signed distance from word i to the front, the short way round the loop. */
function offset(i: number, p: number, n: number) {
  let d = (i - p) % n;
  if (d > n / 2) d -= n;
  if (d <= -n / 2) d += n;
  return d;
}

/** Front word full, its neighbours faint, the far pair barely there, the rest gone. */
function fade(d: number) {
  const a = Math.abs(d);
  if (a <= 1) return 1 - 0.64 * a;
  if (a <= 2) return 0.36 - 0.23 * (a - 1);
  return Math.max(0, 0.13 * (1 - (a - 2) / 0.6));
}

const pad = (i: number) => String(i + 1).padStart(2, "0");

export function HowWeWork({ data }: { data: Data }) {
  const reduce = useReducedMotion();
  return (
    <section id={data.id} className="grain relative bg-void text-on-panel">
      {/* Title left, the two paragraphs right, on one baseline: the head is a
          wide band rather than a column with a screen of black beside it. */}
      <div className="shell grid gap-5 pt-[var(--section-y)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <SectionHead align="start" tone="panel" eyebrow={data.eyebrow} title={data.title} />
        <Reveal delay={0.06} className="max-w-[60ch] space-y-4 lg:max-w-[30rem]">
          {data.body.map((p) => (
            <p key={p} className="text-base text-on-panel/70">
              {p}
            </p>
          ))}
        </Reveal>
      </div>
      {reduce ? <StillList data={data} /> : <Wheel data={data} />}
    </section>
  );
}

function Wheel({ data }: { data: Data }) {
  const { steps, closing } = data;
  const n = steps.length;
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const p = useTransform(scrollYProgress, (v) => wheelAt(v, n));

  const [at, setAt] = useState({ step: 0, looped: false });
  useMotionValueEvent(p, "change", (v) => {
    const step = ((Math.round(v) % n) + n) % n;
    const looped = v > n - 0.5;
    if (step !== at.step || looped !== at.looped) setAt({ step, looped });
  });

  const step = steps[at.step];
  const Icon = at.looped ? RefreshCw : STEP_ICON[step.key];

  return (
    <>
      {/* The method as text, for everything that does not watch a drum turn. */}
      <div className="sr-only">
        <ol>
          {steps.map((s) => (
            <li key={s.key}>
              <h3>
                {s.name}: {s.title}
              </h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
        <p>{data.cycleLabel}</p>
        <h3>{closing.title}</h3>
        <p>{closing.body}</p>
      </div>

      {/* The frame is a screen tall with the drum centred in it, so its top
          is empty — a third of a screen of black under the head. The negative
          margin tucks that empty band up under the head, leaving 3.5rem
          between the paragraphs and the drum. `--stage-h` is what the frame
          actually holds: the drum, or the drum and the panel stacked. The
          frame is still pinned at the top, so the scroll mapping is exact. */}
      <div
        ref={track}
        aria-hidden
        className="pointer-events-none relative -mt-[calc(var(--header-h)_+_(100svh_-_var(--header-h)_-_var(--stage-h))_/_2_-_3.5rem)] [--stage-h:calc(var(--wheel-f)_*_3.9_+_20rem)] [--wheel-f:clamp(2.75rem,min(7.2vw,11svh),8.25rem)] [--wheel-r:calc(var(--wheel-f)*1.75)] lg:[--stage-h:max(calc(var(--wheel-f)_*_3.9),19.5rem)]"
        style={{ height: `calc(100svh + ${((n + END) * PER_STEP).toFixed(1)}svh)` }}
      >
        <div className="sticky top-0 flex h-svh items-center overflow-hidden">
          <div className="wheel-glow absolute inset-0" />

          <div className="shell relative grid w-full gap-8 pt-[var(--header-h)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
            {/* ---- the drum ---------------------------------------------- */}
            <div className="relative">
              {/* The window the front word sits in. */}
              <div className="absolute inset-x-0 top-1/2 h-[calc(var(--wheel-f)*1.3)] -translate-y-1/2 border-y border-white/10" />
              <ol className="relative h-[calc(var(--wheel-f)*3.9)] [perspective:calc(var(--wheel-r)*5)]">
                {steps.map((s, i) => (
                  <WheelWord key={s.key} p={p} i={i} n={n} name={s.name} />
                ))}
              </ol>
            </div>

            {/* ---- what the front word means ----------------------------- */}
            <div className="relative lg:max-w-[30rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={at.looped ? "loop" : step.key}
                  initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                  transition={{ duration: 0.32, ease: EASE }}
                  className="min-h-[14rem] lg:min-h-[17rem]"
                >
                  <div className="flex items-center gap-4">
                    <span className="disc-blue grid size-12 shrink-0 place-items-center rounded-pill text-primary-ink shadow-lg shadow-primary/25">
                      <Icon className="size-5" strokeWidth={1.7} />
                    </span>
                    {at.looped ? (
                      <Eyebrow tone="panel">{closing.eyebrow}</Eyebrow>
                    ) : (
                      <p className="font-mono text-xs tracking-caps text-on-panel/55 uppercase">
                        <span className="text-on-panel">{pad(at.step)}</span> / {pad(n - 1)}
                      </p>
                    )}
                  </div>
                  <h3 className="mt-7 text-2xl leading-[1.15] font-light tracking-[-0.025em] text-balance lg:text-3xl">
                    {at.looped ? closing.title : step.title}
                  </h3>
                  <p className="mt-4 max-w-[46ch] text-sm text-on-panel/70 lg:text-base">
                    {at.looped ? closing.body : step.body}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Six segments, then the loop that closes them. */}
              <div className="mt-6 flex items-center gap-1.5">
                {steps.map((s, i) => (
                  <span
                    key={s.key}
                    className={`h-[3px] flex-1 rounded-pill transition-colors dur-base ease-brand ${
                      at.looped || i <= at.step ? "bg-on-panel" : "bg-white/15"
                    }`}
                  />
                ))}
                <span
                  className={`ml-3 inline-flex shrink-0 items-center gap-2 font-mono text-[0.6875rem] tracking-caps uppercase transition-colors dur-slow ease-brand ${
                    at.looped ? "text-on-panel" : "text-on-panel/35"
                  }`}
                >
                  <RefreshCw
                    className={`size-3.5 transition-transform duration-700 ease-brand ${
                      at.looped ? "rotate-180" : ""
                    }`}
                    strokeWidth={2}
                  />
                  {data.cycleLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/** One name on the drum: placed on the cylinder by its distance from the front. */
function WheelWord({
  p,
  i,
  n,
  name,
}: {
  p: MotionValue<number>;
  i: number;
  n: number;
  name: string;
}) {
  const d = useTransform(p, (v) => offset(i, v, n));
  const transform = useTransform(
    d,
    (x) =>
      `translateY(-50%) translateZ(calc(var(--wheel-r) * -1)) rotateX(${(-x * PITCH).toFixed(2)}deg) translateZ(var(--wheel-r))`,
  );
  const opacity = useTransform(d, fade);

  return (
    <motion.li
      style={{ transform, opacity }}
      className="absolute inset-x-0 top-1/2 flex items-start gap-[0.9rem] will-change-transform [backface-visibility:hidden]"
    >
      <span className="mt-[calc(var(--wheel-f)*0.12)] font-mono text-[0.6875rem] tracking-caps text-accent">
        {pad(i)}
      </span>
      <span
        style={{ fontSize: "var(--wheel-f)" }}
        className="leading-[0.9] font-light tracking-[-0.045em] whitespace-nowrap uppercase"
      >
        {name}
      </span>
    </motion.li>
  );
}

/** Reduced motion: no pin, no drum — the six names, large, as a list. */
function StillList({ data }: { data: Data }) {
  const { closing } = data;
  return (
    <div className="shell pt-14 pb-[var(--section-y)]">
      <ol className="border-t border-white/10">
        {data.steps.map((s, i) => {
          const Icon = STEP_ICON[s.key];
          return (
            <li
              key={s.key}
              className="grid gap-5 border-b border-white/10 py-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16"
            >
              <p className="flex items-start gap-4">
                <span className="mt-2 font-mono text-[0.6875rem] tracking-caps text-accent">
                  {pad(i)}
                </span>
                <span className="text-4xl leading-none font-light tracking-[-0.04em] uppercase lg:text-5xl">
                  {s.name}
                </span>
              </p>
              <div className="flex gap-4">
                <span
                  aria-hidden
                  className="disc-blue grid size-10 shrink-0 place-items-center rounded-pill text-primary-ink"
                >
                  <Icon className="size-4" strokeWidth={1.7} />
                </span>
                <div>
                  <h3 className="text-xl font-light text-balance">{s.title}</h3>
                  <p className="mt-2 max-w-[46ch] text-sm text-on-panel/70">{s.body}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-6 inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-caps text-on-panel/80 uppercase">
        <RefreshCw aria-hidden className="size-3.5" strokeWidth={2} />
        {data.cycleLabel}
      </p>
      <div className="mt-12 grid gap-6 rounded-2xl bg-white/5 p-8 ring-1 ring-white/10 sm:p-10 lg:grid-cols-2 lg:items-end lg:gap-16">
        <div>
          <Eyebrow tone="panel">{closing.eyebrow}</Eyebrow>
          <h3 className="mt-5 max-w-[22ch] text-2xl font-light tracking-[-0.025em] text-balance">
            {closing.title}
          </h3>
        </div>
        <p className="max-w-[52ch] text-base text-on-panel/70">{closing.body}</p>
      </div>
    </div>
  );
}
