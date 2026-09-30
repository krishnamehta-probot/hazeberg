import type { Metadata } from "next";

import { fontVariables } from "./fonts";

export const metadata: Metadata = {
  title: {
    default: "Hazeberg — Strategic Workday Consulting",
    template: "%s | Hazeberg",
  },
  description:
    "A Workday consulting venture with 12+ years of ecosystem experience — HCM, Payroll, Financials, Integrations, Reporting and AMS, delivered globally.",
};

/**
 * The root layout is deliberately bare: the document, the fonts, the default
 * metadata. Nothing else.
 *
 * Two applications share it. The public site (`app/(site)/layout.tsx`) adds
 * `globals.css` and the site shell; the Sanity Studio (`app/studio`) adds
 * nothing, because the site's global CSS hides scrollbars and restyles focus,
 * and its smooth scroll swallows the wheel events the Studio's panes need.
 * A URL that matches nothing is `global-not-found.tsx`, which is its own
 * document.
 *
 * The body's classes only resolve where `globals.css` is loaded, so on the
 * Studio they are inert rather than wrong.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full`}>
      <body className="flex min-h-full flex-col bg-canvas">{children}</body>
    </html>
  );
}
