"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * A headline arriving from behind its own edge.
 *
 * The site's one scroll-reveal — opacity plus 64px of travel — is right for
 * blocks and wrong for display type. It moves a headline through space it does
 * not own: for three quarters of a second the h1 is a translucent grey shape
 * floating over the ground, which is the exact gesture every template ships
 * with and the reason a fade-up reads as cheap on a hero.
 *
 * A mask does not. The type slides up from under a hard edge at full opacity,
 * so what you see is a headline being uncovered rather than a headline being
 * faded in. It is the oldest trick in motion graphics and it still separates
 * work that was designed from work that was configured.
 *
 * Two things make it behave rather than clip:
 *   - the inner element carries the descender room (`pb`/`-mb`), because the
 *     mask is `overflow: hidden` and `leading-[1.04]` puts a `g` below the box
 *   - the easing is a long out-expo: fast for the first third, and then it
 *     settles. Linear or a symmetric ease reads as a slide, not as a reveal.
 *
 * `prefers-reduced-motion` renders the children and nothing else — no wrapper,
 * no transform, no mask.
 */
export function MaskReveal({
  children,
  delay = 0,
  className = "",
  as = "span",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "span" | "div";
}) {
  const reduce = useReducedMotion();
  const Outer = as === "div" ? "div" : "span";

  if (reduce) return <Outer className={className}>{children}</Outer>;

  return (
    <Outer className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block pb-[0.14em] -mb-[0.14em]"
        initial={{ y: "108%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.05, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </Outer>
  );
}

/**
 * The same arrival for body copy: a short rise with the blur coming off it.
 *
 * Blur is what the 64px reveal was reaching for and missing. Distance says
 * "this moved"; defocus says "this resolved" — and at 6px over three quarters of
 * a second it is felt rather than seen, which is the whole difference between
 * motion that flatters the type and motion that performs at it.
 *
 * Deliberately short travel. Long travel plus blur is a smear.
 */
export function SoftRise({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
