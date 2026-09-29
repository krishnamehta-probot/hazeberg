"use client";

import Image from "next/image";
import { useState } from "react";

import { Eyebrow, Reveal, RevealGroup, RevealItem } from "@/components/v2/kit";
import { V2_CASES } from "@/lib/v2/content";

/**
 * The three engagements, as the comp's row of cards with one of them opened.
 *
 * The open card drops its photograph, fills blue, and shows the chips. That
 * is the comp's composition and it is also the honest one: the three
 * engagements are the strongest proof the company owns, and a row of three
 * equal cards gives a reader no reason to read any of them.
 *
 * Which card is open is state, not a constant. The comp opens the third;
 * `featured: true` in the content module sets the initial value, and clicking
 * or focusing any card's header opens that one instead. So all three are
 * reachable without a carousel hiding two of them behind a control.
 *
 * Contrast on the open card: white on flat #1972B9 is 5.06:1 for the body and
 * the chips sit on a 14% white wash of the same blue, which only lightens the
 * ground behind white type. The brand GRADIENT is not used here for the
 * reason it is never used behind body copy — its light end measures 3.36:1.
 *
 * The badge is a real toggle, and that matters more than it sounds. It rotates
 * to an X when the card is open, so it PROMISES it can close — and the first
 * cut wired it to `setOpen(i)`, which sets the index it is already on and does
 * nothing. A control that looks like a close button and is inert is worse than
 * no control. It now toggles to `-1`, so "all three closed" is a real state.
 *
 * The functional update (`cur => cur === i ? -1 : i`) is required rather than
 * stylistic: reading `open` from the render closure would toggle against a
 * stale value the moment two events land in one batch.
 *
 * There is no `onFocus` handler on it, deliberately. Focus-to-open and
 * click-to-toggle fight each other — focus fires first, opens the card, and
 * the click that followed then reads it as open and closes it again, so a
 * card could never be opened by clicking. Keyboard reaches it through the
 * button's own Enter/Space, which is a click.
 *
 * There is also no "view case study" link. `home-content.ts` says it plainly:
 * there is no case-study page, these three are the whole record, and a "read
 * more" that goes nowhere is worse than not having one. The card carries its
 * whole story instead.
 *
 * The client line under the title is gone too, and nothing replaced it. The
 * revised copy dropped "Fortune 500 Company" and the rest — the engagements
 * are now described without naming who they were for — so putting a name back
 * would be attributing work to a client who is no longer named in the source.
 */

export function UseCases() {
  const initial = Math.max(
    V2_CASES.items.findIndex((item) => item.featured),
    0,
  );
  /* `-1` means every card is closed, which is now a reachable state: the
     badge on an open card is an X and it has to actually close it. */
  const [open, setOpen] = useState<number>(initial);

  return (
    <section id="work" className="relative bg-canvas">
      <div className="v2-shell v2-section">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <Eyebrow center>{V2_CASES.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 max-w-[22ch] v2-h2 text-balance text-ink">
              {V2_CASES.title}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-[60ch] text-sm text-balance text-ink-muted">
              {V2_CASES.body}
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-12 grid items-start gap-5 lg:grid-cols-3">
          {V2_CASES.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <RevealItem
                as="article"
                key={item.n}
                className={`flex h-full flex-col overflow-hidden rounded-[var(--v2-radius-media)] transition-colors duration-500 ${
                  isOpen ? "v2-fill-blue" : "v2-card v2-hoverable"
                }`}
              >
                {/* Closed: the photograph. Open: the blue fill replaces it,
                    which is what the comp does — the open card is the only one
                    that does not need a picture to hold attention. */}
                {isOpen ? null : (
                  <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-surface">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 30vw"
                      className="object-cover"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-[linear-gradient(to_top,rgb(10_14_18/0.45),transparent_55%)]"
                    />
                    <span className="absolute top-4 left-4 rounded-pill bg-white/90 px-3 py-1 font-mono text-[0.625rem] tracking-caps text-ink uppercase backdrop-blur-sm">
                      {item.n} · {item.capabilities[0]}
                    </span>
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
                  {isOpen ? (
                    <p className="mb-4 flex items-center gap-2 font-mono text-[0.625rem] tracking-caps uppercase opacity-70">
                      {item.n} · {item.capabilities[0]}
                    </p>
                  ) : null}

                  <h3 className="text-left">
                    <button
                      type="button"
                      onClick={() => setOpen((cur) => (cur === i ? -1 : i))}
                      aria-expanded={isOpen}
                      aria-controls={`v2-case-${i}`}
                      className="group flex w-full items-start justify-between gap-4 text-left text-lg leading-snug font-semibold tracking-[-0.015em]"
                    >
                      <span>{item.title}</span>
                      <span
                        aria-hidden
                        className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-500 ${
                          isOpen
                            ? "rotate-45 bg-accent text-accent-ink"
                            : "border border-border text-ink group-hover:border-primary group-hover:text-primary"
                        }`}
                      >
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M8 3.5v9M3.5 8h9" />
                        </svg>
                      </span>
                    </button>
                  </h3>


                  {/* The detail. `grid-rows` 0fr to 1fr animates to a
                      content-driven height without measuring it; the content
                      stays in the DOM when closed, so it is still announced
                      and still found by in-page search. */}
                  <div
                    id={`v2-case-${i}`}
                    className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <dl className="mt-5 space-y-4 text-sm">
                        <div>
                          <dt className="font-mono text-[0.625rem] tracking-caps uppercase opacity-70">
                            {V2_CASES.labels.challenge}
                          </dt>
                          <dd className="mt-1.5 opacity-90">{item.challenge}</dd>
                        </div>
                        <div>
                          <dt className="font-mono text-[0.625rem] tracking-caps uppercase opacity-70">
                            {V2_CASES.labels.approach}
                          </dt>
                          <dd className="mt-1.5 opacity-90">{item.approach}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {/* The outcomes are the point of the card and are shown on
                      every card, open or closed — they are what a reader
                      scanning the row is actually looking for. */}
                  <ul
                    className={`mt-5 space-y-2.5 border-t pt-5 text-sm ${
                      isOpen ? "border-current/20" : "border-border"
                    }`}
                  >
                    {item.impact.map((outcome) => (
                      <li key={outcome} className="flex items-start gap-2.5">
                        <span
                          aria-hidden
                          className={`mt-[0.45rem] inline-block h-1 w-1 shrink-0 rounded-full ${
                            isOpen ? "bg-accent" : "bg-primary"
                          }`}
                        />
                        <span className={isOpen ? "opacity-90" : "text-ink-muted"}>
                          {outcome}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Chips, on the open card only — the comp's featured card
                      is the only one that carries them. */}
                  {isOpen ? (
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {item.capabilities.map((chip) => (
                        <li
                          key={chip}
                          className="rounded-pill bg-white/14 px-3 py-1.5 text-xs backdrop-blur-sm"
                        >
                          {chip}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
