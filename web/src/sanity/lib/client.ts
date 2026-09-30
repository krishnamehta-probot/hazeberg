import { createClient } from "next-sanity";

import { apiVersion, dataset, isSanityConfigured, projectId, studioUrl } from "../env";

/**
 * The one Sanity client the site uses, or `null` when the CMS is not
 * configured — `createClient` throws without a project ID, and a missing
 * environment variable must not take the build down with it.
 *
 * `createClient` comes from `next-sanity`, not `@sanity/client`: next-sanity
 * pins its own client version and its helpers expect that one.
 *
 *   - `useCdn: true` for published reads. `defineLive` turns the CDN off by
 *     itself in draft mode, where it has to read drafts.
 *   - `stega.studioUrl` is what lets `defineLive` switch on invisible
 *     source-map encoding in draft mode — the thing that makes every piece of
 *     text on the preview clickable back to its field. It is never on for
 *     published pages.
 */
export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
      stega: { studioUrl },
    })
  : null;
