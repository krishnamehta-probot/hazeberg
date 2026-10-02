"use client";

import { useRef, type ReactNode } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * A box whose CSS loop only runs while someone can see it.
 *
 * The module pages carry two continuous motions — the pulse along How we
 * engage's track and the orbits behind the call to action — and both are CSS,
 * so they cost the compositor rather than React. They still cost something,
 * and the owner's machine is slow, so each one is written paused and only
 * runs while this box is near the screen: `data-run` is the switch, and the
 * stylesheet keys `animation-play-state` off it. Reduced motion never sets it.
 *
 * Decorative by definition, so it is hidden from assistive technology. The
 * server renders it paused, which is also what the first client render
 * agrees to, so hydration has nothing to correct.
 */
export function LiveLoop({ className = "", children }: { className?: string; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const seen = useInView(ref, { margin: "120px 0px 120px 0px" });
  return (
    <div ref={ref} aria-hidden data-run={seen && !reduce ? "" : undefined} className={className}>
      {children}
    </div>
  );
}
