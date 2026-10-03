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
 *
 * `emphasis` sets every run of the text it matches in semibold, inside the same
 * fill — a pattern rather than a list of phrases, so the run stays bold when an
 * editor rewords the sentence around it in the CMS. A word is bold when it lies
 * inside a match; the colour fill is untouched.
 */

/** `--ink-subtle` — 4.75:1 on `--surface`, safe as body text on its own. */
const REST = "#656f73";
/** `--ink` — 16.4:1. */
const READ = "#14181a";

function Word({
  children,
  progress,
  range,
  strong,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  strong: boolean;
}) {
  const color = useTransform(progress, range, [REST, READ]);
  const word = (
    <motion.span style={{ color }} className="inline-block">
      {children}
    </motion.span>
  );
  return strong ? <strong className="font-semibold">{word}</strong> : word;
}

/** For each word of `text.split(" ")`, whether it lies inside a match of
    `pattern`. Done on character offsets, so a match may span several words. */
function emphasized(text: string, pattern?: RegExp): boolean[] {
  const words = text.split(" ");
  if (!pattern) return words.map(() => false);
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const runs = [...text.matchAll(new RegExp(pattern.source, flags))].map((m) => [
    m.index,
    m.index + m[0].length,
  ]);
  let at = 0;
  return words.map((word) => {
    const from = at;
    const to = at + word.length;
    at = to + 1;
    return word.length > 0 && runs.some(([a, b]) => from >= a && to <= b);
  });
}

export function ScrollText({
  text,
  className = "",
  progress,
  emphasis,
}: {
  text: string;
  className?: string;
  /** Drive the fill from somewhere else. A pinned section has no scroll of its
      own left to measure — the paragraph never moves on screen — so the scene
      hands its own progress in instead. */
  progress?: MotionValue<number>;
  /** Runs of the text to set in semibold — see the doc above. */
  emphasis?: RegExp;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();

  // Starts once the paragraph is nine tenths of the way up the viewport and is
  // finished by the time its top reaches a third. Any longer and the reader is
  // waiting on the animation instead of the animation following the reader.
  const own = useScroll({ target: ref, offset: ["start 0.9", "start 0.33"] });
  const scrollYProgress = progress ?? own.scrollYProgress;

  const words = text.split(" ");
  const strong = emphasized(text, emphasis);

  if (reduce) {
    return (
      <p data-scroll-text className={className} style={{ color: READ }}>
        {words.map((word, i) => (
          <span key={`${word}-${i}`}>
            {strong[i] ? <strong className="font-semibold">{word}</strong> : word}
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
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
            <Word progress={scrollYProgress} range={[start, end]} strong={strong[i]}>
              {word}
            </Word>{" "}
          </span>
        );
      })}
    </p>
  );
}
