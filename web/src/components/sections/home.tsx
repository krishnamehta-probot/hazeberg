import Image from "next/image";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { CtaPill } from "@/components/ui/cta-pill";
import { HorizonGlow } from "@/components/motion/horizon-glow";
import { AboutScene } from "@/components/sections/about-scene";
import { ImpactScene } from "@/components/sections/impact-scene";
import { ModelsJourney } from "@/components/sections/models-journey";
import { ServicesSection } from "@/components/sections/services-section";
import { ResultsSplit } from "@/components/sections/results-split";
import { CaseCard } from "@/components/sections/case-card";
import { Carousel } from "@/components/ui/carousel";
import { Eyebrow, Section, SectionHead } from "@/components/ui/section";
import { LOGOS } from "@/lib/home-content";
import type {
  HomeAbout,
  HomeCapability,
  HomeCaseStudies,
  HomeClosing,
  HomeHero,
  HomeImpact,
  HomeModels,
  HomeResults,
  HomeServices,
  HomeTestimonials,
} from "@/lib/home/types";

/* ---------------------------------------------------------------------------
   Shared furniture
   ---------------------------------------------------------------------------
   `Section`, `Eyebrow` and `SectionHead` now live in `components/ui/section.tsx`
   — Contact and Careers need the same three, and a second copy of a section
   heading is how pages built weeks apart drift apart (rule 3).

   Built against `REFERENCE-SPEC.md`. The reference alternates its ground
   surface -> canvas -> ink with no rules between sections: the ground change
   IS the separator. Section padding lives on the inner container.

   Every section takes its content as a prop. `app/page.tsx` fetches it — from
   Sanity when the CMS is configured, from `lib/home/fallback.ts` when it is
   not — so nothing in this file knows where the words came from. The one
   exception is the client logo rail, which stays in code: see `LogoRail`.

   The photographs live with the content now (`lib/home/fallback.ts` and the
   CMS). The ones in /public/comp are COMP ONLY — pulled from the reference so
   the page reads finished, and replaced before launch per rule 8.
--------------------------------------------------------------------------- */

/* ============================== 01 — HERO ============================== */

/**
 * Full-bleed hero on a measured image.
 *
 * `hero-desktop.png` was sampled before anything was built: across the left 46%
 * where the type sits, the DARKEST pixel still returns 6.6:1 against near-black
 * ink, and the upper left returns 8.6:1. So the headline is ink, not white, and
 * there is no scrim — white type would measure 1.0:1 on that ground and vanish.
 *
 * The block is anchored to the FOOT of the section rather than placed at a
 * percentage down it. At 1366x768 a 44%-from-top block leaves ~430px for an
 * eyebrow, three lines of display, two paragraphs and a button, and clips.
 * Anchored, a short viewport just moves the whole block up.
 *
 * Mobile is a different structure, not a crop: a band of the portrait cut at the
 * top, then the type on solid ground beneath it. A tall centre-crop of the
 * desktop frame puts type over the walking figure's black coat, which measures
 * 1.14:1 — unreadable. The band sidesteps it and keeps ink type in both layouts.
 */
/**
 * The proof line that closes the hero. Five marks, not seventeen: this is a
 * glance, and the full roster is the section directly below it.
 *
 * `brightness-0 invert` flattens each mark to solid white. The files are already
 * knocked out — the opaque canvas around them was flood-filled away — but they
 * still carry their own brand colours, and five different coloured logos on a
 * near-black ground is a fruit salad. Flattening them is what every reference
 * does, and it is also the only treatment that survives a dark ground without
 * measuring each mark individually.
 */
/** One pass of the rail. Rendered more than once so the loop has something to
    run into; `aria-hidden` on the copies keeps it to one announcement.

    The marks are the one piece of the home page that is NOT in the CMS. Each
    file is pre-processed (fills forced white, knockouts forced to `--void`) and
    its size is measured by `scripts/inkscale.mjs`; an upload field would accept
    a logo that is invisible on this band, at a size nobody measured. */
function LogoRail({ hidden = false }: { hidden?: boolean }) {
  return (
    /* Fixed height, centred. Some of these viewBoxes are far taller than the
       mark inside them, and a row sized by its tallest CHILD is a row sized by
       whichever file happened to have the most padding. The boxes overflow this
       and the clip takes the empty space, not the logo. */
    <ul aria-hidden={hidden || undefined} className="flex h-11 shrink-0 items-center">
      {LOGOS.items.map((logo) => (
        <li key={logo.file} className="shrink-0 px-7 sm:px-10">
          {/* A plain img, not next/image: these are vectors, so there is nothing
              for the optimiser to do and `fill` would only force a wrapper with
              a fixed box around thirteen very different aspect ratios.

              Height, not `transform: scale`. A transform leaves the layout box
              at its unscaled size, so a mark pulled back to half size still
              reserved full-size space and the rail's rhythm fell apart. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/clients/${logo.file}`}
            alt={hidden ? "" : logo.name}
            className="w-auto opacity-60 transition-opacity dur-base ease-brand hover:opacity-100"
            style={{ height: `calc(var(--rail-h) * ${logo.scale})` }}
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * The proof that closes the hero — a rolling rail, and the only place client
 * marks appear on the page now.
 *
 * A solid band, not a transparent overlay. The light behind it moves, so
 * anything see-through here is a contrast bug waiting for the arc to drift under
 * it; the reference ends its glow above the strip for the same reason.
 *
 * The rail is rendered twice per half. A -50% loop only reads as continuous
 * while one half is at least as wide as the screen; two passes of thirteen marks
 * is 4394px, which clears an ultrawide with room over. Three passes worked too
 * and cost twenty-six more elements for nothing.
 *
 * Both edges are masked rather than boxed: the marks fade into the band instead
 * of being clipped by a visible container.
 */
const RAIL_PASSES = 2;

function HeroTrust({ trust }: { trust: string }) {
  return (
    <div className="relative border-t border-white/10 bg-void pt-6 pb-6 lg:flex lg:items-center lg:gap-9 lg:py-5 lg:pl-[var(--gutter)]">
      {/* The divider lives on the label, not on the rail beside it: the rail
          carries the edge mask, and a mask fades an element's border along with
          everything else in it. */}
      <p className="text-center font-mono text-[0.6875rem] tracking-caps text-on-panel/55 uppercase lg:max-w-[11.5rem] lg:shrink-0 lg:border-r lg:border-white/12 lg:py-1 lg:pr-9 lg:text-left">
        {trust}
      </p>
      <div
        className="mt-5 overflow-hidden lg:mt-0 lg:min-w-0 lg:flex-1"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0, #000 12%, #000 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, #000 12%, #000 88%, transparent 100%)",
        }}
      >
        <div className="marquee-track flex w-max [--rail-h:1.75rem] motion-reduce:animate-none sm:[--rail-h:2.25rem]">
          {Array.from({ length: RAIL_PASSES * 2 }).map((_, i) => (
            <LogoRail key={i} hidden={i > 0} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Hero({ hero }: { hero: HomeHero }) {
  return (
    /* `data-nav-dark` is what tells the header to go light over this section.
       An attribute rather than a prop, because the header is site-wide and has
       no idea what page it is sitting on.
       `min-h-svh` rather than `h-svh`: the block is centred copy PLUS a strip at
       the foot, and on a short phone a fixed height would crush the two into
       each other. This way the screen is the floor, not the ceiling. */
    <section data-nav-dark className="relative isolate flex min-h-svh flex-col bg-void text-on-panel">
      {/* No scroll-driven frame any more. Insetting the hero as you scrolled
          resized the canvas on every single frame, and re-allocating a WebGL
          drawing buffer sixty times a second is what made the arc flicker. */}
      <HorizonGlow clearance={165} className="absolute inset-0 block h-full w-full" />

      <div className="relative flex flex-1 flex-col pt-[calc(var(--header-h)+2rem)]">
        {/* Padding lives on this block, not on the column, so the band below can
            run the full width of the section and sit flush to its foot. */}
        {/* Biased upward, not simply centred. True centring put the button in
            the arc's bloom on shorter laptops — measured at 3px of clear ground
            at 1280x800 — and the fix belongs in the layout rather than in the
            shader, which has a band of its own to clear below it. */}
        <div className="flex flex-1 items-center justify-center px-5 pt-10 pb-16 lg:pb-28">
          <div className="shell flex flex-col items-center text-center">
            <Reveal immediate>
              {/* The second half carries the amber. The span goes to `block` at
                  lg so the break lands where it was drawn; below that the
                  sentence wraps on its own.
                  The space before the amber words is put in HERE, as part of
                  the white run, rather than stored on the end of a field — an
                  editor tidying a trailing space would otherwise have run the
                  two halves into one word. */}
              <h1 className="max-w-[15ch] text-3xl font-light text-balance sm:max-w-[20ch] sm:text-4xl lg:max-w-[34ch]">
                {hero.titleA}{" "}
                <span className="lg:block">
                  {`${hero.titleB} `}
                  <span className="text-accent">{hero.titleAccent}</span>
                </span>
              </h1>
            </Reveal>
            <Reveal immediate delay={0.16}>
              <p className="mt-7 max-w-[54ch] text-base text-on-panel/70">{hero.lead}</p>
            </Reveal>
            <Reveal immediate delay={0.24}>
              <div className="mt-10">
                <CtaPill href={hero.cta.href} tone="light">
                  {hero.cta.label}
                </CtaPill>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal immediate delay={0.32}>
          <HeroTrust trust={hero.trust} />
        </Reveal>
      </div>
    </section>
  );
}

/* ============================= 03 — ABOUT ============================== */

/**
 * One pinned scene rather than a block you scroll past.
 *
 * The whole thing lives in `about-scene.tsx` because it has to be a client
 * component: the pin, the sphere and the checkpoints are all one piece of state.
 * The section here is only the ground it sits on, and it deliberately carries no
 * vertical padding of its own — the scene owns its own rhythm, and a `Section`
 * wrapper's padding would be added on top of a 280vh track.
 */
export function About({ about }: { about: HomeAbout }) {
  return (
    <section id="about" className="relative bg-surface">
      <AboutScene about={about} />
    </section>
  );
}

/* ============================ 04 — IMPACT ============================== */

/**
 * Four strands converging on one point — the section's own heading, drawn.
 *
 * The scene lives in `impact-scene.tsx` because the pin, the curves and the
 * hovered card are one piece of state. This is the ground it sits on, and it is
 * dark: the lines glow, and a glow on a light page is just a pale line.
 *
 * `IMPACT.mediaTag` and the comp photograph are both unused here now. A
 * converging-lines scene has no room for a picture, and the picture was never
 * the argument — the figures are.
 */
export function Impact({ impact }: { impact: HomeImpact }) {
  return (
    <section id="impact" className="relative bg-void text-on-panel" data-nav-dark>
      <ImpactScene impact={impact} />
    </section>
  );
}

/* =========================== 05 — SERVICES ============================= */

/**
 * Two takes on the same seven services, with a temporary switch between them —
 * see `services-section.tsx`. Neither is pinned: Impact above and Results below
 * both are, and three pinned blocks in a row is a page that will not let you
 * past it.
 */
export function Services({ services }: { services: HomeServices }) {
  return <ServicesSection services={services} />;
}

/* ============================ 06 — RESULTS ============================= */

/**
 * Four capabilities as a 2 x 2 block that a photograph splits open on scroll —
 * the layout the client asked for. The mechanics live in `ResultsSplit`; this
 * only supplies the two halves and the media.
 *
 * It was four counters until the revised copy moved those figures up into the
 * heading. The block is unchanged; only what each card carries is.
 */
/**
 * Each card reveals on its own rather than through a RevealGroup. The group
 * wrapper had to be `display: contents` so the cards could be direct children of
 * the split's grid — and an element with no layout box is never reported by
 * IntersectionObserver, so `whileInView` never fired and all four stayed at
 * opacity 0.
 *
 * Colour is carried by the rule and the ground, never by the type. The figure is
 * `--primary` on white — 5.06:1 — on all four, including the amber card, which
 * differs only in its rule and wash: #FEC00F measures 1.65:1 as type here, so a
 * yellow "100%" would be unreadable. The rule and the figure are there at rest;
 * only the wash and the lift wait for a hover, so a touch device that never
 * reports one still gets a coloured section.
 */
/**
 * One fragment of a card's body, set in brand blue.
 *
 * The term is matched rather than marked up in the copy, so the content stays a
 * plain string — which is what lets it come from Sanity later without carrying
 * HTML through the CMS. Blue at 5.06:1 on white, and it is the same colour the
 * figures in this section's heading are in, so the highlight reads as part of
 * that set rather than as a link.
 */
function Highlight({ body, term }: { body: string; term?: string }) {
  if (!term) return <>{body}</>;
  const at = body.indexOf(term);
  if (at === -1) return <>{body}</>;
  return (
    <>
      {body.slice(0, at)}
      <strong className="font-medium text-primary">{term}</strong>
      {body.slice(at + term.length)}
    </>
  );
}

function CapabilityCard({ item, delay }: { item: HomeCapability; delay: number }) {
  const amber = item.tone === "accent";
  return (
    <Reveal
      as="li"
      delay={delay}
      className={`group/stat relative flex flex-col overflow-hidden rounded-lg bg-canvas p-7 ring-1 transition dur-base ease-brand hover:-translate-y-0.5 hover:shadow-lg ${
        amber
          ? "ring-accent/30 hover:shadow-accent/15 hover:ring-accent/60"
          : "ring-border hover:shadow-primary/10 hover:ring-primary/35"
      }`}
    >
      {/* Sits behind the type at 0 opacity and blurs in on hover. `blur-3xl`
          over a pill keeps it a glow rather than a visible disc. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -top-20 -right-16 size-44 rounded-pill opacity-0 blur-3xl transition-opacity dur-slow ease-brand group-hover/stat:opacity-100 ${
          amber ? "bg-accent/45" : "bg-primary/25"
        }`}
      />
      <span
        aria-hidden
        className={`relative h-1 w-10 rounded-pill ${amber ? "grad-cta" : "grad-primary"}`}
      />
      {/* The index, where the counter used to be. It is set small and in the
          mono face rather than at display size: the figures this section used to
          count now open the heading above, and a 40px "01" would pull the eye
          straight back off them. */}
      <span className="relative mt-6 font-mono text-xs tracking-caps text-ink-subtle">{item.n}</span>
      <span className="relative mt-3 text-lg leading-snug font-medium text-balance text-ink">
        {item.title}
      </span>
      <span className="relative mt-2.5 text-sm text-ink-muted">
        <Highlight body={item.body} term={item.highlight} />
      </span>
    </Reveal>
  );
}

export function Results({ results }: { results: HomeResults }) {
  /* Exactly four — `lib/home/normalize.ts` guarantees it before this renders. */
  const { items, media } = results;
  return (
    <Section ground="surface" id="results">
      {/* Centred through `SectionHead`, like every other head on the page —
          this was the one section still setting its own left-aligned block.
          The break is hard rather than left to the wrap: the figures are one
          line and the claim they support is the next. The cap has to clear the
          longer of those two lines, which measures 643px at the 40px ceiling of
          `--text-3xl` — `46rem` clears it with room, `24ch` would fold it. */}
      <SectionHead
        eyebrow={results.eyebrow}
        title={
          <>
            <span className="text-primary">{results.titleLead}</span>
            <br />
            {results.titleRest}
          </>
        }
        titleMax="max-w-[70rem]"
        body={results.body}
      />

      <div className="mt-12">
        <ResultsSplit
          /* Cards land first, then the column opens. Delays are kept short and
             paired by row — the two top cards together, the two bottom cards
             together — so all four finish at nearly the same moment and the
             split has a settled block to open. */
          left={
            <>
              <CapabilityCard item={items[0]} delay={0} />
              <CapabilityCard item={items[1]} delay={0.06} />
            </>
          }
          right={
            <>
              <CapabilityCard item={items[2]} delay={0.06} />
              <CapabilityCard item={items[3]} delay={0.12} />
            </>
          }
          media={
            /* Client-supplied. Native 1145x1374 is 0.83:1 and the open column is
               23rem x 28rem, which is 0.82:1 — so the crop takes almost nothing
               off it and the rising line survives the split intact. A portrait
               upload of about that ratio is what the CMS field asks for. */
            <Image
              src={media.src}
              alt={media.alt}
              width={media.width}
              height={media.height}
              sizes="(max-width: 1023px) 100vw, 23rem"
              /* Below lg the split is off and this is a short full-width band, so the
                 crop is pulled up to hold the rising line and her head rather than
                 a slice of her back. The open column is the right ratio already.
                 An editor's hotspot replaces both positions with one focal point. */
              style={media.position ? { objectPosition: media.position } : undefined}
              className="h-full min-h-[16rem] w-full object-cover object-[50%_32%] lg:min-h-[28rem] lg:object-center"
            />
          }
        />
      </div>
    </Section>
  );
}

/* ========================= 07 — CASE STUDIES =========================== */

export function CaseStudies({ caseStudies }: { caseStudies: HomeCaseStudies }) {
  return (
    <Section ground="surface" id="case-studies">
      <SectionHead eyebrow={caseStudies.eyebrow} title={caseStudies.title} body={caseStudies.body} />

      {/* Equal cards in one row — no lead card at twice the width of the others.

          `items-stretch`, so all three are the same rectangle. Nothing has to be
          protected from a card growing, because none of them grows: opening one
          swaps its face inside the height it already had. See `case-card.tsx`.

          The column count is derived, not fixed at three, so a fourth use case
          lands here without anyone touching this file.

          A phone gets ONE scroll, sideways.

          Stacked, three cards ran 1892px — two and a quarter screens for a
          section the page has already spent two pinned scenes before. Side by
          side with snap points it is one card tall and you swipe, which is the
          same gesture the rest of a phone uses for a row of anything.

          The negative margin and matching padding are what let the strip bleed
          to the screen edge while its first card still lines up with every
          other section's gutter. `overflow-x` is on the strip, never on the
          document — measured at 0. */}
      <RevealGroup
        as="ul"
        className="mt-10 -mx-[var(--gutter)] flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-[var(--gutter)] pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
      >
        {caseStudies.items.map((c) => (
          <CaseCard key={c.n} item={c} />
        ))}
      </RevealGroup>
    </Section>
  );
}

/* ========================= 08 — ENGAGEMENT ============================= */

/**
 * One journey with three stops, not three cards — see `models-journey.tsx`. The
 * section's own paragraph describes a path through implementing, improving and
 * managing, and three equal boxes is the one layout that cannot say so.
 */
export function Models({ models }: { models: HomeModels }) {
  return (
    <Section ground="surface" id="models">
      <SectionHead eyebrow={models.eyebrow} title={models.title} body={models.body} />
      <ModelsJourney models={models} />
    </Section>
  );
}

/* ========================= 09 — TESTIMONIALS =========================== */

/**
 * The quote mark leads, and it alternates blue and amber down the rail.
 *
 * It replaces a row of five stars, which said nothing: every testimonial on
 * every site has five, so the only thing they measure is that somebody chose to
 * draw them. The mark is the one place on this page a large piece of colour is
 * purely typographic, and alternating it is what stops six identical cards
 * reading as wallpaper.
 *
 * The attribution puts the CLIENT first and the role second — "Fortune 500
 * Client" is the part that carries weight; "Program Lead" is who said it.
 *
 * **The portrait is comp.** There are no client photographs in the project.
 * In the CMS it is optional per quote; a card without one closes on the name.
 */
function QuoteMark({ tone }: { tone: "accent" | "primary" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 28"
      className={`h-8 w-auto ${tone === "accent" ? "text-accent" : "text-primary"}`}
      fill="currentColor"
    >
      <path d="M0 28V16.4C0 7.9 4.6 2 12.9 0l1.9 4.2C10.2 5.9 7.6 9 7.4 13.4H15V28H0Zm25 0V16.4C25 7.9 29.6 2 37.9 0l1.9 4.2C35.2 5.9 32.6 9 32.4 13.4H40V28H25Z" />
    </svg>
  );
}

export function Testimonials({ testimonials }: { testimonials: HomeTestimonials }) {
  return (
    <Section ground="surface" id="testimonials">
      <SectionHead eyebrow={testimonials.eyebrow} title={testimonials.title} />
      <Reveal className="mt-14">
        <Carousel label="Client testimonials">
          {testimonials.items.map((t, i) => (
            <li
              key={i}
              className="flex w-[21rem] shrink-0 snap-start flex-col rounded-2xl bg-canvas p-8 ring-1 ring-border sm:w-[28rem]"
            >
              <QuoteMark tone={i % 2 === 0 ? "accent" : "primary"} />
              <blockquote className="mt-6 text-lg leading-snug font-light text-pretty text-ink italic">
                {t.body}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-5 pt-10">
                <span className="max-w-[10ch] text-lg leading-tight font-medium text-balance text-ink">
                  {t.role}
                </span>
                <span className="min-w-0 flex-1 text-sm text-ink-subtle">{t.name}</span>
                {t.portrait ? (
                  <Image
                    src={t.portrait.src}
                    alt={t.portrait.alt}
                    width={56}
                    height={56}
                    style={t.portrait.position ? { objectPosition: t.portrait.position } : undefined}
                    className="size-14 shrink-0 rounded-md object-cover"
                  />
                ) : null}
              </figcaption>
            </li>
          ))}
        </Carousel>
      </Reveal>
    </Section>
  );
}

/* =========================== 12 — FINAL CTA ============================ */

/**
 * The page ends on the same light it opened with.
 *
 * The hero's arc, run again at the foot: one shape bookending the whole page is
 * worth more than a new idea in the last screen. Deliberately NOT interactive
 * here — in the hero the light is something to play with, and at the end of a
 * page it is scenery. A pulse under a call to action competes with the only
 * thing on the screen that matters.
 *
 * No rule between this and the footer: they are one dark block, and the page
 * finishes rather than stopping twice.
 */
export function Closing({ closing }: { closing: HomeClosing }) {
  return (
    <section id="closing" data-nav-dark className="relative isolate overflow-hidden bg-void">
      {/* Flipped, so the page closes under the top of the circle rather than
          over the bottom of it. The hero opens on a horizon coming up out of the
          frame; this answers it with a dome coming down, which is the same shape
          saying the opposite thing. */}
      <HorizonGlow
        flip
        interactive={false}
        clearance={56}
        className="absolute inset-0 block size-full"
      />
      {/* Extra room at the top, so the copy starts BELOW the dome rather than on
          it. On a phone the section is narrow, the dome is tight, and its peak
          landed 8px above the eyebrow — which measured 1.00:1, white type on a
          white arc. The gap is the fix; a scrim would have flattened the light
          the panel exists for. */}
      <div className="relative shell flex flex-col items-center pt-[calc(var(--section-y)+2.5rem)] pb-[var(--section-y)] text-center">
        <Reveal>
          <Eyebrow tone="onDark">{closing.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 max-w-[20ch] text-3xl leading-[1.08] font-light tracking-[-0.03em] text-balance text-on-panel">
            {closing.title}
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-5 max-w-[46ch] text-base text-on-panel/70">{closing.body}</p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-10">
            <CtaPill href={closing.cta.href} tone="light">
              {closing.cta.label}
            </CtaPill>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
