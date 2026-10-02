"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { Reveal } from "@/components/motion/reveal";
import type { ServiceStage } from "@/lib/service-content";

import { STAGE_ICON, STAGE_ICON_FALLBACK } from "./stage-icons";

/**
 * The rail's moving parts: which stage is being read, and the two ways of
 * showing it — a sticky rail beside the panels on a desktop, a sticky row of
 * chips over them on a phone. The panels themselves arrive as server-rendered
 * children and are only ever touched by attribute.
 *
 * **One line decides everything.** A stage is "being read" while its panel
 * crosses a line 45% of the way down the screen, a little above the middle,
 * where the eye actually sits on a page being scrolled. The IntersectionObserver
 * watches a 1% band at that line, and the scroll fill is offset to the same
 * line, so the tip of the fill reaches a stage's dot at the moment the marker
 * sets off for it. The fill does not run at an even rate down the track: it is
 * mapped panel by panel onto the dots, because six panels of different heights
 * and six evenly spaced dots are not the same ruler, and an even fill would
 * arrive at "Paid" while "Rewarded" was still on screen.
 *
 * The panels' padding is part of them (see `stage-panel.tsx`), so every point
 * of the column belongs to exactly one stage — there is no gap in which
 * nothing is being read and the marker has nowhere to be.
 *
 * Desktop: the rail holds still while the panels pass it — a sticky column,
 * not a pin, so the page keeps its own speed. The track's blue fill grows with
 * reading progress, and a blue disc wearing the stage's glyph glides along it
 * to the stage being read.
 *
 * Phone: no column to spare, so the six stages become a row of chips stuck
 * under the header, scrolling sideways inside their own strip (never the page)
 * with the one being read filled blue and brought to the middle of the strip,
 * and a hairline under them filling as you go.
 *
 * Reduced motion: the marker and the chips jump rather than glide. The fill
 * stays — it moves only as far as the reader scrolls, which is the reader's
 * own motion, not the page's.
 */

/** Panel tops as shares of the column, and dot centres in px down the rail. */
type Geo = { at: number[]; dots: number[] };

/** Piecewise-linear: v on the xs ruler, read off the ys ruler. */
function along(v: number, xs: readonly number[], ys: readonly number[]) {
  if (!xs.length) return 0;
  if (v <= xs[0]) return ys[0];
  for (let i = 1; i < xs.length; i++) {
    if (v <= xs[i]) {
      const span = xs[i] - xs[i - 1];
      return span > 0 ? ys[i - 1] + ((ys[i] - ys[i - 1]) * (v - xs[i - 1])) / span : ys[i];
    }
  }
  return ys[ys.length - 1];
}

const pad = (i: number) => String(i + 1).padStart(2, "0");

/** Half the marker's size-9, so its centre sits on a dot's. */
const MARK = 18;

export function StageSpy({
  stages,
  label,
  children,
}: {
  stages: readonly ServiceStage[];
  /** The rail's accessible name — the section's eyebrow. */
  label: string;
  /** The panels, then anything that follows them in the column. */
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const column = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const [geo, setGeo] = useState<Geo | null>(null);
  const n = stages.length;

  /* The stage being read: whichever panel is crossing the line. */
  useEffect(() => {
    const col = column.current;
    if (!col) return;
    const panels = Array.from(col.querySelectorAll<HTMLElement>("[data-stage-panel]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = panels.indexOf(entry.target as HTMLElement);
          if (i >= 0) setActive(i);
        }
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    panels.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, [n]);

  /* Told to the panels by attribute, which is all their styles answer to. */
  useEffect(() => {
    column.current
      ?.querySelectorAll<HTMLElement>("[data-stage-panel]")
      .forEach((p, i) => p.toggleAttribute("data-active", i === active));
  }, [active]);

  /* The two rulers the fill is mapped between, re-measured whenever the
     column or the rail changes size (fonts landing, a wrap, a resize). */
  useEffect(() => {
    const col = column.current;
    const box = rail.current;
    if (!col || !box) return;
    const ro = new ResizeObserver(() => {
      const h = col.offsetHeight;
      const top = box.getBoundingClientRect().top;
      const panels = Array.from(col.querySelectorAll<HTMLElement>("[data-stage-panel]"));
      const dots = Array.from(box.querySelectorAll<HTMLElement>("[data-rail-dot]")).map((d) => {
        const r = d.getBoundingClientRect();
        return r.top - top + r.height / 2;
      });
      setGeo({ at: panels.map((p) => (h > 0 ? p.offsetTop / h : 0)), dots });
    });
    ro.observe(col);
    ro.observe(box);
    return () => ro.disconnect();
  }, [n]);

  /* The chip being read, brought to the middle of its strip — by scrolling
     the strip, never `scrollIntoView`, which would scroll the page as well. */
  useEffect(() => {
    const ol = strip.current;
    const chip = ol?.children[active] as HTMLElement | undefined;
    if (!ol || !chip || ol.offsetParent === null) return;
    ol.scrollTo({
      left: Math.max(0, chip.offsetLeft - (ol.clientWidth - chip.offsetWidth) / 2),
      behavior: reduce ? "auto" : "smooth",
    });
  }, [active, reduce]);

  const { scrollYProgress } = useScroll({ target: column, offset: ["start 45%", "end 45%"] });

  const dots = geo?.dots ?? [];
  const first = dots[0] ?? 0;
  const length = dots.length > 1 ? dots[dots.length - 1] - first : 0;

  /* Desktop: the fill, as a share of the track, reaching each dot exactly as
     its panel reaches the line. */
  const fill = useTransform(scrollYProgress, (v) =>
    geo && length > 0 ? (along(v, geo.at, geo.dots) - first) / length : 0,
  );
  /* Phone: the same progress, as a share of six even steps. */
  const steps = stages.map((_, i) => (n > 1 ? i / (n - 1) : 1));
  const strand = useTransform(scrollYProgress, (v) => (geo ? along(v, geo.at, steps) : 0));

  const ActiveIcon = STAGE_ICON[stages[active]?.key ?? ""] ?? STAGE_ICON_FALLBACK;

  return (
    <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] xl:gap-20">
      {/* ============================ desktop: the rail ======================= */}
      <Reveal className="hidden lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:block lg:self-start">
        <nav aria-label={label}>
          <div ref={rail} className="relative">
            {length > 0 ? (
              <>
                {/* The track, dot to dot, and the fill running down it. */}
                <span
                  aria-hidden
                  style={{ top: first, height: length }}
                  className="absolute left-[calc(1.25rem-1px)] w-0.5 rounded-pill bg-border"
                />
                <motion.span
                  aria-hidden
                  style={{ top: first, height: length, scaleY: fill }}
                  className="stage-fill absolute left-[calc(1.25rem-1px)] w-0.5 origin-top rounded-pill"
                />
              </>
            ) : null}

            <ol className="relative">
              {stages.map((s, i) => {
                const on = i === active;
                return (
                  <li key={s.key}>
                    <a
                      href={`#stage-${s.key}`}
                      aria-current={on ? "true" : undefined}
                      className="group/item grid min-h-14 grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-x-4 rounded-xl py-2.5 pr-3"
                    >
                      {/* The dot sits level with the stage word's line, so
                          the marker's centre and the word's are one height. */}
                      <span data-rail-dot aria-hidden className="grid h-[1.625rem] place-items-center">
                        <span
                          className={`size-2.5 rounded-pill ring-4 ring-surface transition-colors dur-base ease-brand ${
                            i <= active ? "bg-primary" : "bg-border-strong"
                          }`}
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-baseline gap-2.5">
                          <span
                            className={`font-mono text-[0.6875rem] tracking-caps tabular-nums transition-colors dur-base ease-brand ${
                              on ? "text-primary" : "text-ink-subtle"
                            }`}
                          >
                            {pad(i)}
                          </span>
                          <span
                            className={`text-lg font-light tracking-[-0.015em] transition-colors dur-base ease-brand ${
                              on ? "text-ink" : "text-ink-muted group-hover/item:text-ink"
                            }`}
                          >
                            {s.stage}
                          </span>
                        </span>
                        <span
                          className={`mt-0.5 block text-sm leading-snug transition-colors dur-base ease-brand ${
                            on ? "text-ink-muted" : "text-ink-subtle group-hover/item:text-ink-muted"
                          }`}
                        >
                          {s.area}
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>

            {/* The marker: the stage being read, in the site's blue disc. */}
            {length > 0 ? (
              <motion.span
                aria-hidden
                initial={false}
                animate={{ y: (dots[active] ?? first) - MARK }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30 }}
                className="disc-blue absolute top-0 left-0.5 grid size-9 place-items-center rounded-pill text-white shadow-lg ring-4 shadow-primary/30 ring-surface"
              >
                <motion.span
                  key={active}
                  initial={reduce ? false : { opacity: 0, scale: 0.5, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="grid place-items-center"
                >
                  <ActiveIcon className="size-4" strokeWidth={1.9} />
                </motion.span>
              </motion.span>
            ) : null}
          </div>
        </nav>
      </Reveal>

      {/* ============================== the panels ============================ */}
      <div ref={column} className="relative min-w-0">
        {/* Phone and tablet: the stages as a strip of chips stuck under the
            header. Full bleed, so it reads as part of the page's chrome while
            it is stuck; it scrolls inside itself, so it never widens the page. */}
        <div className="sticky top-[var(--header-h)] z-20 -mx-[var(--gutter)] lg:hidden">
          <nav aria-label={label} className="border-b border-border bg-surface/90 backdrop-blur-md">
            <ol
              ref={strip}
              className="relative flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain px-[var(--gutter)] py-2.5"
            >
              {stages.map((s, i) => {
                const on = i === active;
                return (
                  <li key={s.key} className="shrink-0 snap-center">
                    <a
                      href={`#stage-${s.key}`}
                      aria-current={on ? "true" : undefined}
                      className={`inline-flex min-h-11 items-center gap-2 rounded-pill px-4 text-sm whitespace-nowrap ring-1 transition-colors dur-base ease-brand ${
                        on
                          ? "bg-primary text-primary-ink ring-primary"
                          : "bg-canvas text-ink-muted ring-border hover:text-ink"
                      }`}
                    >
                      <span
                        className={`font-mono text-[0.6875rem] tracking-caps tabular-nums transition-colors dur-base ease-brand ${
                          on ? "text-primary-ink" : "text-ink-subtle"
                        }`}
                      >
                        {pad(i)}
                      </span>
                      {s.stage}
                    </a>
                  </li>
                );
              })}
            </ol>
            <div aria-hidden className="h-0.5 bg-border">
              <motion.div style={{ scaleX: strand }} className="grad-primary h-full origin-left" />
            </div>
          </nav>
        </div>

        {children}
      </div>
    </div>
  );
}
