"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { VIEWPORT } from "@/components/motion/reveal";
import type { AboutPhoto } from "@/lib/about-photos";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * How much wider than its frame the photograph is drawn. The frame is 4:5 and
 * the file is 3:2, so `object-cover` fits the height and the picture runs
 * 1.5 / 0.8 = 1.875 frame-widths across, of which the frame shows 53%.
 * `sizes` has to ask for THAT width, not the frame's: a srcset candidate
 * picked for the frame alone is stretched 1.9x across it, and a face is the
 * first thing a soft upscale shows on.
 */
const COVER = 1.875;

/** The picture's own aspect: once the frame is held short, the drawn width is
    the frame's height times this. */
const PHOTO_RATIO = 1.5;

/** From lg the frame is also capped by the screen: `100svh` less the header
    (6.75rem from md) and a 2rem margin at each end. */
const HELD_H = "(100vh - 10.75rem)";

/**
 * The width the picture is drawn at from lg, for a column `col` wide: 1.875
 * columns while the frame is a full 4:5, falling to the held height times 1.5
 * on a short screen (a 1366 x 657 laptop draws it 727px across, not 1,088),
 * and never below the column itself.
 */
const held = (col: string) =>
  `min(calc(${col} * ${COVER}), max(${col}, calc(${HELD_H} * ${PHOTO_RATIO})))`;

/**
 * `sizes` for the portrait, solved from the section's own grid
 * (`founder-note.tsx`):
 *
 *   xl, shell capped  half of 1320px less the 2rem gutters and the 6rem gap:
 *                     a 580px column
 *   xl                (100vw - 4rem gutters - 6rem gap) / 2
 *   lg                (100vw - 4rem gutters - 4rem gap) * 5/12
 *   below lg          the column (100vw less two 1.25rem gutters), capped at
 *                     the frame's 28rem, times `COVER`; no height cap there
 */
const PORTRAIT_SIZES = [
  `(min-width: 1320px) ${held("580px")}`,
  `(min-width: 1280px) ${held("((100vw - 10rem) * 0.5)")}`,
  `(min-width: 1024px) ${held(`((100vw - 8rem) * ${(5 / 12).toFixed(5)})`)}`,
  `min(calc((100vw - 2.5rem) * ${COVER}), ${28 * COVER}rem)`,
].join(", ");

/**
 * Sakthi's portrait, cropped from the owner's landscape office photograph to a
 * tall frame round him.
 *
 * The crop is solved, not eyeballed, from the file's own pixels. The file is
 * 1536 x 1024; his face runs 46-58% across (midline 51.6%, the eyes at 49.3%
 * and 53.6%), his hair starts 6% down, his eyes sit at 19.5% and his chin at
 * about 32%. A 4:5 frame over a 3:2 picture shows 53% of its width, so an
 * `object-position` of 53% across puts the window at 24.7-78.1% of the
 * picture and his face at 50.4% of the frame: on its center line. (48%, the
 * first guess, set it at 55.5%, 32px off center at 1440.)
 * Vertically nothing is cropped while the frame is narrower than the
 * picture's own 3:2 — including when the desktop frame is held short by the
 * screen (580 x 485 at 1366 x 657) — so the 10% only acts in a window under
 * about 560px tall. There it takes a tenth of the overflow off the top and
 * the rest off the body, so his hair stays in and his eyes stay near a third
 * of the way down (26% at 1366 x 400; 30% would have cut his hair and put his
 * eyes at 12%).
 *
 * The frame is the same on a phone and a desktop: 4:5, full column width,
 * capped at 28rem below lg so a tablet does not get a portrait a screen tall.
 * From lg it is the sticky column and is also capped by the screen's own
 * height, less the header and a 2rem margin at each end, so it never runs
 * under the bottom of the window while it holds.
 *
 * One gesture, on top of the section's ordinary `Reveal`: the photograph
 * settles from 8% over-scale to its frame as it arrives, slowly, the way a
 * print is laid down rather than slid in. Reduced motion: the same two states
 * with no transition between them, so the server's first frame (over-scale,
 * which only ever crops a little more) matches the first client render.
 */
export function FounderPortrait({ photo, className = "" }: { photo: AboutPhoto; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div
      className={`relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-surface-2 ${className}`}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={VIEWPORT}
        transition={reduce ? { duration: 0 } : { duration: 1.6, ease: EASE }}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={PORTRAIT_SIZES}
          placeholder="blur"
          blurDataURL={photo.blur}
          className="object-cover object-[53%_10%]"
        />
      </motion.div>
    </div>
  );
}
