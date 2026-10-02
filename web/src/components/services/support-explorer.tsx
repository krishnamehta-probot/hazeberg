"use client";

import { useId, useRef, useState, useSyncExternalStore, type FocusEvent, type KeyboardEvent } from "react";
import { motion, useInView, type Transition, type Variants } from "motion/react";

import { VIEWPORT } from "@/components/motion/reveal";
import type { ServiceFeature } from "@/lib/service-content";

import { ArrangementGlyph, SupportStage, arrangementOf, type Arrangement } from "./support-stage";

type Data = Extract<ServiceFeature, { kind: "support" }>;
type Model = Data["models"][number];

/** Micro-UI, not a claim: the lead-in to each model's `fits` line. */
const FITS = "Where it fits";

/** How long the drawing holds each model before it moves on by itself. Long
    enough to read a card, and for flexible to show three requests met. */
const DWELL = 7000;

/* Read through the store so the server and the hydrating render agree: the
   server says "reduced" (nothing starts), the browser's real answer arrives
   straight after hydration. It decides only what STARTS — the timer, the
   loops — never what the markup is. */
const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeReduce = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const reduceNow = () => window.matchMedia(REDUCE).matches;
const reduceOnServer = () => true;

/* A hidden tab holds the timer, as the hero's dial does. */
const subscribeHidden = (onChange: () => void) => {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
};
const hiddenNow = () => document.hidden;
const hiddenOnServer = () => false;

/* The site's reveal (`reveal.tsx`): 64px of rise and a fade, the stage and
   then the cards in order. Not `RevealItem` itself, which drops its variants
   under reduced motion — the server cannot know the preference, so it renders
   the hidden state either way, and a reduced-motion client with no variants
   never leaves it. Here both states are the same for everyone and only the
   timing changes: reduced motion cuts between them (`industry-grid.tsx`). */
const EASE = [0.2, 0.7, 0.3, 1] as const;
const INSTANT: Transition = { duration: 0 };
const group = (quiet: boolean): Variants => ({
  hidden: {},
  shown: { transition: { staggerChildren: quiet ? 0 : 0.08 } },
});
const rise = (quiet: boolean): Variants => ({
  hidden: { opacity: 0, y: 64 },
  shown: { opacity: 1, y: 0, transition: quiet ? INSTANT : { duration: 0.7, ease: EASE } },
});

/**
 * The three ways to buy support, and one team drawn three ways.
 *
 * **The cards are the control.** A real radiogroup, named by the section's
 * title: one card in the tab order at a time, the arrow keys moving AND
 * choosing (all four, since the cards stand in a column on every screen),
 * Home and End to the ends. Every card carries its model's whole copy — name,
 * how it works, where it fits — at all times; choosing only decides which
 * arrangement the drawing shows and which card is lit. Unlit never means
 * unreadable: a card steps back by losing its color and its lift, never its
 * ink. A radio's name is the model's name and its description is the rest of
 * the card, so a screen reader moving through the group hears the name first.
 *
 * **It opens on the managed service**, the first model, with its ring drawing
 * itself shut as the section arrives — a picture that makes sense with nobody
 * touching it. Then, because the section's claim is the walk from one
 * arrangement to the next and most readers never click, it moves on by
 * itself every `DWELL`. Auto-advance's three obligations (PROJECT-RULES,
 * Hero), and a fourth for a phone:
 *   - the pointer anywhere on the stage or the cards, or focus anywhere in
 *     them, holds it: both timers stop where they are and dim
 *   - one click or tap anywhere on them, or choosing a model by key, stops it
 *     for good, and the timers go
 *   - reduced motion never starts it: the store reads "reduced" until
 *     hydration, so no timer is even in the server's markup
 *   - it only runs while most of the STAGE is on screen (and the tab is
 *     visible), so on a phone, where the drawing sits above the cards, the
 *     picture never changes while the reader cannot see it change
 * The timer is drawn twice, in step: a line filling in the stage's readout,
 * which is what moves it on, and the lit card's top edge filling as the same
 * line. Stopped, the lit card's edge is simply full.
 *
 * **Layout.** From lg the stage stands on the left as a sticky column and the
 * cards on the right; whichever is taller sets the row, and the cards center
 * on a taller stage. Below lg the stage comes first and the cards stack under
 * it. On a card, the miniature of its arrangement sits left of the copy from
 * sm, and on its own row above it on a phone.
 */
export function SupportExplorer({ data, labelledBy }: { data: Data; labelledBy: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const quiet = useSyncExternalStore(subscribeReduce, reduceNow, reduceOnServer);
  const hidden = useSyncExternalStore(subscribeHidden, hiddenNow, hiddenOnServer);

  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [pointer, setPointer] = useState(false);
  const [focus, setFocus] = useState(false);

  const stage = useRef<HTMLDivElement>(null);
  const seen = useInView(stage, VIEWPORT);
  const near = useInView(stage, { margin: "120px 0px 120px 0px" });
  const watching = useInView(stage, { amount: 0.6 });
  const radios = useRef<(HTMLButtonElement | null)[]>([]);

  const { models } = data;
  const n = models.length;
  const arrangements = models.map((m, i) => arrangementOf(m.key, i));
  const held = pointer || focus;
  const timing = auto && !quiet && n > 1;
  const running = timing && watching && !held && !hidden;

  const choose = (i: number) => {
    setActive(i);
    setAuto(false);
  };

  const move = (e: KeyboardEvent<HTMLButtonElement>, k: number) => {
    const to =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? (k + 1) % n
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? (k - 1 + n) % n
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : -1;
    if (to < 0) return;
    e.preventDefault();
    choose(to);
    radios.current[to]?.focus();
  };

  const leave = (e: FocusEvent<HTMLDivElement>) => {
    if (e.relatedTarget instanceof Node && e.currentTarget.contains(e.relatedTarget)) return;
    setFocus(false);
  };

  const v = rise(quiet);

  return (
    <motion.div
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      variants={group(quiet)}
      onPointerEnter={() => setPointer(true)}
      onPointerLeave={() => setPointer(false)}
      onFocus={() => setFocus(true)}
      onBlur={leave}
      onClick={() => setAuto(false)}
      className="mt-12 grid items-start gap-4 sm:gap-5 lg:mt-16 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,1fr)] lg:gap-6 xl:gap-8"
    >
      {/* ======================= the stage ============================== */}
      <div className="lg:sticky lg:top-[calc(var(--header-h)+1rem)]">
        <motion.div ref={stage} variants={v}>
          <SupportStage
            arrangement={arrangements[active] ?? "managed"}
            names={models.map((m) => m.name)}
            active={active}
            seen={seen}
            near={near}
            quiet={quiet}
            held={held}
            timer={
              timing ? (
                <span
                  key={active}
                  data-run={running ? "" : undefined}
                  style={{ animationDuration: `${DWELL}ms` }}
                  onAnimationEnd={(e) => {
                    if (e.animationName === "sm-timer") setActive((a) => (a + 1) % n);
                  }}
                  className="sm-timer absolute inset-0 rounded-pill bg-primary"
                />
              ) : null
            }
          />
        </motion.div>
      </div>

      {/* ======================= the models ============================= */}
      <div role="radiogroup" aria-labelledby={labelledBy} className="grid gap-3 sm:gap-4 lg:self-center">
        {models.map((model, i) => (
          <motion.div key={model.key} variants={v}>
            <ModelCard
              ref={(el) => {
                radios.current[i] = el;
              }}
              id={`${uid}-${i}`}
              model={model}
              arrangement={arrangements[i]}
              on={i === active}
              timing={timing}
              running={running}
              held={held}
              onChoose={() => choose(i)}
              onKey={(e) => move(e, i)}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ================================ parts ================================== */

/**
 * One model, as a radio. White on the section's gray either way; chosen, it
 * takes a blue ring and a soft blue shadow, its miniature fills the brand's
 * blue disc, the dot at its corner fills, and its top edge lights from the
 * left — as the auto-advance's timer while that runs, at once when it does
 * not. The copy never changes color: `ink-muted` on white is 7.3:1 lit or
 * not.
 *
 * Its contents are phrasing elements only (a button may hold nothing else),
 * set as blocks.
 */
function ModelCard({
  ref,
  id,
  model,
  arrangement,
  on,
  timing,
  running,
  held,
  onChoose,
  onKey,
}: {
  ref: (el: HTMLButtonElement | null) => void;
  id: string;
  model: Model;
  arrangement: Arrangement;
  on: boolean;
  timing: boolean;
  running: boolean;
  /** Held by a pointer or focus: the timer dims where it stopped, as the
      stage's does. */
  held: boolean;
  onChoose: () => void;
  onKey: (e: KeyboardEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={on}
      aria-labelledby={`${id}-name`}
      aria-describedby={`${id}-how ${id}-fits-label ${id}-fits`}
      tabIndex={on ? 0 : -1}
      onClick={onChoose}
      onKeyDown={onKey}
      className={`group/card relative flex w-full cursor-pointer flex-col gap-5 overflow-hidden rounded-2xl bg-canvas p-5 text-left ring-1 transition dur-base ease-brand active:scale-[0.99] sm:flex-row sm:gap-5 sm:p-6 xl:p-7 ${
        on
          ? "shadow-xl shadow-primary/10 ring-primary/45"
          : "shadow-none ring-border hover:shadow-lg hover:shadow-ink/5 hover:ring-primary/30"
      }`}
    >
      {/* The lit edge, and the timer that fills it while auto-advance runs. */}
      <span
        aria-hidden
        className={`grad-primary absolute inset-x-0 top-0 h-1 origin-left transition-transform duration-700 ease-brand ${
          on && !timing ? "scale-x-100" : "scale-x-0"
        }`}
      />
      {on && timing ? (
        <span
          aria-hidden
          data-run={running ? "" : undefined}
          style={{ animationDuration: `${DWELL}ms` }}
          className={`sm-timer grad-primary absolute inset-x-0 top-0 h-1 transition-opacity dur-base ease-brand ${
            held ? "opacity-45" : ""
          }`}
        />
      ) : null}

      {/* Chosen or not, as a radio's own dot. */}
      <span
        aria-hidden
        className={`absolute top-5 right-5 grid size-5 place-items-center rounded-pill ring-1 transition dur-base ease-brand sm:top-6 sm:right-6 xl:top-7 xl:right-7 ${
          on ? "bg-primary/8 ring-primary" : "bg-canvas ring-border-strong group-hover/card:ring-primary/50"
        }`}
      >
        <span
          className={`size-2.5 rounded-pill bg-primary transition-transform dur-base ease-brand ${
            on ? "scale-100" : "scale-0"
          }`}
        />
      </span>

      <span
        aria-hidden
        className={`grid size-11 shrink-0 place-items-center rounded-pill transition-colors duration-500 ease-brand ${
          on ? "disc-blue text-white shadow-md shadow-primary/25" : "bg-surface text-ink-subtle ring-1 ring-border"
        }`}
      >
        <ArrangementGlyph arrangement={arrangement} className="size-6" />
      </span>

      <span className="block min-w-0 flex-1">
        <span
          id={`${id}-name`}
          className="block pr-8 text-2xl leading-[1.12] font-light tracking-[-0.025em] text-balance text-ink sm:pt-1.5"
        >
          {model.name}
        </span>
        <span id={`${id}-how`} className="mt-2.5 block max-w-[48ch] text-sm text-ink-muted sm:text-base">
          {model.how}
        </span>
        <span className="mt-5 block border-t border-border pt-4 sm:flex sm:items-baseline sm:gap-4 lg:block xl:flex">
          <span
            id={`${id}-fits-label`}
            className="block shrink-0 font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase sm:w-28 lg:w-auto xl:w-28"
          >
            {FITS}
          </span>
          <span id={`${id}-fits`} className="mt-1.5 block text-sm text-ink sm:mt-0 lg:mt-1.5 xl:mt-0">
            {model.fits}
          </span>
        </span>
      </span>
    </button>
  );
}
