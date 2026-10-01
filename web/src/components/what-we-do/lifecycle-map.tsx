"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";

import { VIEWPORT } from "@/components/motion/reveal";
import {
  CAPABILITY_NAME,
  CAPABILITY_TAGLINE,
  type CapabilityId,
  type WHAT_WE_DO,
} from "@/lib/what-we-do-content";

import { CAPABILITY_ICON, CapabilityChip } from "./capability-chip";

type Data = (typeof WHAT_WE_DO)["fits"];

/**
 * How it fits together — the client's table, drawn as the thing it describes,
 * with the section's own sentence drawn on top of it.
 *
 * The table: three stages on a time axis (Build, Run, Improve), the
 * capabilities stacked under each — one, two, three — and the two that run
 * "across all stages" as bars the full width of the chart.
 *
 * The sentence: "an implementation becomes a support relationship, a health
 * check turns into an optimization roadmap, and every release touches your
 * integrations". Those three handovers are connectors between the bars —
 * faint dashed lines that are always running, and one at a time lit: the line
 * draws from one capability to the next, a light travels it, and the caption
 * underneath says it in words. On its own the map steps through the three;
 * point at (or tab to) a capability and it holds on that one's handover, with
 * everything not involved stepping back. The two without a handover show
 * their tagline instead.
 *
 * The connectors are measured from the bars, not drawn on a fixed canvas, so
 * they meet the bars exactly at any width.
 *
 * Reduced motion: no draw-on, no running dashes, no travelling light and no
 * auto-advance — the map waits for a pointer, a focus or a pip.
 *
 * Phones get the same table stacked, with the three handovers listed under it:
 * a time axis three columns wide is about 100px a column at 360px, which
 * cannot hold a capability's name, let alone a line between two of them.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/** When the first handover lights: once the bars have drawn on. */
const FIRST = 1900;
/** How long each handover holds before the map moves to the next. */
const HOLD = 3800;
/** Space between a connector's ends and the bars it joins. */
const GAP = 4;
/** How far a same-stage connector swings out past the bars' edge. */
const SWING = 14;

const draw: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0 round 12px)" },
  shown: (col: number) => ({
    clipPath: "inset(0 0% 0 0 round 12px)",
    transition: { duration: 0.75, delay: 0.15 + col * 0.22, ease: EASE },
  }),
};

const connectors: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0.6, delay: 1.35 } },
};

type Box = { l: number; t: number; r: number; b: number };
type Route = { d: string; end: readonly [number, number]; dir: readonly [number, number] };

/** The line from one bar to the next, by how the two sit relative to each other. */
function route(a: Box, b: Box): Route {
  const acx = (a.l + a.r) / 2;
  const acy = (a.t + a.b) / 2;
  const bcy = (b.t + b.b) / 2;

  /* Side by side: straight across the gap between the two stages. */
  if (a.t < b.b && b.t < a.b) {
    const x1 = a.r + GAP;
    const x2 = b.l - GAP;
    return { d: `M${x1} ${acy}H${x2}`, end: [x2, acy], dir: [1, 0] };
  }

  /* One above the other in the same stage: out round the edge and back in. */
  if (Math.abs(a.l - b.l) < 2 && Math.abs(a.r - b.r) < 2) {
    const x1 = a.r + GAP;
    const x2 = b.r + GAP;
    return {
      d: `M${x1} ${acy}C${x1 + SWING} ${acy} ${x2 + SWING} ${bcy} ${x2} ${bcy}`,
      end: [x2, bcy],
      dir: [-1, 0],
    };
  }

  /* Down into a full-width bar, straight below the one it leaves. */
  const y1 = a.b + GAP;
  const y2 = b.t - GAP;
  return { d: `M${acx} ${y1}V${y2}`, end: [acx, y2], dir: [0, 1] };
}

/** An open arrowhead at the connector's far end, pointing the way it runs. */
function arrowhead({ end: [x, y], dir: [ux, uy] }: Route) {
  const bx = x - ux * 7;
  const by = y - uy * 7;
  const px = -uy * 4.5;
  const py = ux * 4.5;
  return `M${bx + px} ${by + py}L${x} ${y}L${bx - px} ${by - py}`;
}

export function LifecycleMap({ data }: { data: Data }) {
  const reduce = useReducedMotion();
  const chart = useRef<HTMLDivElement>(null);
  const bars = useRef(new Map<CapabilityId, HTMLElement>());
  const inView = useInView(chart, { amount: 0.35 });

  const [routes, setRoutes] = useState<Route[] | null>(null);
  const [held, setHeld] = useState<CapabilityId | null>(null);
  const [tick, setTick] = useState(-1);

  const { handovers } = data;
  const running = !reduce && inView && held === null;

  /* Measure the connectors whenever the chart or any bar changes size. */
  useLayoutEffect(() => {
    const box = chart.current;
    if (!box) return;
    const measure = () => {
      const o = box.getBoundingClientRect();
      const rel = (id: CapabilityId): Box | null => {
        const r = bars.current.get(id)?.getBoundingClientRect();
        return r
          ? { l: r.left - o.left, t: r.top - o.top, r: r.right - o.left, b: r.bottom - o.top }
          : null;
      };
      const next: Route[] = [];
      for (const h of handovers) {
        const a = rel(h.from);
        const b = rel(h.to);
        if (!a || !b) return setRoutes(null);
        next.push(route(a, b));
      }
      setRoutes(next);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    bars.current.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [handovers]);

  /* Step through the handovers while the map is on screen and nobody is pointing. */
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(
      () => setTick((i) => (i + 1) % handovers.length),
      tick < 0 ? FIRST : HOLD,
    );
    return () => window.clearTimeout(t);
  }, [running, tick, handovers.length]);

  const active = held ? handovers.findIndex((h) => h.from === held || h.to === held) : tick;
  const on = active >= 0 ? handovers[active] : null;
  const lit = (id: CapabilityId) => id === held || on?.from === id || on?.to === id;
  const dim = (id: CapabilityId) => held !== null && !lit(id);

  const stageOf = new Map<CapabilityId, number>(
    data.stages.flatMap((stage, s) => stage.capabilities.map((id) => [id, s] as const)),
  );
  const litStage = (s: number) =>
    on
      ? stageOf.get(on.from) === s || stageOf.get(on.to) === s
      : held !== null && stageOf.get(held) === s;

  /* Built once: one row per capability, its column its stage. */
  const rows = data.stages.flatMap((stage, s) =>
    stage.capabilities.map((id, k) => ({ id, s, k })),
  );
  const depth = Math.max(...data.stages.map((stage) => stage.capabilities.length));

  const hold = (id: CapabilityId) => ({
    ref: (el: HTMLAnchorElement | null) => {
      if (el) bars.current.set(id, el);
      else bars.current.delete(id);
    },
    onPointerEnter: () => setHeld(id),
    onFocus: () => setHeld(id),
    onBlur: () => setHeld(null),
  });

  return (
    <>
      {/* ===================== tablet and up: the map ======================== */}
      <div className="mt-14 hidden md:block">
        <div ref={chart} className="relative" onPointerLeave={() => setHeld(null)}>
          {/* Column guides, behind everything — the axis the bars hang off. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 grid grid-cols-3 gap-x-8 lg:gap-x-10"
          >
            {data.stages.map((stage, s) => (
              <div
                key={stage.name}
                className={`rounded-2xl border border-dashed transition-colors dur-slow ease-brand ${
                  litStage(s) ? "border-white/28 bg-white/3" : "border-white/10"
                }`}
              />
            ))}
          </div>

          <div className="relative grid grid-cols-3 gap-x-8 lg:gap-x-10">
            {data.stages.map((stage) => (
              <div key={stage.name} className="px-4 pt-6 pb-7 lg:px-5 lg:pt-7 lg:pb-8">
                <p className="text-2xl leading-none font-light tracking-[-0.02em] text-on-panel uppercase">
                  {stage.name}
                </p>
                <p className="mt-3 max-w-[26ch] text-sm text-on-panel/65">{stage.line}</p>
              </div>
            ))}
          </div>

          <motion.ol
            initial={reduce ? undefined : "hidden"}
            whileInView="shown"
            viewport={VIEWPORT}
            className="relative grid grid-cols-3 gap-x-8 gap-y-2.5 pb-4 lg:gap-x-10 lg:pb-5"
          >
            {rows.map(({ id, s, k }) => {
              const Icon = CAPABILITY_ICON[id];
              return (
                <motion.li
                  key={id}
                  custom={s}
                  variants={reduce ? undefined : draw}
                  className="px-4 lg:px-5"
                  style={{ gridColumn: s + 1, gridRow: k + 1 }}
                >
                  <a
                    href={`#${id}`}
                    {...hold(id)}
                    className={`group/bar flex min-h-14 items-center gap-3 rounded-xl px-4 py-3 text-sm text-on-panel ring-1 transition dur-base ease-brand ${
                      lit(id)
                        ? "bg-white/14 ring-white/45"
                        : "bg-white/7 ring-white/12 hover:bg-white/14 hover:ring-white/30"
                    } ${dim(id) ? "opacity-40" : "opacity-100"}`}
                  >
                    <span
                      aria-hidden
                      className={`grid size-8 shrink-0 place-items-center rounded-pill transition-colors dur-base ease-brand ${
                        lit(id) ? "bg-primary" : "bg-white/10"
                      }`}
                    >
                      <Icon className="size-4" strokeWidth={1.9} />
                    </span>
                    <span className="min-w-0 flex-1 leading-snug">{CAPABILITY_NAME[id]}</span>
                    <ArrowDown
                      aria-hidden
                      className="size-3.5 shrink-0 opacity-0 transition dur-base ease-brand group-hover/bar:opacity-100 group-focus-visible/bar:opacity-100"
                      strokeWidth={2}
                    />
                  </a>
                </motion.li>
              );
            })}

            {data.across.map((row, i) => {
              const id = row.capability;
              const Icon = CAPABILITY_ICON[id];
              return (
                <motion.li
                  key={id}
                  custom={data.stages.length}
                  variants={reduce ? undefined : draw}
                  className="px-4 lg:px-5"
                  style={{ gridColumn: "1 / -1", gridRow: depth + 1 + i }}
                >
                  <a
                    href={`#${id}`}
                    {...hold(id)}
                    className={`group/bar grad-primary-deep flex min-h-16 flex-wrap items-center gap-x-4 gap-y-1 rounded-xl px-4 py-3.5 text-on-panel ring-1 transition dur-base ease-brand ${
                      lit(id) ? "ring-white/70" : "ring-white/15 hover:ring-white/45"
                    } ${dim(id) ? "opacity-50" : "opacity-100"}`}
                  >
                    <span
                      aria-hidden
                      className="grid size-8 shrink-0 place-items-center rounded-pill bg-white/15"
                    >
                      <Icon className="size-4" strokeWidth={1.9} />
                    </span>
                    <span className="text-sm font-medium">{CAPABILITY_NAME[id]}</span>
                    <span className="text-sm text-on-panel/80">{row.line}</span>
                    <span className="ml-auto inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-caps text-on-panel/80 uppercase">
                      {data.acrossLabel}
                      <ArrowDown
                        aria-hidden
                        className="size-3.5 transition-transform dur-base ease-brand group-hover/bar:translate-y-0.5"
                        strokeWidth={2}
                      />
                    </span>
                  </a>
                </motion.li>
              );
            })}
          </motion.ol>

          {/* The handovers — over the bars, so an arrowhead is never under one. */}
          {routes ? (
            <motion.svg
              aria-hidden
              initial={reduce ? undefined : "hidden"}
              whileInView="shown"
              viewport={VIEWPORT}
              variants={connectors}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute inset-0 size-full overflow-visible"
            >
              {routes.map((r, i) => (
                <g
                  key={handovers[i].from}
                  className={`transition-opacity dur-base ease-brand ${
                    on && active !== i ? "opacity-35" : "opacity-100"
                  }`}
                >
                  <path
                    d={r.d}
                    stroke="var(--color-on-panel)"
                    strokeOpacity={0.32}
                    strokeWidth={1.5}
                    strokeDasharray="6 8"
                    className="dash-flow"
                  />
                  <path
                    d={arrowhead(r)}
                    stroke="var(--color-on-panel)"
                    strokeOpacity={0.45}
                    strokeWidth={1.5}
                  />
                </g>
              ))}
              {on && routes[active] ? (
                <LiveRoute key={active} route={routes[active]} still={!!reduce} />
              ) : null}
            </motion.svg>
          ) : null}
        </div>

        {/* The handover in words, and one pip per handover to jump to it. */}
        <div className="mt-6 flex items-center gap-5 border-t border-white/10 pt-4">
          <div role="group" aria-label={data.handoverLabel} className="-ml-2.5 flex shrink-0">
            {handovers.map((h, i) => (
              <button
                key={h.from}
                type="button"
                onClick={() => setTick(i)}
                aria-pressed={active === i}
                aria-label={`${CAPABILITY_NAME[h.from]} to ${CAPABILITY_NAME[h.to]}`}
                className="group/pip grid h-11 w-10 cursor-pointer place-items-center"
              >
                <span
                  className={`relative h-1 overflow-hidden rounded-pill bg-white/22 transition-[width,background-color] dur-base ease-brand group-hover/pip:bg-white/40 ${
                    active === i ? "w-8" : "w-3.5"
                  }`}
                >
                  {active === i ? (
                    <motion.span
                      key={`${tick}-${running}`}
                      className="absolute inset-0 origin-left rounded-pill bg-on-panel"
                      initial={{ scaleX: running ? 0 : 1 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: running ? HOLD / 1000 : 0, ease: "linear" }}
                    />
                  ) : null}
                </span>
              </button>
            ))}
          </div>

          <div aria-live={running ? "off" : "polite"} className="min-w-0 flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={on ? `h${active}` : (held ?? "prompt")}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="flex flex-wrap items-baseline gap-x-5 gap-y-1"
              >
                {on ? (
                  <>
                    <p className="text-lg font-light text-on-panel">{on.line}</p>
                    <p className="inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-caps text-on-panel/60 uppercase">
                      {CAPABILITY_NAME[on.from]}
                      <ArrowRight aria-hidden className="size-3 text-accent" strokeWidth={2} />
                      {CAPABILITY_NAME[on.to]}
                    </p>
                  </>
                ) : held ? (
                  <>
                    <p className="text-lg font-light text-on-panel">{CAPABILITY_TAGLINE[held]}</p>
                    <p className="font-mono text-[0.6875rem] tracking-caps text-on-panel/60 uppercase">
                      {CAPABILITY_NAME[held]}
                    </p>
                  </>
                ) : (
                  <p className="text-lg font-light text-on-panel/60">{data.handoverPrompt}</p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ======================= phones: the same table ======================= */}
      <ol className="mt-12 space-y-3 md:hidden">
        {data.stages.map((stage) => (
          <li key={stage.name} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <p className="text-xl leading-none font-light tracking-[-0.02em] text-on-panel uppercase">
              {stage.name}
            </p>
            <p className="mt-3 text-sm text-on-panel/65">{stage.line}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {stage.capabilities.map((id) => (
                <li key={id}>
                  <CapabilityChip id={id} tone="dark" />
                </li>
              ))}
            </ul>
          </li>
        ))}
        <li className="grad-primary-deep rounded-2xl p-6">
          <p className="font-mono text-[0.6875rem] tracking-caps text-on-panel/80 uppercase">
            {data.acrossLabel}
          </p>
          <ul className="mt-4 space-y-4">
            {data.across.map((row) => (
              <li key={row.capability}>
                <CapabilityChip id={row.capability} tone="dark" />
                <p className="mt-2 text-sm text-on-panel/80">{row.line}</p>
              </li>
            ))}
          </ul>
        </li>
        <li className="rounded-2xl p-6 ring-1 ring-white/10 ring-inset">
          <p className="font-mono text-[0.6875rem] tracking-caps text-on-panel/80 uppercase">
            {data.handoverLabel}
          </p>
          <ul className="mt-4 space-y-5">
            {handovers.map((h) => (
              <li key={h.from}>
                <p className="text-on-panel">{h.line}</p>
                <p className="mt-1.5 inline-flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.6875rem] tracking-caps text-on-panel/60 uppercase">
                  {CAPABILITY_NAME[h.from]}
                  <ArrowRight aria-hidden className="size-3 text-accent" strokeWidth={2} />
                  {CAPABILITY_NAME[h.to]}
                </p>
              </li>
            ))}
          </ul>
        </li>
      </ol>
    </>
  );
}

/**
 * The lit handover: the line draws from one capability to the next, the
 * arrowhead lands, then a light runs the line on a loop. Keyed by handover, so
 * each one draws fresh when it comes round.
 *
 * The light is SMIL, not Motion: it has to follow a path, which CSS
 * offset-path still cannot be trusted to do on an SVG element. It is started
 * by hand so every handover's first run begins at the source, not wherever the
 * document clock happens to be.
 */
function LiveRoute({ route: r, still }: { route: Route; still: boolean }) {
  const travel = useRef<SVGAnimationElement>(null);
  const fade = useRef<SVGAnimationElement>(null);

  useEffect(() => {
    travel.current?.beginElementAt(0.55);
    fade.current?.beginElementAt(0.55);
  }, []);

  const drawOn = {
    initial: still ? false : { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: 0.55, ease: EASE },
  } as const;

  return (
    <g>
      <motion.path d={r.d} stroke="var(--color-primary)" strokeWidth={5} strokeOpacity={0.6} {...drawOn} />
      <motion.path d={r.d} stroke="var(--color-on-panel)" strokeWidth={1.75} {...drawOn} />
      <motion.path
        d={arrowhead(r)}
        stroke="var(--color-accent)"
        strokeWidth={2}
        initial={still ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.45 }}
      />
      {still ? null : (
        <g opacity={0}>
          <circle r={7} fill="var(--color-primary)" opacity={0.55} />
          <circle r={2.75} fill="var(--color-on-panel)" />
          <animateMotion
            ref={travel}
            begin="indefinite"
            dur="2.4s"
            repeatCount="indefinite"
            path={r.d}
            calcMode="spline"
            keyPoints="0;1;1"
            keyTimes="0;0.6;1"
            keySplines="0.45 0 0.25 1;0 0 1 1"
          />
          <animate
            ref={fade}
            attributeName="opacity"
            begin="indefinite"
            dur="2.4s"
            repeatCount="indefinite"
            values="0;1;1;0;0"
            keyTimes="0;0.1;0.52;0.62;1"
          />
        </g>
      )}
    </g>
  );
}
