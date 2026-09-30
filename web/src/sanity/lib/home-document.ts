import { FALLBACK_HOME } from "../../lib/home/fallback";
import { TESTIMONIALS } from "../../lib/home-content";

/**
 * The shipped home copy, in the shape of the `homePage` document.
 *
 * Used twice, so the CMS never starts from a blank page:
 *   - as the document's `initialValue` — open "Home page" in an empty Studio
 *     and every field is already filled with today's copy. That matters
 *     because the fixed-length lists cannot be added to by hand (see
 *     `FIXED_ARRAY`), so an empty one could never be filled.
 *   - by `scripts/seed-sanity.ts`, which adds the photographs and the case
 *     study documents on top and writes the result.
 *
 * Text only: images need uploading and references need their documents to
 * exist, which only the seed can do.
 *
 * Relative imports only: the Studio's schema imports this file.
 */

/** Impact figures whose title and sentence are not the client's words — see
    the PLACEHOLDER notes in `lib/home-content.ts`. The figures themselves are. */
const PLACEHOLDER_IMPACT = new Set([1, 3]);

export function homeDocumentText() {
  const h = FALLBACK_HOME;
  return {
    hero: { ...h.hero, cta: { ...h.hero.cta } },
    about: {
      eyebrow: h.about.eyebrow,
      stat: h.about.stat,
      statSuffix: h.about.statSuffix,
      statTail: h.about.statTail,
      body: h.about.body,
      cta: { ...h.about.cta },
      points: h.about.points.map((p, i) => ({
        _key: `point-${i + 1}`,
        _type: "point",
        title: p.title,
        body: p.body,
      })),
    },
    impact: {
      eyebrow: h.impact.eyebrow,
      titleLead: h.impact.titleLead,
      titleAccent: h.impact.titleAccent,
      body: h.impact.body,
      cta: { ...h.impact.cta },
      cards: h.impact.cards.map((c, i) => ({
        _key: `figure-${i + 1}`,
        _type: "impactCard",
        ...c,
        placeholder: PLACEHOLDER_IMPACT.has(i),
      })),
    },
    services: {
      eyebrow: h.services.eyebrow,
      title: h.services.title,
      items: h.services.items.map((s) => ({
        _key: s.key,
        _type: "serviceItem",
        service: s.key,
        label: s.label,
        body: s.body,
        cta: s.cta,
      })),
    },
    results: {
      eyebrow: h.results.eyebrow,
      titleLead: h.results.titleLead,
      titleRest: h.results.titleRest,
      body: h.results.body,
      items: h.results.items.map((r, i) => ({
        _key: `card-${i + 1}`,
        _type: "capability",
        title: r.title,
        body: r.body,
        ...(r.highlight ? { highlight: r.highlight } : {}),
      })),
    },
    caseStudies: {
      eyebrow: h.caseStudies.eyebrow,
      title: h.caseStudies.title,
      body: h.caseStudies.body,
    },
    models: {
      eyebrow: h.models.eyebrow,
      title: h.models.title,
      body: h.models.body,
      cta: h.models.cta,
      items: h.models.items.map((m, i) => ({
        _key: `model-${i + 1}`,
        _type: "model",
        stage: m.stage,
        title: m.title,
        body: m.body,
        bestFor: m.bestFor,
        href: m.href,
      })),
    },
    testimonials: {
      eyebrow: h.testimonials.eyebrow,
      title: h.testimonials.title,
      items: h.testimonials.items.map((t, i) => ({
        _key: `quote-${i + 1}`,
        _type: "testimonial",
        body: t.body,
        role: t.role,
        name: t.name,
        placeholder: "placeholder" in TESTIMONIALS.items[i],
      })),
    },
    closing: { ...h.closing, cta: { ...h.closing.cta } },
  };
}
