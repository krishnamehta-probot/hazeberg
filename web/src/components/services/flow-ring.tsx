"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

import {
  FlowRoute,
  HubDisc,
  HubRipples,
  LIGHT,
  FlowGlyph,
  Stream,
  pad,
  type FlowData,
} from "./flow-parts";

const EASE = [0.22, 1, 0.36, 1] as const;

/* -- the geometry -------------------------------------------------------------
   One set of numbers places the nodes in CSS and draws the connectors in SVG,
   so the two land on the same points at any size.

   A node is 12rem wide and at most about 6.25rem tall (a two-line name over a
   two-line vendor). Its centre sits INSET_X in from the box's sides and INSET_Y
   in from its top and bottom — half the node and half a rem of air — so the
   outermost nodes touch the frame and never cross it.

   Eight round a ring have to clear each other three ways: the top pair side by
   side, each top node against the side node below it, and the side pairs
   above each other. Worked through at the narrowest box this layout is ever
   given (44rem wide, 29.5rem tall): the top pair have 206px between centres
   for 192px of node; the top and upper-side nodes overlap in x, so they must
   clear in y, and do, by 104px for a pair whose halves add to at most 100.
   Narrower than 44rem the ring cannot hold eight readable nodes, and the phone
   drawing takes over (`flow-hub.tsx` switches on the container, not the
   screen). Four, as a cross, clear with room to spare at the same size. */
const INSET_X = 6.5;
const INSET_Y = 3.625;

/** How far each connector bows off the straight line, as a share of its
    length. All the same way round, so the set reads as one swirl into (or out
    of) the middle rather than as spokes. */
const BEND = 0.14;
/** A packet every quarter of the connector. */
const DASH = "0.05 0.2";
/** Seconds for a packet to run its whole connector — at rest, and on the
    selected connector, which runs at about twice the pace. */
const RUN = 4.8;
const RUN_LIT = 2.2;

const r4 = (v: number) => Math.round(v * 1e4) / 1e4;

/**
 * Where the nodes sit, as multiples of the room either side of the middle.
 *
 * Four make a cross, starting at twelve. More than four start half a step
 * before twelve, so no node sits on the vertical through the hub: eight become
 * a pair at the top, a pair down each side and a pair at the foot — an octagon
 * that spends the box's width, where a node at twelve would need the box twice
 * as tall. Divided by the largest cosine and sine so the outermost nodes reach
 * exactly the inset, whatever the count. Rounded, so the server's string and
 * the browser's are the same string.
 */
function spots(n: number) {
  const start = n <= 4 ? -90 : -90 - 180 / n;
  const raw = Array.from({ length: n }, (_, i) => {
    const a = ((start + (360 * i) / n) * Math.PI) / 180;
    return [Math.cos(a), Math.sin(a)] as const;
  });
  const mc = Math.max(1e-6, ...raw.map(([c]) => Math.abs(c)));
  const ms = Math.max(1e-6, ...raw.map(([, s]) => Math.abs(s)));
  return { mc, ms, at: raw.map(([c, s]) => ({ fx: r4(c / mc), fy: r4(s / ms) })) };
}

/** A connector, hub to node, bowed by BEND; reversed when the data arrives. */
function connector(hx: number, hy: number, nx: number, ny: number, inward: boolean) {
  const dx = nx - hx;
  const dy = ny - hy;
  const cx = ((hx + nx) / 2 - dy * BEND).toFixed(1);
  const cy = ((hy + ny) / 2 + dx * BEND).toFixed(1);
  const h = `${hx.toFixed(1)} ${hy.toFixed(1)}`;
  const e = `${nx.toFixed(1)} ${ny.toFixed(1)}`;
  return inward ? `M${e}Q${cx} ${cy} ${h}` : `M${h}Q${cx} ${cy} ${e}`;
}

/**
 * The flow hub, wide: the hub as a glass disc in the middle, every connection a
 * glass node on a ring round it, and a curved connector from each with packets
 * of light running along it — towards the hub when the data arrives there,
 * away from it when the hub feeds everything, and both ways (amber coming
 * back) on the connections that do both.
 *
 * The nodes are a real tablist and the card beside the ring is its panel.
 * Pointing at a node, focusing it or clicking it selects it: the node lifts,
 * its connector brightens and its packets speed up, and the card shows its
 * name, its route and its line. Arrows step round the ring, Home and End jump
 * to the ends, and only the selected node is in the tab order. The first is
 * selected to start with, so the card is never empty.
 *
 * The card holds every connection's copy stacked in one grid cell, with only
 * the selected one visible — the cell is always as tall as the longest, so the
 * card never changes height and nothing under it moves.
 *
 * Drawn in pixels: the SVG is measured and drawn 1:1, because the packets are
 * dashes on `pathLength` and Chrome gets those wrong in a stretched viewBox.
 * The nodes are HTML, placed in CSS from the same numbers, so they render on
 * the server and the connectors simply arrive under them.
 *
 * It assembles once, on first sight: the hub, then the connectors drawing
 * themselves out (or in), then the nodes, then the light. Packets stop when the
 * ring is off screen. Reduced motion gets the finished picture: connectors
 * drawn, no packets, no rings, no rise.
 */
export function FlowRing({ data, twoWay }: { data: FlowData; twoWay: readonly boolean[] }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const seen = useInView(box, { once: true, amount: 0.3 });
  const inView = useInView(box);
  const [size, setSize] = useState({ w: 0, h: 0, rem: 16 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      setSize({ w: Math.round(width), h: Math.round(height), rem });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { items, hub } = data;
  const n = items.length;
  const inward = data.direction === "in";
  const { mc, ms, at } = spots(n);
  const live = !reduce && seen;
  const running = live && inView;
  const tabId = (i: number) => `${uid}-tab-${i}`;
  const panelId = `${uid}-panel`;

  const { w, h, rem } = size;
  const A = w / 2 - INSET_X * rem;
  const B = h / 2 - INSET_Y * rem;
  /* The hub's size, as its CSS has it: clamp(7.5rem, 16cqw, 9rem). */
  const hubR = Math.min(9 * rem, Math.max(7.5 * rem, 0.16 * w)) / 2;

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const from = tabs.current.indexOf(e.target as HTMLButtonElement);
    const cur = from >= 0 ? from : active;
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (cur + 1) % n;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (cur - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="grid gap-6 @min-[67rem]:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] @min-[67rem]:items-center @min-[67rem]:gap-10">
      {/* -- the ring --------------------------------------------------------- */}
      <div
        ref={box}
        className="@container relative mx-auto aspect-[2/1] min-h-[29.5rem] w-full max-w-[56rem]"
      >
        {/* The field the ring sits in, and the light round the hub. */}
        <div aria-hidden className="flow-field pointer-events-none absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 size-[min(36rem,70cqw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(25_114_185/0.16),rgb(25_114_185/0.05)_62%,transparent)]"
        />

        {w > 0 ? (
          <svg
            aria-hidden
            width={w}
            height={h}
            viewBox={`0 0 ${w} ${h}`}
            fill="none"
            strokeLinecap="round"
            data-flow-paused={running ? undefined : ""}
            className="absolute inset-0"
          >
            {/* The orbit the nodes ride, and a closer one round the hub. */}
            <ellipse
              cx={w / 2}
              cy={h / 2}
              rx={A / mc}
              ry={B / ms}
              stroke="rgb(20 24 26 / 0.16)"
              strokeDasharray="1 7"
            />
            <circle
              cx={w / 2}
              cy={h / 2}
              r={hubR + 22}
              className="stroke-primary"
              strokeOpacity={0.24}
              strokeDasharray="2 6"
            />

            {items.map((item, i) => {
              const d = connector(w / 2, h / 2, w / 2 + A * at[i].fx, h / 2 + B * at[i].fy, inward);
              const on = i === active;
              return (
                <g key={item.key}>
                  <path
                    d={d}
                    stroke={LIGHT}
                    strokeWidth={12}
                    strokeOpacity={on && (seen || reduce) ? 0.12 : 0}
                    className="transition-[stroke-opacity] dur-base ease-brand"
                  />
                  <motion.path
                    d={d}
                    className="stroke-primary transition-[stroke-opacity,stroke-width] dur-base ease-brand"
                    strokeOpacity={on ? 0.75 : 0.28}
                    strokeWidth={on ? 1.75 : 1.25}
                    initial={reduce ? false : { pathLength: 0 }}
                    animate={{ pathLength: seen || reduce ? 1 : 0 }}
                    transition={{ duration: 0.9, delay: 0.25 + i * 0.07, ease: EASE }}
                  />
                  {reduce ? null : (
                    <g
                      style={{ opacity: seen ? 1 : 0, transitionDelay: `${1.1 + i * 0.07}s` }}
                      className="transition-opacity duration-700"
                    >
                      {/* Keyed by state, so a connector that has just been
                          selected starts its fast run from the hub rather than
                          jumping mid-stride when its pace changes. */}
                      <Stream
                        key={`f${on}`}
                        d={d}
                        dash={DASH}
                        run={on ? RUN_LIT : RUN}
                        delay={-i * 0.61}
                        lit={on}
                      />
                      {twoWay[i] ? (
                        <Stream
                          key={`b${on}`}
                          d={d}
                          dash={DASH}
                          run={on ? RUN_LIT : RUN}
                          delay={-i * 0.61 - 1.3}
                          lit={on}
                          back
                        />
                      ) : null}
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        ) : null}

        {/* -- the hub -- */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 size-[clamp(7.5rem,16cqw,9rem)] -translate-x-1/2 -translate-y-1/2">
          {live ? (
            <span data-flow-paused={running ? undefined : ""} className="absolute inset-0">
              <HubRipples inward={inward} />
            </span>
          ) : null}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.8 }}
            animate={seen ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative size-full rounded-pill shadow-[0_24px_44px_-16px_rgb(11_63_107/0.55)]"
          >
            <HubDisc className="absolute inset-0 size-full" />
            <p className="absolute inset-0 grid place-items-center px-3 text-center text-2xl leading-[1.05] font-light tracking-[-0.03em] text-balance text-on-panel">
              {hub}
            </p>
          </motion.div>
        </div>

        {/* -- the nodes -- opaque, because every connector ends under one
            and its packets must not shimmer through the type. */}
        <div role="tablist" aria-label={data.eyebrow} onKeyDown={onKey} className="absolute inset-0">
          {items.map((item, i) => {
            const on = i === active;
            return (
              <motion.div
                key={item.key}
                role="presentation"
                style={{
                  left: `calc(50% + (50% - ${INSET_X}rem) * ${at[i].fx})`,
                  top: `calc(50% + (50% - ${INSET_Y}rem) * ${at[i].fy})`,
                }}
                initial={reduce ? false : { opacity: 0, y: 14, scale: 0.94 }}
                animate={seen ? { opacity: 1, y: 0, scale: 1 } : undefined}
                transition={{ duration: 0.6, delay: 0.45 + i * 0.06, ease: EASE }}
                className="absolute w-48 -translate-x-1/2 -translate-y-1/2"
              >
                <button
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={tabId(i)}
                  aria-selected={on}
                  aria-controls={panelId}
                  tabIndex={on ? 0 : -1}
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") setActive(i);
                  }}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left ring-1 transition dur-base ease-brand ${
                    on
                      ? "-translate-y-1 bg-canvas shadow-[0_20px_36px_-18px_rgb(25_114_185/0.5)] ring-primary/45"
                      : "bg-linear-to-b from-canvas to-surface shadow-[0_10px_24px_-18px_rgb(11_63_107/0.35),inset_0_1px_0_rgb(255_255_255)] ring-border hover:-translate-y-0.5 hover:ring-primary/30"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`grid size-9 shrink-0 place-items-center rounded-pill transition-colors dur-base ease-brand ${
                      on ? "disc-blue text-white" : "bg-surface text-primary ring-1 ring-border"
                    }`}
                  >
                    <FlowGlyph id={item.key} className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm leading-snug font-medium text-ink">{item.name}</span>
                    {item.vendor ? (
                      <span className="mt-1 block font-mono text-[0.6875rem] leading-snug tracking-caps text-ink-subtle uppercase">
                        {item.vendor}
                      </span>
                    ) : null}
                  </span>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* -- the card --------------------------------------------------------- */}
      {/* Beside the ring when there is room for both — 67rem is the ring's
          44 plus the card's 20 and the gap — and under it when there is not.
          Its own container: under the ring it is wide enough to set the line
          beside the name rather than below it. */}
      <div className="@container mx-auto w-full max-w-[56rem] @min-[67rem]:max-w-none">
        <div
          role="tabpanel"
          id={panelId}
          aria-labelledby={tabId(active)}
          tabIndex={0}
          className="rounded-2xl bg-canvas p-6 shadow-[0_24px_48px_-30px_rgb(11_63_107/0.45)] ring-1 ring-border sm:p-7"
        >
          <div className="grid">
            {items.map((item, i) => {
              const on = i === active;
              return (
                <div
                  key={item.key}
                  aria-hidden={!on}
                  className={`col-start-1 row-start-1 grid gap-x-10 transition-[opacity,translate,visibility] ease-brand @min-[34rem]:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] @min-[34rem]:items-center ${
                    on
                      ? "visible translate-y-0 opacity-100 delay-150 duration-300"
                      : "invisible translate-y-1.5 opacity-0 duration-150"
                  }`}
                >
                  <div>
                    <span
                      aria-hidden
                      className="disc-blue grid size-11 place-items-center rounded-pill text-white"
                    >
                      <FlowGlyph id={item.key} className="size-5" strokeWidth={1.8} />
                    </span>
                    <h3 className="mt-5 text-2xl leading-[1.12] font-light tracking-[-0.025em] text-balance text-ink">
                      {item.name}
                    </h3>
                    <div className="mt-3">
                      <FlowRoute item={item} hub={hub} inward={inward} twoWay={twoWay[i]} />
                    </div>
                  </div>
                  <p className="mt-4 max-w-[52ch] text-base text-ink-muted @min-[34rem]:mt-0">{item.line}</p>
                </div>
              );
            })}
          </div>

          {/* Where you are on the ring. */}
          <div aria-hidden className="mt-6 flex items-center gap-1.5">
            {items.map((item, i) => (
              <span
                key={item.key}
                className={`h-[3px] rounded-pill transition-[width,background-color] dur-base ease-brand ${
                  i === active ? "w-6 bg-primary" : "w-2.5 bg-border-strong"
                }`}
              />
            ))}
            <span className="ml-auto font-mono text-[0.6875rem] tracking-caps text-ink-subtle tabular-nums">
              <span className="text-ink">{pad(active)}</span> / {pad(n - 1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
