"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button, CircleButton, Eyebrow, Reveal } from "@/components/v2/kit";
import { V2_SERVICES } from "@/lib/v2/content";

/**
 * Services, as the comp's gallery.
 *
 * The important correction over the first cut: **the cards do not change
 * size.** Every card is the same width and the same height, always. What
 * opens is the frosted PANEL inside the open one — collapsed it is a bar
 * carrying the title, open it grows upward to hold the sentence and the
 * Explore button.
 *
 * That is not a detail. A row where the active card is two and a half times
 * the width of its neighbours re-lays-out the whole rail on every pointer
 * move: the cards to the right slide sideways under the cursor, and on a
 * scroller the reading position jumps with them. Equal cards mean the only
 * thing that moves is the panel that is supposed to be moving.
 *
 * Two mechanisms, deliberately independent:
 *
 *   OPEN     which panel is expanded. Pointer-enter and focus, so a mouse
 *            sweep and a Tab pass both work. `grid-rows` 0fr to 1fr animates
 *            to a content-driven height without measuring anything
 *   SCROLL   which cards are reachable. There are SEVEN services and about
 *            three and a half fit, so the row is a real scroller with snap
 *            points and the arrows page it
 *
 * Keeping them apart is what makes this work on a phone: expand is a pointer
 * affordance touch never fires, and touch gets a swipeable snapping rail
 * where every card shows its title.
 *
 * Full bleed is done with padding, not a negative margin —
 * `max(gutter, (100vw - shell)/2)` on the leading edge lines the first card
 * up with the heading while letting the row run off the right of the screen.
 * A negative margin needs the scrollbar width subtracting and is the usual
 * cause of a page that scrolls sideways by 15px.
 */

export function ServicesCarousel() {
  const rail = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /* The arrows reflect where the rail actually is rather than tracking an
     index of their own — it can also be swiped, dragged and keyboard
     scrolled, and an index would immediately disagree with all three. */
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
    /* One card plus its gap, read off the DOM rather than hard-coded: the
       cards are sized in `clamp()`, so any constant is wrong at the next
       breakpoint. */
    const card = node.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 20 : node.clientWidth * 0.6;
    node.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  return (
    <section id="services" className="v2-tint relative overflow-hidden">
      {/* This band's padding is SPLIT deliberately, and it is the page's one
          exception to `.v2-section`: the rail between the head and the arrows
          is full-bleed and cannot live inside a shell, so the head pads the
          top and the arrows row below pads the bottom. The two add up to the
          same rhythm every other band uses. */}
      <div className="v2-shell pt-[var(--v2-section-y)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <Eyebrow>{V2_SERVICES.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-5 max-w-[22ch] v2-h2 text-balance text-ink">
                {V2_SERVICES.title}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
              {/* Derived from the array. A seventh service added to the
                  content module must not leave a label reading six. */}
              {String(V2_SERVICES.items.length).padStart(2, "0")} services
            </p>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.1} y={32}>
        <ul
          ref={rail}
          className="v2-noscrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
          style={{
            paddingInlineStart: "max(var(--gutter), calc((100vw - var(--v2-shell)) / 2))",
            paddingInlineEnd: "var(--gutter)",
          }}
        >
          {V2_SERVICES.items.map((item, i) => {
            const isOpen = open === i;
            /* Badges alternate amber, blue, amber, blue down the row — the
               comp's rhythm, and the one place on the page where both brand
               colours appear at the same time. Both are FILLS: near-black on
               amber is 10.8:1, white on blue is 5.06:1. */
            const amber = i % 2 === 0;

            return (
              <li
                key={item.n}
                onPointerEnter={() => setOpen(i)}
                onFocusCapture={() => setOpen(i)}
                className="group relative h-[clamp(20rem,44vw,22.5rem)] w-[clamp(15.5rem,74vw,18.75rem)] shrink-0 snap-start overflow-hidden rounded-[var(--v2-radius-media)] bg-surface shadow-[var(--v2-shadow-card)] sm:w-[18.75rem]"
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 74vw, 300px"
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                />
                {/* A weak scrim over the whole frame. The panel below carries
                    its own ground, so this is only here to stop a bright
                    photograph competing with the card next to it. */}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgb(10_14_18/0.35),transparent_55%)]"
                />

                {/* Everything sits in one bottom-anchored column: the badge,
                    then the panel. The badge is a sibling ABOVE the panel
                    rather than a child of it, so it rides upward as the panel
                    grows — which is exactly what the comp shows. */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-3">
                  <span
                    aria-hidden
                    className={`mb-2 ml-1 grid h-9 w-9 place-items-center rounded-full font-mono text-xs font-medium shadow-[var(--v2-shadow-card)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
                      amber ? "v2-fill-amber" : "v2-fill-blue"
                    }`}
                  >
                    {item.n}
                  </span>

                  <div className="v2-panel w-full rounded-[12px] px-4 py-3.5">
                    <h3 className="text-base leading-snug font-semibold tracking-[-0.01em] text-white">
                      {item.label}
                    </h3>

                    {/*
                      `grid-rows` 0fr to 1fr is the one way to animate to a
                      content-driven height without measuring it in JS.
                      `min-h-0` on the inner element is required: without it
                      the row cannot shrink below its content and every card
                      ships open.

                      The content stays in the DOM when closed, so it is still
                      announced by a screen reader and still found by in-page
                      search. Only the link is taken out of the tab order.
                    */}
                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <p className="pt-2.5 text-xs leading-relaxed text-white/80">
                          {item.body}
                        </p>
                        <div className="pt-4">
                          <Button
                            href={item.href}
                            size="sm"
                            tabIndex={isOpen ? undefined : -1}
                            className="uppercase"
                          >
                            {item.cta}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* While the panel is closed the whole card is a link to its
                    service. Only while closed — once it opens, the Explore
                    button is the target, and a second overlapping link would
                    swallow it. */}
                {isOpen ? null : (
                  <Link
                    href={item.href}
                    className="absolute inset-0 z-10"
                    aria-label={`${item.label} — ${item.cta}`}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </Reveal>

      <div className="v2-shell mt-8 flex items-center justify-center gap-3 pb-[var(--v2-section-y)]">
        <CircleButton
          label="Previous services"
          direction="prev"
          onClick={() => page(-1)}
          disabled={atStart}
        />
        <CircleButton label="Next services" onClick={() => page(1)} disabled={atEnd} />
      </div>
    </section>
  );
}
