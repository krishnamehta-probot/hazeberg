"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

import type { Capability } from "@/lib/what-we-do-content";

import { CAPABILITY_ICON } from "./capability-chip";

/**
 * The eight capabilities in orbit round a globe, in the hero's light.
 *
 * The globe is cobe — a dotted Earth in WebGL, 13KB — coloured in the brand's
 * blue with the three offices (Erode, Coimbatore, Penang) marked in amber: the
 * one fact on it, and a true one. The eight sit on a tilted ring round it and
 * travel the ring: discs on the near side are full size and full strength and
 * pass IN FRONT of the globe; on the far side they shrink, fade and pass
 * behind it. The caption under the globe names whichever is nearest the
 * viewer, so the orbit reads its capabilities out one at a time.
 *
 * Manners, the same three every moving thing on the site keeps:
 *   - the pointer on the globe stops the orbit (it eases to a halt rather than
 *     freezing), so nothing moves under a hand reaching for it — the caption
 *     follows the disc under the pointer instead, and the globe turns a
 *     little towards it
 *   - keyboard focus brings the focused disc round to the front and holds it
 *     there, so a tabbing reader is never focused on something behind the globe
 *   - reduced motion: one still frame — offices facing, discs evenly round the
 *     ring, nothing turning
 *
 * Every disc is an `#anchor` to its accordion row, like every chip on the page.
 * Discs on the far side stop taking the pointer, so a click cannot land on one
 * through the globe.
 *
 * One loop drives the globe and the ring together and writes straight to the
 * DOM. It stops when the hero leaves the screen or the tab is hidden. Desktop
 * only (xl): narrower, the copy takes the frame's width.
 */

/** Orbit radii and tilt, as fractions of the stage. The globe itself is 80% of
    its canvas (cobe's own constant) and its canvas is `CANVAS` of the stage. */
const CANVAS = 0.74;
const RX = 0.44;
const RY = 0.14;
const TILT = -12 * (Math.PI / 180);
/** Disc diameter, px. */
const NODE = 48;
/** One revolution of the ring, seconds; the globe turns at its own speed. */
const LAP = 46;
const SPIN = 0.12;

/** Erode, Coimbatore, Penang — the three offices in `navigation.ts`. */
const OFFICES: [number, number][] = [
  [11.341, 77.7172],
  [11.0168, 76.9558],
  [5.3, 100.48],
];

/** cobe's angles for a latitude/longitude facing the viewer. */
const facing = (lat: number, lon: number) => ({
  phi: Math.PI - ((lon * Math.PI) / 180 - Math.PI / 2),
  theta: (lat * Math.PI) / 180,
});
const HOME = facing(14, 84);

export function CapabilityGlobe({
  items,
  label,
}: {
  items: readonly Capability[];
  /** The list's accessible name. */
  label: string;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const back = useRef<SVGEllipseElement>(null);
  const front = useRef<SVGPathElement>(null);
  const svgs = useRef<(SVGSVGElement | null)[]>([]);
  const nodes = useRef<(HTMLLIElement | null)[]>([]);
  const capN = useRef<HTMLSpanElement>(null);
  const capName = useRef<HTMLSpanElement>(null);
  const capRow = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const box = stage.current;
    const cv = canvas.current;
    if (!box || !cv) return;
    const host: HTMLElement = box.closest("section") ?? box;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = items.length;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let size = 0;
    let globe: ReturnType<typeof createGlobe> | null = null;

    /* -- state ------------------------------------------------------------ */
    let base = Math.PI / 2; // the ring's turn; disc 0 starts at the front
    let speed = reduce ? 0 : 1; // 1 = cruising, 0 = held
    let phi = HOME.phi;
    const theta = HOME.theta;
    let tiltX = 0;
    let tiltY = 0;
    let lookX = 0;
    let lookY = 0;
    let hovering = false;
    let pointed = -1; // the disc under the pointer
    let focused = -1; // the disc with keyboard focus
    let shown = -1; // the disc the caption names

    const layout = () => {
      const s = box.clientWidth;
      if (!s) return false;
      if (s === size && globe) return true;
      size = s;
      const c = Math.round(s * CANVAS);
      cv.style.width = `${c}px`;
      cv.style.height = `${c}px`;
      const rx = s * RX;
      const ry = s * RY;
      for (const el of svgs.current) el?.setAttribute("viewBox", `${-s / 2} ${-s / 2} ${s} ${s}`);
      back.current?.setAttribute("rx", rx.toFixed(1));
      back.current?.setAttribute("ry", ry.toFixed(1));
      // The near half of the ring, drawn again above the globe: it passes in
      // front of it, so it cannot only exist behind it.
      front.current?.setAttribute("d", `M ${rx} 0 A ${rx} ${ry} 0 0 1 ${-rx} 0`);

      const opts = {
        devicePixelRatio: dpr,
        width: c * dpr,
        height: c * dpr,
        phi,
        theta,
      };
      if (globe) globe.update(opts);
      else
        globe = createGlobe(cv, {
          ...opts,
          dark: 1,
          diffuse: 1.15,
          mapSamples: 16000,
          mapBrightness: 5.5,
          baseColor: [0.16, 0.34, 0.62],
          markerColor: [1, 0.75, 0.06],
          glowColor: [0.07, 0.33, 0.72],
          markers: OFFICES.map((location) => ({ location, size: 0.045 })),
          opacity: 0.92,
        });
      return true;
    };

    const caption = (i: number) => {
      if (i === shown || i < 0) return;
      shown = i;
      if (capN.current) capN.current.textContent = items[i].n;
      if (capName.current) capName.current.textContent = items[i].name;
    };

    /* Writes every disc for the ring at `base`, and returns the nearest. */
    const placeRing = () => {
      const half = size / 2;
      const rx = size * RX;
      const ry = size * RY;
      const cosT = Math.cos(TILT);
      const sinT = Math.sin(TILT);
      let nearest = 0;
      let depthMax = -2;
      for (let i = 0; i < count; i++) {
        const a = base + (i * Math.PI * 2) / count;
        const lx = rx * Math.cos(a);
        const ly = ry * Math.sin(a);
        const x = half + lx * cosT - ly * sinT;
        const y = half + lx * sinT + ly * cosT;
        // sin(a) > 0 is the lower half of the ring, which is the near side.
        const depth = Math.sin(a);
        if (depth > depthMax) {
          depthMax = depth;
          nearest = i;
        }
        const near = (depth + 1) / 2;
        const li = nodes.current[i];
        if (!li) continue;
        // The disc being pointed at or focused is brought to full strength and
        // above everything, whichever side of the ring it is on, so its name
        // is never half-hidden behind the globe.
        const lit = i === pointed || i === focused;
        const scale = lit ? 1.12 : 0.7 + 0.3 * near;
        li.style.transform = `translate3d(${(x - NODE / 2).toFixed(1)}px, ${(y - NODE / 2).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        li.style.opacity = lit ? "1" : (0.28 + 0.72 * near).toFixed(3);
        li.style.zIndex = lit ? "40" : depth > 0 ? "30" : "10";
        if (lit) li.dataset.lit = "";
        else delete li.dataset.lit;
        li.style.pointerEvents = depth > -0.25 ? "auto" : "none";
      }
      return nearest;
    };

    const paint = () => {
      const nearest = placeRing();
      caption(nearest);
      // While a disc is named at the disc itself, the caption steps back:
      // one name on screen at a time.
      const held = pointed >= 0 || focused >= 0;
      if (capRow.current) capRow.current.dataset.held = held ? "true" : "false";
      globe?.update({ phi: phi + tiltX, theta: theta + tiltY });
    };

    if (reduce) {
      const still = () => {
        if (layout()) paint();
      };
      still();
      const ro = new ResizeObserver(still);
      ro.observe(box);
      return () => {
        ro.disconnect();
        globe?.destroy();
      };
    }

    /* -- input ------------------------------------------------------------ */
    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      const inside =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      hovering = inside;
      // The globe turns a little towards the pointer, wherever it is in the
      // hero, and further when it is over the globe itself.
      lookX = ((e.clientX - (r.left + r.width / 2)) / r.width) * (inside ? 0.5 : 0.18);
      lookY = ((e.clientY - (r.top + r.height / 2)) / r.height) * (inside ? 0.3 : 0.1);
    };
    const onLeave = () => {
      hovering = false;
      lookX = lookY = 0;
    };

    /* -- loop ------------------------------------------------------------- */
    let frame = 0;
    let running = false;
    let visible = false;
    let last = 0;

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      const k = 1 - Math.exp(-dt * 4);

      if (focused >= 0) {
        // Bring the focused disc round to the front by the shorter way.
        const want = Math.PI / 2 - (focused * Math.PI * 2) / count;
        let d = (want - base) % (Math.PI * 2);
        if (d > Math.PI) d -= Math.PI * 2;
        if (d < -Math.PI) d += Math.PI * 2;
        base += d * (1 - Math.exp(-dt * 5));
        speed = 0;
      } else {
        speed += ((hovering ? 0 : 1) - speed) * k;
        base += ((Math.PI * 2) / LAP) * speed * dt;
      }
      phi += SPIN * dt * (0.35 + 0.65 * speed);
      tiltX += (lookX - tiltX) * k;
      tiltY += (lookY - tiltY) * k;

      paint();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || !visible || document.hidden || !layout()) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const onOver = (e: PointerEvent) => {
      const li = (e.target as HTMLElement).closest("li");
      pointed = li ? nodes.current.indexOf(li as HTMLLIElement) : -1;
    };
    const onOut = () => {
      pointed = -1;
    };
    const onFocus = (e: FocusEvent) => {
      const li = (e.target as HTMLElement).closest("li");
      focused = li ? nodes.current.indexOf(li as HTMLLIElement) : -1;
    };
    const onBlur = () => {
      focused = -1;
    };

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    box.addEventListener("pointerover", onOver);
    box.addEventListener("pointerout", onOut);
    box.addEventListener("focusin", onFocus);
    box.addEventListener("focusout", onBlur);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(box);
    const ro = new ResizeObserver(() => {
      if (!layout()) stop();
      else start();
    });
    ro.observe(box);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      box.removeEventListener("pointerover", onOver);
      box.removeEventListener("pointerout", onOut);
      box.removeEventListener("focusin", onFocus);
      box.removeEventListener("focusout", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
      globe?.destroy();
      globe = null;
    };
  }, [items]);

  return (
    <div className="pointer-events-none absolute inset-0 hidden xl:block">
      {/* The stage: right of the copy's measure, centred in the frame below
          the header. Its size is the only number the layout sets; the globe,
          the ring and the discs are all fractions of it. */}
      {/* Sized by the viewport's height as well as capped, so the globe, its
          ring and the caption under it always fit the first screen; set a
          little above the middle of what the header leaves, so the caption
          has room beneath it. */}
      <div
        ref={stage}
        className="absolute top-[calc(50%_+_var(--header-h)/2_-_2.5rem)] right-[max(var(--gutter),calc((100vw_-_82.5rem)/2_+_var(--gutter)))] size-[min(28rem,calc(100svh_-_var(--header-h)_-_11rem))] -translate-y-1/2 2xl:size-[min(30rem,calc(100svh_-_var(--header-h)_-_11rem))]"
      >
        {/* The far half of the ring, behind the globe. */}
        <svg
          ref={(el) => {
            svgs.current[0] = el;
          }}
          aria-hidden
          className="absolute inset-0 z-0 h-full w-full overflow-visible"
        >
          <g transform={`rotate(${(TILT * 180) / Math.PI})`}>
            <ellipse
              ref={back}
              cx={0}
              cy={0}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeDasharray="1 13"
              className="dash-flow text-on-panel/25"
            />
          </g>
        </svg>

        <canvas
          ref={canvas}
          aria-hidden
          className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        />

        {/* The near half, over the globe. */}
        <svg
          ref={(el) => {
            svgs.current[1] = el;
          }}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[25] h-full w-full overflow-visible"
        >
          <g transform={`rotate(${(TILT * 180) / Math.PI})`}>
            <path
              ref={front}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeDasharray="1 13"
              className="dash-flow text-on-panel/45"
            />
          </g>
        </svg>

        <nav aria-label={label}>
          <ul>
            {items.map((item, i) => {
              const Icon = CAPABILITY_ICON[item.id];
              return (
                <li
                  key={item.id}
                  ref={(li) => {
                    nodes.current[i] = li;
                  }}
                  className="group/li pointer-events-auto absolute top-0 left-0 size-12 will-change-transform"
                >
                  <a
                    href={`#${item.id}`}
                    className="grid size-12 place-items-center rounded-pill bg-void/55 text-on-panel shadow-lg ring-1 shadow-primary/25 ring-white/30 backdrop-blur-md transition-[background-color,box-shadow] dur-base ease-brand hover:bg-void/35 hover:shadow-primary/55 hover:ring-white/75 focus-visible:ring-white/75"
                  >
                    <Icon aria-hidden className="size-5" strokeWidth={1.7} />
                    {/* The name, right above the disc while it is pointed at or
                        focused. It is the link's text either way, so assistive
                        technology reads it whether or not it is showing. */}
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2.5 inline-flex -translate-x-1/2 translate-y-1 items-center gap-2 rounded-pill bg-void/80 px-3.5 py-1.5 text-sm whitespace-nowrap text-on-panel opacity-0 ring-1 ring-white/20 backdrop-blur-md transition dur-fast ease-brand group-data-[lit]/li:translate-y-0 group-data-[lit]/li:opacity-100">
                      <span className="font-mono text-[0.6875rem] tracking-caps text-accent">
                        {item.n}
                      </span>
                      {item.name}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Names the capability nearest the viewer as the ring turns, and
            steps back while one is named at its own disc. Decorative: every
            disc carries its own name for assistive technology. */}
        <p
          ref={capRow}
          aria-hidden
          className="absolute top-full left-1/2 mt-3 inline-flex -translate-x-1/2 items-center gap-2.5 rounded-pill bg-void/60 px-4 py-2 text-sm whitespace-nowrap text-on-panel ring-1 ring-white/12 backdrop-blur-md transition-opacity dur-base ease-brand data-[held=true]:opacity-0"
        >
          <span ref={capN} className="font-mono text-[0.6875rem] tracking-caps text-accent">
            {items[0]?.n}
          </span>
          <span ref={capName}>{items[0]?.name}</span>
        </p>
      </div>
    </div>
  );
}
