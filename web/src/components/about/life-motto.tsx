"use client";

import { useRef, type CSSProperties } from "react";

import { useArrival } from "./life-chapters";

/** Each beat a step up the type scale — a phone's three, then md's. */
const SIZE = [
  "text-2xl md:text-3xl",
  "text-3xl md:text-4xl",
  "text-4xl md:text-5xl",
] as const;

/** A word the owner wrote in capitals, and any punctuation after it. */
const CAPS = /^([A-Z]{2,})(\W*)$/;

/**
 * The owner's motto, set as the section's answer to its photographs: three
 * beats, each a size up from the last, so the line reads the way it is meant
 * to be said — work, party, party again, louder each time.
 *
 * The sentence is cut where its own commas fall and nowhere else; the words
 * are the owner's and so are the capitals. Only the capitals change colour:
 * HARD, HARDER and OFTEN turn amber as their beat lands — amber may be type
 * on this ground, and measures 11.2:1 where the motto sits (the hero's accent
 * does the same) — and the rest stays white.
 *
 * The movement is rhythm, not a reveal. Each line comes up from behind its
 * own lower edge, a beat apart, and its capital word lights a moment after
 * the line has landed: da-da-DUM, three times. CSS on one flag
 * (`.life-motto[data-on]`), set once when the line reaches the screen's lower
 * sixth. The mask carries its descender room (`.life-beat`, in em), so "party"
 * keeps its tails at every size.
 *
 * The set, lit motto is the default; only a motto still below the fold when
 * the page comes to life is armed to wait for its beats (`useArrival`). So
 * without script, before hydration, under reduced motion, and for a reader
 * who is already looking at it, it is simply there, capitals amber.
 *
 * Assistive technology reads one sentence, verbatim, from a visually hidden
 * copy; the three set lines are `aria-hidden`, so nobody hears a pause the
 * owner did not write. Reduced motion keeps the flag and drops the timing.
 */
export function LifeMotto({ motto }: { motto: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const on = useArrival(ref, { once: true, margin: "0px 0px -15% 0px" });
  const parts = motto.split(", ");
  const lines = parts.map((p, i) => (i < parts.length - 1 ? `${p},` : p));

  return (
    <p ref={ref} data-on={on ? "" : undefined} className="life-motto mt-16 text-on-panel md:mt-24 lg:mt-32">
      <span className="sr-only">{motto}</span>
      <span aria-hidden className="block">
        {lines.map((line, i) => (
          <span
            key={line}
            className={`life-beat leading-[1.02] font-light tracking-[-0.035em] ${SIZE[Math.min(i, SIZE.length - 1)]}`}
            style={{ "--i": i } as CSSProperties}
          >
            <span className="block">
              {line.split(" ").map((word, w) => {
                const caps = CAPS.exec(word);
                return (
                  <span key={`${word}-${w}`}>
                    {w ? " " : null}
                    {caps ? (
                      <>
                        <span className="life-caps">{caps[1]}</span>
                        {caps[2]}
                      </>
                    ) : (
                      word
                    )}
                  </span>
                );
              })}
            </span>
          </span>
        ))}
      </span>
    </p>
  );
}
