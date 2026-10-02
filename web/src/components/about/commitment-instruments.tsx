"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

import { Counter } from "@/components/ui/counter";

/*
 * The instruments for three of the four commitments (the fourth, the working
 * day, is `commitment-working-day.tsx`).
 *
 * **Nothing here states a figure of its own.** Every number an instrument
 * draws is read out of the commitment's own proof sentence by `figures()` —
 * "200+", "11 to 15+", "100%" — so the sentence and the drawing cannot
 * disagree, and an edit to the sentence moves the instrument with it. A
 * sentence that stops carrying a figure gets no instrument rather than a
 * stale one. The scale ends, tick counts and ring geometry are presentation.
 *
 * All three are `aria-hidden`: the sentence beside each one says the same
 * thing in words, and says it first. Each starts when its proof panel enters
 * view (`on`), at the same moment and on the same long out-expo as the
 * `Counter` it carries, so the drawing and the number land together. Reduced
 * motion gets the finished instrument.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export type Figure = { value: number; suffix: string };

/** The figures a sentence states, in order: "200+" is `{ value: 200, suffix: "+" }`. */
export function figures(text: string): Figure[] {
  return Array.from(text.matchAll(/(\d+)(\+|%)?/g), (m) => ({
    value: Number(m[1]),
    suffix: m[2] ?? "",
  }));
}

/* ------------------------------------------------------------------------ */

const TICKS = 40;

/**
 * 01 — the experience, as a readout and a meter: the figure counting up large,
 * and under it forty ticks lighting left to right in step with it, with a
 * point of light running at the head of the fill and coming to rest at the
 * end. A ruler rather than a bar: every fifth tick is taller, which is what
 * makes it read as something measured.
 */
export function YearsMeter({ figure, on }: { figure: Figure; on: boolean }) {
  const reduce = useReducedMotion();
  const shown = !!reduce || on;
  const ticks = (lit: boolean) =>
    Array.from({ length: TICKS }, (_, i) => (
      <span
        key={i}
        className={`w-0.5 rounded-pill ${i % 5 === 0 ? "h-full" : "h-1/2"} ${
          lit ? "bg-on-panel" : "bg-white/15"
        }`}
      />
    ));

  return (
    <div aria-hidden>
      <p className="text-5xl leading-none font-light tracking-[-0.045em] text-on-panel tabular-nums">
        <Counter value={figure.value} suffix={figure.suffix} immediate={on} />
      </p>
      <div className="relative mt-7 h-7">
        <div className="absolute inset-0 flex items-end justify-between">{ticks(false)}</div>
        <motion.div
          className="absolute inset-0 flex items-end justify-between"
          initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
          animate={shown ? { clipPath: "inset(0 0% 0 0)" } : undefined}
          transition={{ duration: 1.6, ease: EASE }}
        >
          {ticks(true)}
        </motion.div>
        <motion.div
          className="absolute inset-y-0 left-0 w-full"
          initial={reduce ? false : { x: "-100%", opacity: 0 }}
          animate={shown ? { x: "0%", opacity: 1 } : undefined}
          transition={{ duration: 1.6, ease: EASE, opacity: { duration: 0.25 } }}
        >
          <span className="absolute -top-2 right-0 size-8 translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(0_142_255/0.75),rgb(0_142_255/0.18)_55%,transparent)]" />
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

/**
 * 02 — the tenure, as a band on a scale of years: a ruler from nought, ticked
 * every year and numbered every five, with the sentence's range lit on it.
 * The band grows from its lower figure to its upper one; where the upper
 * figure carries a "+", the band does not stop at it but runs on and fades,
 * which is what a plus means. The two figures sit over the band's ends as the
 * instrument's readout.
 *
 * The scale runs a quarter past the upper figure, to the next five — 15+
 * gives 0 to 20 — so the band sits in the scale rather than against its end.
 */
export function TenureScale({ from, to, on }: { from: Figure; to: Figure; on: boolean }) {
  const reduce = useReducedMotion();
  const shown = !!reduce || on;
  const max = Math.max(5, Math.ceil((to.value * 1.25) / 5) * 5);
  const pct = (v: number) => (Math.min(Math.max(v, 0), max) / max) * 100;
  const years = Array.from({ length: max + 1 }, (_, y) => y);
  const plus = to.suffix === "+";
  const tail = Math.min(max, to.value + max * 0.14);

  return (
    <div aria-hidden className="px-1">
      {/* The readout. */}
      <div className="relative h-8 @md:h-10">
        {[from, to].map((f, k) => (
          <motion.span
            key={k}
            style={{ left: `${pct(f.value)}%` }}
            className="absolute bottom-0 -translate-x-1/2 text-xl leading-none font-light tracking-[-0.02em] whitespace-nowrap text-on-panel tabular-nums @md:text-2xl"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={shown ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.25 + k * 0.55, ease: EASE }}
          >
            {f.value}
            {f.suffix}
          </motion.span>
        ))}
      </div>

      {/* The scale, and the band on it. */}
      <div className="relative mt-3 h-6">
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/15" />
        {years.map((y) => (
          <span
            key={y}
            style={{ left: `${pct(y)}%` }}
            className={`absolute top-1/2 w-px -translate-x-1/2 -translate-y-1/2 ${
              y % 5 === 0 ? "h-4 bg-white/45" : "h-2 bg-white/20"
            }`}
          />
        ))}
        {plus ? (
          <motion.span
            style={{ left: `${pct(to.value)}%`, width: `${pct(tail) - pct(to.value)}%` }}
            className="absolute top-1/2 h-2.5 origin-left -translate-y-1/2 rounded-r-pill bg-linear-to-r from-primary to-transparent"
            initial={reduce ? false : { opacity: 0, scaleX: 0 }}
            animate={shown ? { opacity: 1, scaleX: 1 } : undefined}
            transition={{ duration: 0.7, delay: 1.0, ease: EASE }}
          />
        ) : null}
        <motion.span
          style={{ left: `${pct(from.value)}%`, width: `${pct(to.value) - pct(from.value)}%` }}
          className="grad-primary absolute top-1/2 h-2.5 origin-left -translate-y-1/2 rounded-pill shadow-[0_0_18px_rgb(0_142_255/0.55)]"
          initial={reduce ? false : { scaleX: 0 }}
          animate={shown ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.95, delay: 0.25, ease: EASE }}
        />
      </div>

      {/* The axis, every five. */}
      <div className="relative mt-2 h-4 font-mono text-[0.6875rem] text-on-panel/60 tabular-nums">
        {years
          .filter((y) => y % 5 === 0)
          .map((y) => (
            <span key={y} style={{ left: `${pct(y)}%` }} className="absolute -translate-x-1/2">
              {y}
            </span>
          ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

const DIAL_TICKS = 60;

/**
 * 04 — the retention, as a ring that closes: the share drawn round a dial
 * from twelve o'clock while the figure counts up inside it. At 100% the ring
 * meets itself, which is the whole statement — nothing left open.
 */
export function RetentionRing({ figure, on }: { figure: Figure; on: boolean }) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const shown = !!reduce || on;
  const share = figure.suffix === "%" ? Math.min(1, figure.value / 100) : 1;

  return (
    <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[13.5rem]">
      <svg
        viewBox="-60 -60 120 120"
        className="absolute inset-0 size-full -rotate-90 overflow-visible drop-shadow-[0_0_14px_rgb(0_142_255/0.3)]"
      >
        <defs>
          {/* The brand blue, pale where the ring starts to deep where it
              closes. Literal stops: SVG cannot read a token. */}
          <linearGradient id={`${uid}-ring`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a3deff" />
            <stop offset="0.5" stopColor="#008eff" />
            <stop offset="1" stopColor="#1972b9" />
          </linearGradient>
        </defs>
        {Array.from({ length: DIAL_TICKS }, (_, i) => {
          const a = (i / DIAL_TICKS) * Math.PI * 2;
          const r0 = i % 5 === 0 ? 52 : 54;
          return (
            <line
              key={i}
              x1={(r0 * Math.cos(a)).toFixed(2)}
              y1={(r0 * Math.sin(a)).toFixed(2)}
              x2={(57 * Math.cos(a)).toFixed(2)}
              y2={(57 * Math.sin(a)).toFixed(2)}
              stroke="currentColor"
              strokeWidth={i % 5 === 0 ? 1 : 0.6}
              className={i % 5 === 0 ? "text-white/40" : "text-white/18"}
            />
          );
        })}
        <circle r={45} fill="none" stroke="currentColor" strokeWidth={6} className="text-white/8" />
        <motion.circle
          r={45}
          fill="none"
          stroke={`url(#${uid}-ring)`}
          strokeWidth={6}
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={shown ? { pathLength: share } : undefined}
          transition={{ duration: 1.6, ease: EASE }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <p className="text-3xl leading-none font-light tracking-[-0.03em] text-on-panel tabular-nums">
          <Counter value={figure.value} suffix={figure.suffix} immediate={on} />
        </p>
      </div>
    </div>
  );
}
