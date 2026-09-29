"use client";

import Image from "next/image";

import { Count, Eyebrow, Reveal, RevealGroup, RevealItem } from "@/components/v2/kit";
import { V2_ABOUT } from "@/lib/v2/content";

/**
 * The about band: a centred statement, the years figure, then four points in
 * a single row.
 *
 * The statement is set at `.v2-lede` — above body size, below a heading —
 * because the comp gives it the whole width of the page and nothing else, and
 * at 14px the band would look empty. It is capped at 64ch: wider than that
 * and a centred paragraph stops being readable however large it is set.
 *
 * The points sit on one hairline row with vertical rules between them, drawn
 * with `divide-x` and confined to `lg`. Below that breakpoint the row wraps
 * to two columns, where `divide-x` would put a rule on the left of the
 * wrapped item with nothing beside it — see the note on the grid itself.
 *
 * The icons are the client's own marks. Their stroke colour is baked in, not
 * `currentColor`: `2nd.svg` is drawn in white because it sits on a filled
 * disc, which is why `filled` is a property of the DATA and not a position in
 * the list. Reorder the array without it and that icon goes invisible.
 */

export function About() {
  return (
    <section id="about" className="relative bg-canvas">
      <div className="v2-shell v2-section">
        <Reveal className="flex justify-center">
          <Eyebrow center>{V2_ABOUT.eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mx-auto mt-7 max-w-[64ch] text-center v2-lede text-balance text-ink">
            {V2_ABOUT.body}
          </p>
        </Reveal>

        {/* The band's one hard number, lifted out of the paragraph so it can
            lead. The main home page does the same thing with it, and for the
            same reason: it was buried mid-sentence in the source copy, which
            is the one place a figure nobody should miss must never be. */}
        <Reveal delay={0.14}>
          <p className="mt-10 flex flex-wrap items-baseline justify-center gap-3 text-center">
            <span className="v2-figure text-primary">
              <Count value={V2_ABOUT.stat} suffix={V2_ABOUT.statSuffix} />
            </span>
            <span className="text-sm text-ink-muted">{V2_ABOUT.statTail}</span>
          </p>
        </Reveal>

        {/*
          FOUR columns, because there are four points.

          It was three, and the fourth wrapped to a row of its own — which is
          the misalignment you could see: `lg:first:pl-0` matches the first
          item in the LIST, not the first in each row, so the orphan kept its
          32px left padding and its icon sat 32px right of the icon above it.
          Dividers had the same problem in reverse: `divide-x` is
          `& > * + *`, so the wrapped item drew a rule with nothing to its
          left.

          Both bugs are the same bug — per-row rules expressed as per-item
          rules — and the fix is to not have a second row. The column count is
          NOT derived from `points.length`: Tailwind compiles the class names
          it can see in the source, so a computed `lg:grid-cols-${n}` produces
          no CSS at all. If a fifth point ever arrives, this number changes by
          hand and the check in `scripts/verify-v2.mjs` fails until it does.
        */}
        <RevealGroup
          as="ul"
          delay={0.1}
          className="mt-14 grid gap-8 border-t border-border pt-10 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-10 lg:divide-x lg:divide-[var(--border)]"
        >
          {V2_ABOUT.points.map((point) => (
            <RevealItem
              as="li"
              key={point.title}
              /* Icon above the text, not beside it. At four columns the cell
                 is ~290px and a 44px disc beside the copy leaves a 26ch
                 measure, which breaks "Enterprise-Ready Integrations" across
                 three lines while its neighbours take two. Stacked, every
                 cell has the same measure and the same baseline grid. */
              className="flex flex-col gap-4 lg:px-7 lg:first:pl-0 lg:last:pr-0"
            >
              <span
                aria-hidden
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${
                  point.filled ? "bg-primary" : "border border-border bg-surface"
                }`}
              >
                {/* The fourth point arrived with the revised copy and has NO
                    supplied mark — `home-content.ts` leaves its `icon` off
                    deliberately rather than reusing one of the other three or
                    redrawing a client file. It gets a drawn glyph instead,
                    which touches none of the client's artwork. */}
                {point.icon ? (
                  <Image src={point.icon} alt="" width={20} height={20} className="h-5 w-5" />
                ) : (
                  <svg
                    viewBox="0 0 20 20"
                    className="h-5 w-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 10H4.5a2.5 2.5 0 0 1 0-5H8" />
                    <path d="M13 10h2.5a2.5 2.5 0 0 1 0 5H12" />
                    <path d="M7 15H5" />
                    <path d="M7.5 7.5h5" />
                  </svg>
                )}
              </span>
              <span>
                <span className="block text-base font-semibold tracking-[-0.01em] text-ink">
                  {point.title}
                </span>
                <span className="mt-2 block text-sm text-ink-muted">
                  {point.body}
                </span>
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
