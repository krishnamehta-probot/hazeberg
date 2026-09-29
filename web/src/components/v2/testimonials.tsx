"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { CircleButton, Eyebrow, Reveal } from "@/components/v2/kit";
import { V2_TESTIMONIALS } from "@/lib/v2/content";

/**
 * Testimonials: two quote cards on the grey band, with the comp's pair of
 * circular controls under them.
 *
 * Both quotes are REAL and client-approved — they are the only two the source
 * document carries. v1's carousel pads this section with four more that are
 * marked PLACEHOLDER; the comp shows two cards, so none are needed and none
 * are used. A fabricated testimonial is the worst thing that can be on a page
 * like this, and the cheapest way to avoid one is to not need it.
 *
 * Which is also why the controls behave the way they do. With exactly two
 * quotes there is nothing to page through on a desktop — both are on screen —
 * so the rail only scrolls below `md`, where the cards stack to one per view,
 * and the controls DISABLE rather than disappear at each end. If more
 * approved quotes arrive they drop into the content module and the rail
 * starts paging at every width with no change here.
 */

export function Testimonials() {
  const rail = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /* The controls reflect where the rail actually is rather than tracking an
     index of their own — it can also be swiped and keyboard-scrolled, and an
     index would immediately disagree with both. */
  const syncEdges = useCallback(() => {
    const node = rail.current;
    if (!node) return;
    setAtStart(node.scrollLeft <= 2);
    setAtEnd(node.scrollLeft + node.clientWidth >= node.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const node = rail.current;
    if (!node) return;
    syncEdges();
    node.addEventListener("scroll", syncEdges, { passive: true });
    const ro = new ResizeObserver(syncEdges);
    ro.observe(node);
    return () => {
      node.removeEventListener("scroll", syncEdges);
      ro.disconnect();
    };
  }, [syncEdges]);

  const page = (direction: 1 | -1) => {
    const node = rail.current;
    if (!node) return;
    node.scrollBy({ left: node.clientWidth * 0.9 * direction, behavior: "smooth" });
  };

  return (
    <section id="testimonials" className="relative bg-surface">
      <div className="v2-shell border-t border-border pt-[var(--v2-section-y)] pb-[var(--v2-section-y)]">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <Eyebrow center>{V2_TESTIMONIALS.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 max-w-[22ch] v2-h2 text-balance text-ink">
              {V2_TESTIMONIALS.title}
            </h2>
          </Reveal>
        </div>

        {/*
          A plain div, not a `RevealGroup`. The ref has to be ON the scrolling
          element — `scrollLeft`, `clientWidth` and `scrollBy` all read and
          write the scroller itself — and a wrapper around it would report the
          page's scroll instead. So the rail is plain and each card carries its
          own `Reveal` with a stagger, which is the same effect by hand.
        */}
        <div
          ref={rail}
          className="v2-noscrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto md:grid md:grid-cols-2 md:overflow-visible"
        >
          {V2_TESTIMONIALS.items.map((item, i) => (
            <Reveal
              as="article"
              key={item.body}
              delay={i * 0.08}
              className="v2-card flex w-[min(30rem,88vw)] shrink-0 snap-start flex-col p-7 md:w-auto"
            >
              {/* The quote mark is a glyph in amber, set large and low in
                  opacity — a FILL behind the words rather than a word itself,
                  which is the only role yellow has on a white ground. */}
              <span
                aria-hidden
                className="font-mono text-5xl leading-none text-accent select-none"
              >
                &ldquo;
              </span>
              <blockquote className="mt-4 text-base leading-relaxed text-ink italic">
                {item.body}
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3 border-t border-border pt-5">
                <span
                  aria-hidden
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-[0.625rem] font-semibold text-primary-ink"
                >
                  F5
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-ink">{item.name}</span>
                  <span className="block text-xs text-ink-subtle">{item.role}</span>
                </span>
              </figcaption>
            </Reveal>
          ))}
        </div>

        <div className="mt-9 flex items-center justify-center gap-3 md:hidden">
          <CircleButton
            label="Previous testimonial"
            direction="prev"
            onClick={() => page(-1)}
            disabled={atStart}
          />
          <CircleButton label="Next testimonial" onClick={() => page(1)} disabled={atEnd} />
        </div>
      </div>
    </section>
  );
}
