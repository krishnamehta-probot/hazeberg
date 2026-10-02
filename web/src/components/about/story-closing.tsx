"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, type Variants } from "motion/react";

/* `custom` is the line's place, or `null` for reduced motion: the same two
   states, reached with no transition. */
const LINE: Variants = {
  hidden: { y: "115%" },
  shown: (i: number | null) => ({
    y: "0%",
    transition:
      i === null ? { duration: 0 } : { duration: 1.1, delay: 0.12 + i * 0.16, ease: [0.16, 1, 0.3, 1] },
  }),
};

/**
 * The story's last line, set as large as the page sets anything: the lead in
 * ink, the accent in the brand blue, a sentence each.
 *
 * Two movements, one tied to the scroll and one to arrival:
 *   - a rule across the full width draws itself in blue as the statement
 *     comes up the screen, so the reader's own scroll is what draws the line
 *     the words then stand on
 *   - the two sentences are uncovered from behind their own lower edge, one
 *     after the other, at full opacity — `MaskReveal`'s gesture, but fired on
 *     entering view rather than on mount, since this is a screen and a half
 *     down the page
 *
 * The mask is a `block` with the descender room built in (`pb`/`-mb`, in em)
 * and comes off once the second sentence has landed, so nothing about the
 * face's metrics can crop the finished line. The observer watches the
 * paragraph, not the masked spans: an element translated out of a clipping
 * box never intersects anything.
 *
 * Reduced motion: the rule drawn and the sentences in place, with no
 * transition. The markup is the same either way — the server cannot know the
 * preference, and a first client render that dropped the mask would keep the
 * server's hidden sentences, since React does not patch attributes on
 * hydration.
 */
export function StoryClosing({ lead, accent }: { lead: string; accent: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [arrived, setArrived] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "start 0.55"] });
  const lines = [
    { text: lead, tone: "text-ink" },
    { text: accent, tone: "text-primary" },
  ];

  return (
    <div ref={ref} className="mt-20 lg:mt-32">
      <div aria-hidden className="relative h-px bg-border">
        <motion.span
          className="absolute inset-0 origin-left bg-primary"
          style={{ scaleX: reduce ? 1 : scrollYProgress }}
        />
      </div>
      <motion.p
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        className="mt-10 text-4xl leading-[1.02] font-light tracking-[-0.035em] sm:text-5xl lg:mt-14"
      >
        {lines.map((l, i) => (
          <span key={l.tone}>
            <span className={`block pb-[0.25em] -mb-[0.25em] ${arrived ? "" : "overflow-hidden"}`}>
              <motion.span
                custom={reduce ? null : i}
                variants={LINE}
                onAnimationComplete={i === lines.length - 1 ? () => setArrived(true) : undefined}
                className={`block text-balance ${l.tone}`}
              >
                {l.text}
              </motion.span>
            </span>
            {i < lines.length - 1 ? " " : null}
          </span>
        ))}
      </motion.p>
    </div>
  );
}
