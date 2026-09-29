"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

import { BERG } from "@/lib/berg-content";

/**
 * How Berg works — a roadmap you travel down.
 *
 * It was five markers on a horizontal track with one panel underneath, and the
 * problem was never the styling: a horizontal track gives each stop one line's
 * worth of room, so four fifths of the section lived in a panel that only
 * existed while you were pointing at it. The copy is five stages with a
 * headline, two paragraphs and a labelled outcome each. That is a road, and a
 * road is drawn going down the page.
 *
 * TWO BUGS FIXED HERE, both worth recording:
 *
 *  1. **the sides did not alternate**, although the code said they did. Every
 *     row concatenated its base classes with its flipped ones, so a flipped row
 *     carried BOTH `lg:col-start-1` and `lg:col-start-2`. Tailwind resolves that
 *     by stylesheet order, not by the order they appear in the attribute — and
 *     `col-start-2` is emitted later, so it won every time and all five cards
 *     stacked down the same side. Each branch now produces ONE complete string
 *     and the two never appear together. (This is the general rule: conditional
 *     Tailwind must swap whole values, never append a second value for the same
 *     property.)
 *
 *  2. **the stages arrived and then just sat there.** `whileInView` with
 *     `once: true` is a doorway — it fires and is finished. A roadmap wants the
 *     opposite: each stage should gather as it comes up the screen and let go as
 *     it leaves, so the section reads as travel rather than as five things that
 *     appeared. Every row is now driven by its OWN passage through the viewport,
 *     so it rises and focuses on the way in and recedes and blurs on the way
 *     out, and it does the same in reverse when you scroll back up.
 *
 * The rest:
 *   - **the line fills with the scroll**, sprung, so it keeps moving for a beat
 *     after a flicked scroll stops. Raw progress is correct and feels mechanical.
 *   - **the copy and the card come from their own sides**, towards the line —
 *     which is what makes the line read as something being crossed rather than
 *     as a rule drawn beside a list.
 *   - **the road ends on amber.** The last node and the last card's foot take
 *     the accent; it is the only amber in the section.
 *   - nothing is behind a click. Every word is in the DOM in reading order at
 *     every width, so the markup IS the ordered list.
 *
 * On a phone the line moves to the left edge and every stage sits to the right
 * of it. Alternating at 390px would be two columns of about eighteen characters.
 */

function Stage({
  step,
  index,
  last,
}: {
  step: (typeof BERG.workflow.items)[number];
  index: number;
  last: boolean;
}) {
  const row = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();

  /* The row's whole passage across the viewport: 0 when its top is at the
     bottom edge, 1 when its bottom has left the top edge. Everything below is a
     slice of that one number, which is why the way in and the way out are the
     same gesture played in opposite directions. */
  const { scrollYProgress } = useScroll({ target: row, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.4 });

  const opacity = useTransform(p, [0.04, 0.3, 0.74, 0.97], [0, 1, 1, 0.12]);
  const y = useTransform(p, [0.04, 0.34], [64, 0]);
  const scale = useTransform(p, [0.74, 0.97], [1, 0.94]);
  const blur = useTransform(p, [0.04, 0.32, 0.76, 0.97], [8, 0, 0, 7]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  /* The two halves close on the line from opposite sides. Small — 40px is a
     gesture, 120px is a slide show. */
  const copyX = useTransform(p, [0.04, 0.36], [-40, 0]);
  const cardX = useTransform(p, [0.04, 0.36], [40, 0]);
  const node = useTransform(p, [0.18, 0.4], [0.4, 1]);

  const motionStyle = reduce ? undefined : { opacity, y, scale, filter };

  /* ONE complete string per branch. See the note at the top of the file: two
     values for the same Tailwind property on one element is resolved by
     stylesheet order, which is not the order they were written in. */
  const flip = index % 2 === 1;
  const copyPlace = flip
    ? "lg:col-start-2 lg:row-start-1 lg:pl-4"
    : "lg:col-start-1 lg:row-start-1 lg:justify-self-end lg:pr-4 lg:text-right";
  const cardPlace = flip
    ? "lg:col-start-1 lg:row-start-1"
    : "lg:col-start-2 lg:row-start-1";

  return (
    <li
      ref={row}
      className="relative pl-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:pl-0"
    >
      {/* -- the node on the line -------------------------------------- */}
      <span
        aria-hidden
        className="absolute top-2 left-0 grid size-4 place-items-center lg:top-1/2 lg:left-1/2 lg:size-7 lg:-translate-x-1/2 lg:-translate-y-1/2"
      >
        <motion.span
          style={reduce ? undefined : { scale: node, opacity: node }}
          className={`absolute inset-0 rounded-pill ${
            last ? "bg-accent/18 ring-1 ring-accent/45" : "bg-primary/12 ring-1 ring-primary/35"
          }`}
        />
        <motion.span
          style={reduce ? undefined : { scale: node }}
          className={`relative size-2 rounded-pill lg:size-2.5 ${last ? "bg-accent" : "disc-blue"}`}
        />
      </span>

      {/* -- the stage ------------------------------------------------- */}
      <motion.div
        style={reduce ? undefined : { ...motionStyle, x: copyX }}
        className={copyPlace}
      >
        <p className="font-mono text-xs tracking-caps text-ink-subtle">{step.n}</p>
        <h3 className="mt-3 text-3xl leading-none font-light tracking-[-0.03em] text-ink">
          {step.title}
        </h3>
        <p
          className={`mt-4 max-w-[30ch] text-base font-medium text-balance text-ink ${
            flip ? "" : "lg:ml-auto"
          }`}
        >
          {step.headline}
        </p>
      </motion.div>

      {/* -- the outcome card ------------------------------------------ */}
      <motion.div
        style={reduce ? undefined : { ...motionStyle, x: cardX }}
        className={`mt-6 lg:mt-0 ${cardPlace}`}
      >
        <div className="group/c relative overflow-hidden rounded-2xl bg-canvas p-7 ring-1 ring-border transition dur-base ease-brand hover:shadow-xl hover:shadow-primary/10 hover:ring-primary/25 sm:p-8">
          <div className="space-y-3.5">
            {step.body.map((para) => (
              <p key={para.slice(0, 24)} className="max-w-[52ch] text-sm text-ink-muted">
                {para}
              </p>
            ))}
          </div>

          <div className="mt-7 border-t border-border pt-5">
            <p className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
              {step.footLabel}
            </p>
            <p className={`mt-2 text-sm font-medium ${last ? "text-ink" : "text-primary"}`}>
              {step.footValue}
            </p>
          </div>

          {/* The coloured foot from the reference — drawn in as the stage
              arrives rather than painted there from the start. */}
          <motion.span
            aria-hidden
            style={reduce ? undefined : { scaleX: node }}
            className={`absolute inset-x-0 bottom-0 h-1 origin-left ${
              last ? "grad-cta" : "grad-primary"
            }`}
          />
        </div>
      </motion.div>
    </li>
  );
}

export function Workflow() {
  const { workflow } = BERG;
  const track = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();

  /* The fill is driven by the LIST's travel: it starts when the first stop is
     two thirds up the screen and finishes when the last one is — so the line is
     full exactly when the last stage is being read, rather than once the whole
     section has already gone past. */
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start 0.66", "end 0.72"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.5 });

  return (
    <ol ref={track} className="relative space-y-16 lg:space-y-28">
      {/* Inset top and bottom to the first and last nodes, so the line starts
          and finishes ON the journey rather than running past both ends. */}
      <span
        aria-hidden
        className="absolute top-3 bottom-3 left-[7px] w-px bg-border lg:left-1/2 lg:-translate-x-1/2"
      />
      <motion.span
        aria-hidden
        className="grad-primary absolute top-3 bottom-3 left-[7px] w-px origin-top lg:left-1/2 lg:-translate-x-1/2"
        style={{ scaleY: reduce ? 1 : fill }}
      />

      {workflow.items.map((step, i) => (
        <Stage
          key={step.n}
          step={step}
          index={i}
          last={i === workflow.items.length - 1}
        />
      ))}
    </ol>
  );
}
