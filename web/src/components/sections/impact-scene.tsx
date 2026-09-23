"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CtaPill } from "@/components/ui/cta-pill";
import { IMPACT } from "@/lib/home-content";

/**
 * Impact, as four strands converging on one point.
 *
 * The section's own heading is "Better processes. Fewer bottlenecks. Stronger
 * business outcomes." — four separate gains adding up to one result. This is
 * that sentence drawn rather than written, which is the whole reason the device
 * belongs here and not somewhere else on the page.
 *
 * Deliberately a different scene from About's, not the same one twice:
 *   - About holds still and SWAPS at three checkpoints. This one is a single
 *     continuous move from spread to converged.
 *   - About's pin is 280vh. This one is 230vh, because it has one thing to say.
 *   - In About the scroll drives what is shown. Here the scroll drives the
 *     picture and the POINTER drives the detail — hovering a strand opens its
 *     full card. Two different jobs for two different inputs.
 *
 * The four labels carry the numbers, not the category names. "Operational
 * Efficiency" and "Reliable Delivery" say nothing on their own, and putting the
 * figures behind a hover would hide the only specific thing the section owns
 * from everyone who never hovers.
 *
 * **Desktop only.** Below lg there is no track, no pin and no drawing: the same
 * four items stack as a plain list with every field visible, because hover is
 * not an input a phone has.
 */

/** The point everything arrives at, in the scene's 0-100 space. */
const MEET = { x: 54, y: 50 };

/** Where each strand ends before it converges, and the height it enters at.
    Spread wider at the left edge than at the endpoints, so the lines sweep in
    rather than running straight. */
const STRANDS = [
  { end: { x: 30, y: 20 }, enter: 6 },
  { end: { x: 38, y: 39 }, enter: 33 },
  { end: { x: 34, y: 61 }, enter: 67 },
  { end: { x: 27, y: 80 }, enter: 94 },
];

/* The scene's timeline, as shares of the pin.
   draw  — the lines arrive
   hold  — nothing moves; this is the window where hovering is comfortable
   merge — the endpoints travel to MEET
   pay   — the outcome and the button arrive */
const DRAW_END = 0.26;
const MERGE_FROM = 0.5;
const MERGE_TO = 0.86;
const PAY_FROM = 0.72;
const PAY_TO = 0.94;

const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));
const span = (v: number, a: number, b: number) => ease((v - a) / (b - a));
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** A strand's endpoint at a given progress. */
function endAt(i: number, p: number) {
  const t = span(p, MERGE_FROM, MERGE_TO);
  const e = STRANDS[i].end;
  return { x: e.x + (MEET.x - e.x) * t, y: e.y + (MEET.y - e.y) * t };
}

/**
 * The curve. Enters flat off the left edge and arrives flat at the endpoint, so
 * the strands read as paths rather than as spokes — and they never cross each
 * other. Crossing looks good and says something untrue: these four gains do not
 * run through one another on the way to the result.
 */
function pathAt(i: number, p: number) {
  const { enter } = STRANDS[i];
  const e = endAt(i, p);
  return `M -12 ${enter} C ${18} ${enter}, ${e.x - 26} ${e.y}, ${e.x} ${e.y}`;
}

export function ImpactScene() {
  const track = useRef<HTMLDivElement>(null);
  const glowId = useId();
  const reduce = useReducedMotion();
  const [pinned, setPinned] = useState(false);
  const [p, setP] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setPinned(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!pinned || reduce) return;
    setP(clamp01(v));
  });

  // Reduced motion gets the finished frame: converged, paid off, no drawing.
  const prog = reduce ? 1 : p;
  const merged = span(prog, MERGE_FROM, MERGE_TO);
  const payoff = span(prog, PAY_FROM, PAY_TO);
  /* Hover is only offered while the strands are still four separate things. Once
     they have started to merge, the labels are sitting on top of each other and a
     card opening over the arriving payoff helps nobody. */
  const hoverable = prog < MERGE_FROM + 0.08;
  const card = hoverable && open !== null ? IMPACT.cards[open] : null;

  /* The track div is rendered in BOTH branches and always carries the ref.
     Returning a different tree for the unpinned case left `useScroll` pointed at
     a target that did not exist on the first render, and it never re-measured
     when the pinned branch appeared — progress sat at 0 and the whole scene was
     frozen on its first frame. */
  const shell = !pinned ? (
      <div className="shell py-[var(--section-y)]">
        <Reveal className="max-w-[46rem]">
          <p className="font-mono text-xs tracking-caps text-on-panel/55 uppercase">
            {IMPACT.eyebrow}
          </p>
          <h2 className="mt-5 text-3xl leading-[1.08] font-light tracking-[-0.03em] text-pretty text-on-panel">
            {IMPACT.titleLead}{" "}
            <span className="text-accent">{IMPACT.titleAccent}</span>
          </h2>
          <p className="mt-5 max-w-[56ch] text-base text-on-panel/70">{IMPACT.body}</p>
        </Reveal>

        <RevealGroup as="ul" className="mt-12 divide-y divide-white/10">
          {IMPACT.cards.map((c) => (
            <RevealItem as="li" key={c.title} className="py-6 first:pt-0">
              <p className="text-3xl leading-none font-light tracking-[-0.03em] text-on-panel tabular-nums">
                {c.stat}
              </p>
              <p className="mt-2 text-lg font-medium text-on-panel">{c.title}</p>
              <p className="mt-1.5 text-sm text-on-panel/70">{c.body}</p>
              <p className="mt-2.5 font-mono text-[0.6875rem] tracking-caps text-on-panel/55 uppercase">
                {c.statLabel} &middot; {c.source}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-10">
          <CtaPill href={IMPACT.cta.href} tone="light">
            {IMPACT.cta.label}
          </CtaPill>
        </div>
      </div>
  ) : (
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Right half, and on the SAME left edge as the heading below it — the
            58% offset is the copy column, copied verbatim. The strands all
            draw from the left and meet at x=54, so the left half is where the
            scene is busiest and the label was sitting inside its own artwork;
            at the shell gutter it lined up with nothing, and pushed to the right
            gutter it lined up with nothing either. It belongs above the words. */}
        <p className="pointer-events-none absolute top-[calc(var(--header-h)+2rem)] right-0 left-[58%] pr-[var(--gutter)] font-mono text-xs tracking-caps text-on-panel/55 uppercase">
          {IMPACT.eyebrow}
        </p>

        {/* The lines. `preserveAspectRatio="none"` lets the 0-100 grid stretch to
            whatever the pane is, which is what keeps the labels — positioned in
            the same percentages — welded to the ends of the curves at every
            width. The stroke is exempted from that stretch so it stays even. */}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
        >
          <defs>
            <radialGradient id={glowId}>
              <stop offset="0" stopColor="#008eff" stopOpacity="0.55" />
              <stop offset="1" stopColor="#008eff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {STRANDS.map((_, i) => {
            const d = pathAt(i, prog);
            // Staggered, so they arrive one after another rather than as a slab.
            const drawn = reduce ? 1 : ease(clamp01((prog - i * 0.035) / DRAW_END));
            const lit = open === i;
            return (
              <g key={i}>
                <path
                  d={d}
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - drawn}
                  fill="none"
                  stroke="#008eff"
                  strokeOpacity={lit ? 0.4 : 0.16}
                  strokeWidth="6"
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                />
                <path
                  d={d}
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - drawn}
                  fill="none"
                  stroke={lit ? "#9fd4ff" : "#2e9bff"}
                  strokeWidth="1.1"
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>

        {/* Endpoint dots and the meeting point, as their own layer: a circle in a
            stretched viewBox becomes an ellipse, and these have to stay round. */}
        {STRANDS.map((_, i) => {
          const e = endAt(i, prog);
          const drawn = reduce ? 1 : ease(clamp01((prog - i * 0.035) / DRAW_END));
          return (
            <span
              key={i}
              aria-hidden
              style={{ left: `${e.x}%`, top: `${e.y}%`, opacity: drawn * (1 - merged) }}
              className={`absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-pill transition-colors dur-fast ease-brand ${
                open === i ? "bg-[#cfe9ff]" : "bg-[#2e9bff]"
              }`}
            />
          );
        })}
        <span
          aria-hidden
          style={{
            left: `${MEET.x}%`,
            top: `${MEET.y}%`,
            opacity: merged,
            transform: `translate(-50%,-50%) scale(${0.4 + merged * 0.6})`,
          }}
          className="absolute size-5 rounded-pill bg-white shadow-[0_0_40px_12px_rgba(0,142,255,0.55)]"
        />

        {/* The labels. Buttons, not decorated text: this is the only way into the
            detail, and a pointer is not the only way people drive a page. */}
        {IMPACT.cards.map((c, i) => {
          const e = endAt(i, prog);
          const drawn = reduce ? 1 : ease(clamp01((prog - i * 0.035) / DRAW_END));
          return (
            <button
              key={c.title}
              type="button"
              onPointerEnter={() => setOpen(i)}
              onPointerLeave={() => setOpen((v) => (v === i ? null : v))}
              onFocus={() => setOpen(i)}
              onBlur={() => setOpen((v) => (v === i ? null : v))}
              tabIndex={hoverable ? 0 : -1}
              aria-hidden={!hoverable}
              style={{
                left: `${e.x}%`,
                top: `${e.y}%`,
                opacity: drawn * (1 - merged),
                pointerEvents: hoverable ? "auto" : "none",
              }}
              className="absolute max-w-[15rem] -translate-x-1/2 -translate-y-[2.1rem] cursor-pointer rounded-sm px-2 py-1 text-center font-mono text-[0.6875rem] tracking-caps whitespace-nowrap uppercase transition-colors dur-fast ease-brand"
            >
              <span className={open === i ? "text-on-panel" : "text-on-panel/70"}>
                {c.stat} {c.statLabel}
              </span>
            </button>
          );
        })}

        {/* Right half: the hovered card first, the outcome after. They never
            share the screen — hover is switched off before the payoff arrives. */}
        <div className="pointer-events-none absolute inset-y-0 right-0 left-[58%] flex items-center pr-[var(--gutter)]">
          <div className="relative w-full max-w-[30rem]">
            <AnimatePresence mode="wait">
              {card ? (
                <motion.div
                  key={card.title}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-mono text-[0.6875rem] tracking-caps text-accent uppercase">
                    {card.source}
                  </p>
                  <p className="mt-4 text-2xl leading-tight font-light text-balance text-on-panel">
                    {card.title}
                  </p>
                  <p className="mt-3 text-base text-on-panel/70">{card.body}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div
              style={{ opacity: payoff, transform: `translateY(${(1 - payoff) * 16}px)` }}
              className={`${card ? "absolute inset-0" : ""} ${payoff > 0.02 ? "" : "invisible"}`}
            >
              <h2 className="text-3xl leading-[1.08] font-light tracking-[-0.03em] text-balance text-on-panel">
                {IMPACT.titleLead}{" "}
                <span className="text-accent">{IMPACT.titleAccent}</span>
              </h2>
              <p className="mt-5 max-w-[46ch] text-base text-on-panel/70">{IMPACT.body}</p>
              <div className="pointer-events-auto mt-8">
                <CtaPill href={IMPACT.cta.href} tone="light">
                  {IMPACT.cta.label}
                </CtaPill>
              </div>
            </div>
          </div>
        </div>

        {/* Everything, always, for anyone who never hovers the scene and for
            assistive technology, which should not have to drive an animation to
            reach two thirds of a section. */}
        <ul className="sr-only">
          {IMPACT.cards.map((c) => (
            <li key={c.title}>
              {c.stat} {c.statLabel}, {c.source}. {c.title}. {c.body}
            </li>
          ))}
        </ul>
      </div>
  );

  return (
    <div ref={track} className={pinned ? "h-[230vh]" : ""}>
      {shell}
    </div>
  );
}
