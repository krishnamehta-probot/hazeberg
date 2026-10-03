import type { CSSProperties } from "react";
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
 * 1440x780, 1536x730 and 1920x950, leave the tightest opener (Extend at
 * 1280x650, two paragraphs of three lines and an outcome that wraps) 14px to
 * spare, About 58px or more (its six figures on one row, 2026-10-03) and every
 * other module page more — and Extend still
 * 14px if every line of text were 4% wider, its long lines having wrapped
 * already. The headline's ceiling went from 8svh to 7.5svh on 2026-10-02 for
 * exactly that page; it had 7.5px. Change a value here and redo that
 * arithmetic; do not eyeball it.
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
 * **2026-10-03: the asides show from lg, a tablet held landscape.** They were
 * xl only, because from 1024 to 1279 a 44rem column leaves 256-490px beside
 * it. Now an opener with an aside lets its measure give way there instead —
 * `min(44rem, content - 24rem)`, 36rem at 1024 — and is exactly 44rem from a
 * 1152px window, so nothing from xl up moved: the five laptop and desktop
 * sizes above measure identical, rect for rect. The edge is written once, on
 * the section (`--hero-copy-w`, `--hero-copy`; see `COPY_EDGE`), and the
 * column and all three asides read it. Measured in the browser, not by
 * arithmetic, at 1024x768, 1080x810, 1112x834, 1133x744, 1180x820 and
 * 1194x834: every opener is exactly the screen, the tightest (Financials at
 * 1024x768) 31.9px to spare and About 66px or more; every aside sits
 * 23px or more right of the column box, 69px or more below the header and
 * 70px or more above the rail (a pointed globe disc's name, shown only while
 * it is pointed at, comes to 21px). Portrait tablets, under lg, are unchanged
 * and have no aside. Those six sizes are the screens, and Safari's bars take
 * 70-80px of each, so the real first screens were measured too — 1024x690,
 * 1080x740, 1133x674, 1180x750 and 1194x764: every opener is the screen, the
 * tightest (Payroll, Financials and Integrations at 1024x690) 14.6px to
 * spare, and the asides 23px or more off the column, 35px or more below the
 * header and 36px or more above the rail. Two lg-only tweaks buy that, both
 * beside an aside only: the pill-and-link row (see the copy) and
 * `FIT_NARROW_LEAD`, without which Financials ran 14px past a 1024x694
 * screen.
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
      lines; a two-sentence one (About's) wants `24ch`, which the column's
      measure caps on its own at large sizes — so it can never reach an
      `aside`. */
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
      (`--hero-top` to `--hero-pad`), never from the viewport alone, and place
      it from the copy's edge (`--hero-copy`, `--hero-copy-w`), never from a
      44rem of its own: passing one narrows the column from lg so the aside
      always has 24rem beside it. Shown from lg; under it the copy takes the
      frame. */
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
      portrait tablets (under lg) keep growing with the copy rather than
      clipping it — no client copy is ever dropped. */
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
  const leadClass = fit && aside ? `${t.lead} ${FIT_NARROW_LEAD}` : t.lead;
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
        <p className={`${t.leadGap} ${leadClass} text-on-panel/75`}>{lead}</p>
      </SoftRise>
      {leadSecond ? (
        <SoftRise delay={0.42}>
          <p className={`${t.leadSecondGap} ${leadClass} text-on-panel/75`}>{leadSecond}</p>
        </SoftRise>
      ) : null}
      {cta ? (
        <SoftRise delay={0.5}>
          {/* Beside an aside, from lg to xl, the measure can be as narrow as
              36rem (576px). The pill and link sit 20px apart there rather
              than 32, which keeps AMS's pair (547px of the two) on one line
              at 1024; the three that cannot fit (Payroll, Integrations and
              Financials, 581-641px) wrap, and the second line costs 4px of
              gap rather than 16 — the link's own 44px box still stands its
              text ~18px off the pill. From xl nothing wraps: the widest
              pair is 673px with its 32px gap, in 704. */}
          <div
            className={`${t.ctaGap} flex flex-wrap items-center gap-x-8 gap-y-4 ${
              aside ? "lg:max-xl:gap-x-5 lg:max-xl:gap-y-1" : ""
            }`}
          >
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
          /* One row from lg, however many figures there are: a column per
             figure (`--cells`), so About's six sit on one hairline instead
             of wrapping four and two, which took a whole row of the first
             screen. Below lg, three up when the count divides by three
             (sm and wider) and two up otherwise, so no row is left with one
             figure in it. */
          <ul
            style={{ "--cells": stats.length } as CSSProperties}
            className={`grid grid-cols-2 gap-x-5 gap-y-5 border-white/12 ${
              stats.length % 3 === 0 ? "sm:grid-cols-3" : ""
            } lg:grid-cols-[repeat(var(--cells),minmax(0,1fr))] lg:gap-x-8 lg:border-t`}
          >
            {stats.map((row, i) => (
              <li key={row.label} className={cell}>
                <SoftRise delay={rowDelay + i * 0.07} className={cellBody}>
                  <span aria-hidden className={`${tick} bg-on-panel/45`} />
                  {/* The figure is heard as one word, "5M", not as the
                      counter's number and suffix in two runs ("5 M"). The
                      label is balanced, so a two-line one breaks evenly:
                      "Combined years of / Workday experience", not a lone
                      "experience" under four words. */}
                  <p className="text-3xl leading-none font-light tracking-[-0.03em] text-on-panel tabular-nums">
                    <span aria-hidden>
                      <Counter value={row.value} suffix={row.suffix} immediate />
                    </span>
                    <span className="sr-only">{`${row.value}${row.suffix ?? ""}`}</span>
                  </p>
                  <p className="mt-2 text-xs text-balance text-on-panel/65">{row.label}</p>
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
      className={`relative isolate overflow-hidden bg-void text-on-panel ${COPY_EDGE} ${
        aside ? COPY_NARROW : ""
      } ${
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
              <div className="my-auto max-w-[var(--hero-copy-w)]">{copy}</div>
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
            <div className="max-w-[var(--hero-copy-w)]">
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
    the headline is `text-4xl`'s own clamp with a `7.5svh` ceiling added, so
    wherever the screen is tall for its width — 854px or more, or a phone held
    upright — it is `text-4xl` exactly. The paragraphs' 34.5rem is 56ch at
    16px give or take 5px, and sets What we do's two paragraphs on the same
    breaks as before; at 15px it holds ~60ch, which is what saves Financials a
    line on a short screen. */
const FIT = {
  h1Size: "text-[length:clamp(2.5rem,min(1.7rem_+_3vw,7.5svh),4rem)]",
  h1Gap: "mt-[clamp(0.875rem,2.8svh,1.5rem)]",
  lead: "max-w-[34.5rem] text-[length:clamp(0.9375rem,2.3svh,1rem)] leading-normal",
  leadGap: "mt-[clamp(1rem,3.2svh,1.75rem)]",
  leadSecondGap: "mt-[clamp(0.625rem,1.8svh,1rem)]",
  ctaGap: "mt-[clamp(1.5rem,4.4svh,2.5rem)]",
} as const;

/** `fit` beside an aside, from lg to xl: the paragraphs reach 16px at 744px
    of height rather than 696. The column is narrower there and the screens
    are a tablet's in Safari, whose bars leave a 9.7" iPad ~690px: at 1024
    wide, Financials' second paragraph goes to four lines once it passes
    ~15.9px, which `2.3svh` did from 692px up — 14px past the screen at 694,
    4px at 710. At `2.15svh` it holds three lines to 740px, and every page at
    1024 wide keeps 14.6px or more spare from 690px to 768 (measured). From
    744px up — every tablet's whole screen — it is 16px as before; from xl
    it does not apply. */
const FIT_NARROW_LEAD = "lg:max-xl:text-[length:clamp(0.9375rem,2.15svh,1rem)]";

/** The copy's edge, written once. The section is the inline-size container,
    so `100cqw` is the frame's width wherever these are read (the window less
    any classic scrollbar, which `vw` would count); `min(100cqw, 82.5rem) - 2
    gutters` is the shell's content width, and `82.5rem` is
    `--container-shell`.
      --hero-copy-w  the copy column's measure: 44rem
      --hero-copy    its right edge, from the frame's left: the shell's
                     content edge plus the measure
    The column reads the first; every aside places and sizes itself from one
    or the other, never from a 44rem of its own. */
const COPY_EDGE =
  "[container-type:inline-size] [--hero-copy-w:44rem] [--hero-copy:calc(max(var(--gutter),(100cqw_-_82.5rem)/2_+_var(--gutter))_+_var(--hero-copy-w))]";

/** With an aside, from lg: the measure gives way where the frame is short of
    room, `min(44rem, content - 24rem)`, so the aside always has 24rem (384px)
    beside the copy. It is exactly 44rem from 68rem of content, a 1152px
    window — so from xl, where the asides were solved first, nothing moves —
    and 36rem (576px) at 1024, a tablet held landscape. 24rem is the smallest
    room that keeps the dial's stages 44px deep: 360px of dial at 1024, where
    44px needs 344. */
const COPY_NARROW =
  "lg:[--hero-copy-w:min(44rem,calc(min(100cqw,82.5rem)_-_2_*_var(--gutter)_-_24rem))]";

/** The opener as it flows when it is not holding to one screen. */
const FLOW = {
  h1Size: "text-4xl",
  h1Gap: "mt-6",
  lead: "max-w-[56ch] text-base",
  leadGap: "mt-7",
  leadSecondGap: "mt-4",
  ctaGap: "mt-10",
} as const;
