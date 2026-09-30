import "server-only";

import { FALLBACK_HOME } from "@/lib/home/fallback";
import { normalizeHome } from "@/lib/home/normalize";
import type { HomeContent } from "@/lib/home/types";
import { live } from "@/sanity/lib/live";
import { HOME_PAGE_QUERY, HOME_PAGE_TAGS } from "@/sanity/lib/queries";

/**
 * The home page's content, from wherever it lives right now.
 *
 *   - **Sanity not configured** (no project ID): the shipped copy. This is
 *     what a deploy renders before the CMS is set up, and it is v1 exactly.
 *   - **Configured, but no `homePage` document yet:** the shipped copy, with a
 *     warning — the state between creating the project and running
 *     `npm run sanity:seed`.
 *   - **Otherwise:** the document. Published content normally; the editor's
 *     draft when draft mode is on (the Presentation tool turns it on).
 *
 * A failed request is deliberately NOT caught. At build time that fails the
 * deploy, loudly; at revalidation time Next keeps the last good page (except
 * for the single request that waits on a webhook-triggered render, which gets
 * an error instead). Catching it here would do the one bad thing available —
 * overwrite the live CMS copy with the shipped copy because Sanity blinked.
 */
export async function getHome(): Promise<HomeContent> {
  if (!live) return FALLBACK_HOME;

  const { data } = await live.sanityFetch({ query: HOME_PAGE_QUERY, tags: HOME_PAGE_TAGS });
  if (!data) {
    console.warn("[home] no homePage document in Sanity — rendering the shipped copy. Run `npm run sanity:seed`.");
    return FALLBACK_HOME;
  }
  return normalizeHome(data, FALLBACK_HOME);
}
