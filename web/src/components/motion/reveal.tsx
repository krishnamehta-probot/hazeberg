"use client";

import { type ReactNode, type Ref } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

/**
 * The site's one scroll-reveal, ported from the reference template rather than
 * invented. Measured off it directly: every revealed child starts at
 * `opacity: 0` and `translateY(64px)`, and the group fires when its top passes
 * 80% of the viewport height — one uniform rule across all 42 of its scroll
 * triggers, which is exactly why the page feels consistent rather than busy.
 *
 * `viewport.margin: "0px 0px -20% 0px"` is that 80% line: the observer's
 * bottom edge is pulled up by a fifth of the viewport, so an element counts as
 * entered only once it is a fifth of the way up the screen.
 *
 * `once: true` — re-animating on the way back up is the single most common way
 * a reveal starts feeling like a gimmick.
 */

const DISTANCE = 64;
const EASE = [0.2, 0.7, 0.3, 1] as const;

export const VIEWPORT = { once: true, margin: "0px 0px -20% 0px" } as const;

export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
  immediate = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
  /**
   * Animate on mount instead of on scroll. Required above the fold: VIEWPORT
   * carries a -20% bottom margin, so anything sitting in the lowest fifth of the
   * first screen never enters the trigger zone and stays at opacity 0 until the
   * user scrolls. A hero CTA that is invisible until you scroll past it is a
   * broken hero. The reference does the same — its above-fold nodes ship
   * revealed and only lower sections are scroll-driven.
   */
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  const shown = reduce ? undefined : { opacity: 1, y: 0 };

  return (
    <Component
      initial={reduce ? undefined : { opacity: 0, y: DISTANCE }}
      {...(immediate ? { animate: shown } : { whileInView: shown, viewport: VIEWPORT })}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </Component>
  );
}

/**
 * Staggers its direct `RevealItem` children. Use for grids and lists, so a row
 * of cards arrives in sequence instead of as one slab.
 */
export function RevealGroup({
  children,
  className = "",
  stagger = 0.09,
  as = "div",
  ref,
  onPointerEnter,
  onPointerLeave,
  onFocusCapture,
  onBlurCapture,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "section";
  /** Passed straight through, so a caller can measure the group's own travel
      through the viewport without wrapping it in another element. */
  ref?: Ref<HTMLElement>;
  /** Pointer and focus, for a group that has to know when someone is reading it. */
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onFocusCapture?: () => void;
  onBlurCapture?: () => void;
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  const variants: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: reduce ? 0 : stagger } },
  };

  return (
    <Component
      ref={ref as never}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      variants={variants}
      className={className}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocusCapture={onFocusCapture}
      onBlurCapture={onBlurCapture}
    >
      {children}
    </Component>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: DISTANCE },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export function RevealItem({
  children,
  className = "",
  as = "div",
  onPointerEnter,
  onPointerLeave,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      variants={reduce ? undefined : itemVariants}
      className={className}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </Component>
  );
}
