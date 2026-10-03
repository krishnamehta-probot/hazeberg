"use client";

import { useSyncExternalStore } from "react";

import { HorizonGlow } from "@/components/motion/horizon-glow";

/**
 * The hero's arc, held clear of the logo band by MEASURING the band.
 *
 * `HorizonGlow` takes its clearance in pixels — "the client rail's solid band,
 * plus a gap" — and the hero used to pass a constant 165: an 85px band and an
 * 80px gap, which was the desktop band exactly. Below lg the band was already
 * 130px, so a phone got a 35px gap by accident rather than by design.
 *
 * Splitting the rail into direct clients and clients via partners made that
 * constant wrong in a way that matters. The five direct marks need two rows on a
 * phone and both groups need a label, so the band measures 179px on a phone and
 * 181px on a tablet — taller than 165. A constant would put the bottom of the
 * arc UNDER the band, which is solid and is drawn over it: the one curve the
 * hero is built on, gone on every screen under 1024px.
 *
 * So the clearance is read off the band: its height, plus a gap the band
 * declares itself in `--arc-gap` (35 while the band is stacked, below lg, and 80
 * once it is one row — the two gaps the page already had). The band says how far
 * it wants the light kept off; this only does the sum. In one row the result is
 * 166 from xl, a pixel off the old 165, and 158 from lg to xl, where the band is
 * set smaller.
 *
 * `useSyncExternalStore` rather than an effect setting state — the same reason
 * as the Berg workflow's media query: this reads an outside source, and the
 * server snapshot (the old 165) is what both the server and hydration render,
 * so the markup never differs. Nothing here touches the canvas: the clearance
 * only changes when the band's height does — at a breakpoint or a rotation —
 * never per frame, and it reads nothing the arc writes, so it cannot loop.
 *
 * The server value is never DRAWN. Measured on a phone and a tablet: the
 * hydration pass hands the arc 165, the store's consistency check re-renders
 * with 214/216 in the same task, and the arc's first frame — which waits on an
 * IntersectionObserver and then a frame — is already 214/216. What could still
 * move it after first paint was the band itself growing as the logos loaded;
 * the marks now carry their files' width and height (`LogoMark`), so the band
 * has its final height before any image arrives.
 */
const SERVER_CLEARANCE = 165;

/** One band per page; the attribute is set by `HeroTrust` in `home.tsx`. */
const band = () => document.querySelector<HTMLElement>("[data-hero-band]");

const subscribe = (onChange: () => void) => {
  const el = band();
  if (!el) return () => {};
  const ro = new ResizeObserver(onChange);
  ro.observe(el);
  return () => ro.disconnect();
};

const clearance = () => {
  const el = band();
  if (!el) return SERVER_CLEARANCE;
  const gap = parseFloat(getComputedStyle(el).getPropertyValue("--arc-gap"));
  return Math.round(el.offsetHeight + (Number.isFinite(gap) ? gap : 80));
};

export function HeroGlow({ className }: { className?: string }) {
  const value = useSyncExternalStore(subscribe, clearance, () => SERVER_CLEARANCE);
  return <HorizonGlow clearance={value} className={className} />;
}
