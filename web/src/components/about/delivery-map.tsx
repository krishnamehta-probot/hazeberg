"use client";

import { useEffect, useId, useMemo, useRef, type CSSProperties } from "react";

import { LocalTime } from "@/components/ui/local-time";
import type { ABOUT } from "@/lib/about-content";

import {
  CENTRE_AT,
  REGION_AT,
  VIEWBOX,
  arcsFor,
  nightPath,
  pieceOf,
  placeAt,
  pointOn,
} from "./delivery-geo";
import { DeliveryLand } from "./delivery-land";

type Built = (typeof ABOUT)["built"];

/** One out-and-back for every arc, seconds: the packet goes out over the
    first half, comes home over the second. */
const LAP = 9;
/** Packets wait for the arcs to finish drawing in. */
const START = 2.6;
/** Each arc's place in the round, in sixths of a lap — Penang and Coimbatore
    alternate, and no region is sent two in a row. In `arcsFor` order: Penang
    to Americas, EMEA, APAC, then Coimbatore to the same three. */
const ORDER = [0, 2, 4, 3, 5, 1];
/** A packet's length, degrees of chord: ~28px at 1280 wide, ~47px at 1920. */
const TAIL = 16;
/** How far the drawing drifts against the pointer at most, px — the land
    half as far as the light above it, which is what lifts the arcs off it. */
const DRIFT_AIR = { x: 7, y: 5 };
const DRIFT_LAND = { x: 3, y: 2 };
/** How far each city's label hangs below its point. Penang's hangs past
    Coimbatore's: the two are 24 degrees apart, which is 40px at 1280 wide, so
    side by side they would overlap — staggered, each keeps a clear line to its
    own point (see the geometry in the doc). Part of the stagger is the
    cities' own 5.6 degrees of latitude, which shrinks with the map while the
    labels do not, so on a map smaller than 1280's (`488px / 284`, 1.72px a
    degree) Penang's drop takes back what the scale gives away and the two
    stay 11.6px apart; from 1280 up that is nothing and the drop is 68px. */
const STAGGER = (CENTRE_AT.coimbatore[1] - CENTRE_AT.penang[1]).toFixed(2);
const DROP: Record<string, string> = {
  coimbatore: "16px",
  penang: `calc(68px + max(0px, (488px / 284 - var(--dm-s)) * ${STAGGER}))`,
};
const DROP_DEFAULT = "16px";

const sixth = (i: number) => (ORDER[i % ORDER.length] ?? i) * (LAP / 6);
const fmt = (v: number) => v.toFixed(2);

/**
 * About's hero — the delivery map: where Hazeberg works from, and who it
 * works for, in one picture.
 *
 * A dotted world in the dark, lit from two amber points — Coimbatore and
 * Penang, the two delivery entities of How we're built — with arcs of light
 * out to the three regions the same commitment names. Each city carries its
 * own clock. One glance says it: a company in India and Malaysia, serving the
 * world, awake now.
 *
 * It replaces the three birds of the mark (2026-10-02), which nobody could
 * read as anything. It sits on PageHero's `glow` backdrop — the void and a
 * soft bloom, no arc and no stars: the inner pages' arc behind a lit map is
 * two lights fighting, and stars behind a field of dots are two skies.
 *
 * The picture, in the frame's degrees (`delivery-geo.ts`):
 *   - land from cobe's own land mask, resampled to a dot every 1.8 degrees
 *     (`scripts/world-dots.mjs`), brightening towards the two centres and
 *     dimmed on the night side of the world at the reader's minute
 *   - the centres in amber, each with a slow pulse; a label under each with
 *     its city, its live local time and its zone
 *   - six arcs, both centres to each region's representative point, lifted
 *     off the map; a packet of light goes out along each in blue and white
 *     and comes back in amber, one arc after another, and the region (or the
 *     centre) brightens as it lands
 *
 * **Geometry, solved rather than eyeballed.** The frame is placed by one
 * scale, `--dm-s` px per degree (globals.css, `.dmap`): the 284 degrees from
 * the Americas' west coast (128W) to Australia's east (156E) span from 1.5rem
 * right of the copy's column (PageHero's `--hero-copy`: 44rem from xl, less at
 * lg) to one gutter short of the window, capped by the band's height. The
 * band is the hero's — header to stats rail, less the hero's two margins — so
 * the map centres on the line the copy centres on. At 1280x650 that is 1.72px
 * a degree (a 488px-wide world); at 1920x950, 2.92 (828px). Everything placed
 * on it, at all five laptop and desktop sizes checked (1280x650, 1366x657,
 * 1440x780, 1536x730, 1920x950), with the drift at its furthest:
 *   - nothing drawn comes nearer the copy column than 37px (the AMERICAS label
 *     at 1280); land under the column is masked to nothing, fading in over
 *     the 5rem right of it
 *   - the highest thing is 58px or more below the header (1366x657), the
 *     lowest 66px or more above the rail (1280x650); land itself stays 68px
 *     clear of both. (Measured in the browser on 2026-10-03, with About's six
 *     figures on one row of the rail; the scale and every horizontal position
 *     are as they were, and the map stands where the taller band centres it.)
 *   - the two labels are 11.6px apart at the closest (1280), Penang's is 30px
 *     or more from APAC's glow and name, and no arc comes within 25px of
 *     either label except at its own point
 *
 * From lg, a tablet held landscape (2026-10-03), the copy's column gives way
 * so the map always has 360px: 1.27px a degree from 1024 to 1152 wide (a
 * 360px world), 1.37 at 1180 and 1.42 at 1194. Measured at 1024x768,
 * 1080x810, 1112x834, 1133x744, 1180x820 and 1194x834, drift at its furthest:
 *   - nothing drawn comes nearer the column than 23.7px (AMERICAS, at 1.27);
 *     the land is masked at its edge as above
 *   - the highest thing is 147px or more below the header and the lowest 111px
 *     or more above the rail — the map is width-bound here, so it floats in a
 *     band taller than it needs — and land stays 155px clear of both; in
 *     Safari's first screens (1024x690 to 1194x764) 113px, 77px and 121px
 *   - the labels hold 11.6px apart (`DROP`: Penang's takes back what the scale
 *     takes out of the stagger), Penang's is 15.7px or more from APAC's glow
 *     and name, and no arc comes within 19px of either label but at its point
 *   - the arcs' line is 1.0px to 1.1px across (`.dmap-line`)
 *
 * Manners: the drift answers the pointer anywhere over the hero; the loop
 * (packets, landings, drift and the minute's terminator) runs only while the
 * map is on screen and the tab is visible, and the CSS pulses pause with it
 * (`data-still`). Nothing on it changes content or takes input — there is no
 * rotation to hold, so the auto-rotation obligations have nothing to bind
 * to; the clocks are clocks. Reduced motion: the finished still frame — land,
 * arcs drawn, points, labels with their clocks — and no packets, pulses,
 * drift or terminator. The server renders that same frame; only the clocks'
 * minute and, without reduced motion, the night side arrive after hydration.
 *
 * Accessibility: the drawing is `aria-hidden`. The two labels are a list,
 * each city with its country and its time, because the time is real
 * information. From lg, as the globe and the dial are: under it (phones and
 * portrait tablets) the room beside the copy is too small to read a world in,
 * and the copy takes the frame.
 */
export function DeliveryMap({
  entities,
  regions,
}: {
  entities: Built["entities"];
  regions: Built["regions"];
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (s: string) => `${uid}-${s}`;

  const root = useRef<HTMLDivElement>(null);
  const land = useRef<HTMLDivElement>(null);
  const air = useRef<HTMLDivElement>(null);
  const night = useRef<SVGPathElement>(null);
  /* Two packets per arc, out (even) and home (odd). */
  const streaks = useRef<(SVGPathElement | null)[]>([]);
  const heads = useRef<(SVGGElement | null)[]>([]);
  const grads = useRef<(SVGLinearGradientElement | null)[]>([]);
  const regionFlash = useRef<(SVGCircleElement | null)[]>([]);
  const centreFlash = useRef<(SVGCircleElement | null)[]>([]);

  const centres = useMemo(() => entities.filter((e) => CENTRE_AT[e.key]), [entities]);
  const places = useMemo<string[]>(() => regions.filter((r) => REGION_AT[r]), [regions]);
  const arcs = useMemo(
    () =>
      arcsFor(
        centres.map((e) => e.key),
        places,
      ),
    [centres, places],
  );

  useEffect(() => {
    const box = root.current;
    const landEl = land.current;
    const airEl = air.current;
    if (!box || !landEl || !airEl) return;
    // Reduced motion keeps the frame the server drew: nothing here starts.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const host: HTMLElement = box.closest("section") ?? box;

    const plan = arcs.map((a, i) => {
      const dur = Math.min(LAP / 2 - 0.4, 1.5 + a.len / 80);
      const tail = Math.min(0.4, TAIL / a.len);
      return {
        a,
        offset: sixth(i),
        dur,
        tail,
        // When the head reaches the end: the eased reach crosses 1.
        arrive: (dur * Math.acos(1 - 2 / (1 + tail))) / Math.PI,
        region: places.indexOf(a.to),
        centre: centres.findIndex((e) => e.key === a.from),
      };
    });
    const regionHeat = new Float32Array(places.length);
    const centreHeat = new Float32Array(centres.length);
    const regionShown = new Float32Array(places.length);
    const centreShown = new Float32Array(centres.length);
    const live = new Uint8Array(plan.length * 2);

    /* -- one packet ------------------------------------------------------- */
    const draw = (slot: number, p: (typeof plan)[number], u: number, home: boolean) => {
      const streak = streaks.current[slot];
      const head = heads.current[slot];
      const grad = grads.current[slot];
      if (!streak || !head || !grad) return;
      if (u < 0 || u > 1) {
        if (live[slot]) {
          live[slot] = 0;
          streak.style.opacity = "0";
          head.style.opacity = "0";
        }
        return;
      }
      live[slot] = 1;
      const reach = ((1 - Math.cos(Math.PI * u)) / 2) * (1 + p.tail);
      const h = Math.min(1, reach);
      const t = Math.max(0, reach - p.tail);
      // Home runs the arc backwards: its head is nearer the centre.
      const tailAt = home ? 1 - t : t;
      const headAt = home ? 1 - h : h;
      streak.setAttribute("d", pieceOf(p.a, Math.min(tailAt, headAt), Math.max(tailAt, headAt)));
      const [tx, ty] = pointOn(p.a, tailAt);
      const [hx, hy] = pointOn(p.a, headAt);
      grad.setAttribute("x1", fmt(tx));
      grad.setAttribute("y1", fmt(ty));
      grad.setAttribute("x2", fmt(hx));
      grad.setAttribute("y2", fmt(hy));
      const enter = Math.min(1, u / 0.08);
      const leave = reach > 1 ? Math.max(0, 1 - (reach - 1) / p.tail) : 1;
      streak.style.opacity = (enter * Math.sqrt(leave)).toFixed(3);
      head.setAttribute("transform", `translate(${fmt(hx)} ${fmt(hy)})`);
      head.style.opacity = (enter * leave).toFixed(3);
    };

    /** A landing's glow: up at once, then away over about a second. */
    const glow = (since: number) => (since >= 0 && since < 1.6 ? Math.exp(-since * 2.6) : 0);

    /* -- the loop --------------------------------------------------------- */
    let frame = 0;
    let running = false;
    let visible = false;
    let last = 0;
    let clock = 0; // loop seconds: stands still while stopped
    let sunAt = -Infinity;
    let aimX = 0;
    let aimY = 0;
    let dx = 0;
    let dy = 0;
    let drift = "";

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      clock += dt;

      const k = 1 - Math.exp(-dt * 3);
      dx += (aimX - dx) * k;
      dy += (aimY - dy) * k;
      // Written only when it has moved, so a still pointer costs no style
      // work at all.
      const airAt = `translate3d(${fmt(-dx * DRIFT_AIR.x)}px, ${fmt(-dy * DRIFT_AIR.y)}px, 0)`;
      if (airAt !== drift) {
        drift = airAt;
        airEl.style.transform = airAt;
        landEl.style.transform = `translate3d(${fmt(-dx * DRIFT_LAND.x)}px, ${fmt(-dy * DRIFT_LAND.y)}px, 0)`;
      }

      // The terminator moves a quarter of a degree a minute: once a minute
      // is every change there is to see.
      if (now - sunAt > 60_000) {
        sunAt = now;
        night.current?.setAttribute("d", nightPath(Date.now()));
      }

      regionHeat.fill(0);
      centreHeat.fill(0);
      plan.forEach((p, i) => {
        const local = clock - START - p.offset;
        const at = local < 0 ? -1 : local % LAP;
        draw(i * 2, p, at < 0 ? -1 : at / p.dur, false);
        draw(i * 2 + 1, p, at < 0 ? -1 : (at - LAP / 2) / p.dur, true);
        if (at < 0) return;
        if (p.region >= 0) regionHeat[p.region] = Math.max(regionHeat[p.region], glow(at - p.arrive));
        if (p.centre >= 0)
          centreHeat[p.centre] = Math.max(centreHeat[p.centre], glow(at - LAP / 2 - p.arrive));
      });
      regionHeat.forEach((v, i) => {
        if (Math.abs(v - regionShown[i]) < 0.004) return;
        regionShown[i] = v;
        regionFlash.current[i]?.style.setProperty("opacity", v.toFixed(3));
      });
      centreHeat.forEach((v, i) => {
        if (Math.abs(v - centreShown[i]) < 0.004) return;
        centreShown[i] = v;
        centreFlash.current[i]?.style.setProperty("opacity", v.toFixed(3));
      });

      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      last = 0;
      delete box.dataset.still;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
      box.dataset.still = "";
    };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      aimX = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      aimY = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    };
    const onLeave = () => {
      aimX = 0;
      aimY = 0;
    };
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(box);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [arcs, centres, places]);

  return (
    <div ref={root} className="dmap pointer-events-none absolute inset-x-0 top-[var(--hero-top)] bottom-[var(--hero-pad)] hidden lg:block">
      {/* The land, behind a fade that holds still while it drifts: nothing at
          the copy column's edge, all of it 5rem later. */}
      <div aria-hidden className="dmap-fade absolute inset-0">
        <div
          ref={land}
          className="dmap-frame dmap-land dmap-in"
          style={{ "--in": "0.15s" } as CSSProperties}
        >
          <DeliveryLand uid={uid} night={night} />
        </div>
      </div>

      <div ref={air} className="dmap-frame">
        <svg
          viewBox={VIEWBOX}
          preserveAspectRatio="none"
          aria-hidden
          className="absolute inset-0 size-full overflow-visible"
        >
          <defs>
            {/* Literal stops: SVG gradients cannot read a token. The brand
                blues (#1972b9, #008eff and the pale #8cc8fa of its rim),
                white, and amber (#fec00f) — which is light here, on the void,
                never type on a light ground. */}
            {arcs.map((a) => (
              <linearGradient
                key={a.key}
                id={id(`line-${a.key}`)}
                gradientUnits="userSpaceOnUse"
                x1={a.p0[0]}
                y1={a.p0[1]}
                x2={a.p1[0]}
                y2={a.p1[1]}
              >
                <stop offset="0" stopColor="#ffe2a0" stopOpacity="0.5" />
                <stop offset="0.3" stopColor="#8cc8fa" stopOpacity="0.42" />
                <stop offset="1" stopColor="#4aa8ff" stopOpacity="0.55" />
              </linearGradient>
            ))}
            {arcs.flatMap((a, i) =>
              [false, true].map((home) => (
                <linearGradient
                  key={`${a.key}-${home ? "home" : "out"}`}
                  ref={(el) => {
                    grads.current[i * 2 + (home ? 1 : 0)] = el;
                  }}
                  id={id(`packet-${i * 2 + (home ? 1 : 0)}`)}
                  gradientUnits="userSpaceOnUse"
                  x1={0}
                  y1={0}
                  x2={1}
                  y2={0}
                >
                  {home ? (
                    <>
                      <stop offset="0" stopColor="#fec00f" stopOpacity="0" />
                      <stop offset="0.55" stopColor="#fec00f" stopOpacity="0.7" />
                      <stop offset="1" stopColor="#fff1c2" stopOpacity="1" />
                    </>
                  ) : (
                    <>
                      <stop offset="0" stopColor="#008eff" stopOpacity="0" />
                      <stop offset="0.55" stopColor="#4aa8ff" stopOpacity="0.75" />
                      <stop offset="1" stopColor="#ffffff" stopOpacity="1" />
                    </>
                  )}
                </linearGradient>
              )),
            )}
            <radialGradient id={id("region")}>
              <stop offset="0" stopColor="#008eff" stopOpacity="0.5" />
              <stop offset="0.4" stopColor="#008eff" stopOpacity="0.16" />
              <stop offset="1" stopColor="#008eff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={id("centre")}>
              <stop offset="0" stopColor="#fec00f" stopOpacity="0.6" />
              <stop offset="0.45" stopColor="#fec00f" stopOpacity="0.16" />
              <stop offset="1" stopColor="#fec00f" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={id("head-out")}>
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="0.35" stopColor="#8cc8fa" stopOpacity="0.45" />
              <stop offset="1" stopColor="#008eff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={id("head-home")}>
              <stop offset="0" stopColor="#fff1c2" stopOpacity="0.95" />
              <stop offset="0.35" stopColor="#fec00f" stopOpacity="0.45" />
              <stop offset="1" stopColor="#fec00f" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* The arcs: a wide faint glow under a fine line, both drawn out
              from the centres as the page lands. Widths in degrees, so they
              grow with the map; the line's 0.6 is 1px at the smallest
              desktop map (1.72px a degree at 1280 wide) — at 0.5 it was a
              sub-pixel line, which a screen draws as a grey smear, not as
              light. Below xl the map is smaller still (1.27px a degree at a
              1024 tablet), and `.dmap-line` takes it to 0.8 there: 1px
              again. */}
          <g fill="none" strokeLinecap="round">
            {arcs.map((a, i) => (
              <g key={a.key} style={{ "--in": `${(0.95 + i * 0.1).toFixed(2)}s` } as CSSProperties}>
                <path
                  d={a.d}
                  pathLength={1}
                  stroke="#8cc8fa"
                  strokeOpacity={0.07}
                  strokeWidth={2.4}
                  className="dmap-draw"
                />
                <path
                  d={a.d}
                  pathLength={1}
                  stroke={`url(#${id(`line-${a.key}`)})`}
                  strokeWidth={0.6}
                  className="dmap-draw dmap-line"
                />
              </g>
            ))}
          </g>

          {/* The regions: a soft blue glow, a ring and a point, and a second
              glow the loop lifts as a packet lands. */}
          {places.map((r, i) => {
            const [lon, lat] = REGION_AT[r];
            return (
              <g
                key={r}
                transform={`translate(${lon} ${-lat})`}
                className="dmap-in"
                style={{ "--in": `${(2.0 + i * 0.12).toFixed(2)}s` } as CSSProperties}
              >
                <circle r={7} fill={`url(#${id("region")})`} />
                <circle
                  ref={(el) => {
                    regionFlash.current[i] = el;
                  }}
                  r={4.5}
                  fill={`url(#${id("region")})`}
                  style={{ opacity: 0 }}
                />
                <circle r={2} fill="none" stroke="#8cc8fa" strokeOpacity={0.5} strokeWidth={0.3} />
                <circle r={0.85} fill="#cfe8ff" />
              </g>
            );
          })}

          {/* The packets. Empty until the loop writes them; never written
              under reduced motion. */}
          <g fill="none" strokeLinecap="round">
            {arcs.flatMap((a, i) =>
              [false, true].map((home) => {
                const slot = i * 2 + (home ? 1 : 0);
                return (
                  <g key={`${a.key}-${home ? "home" : "out"}`} className="dmap-packet">
                    <path
                      ref={(el) => {
                        streaks.current[slot] = el;
                      }}
                      stroke={`url(#${id(`packet-${slot}`)})`}
                      strokeWidth={0.85}
                      style={{ opacity: 0 }}
                    />
                    <g
                      ref={(el) => {
                        heads.current[slot] = el;
                      }}
                      style={{ opacity: 0 }}
                    >
                      <circle r={2.4} fill={`url(#${id(home ? "head-home" : "head-out")})`} />
                      <circle r={0.5} fill={home ? "#fff1c2" : "#ffffff"} />
                    </g>
                  </g>
                );
              }),
            )}
          </g>

          {/* The two centres: an amber halo, a pulse, the point, and a glow
              the loop lifts as a packet comes home. */}
          {centres.map((e, i) => {
            const [lon, lat] = CENTRE_AT[e.key];
            return (
              <g
                key={e.key}
                transform={`translate(${lon} ${-lat})`}
                className="dmap-in"
                style={{ "--in": `${(0.7 + i * 0.12).toFixed(2)}s` } as CSSProperties}
              >
                <circle r={5} fill={`url(#${id("centre")})`} />
                <circle
                  ref={(el) => {
                    centreFlash.current[i] = el;
                  }}
                  r={6}
                  fill={`url(#${id("centre")})`}
                  style={{ opacity: 0 }}
                />
                <circle
                  r={1.4}
                  fill="none"
                  stroke="#fec00f"
                  strokeWidth={0.32}
                  className="dmap-pulse"
                  style={{ "--in": `${(1.8 + i * 1.8).toFixed(2)}s` } as CSSProperties}
                />
                <circle r={1.35} fill="#fec00f" />
                <circle r={0.5} fill="#fff6d6" />
              </g>
            );
          })}
        </svg>

        {/* The regions' names, under their points. */}
        <div aria-hidden>
          {places.map((r, i) => (
            <span
              key={r}
              className="dmap-in absolute -translate-x-1/2 pt-3 font-mono text-[0.6875rem] leading-[0.875rem] tracking-caps whitespace-nowrap text-on-panel/70 uppercase [text-shadow:0_0_10px_var(--void)]"
              style={{ ...placeAt(REGION_AT[r]), "--in": `${(2.1 + i * 0.12).toFixed(2)}s` } as CSSProperties}
            >
              {r}
            </span>
          ))}
        </div>

        {/* The cities, with their clocks: the one part of the picture that is
            information, so it is a list a screen reader hears. Each label
            hangs under its point on a hairline and is right-aligned 12px past
            it, so the line meets the label's top edge, not its corner. */}
        <ul>
          {centres.map((e, i) => {
            const drop = DROP[e.key] ?? DROP_DEFAULT;
            return (
              <li
                key={e.key}
                className="dmap-in absolute"
                style={{ ...placeAt(CENTRE_AT[e.key]), "--in": `${(1.25 + i * 0.15).toFixed(2)}s` } as CSSProperties}
              >
                <span
                  aria-hidden
                  className="absolute top-[5px] left-0 w-px -translate-x-1/2 bg-linear-to-b from-accent/80 to-white/25"
                  style={{ height: `calc(${drop} - 5px)` }}
                />
                <div
                  className="absolute -right-3 w-max rounded-md bg-void/70 px-3 py-2 ring-1 ring-white/15 backdrop-blur-md"
                  style={{ top: drop }}
                >
                  <p className="flex items-baseline justify-between gap-3 text-sm leading-4 text-on-panel">
                    <span>
                      {e.city}
                      <span className="sr-only">, {e.country}</span>
                    </span>
                    <LocalTime tz={e.tz} className="text-on-panel/85" />
                  </p>
                  <p className="mt-1 font-mono text-[0.6875rem] leading-[0.875rem] tracking-caps text-on-panel/55 uppercase">
                    {e.tzLabel}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
