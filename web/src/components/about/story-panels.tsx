"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

import { RevealGroup, RevealItem } from "@/components/motion/reveal";

/** Mission and vision share a shape; their literal types differ. */
type Statement = { eyebrow: string; title: string; body: string };
type Tone = "blue" | "ink";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Mission and vision as a matched pair: the same panel twice, in the brand's
 * two grounds — the mission on the blue (what Hazeberg does now, in its own
 * colour), the vision on the ink (where it is going, in the dark the hero
 * opened on). Side by side from lg, so the two read as one statement in two
 * halves; stacked below it.
 *
 * Each panel has the same three things on it, and they are what make it an
 * object rather than a coloured box:
 *
 *   rings   three quarter-circles out of the top-right corner, drawing
 *           themselves as the panel arrives, over a soft light in the corner.
 *           The page's light is the edge of a circle (`aperture-glow.tsx`);
 *           these are that idea at the scale of a card. White on the blue;
 *           on the ink they run blue to amber, the horizon's own ramp
 *   sweep   one pass of light across the face as the panel enters, once
 *   sheen   a light that follows the pointer across the face and round the
 *           rim (`.about-panel` / `.about-rim` in globals.css). It is driven
 *           by the site's one pointer listener (`specular.tsx`, via
 *           `data-spec`), so the panels add no listener of their own
 *
 * The blue is `.grad-primary-deep`, not `.grad-blue`: white body text on
 * `.grad-blue`'s lit corner measures 3.6:1, and on the deep cut its worst
 * point is 4.96:1. The face light is capped low enough to keep that.
 *
 * Reduced motion: no sweep, no draw-on, no sheen — the finished panels.
 */
export function StoryPanels({ mission, vision }: { mission: Statement; vision: Statement }) {
  return (
    <RevealGroup className="mt-16 grid gap-4 sm:gap-5 lg:mt-24 lg:grid-cols-2" stagger={0.12}>
      <RevealItem className="h-full">
        <Panel tone="blue" data={mission} order={0} />
      </RevealItem>
      <RevealItem className="h-full">
        <Panel tone="ink" data={vision} order={1} />
      </RevealItem>
    </RevealGroup>
  );
}

function Panel({ tone, data, order }: { tone: Tone; data: Statement; order: number }) {
  const reduce = useReducedMotion();
  const blue = tone === "blue";

  return (
    <article
      data-spec
      className={`about-panel grain relative isolate flex h-full min-h-[24rem] flex-col overflow-hidden rounded-2xl p-7 text-on-panel sm:min-h-[28rem] sm:p-10 lg:min-h-[32rem] lg:p-12 ${
        blue ? "grad-primary-deep" : "grad-ink"
      }`}
    >
      <Rings tone={tone} still={!!reduce} order={order} />
      <Sweep delay={0.55 + order * 0.2} still={!!reduce} />
      <span aria-hidden className="about-rim" />

      <div className="relative flex flex-1 flex-col">
        {/* White at 80% on the blue (4.6:1 at the panel's left, where the
            label sits); amber on the ink, the one ground it may be type on. */}
        <p
          className={`font-mono text-xs tracking-caps uppercase ${
            blue ? "text-on-panel/80" : "text-accent"
          }`}
        >
          {data.eyebrow}
        </p>
        <h3 className="mt-auto max-w-[18ch] pt-24 text-3xl leading-[1.08] font-light tracking-[-0.03em] text-balance text-on-panel">
          {data.title}
        </h3>
        <p
          className={`mt-5 max-w-[44ch] text-base ${blue ? "text-on-panel/90" : "text-on-panel/75"}`}
        >
          {data.body}
        </p>
      </div>
    </article>
  );
}

/** Three quarter-circles out of the panel's top-right corner, over a soft
    light in the corner itself. Drawn in a 100-unit square anchored to the
    corner; the panel's own `overflow-hidden` is the frame.

    The stroke is in the square's own units, not `non-scaling-stroke`: Chrome
    measures a non-scaling stroke's dashes on screen but `pathLength` in user
    units, so at any scale but 1 the draw-on stops short of the end. Half a
    unit is about a pixel and a quarter at the full 17rem, and stays a
    hairline on a phone. */
function Rings({ tone, still, order }: { tone: Tone; still: boolean; order: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const blue = tone === "blue";

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      className="pointer-events-none absolute top-0 right-0 aspect-square w-[52%] max-w-[17rem] overflow-visible sm:w-[46%]"
    >
      <defs>
        {/* Literal stops: SVG gradients cannot read a token. White on the
            blue; on the ink, the arc's blue -> pale -> amber. */}
        <radialGradient id={`${uid}-light`} gradientUnits="userSpaceOnUse" cx="100" cy="0" r="100">
          {blue ? (
            <>
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.16" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#fec00f" stopOpacity="0.14" />
              <stop offset="0.4" stopColor="#1972b9" stopOpacity="0.16" />
              <stop offset="1" stopColor="#1972b9" stopOpacity="0" />
            </>
          )}
        </radialGradient>
        <linearGradient id={`${uid}-ring`} x1="0" y1="0" x2="1" y2="1">
          {blue ? (
            <>
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0.14" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#2e9bff" stopOpacity="0.6" />
              <stop offset="0.55" stopColor="#a3deff" stopOpacity="0.4" />
              <stop offset="1" stopColor="#fec00f" stopOpacity="0.6" />
            </>
          )}
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${uid}-light)`} />
      {[34, 64, 94].map((r, k) => (
        <motion.path
          key={r}
          d={`M ${100 - r} 0 A ${r} ${r} 0 0 0 100 ${r}`}
          fill="none"
          stroke={`url(#${uid}-ring)`}
          strokeWidth={0.5}
          opacity={1 - k * 0.22}
          /* One starting state for server and client; reduced motion reaches
             the drawn ring with no transition. `initial={false}` would leave
             nothing for the in-view trigger to start from, and it would draw
             the ring on anyway. */
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={
            still ? { duration: 0 } : { duration: 1.5, delay: 0.3 + order * 0.15 + k * 0.16, ease: EASE }
          }
        />
      ))}
    </svg>
  );
}

/** One pass of light across the face as the panel arrives. Low and quick, so
    it reads as the panel catching the light rather than as an effect.
    Rendered either way, so the server's markup and a reduced-motion first
    render agree; still, it goes from off one edge to off the other in no
    time, and is never seen. */
function Sweep({ delay, still }: { delay: number; still: boolean }) {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-2/5"
      initial={{ x: "-120%" }}
      whileInView={{ x: "300%" }}
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      transition={still ? { duration: 0 } : { duration: 1.7, delay, ease: [0.45, 0, 0.25, 1] }}
    >
      <span className="block h-full w-full -skew-x-12 bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </motion.span>
  );
}
