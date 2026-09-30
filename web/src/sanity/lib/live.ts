import "server-only";

import { defineLive } from "next-sanity/live";

import { client } from "./client";
import { readToken } from "./token";

/**
 * `sanityFetch` and `<SanityLive />`.
 *
 * `sanityFetch` caches every query by tag with no expiry, so the home page
 * stays a static page. Two things clear that cache when content is published:
 *
 *   - **The publish webhook** (`app/api/revalidate`) — Sanity calls the site on
 *     every publish. This is the guarantee, and it is required in production.
 *   - **`<SanityLive />`** (mounted in `app/(site)/layout.tsx`) — while a
 *     visitor has a page open, it hears the publish over Sanity's Live Content
 *     API and refreshes that tab in about two seconds. It only acts on events
 *     it hears: a publish made while no public page is open is never replayed
 *     to a later visitor, which is why it cannot be the only mechanism.
 *
 * Without draft mode: published content, from the CDN, no token.
 * In draft mode: drafts, with the token, stega on (see `client.ts`).
 *
 * `null` when the CMS is not configured; `get-home.ts` and the layout check.
 */
export const live = client
  ? defineLive({
      client,
      /* `false` rather than an empty string when unset: it silences the dev
         warning, and the only thing lost is draft preview, which cannot work
         without a token anyway. */
      serverToken: readToken || false,
      browserToken: readToken || false,
    })
  : null;

if (live && process.env.NODE_ENV === "production" && !process.env.SANITY_REVALIDATE_SECRET) {
  console.warn(
    "[sanity] SANITY_REVALIDATE_SECRET is not set: publishes will only reach the site while someone has it open. See web/SANITY.md.",
  );
}
