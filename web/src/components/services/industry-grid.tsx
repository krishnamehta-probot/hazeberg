"use client";

import { useEffect, useRef, useSyncExternalStore, type PointerEvent, type RefObject } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "motion/react";
import {
  BrainCircuit,
  Building2,
  CreditCard,
  GraduationCap,
  HeartPulse,
  Landmark,
  Store,
  type LucideIcon,
} from "lucide-react";

import { VIEWPORT } from "@/components/motion/reveal";
import type { ServiceFeature } from "@/lib/service-content";

import { FALLBACK_MOTIF, MOTIFS, startLoop, type Loop } from "./industry-motifs";

type Item = Extract<ServiceFeature, { kind: "industries" }>["items"][number];

/** Presentation, not content: the client supplied no sector icons. Keyed by
    sector rather than by position, so reordering the six in the CMS cannot hand
    Healthcare the mortarboard. Anything unknown gets a plain building. */
const SECTOR_ICON: Record<string, LucideIcon> = {
  "higher-education": GraduationCap,
  healthcare: HeartPulse,
  "financial-services": Landmark,
  retail: Store,
  fintech: CreditCard,
  "ai-technology": BrainCircuit,
};

/** How much faster a motif runs while its card is under the pointer: enough
    to read as the card answering, not so much that it reads as a fast-forward. */
const FAST = 1.7;

/* The site's reveal (`reveal.tsx`): 64px of rise and a fade, the cards in
   order rather than as one slab. Not `RevealItem` itself, which drops its
   variants under reduced motion — the server cannot know the preference, so it
   renders the hidden state either way, and a reduced-motion client that then
   has no variants never leaves it. Here the two states are the same for
   everyone and only the timing changes: reduced motion cuts between them. */
const EASE = [0.2, 0.7, 0.3, 1] as const;
const list = (still: boolean): Variants => ({
  hidden: {},
  shown: { transition: { staggerChildren: still ? 0 : 0.08 } },
});
const rise = (still: boolean): Variants => ({
  hidden: { opacity: 0, y: 64 },
  shown: { opacity: 1, y: 0, transition: still ? { duration: 0 } : { duration: 0.7, ease: EASE } },
});

const pad = (i: number) => String(i + 1).padStart(2, "0");

/** Sets the pace of every loop running in one card's drawing. `updatePlaybackRate`
    keeps each animation where it is and only changes how fast it goes on, so
    nothing jumps. The pace is also left on the card, for a loop that has not
    been built yet when the pointer arrives. */
function pace(card: HTMLElement, rate: number) {
  card.dataset.pace = String(rate);
  card
    .querySelector("[data-motif]")
    ?.getAnimations({ subtree: true })
    .forEach((a) => a.updatePlaybackRate(rate));
}

/**
 * The six sectors as a bento grid: three across from lg, two from sm, one on a
 * phone, every card the same height (`auto-rows-fr`) so the two rows read as
 * one block.
 *
 * **One listener for the pointer, on the grid.** Which card is under it sets
 * that card's drawing to the faster pace and the last one's back; nothing is
 * React state, so a pointer crossing the grid re-renders nothing. The card's
 * light (`.ind-card`) follows the pointer through the site's own delegated
 * listener (`specular.tsx`, via `data-spec`), which writes `--mx`, `--my` and
 * `--spec-hover` on the card — the grid adds no per-frame work of its own.
 * Touch is left out: a tap has no hover to end, and would leave a card racing.
 */
export function IndustryGrid({ items }: { items: readonly Item[] }) {
  const still = Boolean(useReducedMotion());
  const hot = useRef<HTMLElement | null>(null);

  const heat = (card: HTMLElement | null) => {
    if (card === hot.current) return;
    if (hot.current) pace(hot.current, 1);
    hot.current = card;
    if (card) pace(card, FAST);
  };

  const over = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType === "touch") return;
    heat(e.target instanceof Element ? e.target.closest<HTMLElement>("[data-ind-card]") : null);
  };

  return (
    <motion.ul
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      variants={list(still)}
      onPointerOver={over}
      onPointerLeave={() => heat(null)}
      className="mt-12 grid gap-4 sm:auto-rows-fr sm:grid-cols-2 sm:gap-5 lg:mt-16 lg:grid-cols-3"
    >
      {items.map((item, i) => (
        <IndustryCard key={item.key} item={item} index={i} variants={rise(still)} />
      ))}
    </motion.ul>
  );
}

/**
 * One sector: its drawing in an inset well, then the index and the sector's
 * glyph on a hairline, the name, the line, and the tags at the foot.
 *
 * The well sits 8px inside a 28px card at 20px, so its corners run parallel
 * to the card's rather than pinching against them. Its height is fixed (9rem,
 * 10rem from sm) so the names line up across a row whatever the drawing does;
 * the tags take `mt-auto`, so they line up along the cards' feet.
 *
 * The card is not a link and takes no focus — there is nothing on it to act
 * on, and every word is already on the page. Hover only lifts it, lights it
 * where the pointer is and quickens its drawing.
 */
function IndustryCard({ item, index, variants }: { item: Item; index: number; variants: Variants }) {
  const motif = MOTIFS[item.key] ?? FALLBACK_MOTIF;
  const Art = motif.Art;
  const Icon = SECTOR_ICON[item.key] ?? Building2;
  const well = useRef<HTMLDivElement>(null);
  /* Plays from the reveal's own line (80% down the screen, `VIEWPORT`), so a
     drawing starts as its card rises and opens on its finished frame (the
     five that take their picture apart hold it for the first 10-14% of the
     cycle, 0.7-1.3s; the dial simply turns) — and pauses again once it has
     gone: nothing moves where nobody can see it. */
  const run = useInView(well, { margin: VIEWPORT.margin });
  useLoop(well, motif.loop, run);

  return (
    <motion.li variants={variants} className="h-full">
      <article
        data-spec
        data-ind-card
        className="ind-card relative flex h-full flex-col overflow-hidden rounded-2xl bg-canvas p-2 ring-1 ring-border hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:ring-primary/25 motion-reduce:hover:translate-y-0"
      >
        <div
          ref={well}
          data-motif
          aria-hidden
          className="relative h-36 shrink-0 overflow-hidden rounded-xl bg-surface sm:h-40"
        >
          <span className="ind-grid absolute inset-0" />
          <span className="ind-grid ind-grid-lit absolute inset-0" />
          <span className="ind-glow absolute inset-0" />
          <Art />
        </div>

        <div className="flex flex-1 flex-col px-3 pt-5 pb-4 sm:px-4 sm:pt-6 sm:pb-5 xl:px-5">
          <div aria-hidden className="flex items-center gap-3">
            <span className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle tabular-nums">
              {pad(index)}
            </span>
            <span className="ind-rule relative h-px flex-1 overflow-hidden bg-border" />
            <span className="disc-blue grid size-9 shrink-0 place-items-center rounded-pill text-white shadow-md shadow-primary/20">
              <Icon className="size-4" strokeWidth={1.8} />
            </span>
          </div>

          <h3 className="mt-4 text-2xl leading-[1.12] font-light tracking-[-0.025em] text-balance text-ink">
            {item.sector}
          </h3>
          <p className="mt-2.5 max-w-[42ch] text-sm text-ink-muted">{item.line}</p>

          <ul className="mt-auto flex flex-wrap gap-1.5 pt-6">
            {item.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-pill bg-canvas px-2.5 py-1 text-xs font-medium text-ink-muted ring-1 ring-border"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </motion.li>
  );
}

const REDUCE = "(prefers-reduced-motion: reduce)";
const onReduce = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * Plays a motif's loop while its well is on screen.
 *
 * The loop is built the first time the well is seen, not on mount, so a card
 * nobody scrolls to costs nothing; after that it is only paused and resumed,
 * which keeps its place. Reduced motion never builds it, and turning reduced
 * motion on mid-visit cancels it — a canceled animation drops back to the
 * markup, which is the finished picture.
 *
 * The preference is read through the store, as `true` on the server and
 * through hydration: it only decides whether to START anything, never what is
 * rendered, so the first client render matches the HTML whatever it says.
 */
function useLoop(scope: RefObject<HTMLElement | null>, loop: Loop | null, run: boolean) {
  const still = useSyncExternalStore(onReduce, () => window.matchMedia(REDUCE).matches, () => true);
  const anims = useRef<Animation[]>([]);

  useEffect(() => {
    const live = anims.current;
    const root = scope.current;
    if (!loop || !root || still) return;
    if (!run) {
      live.forEach((a) => a.pause());
      return;
    }
    if (!live.length) {
      const card = root.closest<HTMLElement>("[data-ind-card]");
      live.push(...startLoop(root, loop, Number(card?.dataset.pace ?? 1)));
    }
    live.forEach((a) => a.play());
  }, [scope, loop, run, still]);

  useEffect(() => {
    const live = anims.current;
    return () => {
      live.forEach((a) => a.cancel());
      live.length = 0;
    };
  }, [still]);
}
