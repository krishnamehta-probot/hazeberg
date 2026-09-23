"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CtaPill } from "@/components/ui/cta-pill";
import { SERVICES } from "@/lib/home-content";

/**
 * Services as an index: a column that stays put, and seven rows that go past it.
 *
 * It was a four-by-four board before — eight service tiles and eight decorative
 * photographs — which spent 1377px and gave half of it to pictures that carried
 * nothing. Here the photographs still appear, but one at a time and in space the
 * layout already had, so the section says the same thing in about 890px.
 *
 * **No pin.** Impact above it is pinned and Results below it is pinned, and a
 * third scene between them would be three hijacked scrolls in a row. The left
 * column is `position: sticky`, which is not the same thing: the page scrolls at
 * its own speed throughout and only one column holds its place.
 *
 * **Click, not hover, and it moves on by itself.** A row is a button; clicking it
 * changes the preview. Left alone, the selection advances every seven seconds and
 * a bar fills along the foot of the active row so the change is announced before
 * it happens rather than discovered afterwards.
 *
 * A click RE-SEATS the rotation rather than ending it: pick the fourth service
 * and the fourth service's seven seconds begin, then the sequence carries on. The
 * bar is a clock, and a clock that stops the moment you touch it is broken.
 *
 * Two rules it does obey, because the alternative is hostile:
 *   - it pauses while the pointer is anywhere in the list, or anything in it has
 *     focus — nothing should move under someone who is reading it
 *   - `prefers-reduced-motion` never starts it, and draws no bar
 *
 * Below lg the sticky column is just a heading, and every row carries its own
 * description and its own link — a phone has no hover and no room for a preview,
 * and the content cannot live behind either.
 */

/** How long each service holds before the rotation moves on. */
const DWELL_MS = 7000;

export function ServicesIndex() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const item = SERVICES.items[active];

  /* A ref, not state: nothing about the page needs to re-render because the
     pointer entered the list — only the timer needs to know, and it reads this
     inside its own frame. */
  const held = useRef(false);
  /** Written by a click, read by the timer on its next frame. */
  const restart = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let elapsed = 0;
    let last = 0;

    const tick = (now: number) => {
      const dt = last ? now - last : 0;
      last = now;
      if (restart.current) {
        restart.current = false;
        elapsed = 0;
      }
      if (!held.current) elapsed += dt;
      if (elapsed >= DWELL_MS) {
        elapsed = 0;
        setActive((v) => (v + 1) % SERVICES.items.length);
      }
      setProgress(elapsed / DWELL_MS);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* A click re-seats the rotation, it does not end it. Stopping for good was the
     first behaviour and it is wrong here: the bar is a clock, and a clock that
     stops the moment you touch it is broken. Picking the fourth service starts
     the fourth service's seven seconds, and the sequence carries on from there. */
  const choose = (i: number) => {
    setActive(i);
    restart.current = true;
    setProgress(0);
  };

  return (
    <div className="shell grid gap-12 py-[var(--section-y)] lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] lg:gap-16">
      {/* -- the column that stays ------------------------------------------ */}
      <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
        <Reveal>
          <p className="font-mono text-xs tracking-caps text-ink-subtle uppercase">
            {SERVICES.eyebrow}
          </p>
          <h2 className="mt-5 max-w-[18ch] text-3xl leading-[1.08] font-light tracking-[-0.03em] text-pretty text-ink">
            {SERVICES.title}
          </h2>
        </Reveal>

        {/* The preview. Fixed box, so swapping the picture cannot move the rows
            beside it — a panel that resizes under the pointer is what makes a
            list feel like it is fighting back. Desktop only: this is the half of
            the section the selection drives. */}
        <Reveal delay={0.08} className="mt-10 hidden lg:block">
          <div className="relative aspect-[5/4] w-full max-w-[22rem] overflow-hidden rounded-lg bg-surface-2">
            {SERVICES.items.map((s, i) => (
              <Image
                key={s.label}
                src={`/services/service-${i + 1}.png`}
                alt=""
                fill
                sizes="352px"
                className={`object-cover transition-opacity dur-base ease-brand ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
          {/* Announced, because for anyone not watching the list this panel
              changes on its own. The height is held so a longer description
              cannot shunt the link up and down between services. */}
          <div aria-live="polite" className="min-h-[7rem]">
            <p className="mt-6 max-w-[42ch] text-base text-ink-muted">{item.body}</p>
            <Link
              href={item.href}
              className="group/e mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink"
            >
              <span className="group-hover/e:underline">{item.cta}</span>
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform dur-fast ease-brand group-hover/e:translate-x-0.5 group-hover/e:-translate-y-0.5"
                strokeWidth={2}
              />
            </Link>
          </div>
        </Reveal>
      </div>

      {/* -- the rows that move --------------------------------------------- */}
      <RevealGroup
        as="ul"
        className="border-t border-border lg:mt-2"
        onPointerEnter={() => (held.current = true)}
        onPointerLeave={() => (held.current = false)}
        onFocusCapture={() => (held.current = true)}
        onBlurCapture={() => (held.current = false)}
      >
        {SERVICES.items.map((s, i) => {
          const on = i === active;
          return (
            <RevealItem as="li" key={s.label} className="relative border-b border-border">
              <button
                type="button"
                onClick={() => choose(i)}
                aria-current={on ? "true" : undefined}
                className="group/row flex w-full cursor-pointer items-baseline gap-4 py-5 text-left lg:gap-8 lg:py-7"
              >
                <span
                  aria-hidden
                  className={`shrink-0 font-mono text-xs tracking-caps transition-colors dur-base ease-brand ${
                    on ? "text-primary" : "text-ink-subtle"
                  }`}
                >
                  {s.n}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-3">
                    {/* The row slides a little on hover, and only on lg — on a
                        phone it would be motion for its own sake. */}
                    <span className="text-xl leading-tight font-light tracking-[-0.02em] text-ink transition-transform dur-base ease-brand lg:text-2xl lg:group-hover/row:translate-x-2">
                      {s.label}
                    </span>
                  </span>
                  {/* On lg these live in the sticky column instead. */}
                  <span className="mt-1.5 block max-w-[52ch] text-sm text-ink-muted lg:hidden">
                    {s.body}
                  </span>
                </span>
              </button>

              <Link
                href={s.href}
                className="group/e mt-0 mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink lg:hidden"
              >
                <span className="group-hover/e:underline">{s.cta}</span>
                <ArrowUpRight aria-hidden className="size-4" strokeWidth={2} />
              </Link>

              {/* The rotation, drawn. It sits ON the row's own bottom rule rather
                  than under it, so nothing in the list changes height when it
                  appears — and it is the only thing that tells you the selection
                  is about to move on its own. */}
              {on ? (
                <span
                  aria-hidden
                  style={{ transform: `scaleX(${progress})` }}
                  className="absolute inset-x-0 -bottom-px h-px origin-left bg-primary"
                />
              ) : null}
            </RevealItem>
          );
        })}
      </RevealGroup>

      <div className="-mt-2 lg:hidden">
        <CtaPill href="/what-we-do">All Workday services</CtaPill>
      </div>
    </div>
  );
}
