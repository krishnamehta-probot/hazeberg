import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * REQUIRED in production: the one thing that guarantees a publish reaches the
 * cached home page.
 *
 * The page's query is cached with no expiry. `<SanityLive />` refreshes it —
 * but only from a browser that has the public site open (and is not in
 * preview) at the moment of the publish; a publish nobody is watching is never
 * picked up later. This webhook is Sanity telling the site directly, on every
 * publish, whoever is or is not looking.
 *
 * Configured in sanity.io/manage → API → Webhooks (see `web/SANITY.md`):
 *   URL        https://<site>/api/revalidate
 *   Filter     _type in ["homePage", "caseStudy"]
 *   Projection {_type}
 *   Secret     the same value as SANITY_REVALIDATE_SECRET
 *
 * The signature is checked before anything happens, so the URL being public
 * lets nobody else purge the cache.
 */
const TAGS = new Set(["homePage", "caseStudy"]);

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return new Response("Revalidation is not configured.", { status: 404 });

  let parsed: Awaited<ReturnType<typeof parseBody<{ _type?: string }>>>;
  try {
    parsed = await parseBody<{ _type?: string }>(request, secret);
  } catch {
    /* parseBody JSON-parses the body whatever the signature says, so junk
       from anyone would otherwise surface as a 500 and a logged stack trace. */
    return new Response("Invalid request.", { status: 400 });
  }

  const { isValidSignature, body } = parsed;
  if (!isValidSignature) return new Response("Invalid signature.", { status: 401 });

  const type = body?._type;
  if (!type || !TAGS.has(type)) return new Response("Nothing to revalidate.", { status: 400 });

  /* `expire: 0`, not "max": the next request waits for a fresh render rather
     than being served the old page once more. An editor who publishes and
     reloads should see their change on that reload. The cost: if Sanity fails
     during that one render, that one request errors instead of getting the
     old page. */
  revalidateTag(type, { expire: 0 });
  return NextResponse.json({ revalidated: type });
}
