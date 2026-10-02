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
 * **2026-10-02: every inner-page opener is exactly the first screen, and the
 * rail holds the facts.** The module pages and About had grown a screen and a
 * half tall: headline, two paragraphs, buttons AND a four-up strip, all stacked
 * in one 44rem column. `fit` is now what every inner page passes, the two
 * legal documents excepted (`legal-page.tsx`): their reader came for the text
 * under the opener, so they keep the short flowing one. The section is one
 * screen (`min-h-svh`, never a clipping `h-svh`): the copy is centred in the
 * band between the header and the rail, and the rail — outcomes, stats or
 * meta, whichever the page has — is pinned to the foot of the screen at the
 * shell's full width, so the tallest block left the copy column instead of
 * being squeezed inside it. Type and gaps are height-aware (`svh` terms in
 * every clamp), so the same rules set a 1280x650 laptop and a 1920x950 desktop
 * without a breakpoint. The clamps were solved, not tuned: line counts from
 * the served Manrope's own shaped advance widths, at 1280x650, 1366x657,
 * 1440x780, 1536x730 and 1920x950, leave the tightest opener (About at
 * 1280x650) 22px to spare and every module page at least 30px (Financials,
 * same screen) — and still 22px if every line of text were 4% wider. Change a
 * value here and redo that arithmetic; do not eyeball it.
 *
 * Moving the rail to full width moved it into the light, which breaks the
 * guarantee above for its right half. `.hero-rail-scrim` is the answer: the
 * void rising under the rail and fading out above its hairline, so the arc
 * resolves into a floor rather than running under the smallest type again.
 * The band above the rail is a positioned box of its own, and an `aside` is
 * laid out inside it — so a dial or a map sized from that box cannot reach
 * the rail, by construction. `--hero-top` and `--hero-pad` (set on the section)
 * are the band's two margins; the copy and the asides read the same two.
 *
 * The arrivals are not the site's standard 64px fade-up. That reveal is right
 * for blocks of content and wrong for display type — see `mask-reveal.tsx`. The
 * headline is uncovered behind a hard edge; everything under it resolves out of
 * a short blur, the rail last, one cell at a time. Both are off entirely under
 * `prefers-reduced-motion`.
 */
export function PageHero({
  eyebrow,
  title,
  titleMax = "max-w-[20ch]",
  lead,
  leadSecond,
  meta,
  stats,
  statsLabel,
  outcomes,
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
  /** The headline's measure. `20ch` sets the one-sentence headlines in two
      lines; a two-sentence one (About's) wants `24ch`, which the 44rem column
      caps on its own at large sizes — so it can never reach an `aside`. */
  titleMax?: string;
  lead: string;
  /** A second paragraph, where the client's copy has one. Kept separate rather
      than joined: their break is a break, and two sentences run together read as
      one long one. */
  leadSecond?: string;
  meta?: { label: string; value: string }[];
  /** Figures that count up as the page lands — the alternative to `meta` for a
      page whose facts are numbers. Same row, same measure, bigger type. */
  stats?: readonly { value: number; suffix?: string; label: string }[];
  /** A small mono heading over `stats`, where the copy names the row (About's
      "The scale behind Hazeberg"). */
  statsLabel?: string;
  /** What changes, in words rather than numbers — the module pages' outcome
      strip. Each cell is a short claim over its one-line explanation, marked by
      a short amber tick on the rail's hairline (amber is legal here: 11.97:1 on
      this ground). */
  outcomes?: readonly { title: string; label: string }[];
  /** An opener that asks for something — the white pill, because this ground
      is dark. */
  cta?: { label: string; href: string };
  /** A quieter second action beside the pill. A text link, not a second pill:
      the frame keeps one filled call to action. An in-page `#` target gets a
      plain anchor (Lenis carries it) and an arrow pointing down, which is where
      it goes. */
  secondary?: { label: string; href: string };
  /** Something that lives in the light, right of the copy. Laid out in the
      band above the rail, over the copy's box and after it in the DOM, so it is
      on top for the pointer and after the CTAs for the keyboard; it must keep
      `pointer-events-none` on its own empty space. Size it from the band
      (`--hero-top` to `--hero-pad`), never from the viewport alone. */
  aside?: React.ReactNode;
  /** `light` is the inner pages' arc. `space` is a still star field with a
      soft glow on the right, for an opener whose `aside` is its own light
      source — a globe in front of the arc is two suns. `glow` is the same air
      without the stars, for an aside that is itself a field of points (About's
      dotted map): dots under a star field are two skies. */
  backdrop?: "light" | "space" | "glow";
  /** Exactly the first screen: copy centred between the header and the rail,
      the rail pinned to the foot, type and gaps scaled by the viewport's
      height. Every inner page but the legal documents passes it. Phones and
      tablets keep growing with the copy rather than clipping it — no client
      copy is ever dropped. */
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

  /* The two scales. `fit` swaps every fixed step for a clamp with an `svh`
     term, so a short laptop screen tightens the column instead of pushing the
     rail off it. Each one reaches the old fixed value by ~900px of height:
     on a tall screen the two modes set the same page. */
  const t = fit ? FIT : FLOW;
  const rowDelay = cta ? 0.58 : 0.5;

  const copy = (
    <>
      <SoftRise>
        <Eyebrow tone="onDark">{eyebrow}</Eyebrow>
      </SoftRise>

      {/* The mask wears the headline's size so its descender room is
          measured in the headline's em, not the page's 16px. */}
      <MaskReveal as="div" delay={0.12} className={t.h1Size}>
        <h1
          className={`${t.h1Gap} ${titleMax} ${t.h1Size} leading-[1.04] font-light tracking-[-0.025em] text-balance`}
        >
          {title}
        </h1>
      </MaskReveal>

      <SoftRise delay={0.34}>
        <p className={`${t.leadGap} ${t.lead} text-on-panel/75`}>{lead}</p>
      </SoftRise>
      {leadSecond ? (
        <SoftRise delay={0.42}>
          <p className={`${t.leadSecondGap} ${t.lead} text-on-panel/75`}>{leadSecond}</p>
        </SoftRise>
      ) : null}
      {cta ? (
        <SoftRise delay={0.5}>
          <div className={`${t.ctaGap} flex flex-wrap items-center gap-x-8 gap-y-4`}>
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
    </>
  );

  /* The facts. One rail whichever kind the page has: a hairline with a tick
     at the start of every cell, and each cell landing on it in turn. Under lg
     the cells wrap two up, so each carries its own length of hairline; from lg
     it is one line across the shell. */
  const cell = "border-t border-white/12 lg:border-t-0";
  const cellBody = "relative pt-4 lg:pt-[clamp(1rem,2.2svh,1.5rem)]";
  const tick = "absolute -top-px left-0 h-0.5 w-6 rounded-pill";
  const facts =
    outcomes?.length || stats?.length || meta?.length ? (
      <>
        {stats?.length && statsLabel ? (
          <SoftRise delay={cta ? 0.54 : 0.46}>
            <p className="mb-3 font-mono text-[0.6875rem] tracking-caps text-on-panel/55 uppercase">
              {statsLabel}
            </p>
          </SoftRise>
        ) : null}

        {outcomes?.length ? (
          <ul className="grid grid-cols-2 gap-x-5 gap-y-5 border-white/12 lg:grid-cols-4 lg:gap-x-8 lg:border-t">
            {outcomes.map((row, i) => (
              <li key={row.title} className={cell}>
                <SoftRise delay={rowDelay + i * 0.07} className={cellBody}>
                  <span aria-hidden className={`${tick} bg-accent`} />
                  <p className="text-base leading-snug font-normal text-balance text-on-panel">
                    {row.title}
                  </p>
                  <p className="mt-1 text-xs text-on-panel/65">{row.label}</p>
                </SoftRise>
              </li>
            ))}
          </ul>
        ) : null}

        {stats?.length ? (
          <ul className="grid grid-cols-2 gap-x-5 gap-y-5 border-white/12 lg:grid-cols-4 lg:gap-x-8 lg:border-t">
            {stats.map((row, i) => (
              <li key={row.label} className={cell}>
                <SoftRise delay={rowDelay + i * 0.07} className={cellBody}>
                  <span aria-hidden className={`${tick} bg-on-panel/45`} />
                  <p className="text-3xl leading-none font-light tracking-[-0.03em] text-on-panel tabular-nums">
                    <Counter value={row.value} suffix={row.suffix} immediate />
                  </p>
                  <p className="mt-2 text-xs text-on-panel/65">{row.label}</p>
                </SoftRise>
              </li>
            ))}
          </ul>
        ) : null}

        {meta?.length ? (
          /* Two up on a phone, three across from sm. Each cell arrives on its
             own beat: a row of facts that lands as one slab is a row nobody
             reads the second item of. */
          <ul className="grid grid-cols-2 gap-x-5 gap-y-5 border-white/12 sm:grid-cols-3 lg:gap-x-8 lg:border-t">
            {meta.map((row, i) => (
              <li key={row.label} className={cell}>
                <SoftRise delay={rowDelay + i * 0.07} className={cellBody}>
                  <span aria-hidden className={`${tick} bg-on-panel/45`} />
                  <p className="font-mono text-[0.6875rem] tracking-caps text-on-panel/55 uppercase">
                    {row.label}
                  </p>
                  <p className="mt-2 text-sm text-on-panel">{row.value}</p>
                </SoftRise>
              </li>
            ))}
          </ul>
        ) : null}
      </>
    ) : null;

  return (
    <section
      data-nav-dark
      className={`relative isolate overflow-hidden bg-void text-on-panel ${
        fit
          ? "flex min-h-svh flex-col [--hero-pad:clamp(1.25rem,3svh,2.5rem)] [--hero-top:calc(var(--header-h)_+_var(--hero-pad))]"
          : "[--hero-pad:calc(var(--section-y)_+_1rem)] [--hero-top:calc(var(--header-h)_+_7rem)]"
      }`}
    >
      {backdrop === "space" || backdrop === "glow" ? (
        <>
          <div aria-hidden className="space-glow absolute inset-0" />
          {backdrop === "space" ? (
            <StarField className="star-mask absolute inset-0 h-full w-full" />
          ) : null}
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

      {fit ? (
        <>
          {/* The band: everything above the rail. It grows to fill what the
              rail leaves of the screen, the copy centres in it, and the aside
              is positioned in it — so nothing in here can reach the rail. Over
              the rail's scrim (z-10), so that never darkens a button. */}
          <div className="relative z-10 flex flex-1 flex-col">
            <div className="shell flex flex-1 flex-col pt-[calc(var(--header-h)_+_1.5rem)] pb-8 lg:pt-[var(--hero-top)] lg:pb-[var(--hero-pad)]">
              {/* One measure for everything, so nothing in this block can
                  reach the part of the frame the arc is in. */}
              <div className="my-auto max-w-[44rem]">{copy}</div>
            </div>
            {aside}
          </div>

          {facts ? (
            <div className="relative">
              <div aria-hidden className="hero-rail-scrim pointer-events-none absolute inset-x-0 -top-16 bottom-0" />
              <div className="relative shell pb-[clamp(1.25rem,3.2svh,2.5rem)]">{facts}</div>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="relative shell pt-[calc(var(--header-h)_+_5rem)] pb-[calc(var(--section-y)_+_1rem)] lg:pt-[calc(var(--header-h)_+_7rem)]">
            <div className="max-w-[44rem]">
              {copy}
              {facts ? <div className="mt-14">{facts}</div> : null}
            </div>
          </div>
          {aside}
        </>
      )}
    </section>
  );
}

/** `fit`: height-aware. Every step is `clamp(floor, svh, the FLOW value)`;
    the headline is `text-4xl`'s own clamp with an `8svh` ceiling added, so
    wherever the screen is tall for its width — 800px or more, or a phone held
    upright — it is `text-4xl` exactly. The paragraphs' 34.5rem is 56ch at
    16px give or take 5px, and sets What we do's two paragraphs on the same
    breaks as before; at 15px it holds ~60ch, which is what saves Financials a
    line on a short screen. */
const FIT = {
  h1Size: "text-[length:clamp(2.5rem,min(1.7rem_+_3vw,8svh),4rem)]",
  h1Gap: "mt-[clamp(0.875rem,2.8svh,1.5rem)]",
  lead: "max-w-[34.5rem] text-[length:clamp(0.9375rem,2.3svh,1rem)] leading-normal",
  leadGap: "mt-[clamp(1rem,3.2svh,1.75rem)]",
  leadSecondGap: "mt-[clamp(0.625rem,1.8svh,1rem)]",
  ctaGap: "mt-[clamp(1.5rem,4.4svh,2.5rem)]",
} as const;

/** The opener as it flows when it is not holding to one screen. */
const FLOW = {
  h1Size: "text-4xl",
  h1Gap: "mt-6",
  lead: "max-w-[56ch] text-base",
  leadGap: "mt-7",
  leadSecondGap: "mt-4",
  ctaGap: "mt-10",
} as const;
