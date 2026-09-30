import type { Metadata } from "next";

import { NotFoundSection } from "@/components/page/not-found-section";

export const metadata: Metadata = { title: "Page not found" };

/**
 * The 404 for a public page that calls `notFound()` — an unknown service slug,
 * say. Only the section: the `(site)` layout around it already supplies the
 * CSS, header and footer. A URL that matches no route at all is
 * `app/global-not-found.tsx`'s.
 */
export default function NotFound() {
  return <NotFoundSection />;
}
