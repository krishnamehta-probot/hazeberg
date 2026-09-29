"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

import { BERG } from "@/lib/berg-content";

/**
 * The three audiences — a deck that stacks as you scroll.
 *
 * Third design, and the two before it failed for the same underlying reason:
 * this content is not card-sized. Each audience carries a headline, three
 * paragraphs, a labelled list of four benefits and a closing line. Given a third
 * of a row it became a column of forty-character lines; given a sideways
 * accordion it fitted, but two thirds of the section was permanently folded away
 * and the row read as a control rather than as content.
 *
 * So each audience gets the FULL WIDTH of the container, and the three are
 * stacked in the scroll rather than in the layout. Each card sticks under the
 * header, the next one rides up over it, and what is left behind is a visible
 * edge of every card you have already read. Nothing is hidden, nothing is
 * folded, nothing needs operating — the scroll is the only input, which is the
 * same thing the home page does everywhere.
 *
 * The mechanics:
 *
 *   - **`position: sticky` per card**, each with a slightly deeper top offset,
 *     so the pile fans by 14px a card instead of resolving into one edge.
 *   - **the card under the pile scales down and dims**, driven by the deck's own
 *     scroll progress. Without it the cards slide over each other like paper on
 *     a desk; with it they recede, which is what makes the stack read as depth
 *     rather than as occlusion. The last card never recedes — nothing covers it.
 *   - **`lg:` only.** Below that a single card is taller than the viewport, and a
 *     sticky element taller than the screen is a scroll trap. Small screens get
 *     the same three cards in plain flow.
 *   - `prefers-reduced-motion` keeps the stack and drops the scale and the dim.
 *     The stacking is layout; the recession is the animation.
 *
 * On the copy: this renders the client's **Expanded Model** for each audience in
 * full. Their document also specifies a Collapsed Card — a shorter headline and
 * a one-line teaser — and those are near-duplicates of the expanded headline and
 * the first body paragraph ("Find the right Workday expertise faster." against
 * "Find expertise that matches your Workday needs."). They were written as two
 * states of one card; with no collapsed state left they would simply print
 * twice, which is what the previous version did. `role.headline` and
 * `role.teaser` are therefore unused on this page — flagged rather than deleted,
 * because they are the client's words and the decision is theirs.
 */

/** How far each card sits below the one above it in the pile. */
const FAN_REM = 1.1;

function StackCard({
  role,
  index,
  count,
  progress,
}: {
  role: (typeof BERG.roles.items)[number];
  index: number;
  count: number;
  progress: MotionValue<number>;
  }) {
  const reduce = useReducedMotion();
  const last = index === count - 1;

  /* The window during which this card is being covered by the next one. Drawn
     from the DECK's progress rather than the card's own: a sticky element stops
     moving while it is stuck, so its own `useScroll` flatlines at exactly the
     moment the effect is supposed to happen. */
  const from = index / count;
  const to = (index + 1) / count;
  const scale = useTransform(progress, [from, to], [1, last ? 1 : 0.93]);

  return (
    <li
      className="lg:sticky"
      style={{
        top: `calc(var(--header-h) + 1.5rem + ${index * FAN_REM}rem)`,
      }}
    >
      <motion.article
        style={reduce ? undefined : { scale }}
        /* `origin-top`, not the default centre. Scaling about the centre pulls
           the card's TOP edge down as it recedes — straight under the card
           arriving over it — so the fanned sliver that makes a pile read as a
           pile vanished at exactly the moment it was needed. Anchored at the
           top, the card shrinks away from the reader and its top edge stays
           where it was put. */
        className="relative isolate origin-top overflow-hidden rounded-2xl bg-canvas p-8 shadow-2xl shadow-ink/10 ring-1 ring-border sm:p-10 lg:p-12"
      >
        {/* NO DIMMING WASH. There was one — a void-coloured overlay that faded
            in as the card was buried — and it was wrong: it turned a white card
            grey, which reads as the card changing colour rather than as the card
            moving back. A card's colour is what it is. Depth here is carried by
            the two things that actually describe distance: the card recedes in
            SIZE, and the card above it casts a real shadow onto it. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-28 -right-24 -z-10 size-80 rounded-pill bg-primary/15 blur-3xl"
        />

        <div className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:gap-14">
          <div>
            <span aria-hidden className="grad-primary block h-1 w-12 rounded-pill" />
            <p className="mt-6 font-mono text-xs tracking-caps text-ink-subtle">{role.n}</p>
            <h3 className="mt-3 text-3xl leading-none font-light tracking-[-0.03em] text-ink">
              {role.title}
            </h3>
            <p className="mt-5 max-w-[34ch] text-xl leading-snug font-light tracking-[-0.015em] text-balance text-ink">
              {role.expandedHeadline}
            </p>

            <div className="mt-6 space-y-3.5">
              {role.body.map((para) => (
                <p key={para.slice(0, 24)} className="max-w-[60ch] text-sm text-ink-muted">
                  {para}
                </p>
              ))}
            </div>

            <p className="mt-7 border-t border-border pt-6 text-sm text-ink">{role.closing}</p>
          </div>

          {/* The benefits get their own surface. Four of them under three
              paragraphs read as more paragraphs; beside them, tinted, they read
              as the list they are. */}
          <div className="rounded-xl bg-surface p-6 ring-1 ring-border lg:self-start">
            <p className="text-sm font-medium text-ink">{role.benefitsLabel}</p>
            <ul className="mt-4 space-y-3">
              {role.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-sm text-ink-muted">
                  <span aria-hidden className="mt-[0.5rem] h-px w-3 shrink-0 bg-primary" />
                  <span className="min-w-0">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.article>
    </li>
  );
}

export function RoleCards() {
  const { roles } = BERG;
  const deck = useRef<HTMLOListElement>(null);

  /* `end end` rather than `end start`: the deck is finished when its last card
     has reached the top of the pile, not when the whole thing has left the
     screen. Measured against the latter, every card had already finished
     receding before the one above it arrived. */
  const { scrollYProgress } = useScroll({ target: deck, offset: ["start start", "end end"] });

  return (
    /* No `Reveal` around this. A transformed ancestor becomes the containing
       block for everything inside it, and a fade-up wrapper over a sticky stack
       is the classic way to end up with a stack that does not stick. */
    /* FLEX GAP, NOT `space-y`. This was a real bug and it is worth the note: a
       sticky element is clamped inside its containing block by its MARGIN box,
       and `space-y-*` puts the gap on as `margin-bottom`. With a 34vh margin the
       first card could only stick 1px into its range before the clamp caught it,
       and the second could not stick at all — the deck slid past as three loose
       cards. `gap` is not a margin, so the margin box is the border box and each
       card gets its whole range back. */
    <ol ref={deck} className="flex flex-col gap-8 lg:gap-[34vh]">
      {roles.items.map((role, i) => (
        <StackCard
          key={role.key}
          role={role}
          index={i}
          count={roles.items.length}
          progress={scrollYProgress}
        />
      ))}
    </ol>
  );
}
