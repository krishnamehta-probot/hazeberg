"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * The reference template's stat strip renders "0%" in the DOM and counts up on
 * enter — the numbers are the animation. Same here, at the same 80% trigger
 * line as every other reveal.
 *
 * The final value is always in the DOM for assistive tech and for anyone with
 * reduced motion; only the sighted, motion-happy path sees it climb.
 */
export function Counter({
  value,
  suffix = "",
  duration = 1600,
  immediate = false,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  /**
   * Count on mount instead of on scroll. For a figure that appears because
   * someone opened a panel: the 80% trigger line is the right rule for a number
   * that is already on the page, but a number that did not exist until the
   * click is being looked at by definition, and waiting for a scroll that may
   * never come leaves it reading "0".
   */
  immediate?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const scrolledInto = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const inView = immediate || scrolledInto;
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    let start: number | null = null;

    const tick = (t: number) => {
      if (start === null) start = t;
      const progress = Math.min((t - start) / duration, 1);
      // easeOutExpo: fast off the mark, long settle — reads as a readout
      // landing rather than a slot machine stopping.
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setShown(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref}>
      <span aria-hidden>{(reduce ? value : shown).toLocaleString()}</span>
      <span className="sr-only">{value}</span>
      {suffix}
    </span>
  );
}
