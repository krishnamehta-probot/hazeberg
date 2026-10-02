"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { VIEWPORT } from "@/components/motion/reveal";
import type { AboutPerson } from "@/lib/about-content";

type Years = AboutPerson["years"];

/** One ruler for the whole team, in years. A bar on its own scale says
    nothing; four on the same one say who has been at this longest. 16 is the
    smallest whole ruler that holds the longest tenure (15+) with room for its
    "+" to show past the end of the bar. */
export const SCALE = 16;
const TICKS = [0, 4, 8, 12, 16];
const EASE = [0.22, 1, 0.36, 1] as const;

export const yearsFigure = (y: Years) => `${y.value}${y.plus ? "+" : ""}`;

/* `custom` is the bar's delay, or `null` for reduced motion — the same states
   reached with no transition at all. Same states either way on purpose: the
   server cannot know the preference, so it always renders "off", and the
   client's first render has to agree with it. */
type Cue = number | null;
const FILL: Variants = {
  off: (c: Cue) => ({ scaleX: 0, transition: { duration: c === null ? 0 : 0.2 } }),
  on: (c: Cue) => ({
    scaleX: 1,
    transition: c === null ? { duration: 0 } : { duration: 0.9, delay: c, ease: EASE },
  }),
};
const TAIL: Variants = {
  off: (c: Cue) => ({ opacity: 0, transition: { duration: c === null ? 0 : 0.2 } }),
  on: (c: Cue) => ({
    opacity: 1,
    transition: c === null ? { duration: 0 } : { duration: 0.5, delay: c + 0.65 },
  }),
};

/**
 * Someone's years, drawn: a hairline on the shared 0–16 ruler that fills to
 * their figure. A "+" in the document is drawn as a "+" would be — the bar
 * does not stop at the number, it runs on and fades, because 15+ is not 15.
 *
 * Driven two ways. Uncontrolled, it fills once as it scrolls into view (the
 * site's 80% line). Controlled with `on`, it fills when `on` turns true and
 * empties when it turns false — the roster uses that, so a profile's bar
 * draws again every time the profile is opened.
 *
 * Decoration over a fact the text already states (the credentials line), so
 * it is hidden from assistive technology. Reduced motion: drawn, full, still.
 */
export function YearsBar({
  years,
  on,
  delay = 0,
  ticks = false,
  className = "",
}: {
  years: Years;
  on?: boolean;
  delay?: number;
  /** The ruler's numbers under the bar — for the large version only. */
  ticks?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const share = Math.min(1, years.value / SCALE);
  const tail = years.plus ? Math.min(1 - share, 1.25 / SCALE) : 0;

  /* Reduced motion is drawn and full from the moment it mounts, in or out of
     view and open or closed. */
  const cue: Cue = reduce ? null : delay;
  const drive =
    reduce || on !== undefined
      ? { initial: "off", animate: reduce || on ? "on" : "off" }
      : { initial: "off", whileInView: "on", viewport: VIEWPORT };

  return (
    /* Spans throughout: the small version sits inside a tab, which is a
       button, and a button may only hold phrasing content. */
    <motion.span aria-hidden {...drive} className={`block ${className}`}>
      <span className={`relative block rounded-pill bg-surface-2 ${ticks ? "h-1.5" : "h-[3px]"}`}>
        <motion.span
          custom={cue}
          variants={FILL}
          style={{ width: `${share * 100}%` }}
          className="grad-primary absolute inset-y-0 left-0 block origin-left rounded-pill"
        />
        {tail > 0 ? (
          <motion.span
            custom={cue}
            variants={TAIL}
            style={{ left: `${share * 100}%`, width: `${tail * 100}%` }}
            className="absolute inset-y-0 block rounded-r-pill bg-linear-to-r from-primary/50 to-transparent"
          />
        ) : null}
      </span>
      {ticks ? (
        <span className="relative mt-2.5 block h-3">
          {TICKS.map((t) => (
            <span
              key={t}
              style={{ left: `${(t / SCALE) * 100}%` }}
              className="absolute top-0 -translate-x-1/2 font-mono text-[0.6875rem] leading-none text-ink-subtle tabular-nums first:translate-x-0 last:-translate-x-full"
            >
              {t}
            </span>
          ))}
        </span>
      ) : null}
    </motion.span>
  );
}

/**
 * The figure over its bar, for a profile: "15+" set large in the brand blue,
 * what it counts in mono under it, and the ruler. Hidden from assistive
 * technology for the same reason as the bar — the credentials line beside it
 * says the same thing in the client's words.
 */
export function YearsBlock({
  years,
  on,
  delay = 0,
  size = "lg",
  className = "",
}: {
  years: Years;
  on?: boolean;
  delay?: number;
  size?: "lg" | "sm";
  className?: string;
}) {
  return (
    <div aria-hidden className={className}>
      <span
        className={`block leading-none font-light tracking-[-0.04em] text-primary tabular-nums ${
          size === "lg" ? "text-4xl" : "text-3xl"
        }`}
      >
        {yearsFigure(years)}
      </span>
      <span className="mt-2.5 block font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
        Years {years.scope}
      </span>
      <YearsBar years={years} on={on} delay={delay} ticks className="mt-4" />
    </div>
  );
}
