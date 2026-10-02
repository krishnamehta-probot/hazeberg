"use client";

import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { MotionConfig, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowLeftRight, Calculator, Check, type LucideIcon } from "lucide-react";

import { Reveal, RevealGroup, RevealItem, VIEWPORT } from "@/components/motion/reveal";
import { Counter } from "@/components/ui/counter";
import type { ServiceFeature } from "@/lib/service-content";

import { ReachRings, RingGlyph, leaderY, type Ring } from "./payroll-rings";

type Data = Extract<ServiceFeature, { kind: "models" }>;
type Model = Data["models"][number];
/** A model, by its place in the document, or both at once. */
type Mode = number | "both";

/** Presentation, not content: what each model does with the pay run. Workday
    Payroll calculates it; third-party payroll passes the record across and the
    results back. */
const MODEL_ICON: Record<string, LucideIcon> = {
  "workday-payroll": Calculator,
  "third-party": ArrowLeftRight,
};

/** The control's third choice. Micro-UI, not a claim: the two models' own
    names come from the document. */
const BOTH = "Both";

/**
 * [derived] Which rings each model stands on, from the document's own intro:
 * Workday Payroll is the native countries and Strada; past those, payroll stays
 * with a provider on a certified partner connection. So the first model covers
 * every ring but the last, and the second covers the last.
 */
const covers = (mode: Mode, ring: number, n: number) =>
  mode === "both" || (mode === 0 ? ring < n - 1 : ring === n - 1);

/** "60+" → 60 and "+", so the figure can count up and keep its suffix. */
function figure(value: string) {
  const m = /^(\d[\d,]*)(.*)$/.exec(value.trim());
  return m ? { n: Number(m[1].replace(/,/g, "")), suffix: m[2] } : null;
}

/**
 * The two models and their reach, worked by one control.
 *
 * **The models** face each other across a seam. Its disc is the two of them as
 * overlapping circles, Workday's blue and the partners' amber with the overlap
 * left white — the white is how the two colours meet without blending through
 * the grey-green every sRGB path between them runs through. The seam's two
 * arms and each panel's top edge light in its model's colour, from the seam
 * outwards, so a lit panel reads as lit FROM the middle.
 *
 * **The reach** is a dark instrument: a segmented control over the rings
 * (`payroll-rings.tsx`), and the three figures as callouts on leaders —
 * Workday's two on the left, under Workday Payroll, and the partners' on the
 * right, under third-party payroll. The control is a radiogroup: arrow keys
 * move AND choose, Home and End jump, and only the chosen option is in the tab
 * order. Its thumb travels between options as one shared element.
 *
 * Both parts answer the same state, so changing it anywhere changes it
 * everywhere: the rings sweep on or off, the panels light or settle, the seam
 * follows. It opens on "both", which is the section's title. The rings wait to
 * be seen before they first sweep on, and the figures count up as they arrive.
 *
 * Unlit never means unreadable. Unlit copy keeps its AA contrast — a panel
 * steps back by losing its colour and its lift, never its ink — and an unlit
 * figure only drops to the 3:1 large display type is allowed.
 *
 * Phones: the panels stack with the seam between them turned upright, the
 * control stacks into three full-width rows, the rings take the width, and the
 * callouts become a list keyed by a miniature of the rings.
 */
export function PayrollExplorer({ data }: { data: Data }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>("both");
  /* Until someone uses the control, the first sweep waits for the
     instrument's own rise. */
  const [touched, setTouched] = useState(false);

  const stage = useRef<HTMLDivElement>(null);
  const seen = useInView(stage, VIEWPORT);
  const onScreen = useInView(stage);
  const radios = useRef<(HTMLButtonElement | null)[]>([]);

  const { models, reach } = data;
  const n = reach.length;
  const [first, second] = models;

  const options: { mode: Mode; label: string }[] = [
    ...models.slice(0, 2).map((m, i) => ({ mode: i as Mode, label: m.name })),
    { mode: "both", label: BOTH },
  ];

  const rings: Ring[] = reach.map((r, i) => {
    const partner = n > 1 && covers(1, i, n);
    return {
      count: figure(r.value)?.n ?? 0,
      lit: seen && covers(mode, i, n),
      partner,
      y: leaderY(i, n, partner),
    };
  });

  const choose = (m: Mode) => {
    setMode(m);
    setTouched(true);
  };

  const move = (e: KeyboardEvent<HTMLButtonElement>, k: number) => {
    const count = options.length;
    const to =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? (k + 1) % count
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? (k - 1 + count) % count
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? count - 1
              : -1;
    if (to < 0) return;
    e.preventDefault();
    choose(options[to].mode);
    radios.current[to]?.focus();
  };

  const modelLit = (i: number) => mode === "both" || mode === i;
  const coverage = (i: number) => reach.map((_, r) => covers(i, r, n));

  return (
    <MotionConfig reducedMotion="user">
      {/* ======================= the two models ========================= */}
      {first && second ? (
        <RevealGroup className="mt-12 grid lg:mt-16 lg:grid-cols-[minmax(0,1fr)_7rem_minmax(0,1fr)]">
          <RevealItem className="h-full">
            <ModelPanel model={first} partner={false} lit={modelLit(0)} rings={coverage(0)} />
          </RevealItem>
          <RevealItem className="h-full">
            <Seam uid={uid} first={modelLit(0)} second={modelLit(1)} />
          </RevealItem>
          <RevealItem className="h-full">
            <ModelPanel model={second} partner lit={modelLit(1)} rings={coverage(1)} />
          </RevealItem>
        </RevealGroup>
      ) : null}

      {/* ======================= the reach ============================== */}
      <Reveal className="mt-12 lg:mt-16">
        <div
          ref={stage}
          data-run={onScreen ? "" : undefined}
          className="reach grad-ink grain relative overflow-hidden rounded-2xl px-4 pt-4 pb-9 text-on-panel sm:px-8 sm:pt-8 sm:pb-10 lg:px-12 lg:pt-10 lg:pb-16"
        >
          <div aria-hidden className="reach-glow pointer-events-none absolute inset-0" />

          {/* -- the control ---------------------------------------------- */}
          <div
            role="radiogroup"
            aria-label={data.eyebrow}
            className="relative mx-auto grid w-full max-w-[38rem] gap-1 rounded-2xl bg-white/6 p-1 ring-1 ring-white/12 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:rounded-pill"
          >
            {options.map((o, k) => {
              const on = o.mode === mode;
              return (
                <button
                  key={o.label}
                  ref={(el) => {
                    radios.current[k] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => choose(o.mode)}
                  onKeyDown={(e) => move(e, k)}
                  className={`relative flex min-h-11 cursor-pointer items-center justify-center gap-2.5 rounded-xl px-4 py-2 text-sm leading-tight font-medium transition-colors dur-base ease-brand focus-visible:outline-on-panel sm:rounded-pill sm:px-5 ${
                    on ? "text-ink" : "text-on-panel/75 hover:bg-white/6 hover:text-on-panel"
                  }`}
                >
                  {on ? (
                    <motion.span
                      layoutId={`${uid}-thumb`}
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      className="absolute inset-0 rounded-xl bg-canvas shadow-lg shadow-void/40 sm:rounded-pill"
                    />
                  ) : null}
                  <RingGlyph
                    lit={reach.map((_, r) => covers(o.mode, r, n))}
                    tone={on ? "light" : "dark"}
                    className="relative size-4 shrink-0"
                  />
                  <span className="relative">{o.label}</span>
                </button>
              );
            })}
          </div>

          {/* -- the rings and their figures ------------------------------- */}
          <div className="relative mt-10 [--rings:22rem] lg:mt-16 lg:h-(--rings) xl:[--rings:26rem]">
            <ReachRings
              rings={rings}
              delay={touched ? 0 : 0.3}
              still={!!reduce}
              className="mx-auto w-full max-w-[22rem] lg:absolute lg:top-0 lg:left-1/2 lg:w-(--rings) lg:max-w-none lg:-translate-x-1/2"
            />

            <ol className="mt-10 space-y-8 sm:grid sm:grid-cols-3 sm:gap-6 sm:space-y-0 lg:mt-0 lg:block">
              {reach.map((r, i) => (
                <Callout
                  key={r.label}
                  figureOf={r}
                  ring={rings[i]}
                  index={i}
                  count={n}
                  lag={reduce ? 0 : (touched ? 0 : 0.3) + i * 0.16 + 0.25}
                />
              ))}
            </ol>
          </div>
        </div>
      </Reveal>
    </MotionConfig>
  );
}

/* ================================ parts ================================== */

/**
 * One model. White at rest and lit in its own colour when the control covers
 * it: the edge facing the seam draws out from the seam, the glyph and every
 * check fill, and the card lifts a step. The copy never changes colour.
 */
function ModelPanel({
  model,
  partner,
  lit,
  rings,
}: {
  model: Model;
  partner: boolean;
  lit: boolean;
  rings: readonly boolean[];
}) {
  const Icon = MODEL_ICON[model.key] ?? (partner ? ArrowLeftRight : Calculator);
  /* Amber is a fill here, with ink on it (10.8:1); blue is the disc. */
  const fill = partner ? "bg-accent text-accent-ink" : "disc-blue text-white";

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl bg-canvas p-6 ring-1 transition-[box-shadow,translate] duration-500 ease-brand sm:p-8 lg:p-9 ${
        lit
          ? `shadow-xl lg:-translate-y-1 ${partner ? "shadow-accent/15 ring-accent/70" : "shadow-primary/12 ring-primary/35"}`
          : "shadow-none ring-border"
      }`}
    >
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-1 transition-transform duration-700 ease-brand ${
          partner ? "origin-left bg-accent" : "grad-primary origin-right"
        } ${lit ? "scale-x-100" : "scale-x-0"}`}
      />

      <div className="flex items-center justify-between gap-4">
        <span
          aria-hidden
          className={`grid size-12 place-items-center rounded-pill transition-colors duration-500 ease-brand ${
            lit ? fill : "bg-surface text-ink-subtle ring-1 ring-border"
          }`}
        >
          <Icon className="size-5" strokeWidth={1.8} />
        </span>
        <RingGlyph lit={rings} tone="light" className="size-9" />
      </div>

      <h3 className="mt-7 text-2xl leading-[1.12] font-light tracking-[-0.025em] text-balance text-ink">
        {model.name}
      </h3>
      <p className="mt-3 max-w-[46ch] text-base text-ink-muted">{model.line}</p>

      <ul className="mt-6 space-y-3.5 border-t border-border pt-6">
        {model.points.map((point) => (
          <li key={point} className="flex items-start gap-3 text-sm text-ink">
            <span
              aria-hidden
              className={`mt-px grid size-5 shrink-0 place-items-center rounded-pill transition-colors duration-500 ease-brand ${
                lit ? fill : "bg-surface-2 text-ink-subtle"
              }`}
            >
              <Check className="size-3" strokeWidth={2.75} />
            </span>
            <span className="min-w-0">{point}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

/**
 * The seam. Upright between the stacked panels on a phone, across the gap
 * between them on a desktop: an arm to each panel, lit in that panel's colour
 * when it is chosen, and the disc between them.
 */
function Seam({ uid, first, second }: { uid: string; first: boolean; second: boolean }) {
  const both = first && second;
  return (
    <div aria-hidden className="relative flex h-full flex-col items-center justify-center lg:flex-row">
      <span className="absolute inset-y-10 left-1/2 hidden w-px -translate-x-1/2 bg-linear-to-b from-transparent via-border-strong to-transparent lg:block" />
      <span
        className={`h-7 w-px transition-colors duration-500 ease-brand lg:h-px lg:w-auto lg:flex-1 ${
          first ? "bg-primary" : "bg-border-strong"
        }`}
      />
      <span
        className={`relative grid size-16 shrink-0 place-items-center rounded-pill bg-canvas transition-shadow duration-500 ease-brand ${
          both ? "shadow-xl ring-4 shadow-primary/20 ring-primary/10" : "shadow-md ring-1 shadow-ink/5 ring-border"
        }`}
      >
        <Venn uid={uid} first={first} second={second} />
      </span>
      <span
        className={`h-7 w-px transition-colors duration-500 ease-brand lg:h-px lg:w-auto lg:flex-1 ${
          second ? "bg-accent" : "bg-border-strong"
        }`}
      />
    </div>
  );
}

/** Two circles and their overlap: the chosen model solid, the other a ghost,
    and with both chosen the overlap turns white — the join itself. */
function Venn({ uid, first, second }: { uid: string; first: boolean; second: boolean }) {
  const ease = "fill-opacity 500ms, stroke-opacity 500ms";
  return (
    <svg viewBox="0 0 40 26" fill="none" className="w-9">
      <defs>
        <clipPath id={`${uid}-venn`}>
          <circle cx={15.5} cy={13} r={9} />
        </clipPath>
      </defs>
      <circle
        cx={15.5}
        cy={13}
        r={9}
        strokeWidth={1.25}
        style={{
          fill: "var(--color-primary)",
          stroke: "var(--color-primary)",
          fillOpacity: first ? 1 : 0.08,
          strokeOpacity: first ? 0 : 0.55,
          transition: ease,
        }}
      />
      <circle
        cx={24.5}
        cy={13}
        r={9}
        strokeWidth={1.25}
        style={{
          fill: "var(--color-accent)",
          stroke: "var(--color-accent)",
          fillOpacity: second ? 1 : 0.14,
          strokeOpacity: second ? 0 : 0.9,
          transition: ease,
        }}
      />
      <circle
        cx={24.5}
        cy={13}
        r={9}
        clipPath={`url(#${uid}-venn)`}
        style={{ fill: "var(--color-canvas)", fillOpacity: first && second ? 1 : 0, transition: ease }}
      />
    </svg>
  );
}

/**
 * One figure. Wide, it hangs off a leader at the height the drawing gives it —
 * the figure above the line, its label and any detail below, set from the
 * outer edge so the line runs clear to the ring. Narrow, it is a list row
 * keyed by its ring in miniature.
 *
 * The figure counts up as it arrives (`Counter`, which also keeps the final
 * value in the DOM for assistive technology).
 */
function Callout({
  figureOf,
  ring,
  index,
  count,
  lag,
}: {
  figureOf: Data["reach"][number];
  ring: Ring;
  index: number;
  count: number;
  /** Seconds before it lights: its ring's sweep, under way. */
  lag: number;
}) {
  const parsed = figure(figureOf.value);
  const { lit, partner } = ring;
  const countries = figureOf.detail ? figureOf.detail.split(/,\s*/) : [];
  const line = lit ? (partner ? "bg-accent/70" : "bg-(--reach-blue)/70") : "bg-on-panel/15";
  /* Amber is allowed as type here — this is the dark panel. Unlit, a figure
     drops to 40% white: about 3.7:1 on the panel's ink, inside the 3:1 large
     display type needs. Its label never goes under 60%, which holds better
     than 5.5:1 at 11px anywhere on the panel. */
  const tone = lit ? (partner ? "text-accent" : "text-on-panel") : "text-on-panel/40";
  const delay = { transitionDelay: lit && lag ? `${lag.toFixed(2)}s` : "0s" };

  return (
    <li
      style={{ "--y": `${ring.y}%` } as CSSProperties}
      className={`flex items-start gap-4 sm:flex-col sm:gap-3 lg:absolute lg:top-(--y) lg:block lg:h-0 ${
        partner ? "lg:right-0 lg:left-[calc(50%+var(--rings)/2)]" : "lg:right-[calc(50%+var(--rings)/2)] lg:left-0"
      }`}
    >
      <RingGlyph
        lit={Array.from({ length: count }, (_, k) => k === index)}
        tone="dark"
        className="mt-1.5 size-9 shrink-0 sm:mt-0 lg:hidden"
      />
      <span
        aria-hidden
        style={delay}
        className={`absolute inset-x-0 top-0 hidden h-px transition-colors duration-500 ease-brand lg:block ${line}`}
      />

      <div className="min-w-0">
        <p
          style={delay}
          className={`text-4xl leading-none font-light tracking-[-0.04em] whitespace-nowrap tabular-nums transition-colors duration-500 ease-brand lg:absolute lg:bottom-3 ${
            partner ? "lg:right-0" : "lg:left-0"
          } ${tone}`}
        >
          {parsed ? <Counter value={parsed.n} suffix={parsed.suffix} /> : figureOf.value}
        </p>
        <div
          className={`mt-2.5 lg:absolute lg:inset-x-0 lg:top-3 lg:mt-0 ${
            partner ? "lg:pl-8 lg:text-right" : "lg:pr-8"
          }`}
        >
          <p
            style={delay}
            className={`font-mono text-[0.6875rem] tracking-caps uppercase transition-colors duration-500 ease-brand ${
              lit ? "text-on-panel/80" : "text-on-panel/60"
            }`}
          >
            {figureOf.label}
          </p>
          {countries.length ? (
            <ul className={`mt-3 flex flex-wrap gap-1.5 ${partner ? "lg:justify-end" : ""}`}>
              {countries.map((c) => (
                <li
                  key={c}
                  className="rounded-pill bg-white/8 px-2.5 py-1 text-xs font-medium text-on-panel ring-1 ring-white/12"
                >
                  {c}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </li>
  );
}
