"use client";

import { useRef, useState } from "react";
import { MotionConfig, motion, useInView, type Transition } from "motion/react";

import { VIEWPORT } from "@/components/motion/reveal";
import type { AboutPerson } from "@/lib/about-content";

import { Portrait, ProfileBody, ProfileHeader, pad } from "./leadership-profile";
import { YearsBar, YearsBlock, yearsFigure } from "./leadership-years";

/** The selection plate's glide between names. */
const GLIDE: Transition = { type: "spring", stiffness: 420, damping: 38, mass: 0.8 };

/**
 * Meet the team, from lg: four names down the left, one profile open beside
 * them.
 *
 * It is a real tablist, because that is what it is — four views of one panel,
 * one at a time. The names are tabs with a roving tabindex (Tab lands on the
 * open one, ↑ and ↓ move between them and open as they go, Home and End jump
 * to the ends); each profile is a tabpanel labelled by its tab, and the open
 * one takes focus next, so a keyboard reader goes name, then profile. A pale
 * plate with a blue edge sits behind the open name and GLIDES to the next one
 * (`layoutId`) rather than blinking across — the eye follows the move, so it
 * never has to look for where the selection went.
 *
 * Each name carries its years as a hairline on one shared ruler, so the list
 * is also a comparison before anything is opened: who has been doing this
 * longest is visible at a glance, and nobody's number has to be read.
 *
 * The four profiles share ONE grid cell. The tallest of them sets the panel's
 * height, so switching never moves the page under the reader; the outgoing
 * profile fades where it stands, the incoming one fades in while its lines
 * rise into place in reading order, and its years bar draws again. All of it
 * is CSS on a `data-on` flag (`.lead-panel` / `.lead-line` in globals.css) —
 * nothing animates through React state. The closed profiles are
 * `visibility: hidden`: out of the tab order and the accessibility tree, as a
 * closed tabpanel should be, while still holding their share of the height.
 *
 * Reduced motion: the plate jumps, the profiles cut, the bars are drawn.
 * Below lg it is not displayed (so not in the accessibility tree either) — the
 * stack in `leadership.tsx` shows all four profiles, open, one after another.
 */
export function LeadershipRoster({
  people,
  label,
}: {
  people: readonly AboutPerson[];
  /** The tablist's accessible name. */
  label: string;
}) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, VIEWPORT);
  const last = people.length - 1;

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const next =
      e.key === "ArrowDown"
        ? i === last
          ? 0
          : i + 1
        : e.key === "ArrowUp"
          ? i === 0
            ? last
            : i - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    // The arrows would otherwise scroll the page as well.
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={root}
        className="hidden gap-12 lg:grid lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] xl:gap-16"
      >
        {/* -- the four -------------------------------------------------- */}
        <div role="tablist" aria-label={label} aria-orientation="vertical" className="flex flex-col gap-1 self-start">
          {people.map((p, i) => {
            const on = i === active;
            return (
              <button
                key={p.key}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`leader-tab-${p.key}`}
                aria-selected={on}
                aria-controls={`leader-panel-${p.key}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="group/tab relative block min-h-11 w-full cursor-pointer rounded-xl px-5 py-5 text-left transition-colors dur-base ease-brand hover:bg-surface/60"
              >
                {on ? (
                  <motion.span
                    layoutId="leadership-plate"
                    transition={GLIDE}
                    aria-hidden
                    className="absolute inset-0 block rounded-xl bg-surface ring-1 ring-border"
                  >
                    <span className="absolute top-5 bottom-5 left-0 block w-[3px] rounded-pill bg-primary" />
                  </motion.span>
                ) : null}

                <span className="relative flex items-start justify-between gap-4">
                  <span className="min-w-0">
                    <span
                      className={`block text-xl leading-tight font-light tracking-[-0.02em] transition-colors dur-base ease-brand xl:text-2xl ${
                        on ? "text-ink" : "text-ink-subtle group-hover/tab:text-ink"
                      }`}
                    >
                      {p.name}
                    </span>
                    <span className="mt-1.5 block font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
                      {p.role}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={`shrink-0 pt-1 font-mono text-[0.6875rem] tracking-caps transition-colors dur-base ease-brand ${
                      on ? "text-primary" : "text-ink-subtle"
                    }`}
                  >
                    {pad(i)}
                  </span>
                </span>

                <span className="relative mt-4 flex items-center gap-3">
                  <YearsBar years={p.years} on={inView} delay={0.15 + i * 0.09} className="min-w-0 flex-1" />
                  <span
                    aria-hidden
                    className="w-16 shrink-0 text-right font-mono text-[0.6875rem] tracking-caps whitespace-nowrap text-ink-subtle uppercase tabular-nums"
                  >
                    {yearsFigure(p.years)} yrs
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* -- the open one ---------------------------------------------- */}
        <div className="grid">
          {people.map((p, i) => {
            const on = i === active;
            return (
              <div
                key={p.key}
                role="tabpanel"
                id={`leader-panel-${p.key}`}
                aria-labelledby={`leader-tab-${p.key}`}
                tabIndex={on ? 0 : -1}
                data-on={on ? "" : undefined}
                className="lead-panel col-start-1 row-start-1 grid grid-cols-[minmax(0,11rem)_minmax(0,1fr)] content-start gap-x-8 rounded-2xl xl:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] xl:gap-x-12"
              >
                <div className="lead-line" style={{ "--i": 0 } as React.CSSProperties}>
                  <Portrait
                    person={p}
                    n={`${pad(i)} / ${pad(last)}`}
                    sizes="(min-width: 1280px) 256px, 176px"
                    className="aspect-[4/5] w-full rounded-2xl shadow-[0_24px_48px_-28px_rgb(11_63_107/0.55)]"
                  />
                  <YearsBlock years={p.years} on={on && inView} delay={0.35} className="mt-7" />
                </div>
                <div className="min-w-0 pt-1">
                  <ProfileHeader person={p} stagger />
                  <ProfileBody person={p} stagger />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MotionConfig>
  );
}
