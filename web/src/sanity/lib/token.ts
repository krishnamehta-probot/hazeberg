import "server-only";

/**
 * A Viewer-role API token. Server-side only — `server-only` fails the build if
 * a client component ever imports this file.
 *
 * It does three jobs, all of them preview:
 *   - lets draft mode read unpublished drafts (`sanityFetch` in draft mode)
 *   - lets `/api/draft-mode/enable` check the Presentation tool's secret
 *   - is handed to the browser ONLY while draft mode is on, so the preview
 *     updates as an editor types (`defineLive`'s `browserToken`)
 *
 * Published content needs no token at all: the dataset is public.
 */
export const readToken = process.env.SANITY_API_READ_TOKEN || "";
