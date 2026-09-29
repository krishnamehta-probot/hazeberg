import type { Metadata } from "next";

import { Footer } from "@/components/v2/footer";
import { Nav } from "@/components/v2/nav";

import "./v2.css";

/**
 * v2's layout.
 *
 * Nested under the root layout, which keeps the things that are properties of
 * the SITE rather than of a version: the self-hosted Manrope and Space Mono
 * variables, the Lenis smooth scroll, and `globals.css` — whose `@theme inline`
 * block is what maps Tailwind's utilities onto the custom properties that
 * `v2.css` then re-points. That indirection is why v2 can restate the whole
 * token contract by declaring a dozen variables on one element instead of
 * shipping a second Tailwind theme.
 *
 * What it does NOT keep is the site header and the site footer. Those are
 * switched off for this route by `ChromeGate` in the root layout; v2 renders
 * its own, above and below.
 */

export const metadata: Metadata = {
  title: "Home — Version 2",
  description:
    "A second version of the Hazeberg home page, built to the supplied full-page design comp.",
  /* Not a public page — it is a version for review sitting alongside the real
     home page, and two home pages in an index is the kind of duplicate a
     search engine resolves by picking the wrong one. */
  robots: { index: false, follow: false },
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    /* `.v2` is the token scope. Everything below it reads the dark cut of the
       system; nothing above it changes. */
    <div id="top" className="v2 min-h-screen">
      <Nav />
      {children}
      <Footer />
    </div>
  );
}
