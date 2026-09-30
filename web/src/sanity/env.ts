/**
 * Sanity's connection settings, from the environment.
 *
 * Deliberately does NOT throw when they are missing. Vercel builds `main` on
 * every push, and a build that dies because the CMS has not been set up yet is
 * a broken site for a reason nobody can see from the page. Without a project ID
 * the home page renders the copy in `lib/home-content.ts` (see
 * `lib/home/get-home.ts`) and `/studio` explains what to set.
 *
 * `NEXT_PUBLIC_` because the Studio runs in the browser and needs both values
 * there. Neither is a secret: a project ID and a dataset name are in every
 * image URL the site serves. The token is not here — see `lib/token.ts`.
 *
 * Relative imports only in this folder: the Sanity CLI bundles `sanity.config.ts`
 * and `sanity.cli.ts` itself, without Next's `@/` alias.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/**
 * The API date the queries are written against. Pinned, not "today": Sanity
 * versions its API by date, and a moving value is a behaviour change nobody
 * deployed on purpose.
 */
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-09-30";

/** Where the Studio is mounted. Must match `app/studio/[[...tool]]`. */
export const studioUrl = "/studio";

/** True once a project ID is set. Everything Sanity-shaped checks this first. */
export const isSanityConfigured = projectId.length > 0;
