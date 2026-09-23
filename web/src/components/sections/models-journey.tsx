"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MODELS } from "@/lib/home-content";

/**
 * Engagement models: three equal tabs over one panel, cycling on a timer.
 *
 * The three are stages of one path — the section's own paragraph says
 * "implementing Workday, improving an existing environment, or managing a live
 * tenant" — so they get one panel between them rather than three cards side by
 * side, which reads as three products to choose between.
 *
 * **Same timer as the services list, and the same manners**, because it is the
 * same device and the page should only teach it once:
 *   - it pauses while the pointer or focus is inside the block
 *   - a click RE-SEATS it rather than ending it: pick the third and the third's
 *     seven seconds begin, then it carries on
 *   - `prefers-reduced-motion` never starts it and draws no bar
 *
 * The bar sweeps across the active tab itself, so the thing that is about to
 * change is the thing showing the clock.
 *
 * Not pinned. There are four pinned blocks on this page already.
 *
 * **The photographs are comp.** There are no engagement-model images in the
 * project; these are three frames from the reference set, distinct from each
 * other and from the services images, and every one is replaced before launch.
 */

/** How long a model holds before the panel moves on. */
const DWELL_MS = 7000;

/** COMP ONLY — see the note above. */
const SHOTS = ["/comp/section-07.webp", "/comp/section-11.webp", "/comp/section-13.webp"];

export function ModelsJourney() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const item = MODELS.items[active];

  /* Refs, not state: nothing has to re-render because a pointer arrived, and the
     timer reads both inside its own frame. */
  const held = useRef(false);
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
        setActive((v) => (v + 1) % MODELS.items.length);
      }
      setProgress(elapsed / DWELL_MS);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const choose = (i: number) => {
    setActive(i);
    restart.current = true;
    setProgress(0);
  };

  return (
    <div
      className="mt-12"
      onPointerEnter={() => (held.current = true)}
      onPointerLeave={() => (held.current = false)}
      onFocusCapture={() => (held.current = true)}
      onBlurCapture={() => (held.current = false)}
    >
      {/* -- the three tabs, equal thirds -------------------------------------- */}
      <div
        role="tablist"
        aria-label="Engagement models"
        className="grid grid-cols-3 overflow-hidden rounded-xl bg-canvas ring-1 ring-border"
      >
        {MODELS.items.map((m, i) => {
          const on = i === active;
          return (
            <button
              key={m.title}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => choose(i)}
              className={`group/tab relative cursor-pointer px-4 py-5 text-center transition-colors dur-base ease-brand sm:px-6 ${
                i > 0 ? "border-l border-border" : ""
              } ${on ? "bg-surface-2" : "hover:bg-surface"}`}
            >
              <span
                className={`block font-mono text-[0.6875rem] tracking-caps uppercase transition-colors dur-base ease-brand ${
                  on ? "text-primary" : "text-ink-subtle"
                }`}
              >
                {m.stage}
              </span>
              <span
                className={`mt-2 block text-sm leading-tight font-medium text-balance transition-colors dur-base ease-brand sm:text-base ${
                  on ? "text-ink" : "text-ink-muted"
                }`}
              >
                {m.title}
              </span>

              {/* The clock, drawn on the tab that is running it. */}
              {on ? (
                <span
                  aria-hidden
                  style={{ transform: `scaleX(${progress})` }}
                  className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-primary"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* -- one panel, held at one size --------------------------------------- */}
      <div
        aria-live="polite"
        className="mt-3 grid overflow-hidden rounded-xl bg-canvas ring-1 ring-border lg:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)]"
      >
        {/* Held at the tallest of the three, measured rather than guessed: at
            19rem the panel came out 309, 333 and 312px tall, which means the
            whole page below it moved every seven seconds, on its own. */}
        <div className="flex min-h-[21.5rem] flex-col p-7 sm:p-9">
          <h3 className="text-xl leading-tight font-medium text-balance text-ink">{item.title}</h3>
          <p className="mt-4 max-w-[52ch] text-base text-ink-muted">{item.body}</p>
          <p className="mt-5 max-w-[52ch] text-sm text-ink-muted">
            <span className="font-semibold text-ink">Best for: </span>
            {item.bestFor}
          </p>
          <div className="mt-auto pt-8">
            <Link
              href={item.href}
              data-spec
              className="spec group/l inline-flex h-11 items-center gap-2 rounded-pill bg-ink px-6 text-sm font-medium text-ink-invert"
            >
              {MODELS.cta}
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform dur-fast ease-brand group-hover/l:translate-x-1"
                strokeWidth={2}
              />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[14rem] bg-surface-2 lg:min-h-0">
          {MODELS.items.map((m, i) => (
            <Image
              key={m.title}
              src={SHOTS[i]}
              alt=""
              fill
              sizes="(max-width: 1023px) 100vw, 40vw"
              className={`object-cover transition-opacity dur-base ease-brand ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>

      {/* All three, always, for anyone the timer never reaches and for assistive
          technology, which should not have to wait out a rotation. */}
      <ul className="sr-only">
        {MODELS.items.map((m) => (
          <li key={m.title}>
            {m.stage}. {m.title}. {m.body} Best for: {m.bestFor}
          </li>
        ))}
      </ul>
    </div>
  );
}
