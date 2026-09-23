"use client";

import { useEffect } from "react";
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

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // In-page anchors have to go through Lenis or they jump while it eases.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -96 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
