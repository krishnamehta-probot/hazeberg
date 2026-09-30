import type { Metadata } from "next";

import { NotFoundSection } from "@/components/page/not-found-section";
import { SiteShell } from "@/components/site-shell";

import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page not found | Hazeberg",
  description: "This page could not be found.",
};

/**
 * The 404 for a URL that matches no route — a whole document, because Next
 * serves it without running any layout (`experimental.globalNotFound`).
 *
 * Why this and not a root `not-found.tsx`: the root layout is bare so the
 * Studio can be its own application, which means a root not-found has to
 * bring the site's CSS and shell itself — and Next embeds the root not-found
 * into EVERY page's payload as a fallback. Measured at +25 KB per page, a
 * second header and footer nested inside `main` on a `notFound()` from a
 * service page, and the site's CSS downloaded by the Studio. This file is
 * only ever sent for an unmatched URL.
 *
 * A page that calls `notFound()` itself is `(site)/not-found.tsx`'s.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${fontVariables} h-full`}>
      <body className="flex min-h-full flex-col bg-canvas">
        <SiteShell>
          <NotFoundSection />
        </SiteShell>
      </body>
    </html>
  );
}
