"use client";

import { type ReactNode, useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

/**
 * The split that opens while the block is pinned.
 *
 * The section holds still and only the column between the cards grows — the
 * content does not travel up the screen while the animation runs. That is what
 * the pin buys: a tall outer track gives the scroll something to consume, and
 * the inner sticky pane stays put through it. When the track is spent the page
 * carries on as normal.
 *
 * Progress is run through a spring. Raw scroll progress tracks the wheel
 * exactly, which reads as mechanical and stutters on trackpads that emit
 * uneven deltas; the spring lags it slightly and arrives smoothly.
 *
 * The width is driven through a CSS custom property rather than a width style,
 * which is what lets the whole effect be desktop-only: below lg nothing reads
 * the variable, there is no track and no pin, and phones get a plain stack.
 *
 * Width is animated rather than a transform because the cards genuinely have to
 * move apart — scaling the media would stretch the photograph instead.
 */
export function ResultsSplit({
  left,
  right,
  media,
}: {
  left: ReactNode;
  right: ReactNode;
  media: ReactNode;
}) {
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // The whole track is the animation. Cards are already on screen and settled
  // by the time the pin engages, so the column has a finished block to open.
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });

  const width = useTransform(smooth, [0.05, 0.75], ["0rem", "23rem"]);
  const opacity = useTransform(smooth, [0.05, 0.3, 0.75], [0, 0.25, 1]);

  return (
    /* The negative BOTTOM margin is the same empty half at the other end.
       When the track is spent the pane parks with its bottom on the track's
       bottom — and the pane's lower half is empty, so 226px of nothing sat
       between the cards and whatever came next. Added to the section's own
       100px and the following section's 100px, the seam under this block
       measured 426px where every other seam on the page is 200px.

       It costs the pin nothing: the track keeps its full 220vh of scroll and
       the sticky range is unchanged — a negative margin only shortens the
       space the track takes in FLOW. The 226px it reclaims is the dead half,
       so the section still ends exactly 100px below the cards. */
    <div ref={track} className="lg:-mb-[calc((100svh-28rem)/2)] lg:h-[220vh]">
      {/* The pane is a full `100svh` centring a 28rem block, so the moment it
          pins, the four cards are dead centre of the screen and the split opens
          from there. Left alone that also buys ~200px of dead air under the
          head, because the pane's own top half is empty and it begins in flow
          directly below the heading.

          The negative margin is exactly that empty half — `(100svh - 28rem)/2`,
          the block's height being fixed by the media's `min-h-[28rem]`. It
          lifts the pane so the cards start just under the head, and it costs
          the centring nothing: a margin moves the flow position, and the pinned
          position is `top: 0` regardless. Scrolling from there, the cards ride
          up until the pane's top reaches the viewport top — which is the frame
          where they are centred — and stop.

          The lifted pane now overlaps the head, so it passes pointer events
          through and the row inside takes them back; otherwise an invisible box
          would sit over the heading eating selection and hover. */}
      <div className="pointer-events-none lg:sticky lg:top-0 lg:-mt-[calc((100svh-28rem)/2)] lg:flex lg:h-svh lg:items-center">
        <div className="pointer-events-auto grid w-full gap-5 lg:flex lg:items-stretch lg:gap-5">
          <ul className="grid gap-5 sm:grid-cols-2 lg:flex-1 lg:grid-cols-1">{left}</ul>

          <motion.div
            style={reduce ? undefined : { ["--split-w" as string]: width, opacity }}
            className="overflow-hidden rounded-lg lg:w-[var(--split-w)] lg:shrink-0 lg:opacity-100"
          >
            {media}
          </motion.div>

          <ul className="grid gap-5 sm:grid-cols-2 lg:flex-1 lg:grid-cols-1">{right}</ul>
        </div>
      </div>
    </div>
  );
}
