import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Specular } from "@/components/motion/specular";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header/site-header";
import { ChromeGate } from "@/components/v2/chrome-gate";

/**
 * Everything the public site wraps its pages in: the skip link, Lenis, the
 * specular listener, the header, `main` and the footer.
 *
 * It used to be the body of the root layout. It moved here when the Sanity
 * Studio arrived at `/studio`, because the Studio is a separate application
 * that happens to share the domain, and every piece of this breaks it in its
 * own way — Lenis cancels the wheel events its panes scroll on, the header
 * floats over its toolbar, and `globals.css` hides every scrollbar on the page.
 *
 * So the root layout is now bare (`app/layout.tsx`) and `app/(site)/layout.tsx`
 * wraps every public page in this, and so does `app/global-not-found.tsx`, the
 * 404 for URLs no route matches.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-sm bg-ink px-4 py-2 text-sm font-medium text-ink-invert focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60]"
      >
        Skip to content
      </a>
      <SmoothScroll />
      {/* One pointer listener behind every [data-spec] button on the site. */}
      <Specular />
      {/* The site chrome, switched off under `/v2` — that route is a parallel
          version of the home page and renders its own header and footer. See
          `components/v2/chrome-gate.tsx`. */}
      <ChromeGate>
        <SiteHeader />
      </ChromeGate>
      {/* The nav is fixed and floats over the page, so `main` starts at the
          very top — pages that open on artwork let the pill sit on it. */}
      <main id="main" className="flex-1">
        {children}
      </main>
      <ChromeGate>
        <SiteFooter />
      </ChromeGate>
    </>
  );
}
