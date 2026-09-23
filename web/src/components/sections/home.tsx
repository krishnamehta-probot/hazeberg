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
import { Counter } from "@/components/ui/counter";
import {
  CASE_STUDIES,
  CLOSING,
  HERO,
  LOGOS,
  MODELS,
  RESULTS,
  TESTIMONIALS,
} from "@/lib/home-content";

/* ---------------------------------------------------------------------------
   Shared furniture
   ---------------------------------------------------------------------------
   Built against `REFERENCE-SPEC.md`. The reference alternates its ground
   surface -> canvas -> ink with no rules between sections: the ground change
   IS the separator. Section padding lives on the inner container.

   Photography in /public/comp is COMP ONLY — pulled from the reference so the
   page reads finished. Every one of them is replaced before launch, per rule 8.
--------------------------------------------------------------------------- */

/**
 * Two of the reference's frames are unusable here: section-03 is a family in a
 * doorway and section-04 is a house with a FOR SALE board. Both are real-estate
 * stock and would read as a mistake on a Workday consultancy. Every other frame
 * is workplace imagery and is kept. Eleven usable frames across thirteen slots,
 * so two repeat — placed far apart and cropped to different ratios.
 */
const COMP = {
  hero: "/comp/section-01.webp",
  /** Client-supplied. Corners are already rounded in the file, so the card
      clips to the same radius and the transparent corners fall on the page
      ground rather than on a second, different curve. */
  impact: "/sections/impact.png",
  services: [
    "/comp/section-02.webp",
    "/comp/section-05.webp",
    "/comp/section-06.webp",
    "/comp/section-11.webp",
    "/comp/section-12.webp",
    "/comp/section-13.webp",
    "/comp/section-09.webp",
  ],
  cases: ["/comp/section-08.webp", "/comp/section-07.webp", "/comp/section-02.webp"],
  /** The eight decorative frames on the services board, all distinct. */
  tiles: [
    "/comp/section-05.webp",
    "/comp/section-11.webp",
    "/comp/section-12.webp",
    "/comp/section-09.webp",
    "/comp/section-06.webp",
    "/comp/section-13.webp",
    "/comp/section-02.webp",
    "/comp/section-08.webp",
  ],
  why: "/comp/section-06.webp",
} as const;

/**
 * `surface` is the page. Every section sits on it unless there is a reason to
 * break — `canvas` and `ink` are the exceptions, reached for deliberately.
 * Cards go the other way: white on the surface, which is what gives them an
 * edge without darkening a whole band to produce one.
 */
const GROUND = {
  surface: "bg-surface",
  /** `surface` with the two brand washes bled into opposite corners. Reached
      for where a plain grey band would otherwise carry no colour at all. */
  surfaceTint: "surface-tint",
  canvas: "bg-canvas",
  ink: "grad-ink grain text-on-panel",
} as const;

function Section({
  children,
  ground = "surface",
  id,
  className = "",
}: {
  children: React.ReactNode;
  ground?: keyof typeof GROUND;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={`relative ${GROUND[ground]}`}>
      <div className={`shell py-[var(--section-y)] ${className}`}>{children}</div>
    </section>
  );
}

/**
 * Space Mono, caps, tracked. Three of the four reference sites set their
 * micro-labels in a monospace and nothing else — it is the one place the second
 * face appears, which is what keeps it from reading as a gimmick.
 */
function Eyebrow({
  children,
  tone = "subtle",
}: {
  children: React.ReactNode;
  tone?: "subtle" | "panel" | "onDark";
}) {
  const skin =
    tone === "panel" ? "text-accent" : tone === "onDark" ? "text-on-panel/60" : "text-ink-subtle";
  return <p className={`font-mono text-xs tracking-caps uppercase ${skin}`}>{children}</p>;
}

function SectionHead({
  eyebrow,
  title,
  body,
  cta,
  tone = "light",
  titleMax = "max-w-[24ch]",
}: {
  eyebrow: string;
  /** A node, not a string: one head sets part of its line in brand blue and
      breaks the sentence itself. */
  title: React.ReactNode;
  body?: string;
  cta?: { label: string; href: string };
  tone?: "light" | "panel";
  /** `24ch` is the measure every head wants EXCEPT one that carries its own
      hard break — there the cap has to clear the longer of the two lines. */
  titleMax?: string;
}) {
  const panel = tone === "panel";
  return (
    <Reveal className="flex flex-col items-center text-center">
      <Eyebrow tone={panel ? "panel" : "subtle"}>{eyebrow}</Eyebrow>
      <h2
        className={`mt-5 ${titleMax} text-3xl leading-[1.08] font-light tracking-[-0.03em] text-balance ${
          panel ? "text-on-panel" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {body ? (
        <p className={`mt-5 max-w-[60ch] text-base ${panel ? "text-on-panel/70" : "text-ink-muted"}`}>
          {body}
        </p>
      ) : null}
      {cta ? (
        <div className="mt-9">
          <CtaPill href={cta.href}>
            {cta.label}
          </CtaPill>
        </div>
      ) : null}
    </Reveal>
  );
}

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
    run into; `aria-hidden` on the copies keeps it to one announcement. */
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

function HeroTrust() {
  return (
    <div className="relative border-t border-white/10 bg-void pt-6 pb-6 lg:flex lg:items-center lg:gap-9 lg:py-5 lg:pl-[var(--gutter)]">
      {/* The divider lives on the label, not on the rail beside it: the rail
          carries the edge mask, and a mask fades an element's border along with
          everything else in it. */}
      <p className="text-center font-mono text-[0.6875rem] tracking-caps text-on-panel/55 uppercase lg:max-w-[11.5rem] lg:shrink-0 lg:border-r lg:border-white/12 lg:py-1 lg:pr-9 lg:text-left">
        {HERO.trust}
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

export function Hero() {
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
                  sentence wraps on its own. */}
              <h1 className="max-w-[15ch] text-3xl font-light text-balance sm:max-w-[20ch] sm:text-4xl lg:max-w-[34ch]">
                {HERO.titleA}{" "}
                <span className="lg:block">
                  {HERO.titleB}
                  <span className="text-accent">{HERO.titleAccent}</span>
                </span>
              </h1>
            </Reveal>
            <Reveal immediate delay={0.16}>
              <p className="mt-7 max-w-[54ch] text-base text-on-panel/70">{HERO.lead}</p>
            </Reveal>
            <Reveal immediate delay={0.24}>
              <div className="mt-10">
                <CtaPill href={HERO.cta.href} tone="light">
                  {HERO.cta.label}
                </CtaPill>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal immediate delay={0.32}>
          <HeroTrust />
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
export function About() {
  return (
    <section id="about" className="relative bg-surface">
      <AboutScene />
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
export function Impact() {
  return (
    <section id="impact" className="relative bg-void text-on-panel" data-nav-dark>
      <ImpactScene />
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
export function Services() {
  return <ServicesSection />;
}

/* ============================ 06 — RESULTS ============================= */

/**
 * Four figures as a 2 x 2 block that a photograph splits open on scroll — the
 * layout the client asked for. The mechanics live in `ResultsSplit`; this only
 * supplies the two halves and the media.
 *
 * Counters run on scroll, so the numbers arrive as the split finishes rather
 * than sitting there already counted.
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
function StatCard({ stat, delay }: { stat: (typeof RESULTS.stats)[number]; delay: number }) {
  const amber = stat.tone === "accent";
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
      <span className="relative mt-6 text-3xl leading-none font-light tracking-[-0.03em] text-primary tabular-nums">
        <Counter value={stat.value} suffix={stat.suffix} />
      </span>
      <span className="relative mt-3 text-sm font-medium text-ink">{stat.label}</span>
      <span className="relative mt-2 text-sm text-ink-muted">{stat.body}</span>
    </Reveal>
  );
}

export function Results() {
  const stats = RESULTS.stats;
  return (
    <Section ground="surfaceTint" id="results">
      {/* Centred through `SectionHead`, like every other head on the page —
          this was the one section still setting its own left-aligned block.
          The break is hard rather than left to the wrap: the figures are one
          line and the claim they support is the next. The cap has to clear the
          longer of those two lines, which measures 643px at the 40px ceiling of
          `--text-3xl` — `46rem` clears it with room, `24ch` would fold it. */}
      <SectionHead
        eyebrow={RESULTS.eyebrow}
        title={
          <>
            <span className="text-primary">{RESULTS.titleLead}</span>
            <br />
            {RESULTS.titleRest}
          </>
        }
        titleMax="max-w-[46rem]"
        body={RESULTS.body}
      />

      <div className="mt-12">
        <ResultsSplit
          /* Cards land first, then the column opens. Delays are kept short and
             paired by row — the two top cards together, the two bottom cards
             together — so all four finish at nearly the same moment and the
             split has a settled block to open. */
          left={
            <>
              <StatCard stat={stats[0]} delay={0} />
              <StatCard stat={stats[1]} delay={0.06} />
            </>
          }
          right={
            <>
              <StatCard stat={stats[2]} delay={0.06} />
              <StatCard stat={stats[3]} delay={0.12} />
            </>
          }
          media={
            /* Client-supplied. Native 1145x1374 is 0.83:1 and the open column is
               23rem x 28rem, which is 0.82:1 — so the crop takes almost nothing
               off it and the rising line survives the split intact. */
            <Image
              src="/result..png"
              alt="A consultant at a city window, a rising performance line drawn across the view"
              width={1145}
              height={1374}
              sizes="(max-width: 1023px) 100vw, 23rem"
              /* Below lg the split is off and this is a short full-width band, so the
                 crop is pulled up to hold the rising line and her head rather than
                 a slice of her back. The open column is the right ratio already. */
              className="h-full min-h-[16rem] w-full object-cover object-[50%_32%] lg:min-h-[28rem] lg:object-center"
            />
          }
        />
      </div>
    </Section>
  );
}

/* ========================= 07 — CASE STUDIES =========================== */

export function CaseStudies() {
  const [lead, ...rest] = CASE_STUDIES.items;
  return (
    <Section ground="surface" id="case-studies">
      <SectionHead eyebrow={CASE_STUDIES.eyebrow} title={CASE_STUDIES.title} body={CASE_STUDIES.body} />

      {/* `items-start` matters now that the cards open: a card that grows must
          not drag the height of the one beside it. */}
      <RevealGroup as="ul" className="mt-12 grid items-start gap-5 lg:grid-cols-2">
        <CaseCard item={lead} image={COMP.cases[0]} wide />
        {rest.map((c, i) => (
          <CaseCard key={c.n} item={c} image={COMP.cases[(i + 1) % COMP.cases.length]} wide={false} />
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
export function Models() {
  return (
    <Section ground="surface" id="models">
      <SectionHead eyebrow={MODELS.eyebrow} title={MODELS.title} body={MODELS.body} />
      <ModelsJourney />
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

/** COMP ONLY — one frame standing in for a portrait that does not exist yet. */
const TESTIMONIAL_SHOT = "/comp/section-09.webp";

export function Testimonials() {
  return (
    <Section ground="surface" id="testimonials">
      <SectionHead eyebrow={TESTIMONIALS.eyebrow} title={TESTIMONIALS.title} />
      <Reveal className="mt-14">
        <Carousel label="Client testimonials">
          {TESTIMONIALS.items.map((t, i) => (
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
                <Image
                  src={TESTIMONIAL_SHOT}
                  alt=""
                  width={56}
                  height={56}
                  className="size-14 shrink-0 rounded-md object-cover"
                />
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
export function Closing() {
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
          <Eyebrow tone="onDark">{CLOSING.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 max-w-[20ch] text-3xl leading-[1.08] font-light tracking-[-0.03em] text-balance text-on-panel">
            {CLOSING.title}
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-5 max-w-[46ch] text-base text-on-panel/70">{CLOSING.body}</p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-10">
            <CtaPill href={CLOSING.cta.href} tone="light">
              {CLOSING.cta.label}
            </CtaPill>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
