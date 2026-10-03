/**
 * The home page's content contract — what `/` renders, and nothing else.
 *
 * Two things produce this shape and the page cannot tell them apart:
 *
 *   - `getHome()` in `get-home.ts`, from the `homePage` document in Sanity
 *   - `FALLBACK_HOME` in `fallback.ts`, from `lib/home-content.ts`, which is
 *     what the page renders when Sanity is not configured or the document
 *     does not exist yet
 *
 * It is derived from what v1 actually renders — the inventory is in the
 * commit that introduced it. Fields `home-content.ts` carries that `/` never
 * shows (`HERO.kicker`, `ABOUT.title`, `IMPACT.mediaTag`, `SERVICES.short`,
 * WHY, FAQ, FOOTER) are deliberately absent: they stay in code for /v2 and the
 * About page, and they are not the home page's to edit.
 *
 * What is NOT here is as deliberate as what is:
 *   - index labels ("01", "02") — derived from position, so reordering can
 *     never mis-number a card
 *   - colour — the Results amber is the last card by position, never a field
 *   - routes for the services wheel — each item names a fixed service and the
 *     route comes from code, because those routes are generated pages
 *   - the client logo rail — its files are pre-processed and its sizes are
 *     measured by `scripts/inkscale.mjs`, so it stays in `home-content.ts`
 */

import type { ServiceKey } from "./services";

export type HomeLink = { label: string; href: string };

/**
 * One photograph, ready for `next/image`.
 *
 * `src` is either a site path (`/cases/…`, the fallback) or a Sanity CDN URL
 * with the editor's crop already applied. `width`/`height` are the dimensions
 * of what `src` serves, crop included.
 */
export type HomeImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /**
   * The editor's hotspot as a CSS `object-position`. Absent unless an editor
   * has set one, so an untouched upload keeps the crop the design chose.
   */
  position?: string;
};

export type HomeHero = {
  /** First sentence of the headline. */
  titleA: string;
  /** Start of the second sentence — set in white. */
  titleB: string;
  /** End of the second sentence — set in amber. */
  titleAccent: string;
  lead: string;
  cta: HomeLink;
  /** The label beside the client logo rail. */
  trust: string;
};

export type HomeAbout = {
  eyebrow: string;
  /** Counted up from zero, so it is a whole number. */
  stat: number;
  statSuffix: string;
  statTail: string;
  body: string;
  cta: HomeLink;
  points: { title: string; body: string; icon?: string }[];
};

export type HomeImpactCard = { stat: string; statLabel: string; title: string; body: string };

export type HomeImpact = {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  body: string;
  cta: HomeLink;
  /** Exactly four: the strands in `impact-scene.tsx` are drawn by position. */
  cards: HomeImpactCard[];
};

export type HomeService = {
  key: ServiceKey;
  label: string;
  body: string;
  cta: string;
  href: string;
};

export type HomeServices = {
  eyebrow: string;
  title: string;
  items: HomeService[];
};

export type HomeCapability = {
  /** "01"… — from position. */
  n: string;
  title: string;
  body: string;
  /** A fragment of `body` set in brand blue. Must occur in `body` verbatim. */
  highlight?: string;
  /** The last card carries the amber; derived, never edited. */
  tone: "primary" | "accent";
};

export type HomeResults = {
  eyebrow: string;
  /** The figures line, in blue. */
  titleLead: string;
  /** The claim, on its own line. */
  titleRest: string;
  body: string;
  /**
   * The owner's distinctions, one sentence each, e.g. "3rd Workday exclusive
   * consulting firm from India". The section sets the leading ordinal large;
   * the sentence itself is never split in the content. Two, drawn as a pair;
   * fewer only while an editor has cleared one in a draft (`normalize.ts`
   * leaves an empty line out rather than drawing a blank mark).
   */
  credentials: string[];
  /** Exactly four: the split block reads them by position. */
  items: HomeCapability[];
  media: HomeImage;
};

export type HomeCaseStudy = {
  /** "01"… — from position. */
  n: string;
  title: string;
  challenge: string;
  approach: string;
  impact: string[];
  capabilities: string[];
  image: HomeImage;
};

export type HomeCaseStudies = {
  eyebrow: string;
  title: string;
  body: string;
  items: HomeCaseStudy[];
};

export type HomeModel = {
  stage: string;
  title: string;
  body: string;
  bestFor: string;
  href: string;
  image: HomeImage;
};

export type HomeModels = {
  eyebrow: string;
  title: string;
  body: string;
  /** The label on every panel's button. */
  cta: string;
  /** Exactly three: equal tabs over one panel. */
  items: HomeModel[];
};

export type HomeTestimonial = {
  body: string;
  name: string;
  role: string;
  portrait?: HomeImage;
};

export type HomeTestimonials = {
  eyebrow: string;
  title: string;
  items: HomeTestimonial[];
};

export type HomeClosing = {
  eyebrow: string;
  title: string;
  body: string;
  cta: HomeLink;
};

export type HomeContent = {
  hero: HomeHero;
  about: HomeAbout;
  impact: HomeImpact;
  services: HomeServices;
  results: HomeResults;
  caseStudies: HomeCaseStudies;
  models: HomeModels;
  testimonials: HomeTestimonials;
  closing: HomeClosing;
};
