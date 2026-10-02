"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { Earth } from "lucide-react";

/* The drawing is a 0-100 box with the rings on its centre. */
const C = 50;
const INNER = 15;
const OUTER = 45;
/** Half a tick's length. */
const TICK = 1.3;
/** Past this a ring of ticks is a solid band, and the CMS could hand a figure
    of any size; the inner disc's dots stop being dots sooner. */
const MAX_TICKS = 240;
const MAX_DOTS = 24;

const EASE = [0.22, 1, 0.36, 1] as const;

export type Ring = {
  /** How many marks the ring carries — one per country the figure counts. */
  count: number;
  lit: boolean;
  /** The partners' ring. It wears the amber and its callout stands on the
      right, the third-party panel's side; Workday's own rings wear the blue
      and stand on the left, under Workday Payroll. */
  partner: boolean;
  /** Where its callout's leader meets it, as a share of the drawing's height. */
  y: number;
};

/** The rings' radii, inside out: the first is a disc, the last the rim. */
export function ringRadius(i: number, n: number) {
  return n <= 1 ? OUTER : INNER + ((OUTER - INNER) * i) / (n - 1);
}

/**
 * Where each figure's leader runs, as a share of the drawing's height.
 *
 * The partners' figure stands alone on its side, level with the centre. The
 * others share the left, inner rings lower and outer higher, so no leader runs
 * across another figure's copy: with the document's three that puts the native
 * countries at 62% and Strada at 25%, which leaves the native callout room
 * below its line for its six countries.
 */
export function leaderY(i: number, n: number, partner: boolean) {
  if (partner) return 50;
  const left = Math.max(1, n - 1);
  if (left === 1) return 50;
  return 62 - (37 * i) / (left - 1);
}

const f = (v: number) => v.toFixed(2);

/** One radial tick per country round a ring, as a single path. */
function tickPath(count: number, r: number) {
  let d = "";
  const total = Math.min(count, MAX_TICKS);
  for (let k = 0; k < total; k++) {
    const a = (k / total) * Math.PI * 2 - Math.PI / 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    d += `M${f(C + (r - TICK) * c)} ${f(C + (r - TICK) * s)}L${f(C + (r + TICK) * c)} ${f(C + (r + TICK) * s)}`;
  }
  return d;
}

/** The inner disc's countries, as points round its rim from twelve o'clock. */
function dotPoints(count: number, r: number) {
  const total = Math.min(count, MAX_DOTS);
  return Array.from({ length: total }, (_, k) => {
    const a = (k / total) * Math.PI * 2 - Math.PI / 2;
    return [f(C + r * Math.cos(a)), f(C + r * Math.sin(a))] as const;
  });
}

/**
 * The reach, drawn: three rings, one inside the next, each carrying one mark
 * per country its figure counts — six dots round the native disc, sixty ticks
 * round Strada, a hundred and eighty round the partners' rim. The figures are
 * the density of the drawing, not a label on it.
 *
 * A ring lights by SWEEPING on from twelve o'clock: a mask drawn round with
 * `pathLength` uncovers its coloured marks and its halo, inside rings first.
 * Going out it retracts the same way, faster. Lit, a short run of light goes
 * round it (`.reach-orbit`), paused whenever the instrument is off screen and
 * never drawn under reduced motion.
 *
 * Wide screens also draw the leaders' last stretch — from the drawing's edge to
 * a node on the ring — so the callouts' lines arrive exactly on their rings at
 * any size: the line and the node are in the drawing's own units, and the
 * callouts sit at the same shares of its height.
 *
 * Decoration over text. The figures, their labels and the native countries are
 * all in the callouts, which assistive technology reads; this is `aria-hidden`.
 */
export function ReachRings({
  rings,
  delay,
  still,
  className = "",
}: {
  rings: readonly Ring[];
  /** Before the first ring sweeps on, in seconds — the instrument's own rise. */
  delay: number;
  /** Reduced motion: every change is a cut. */
  still: boolean;
  className?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const n = rings.length;
  const colour = (ring: Ring) => (ring.partner ? "var(--color-accent)" : "var(--reach-blue)");
  /* What hangs off a ring lights once its sweep is under way, not before it. */
  const lag = (i: number) =>
    still || !rings[i].lit ? "0s" : `${(delay + i * 0.16 + 0.25).toFixed(2)}s`;

  const geometry = rings.map((ring, i) => {
    const r = ringRadius(i, n);
    const dy = ring.y - C;
    const dx = Math.sqrt(Math.max(0, r * r - dy * dy));
    return {
      r,
      core: i === 0 && n > 1,
      node: { x: ring.partner ? C + dx : C - dx, y: ring.y },
      marks: i === 0 && n > 1 ? null : tickPath(ring.count, r),
      dots: i === 0 && n > 1 ? dotPoints(ring.count, r) : [],
    };
  });

  return (
    <div className={`relative aspect-square ${className}`}>
      <svg aria-hidden viewBox="0 0 100 100" fill="none" className="absolute inset-0 size-full">
        <defs>
          {/* `.disc-blue`'s stops, written out: a gradient stop is the one
              place on the site a CSS variable is not trusted. */}
          <radialGradient id={`${uid}-core`} cx="36%" cy="26%" r="80%">
            <stop offset="0%" stopColor="#1f8ce8" />
            <stop offset="42%" stopColor="#0d6fc4" />
            <stop offset="74%" stopColor="#12599b" />
            <stop offset="100%" stopColor="#0a3d68" />
          </radialGradient>
          {geometry.map((g, i) => (
            <mask
              key={i}
              id={`${uid}-sweep-${i}`}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="100"
              height="100"
            >
              {/* The disc sweeps as a pie (a stroke as wide as the disc, round
                  half its radius); a ring as a band over its marks and halo. */}
              <motion.circle
                cx={C}
                cy={C}
                r={g.core ? (g.r + 3) / 2 : g.r}
                fill="none"
                stroke="white"
                strokeWidth={g.core ? g.r + 3 : 9}
                transform={`rotate(-90 ${C} ${C})`}
                initial={false}
                animate={{ pathLength: rings[i].lit ? 1 : 0 }}
                transition={{
                  duration: still ? 0 : rings[i].lit ? 1.1 : 0.45,
                  delay: still || !rings[i].lit ? 0 : delay + i * 0.16,
                  ease: EASE,
                }}
              />
            </mask>
          ))}
        </defs>

        {/* -- leaders, wide screens only ---------------------------------- */}
        <g className="hidden lg:inline">
          {geometry.map((g, i) => {
            const ring = rings[i];
            return (
              <line
                key={i}
                x1={ring.partner ? 100 : 0}
                y1={ring.y}
                x2={g.node.x}
                y2={ring.y}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                style={{
                  stroke: ring.lit ? colour(ring) : "var(--color-on-panel)",
                  strokeOpacity: ring.lit ? 0.7 : 0.15,
                  transition: "stroke 500ms, stroke-opacity 500ms",
                  transitionDelay: lag(i),
                }}
              />
            );
          })}
        </g>

        {/* -- the rings at rest ------------------------------------------- */}
        {geometry.map((g, i) => (
          <g key={i}>
            <circle cx={C} cy={C} r={g.r} stroke="var(--color-on-panel)" strokeOpacity={0.1} strokeWidth={0.3} />
            {g.marks ? (
              <path d={g.marks} stroke="var(--color-on-panel)" strokeOpacity={0.16} strokeWidth={0.4} />
            ) : (
              g.dots.map(([x, y], k) => (
                <circle key={k} cx={x} cy={y} r={0.9} fill="var(--color-on-panel)" fillOpacity={0.3} />
              ))
            )}
          </g>
        ))}

        {/* -- the rings lit, uncovered by their sweeps --------------------- */}
        {geometry.map((g, i) => {
          const c = colour(rings[i]);
          return (
            <g key={i} mask={`url(#${uid}-sweep-${i})`}>
              {g.core ? (
                <>
                  <circle cx={C} cy={C} r={g.r} fill={`url(#${uid}-core)`} />
                  <circle cx={C} cy={C} r={g.r + 1.6} stroke={c} strokeOpacity={0.22} strokeWidth={2.4} />
                  {g.dots.map(([x, y], k) => (
                    <g key={k}>
                      <circle cx={x} cy={y} r={2.1} fill={c} fillOpacity={0.4} />
                      <circle cx={x} cy={y} r={1} fill="var(--color-on-panel)" />
                    </g>
                  ))}
                </>
              ) : (
                <>
                  <circle cx={C} cy={C} r={g.r} stroke={c} strokeOpacity={0.14} strokeWidth={4} />
                  <path d={g.marks ?? ""} stroke={c} strokeWidth={0.5} />
                </>
              )}
            </g>
          );
        })}

        {/* -- the run of light round each lit ring ------------------------- */}
        {geometry.map((g, i) => (
          <g
            key={i}
            className="reach-orbit"
            style={{
              animationDuration: `${14 + i * 6}s`,
              animationDirection: i % 2 ? "reverse" : "normal",
            }}
          >
            <circle
              cx={C}
              cy={C}
              r={g.r}
              pathLength={1}
              strokeDasharray="0.06 0.94"
              strokeLinecap="round"
              strokeWidth={0.9}
              style={{
                stroke: colour(rings[i]),
                opacity: rings[i].lit ? 0.95 : 0,
                transition: "opacity 600ms",
                transitionDelay: lag(i),
              }}
            />
          </g>
        ))}

        {/* -- where the leaders land --------------------------------------- */}
        <g className="hidden lg:inline">
          {geometry.map((g, i) => {
            const ring = rings[i];
            const c = colour(ring);
            return (
              <g key={i}>
                <circle
                  cx={f(g.node.x)}
                  cy={g.node.y}
                  r={2.4}
                  style={{
                    fill: c,
                    fillOpacity: ring.lit ? 0.28 : 0,
                    transition: "fill-opacity 500ms",
                    transitionDelay: lag(i),
                  }}
                />
                <circle
                  cx={f(g.node.x)}
                  cy={g.node.y}
                  r={1.05}
                  style={{
                    fill: ring.lit ? c : "var(--color-on-panel)",
                    fillOpacity: ring.lit ? 1 : 0.4,
                    transition: "fill 500ms, fill-opacity 500ms",
                    transitionDelay: lag(i),
                  }}
                />
              </g>
            );
          })}
        </g>

        {/* The world the rings are drawn round. */}
        <Earth x={C - 5} y={C - 5} width={10} height={10} strokeWidth={1.4} className="text-on-panel/80" />
      </svg>
    </div>
  );
}

/**
 * The rings in miniature, as a key: which of them a model, a choice or a figure
 * stands on. Coloured as the drawing is — blue for Workday's own, amber for the
 * partners' — and the rest ghosted. On a light ground amber is a stroke here,
 * never type; `dark` lifts the blue for the instrument's ground.
 */
export function RingGlyph({
  lit,
  tone,
  className = "",
}: {
  lit: readonly boolean[];
  tone: "light" | "dark";
  className?: string;
}) {
  const n = lit.length;
  const blue = tone === "light" ? "var(--color-primary)" : "var(--reach-blue)";
  const off = tone === "light" ? "var(--color-ink)" : "var(--color-on-panel)";
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      {lit.map((on, i) => {
        const r = n <= 1 ? 10 : 3.25 + (6.75 * i) / (n - 1);
        const colour = on ? (i === n - 1 && n > 1 ? "var(--color-accent)" : blue) : off;
        const alpha = on ? 1 : 0.2;
        return i === 0 && n > 1 ? (
          <circle key={i} cx={12} cy={12} r={r} fill={colour} fillOpacity={alpha} />
        ) : (
          <circle key={i} cx={12} cy={12} r={r} stroke={colour} strokeOpacity={alpha} strokeWidth={1.8} />
        );
      })}
    </svg>
  );
}
