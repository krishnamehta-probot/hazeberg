"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { Plus } from "lucide-react";

import { RevealItem } from "@/components/motion/reveal";
import { CASE_STUDIES } from "@/lib/home-content";

type Item = (typeof CASE_STUDIES)["items"][number];

function Label({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`font-mono text-[0.625rem] tracking-caps uppercase ${
        dark ? "text-on-panel/55" : "text-ink-subtle"
      }`}
    >
      {children}
    </p>
  );
}

/**
 * A use case, as a card that TURNS OVER rather than one that grows.
 *
 * The expanding version pushed the card from 530px to 920px, which moved
 * everything under it and left you scrolling to read what you had just opened —
 * on a phone the panel opened below the fold of its own card. So the card no
 * longer changes size at all.
 *
 * Both faces live in the SAME grid cell and cross-fade. The taller of the two is
 * what sets the card height, and it sets it whether the card is open or shut —
 * so opening one moves nothing, and the back never has to scroll inside itself.
 * Both are MOUNTED at all times for the same reason: rendered only while open,
 * the back could not set the height of a closed card and the section still grew
 * by 212px the moment one was pressed.
 * Laying the back over the top with `absolute inset-0` looked equivalent and was
 * not: it could not influence the height, and on a 390px card it needed 656px
 * inside a 455px box.
 *
 * The back is deliberately a different object, not the same card with more text
 * in it: the photograph goes, the ground turns to the brand's dark panel and the
 * type inverts. In a row of three white cards the open one is unmistakable from
 * across the page, and it costs no layout to say so.
 *
 * **Nothing here links out**, because there is no case-study page. The card is
 * the whole record.
 */
/**
 * Every title reads "<what we did> with <what we did it in>", and that "with" is
 * the line break. Left to wrap, it landed wherever the measure happened to run
 * out — a different word on each card and a different word again at each width.
 * Broken here it is the same two lines everywhere, which is what lets the rule
 * underneath sit at one height across all three.
 */
function Title({ title }: { title: string }) {
  const at = title.lastIndexOf(" with ");
  if (at < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, at)}
      <br />
      {title.slice(at + 1)}
    </>
  );
}

export function CaseCard({ item, image }: { item: Item; image: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    /* A snap target on a phone, a grid cell from sm. `shrink-0` plus a width is
       what stops flex squeezing three cards into one screen instead of letting
       them scroll. `self-stretch` is what makes the three the same rectangle:
       in the flex strip `h-full` resolves against an auto-height container and
       does nothing, and the cards came out 656/604/560. */
    <RevealItem as="li" className="relative w-[88%] shrink-0 snap-start self-stretch [perspective:1400px] sm:w-auto sm:shrink">
      <article
        style={{ transform: open ? "rotateY(180deg)" : undefined }}
        className="group/c relative grid h-full grid-cols-1 transition-transform duration-500 ease-brand [transform-style:preserve-3d]"
      >
        {/* -- the face, and the height ------------------------------------- */}
        <div
          aria-hidden={open}
          className={`col-start-1 row-start-1 flex flex-col overflow-hidden rounded-xl bg-canvas ring-1 ring-border [backface-visibility:hidden] ${
            open ? "pointer-events-none" : ""
          }`}
        >
          {/* `flex-1`, not a fixed ratio. The card is as tall as its BACK
              wherever the back is taller, and the photograph is what absorbs the
              difference — otherwise the front ends in dead white space. */}
          {/* Fixed ratio, NOT flex-1. Absorbing the card's slack here made the
              band a different height on every card — 225, 204 and 184px — which
              is what put the BUSINESS IMPACT rule at three different heights.
              The slack goes under the list now, where nothing is aligned to it. */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-2">
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 1023px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 ease-brand group-hover/c:scale-[1.03]"
            />
            <span className="absolute top-3 left-3 rounded-pill bg-void/80 px-2.5 py-1 font-mono text-[0.625rem] tracking-caps text-white uppercase backdrop-blur-md">
              Use case {item.n}
            </span>
          </div>

          <div className="flex flex-1 flex-col p-5">
            {/* Two lines, on every card, at every width.

                It ran 2/3/2 and that is what put the BUSINESS IMPACT rule at a
                different height on each one. Three things fixed it, and each was
                measured: the `max-w-[24ch]` came off (197px of measure for a
                67-character title), the size steps 13/14/16 so the longest one
                still breaks in two at the narrowest card, and `min-h` holds the
                box at two lines whether the title fills them or not.

                NOT `text-balance`. It optimises for even line LENGTHS, not for
                the fewest lines, and it was choosing three short lines over two
                full ones. Greedy wrapping gives the minimum every time. */}
            <h3 className="min-h-[2.75em] text-[0.8125rem] leading-snug font-medium text-ink sm:text-sm lg:text-base">
              <Title title={item.title} />
            </h3>

            <div className="mt-5">
              <Label>Business impact</Label>
            </div>
            {/* One line per point — which is why there is no bullet.

                The longest of the nine needs 354px at 12px, and the card gives
                345 with a dot and a gap in front of it. The dot was the 12px.
                Below a full-width laptop card there is no arrangement that fits:
                at 768px the measure is 282px and the sentence still needs 354.
                It wraps there, on all three cards equally, and the rule above it
                stays put because the rule is not downstream of the wrapping. */}
            <ul className="mt-3 space-y-1.5 border-t border-border pt-4">
              {item.impact.map((o) => (
                <li key={o} className="flex gap-2 text-xs leading-[1.7] text-ink-muted">
                  <span aria-hidden className="mt-[0.55rem] size-1 shrink-0 rounded-pill bg-primary" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* -- the back: same cell, always mounted, hidden by opacity ------- */}
        <div
          id={panelId}
          aria-hidden={!open}
          /* Top-aligned, and the top is the CLOSE BUTTON's top — `pt-4 sm:pt-5`
             are that button's own insets. It used to clear the button with
             `pt-14` and then centre what was left, which is why the three backs
             began at three different heights: the shortest card centred its
             shorter column lower down. Start them all at the same line and the
             three read as one row. */
          className={`col-start-1 row-start-1 flex flex-col overflow-hidden rounded-xl bg-void px-5 pt-4 pb-5 ring-1 ring-white/10 [backface-visibility:hidden] [transform:rotateY(180deg)] sm:pt-5 ${
            open ? "" : "pointer-events-none"
          }`}
        >
          <p className="font-mono text-[0.625rem] tracking-caps text-accent uppercase">
            Use case {item.n}
          </p>
          {/* Clears the close button by starting BELOW it, not by narrowing to
              its left. `mt-10 sm:mt-7` puts the first line clear of the button's
              lower edge (it runs 16-60px on a phone, 20-56 from sm).

              Reserving the room on the right instead cost a line: only card 02's
              title is long enough to reach the button, and taking 44px off the
              measure to protect against it wrapped that one title onto a third
              line on every screen — which then carried its BUSINESS CHALLENGE
              rule 22px below the other two. Full measure keeps all three at the
              two lines the front face is built around. The eyebrow above still
              sits level with the button; it is far too short to reach it. */}
          <h3 className="mt-10 min-h-[2.75em] text-[0.8125rem] leading-snug font-medium text-on-panel sm:mt-7 sm:text-sm lg:text-base">
            <Title title={item.title} />
          </h3>

          {/* `flex-1` so this group owns the card's slack — without it the
              `mt-auto` below has no free space to absorb and the chips float
              wherever the prose happens to end. */}
          <div className="mt-5 flex flex-1 flex-col gap-4 border-t border-white/12 pt-4">
            <div>
              <Label dark>Business challenge</Label>
              <p className="mt-1.5 text-sm text-on-panel/70">{item.challenge}</p>
            </div>
            <div>
              <Label dark>Hazeberg approach</Label>
              <p className="mt-1.5 text-sm text-on-panel/70">{item.approach}</p>
            </div>
            {/* On the floor of the card, always. The two paragraphs above it
                run to different lengths on each card, so in normal flow the
                chips started at a different height on every one. */}
            <div className="mt-auto">
              <Label dark>Capabilities delivered</Label>
              {/* The client wrote these pipe-separated on one line. As chips they
                  are scannable and they wrap; as a sentence they read as more
                  prose under two paragraphs of it. */}
              {/* Rows RESERVED, not grown into: three below lg, two from there.
                  The chips are pinned to the foot, so a card that needs an extra
                  row pushes its label up and the three stop lining up. */}
              {/* Three reserves, not two. `lg` is where the grid goes to three
                  columns, and between 1024 and 1280 that column is narrow
                  enough that two of the three cards need a THIRD row of chips —
                  58px reserved only the two, so those two overflowed it and the
                  odd one out kept its label 30px lower. `xl` is where the
                  columns are wide enough for two rows again. */}
              <ul className="mt-2 flex min-h-[5.625rem] flex-wrap content-start gap-1.5 lg:min-h-[5.5rem] xl:min-h-[3.625rem]">
                {item.capabilities.map((c) => (
                  <li
                    key={c}
                    className="rounded-pill bg-white/10 px-2.5 py-1 text-xs font-medium text-on-panel ring-1 ring-white/12"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </article>

      {/* -- the one control, above both faces ----------------------------- */}
      {/* Wrapped, and the WRAPPER is what carries the position.

          `.spec` sets `position: relative`, and it is declared after Tailwind's
          utilities in the same cascade layer — so on the same element it
          quietly beats `absolute`. The button ended up at the card's left edge
          and 44px below its foot, and the click landed on the section behind
          it. Positioning the parent instead means the two never argue.

          Top right, on the photograph, rather than anywhere measured off the
          image band: that band is `aspect-[16/9]` of the card's WIDTH, so any
          percentage of the card's HEIGHT lands somewhere different at every
          breakpoint. */}
      <span className="absolute top-4 right-4 z-10 sm:top-5 sm:right-5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Escape" && open) {
              e.stopPropagation();
              setOpen(false);
            }
          }}
          aria-expanded={open}
          aria-controls={panelId}
          data-spec
          /* 44px on a phone, 36 from sm. A finger needs the 44; a pointer does
             not, and the card is tighter without it. */
          className={`spec disc-blue grid size-11 cursor-pointer place-items-center rounded-pill text-white sm:size-9 ${
            open ? "rotate-45" : ""
          }`}
        >
          <span className="sr-only">
            {open ? "Hide the challenge and approach for" : "Show the challenge and approach for"}{" "}
            {item.title}
          </span>
          <Plus aria-hidden className="size-4" strokeWidth={2} />
        </button>
      </span>

    </RevealItem>
  );
}
