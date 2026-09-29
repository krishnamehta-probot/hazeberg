"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";

import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CONTACT_PAGE } from "@/lib/contact-content";

/**
 * "What happens next", as a rail the reader moves along.
 *
 * It was three static rows. The home page's whole character is that things
 * respond to the scroll, and the inner pages had none of that — so this borrows
 * the exact device the About section uses: the marker follows the reader down
 * the list, and a pointer takes it over, because a pointer is a stronger
 * statement of intent than a scroll position.
 *
 * Nothing is hidden behind the state. All three steps are fully readable at all
 * times; what changes is which one is lit. A sequence that hides two of its
 * three steps to look tidy is a sequence that has stopped explaining anything.
 *
 * The rule down the left is one continuous line with a fill that grows to the
 * active step, so the list reads as progress rather than as three bullets — and
 * the fill is the brand gradient, which is the same treatment the About rows and
 * the careers steps get.
 */
const FILL = { type: "spring", stiffness: 240, damping: 34, mass: 0.8 } as const;

export function StepsRail() {
  const { steps } = CONTACT_PAGE;
  const ref = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  /* The list's own travel through the viewport is the progress. It ends at 0.6
     rather than at the bottom, so the last step is lit while it is still being
     read instead of as it leaves the screen. */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.6"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    setActive(Math.min(steps.items.length - 1, Math.max(0, Math.floor(v * steps.items.length))));
  });

  const current = hover ?? active;

  return (
    <div>
      <p className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
        {steps.eyebrow}
      </p>

      <div className="relative mt-5">
        {/* The track, and the fill that grows down it. `top`/`bottom` insets pull
            both ends in to the first and last markers, so the line starts and
            finishes ON the sequence rather than floating past either end. */}
        <span aria-hidden className="absolute top-2 bottom-2 left-0 w-px bg-border" />
        {/* Sprung rather than tweened. A fixed 700ms gives one step and three
            steps the same duration, so the fill crawls on a small move and
            smears on a large one — see the note in `berg/workflow.tsx`. */}
        <motion.span
          aria-hidden
          className="grad-primary absolute top-2 left-0 w-px"
          animate={{ height: `${((current + 1) / steps.items.length) * 100}%` }}
          transition={reduce ? { duration: 0 } : FILL}
        />

        <RevealGroup as="ol" ref={ref} className="relative" stagger={0.06}>
          {steps.items.map((step, i) => {
            const on = i === current;
            const done = i < current;
            return (
              <RevealItem
                as="li"
                key={step.n}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                className="relative pb-7 pl-7 last:pb-0"
              >
                {/* The marker sits ON the rule. It grows and takes the brand
                    disc when it is the one you are at; steps already passed keep
                    the disc at rest size, so the rail reads as progress rather
                    than as one lit dot travelling through empty ones. */}
                <span aria-hidden className="absolute top-1.5 -left-[10px] grid size-5 place-items-center">
                  {on ? (
                    <motion.span
                      layoutId="contact-step-halo"
                      transition={reduce ? { duration: 0 } : FILL}
                      className="absolute inset-0 rounded-pill bg-primary/12 ring-1 ring-primary/30"
                    />
                  ) : null}
                  <span
                    className={`relative rounded-pill transition-all dur-base ease-brand ${
                      on
                        ? "disc-blue size-[10px]"
                        : done
                          ? "disc-blue size-[8px]"
                          : "size-[8px] bg-surface-3"
                    }`}
                  />
                </span>
                <p
                  className={`text-sm font-medium transition-colors duration-500 ease-brand ${
                    on ? "text-primary" : "text-ink"
                  }`}
                >
                  {step.title}
                </p>
                <p className="mt-1.5 max-w-[34ch] text-sm text-ink-muted">{step.body}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </div>
  );
}
