"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Compass, GraduationCap, Globe2, TrendingUp } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { CAREERS_PAGE } from "@/lib/careers-content";

/**
 * "What you can expect", as four tabs against one panel.
 *
 * Four equal cards said all four things at once and none of them loudly. This
 * gives each one a whole panel to itself and lets the reader choose — which is
 * the same move the home page's engagement journey makes, at a quarter of the
 * machinery.
 *
 * The rules it follows, all borrowed from the home page rather than invented:
 *
 *   - **the tabs are real buttons**, so the rail answers a keyboard exactly as it
 *     answers a pointer. Hover selects, focus selects, click selects.
 *   - **nothing lives only in the panel.** Every tab carries its own title in the
 *     list, and the full text of all four is in the DOM for assistive technology
 *     regardless of which is showing — see the visually-hidden list at the foot.
 *   - **the swap is a cross-fade with a short rise**, the same 0.45s the About
 *     scene uses, so two pages built weeks apart move the same way.
 *   - `prefers-reduced-motion` turns the movement off and leaves the switching,
 *     because the switching is the content and the movement is the decoration.
 */

const ICONS = {
  growth: TrendingUp,
  globe: Globe2,
  learning: GraduationCap,
  ownership: Compass,
} as const;

const SWAP = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };
/** The selected row's surface travels between tabs. Sprung, so the distance
    sets the duration — see the note in `berg/workflow.tsx`. */
const TRACK = { type: "spring", stiffness: 300, damping: 36, mass: 0.75 } as const;

export function ExpectRail() {
  const { expect } = CAREERS_PAGE;
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const active = expect.items[index];
  const Icon = ICONS[active.icon as keyof typeof ICONS];

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-8">
      {/* -- the tabs ---------------------------------------------------- */}
      <Reveal>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {expect.items.map((item, i) => {
            const on = i === index;
            return (
              <li key={item.n}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setIndex(i)}
                  onPointerEnter={() => setIndex(i)}
                  onFocus={() => setIndex(i)}
                  className="group/t relative flex min-h-14 w-full cursor-pointer items-center gap-4 rounded-lg px-5 py-4 text-left"
                >
                  {/* The resting surface. Always painted, under everything —
                      so the selected row has something to travel OVER rather
                      than a hole to reveal. */}
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-lg bg-canvas/60 ring-1 ring-border transition dur-base ease-brand group-hover/t:ring-border-strong"
                  />
                  {/* And the selected surface, which is ONE element moving
                      between four rows. The old version cross-faded four
                      independent cards, which is the same picture and a
                      completely different statement: four fades say four
                      things lit up in turn, one slide says the selection moved.
                      The rule down the left edge rides with it for free. */}
                  {on ? (
                    <motion.span
                      aria-hidden
                      layoutId="expect-active"
                      transition={reduce ? { duration: 0 } : TRACK}
                      className="absolute inset-0 overflow-hidden rounded-lg bg-canvas shadow-lg shadow-primary/10 ring-1 ring-primary/35"
                    >
                      <span className="grad-primary absolute top-3 bottom-3 left-0 w-[3px] rounded-pill" />
                    </motion.span>
                  ) : null}
                  <span
                    aria-hidden
                    className={`relative font-mono text-xs tracking-caps transition-colors dur-base ease-brand ${
                      on ? "text-primary" : "text-ink-subtle"
                    }`}
                  >
                    {item.n}
                  </span>
                  <span
                    className={`relative text-sm font-medium transition-colors dur-base ease-brand ${
                      on ? "text-ink" : "text-ink-muted"
                    }`}
                  >
                    {item.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Reveal>

      {/* -- the panel --------------------------------------------------- */}
      <Reveal delay={0.08}>
        {/* `min-h` holds the panel's height across all four, so selecting a
            shorter one does not make the section jump. Measured against the
            longest of the four. */}
        <div className="map-ground flex min-h-[19rem] flex-col justify-center rounded-2xl p-8 ring-1 ring-border sm:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.n}
              initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduce ? undefined : { opacity: 0, y: -8, filter: "blur(5px)" }}
              transition={SWAP}
            >
              <span
                aria-hidden
                className="disc-blue grid size-12 place-items-center rounded-pill text-white"
              >
                <Icon className="size-5" strokeWidth={1.8} />
              </span>
              <p className="mt-7 font-mono text-xs tracking-caps text-ink-subtle">{active.n}</p>
              <h3 className="mt-3 max-w-[18ch] text-2xl leading-tight font-light tracking-[-0.02em] text-balance text-ink">
                {active.title}
              </h3>
              <p className="mt-4 max-w-[46ch] text-base text-ink-muted">{active.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>

      {/* Every one of the four, always, for anyone who never touches the rail
          and for assistive technology, which should not have to operate a
          widget to reach three quarters of a section. */}
      <ul className="sr-only">
        {expect.items.map((item) => (
          <li key={item.n}>
            {item.title}. {item.body}
          </li>
        ))}
      </ul>
    </div>
  );
}
