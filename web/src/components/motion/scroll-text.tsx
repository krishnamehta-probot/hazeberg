"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

/**
 * A paragraph that fills in as you scroll through it, word by word.
 *
 * Two of the reference sites do this and it is the single reason a long
 * paragraph reads as something to be read rather than a wall to be skipped: the
 * scroll IS the reading. It costs nothing to comprehension because the words are
 * all in the DOM from the first frame, in order, at full size.
 *
 * It animates COLOUR, not opacity. Fading from 0 would leave most of the
 * paragraph below the AA line for anyone who lands mid-page or scrolls faster
 * than the effect — the resting state has to be legible on its own. So the
 * resting colour is `--ink-subtle`, which measures 4.75:1 on this ground and
 * clears AA for body text; the reveal only takes it to `--ink` at 16.4:1.
 *
 * The values are literal here rather than tokens because Motion interpolates
 * colours, and it cannot interpolate a `var()`. They are the two tokens by hand.
 *
 * `prefers-reduced-motion` renders the finished paragraph and never subscribes
 * to the scroll.
 */

/** `--ink-subtle` — 4.75:1 on `--surface`, safe as body text on its own. */
const REST = "#656f73";
/** `--ink` — 16.4:1. */
const READ = "#14181a";

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const color = useTransform(progress, range, [REST, READ]);
  return (
    <motion.span style={{ color }} className="inline-block">
      {children}
    </motion.span>
  );
}

export function ScrollText({
  text,
  className = "",
  progress,
}: {
  text: string;
  className?: string;
  /** Drive the fill from somewhere else. A pinned section has no scroll of its
      own left to measure — the paragraph never moves on screen — so the scene
      hands its own progress in instead. */
  progress?: MotionValue<number>;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();

  // Starts once the paragraph is nine tenths of the way up the viewport and is
  // finished by the time its top reaches a third. Any longer and the reader is
  // waiting on the animation instead of the animation following the reader.
  const own = useScroll({ target: ref, offset: ["start 0.9", "start 0.33"] });
  const scrollYProgress = progress ?? own.scrollYProgress;

  const words = text.split(" ");

  if (reduce) {
    return (
      <p data-scroll-text className={className} style={{ color: READ }}>
        {text}
      </p>
    );
  }

  return (
    <p ref={ref} data-scroll-text className={className}>
      {words.map((word, i) => {
        // Each word owns a slice of the scroll, and the slices overlap slightly
        // so the fill travels as a soft front rather than a row of switches.
        const start = i / words.length;
        const end = Math.min(1, start + 1.8 / words.length);
        return (
          <span key={`${word}-${i}`}>
            <Word progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>{" "}
          </span>
        );
      })}
    </p>
  );
}
