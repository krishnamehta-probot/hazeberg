import { defineQuery } from "next-sanity";

/**
 * Every image comes back with what the page needs to crop and size it —
 * never just a URL. Dimensions are the ASSET's, before the editor's crop;
 * `lib/home/normalize.ts` applies the crop and works out the final size.
 */
const IMAGE = /* groq */ `
  alt,
  crop,
  hotspot,
  "asset": asset->{ url, "width": metadata.dimensions.width, "height": metadata.dimensions.height }
`;

/**
 * The whole home page in one request, case studies included.
 *
 * `_id == "homePage"` holds in both perspectives: in draft mode Sanity returns
 * the draft under its published ID, so this one query serves the live site and
 * the preview.
 */
export const HOME_PAGE_QUERY = defineQuery(`*[_type == "homePage" && _id == "homePage"][0]{
  hero{ titleA, titleB, titleAccent, lead, cta{ label, href }, trust },
  about{
    eyebrow, stat, statSuffix, statTail, body, cta{ label, href },
    points[]{ title, body }
  },
  impact{
    eyebrow, titleLead, titleAccent, body, cta{ label, href },
    cards[]{ stat, statLabel, title, body }
  },
  services{ eyebrow, title, items[]{ service, label, body, cta } },
  results{
    eyebrow, titleLead, titleRest, body,
    credentials[]{ line },
    items[]{ title, body, highlight },
    media{ ${IMAGE} }
  },
  caseStudies{
    eyebrow, title, body,
    items[]->{ title, challenge, approach, impact, capabilities, image{ ${IMAGE} } }
  },
  models{
    eyebrow, title, body, cta,
    items[]{ stage, title, body, bestFor, href, image{ ${IMAGE} } }
  },
  testimonials{ eyebrow, title, items[]{ body, name, role, portrait{ ${IMAGE} } } },
  closing{ eyebrow, title, body, cta{ label, href } }
}`);

/** The cache tags the home page is stored under — one per document type it reads. */
export const HOME_PAGE_TAGS = ["homePage", "caseStudy"];
