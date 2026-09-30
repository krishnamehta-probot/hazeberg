/* Relative, not `@/`: the Sanity CLI bundles the schema without Next's path
   aliases, and this file is part of the schema's import graph. */
import { SERVICE_OPTIONS } from "./home/services";

/**
 * The pages a CMS-edited button is allowed to point at.
 *
 * Buttons in the CMS pick a destination from this list rather than typing a
 * URL. That is the level-2 line from `CMS-PLAN.md` — an editor changes what a
 * button says, not the site's structure — and it also means a CTA cannot be
 * saved pointing at a page that does not exist.
 *
 * Plain data with no React in it: the Studio's schema imports this file too.
 */
export const LINK_OPTIONS = [
  { title: "Contact", value: "/contact" },
  { title: "About", value: "/about" },
  { title: "What we do", value: "/what-we-do" },
  { title: "Berg", value: "/berg" },
  { title: "Careers", value: "/careers" },
  ...SERVICE_OPTIONS.map((s) => ({ title: s.title, value: s.href })),
] as const;

const ALLOWED = new Set<string>(LINK_OPTIONS.map((o) => o.value));

export function isSiteRoute(value: unknown): value is string {
  return typeof value === "string" && ALLOWED.has(value);
}
