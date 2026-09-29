"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * Smooth scrolling, site-wide.
 *
 * Two of the four reference sites run Lenis, and it is the single biggest reason
 * they feel animated: it changes every scroll on the page rather than adding
 * another effect to one section. Nothing else here has as much leverage per line.
 *
 * Deliberately gentle. `lerp: 0.1` with a short duration trails the wheel by
 * about a fifth of a second — enough to read as eased, not enough to feel like
 * the page is ignoring the input. Heavier settings are what make smooth-scroll
 * sites feel seasick.
 *
 * Three things it must not break, and does not:
 *   - `prefers-reduced-motion` turns it off entirely
 *   - anchor links still land, because Lenis owns the scroll and we hand them to it
 *   - touch devices keep native momentum; Lenis only takes the wheel
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  /**
   * A new page starts at the top of itself.
   *
   * It did not. Clicking "Privacy Policy" in the FOOTER — which is, by
   * definition, something you only reach at the bottom of a page — opened
   * `/privacy` scrolled most of the way down it. The router does reset the
   * scroll on navigation, but Lenis holds its own animated position and writes
   * it back on the very next frame, so the reset lasted about 16ms and then the
   * old offset came straight back. From the footer that is a page that opens in
   * the middle of its own legal text.
   *
   * `immediate` is the important half: without it the correction is a one-second
   * eased journey up the new page, which looks like a bug of its own.
   *
   * A hash is the one case where the top is the wrong answer — that URL named a
   * section — so it is left to the anchor handler below.
   */
  useEffect(() => {
    if (window.location.hash) return;
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.05,
      smoothWheel: true,
      // Native momentum on touch is better than anything we can simulate, and
      // fighting it is what makes smooth-scroll libraries feel broken on phones.
      syncTouch: false,
    });
    lenisRef.current = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    /**
     * In-page anchors have to go through Lenis, or they jump while it eases.
     *
     * The position is computed HERE and handed over as a number, rather than
     * passing the element and letting Lenis resolve it. Measured on
     * `/privacy#why`: handing Lenis the element landed the heading 376px down
     * the screen instead of 96px — it was resolving the target against a
     * positioned ancestor rather than the document, and every section on this
     * site sits inside a `position: relative` wrapper. `getBoundingClientRect()`
     * plus the current scroll is the document position, always, whatever the
     * ancestors are doing.
     *
     * The clearance is read off the header rather than hardcoded, so it stays
     * correct when `--header-h` changes at the md breakpoint — the old fixed 96
     * was right at one width and wrong at the other.
     */
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      let target: Element | null = null;
      try {
        target = document.querySelector(id);
      } catch {
        // A href like "#" + something that is not a valid selector. Let the
        // browser deal with it rather than throwing inside a click handler.
        return;
      }
      if (!target) return;
      e.preventDefault();

      const header = document.querySelector("header");
      const clearance = (header?.getBoundingClientRect().height ?? 72) + 24;
      const top = target.getBoundingClientRect().top + window.scrollY - clearance;
      lenis.scrollTo(Math.max(0, top));
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
