"use server";

import { updateTag } from "next/cache";
import { draftMode } from "next/headers";
import { parseTags } from "next-sanity/live";

/**
 * What `<SanityLive />` runs when a document the page uses is published.
 *
 * next-sanity's default revalidates with `revalidateTag(tag, "max")`, which is
 * stale-while-revalidate: measured on this site, a publish left an open tab
 * showing the old copy, and the first reload after it still served the old
 * page while the new one built in the background. For a CMS whose whole
 * promise is "publish and it is live", that first stale view is the one the
 * editor sees.
 *
 * `updateTag` is Next's read-your-own-writes form (the option next-sanity
 * documents for exactly this): the cache entry expires at once, the next
 * request waits for fresh content, and `"refresh"` has the open tab fetch it.
 * The cost is that a publish re-renders the page immediately rather than in
 * the background — negligible for a site edited a few times a month.
 *
 * `parseTags` only accepts Sanity's own `sanity:` tags, so this public action
 * cannot be used to expire anything else in the cache.
 */
export async function refreshFromSanity(unsafeTags: unknown): Promise<void | "refresh"> {
  // Draft mode bypasses the cache entirely; a re-render is all it needs.
  if ((await draftMode()).isEnabled) return "refresh";

  let tags: string[];
  try {
    tags = parseTags(unsafeTags).tags;
  } catch {
    return;
  }
  for (const tag of tags) updateTag(tag);
  return "refresh";
}
