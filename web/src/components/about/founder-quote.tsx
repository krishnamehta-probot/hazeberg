"use client";

import { motion, useReducedMotion } from "motion/react";

import { VIEWPORT } from "@/components/motion/reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Beyond Business's bold opening, set as the note's pull-quote: two sizes up
 * from the body, light, in ink, against a blue rule down its left edge.
 *
 * The rule draws itself downwards as the quote arrives, a beat after the block
 * has risen — the same blue line the story's close draws across the page, here
 * turned to stand beside one sentence rather than under the page's last word.
 * It is not a quotation mark, and the element is not a `<blockquote>`: the
 * line is the owner's own copy about Sakthi, in the third person, not words
 * quoted from somebody else, so it is a paragraph that happens to be large.
 *
 * Reduced motion: the rule drawn, with no transition. The server's undrawn
 * frame is the same either way, so the first client render matches it.
 */
export function FounderQuote({ text }: { text: string }) {
  const reduce = useReducedMotion();
  return (
    <p className="relative mt-6 max-w-[30ch] pl-6 text-2xl leading-[1.28] font-light tracking-[-0.02em] text-pretty text-ink sm:pl-8">
      <motion.span
        aria-hidden
        className="absolute inset-y-[0.2em] left-0 w-0.5 origin-top rounded-pill bg-primary"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={VIEWPORT}
        transition={reduce ? { duration: 0 } : { duration: 1.1, delay: 0.3, ease: EASE }}
      />
      {text}
    </p>
  );
}
