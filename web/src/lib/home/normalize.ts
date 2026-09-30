import { stegaClean } from "next-sanity";

import type { HOME_PAGE_QUERY_RESULT } from "@/sanity/sanity.types";
import { isSiteRoute } from "@/lib/site-routes";

import { indexLabel } from "./index-label";
import { isServiceKey, serviceHref } from "./services";
import type {
  HomeAbout,
  HomeCaseStudies,
  HomeClosing,
  HomeContent,
  HomeHero,
  HomeImage,
  HomeImpact,
  HomeLink,
  HomeModels,
  HomeResults,
  HomeServices,
  HomeTestimonials,
} from "./types";

/**
 * The `homePage` document, turned into what the page renders.
 *
 * The generated query type says every required field is present. That is
 * true of what the Studio lets an editor PUBLISH — and false of a draft being
 * previewed halfway through an edit, or of anything written through the API.
 * So the input is typed as "anything may be missing" and every read is
 * checked. The rule, section by section:
 *
 *   - **A missing string renders empty.** In a preview, a field the editor has
 *     just cleared should look cleared — not quietly show the old copy.
 *   - **A list the layout draws a fixed number of**, at the wrong length, or a
 *     wheel item naming a service that does not exist, **replaces the whole
 *     section with the shipped copy** and logs why. The layout reads those
 *     lists by position, and a wrong count is a crash or an unlabelled line.
 *   - **A missing photograph or an unknown page** falls back to the shipped
 *     one in the same slot.
 *
 * Draft mode encodes invisible source maps into every string ("stega"), which
 * is what makes preview text clickable. Anything the code COMPARES or puts in
 * an attribute — routes, service keys, the highlight term, alt text, image
 * URLs — is cleaned first; anything that is only displayed keeps its encoding.
 */

/**
 * The query result with every level allowed to be missing. Strings widen to
 * `string`: in draft mode a value like "/contact" arrives with invisible
 * characters on the end, so the literal types typegen writes are not what
 * actually comes back until `clean()` has run.
 */
type Loose<T> = T extends string
  ? string | null | undefined
  : T extends readonly (infer U)[]
    ? Loose<U>[] | null | undefined
    : T extends object
      ? { [K in keyof T]?: Loose<T[K]> } | null | undefined
      : T | null | undefined;

type Raw = NonNullable<Loose<NonNullable<HOME_PAGE_QUERY_RESULT>>>;
type RawImage = Loose<{
  alt: string | null;
  crop: { top?: number; bottom?: number; left?: number; right?: number } | null;
  hotspot: { x?: number; y?: number } | null;
  asset: { url: string; width: number | null; height: number | null } | null;
}>;

const warn = (section: string, why: string) =>
  console.warn(`[home] ${section}: ${why} — rendering the shipped copy for this section.`);

/** Displayed text: kept as-is (stega included), empty when missing. */
const text = (v: unknown): string => (typeof v === "string" ? v : "");

/** Compared or used in an attribute: stega removed. */
const clean = (v: unknown): string => (typeof v === "string" ? stegaClean(v) : "");

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const pct = (v: number) => `${Math.round(clamp01(v) * 10000) / 100}%`;

function link(raw: Loose<{ label: string; href: string }>, fallback: HomeLink): HomeLink {
  const href = clean(raw?.href);
  return { label: text(raw?.label), href: isSiteRoute(href) ? href : fallback.href };
}

/**
 * A Sanity image as `next/image` wants it: the editor's crop applied through
 * the CDN's `rect` parameter, dimensions of the cropped result, and the
 * hotspot re-expressed relative to that crop as a CSS `object-position`.
 */
export function image(raw: RawImage, fallback: HomeImage | undefined): HomeImage | undefined {
  const url = clean(raw?.asset?.url);
  const w = raw?.asset?.width;
  const h = raw?.asset?.height;
  if (!url || !w || !h) return fallback;

  const c = raw?.crop;
  const left = c?.left ?? 0;
  const right = c?.right ?? 0;
  const top = c?.top ?? 0;
  const bottom = c?.bottom ?? 0;
  const cropped = left + right + top + bottom > 0;

  const rx = Math.round(left * w);
  const ry = Math.round(top * h);
  /* Right and bottom edges rounded from the far side, the way @sanity/image-url
     does it: rounding the width instead let a half-pixel left crop push the
     rectangle 1px past the photo's edge. */
  const rw = Math.max(1, Math.round(w - right * w - rx));
  const rh = Math.max(1, Math.round(h - bottom * h - ry));

  const hs = raw?.hotspot;
  const position =
    typeof hs?.x === "number" && typeof hs?.y === "number"
      ? `${pct((hs.x - left) / (1 - left - right))} ${pct((hs.y - top) / (1 - top - bottom))}`
      : undefined;

  return {
    src: cropped ? `${url}?rect=${rx},${ry},${rw},${rh}` : url,
    alt: clean(raw?.alt),
    width: cropped ? rw : w,
    height: cropped ? rh : h,
    ...(position ? { position } : {}),
  };
}

/* ------------------------------ sections ------------------------------- */

function hero(raw: Raw["hero"], fb: HomeHero): HomeHero {
  return {
    titleA: text(raw?.titleA),
    titleB: text(raw?.titleB),
    titleAccent: text(raw?.titleAccent),
    lead: text(raw?.lead),
    cta: link(raw?.cta, fb.cta),
    trust: text(raw?.trust),
  };
}

function about(raw: Raw["about"], fb: HomeAbout): HomeAbout {
  const points = raw?.points ?? [];
  if (points.length !== fb.points.length) {
    warn("about", `expected ${fb.points.length} points, got ${points.length}`);
    return fb;
  }
  const stat = raw?.stat;
  return {
    eyebrow: text(raw?.eyebrow),
    stat: typeof stat === "number" && Number.isInteger(stat) && stat > 0 ? stat : fb.stat,
    statSuffix: text(raw?.statSuffix),
    statTail: text(raw?.statTail),
    body: text(raw?.body),
    cta: link(raw?.cta, fb.cta),
    /* The marks are not in the CMS — no visitor ever sees them (see the note
       in the schema) — so they stay the shipped ones, by position. */
    points: points.map((p, i) => {
      const icon = fb.points[i]?.icon;
      return { title: text(p?.title), body: text(p?.body), ...(icon ? { icon } : {}) };
    }),
  };
}

function impact(raw: Raw["impact"], fb: HomeImpact): HomeImpact {
  const cards = raw?.cards ?? [];
  if (cards.length !== fb.cards.length) {
    warn("impact", `expected ${fb.cards.length} figures, got ${cards.length}`);
    return fb;
  }
  return {
    eyebrow: text(raw?.eyebrow),
    titleLead: text(raw?.titleLead),
    titleAccent: text(raw?.titleAccent),
    body: text(raw?.body),
    cta: link(raw?.cta, fb.cta),
    cards: cards.map((c) => ({
      stat: text(c?.stat),
      statLabel: text(c?.statLabel),
      title: text(c?.title),
      body: text(c?.body),
    })),
  };
}

function services(raw: Raw["services"], fb: HomeServices): HomeServices {
  const items = raw?.items ?? [];
  const keys = items.map((s) => clean(s?.service));
  if (items.length === 0 || items.length > fb.items.length) {
    warn("services", `expected up to ${fb.items.length} wheel items, got ${items.length}`);
    return fb;
  }
  if (!keys.every(isServiceKey) || new Set(keys).size !== keys.length) {
    warn("services", `unknown or repeated service in [${keys.join(", ")}]`);
    return fb;
  }
  return {
    eyebrow: text(raw?.eyebrow),
    title: text(raw?.title),
    items: items.map((s, i) => {
      const key = keys[i] as Parameters<typeof serviceHref>[0];
      return { key, label: text(s?.label), body: text(s?.body), cta: text(s?.cta), href: serviceHref(key) };
    }),
  };
}

function results(raw: Raw["results"], fb: HomeResults): HomeResults {
  const items = raw?.items ?? [];
  if (items.length !== fb.items.length) {
    warn("results", `expected ${fb.items.length} cards, got ${items.length}`);
    return fb;
  }
  return {
    eyebrow: text(raw?.eyebrow),
    titleLead: text(raw?.titleLead),
    titleRest: text(raw?.titleRest),
    body: text(raw?.body),
    items: items.map((item, i) => {
      const highlight = clean(item?.highlight);
      return {
        n: indexLabel(i),
        title: text(item?.title),
        body: text(item?.body),
        ...(highlight ? { highlight } : {}),
        tone: i === items.length - 1 ? "accent" : "primary",
      };
    }),
    media: image(raw?.media, fb.media) ?? fb.media,
  };
}

function caseStudies(raw: Raw["caseStudies"], fb: HomeCaseStudies): HomeCaseStudies {
  /* A reference to a case study that has been deleted, or not published yet,
     comes back as null. Those are dropped rather than rendered as empty
     cards; if that leaves the row short, the shipped row stands in. */
  const items = (raw?.items ?? []).filter((c) => c != null);
  if (items.length !== fb.items.length) {
    warn("caseStudies", `expected ${fb.items.length} published case studies, got ${items.length}`);
    return fb;
  }
  return {
    eyebrow: text(raw?.eyebrow),
    title: text(raw?.title),
    body: text(raw?.body),
    items: items.map((c, i) => ({
      n: indexLabel(i),
      title: text(c?.title),
      challenge: text(c?.challenge),
      approach: text(c?.approach),
      impact: (c?.impact ?? []).map(text).filter(Boolean),
      capabilities: (c?.capabilities ?? []).map(text).filter(Boolean),
      image: image(c?.image, fb.items[i].image) ?? fb.items[i].image,
    })),
  };
}

function models(raw: Raw["models"], fb: HomeModels): HomeModels {
  const items = raw?.items ?? [];
  if (items.length !== fb.items.length) {
    warn("models", `expected ${fb.items.length} models, got ${items.length}`);
    return fb;
  }
  return {
    eyebrow: text(raw?.eyebrow),
    title: text(raw?.title),
    body: text(raw?.body),
    cta: text(raw?.cta),
    items: items.map((m, i) => {
      const href = clean(m?.href);
      return {
        stage: text(m?.stage),
        title: text(m?.title),
        body: text(m?.body),
        bestFor: text(m?.bestFor),
        href: isSiteRoute(href) ? href : fb.items[i].href,
        image: image(m?.image, fb.items[i].image) ?? fb.items[i].image,
      };
    }),
  };
}

function testimonials(raw: Raw["testimonials"], fb: HomeTestimonials): HomeTestimonials {
  const items = raw?.items ?? [];
  if (items.length === 0) {
    warn("testimonials", "no quotes");
    return fb;
  }
  return {
    eyebrow: text(raw?.eyebrow),
    title: text(raw?.title),
    items: items.map((t) => {
      /* Optional in the CMS: no fallback, so a portrait an editor removes is
         gone rather than replaced by the comp frame. */
      const portrait = image(t?.portrait, undefined);
      return {
        body: text(t?.body),
        name: text(t?.name),
        role: text(t?.role),
        ...(portrait ? { portrait } : {}),
      };
    }),
  };
}

function closing(raw: Raw["closing"], fb: HomeClosing): HomeClosing {
  return {
    eyebrow: text(raw?.eyebrow),
    title: text(raw?.title),
    body: text(raw?.body),
    cta: link(raw?.cta, fb.cta),
  };
}

/**
 * A whole missing section (an object the document does not have at all) is
 * the one case that is not an editor's work in progress — it is a document
 * created before that section existed in the schema. That falls back whole.
 */
function section<R, T>(name: string, raw: R | null | undefined, fb: T, fn: (raw: R, fb: T) => T): T {
  if (raw == null) {
    warn(name, "missing from the document");
    return fb;
  }
  return fn(raw, fb);
}

export function normalizeHome(raw: Raw | null | undefined, fallback: HomeContent): HomeContent {
  return {
    hero: section("hero", raw?.hero, fallback.hero, hero),
    about: section("about", raw?.about, fallback.about, about),
    impact: section("impact", raw?.impact, fallback.impact, impact),
    services: section("services", raw?.services, fallback.services, services),
    results: section("results", raw?.results, fallback.results, results),
    caseStudies: section("caseStudies", raw?.caseStudies, fallback.caseStudies, caseStudies),
    models: section("models", raw?.models, fallback.models, models),
    testimonials: section("testimonials", raw?.testimonials, fallback.testimonials, testimonials),
    closing: section("closing", raw?.closing, fallback.closing, closing),
  };
}
