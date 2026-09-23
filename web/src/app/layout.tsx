import type { Metadata } from "next";
import { Manrope, Space_Mono } from "next/font/google";

import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Specular } from "@/components/motion/specular";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header/site-header";

import "./globals.css";

/**
 * Manrope + Space Mono — the pairing from fmi-industries, one of the four
 * reference sites. Three of those four pair a neutral grotesk with a monospace
 * for micro-labels; of the four pairings this is the only one that is freely
 * licensed (Suisse Intl, Neue Haas Grotesk and stageGrotesk are all commercial).
 *
 * Manrope carries everything. Space Mono appears only at eyebrow scale — caps,
 * tracked, small — which is exactly how the references use their monos.
 *
 * `next/font` self-hosts both, so the browser never talks to Google.
 */
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hazeberg — Strategic Workday Consulting",
    template: "%s | Hazeberg",
  },
  description:
    "A Workday consulting venture with 12+ years of ecosystem experience — HCM, Payroll, Financials, Integrations, Reporting and AMS, delivered globally.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceMono.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-canvas">
        <a
          href="#main"
          className="sr-only rounded-sm bg-ink px-4 py-2 text-sm font-medium text-ink-invert focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60]"
        >
          Skip to content
        </a>
        <SmoothScroll />
        {/* One pointer listener behind every [data-spec] button on the site. */}
        <Specular />
        <SiteHeader />
        {/* The nav is fixed and floats over the page, so `main` starts at the
            very top — pages that open on artwork let the pill sit on it. */}
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
