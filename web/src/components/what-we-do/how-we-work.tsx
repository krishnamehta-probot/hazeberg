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
 * The drum is projected by hand rather than by a CSS camera. A shared
 * `perspective` puts the vanishing point in the middle of the column, and the
 * words are set from its left edge, so every word off the front was sheared —
 * it read as italic, not as curved. Here each word keeps its left edge and is
 * only scaled: down by its depth, and down again vertically by how far it has
 * turned away. Its position comes from scroll, wrapped the short way round the
 * loop, so word six is word zero's neighbour and the jump from the bottom of
 * the drum to the top happens behind it, where nothing is visible.
 *
 * The front word stops in a slot, and sits in it to the pixel. The word's line
 * box is cut to Manrope's cap height (0.72em) and moved up by the 0.023em the
 * face's ascent and descent leave it low, so the box is exactly the capitals
 * and centring the box centres the letters: 0.30em clear above and below. The
 * neighbours sit 0.19em outside the slot's rules at rest, never across them.
 *
 * Screen readers get the six steps, the cycle and the closing as plain text;
 * the drum is decoration over them. Reduced motion gets no pin and no drum:
 * the same six names, large, as a list.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/** Degrees between neighbouring words on the drum: five are in view at once. */
const PITCH = 36;
/** The drum's radius and the eye's distance from it, in multiples of the type size. */
const RADIUS = 2;
const EYE = 10;
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

/** Front word full, its neighbours faint, the far pair barely there, and gone
    before they turn edge-on (2.5 steps is 90°). */
function fade(d: number) {
  const a = Math.abs(d);
  if (a <= 1) return 1 - 0.5 * a;
  if (a <= 2) return 0.5 - 0.22 * (a - 1);
  return Math.max(0, 0.28 * (1 - (a - 2) / 0.5));
}

/** Where a word `d` steps from the front lands: its centre's drop, in type
    sizes, and its scale across and down. */
function place(d: number) {
  const a = (d * PITCH * Math.PI) / 180;
  const cos = Math.cos(a);
  const depth = EYE / (EYE - RADIUS * (cos - 1));
  return { y: RADIUS * Math.sin(a) * depth, sx: depth, sy: Math.max(0, cos) * depth };
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
        className="pointer-events-none relative -mt-[calc(var(--header-h)_+_(100svh_-_var(--header-h)_-_var(--stage-h))_/_2_-_3.5rem)] [--stage-h:calc(var(--wheel-f)_*_3.9_+_20rem)] [--wheel-f:clamp(2.75rem,min(7.2vw,11svh),8.25rem)] lg:[--stage-h:max(calc(var(--wheel-f)_*_3.9),19.5rem)]"
        style={{ height: `calc(100svh + ${((n + END) * PER_STEP).toFixed(1)}svh)` }}
      >
        <div className="sticky top-0 flex h-svh items-center overflow-hidden">
          <div className="wheel-glow absolute inset-0" />

          <div className="shell relative grid w-full gap-8 pt-[var(--header-h)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
            {/* ---- the drum ---------------------------------------------- */}
            <div className="relative">
              {/* The slot the front word stops in: a blue-lit row, its rules
                  fading out to the right, and a lit mark the height of the
                  capitals on its left edge. */}
              <div className="wheel-slot absolute inset-x-0 top-1/2 h-[calc(var(--wheel-f)*1.32)] -translate-y-1/2">
                <span className="wheel-mark absolute top-1/2 left-0 h-[calc(var(--wheel-f)*0.72)] w-0.5 -translate-y-1/2 rounded-pill" />
              </div>
              {/* The fade above and below is light falling off a curve, so it
                  runs across each word as well as between them. */}
              <ol className="relative h-[calc(var(--wheel-f)*3.9)] [mask-image:linear-gradient(to_bottom,transparent,#000_34%,#000_66%,transparent)]">
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

/** One name on the drum: placed by its distance from the front. */
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
  const transform = useTransform(d, (x) => {
    const { y, sx, sy } = place(x);
    return `translateY(calc(-50% + var(--wheel-f) * ${y.toFixed(4)})) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`;
  });
  const opacity = useTransform(d, fade);
  /* Only the word in the slot wears its number in amber. */
  const lit = useTransform(d, (x) => Math.max(0, 1 - Math.abs(x) * 1.6));

  return (
    <motion.li
      style={{ transform, opacity }}
      className="absolute top-1/2 left-5 flex origin-left items-start gap-[0.9rem] lg:left-7"
    >
      {/* Both line boxes are cut to their face's cap height and lifted by
          what the face's metrics leave below it, so `items-start` sets the
          number's capitals level with the word's. */}
      <span className="relative -top-[0.03em] grid font-mono text-[0.6875rem] leading-[0.7] tracking-caps">
        <span className="col-start-1 row-start-1 text-on-panel/45">{pad(i)}</span>
        <motion.span style={{ opacity: lit }} className="col-start-1 row-start-1 text-accent">
          {pad(i)}
        </motion.span>
      </span>
      <span
        style={{ fontSize: "var(--wheel-f)" }}
        className="relative -top-[0.023em] leading-[0.72] font-light tracking-[-0.045em] whitespace-nowrap uppercase"
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
