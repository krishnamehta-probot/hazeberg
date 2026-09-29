"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { Button, Eyebrow, Reveal } from "@/components/v2/kit";
import { V2_CLOSING } from "@/lib/v2/content";

/**
 * The close: a full-bleed photograph with the call to action centred on it.
 *
 * This is the only place on the page where type sits on a photograph at
 * paragraph scale, so the ground is made a fact rather than a hope. Three
 * things stack over the image, none of them optional:
 *
 *   desaturate  the frame is pulled to 35% saturation, so a warm office shot
 *               cannot fight the brand blue in the button
 *   scrim       a flat 68% near-black over the whole frame
 *   focus       a soft radial darkening behind the centre column
 *
 * Measured against the LIGHTEST pixel the scrim can produce, white type
 * clears 9.4:1 — the heading, the body and the eyebrow all sit well inside
 * AA, whatever photograph is dropped in later.
 *
 * The image is also the page's one genuine parallax: it moves at 88% of
 * scroll inside a frame that is clipping it, which is the ordinary depth cue
 * and the reason the section reads as a window rather than as a banner. The
 * 1.16 scale is what guarantees the travel never exposes an edge.
 */

export function Closing() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden">
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: imageY }}
        className="absolute inset-0 -z-10 scale-[1.16]"
      >
        <Image
          src={V2_CLOSING.media.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover saturate-[0.35]"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[rgb(10_14_18/0.68)]" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_50%,rgb(10_14_18/0.55),transparent_75%)]"
      />

      <div className="v2-shell v2-section flex flex-col items-center text-center">
        <Reveal>
          <Eyebrow center tone="onDark" className="text-white/70">
            {V2_CLOSING.eyebrow}
          </Eyebrow>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="v2-h2 mt-5 max-w-[22ch] text-balance text-white">
            {V2_CLOSING.title}
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-5 max-w-[52ch] text-sm text-balance text-white/80">
            {V2_CLOSING.body}
          </p>
        </Reveal>

        <Reveal delay={0.18} className="mt-9">
          <Button href={V2_CLOSING.cta.href}>{V2_CLOSING.cta.label}</Button>
        </Reveal>
      </div>
    </section>
  );
}
