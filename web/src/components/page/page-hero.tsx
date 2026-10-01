import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";

import { ApertureGlow } from "@/components/motion/aperture-glow";
import { MaskReveal, SoftRise } from "@/components/motion/mask-reveal";
import { StarField } from "@/components/motion/star-field";
import { Counter } from "@/components/ui/counter";
import { CtaPill } from "@/components/ui/cta-pill";
import { Eyebrow } from "@/components/ui/section";

/**
 * The opener the inner pages share.
 *
 * It is the home page's light, not a different one — and not the home page's
 * picture either. The horizon there is the bottom of an enormous circle rising
 * out of the foot of the frame; this is the left edge of an enormous circle
 * standing off the right of it. Same shader family, same blue -> pale -> amber
 * ramp, same pointer response. One shape turned ninety degrees.
 *
 * Two earlier versions were wrong in opposite directions and both are worth
 * recording, because the fix is the thing between them:
 *
 *   1. the home arc, reused verbatim. It sweeps the WHOLE frame, which is right
 *      for a hero carrying one centred sentence and wrong for one carrying a
 *      headline, two paragraphs and a rail of facts. Measured on `/contact`, the
 *      crest ran straight through the meta rail: the brightest part of the
 *      picture sat under the smallest type on the page.
 *   2. three CSS blooms. They cleared the type, and they were scenery — a
 *      gradient any template ships with. Solving the overlap by removing the
 *      light is not solving it.
 *
 * What this does instead is put the light somewhere it structurally cannot
 * reach the words. The arc's bleed is asymmetric by a factor of nearly four: it
 * carries into the circle, off to the right, and dies almost immediately going
 * the other way, towards the copy. The copy would have to move to break it.
 * `.page-scrim` under the type column is the second, independent guarantee, and
 * `.page-grid` gives the void some structure so the frame is not half a picture
 * and half an empty field.
 *
 * The arrivals are not the site's standard 64px fade-up. That reveal is right
 * for blocks of content and wrong for display type — see `mask-reveal.tsx`. The
 * headline is uncovered behind a hard edge; everything under it resolves out of
 * a short blur. Both are off entirely under `prefers-reduced-motion`.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  leadSecond,
  meta,
  stats,
  cta,
  secondary,
  aside,
  backdrop = "light",
  fit = false,
}: {
  eyebrow: string;
  /** A node, not a string: every one of these pages breaks its own headline and
      carries the brand amber on the second half — the one ground on the site
      where yellow is allowed to be type (11.97:1 here, 1.65:1 on white). */
  title: React.ReactNode;
  lead: string;
  /** A second paragraph, where the client's copy has one. Kept separate rather
      than joined: their break is a break, and two sentences run together read as
      one long one. */
  leadSecond?: string;
  meta?: { label: string; value: string }[];
  /** Figures that count up as the page lands — the alternative to `meta` for a
      page whose facts are numbers. Same row, same measure, bigger type. */
  stats?: readonly { value: number; suffix?: string; label: string }[];
  /** An opener that asks for something — the white pill, because this ground
      is dark. */
  cta?: { label: string; href: string };
  /** A quieter second action beside the pill. A text link, not a second pill:
      the frame keeps one filled call to action. An in-page `#` target gets a
      plain anchor (Lenis carries it) and an arrow pointing down, which is where
      it goes. */
  secondary?: { label: string; href: string };
  /** Something that lives in the light, right of the copy. Laid over the
      copy's box and after it in the DOM, so it is on top for the pointer and
      after the CTAs for the keyboard; it must keep `pointer-events-none` on
      its own empty space. */
  aside?: React.ReactNode;
  /** `light` is the inner pages' arc. `space` is a still star field with a
      soft glow on the right, for an opener whose `aside` is its own light
      source — a globe in front of the arc is two suns. */
  backdrop?: "light" | "space";
  /** Exactly the first screen: the full viewport tall from lg, the copy
      centred in what the header leaves. Phones keep growing with the copy
      rather than clipping it. */
  fit?: boolean;
}) {
  const jump = secondary?.href.startsWith("#");
  const secondaryClass =
    "group/s inline-flex min-h-11 items-center gap-2.5 font-mono text-xs tracking-caps text-on-panel/80 uppercase transition-colors dur-base ease-brand hover:text-on-panel";
  const SecondaryArrow = jump ? ArrowDown : ArrowRight;
  const secondaryArrow = (
    <SecondaryArrow
      aria-hidden
      className={`size-4 transition-transform dur-base ease-brand ${
        jump ? "group-hover/s:translate-y-0.5" : "group-hover/s:translate-x-0.5"
      }`}
      strokeWidth={2}
    />
  );

  return (
    <section
      data-nav-dark
      className={`relative isolate overflow-hidden bg-void text-on-panel ${
        fit ? "min-h-svh lg:flex lg:h-svh lg:min-h-[40rem] lg:flex-col lg:justify-center" : ""
      }`}
    >
      {backdrop === "space" ? (
        <>
          <div aria-hidden className="space-glow absolute inset-0" />
          <StarField className="star-mask absolute inset-0 h-full w-full" />
        </>
      ) : (
        <>
          <ApertureGlow className="absolute inset-0 h-full w-full" />

          {/* Structure over the light. The grid is masked towards the arc, so
              it reads as the surface the light is falling on rather than as a
              sheet laid over the top of it. */}
          <div aria-hidden className="page-grid absolute inset-0" />
        </>
      )}

      {/* The type's ground, guaranteed independently of the shader. */}
      <div aria-hidden className="page-scrim absolute inset-0" />

      <div
        className={`relative shell pt-[calc(var(--header-h)+5rem)] pb-[calc(var(--section-y)+1rem)] ${
          fit ? "lg:pt-[var(--header-h)] lg:pb-0" : "lg:pt-[calc(var(--header-h)+7rem)]"
        }`}
      >
        {/* One measure for everything, so nothing in this block can reach the
            part of the frame the arc is in. */}
        <div className="max-w-[44rem]">
          <SoftRise>
            <Eyebrow tone="onDark">{eyebrow}</Eyebrow>
          </SoftRise>

          {/* The mask wears the headline's size so its descender room is
              measured in the headline's em, not the page's 16px. */}
          <MaskReveal as="div" delay={0.12} className="text-4xl">
            <h1 className="mt-6 max-w-[20ch] text-4xl leading-[1.04] font-light tracking-[-0.025em] text-balance">
              {title}
            </h1>
          </MaskReveal>

          <SoftRise delay={0.34}>
            <p className="mt-7 max-w-[56ch] text-base text-on-panel/75">{lead}</p>
          </SoftRise>
          {leadSecond ? (
            <SoftRise delay={0.42}>
              <p className="mt-4 max-w-[56ch] text-base text-on-panel/75">{leadSecond}</p>
            </SoftRise>
          ) : null}
          {cta ? (
            <SoftRise delay={0.5}>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <CtaPill href={cta.href} tone="light">
                  {cta.label}
                </CtaPill>
                {secondary ? (
                  jump ? (
                    <a href={secondary.href} className={secondaryClass}>
                      {secondary.label}
                      {secondaryArrow}
                    </a>
                  ) : (
                    <Link href={secondary.href} className={secondaryClass}>
                      {secondary.label}
                      {secondaryArrow}
                    </Link>
                  )
                ) : null}
              </div>
            </SoftRise>
          ) : null}

          {stats?.length ? (
            <ul className="mt-14 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-white/12 pt-7 sm:grid-cols-4">
              {stats.map((row, i) => (
                <li key={row.label}>
                  <SoftRise delay={(cta ? 0.58 : 0.5) + i * 0.07}>
                    <p className="text-3xl leading-none font-light tracking-[-0.03em] text-on-panel tabular-nums">
                      <Counter value={row.value} suffix={row.suffix} immediate />
                    </p>
                    <p className="mt-3 max-w-[18ch] text-xs text-on-panel/65">{row.label}</p>
                  </SoftRise>
                </li>
              ))}
            </ul>
          ) : null}

          {meta?.length ? (
            /* A row under the copy, not a rail beside it. Two up on a phone,
               three across from sm — and inside the same measure as everything
               above it, which is what makes the no-overlap guarantee a fact of
               the layout rather than a number somebody tuned.

               Each cell arrives on its own beat. A row of facts that lands as
               one slab is a row nobody reads the second item of. */
            <ul className="mt-14 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/12 pt-7 sm:grid-cols-3">
              {meta.map((row, i) => (
                <li key={row.label}>
                  <SoftRise delay={(cta ? 0.58 : 0.5) + i * 0.07}>
                    <p className="font-mono text-[0.6875rem] tracking-caps text-on-panel/55 uppercase">
                      {row.label}
                    </p>
                    <p className="mt-2 text-sm text-on-panel">{row.value}</p>
                  </SoftRise>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {aside}
    </section>
  );
}
