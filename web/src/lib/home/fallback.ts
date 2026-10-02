import {
  ABOUT,
  CASE_STUDIES,
  CLOSING,
  HERO,
  IMPACT,
  MODELS,
  RESULTS,
  SERVICES,
  TESTIMONIALS,
} from "../home-content";
import { indexLabel } from "./index-label";
import { isPublishedService, serviceHref, serviceKeyForHref } from "./services";
import type { HomeContent, HomeImage } from "./types";

/**
 * The home page as it ships in code — `lib/home-content.ts` in the shape the
 * page renders.
 *
 * Three jobs:
 *   1. What `/` renders when Sanity is not configured (no project ID in the
 *      environment) or the `homePage` document has not been created yet, so a
 *      deploy without the CMS set up is the approved v1 rather than an error.
 *   2. The source for `scripts/seed-sanity.ts`, so the first CMS document is
 *      this copy verbatim and nothing is retyped.
 *   3. Per-section fallback: a section the CMS returns in an unusable shape
 *      (see `normalize.ts`) is replaced by its entry here.
 *
 * The photographs used to be hard-coded in the section components. They live
 * here now, because in the CMS they are fields like any other.
 */

/* Client-supplied. Native 1145x1374 — see the note in `sections/home.tsx`. */
const RESULTS_MEDIA: HomeImage = {
  src: "/result..png",
  alt: "A consultant at a city window, a rising performance line drawn across the view",
  width: 1145,
  height: 1374,
};

/* Decorative in the design (`alt=""`): the card's own text says everything the
   picture does. AI-generated stand-ins — see `content/case-study-image-prompts.md`. */
const CASE_IMAGES: HomeImage[] = [
  { src: "/cases/01-hr-operations.jpg", alt: "", width: 1376, height: 768 },
  { src: "/cases/02-global-workforce.jpg", alt: "", width: 1376, height: 768 },
  { src: "/cases/03-financial-visibility.jpg", alt: "", width: 1376, height: 768 },
];

/* COMP ONLY — three frames from the reference set, replaced before launch. */
const MODEL_IMAGES: HomeImage[] = [
  { src: "/comp/section-07.webp", alt: "", width: 1600, height: 902 },
  { src: "/comp/section-11.webp", alt: "", width: 1600, height: 1128 },
  { src: "/comp/section-13.webp", alt: "", width: 1600, height: 1128 },
];

/* COMP ONLY — one frame standing in for portraits that do not exist yet. */
const TESTIMONIAL_PORTRAIT: HomeImage = {
  src: "/comp/section-09.webp",
  alt: "",
  width: 1240,
  height: 1200,
};

export const FALLBACK_HOME: HomeContent = {
  hero: {
    titleA: HERO.titleA,
    /* `home-content.ts` carries the joining space on the end of `titleB`; the
       contract does not, and the hero puts it back. */
    titleB: HERO.titleB.trim(),
    titleAccent: HERO.titleAccent,
    lead: HERO.lead,
    cta: { ...HERO.cta },
    trust: HERO.trust,
  },

  about: {
    eyebrow: ABOUT.eyebrow,
    stat: ABOUT.stat,
    statSuffix: ABOUT.statSuffix,
    statTail: ABOUT.statTail,
    body: ABOUT.body,
    cta: { ...ABOUT.cta },
    points: ABOUT.points.map((p) => ({
      title: p.title,
      body: p.body,
      ...("icon" in p ? { icon: p.icon } : {}),
    })),
  },

  impact: {
    eyebrow: IMPACT.eyebrow,
    titleLead: IMPACT.titleLead,
    titleAccent: IMPACT.titleAccent,
    body: IMPACT.body,
    cta: { ...IMPACT.cta },
    cards: IMPACT.cards.map((c) => ({ ...c })),
  },

  services: {
    eyebrow: SERVICES.eyebrow,
    title: SERVICES.title,
    items: SERVICES.items.flatMap((s) => {
      const key = serviceKeyForHref(s.href);
      if (!key) throw new Error(`home-content: no service key for ${s.href}`);
      /* A held-back service keeps its copy here and loses its wedge. */
      if (!isPublishedService(key)) return [];
      return [{ key, label: s.label, body: s.body, cta: s.cta, href: serviceHref(key) }];
    }),
  },

  results: {
    eyebrow: RESULTS.eyebrow,
    titleLead: RESULTS.titleLead,
    titleRest: RESULTS.titleRest,
    body: RESULTS.body,
    items: RESULTS.items.map((item, i, all) => ({
      n: indexLabel(i),
      title: item.title,
      body: item.body,
      ...("highlight" in item ? { highlight: item.highlight } : {}),
      tone: i === all.length - 1 ? "accent" : "primary",
    })),
    media: RESULTS_MEDIA,
  },

  caseStudies: {
    eyebrow: CASE_STUDIES.eyebrow,
    title: CASE_STUDIES.title,
    body: CASE_STUDIES.body,
    items: CASE_STUDIES.items.map((c, i) => ({
      n: indexLabel(i),
      title: c.title,
      challenge: c.challenge,
      approach: c.approach,
      impact: [...c.impact],
      capabilities: [...c.capabilities],
      image: CASE_IMAGES[i % CASE_IMAGES.length],
    })),
  },

  models: {
    eyebrow: MODELS.eyebrow,
    title: MODELS.title,
    body: MODELS.body,
    cta: MODELS.cta,
    items: MODELS.items.map((m, i) => ({
      stage: m.stage,
      title: m.title,
      body: m.body,
      bestFor: m.bestFor,
      href: m.href,
      image: MODEL_IMAGES[i % MODEL_IMAGES.length],
    })),
  },

  testimonials: {
    eyebrow: TESTIMONIALS.eyebrow,
    title: TESTIMONIALS.title,
    items: TESTIMONIALS.items.map((t) => ({
      body: t.body,
      name: t.name,
      role: t.role,
      portrait: TESTIMONIAL_PORTRAIT,
    })),
  },

  closing: {
    eyebrow: CLOSING.eyebrow,
    title: CLOSING.title,
    body: CLOSING.body,
    cta: { ...CLOSING.cta },
  },
};
