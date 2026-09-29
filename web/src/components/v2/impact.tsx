"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { Button, Eyebrow, Reveal, RevealGroup, RevealItem } from "@/components/v2/kit";
import { V2_IMPACT } from "@/lib/v2/content";

/**
 * Impact: a centred head over a photograph and a 2x2 grid of cards.
 *
 * The grid is one bordered box divided by hairlines, not four separate cards.
 * The comp draws it that way and it matters — four shadowed cards next to a
 * single large photograph makes the photograph look like a fifth card, where
 * one divided panel reads as the photograph's counterweight.
 *
 * `gap-px` over a `bg-border` parent is how the hairlines are drawn: the gaps
 * between the cells show the parent through, so the rules are exactly 1px at
 * every zoom level and there is no double-border where two cells meet.
 *
 * The cards carry the copy document's four figures, as the main home page
 * does. An earlier cut dropped them because the comp shows title and body
 * only; they are back because the two versions run the same copy.
 *
 * No `source` line, and none invented. The previous four figures were all
 * traceable to one engagement; `home-content.ts` dropped the attribution when
 * the client replaced them, because carrying the old source forward would
 * attribute new figures to a client who never stated them.
 *
 * The amber-toned figures are set in #8A6600, not #FEC00F. The brand yellow
 * measures 1.65:1 on white and cannot be a word on this ground under any
 * circumstances; #8A6600 is the same hue darkened to 5.3:1, which can. The
 * yellow itself stays where it belongs on this page — the icon's 16% wash
 * behind it, and the tag on the photograph.
 *
 * The client's note on the source document stands either way: confirm each
 * result against approved documentation before launch.
 */

export function Impact() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  /* The photograph drifts inside its own frame rather than moving the frame:
     scale 1.08 with a 5% travel, which never exposes an edge. */
  const imageY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section id="impact" className="relative bg-canvas">
      <div className="v2-shell v2-section">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <Eyebrow center>{V2_IMPACT.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 max-w-[24ch] v2-h2 text-balance text-ink">
              {V2_IMPACT.titleLead}{" "}
              <br />
              {V2_IMPACT.titleRest}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-[58ch] text-sm text-balance text-ink-muted">
              {V2_IMPACT.body}
            </p>
          </Reveal>
          <Reveal delay={0.18} className="mt-8">
            <Button href={V2_IMPACT.cta.href}>{V2_IMPACT.cta.label}</Button>
          </Reveal>
        </div>

        <div ref={ref} className="mt-14 grid gap-5 lg:grid-cols-2 lg:gap-6">
          <Reveal className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--v2-radius-media)] bg-surface lg:h-full lg:aspect-auto lg:min-h-[28rem]">
              <motion.div
                style={reduce ? undefined : { y: imageY }}
                className="absolute inset-0 scale-[1.08]"
              >
                <Image
                  src={V2_IMPACT.media.src}
                  alt={V2_IMPACT.media.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 46vw"
                  className="object-cover"
                />
              </motion.div>
              {/* The amber tag. A FILL carrying near-black at 10.8:1 — the
                  yellow is the ground, never the word. */}
              <span className="absolute top-4 left-4 rounded-pill bg-accent px-3 py-1.5 font-mono text-[0.625rem] tracking-caps text-accent-ink uppercase">
                {V2_IMPACT.media.tag}
              </span>
            </div>
          </Reveal>

          <RevealGroup
            as="ul"
            className="grid gap-px overflow-hidden rounded-[var(--v2-radius-media)] border border-border bg-[var(--border)] sm:grid-cols-2"
          >
            {V2_IMPACT.cards.map((card) => (
              <RevealItem
                as="li"
                key={card.title}
                className="group flex flex-col gap-4 bg-canvas p-6 transition-colors duration-500 hover:bg-surface lg:p-7"
              >
                <span
                  aria-hidden
                  className={`grid h-10 w-10 place-items-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 ${
                    card.tone === "accent"
                      ? "bg-[rgb(254_192_15/0.16)] text-[#8a6600]"
                      : "bg-[rgb(25_114_185/0.1)] text-primary"
                  }`}
                >
                  {/* One glyph, rotated per tone. A second icon set for four
                      cards would be four more files to keep in step. */}
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 13.5 7.5 9l3.5 3.5L17 6" />
                    <path d="M12.5 6H17v4.5" />
                  </svg>
                </span>
                <span>
                  {/* The figure, its label, and its SOURCE. The source is not
                      decoration: three of these four come from one
                      engagement, and printed bare they would read as
                      Hazeberg's averages, which the copy document does not
                      claim. Spreading the attribution needs more approved
                      case data. */}
                  <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <span
                      className={`text-2xl leading-none font-semibold tracking-[-0.03em] ${
                        card.tone === "accent" ? "text-[#8a6600]" : "text-primary"
                      }`}
                    >
                      {card.stat}
                    </span>
                    <span className="text-xs text-ink-muted">{card.statLabel}</span>
                  </span>
                  <span className="mt-4 block text-base font-semibold tracking-[-0.01em] text-ink">
                    {card.title}
                  </span>
                  <span className="mt-2 block text-sm text-ink-muted">{card.body}</span>
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
