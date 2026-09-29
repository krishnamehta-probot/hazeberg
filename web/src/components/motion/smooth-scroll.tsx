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
/**
 * The target's RESTING position in the document, ignoring transforms.
 *
 * `getBoundingClientRect()` was used here and it is the wrong tool, for a reason
 * that only shows on a page whose sections reveal on scroll. Every section on
 * this site starts at `translateY(64px)` and animates to 0 as it enters the
 * viewport — and a rect includes that transform. So a jump link to a section
 * that has not revealed yet aimed 64px below where the section was about to
 * settle, the scroll landed there, the reveal then pulled the content up, and
 * the heading finished well above the header's clearance. Measured on
 * `/what-we-do`, whose eight headings live inside reveals: every one of them
 * landed at 48px instead of 112px, i.e. tucked under the floating nav.
 *
 * `offsetTop` is layout, not paint. It ignores transforms entirely, so summing
 * it up the `offsetParent` chain gives where the element will BE once everything
 * has finished moving — which is the only position a jump link should ever aim
 * at. The chain also handles the `position: relative` wrappers every section on
 * this site sits in, which is the other thing that made the rect version fragile.
 *
 * Falls back to the rect for a target with no `offsetParent` — display:none, or
 * inside a fixed-position subtree — where there is no layout chain to walk.
 */
function layoutTop(el: Element) {
  let node = el as HTMLElement | null;
  if (!node || node.offsetParent === null) {
    return el.getBoundingClientRect().top + window.scrollY;
  }
  let y = 0;
  while (node) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

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
      lenis.scrollTo(Math.max(0, layoutTop(target) - clearance));
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
