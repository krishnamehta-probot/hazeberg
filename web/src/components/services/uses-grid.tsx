"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  Award,
  BadgeCheck,
  Blocks,
  BotMessageSquare,
  ChartBarBig,
  Inbox,
  ListChecks,
  type LucideIcon,
} from "lucide-react";

import { VIEWPORT } from "@/components/motion/reveal";
import type { ServiceFeature } from "@/lib/service-content";

import { FALLBACK_USE, USE_MOTIFS, playBeat, type Beat } from "./uses-motifs";

type Item = Extract<ServiceFeature, { kind: "uses" }>["items"][number];

/** Presentation, not content: the client supplied no icons for the six. Keyed
    by kind rather than by position, so reordering them in the CMS cannot hand
    the trackers the inbox. Anything unknown gets Extend's own blocks — the
    glyph the module carries in the menu. */
const USE_ICON: Record<string, LucideIcon> = {
  requests: Inbox,
  trackers: ListChecks,
  programs: Award,
  planning: ChartBarBig,
  sector: BadgeCheck,
  assistants: BotMessageSquare,
};

/* The relay, in ms. A card's turn is its beat and then `REST` on the finished
   frame, so the work is seen to have landed before the next card starts. */
const REST = 900;
/** The first turn waits out the cards' own rise. */
const FIRST = 700;
/** How long the pointer rests on a card before that card takes the turn, so a
    sweep across the grid on the way down the page plays nothing. */
const HOVER = 140;
/** How much of a card's drawing has to be above the reveal's line for the
    card to count as on screen. Read off `intersectionRatio`, not
    `isIntersecting`: the observer also calls back the moment a single pixel
    crosses, and `isIntersecting` is true for that pixel. */
const SEEN = 0.6;

/* The site's reveal, exactly as the industries' grid has it (`industry-grid`):
   the two states are the same for everyone and only the timing changes —
   reduced motion cuts between them — so the server's hidden state is the
   client's too, whatever the preference turns out to be. */
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

const REDUCE = "(prefers-reduced-motion: reduce)";

/**
 * The six kinds of app as the industries' bento — three across from lg, two
 * from sm, one on a phone, every card the same height — with one thing of its
 * own: **a relay.** The six drawings tell the same story (work coming in from
 * somewhere else), so they tell it in turn, in reading order, one card at a
 * time: the section reads as one sentence said six ways, and the eye is led
 * round the grid instead of being asked to watch six things at once. Between
 * turns a card rests on its finished frame, which is already the story's
 * ending. One card moving at a time is also the cheapest the grid can be.
 *
 * **The timer** is the hairline between a card's index and its glyph: it fills
 * across the card's turn — the beat and a rest after it — and the turn passes
 * when it is full, so a change is always seen coming. The index darkens and
 * the well's glow comes up on the card that has the turn.
 *
 * Auto-advance's three obligations (PROJECT-RULES, Hero):
 *   - the pointer anywhere on the grid, or focus in it, holds the relay: the
 *     timer stops where it is and dims. Resting on a card (`HOVER`) gives it
 *     the turn and plays its story — the reader choosing what to watch — and
 *     when the pointer leaves, the relay goes on from that card
 *   - one click anywhere on the grid stops the relay for good and the timers
 *     go. The click also plays the card it landed on, which is how a phone,
 *     with no hover, replays a story
 *   - reduced motion never starts it: no relay, no hover, no timer — every
 *     card is its finished frame, which is the server's markup
 *
 * **Only what is on screen takes a turn.** Each card's well is watched from
 * the reveal's own line (80% down the screen) and counts once 60% of it is
 * above that line (`SEEN`); the turn passes to the next card in view, so on a
 * phone, where one or two cards fit, those one or two take turns, and a
 * section scrolled away holds nothing running. A hidden tab holds the timer
 * too.
 *
 * Nothing here is React state. The relay is one effect that writes attributes
 * (`data-turn`, `data-held`, `data-stopped`) and starts Web Animations, so a
 * turn re-renders nothing, and the first client render is the server's HTML.
 * The cards' light is the site's own (`specular.tsx`, via `data-spec`), as on
 * the industries' cards.
 */
export function UsesGrid({ items }: { items: readonly Item[] }) {
  const still = Boolean(useReducedMotion());
  const grid = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const mq = window.matchMedia(REDUCE);
    if (mq.matches) return;

    type Card = {
      el: HTMLElement;
      well: HTMLElement;
      clock: HTMLElement | null;
      beat: Beat | null;
      anims: Animation[];
      seen: boolean;
    };
    const cards: Card[] = Array.from(el.querySelectorAll<HTMLElement>("[data-use-card]")).map((card) => ({
      el: card,
      well: card.querySelector<HTMLElement>("[data-motif]") ?? card,
      clock: card.querySelector<HTMLElement>("[data-clock]"),
      beat: (USE_MOTIFS[card.dataset.useCard ?? ""] ?? FALLBACK_USE).beat,
      anims: [],
      seen: false,
    }));
    const n = cards.length;
    if (!cards.some((c) => c.beat)) return;

    /* -- state ------------------------------------------------------------ */
    let active = -1; // the card with the turn, or none
    let timer: Animation | null = null;
    let started = false;
    let pointerIn = false;
    let focusIn = false;
    let stopped = false; // a click: no more relay, hover still plays
    let off = false; // reduced motion switched on mid-visit: nothing at all
    let hovered: HTMLElement | null = null;
    let hoverT = 0;

    const busy = (c: Card) => c.anims.some((a) => a.playState === "running");

    /** Plays a card's story, unless it is already being told. */
    const play = (c: Card, delay = 0) => {
      if (off || !c.beat || busy(c)) return;
      c.anims.forEach((a) => a.cancel());
      c.anims = playBeat(c.well, c.beat, delay);
    };

    const mark = (i: number) => cards.forEach((c, j) => c.el.toggleAttribute("data-turn", j === i));

    const held = () => pointerIn || focusIn || document.hidden;
    const sync = () => {
      const h = held();
      el.toggleAttribute("data-held", h);
      if (!timer) return;
      if (h) timer.pause();
      else if (timer.playState === "paused") timer.play();
    };

    /** Card `i` takes the turn: its story plays and its timer runs the
        length of the story and the rest after it. */
    const take = (i: number, delay = 0) => {
      const c = cards[i];
      timer?.cancel();
      timer = null;
      if (off || stopped || !c?.beat || !c.clock) return;
      active = i;
      mark(i);
      play(c, delay);
      timer = c.clock.animate(
        [
          { transform: "scaleX(0)", opacity: 1 },
          { transform: "scaleX(1)", opacity: 1, offset: 0.95 },
          { transform: "scaleX(1)", opacity: 0 },
        ],
        { duration: c.beat.duration + REST, delay, easing: "linear" },
      );
      timer.onfinish = () => {
        timer = null;
        pass();
      };
      sync();
    };

    /** The turn goes to the next card in reading order that is on screen —
        the same card again, if it is the only one. None on screen: it waits. */
    const pass = (delay = 0) => {
      for (let k = 1; k <= n; k++) {
        const j = (active + k + n) % n;
        if (cards[j].seen && cards[j].beat) {
          take(j, delay);
          return;
        }
      }
      active = -1;
      mark(-1);
    };

    /* -- on screen -------------------------------------------------------- */
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const c = cards.find((card) => card.well === entry.target);
          if (c) c.seen = entry.isIntersecting && entry.intersectionRatio >= SEEN;
        }
        if (off || stopped) return;
        if (active >= 0 && cards[active].seen) return;
        /* The turn is off screen, or nowhere yet: hand it to what is on. */
        timer?.cancel();
        timer = null;
        const first = !started && cards.some((c) => c.seen && c.beat);
        if (first) started = true;
        pass(first ? FIRST : 0);
      },
      { rootMargin: VIEWPORT.margin, threshold: SEEN },
    );
    cards.forEach((c) => io.observe(c.well));

    /* -- input ------------------------------------------------------------ */
    /* Touch is left out of the hover: a tap has no hover to end. */
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointerIn = true;
      sync();
    };
    const onLeave = () => {
      pointerIn = false;
      hovered = null;
      window.clearTimeout(hoverT);
      sync();
    };
    const onOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const card = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-use-card]") : null;
      if (card === hovered) return;
      hovered = card;
      window.clearTimeout(hoverT);
      const i = cards.findIndex((c) => c.el === card);
      if (i < 0) return;
      hoverT = window.setTimeout(() => {
        if (stopped) play(cards[i]);
        else take(i);
      }, HOVER);
    };
    const onClick = (e: MouseEvent) => {
      if (off) return;
      if (!stopped) {
        stopped = true;
        timer?.cancel();
        timer = null;
        active = -1;
        mark(-1);
        el.setAttribute("data-stopped", "");
      }
      const card = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-use-card]") : null;
      const c = cards.find((x) => x.el === card);
      if (c) play(c);
    };
    const onFocusIn = () => {
      focusIn = true;
      sync();
    };
    const onFocusOut = (e: FocusEvent) => {
      if (e.relatedTarget instanceof Node && el.contains(e.relatedTarget)) return;
      focusIn = false;
      sync();
    };
    /* Reduced motion switched on mid-visit: everything stops, and a stopped
       Web Animation drops back to the markup — the finished pictures. */
    const onReduce = () => {
      if (!mq.matches) return;
      off = true;
      timer?.cancel();
      timer = null;
      cards.forEach((c) => {
        c.anims.forEach((a) => a.cancel());
        c.anims = [];
      });
      mark(-1);
      el.setAttribute("data-stopped", "");
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerover", onOver);
    el.addEventListener("click", onClick);
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    document.addEventListener("visibilitychange", sync);
    mq.addEventListener("change", onReduce);

    return () => {
      io.disconnect();
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerover", onOver);
      el.removeEventListener("click", onClick);
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("visibilitychange", sync);
      mq.removeEventListener("change", onReduce);
      window.clearTimeout(hoverT);
      timer?.cancel();
      cards.forEach((c) => c.anims.forEach((a) => a.cancel()));
      mark(-1);
      el.removeAttribute("data-held");
      el.removeAttribute("data-stopped");
    };
  }, [items]);

  return (
    <motion.ul
      ref={grid}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      variants={list(still)}
      className="use-grid mt-12 grid gap-4 sm:auto-rows-fr sm:grid-cols-2 sm:gap-5 lg:mt-16 lg:grid-cols-3"
    >
      {items.map((item, i) => (
        <UseCard key={item.key} item={item} index={i} variants={rise(still)} />
      ))}
    </motion.ul>
  );
}

/**
 * One kind of app, built exactly as an industries card is — the drawing in an
 * inset well, then the index and the glyph on a hairline, the name and the
 * line — so the two module pages read as one hand. (These have no tags; the
 * document gives each kind one example line.) The hairline is this card's
 * timer while it has the relay's turn.
 *
 * Not a link and takes no focus: there is nothing on it to act on, and every
 * word is on the page. Hover lifts and lights it, as on the industries' cards,
 * and plays its story.
 */
function UseCard({ item, index, variants }: { item: Item; index: number; variants: Variants }) {
  const Art = (USE_MOTIFS[item.key] ?? FALLBACK_USE).Art;
  const Icon = USE_ICON[item.key] ?? Blocks;

  return (
    <motion.li variants={variants} className="h-full">
      <article
        data-spec
        data-use-card={item.key}
        className="ind-card use-card relative flex h-full flex-col overflow-hidden rounded-2xl bg-canvas p-2 ring-1 ring-border hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:ring-primary/25 motion-reduce:hover:translate-y-0"
      >
        <div
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
            <span className="use-idx font-mono text-[0.6875rem] tracking-caps text-ink-subtle tabular-nums">
              {pad(index)}
            </span>
            <span className="use-rule relative h-px flex-1 bg-border">
              <span data-clock className="use-clock grad-primary absolute inset-x-0 -top-[0.5px] h-0.5 origin-left rounded-pill" />
            </span>
            <span className="disc-blue grid size-9 shrink-0 place-items-center rounded-pill text-white shadow-md shadow-primary/20">
              <Icon className="size-4" strokeWidth={1.8} />
            </span>
          </div>

          <h3 className="mt-4 text-2xl leading-[1.12] font-light tracking-[-0.025em] text-balance text-ink">
            {item.name}
          </h3>
          <p className="mt-2.5 max-w-[42ch] text-sm text-ink-muted">{item.line}</p>
        </div>
      </article>
    </motion.li>
  );
}
