import Link from "next/link";

/**
 * The 404's content — shared by the two places Next can render a 404 from:
 * `app/global-not-found.tsx` (a URL no route matches) and
 * `app/(site)/not-found.tsx` (a page that calls `notFound()`, such as an
 * unknown service slug).
 */
export function NotFoundSection() {
  return (
    <section data-nav-dark className="bg-void text-on-panel">
      <div className="shell flex min-h-[70svh] flex-col items-start justify-end pt-[calc(var(--header-h)+4rem)] pb-[var(--section-y)]">
        <p className="font-mono text-xs tracking-caps text-on-panel/55 uppercase">404</p>
        <h1 className="mt-5 max-w-[20ch] text-3xl leading-[1.08] font-light tracking-[-0.03em] text-balance">
          This page could not be found.
        </h1>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-pill bg-canvas px-6 text-sm font-medium text-ink"
        >
          Back to the home page
        </Link>
      </div>
    </section>
  );
}
