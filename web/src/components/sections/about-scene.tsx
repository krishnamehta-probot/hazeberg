"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";

import { Blob } from "@/components/motion/blob";
import { Reveal } from "@/components/motion/reveal";
import { ScrollText } from "@/components/motion/scroll-text";
import { AboutPoints } from "@/components/sections/about-points";
import { Counter } from "@/components/ui/counter";
import { CtaPill } from "@/components/ui/cta-pill";
import { ABOUT } from "@/lib/home-content";

/**
 * About, as one pinned scene.
 *
 * The section used to arrive fully formed and then just sit there while you
 * scrolled past it — everything was already on screen, so the scroll did nothing
 * but move it. Here the block holds still and the scroll drives what is inside
 * it: the paragraph fills in, the sphere turns, and the point it is carrying
 * changes at each of three checkpoints.
 *
 * A tall outer track gives the scroll something to spend and the inner sticky
 * pane stays put through it. 280vh is three checkpoints with room to read each
 * one, and it is the whole cost — when the track is spent the page carries on.
 *
 * **Desktop only.** Below lg there is no track, no pin and no sphere: the copy
 * stacks over the plain three-row list, which carries exactly the same content
 * and costs a phone nothing. A pinned scene on a phone fights the address bar
 * and reads as a hijacked scroll.
 *
 * Under `prefers-reduced-motion` the pin still exists — it is layout, not
 * motion — but nothing inside it is driven: the paragraph is already read, the
 * sphere holds one angle, and all three points are listed at once.
 */

/** Even thirds, matching the three segments of the ring exactly. The point
    changes as each segment completes, so the gauge is not describing the
    content — it IS the content's position. */
const CHECKPOINTS = [0, 1 / 3, 2 / 3];

const SWAP = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

/**
 * The progress ring: three thin white arcs, one per point, just inside the sphere.
 *
 * It was one track with one sweep over it, which read as two circles rather than
 * as a gauge and said nothing about how many points there were. Three segments
 * with a gap between them ARE the three checkpoints, so the shape tells you how
 * far in you are and how much is left.
 *
 * Each segment fills over its own third of the scroll. The ring closes exactly as
 * the pin runs out, so "the circle is complete" and "the page moves on" are the
 * same moment rather than two.
 *
 * The ring is plain white and carries no outline. The brand gradient is spent
 * entirely on the head — the point the light has reached — which is the only part
 * that has to be found at a glance. Spread over the whole ring it did the
 * opposite: the blue third measured 1.04:1 against the sphere's lit band and
 * vanished there. White is the brightest stroke available and holds nearly
 * everywhere the ring can cross.
 */
const RING_R = 46;
const SEGMENTS = 3;
/** Degrees of daylight between segments. Enough to read as separate arcs, not so
    much that the ring stops reading as a circle. */
const GAP_DEG = 7;

/** The brand ramp, positioned across the ring's own box. The head samples it by
    its x, so it glows the colour that point of the sweep would have been — the
    gradient is still there, concentrated into one moving light. */
const RAMP: [number, [number, number, number]][] = [
  [4, [0x19, 0x72, 0xb9]],
  [45, [0x00, 0x8e, 0xff]],
  [96, [0xfe, 0xc0, 0x0f]],
];

function rampAt(x: number) {
  let [x0, c0] = RAMP[0];
  let [x1, c1] = RAMP[RAMP.length - 1];
  for (let i = 0; i < RAMP.length - 1; i++) {
    if (x >= RAMP[i][0] && x <= RAMP[i + 1][0]) {
      [x0, c0] = RAMP[i];
      [x1, c1] = RAMP[i + 1];
      break;
    }
  }
  const t = x1 === x0 ? 0 : Math.min(1, Math.max(0, (x - x0) / (x1 - x0)));
  const c = c0.map((v, i) => Math.round(v + (c1[i] - v) * t));
  return `rgb(${c[0]} ${c[1]} ${c[2]})`;
}

/** Degrees clockwise from twelve o'clock, to a point on the ring. */
function polar(deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: 50 + RING_R * Math.cos(a), y: 50 + RING_R * Math.sin(a) };
}

function segPath(i: number) {
  const step = 360 / SEGMENTS;
  const from = polar(i * step + GAP_DEG / 2);
  const to = polar((i + 1) * step - GAP_DEG / 2);
  // large-arc 0, sweep 1: the short way round, clockwise.
  return `M ${from.x} ${from.y} A ${RING_R} ${RING_R} 0 0 1 ${to.x} ${to.y}`;
}

function ProgressRing({ value }: { value: number }) {
  const id = useId();
  const lead = polar(Math.min(0.9999, value) * 360);
  const glow = rampAt(lead.x);

  return (
    <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 size-full">
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor={glow} stopOpacity="0.85" />
          <stop offset="0.45" stopColor={glow} stopOpacity="0.32" />
          <stop offset="1" stopColor={glow} stopOpacity="0" />
        </radialGradient>
      </defs>

      {Array.from({ length: SEGMENTS }).map((_, i) => {
        const d = segPath(i);
        // Each segment owns its own third of the scroll.
        const fill = Math.min(1, Math.max(0, value * SEGMENTS - i));
        return (
          <g key={i}>
            <path
              d={d}
              fill="none"
              stroke="rgb(255 255 255 / 0.16)"
              strokeWidth="0.3"
              strokeLinecap="round"
            />
            {fill > 0 ? (
              <path
                d={d}
                pathLength={1}
                strokeDasharray={`${fill} 1`}
                fill="none"
                stroke="#fff"
                strokeWidth="0.55"
                strokeLinecap="round"
              />
            ) : null}
          </g>
        );
      })}

      {/* The head. A bloom rather than a hard dot, so it reads as the light that
          drew the ring rather than as a marker parked on top of it. */}
      <circle cx={lead.x} cy={lead.y} r="7" fill={`url(#${id})`} />
      <circle cx={lead.x} cy={lead.y} r="1.5" fill={glow} />
      <circle cx={lead.x} cy={lead.y} r="0.6" fill="#fff" />
    </svg>
  );
}

export function AboutScene() {
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [pinned, setPinned] = useState(false);
  const [index, setIndex] = useState(0);
  const [arc, setArc] = useState(0);

  /* The phone gets the scene too.
     It used to be gated at 1024px on the argument that a pinned frame fights a
     phone's address bar — which was true of , and is not true of :
     the small viewport height is the one that does NOT change when the bar
     hides, so the frame is the same height throughout the pin. What a phone
     actually needs is a smaller composition, not a different section, and that
     is what the sizes below are.
     Still false until mounted, because useScroll has nothing to measure on the
     server and the unpinned tree is the honest first paint. */
  useEffect(() => setPinned(true), []);

  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });

  // Re-mapped so the paragraph is finished well before the first checkpoint —
  // it is the thing you read on arrival, not something to be dragged through
  // the whole scene.
  const readProgress = useTransform(scrollYProgress, [0, 0.22], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!pinned || reduce) return;
    let next = 0;
    for (let i = 0; i < CHECKPOINTS.length; i++) if (v >= CHECKPOINTS[i]) next = i;
    setIndex(next);
    // The ring is the pin, one to one. It closes on the last frame of the pin,
    // so completing the circle and the page moving on are the same moment.
    setArc(Math.min(1, Math.max(0, v)));
  });

  const point = ABOUT.points[index];

  return (
    <div ref={track} className={pinned ? "h-[280vh]" : ""}>
      <div className={pinned ? "sticky top-0 flex h-svh items-center overflow-hidden" : ""}>
        <div className="shell grid w-full gap-7 py-10 sm:gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-center lg:gap-20 lg:py-[var(--section-y)]">
          <div>
            <Reveal>
              <p className="font-mono text-xs tracking-caps text-ink-subtle uppercase">
                {ABOUT.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              {/* Bigger only from lg. The pinned scene gives this column a whole
                  screen to fill and section-heading size left most of it empty;
                  on a phone there is no pin and no spare room, so it stays. */}
              <h2 className="mt-4 max-w-[16ch] text-2xl font-light tracking-[-0.03em] text-balance text-ink sm:text-3xl lg:mt-6 lg:max-w-[19ch] lg:text-4xl">
                <Counter value={ABOUT.stat} suffix={ABOUT.statSuffix} /> {ABOUT.statTail}
              </h2>
            </Reveal>
            <ScrollText
              text={ABOUT.body}
              progress={pinned ? readProgress : undefined}
              className="mt-4 max-w-[48ch] text-base leading-[1.5] font-light text-pretty sm:text-lg lg:mt-8 lg:max-w-[42ch] lg:text-xl"
            />
            <Reveal delay={0.2}>
              {/* The way out of the section. Yellow, because this ground is
                  light — the white fill is for the dark sections. */}
              <div className="mt-6 lg:mt-10">
                <CtaPill href={ABOUT.cta.href}>{ABOUT.cta.label}</CtaPill>
              </div>
            </Reveal>
          </div>

          {pinned ? (
            <div className="flex flex-col items-center">
              <div className="relative aspect-square w-full max-w-[13rem] sm:max-w-[18rem] lg:max-w-[26rem]">
                <Blob progress={scrollYProgress} className="absolute inset-0 size-full" />
                <ProgressRing value={reduce ? 1 : arc} />

                {/* The title sits on the sphere's core, which the shader keeps
                    dark at every angle — see the note in `blob.tsx`. */}
                <div className="absolute inset-0 grid place-items-center px-[24%]">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={point.title}
                      initial={reduce ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -10 }}
                      transition={SWAP}
                      className="text-center text-lg leading-tight font-light text-balance text-on-panel sm:text-xl lg:text-2xl"
                    >
                      {point.title}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* The line under it. Kept out of the circle: a two-line
                  description inside a disc has to fight the curve at both ends
                  and ends up set smaller than the rest of the page. */}
              <div className="mt-5 grid min-h-[3.25rem] w-full max-w-[34rem] place-items-center lg:mt-8">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={point.body}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -8 }}
                    transition={SWAP}
                    className="text-center text-sm text-balance text-ink-muted lg:text-base"
                  >
                    {point.body}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* All three, always, for anyone who never scrolls the pin and for
                  assistive technology, which should not have to animate a page
                  to reach two thirds of a section. */}
              <ul className="sr-only">
                {ABOUT.points.map((p) => (
                  <li key={p.title}>
                    {p.title}. {p.body}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <AboutPoints points={ABOUT.points} />
          )}
        </div>
      </div>
    </div>
  );
}
