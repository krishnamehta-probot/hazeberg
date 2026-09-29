"use client";

import { Button, Eyebrow, Reveal, RevealGroup, RevealItem } from "@/components/v2/kit";
import { V2_RESULTS } from "@/lib/v2/content";

/**
 * Global Workday capability — the comp's strip, carrying the current copy.
 *
 * Three corrections over the first cut, two of them layout and one content:
 *
 * 1. **The heading column was far too narrow.** It was capped with
 *    `max-w-[44ch]`, and `ch` resolves against the element's OWN font-size —
 *    which on that wrapper was the inherited 14px, not the 34px heading
 *    inside it. So the intended ~750px measure rendered at ~455px, the
 *    heading broke into seven lines, and the button was stranded across a
 *    ~500px void. The measure is now an explicit `rem` on a `flex-1` column,
 *    which cannot be misread by an inherited font-size.
 *
 * 2. **The cells bottom-aligned their body copy.** `justify-between` pushed
 *    each sentence to the foot of its cell, so a one-line sentence and a
 *    three-line sentence started at different heights and the row read as
 *    ragged. The comp has every body starting on the same line, with a fixed
 *    gap under the rule doing the work. Top-aligned now, with the figure row
 *    given a floor so a one-line label cannot lift its own rule.
 *
 * 3. **There are no counters any more.** The client moved 20+ / 200+ / 40+ /
 *    100% up into the heading and replaced the cards with four capabilities,
 *    so the big figure in each cell is now the item's own index. The comp's
 *    strip survives that change untouched — which is the whole point of
 *    taking layout from the comp and words from `home-content.ts`.
 *
 * The strip itself is one joined run: no gaps, no per-cell radius, no
 * per-cell shadow. The hairlines are `gap-px` over a `bg-border` parent, so
 * every rule is exactly 1px at any zoom, there is no doubling where two cells
 * meet, and it survives the wrap to two columns on a tablet — which
 * `border-l` on every child but the first does not.
 */

export function Results() {
  return (
    <section id="results" className="v2-tint relative">
      <div className="v2-shell v2-section">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          {/* `flex-1` with a rem cap, NOT a `ch` cap on a 14px wrapper. */}
          <div className="max-w-[52rem] lg:flex-1">
            <Reveal>
              <Eyebrow>{V2_RESULTS.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-5 v2-h2 text-ink">
                {V2_RESULTS.titleLead}{" "}
                <br />
                {V2_RESULTS.titleRest}
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-[60ch] text-sm text-ink-muted">{V2_RESULTS.body}</p>
            </Reveal>
          </div>
          <Reveal delay={0.18} className="shrink-0 lg:pb-1">
            <Button href={V2_RESULTS.cta.href} className="uppercase">
              {V2_RESULTS.cta.label}
            </Button>
          </Reveal>
        </div>

        <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-[var(--v2-radius-card)] border border-border bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          {V2_RESULTS.items.map((item) => {
            const filled = item.fill !== "plain";
            const skin =
              item.fill === "accent"
                ? "v2-fill-amber"
                : item.fill === "primary"
                  ? "v2-fill-blue"
                  : "bg-canvas";
            /* On a filled cell the rule and the body come off the fill's own
               ink: a `--border` hairline is invisible on #1972B9 and
               `--ink-muted` on it is unreadable. */
            const rule = filled ? "border-current/25" : "border-border";
            const body = filled ? "opacity-85" : "text-ink-muted";
            const title = filled ? "" : "text-ink";

            return (
              <RevealItem
                as="article"
                key={item.n}
                className={`flex flex-col p-6 ${skin}`}
              >
                {/* The figure and the title share one baseline row, and the
                    row has a 60px floor — its measured natural height — so a
                    title that happens to wrap to one line instead of two
                    cannot pull its own rule up out of line with the cell
                    beside it. Everything below inherits that alignment. */}
                <div className="flex min-h-[3.75rem] items-baseline gap-4">
                  <p className="v2-figure">
                    {item.n}
                  </p>
                  <h3 className={`max-w-[14ch] text-sm leading-tight font-medium ${title}`}>
                    {item.title}
                  </h3>
                </div>

                <div aria-hidden className={`mt-5 border-t ${rule}`} />

                {/* A fixed gap under the rule, not `justify-between`. Every
                    body in the row then starts on the same line whatever its
                    length, which is what the comp shows. */}
                <p className={`mt-12 text-xs leading-relaxed ${body}`}>
                  {item.highlight ? <Highlight body={item.body} term={item.highlight} filled={filled} /> : item.body}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}

/**
 * Lifts the client's own `highlight` substring out of the sentence around it.
 *
 * The copy stays a plain serialisable string — which is what lets it come
 * from Sanity later — and the splitting happens here. On a white cell the
 * fragment takes the brand blue; on a filled cell it cannot (blue on blue),
 * so it takes weight instead.
 *
 * Falls back to the untouched sentence if the term is not found, so a copy
 * edit that changes the wording can never drop the sentence.
 */
function Highlight({
  body,
  term,
  filled,
}: {
  body: string;
  term: string;
  filled: boolean;
}) {
  const at = body.indexOf(term);
  if (at === -1) return <>{body}</>;
  return (
    <>
      {body.slice(0, at)}
      <strong className={`font-semibold ${filled ? "" : "text-primary"}`}>{term}</strong>
      {body.slice(at + term.length)}
    </>
  );
}
