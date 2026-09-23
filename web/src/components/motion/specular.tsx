"use client";

import { useEffect } from "react";

/**
 * One pointer listener for every button on the site.
 *
 * Mounted once in the layout. It finds the nearest `[data-spec]` ancestor of
 * whatever the pointer is over and writes `--mx` / `--my` on it; the `.spec`
 * rules in `globals.css` do the rest. Per-button handlers were the obvious
 * alternative and are wrong here: there are ten CTAs on the home page, half of
 * them inside server components that would have to become client components to
 * carry an `onPointerMove`, and every one of them would be its own listener
 * firing on every frame of every pointer move.
 *
 * Writes go through one rAF, and only ever touch custom properties, so nothing
 * re-renders and nothing re-lays-out — the browser repaints the gradients and
 * that is the whole cost.
 */
export function Specular() {
  useEffect(() => {
    let el: HTMLElement | null = null;
    let x = 0;
    let y = 0;
    let raf = 0;

    const paint = () => {
      raf = 0;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${(x - r.left).toFixed(1)}px`);
      el.style.setProperty("--my", `${(y - r.top).toFixed(1)}px`);
      el.style.setProperty("--spec-hover", "1");
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const clear = () => {
      if (!el) return;
      // Remove rather than zero, so the CSS default (dead centre) comes back —
      // otherwise a button tabbed to after being hovered lights at the last
      // pointer position instead of in the middle.
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
      el.style.setProperty("--spec-hover", "0");
      el = null;
    };

    const onMove = (e: PointerEvent) => {
      const hit =
        e.target instanceof Element ? e.target.closest<HTMLElement>("[data-spec]") : null;
      if (hit !== el) clear();
      if (!hit) return;
      el = hit;
      x = e.clientX;
      y = e.clientY;
      schedule();
    };

    /* The page moves under a pointer that has not. With four pinned blocks and
       Lenis smoothing every scroll, that is the common case rather than the
       rare one — without this the hot spot stays where the pointer entered
       while the button slides out from under it. */
    const onScroll = () => {
      if (el) schedule();
    };

    /* Touch has no hover to leave, so a tap would light a button and leave it
       lit for the rest of the session. */
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") onMove(e);
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") clear();
    };

    const opts = { passive: true } as const;
    window.addEventListener("pointermove", onMove, opts);
    window.addEventListener("pointerdown", onDown, opts);
    window.addEventListener("pointerup", onUp, opts);
    window.addEventListener("pointercancel", onUp, opts);
    window.addEventListener("scroll", onScroll, opts);
    window.addEventListener("blur", clear);
    document.addEventListener("pointerleave", clear);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("blur", clear);
      document.removeEventListener("pointerleave", clear);
    };
  }, []);

  return null;
}
