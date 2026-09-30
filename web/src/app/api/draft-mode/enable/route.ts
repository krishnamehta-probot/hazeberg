import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { client } from "@/sanity/lib/client";
import { readToken } from "@/sanity/lib/token";

/**
 * Turns preview on. The Studio's Presentation tool calls this with a one-time
 * secret; the handler checks that secret against Sanity (which is what the
 * token is for), sets the draft-mode cookie and redirects into the page.
 * Nobody can switch preview on by guessing this URL.
 *
 * 404 until the CMS is configured with a token: without one there is no way
 * to check the secret and nothing to preview.
 */
const handler =
  client && readToken
    ? defineEnableDraftMode({ client: client.withConfig({ token: readToken }) }).GET
    : null;

export async function GET(request: Request) {
  if (!handler) return new Response("Preview is not configured.", { status: 404 });
  return handler(request);
}
