"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { Button, Eyebrow, Reveal, Stars } from "@/components/v2/kit";
import { V2_HERO, V2_LOGOS } from "@/lib/v2/content";

/**
 * The hero, to the comp: copy left, a photograph right, and a testimonial
 * card overlapping the photograph's lower edge.
 *
 * It is a two-column block on a white page, not a full-bleed picture — which
 * means the headline sits on flat `--canvas` and measures 16.9:1 with nothing
 * to check. The only decoration is `.v2-wash`, two corner washes at 8% and 6%
 * that are fully transparent long before the copy column.
 *
 * The comp's proportion is roughly 6:5 in favour of the copy, and the media
 * column is deliberately allowed to run past the shell's right edge on wide
 * screens — that overhang is what stops the section reading as two boxes side
 * by side.
 *
 * Motion is restrained on purpose. Everything above the fold animates on
 * MOUNT rather than on scroll, in one 0.42s cascade: eyebrow, the two
 * headline lines, the lead, the controls, then the media and its card. The
 * trigger line sits a fifth of the way up the viewport, so a scroll-driven
 * reveal here would leave the controls invisible until the reader scrolled
 * past their own hero.
 */

/** Three real client marks in discs, in place of the comp's avatar cluster.
    Stock faces next to "trusted by" would be the one invented thing on the
    page; these are marks the client supplied. */
const PROOF_MARKS = ["novartis.svg", "chevron.svg", "ups.svg"] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  /* A short, slow drift on the media only — 40px over the whole section. Any
     more and the photograph visibly slides away from the card pinned to it. */
  const mediaY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={ref} className="v2-wash relative overflow-hidden">
      <div className="v2-shell grid items-center gap-12 pt-[calc(var(--v2-nav-h)+4.5rem)] pb-[var(--v2-section-y)] lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-[calc(var(--v2-nav-h)+5.5rem)]">
        <div>
          <Reveal immediate>
            <Eyebrow>{V2_HERO.eyebrow}</Eyebrow>
          </Reveal>

          {/*
            Two authored lines, not one wrapped string. The comp breaks after
            "expertise." at every width, and a heading that re-breaks on its
            own loses the comp's proportions the moment the viewport changes.

            Weight 600 and -0.035em. The site's display rule is large-and-light
            and this is the one place v2 departs from it: the comp's hero is
            visibly the heaviest type on the page, and it is what makes the
            layout read as corporate rather than editorial. Every heading below
            it goes back to weight 400.
          */}
          <h1 className="mt-5 max-w-[15ch] v2-h1 text-ink">
            <Reveal immediate delay={0.06} as="span" className="block">
              {V2_HERO.titleA}
            </Reveal>{" "}
            <Reveal immediate delay={0.14} as="span" className="block">
              {V2_HERO.titleB}
            </Reveal>
          </h1>

          <Reveal immediate delay={0.22}>
            <p className="mt-6 max-w-[54ch] text-sm text-ink-muted">{V2_HERO.lead}</p>
          </Reveal>

          <Reveal immediate delay={0.28}>
            <p className="mt-4 text-sm font-medium text-ink">{V2_HERO.kicker}</p>
          </Reveal>

          <Reveal immediate delay={0.36}>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Button href={V2_HERO.cta.href}>{V2_HERO.cta.label}</Button>

              <div className="flex items-center gap-3">
                <ul className="flex items-center">
                  {PROOF_MARKS.map((file, i) => {
                    const mark = V2_LOGOS.items.find((l) => l.file === file);
                    return (
                      <li
                        key={file}
                        /* Overlapped, and each disc paints its own white so
                           the one behind is genuinely occluded rather than
                           showing through. */
                        className="-ml-2.5 grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-border bg-canvas first:ml-0"
                        style={{ zIndex: PROOF_MARKS.length - i }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`${V2_LOGOS.dir}/${file}`}
                          alt={mark?.name ?? ""}
                          className="w-auto opacity-70"
                          style={{ height: `calc(0.85rem * ${mark?.scale ?? 1})` }}
                        />
                      </li>
                    );
                  })}
                </ul>
                <p className="max-w-[12ch] font-mono text-[0.6875rem] leading-tight tracking-caps text-ink-subtle uppercase">
                  {V2_HERO.trust}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* The media column. `lg:-mr-*` lets it run past the shell's right
            edge on wide screens, which is the comp's composition — a picture
            that touches the frame reads as a window, one that stops short
            reads as a thumbnail. */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 0.97 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={reduce ? undefined : { y: mediaY }}
          className="relative lg:-mr-[max(0px,calc((100vw-var(--v2-shell))/2))]"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--v2-radius-media)] bg-surface sm:aspect-[16/10] lg:aspect-[4/3]">
            <Image
              src={V2_HERO.media.src}
              alt={V2_HERO.media.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="object-cover"
            />
          </div>

          {/*
            The testimonial card. Overlaps the photograph's foot on desktop and
            drops BELOW it under `sm` — at 390px an overlapping card covers
            two thirds of the picture it is supposed to be endorsing.

            It carries its own opaque white, so the quote measures against the
            card and not against whatever pixel of the photograph is behind it.
          */}
          <motion.figure
            initial={reduce ? undefined : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="v2-card mx-auto -mt-8 w-[min(22rem,100%)] p-5 shadow-[var(--v2-shadow-lift)] sm:absolute sm:right-5 sm:bottom-5 sm:mt-0 lg:right-6 lg:bottom-6"
          >
            <Stars count={V2_HERO.quote.stars} />
            <blockquote className="mt-3 text-sm leading-relaxed text-ink">
              {V2_HERO.quote.body}
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3 border-t border-border pt-4">
              <span
                aria-hidden
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-[0.625rem] font-semibold text-primary-ink"
              >
                F5
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-medium text-ink">
                  {V2_HERO.quote.name}
                </span>
                <span className="block truncate text-xs text-ink-subtle">
                  {V2_HERO.quote.role}
                </span>
              </span>
            </figcaption>
          </motion.figure>
        </motion.div>
      </div>
    </section>
  );
}
