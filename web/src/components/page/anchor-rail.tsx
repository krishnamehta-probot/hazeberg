"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * The contents rail: a list of the page's own sections that knows where you are.
 *
 * Built for the legal pages first and now shared with `/what-we-do`, which is
 * the other page on this site whose whole job is to be deep-linked into: the nav
 * links eight separate anchors on it, so a reader arrives mid-page and needs to
 * see where that is.
 *
 * It was a static list, which on an eleven-section document is a list you read
 * once and then cannot use: you scroll into section 7 and the rail still looks
 * exactly as it did in section 1, so it tells you what is on the page and never
 * where on it you are. That is half a component.
 *
 * How the active section is decided, and why not `IntersectionObserver`: these
 * sections are hundreds of pixels tall and several are on screen at once, so
 * "intersecting" is true for three or four of them at any moment and picking
 * between them needs the same arithmetic anyway. The rule here is unambiguous —
 * the active section is the LAST one whose heading has passed the reading line,
 * which is the header's own height plus a little. Eleven `getBoundingClientRect`
 * calls on a scroll frame is nothing.
 *
 * `passive: true` matters: Lenis drives the scroll, and a non-passive listener
 * on it is a frame of jank on every wheel event.
 *
 * The marker moves between rows with `layoutId` rather than fading on and off.
 * A moving rule says the two rows are positions in ONE list; eleven separate
 * fades say they are eleven unrelated states — and it is the difference between
 * motion that explains the page and motion that decorates it.
 */
export function AnchorRail({
  sections,
  label = "On this page",
}: {
  sections: readonly { id: string; heading: string }[];
  /** The rail's own heading, and its accessible name. */
  label?: string;
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const reduce = useReducedMotion();

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const header = document.querySelector("header");
      const line = (header?.getBoundingClientRect().height ?? 72) + 40;

      let current = sections[0]?.id ?? "";
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - line <= 0) current = section.id;
        else break;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sections]);

  return (
    <nav
      aria-label={label}
      className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)] lg:self-start"
    >
      <p className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
        {label}
      </p>

      {/* The rule the whole list hangs off, so the rows read as stops on one
          line rather than as eleven loose links. */}
      <ol className="relative mt-6 border-l border-border">
        {sections.map((section) => {
          const on = section.id === active;
          return (
            <li key={section.id} className="relative">
              {on ? (
                /* One element, moved — not eleven, faded. */
                <motion.span
                  aria-hidden
                  layoutId={`anchor-rail-${label}`}
                  className="grad-primary absolute top-1 bottom-1 -left-px w-[2px] rounded-pill"
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 38, mass: 0.7 }
                  }
                />
              ) : null}
              <a
                href={`#${section.id}`}
                aria-current={on ? "location" : undefined}
                /* `py-3` is the spacing fix and the hit-area fix at once: the
                   rows were 2.5 spacing units apart and read as one block of
                   text, and each was well under the 44px target. Padding does
                   both without a second rule. */
                className={`block py-3 pl-5 text-sm transition-colors dur-fast ease-brand ${
                  on ? "text-primary" : "text-ink-muted hover:text-ink"
                }`}
              >
                {/* Whatever numbering a page uses lives in the heading itself —
                    the legal documents number their clauses "1. Who we are" — so
                    the rail never adds a second one beside it. */}
                {section.heading}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
