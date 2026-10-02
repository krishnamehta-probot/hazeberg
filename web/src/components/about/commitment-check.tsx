"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The "verified" moment — the check a commitment earns once its proof has
 * been shown.
 *
 * It waits as a dashed ring, the check not yet given. When the proof panel
 * comes into view the instrument runs first, and only once it has landed does
 * the ring draw itself closed, fill with the brand blue, send out one ring of
 * light, and the tick draw across it. Evidence, then the verdict: in that
 * order, or it is just a decoration with a tick on it.
 *
 * `delay` is when the instrument it follows has finished. `onDone` fires when
 * the tick is drawn, so the section's index can mark the commitment checked
 * at the same moment.
 *
 * Decorative (`aria-hidden`): the panel's label says what this is. Reduced
 * motion gets the finished seal.
 */
export function CheckSeal({
  on,
  delay = 0,
  onDone,
}: {
  on: boolean;
  delay?: number;
  onDone?: () => void;
}) {
  const reduce = useReducedMotion();
  const still = !!reduce;
  const shown = still || on;
  /* One starting state for server and client: reduced motion reaches the
     finished seal with no transition, rather than skipping the animation
     with `initial={false}` — which would also skip `onDone`, and leave the
     panel and the index waiting on a seal that never lands. */
  const after = (d: number, t: Transition): Transition =>
    still ? { duration: 0 } : { ...t, delay: shown ? delay + d : 0 };

  return (
    <span aria-hidden className="relative grid size-10 shrink-0 place-items-center">
      {/* Pending. */}
      <motion.span
        className="absolute inset-0 rounded-pill border border-dashed border-white/30"
        initial={{ opacity: 1 }}
        animate={{ opacity: shown ? 0 : 1 }}
        transition={after(0.4, { duration: 0.3 })}
      />
      {/* One ring of light, once. Always in the markup, so the server and a
          reduced-motion first render agree; under reduced motion it is not
          displayed and never runs. */}
      <motion.span
        className="absolute inset-0 rounded-pill shadow-[0_0_0_2px_rgb(0_142_255/0.65)] motion-reduce:hidden"
        initial={{ opacity: 0, scale: 1 }}
        animate={on && !still ? { opacity: [0, 0.9, 0], scale: [1, 1.15, 2] } : undefined}
        transition={{ duration: 0.95, delay: delay + 0.55, ease: "easeOut", times: [0, 0.15, 1] }}
      />
      <motion.span
        className="disc-blue absolute inset-0 rounded-pill shadow-[0_0_22px_rgb(0_142_255/0.45)]"
        initial={{ opacity: 0, scale: 0.55 }}
        animate={shown ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.55 }}
        transition={after(0.4, { type: "spring", stiffness: 360, damping: 22 })}
      />
      <svg viewBox="0 0 40 40" fill="none" className="relative size-10 overflow-visible">
        <g transform="rotate(-90 20 20)">
          <motion.circle
            cx={20}
            cy={20}
            r={19.25}
            stroke="currentColor"
            strokeWidth={1.5}
            className="text-on-panel/60"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={shown ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={after(0, { duration: 0.5, ease: EASE })}
          />
        </g>
        <motion.path
          d="M12.5 20.5 L17.5 25.5 L27.5 15"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-on-panel"
          initial={{ pathLength: 0 }}
          animate={shown ? { pathLength: 1 } : { pathLength: 0 }}
          transition={after(0.62, { duration: 0.42, ease: EASE })}
          onAnimationComplete={(def) => {
            if ((def as { pathLength?: number }).pathLength === 1) onDone?.();
          }}
        />
      </svg>
    </span>
  );
}
