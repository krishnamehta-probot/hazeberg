"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Plus } from "lucide-react";

import { RevealItem } from "@/components/motion/reveal";
import { Counter } from "@/components/ui/counter";
import { CASE_STUDIES } from "@/lib/home-content";

type Item = (typeof CASE_STUDIES)["items"][number];

function Tag({ children, tone = "primary" }: { children: React.ReactNode; tone?: "accent" | "primary" }) {
  return (
    <span
      className={`inline-block rounded-pill px-3 py-1.5 font-mono text-[0.6875rem] tracking-caps uppercase ${
        tone === "accent" ? "bg-accent text-accent-ink" : "grad-primary text-primary-ink"
      }`}
    >
      {children}
    </span>
  );
}

/**
 * The outcomes are written as sentences — "40% reduction in HR processing time",
 * "Approximately $500K in annual savings" — and the figure at the front of each
 * is the part worth enlarging. Parsing it at the display layer rather than
 * splitting the copy into fields keeps the client's strings exactly as they
 * wrote them, and the three that carry no figure at all ("Improved compliance
 * tracking") simply fall through to the plain branch.
 */
const FIGURE = /^(?:Approximately\s+)?(\$?)(\d+)(%|K)?\s+(.+)$/;

function Outcome({ text }: { text: string }) {
  const m = FIGURE.exec(text);

  if (!m) {
    return (
      <li className="flex gap-2.5 text-sm text-white/75">
        <span aria-hidden className="mt-[0.45rem] size-1.5 shrink-0 rounded-pill bg-accent" />
        <span>{text}</span>
      </li>
    );
  }

  const [, prefix, digits, unit, rest] = m;
  return (
    <li>
      {/* Yellow is a fill-only colour on the light ground — 1.65:1 as type there.
          Here it reads: the bar deepens to black/92-78 when the card opens, so
          even with a blown-out white photograph underneath, #FEC00F measures
          11.2:1 at the foot of the panel and 7.1:1 at its lightest point. */}
      <span className="block text-2xl leading-none font-light tracking-[-0.03em] text-accent tabular-nums">
        {prefix}
        <Counter value={Number(digits)} suffix={unit ?? ""} immediate />
      </span>
      <span className="mt-2 block text-sm text-white/75">{rest}</span>
    </li>
  );
}

/**
 * The reference does NOT split these into image-beside-text. Each card is
 * image-dominant with a frosted bar floating over its foot: tag chip top-left,
 * title, one line of body, and ONE control on the right — a + that opens the
 * card. It used to be a View pill that navigated away instead, sitting where
 * the reader expects the thing that opens what they are looking at.
 *
 * On top of that, the card opens. Two things in the content had nowhere to go —
 * `challenge`, which is the before of every one of these stories, and `client`,
 * which says who it was for — and the outcomes were three small chips when they
 * are the entire point of the section. Open the card and the chips are replaced
 * by the challenge and by the same three outcomes at full size, their figures
 * counting up as the panel lands.
 *
 * It is a click, deliberately, not a scroll: the results section above already
 * spends a 220vh pin and the impact scene is scroll-driven, so a third
 * scroll-jacked block would read as the same trick three times.
 *
 * The card does not use a fixed aspect-ratio box any more. Image, proportion
 * spacer and content are stacked in ONE grid cell, so the cell is as tall as
 * whichever is taller: closed, that is the spacer and the card keeps its
 * original proportions exactly; open, the bar outgrows it and the card grows
 * with it rather than clipping the panel against `overflow-hidden`.
 */
export function CaseCard({ item, image, wide }: { item: Item; image: string; wide: boolean }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const panelId = useId();

  const swap = reduce
    ? { initial: false as const, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: "auto" as const },
        exit: { opacity: 0, height: 0 },
      };

  return (
    <RevealItem as="li" className={wide ? "lg:col-span-2" : ""}>
      <article
        onKeyDown={(e) => {
          if (e.key === "Escape" && open) {
            e.stopPropagation();
            setOpen(false);
          }
        }}
        /* `grid-cols-1` is load-bearing, not tidiness. A bare `grid` gets one
           IMPLICIT column, and an implicit column is sized to max-content — so
           the card grew to whatever its widest descendant wanted and came out
           1201px wide inside a 390px phone, dragging 831px of horizontal scroll
           onto the whole document. `grid-cols-1` is repeat(1, minmax(0, 1fr)),
           which is the same single column with a floor of zero. */
        className={`group/c relative isolate grid grid-cols-1 overflow-hidden rounded-2xl ring-1 transition-shadow dur-base ease-brand ${
          open ? "ring-accent/45 shadow-2xl shadow-accent/10" : "ring-transparent"
        }`}
      >
        <Image
          src={image}
          alt=""
          fill
          sizes={wide ? "100vw" : "(max-width: 1023px) 100vw, 45vw"}
          className={`-z-10 object-cover transition-transform duration-700 ease-brand ${
            open ? "scale-[1.05]" : "group-hover/c:scale-[1.03]"
          }`}
        />

        {/* Holds the closed card's proportions. Purely a spacer — the photograph
            behind it is `fill`, so nothing depends on this box for its size. */}
        <div aria-hidden className={`col-start-1 row-start-1 ${wide ? "aspect-[16/9]" : "aspect-[4/3.4]"}`} />

        {/* Shares the one grid cell with everything else, so it needs to let
            clicks through — it paints above the toggle button. */}
        <span className="pointer-events-none col-start-1 row-start-1 z-20 m-5 self-start justify-self-start">
          <Tag tone={wide ? "accent" : "primary"}>{item.tag.split(" / ")[0]}</Tag>
        </span>

        <div className="col-start-1 row-start-1 flex flex-col p-3 md:p-4">
          {/* The photograph is a shortcut, not the control.
              It carries `aria-hidden` and `tabIndex={-1}` deliberately: the real
              control is the + in the bar below, and a second button doing the
              identical job would appear twice in the accessibility tree and
              twice in the tab order for one behaviour. This way a pointer can
              hit the whole picture and a keyboard hits one thing.

              `min-h` is a floor for the photograph. Without it the bar simply
              eats the picture when it opens — `flex-1` shrinks and a 1256px-wide
              card is left with a 107px strip of image. With the floor the card
              grows instead, which is the right trade. */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen((v) => !v)}
            className="min-h-[9rem] flex-1 cursor-pointer rounded-xl md:min-h-[11rem]"
          />

          {/* the frosted bar — sits ON the image, never below it */}
          <div
            className={`rounded-xl bg-gradient-to-t p-6 backdrop-blur-2xl transition-colors dur-base ease-brand md:p-7 ${
              open ? "from-black/92 to-black/78" : "from-black/80 to-black/55"
            }`}
          >
            <div className="flex items-start justify-between gap-5">
              <div className="min-w-0">
                <h3 className="max-w-[22ch] text-xl leading-tight font-medium text-balance text-white">
                  {item.title}
                </h3>
                <p className="mt-2.5 max-w-[52ch] text-sm text-white/80">{item.did}</p>
              </div>

              {/* One control, in the bar, next to the words it opens.
                  It replaces a View pill that went to a page instead of opening
                  the card — two different jobs sharing one slot, and the one
                  that reads as primary was the one that left. The link to the
                  full study now lives at the foot of the panel, which is where
                  someone who has just read the detail is looking.

                  Plus to cross by rotation, not by swapping glyphs: the same
                  strokes move, so the state change is one object turning rather
                  than one icon being replaced by another. */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={panelId}
                data-spec
                className={`spec grid size-11 shrink-0 cursor-pointer place-items-center rounded-pill bg-white/12 text-white backdrop-blur-md hover:bg-white/22 ${
                  open ? "rotate-45" : ""
                }`}
              >
                <span className="sr-only">
                  {open
                    ? "Hide the challenge and full results for"
                    : "Show the challenge and full results for"}{" "}
                  {item.title}
                </span>
                <Plus aria-hidden className="size-4" strokeWidth={2} />
              </button>
            </div>

            {/* Chips and panel are the same three outcomes at two densities, so
                they swap rather than stack. `mode="wait"` runs the collapse
                before the expand — two heights animating at once on the same
                box is what makes this kind of swap jump. */}
            <div id={panelId} className="overflow-hidden">
              <AnimatePresence initial={false} mode="wait">
                {open ? (
                  <motion.div
                    key="detail"
                    {...swap}
                    transition={{ duration: reduce ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="mt-6 border-t border-white/15 pt-6">
                      <p className="font-mono text-[0.6875rem] tracking-caps text-accent uppercase">
                        The challenge · {item.client}
                      </p>
                      <p className="mt-3 max-w-[62ch] text-sm text-white/80">{item.challenge}</p>

                      <ul className="mt-7 grid gap-6 sm:grid-cols-3">
                        {item.outcomes.map((o) => (
                          <Outcome key={o} text={o} />
                        ))}
                      </ul>

                      {/* The page is still there, it is just no longer competing
                          with the toggle for the same slot. Here it is the last
                          thing in the panel, read after the challenge and the
                          figures — which is the only point at which anyone has
                          a reason to want more of this story. A text link, not
                          a pill: it is a way out of the card, not a call to
                          action, and the section has its own CTA already. */}
                      <Link
                        href={CASE_STUDIES.cta.href}
                        aria-label={CASE_STUDIES.cta.label + ": " + item.title}
                        className="group/r mt-8 inline-flex items-center gap-2 font-mono text-xs tracking-caps text-white uppercase underline decoration-white/30 underline-offset-[6px] transition-colors dur-fast ease-brand hover:decoration-white"
                      >
                        {CASE_STUDIES.cta.label}
                        <ArrowUpRight
                          aria-hidden
                          className="size-3.5 transition-transform dur-fast ease-brand group-hover/r:translate-x-0.5 group-hover/r:-translate-y-0.5"
                          strokeWidth={2}
                        />
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="chips"
                    {...swap}
                    transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {item.outcomes.map((o) => (
                        <li
                          key={o}
                          className="rounded-pill bg-white/12 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/15"
                        >
                          {o}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </article>
    </RevealItem>
  );
}
