"use client";

import {
  createRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { motion, useInView, useReducedMotion, useScroll } from "motion/react";
import { Check } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import type { ABOUT } from "@/lib/about-content";

import { CheckSeal } from "./commitment-check";
import { RetentionRing, TenureScale, YearsMeter, figures } from "./commitment-instruments";
import { WorkingDay } from "./commitment-working-day";

type Data = (typeof ABOUT)["built"];
type Item = Data["items"][number];

/** The band a commitment is "being read" in: a strip just above the middle
    of the screen, where the eye sits when reading down a page. */
const READING = "-42% 0px -52% 0px";

/** When each seal lands, seconds after its panel enters view: once the
    instrument above it has finished, not before. */
const SEAL_AT: Record<Item["key"], number> = {
  "only-workday": 1.35,
  "same-people": 1.4,
  "working-day": 1.6,
  "straight-about-risk": 1.45,
};

/**
 * The body of How we're built: the head held in a sticky column with an
 * index of the four, and the four themselves, each with its proof.
 *
 * The index is the section's progress. A commitment counts as read while it
 * crosses a band just above the middle of the screen (an observer, so nothing
 * runs per frame): its node lights and its claim comes up to white. The rail
 * between two nodes fills continuously as the commitment above it is scrolled
 * through, and when a commitment's seal lands in its proof panel, its node in
 * the index turns into the same blue check — the index keeps the score. The
 * index is links, so it is also the way round the section; Lenis carries the
 * jump.
 *
 * Phones have no sticky column and no index: the head, then the four in turn,
 * each carrying its own number.
 */
export function CommitmentList({ data, head }: { data: Data; head: ReactNode }) {
  const reduce = useReducedMotion();
  const targets = useMemo(() => data.items.map(() => createRef<HTMLElement>()), [data.items]);
  const [active, setActive] = useState(-1);
  const [sealed, setSealed] = useState<ReadonlySet<number>>(() => new Set());

  useEffect(() => {
    const els = targets.map((r) => r.current);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const i = els.indexOf(entry.target as HTMLElement);
          const band = entry.rootBounds;
          if (i < 0) continue;
          if (entry.isIntersecting) setActive(i);
          // Left the band downwards — scrolling back up past it.
          else if (band && entry.boundingClientRect.top >= band.bottom) setActive((a) => Math.min(a, i - 1));
          // Above the band — read, including on a load part-way down the page.
          else if (band && entry.boundingClientRect.bottom <= band.top) setActive((a) => Math.max(a, i));
        }
      },
      { rootMargin: READING },
    );
    for (const el of els) if (el) io.observe(el);
    return () => io.disconnect();
  }, [targets]);

  const seal = (i: number) =>
    setSealed((cur) => (cur.has(i) ? cur : new Set(cur).add(i)));
  /* Reduced motion has no seal to wait for: a commitment is checked once it
     has been read. */
  const isSealed = (i: number) => (reduce ? i <= active : sealed.has(i));
  const anchor = (item: Item) => `${data.id}-${item.key}`;

  return (
    <div className="grid gap-14 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
      {/* -- the claim, held, and the score ------------------------------- */}
      <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
        {head}
        <nav aria-label={data.eyebrow} className="mt-12 hidden lg:block">
          <ol>
            {data.items.map((item, i) => (
              <IndexItem
                key={item.key}
                item={item}
                href={`#${anchor(item)}`}
                target={targets[i]}
                last={i === data.items.length - 1}
                state={i === active ? "active" : i < active ? "read" : "ahead"}
                sealed={isSealed(i)}
                filled={reduce ? (i < active ? 1 : 0) : null}
              />
            ))}
          </ol>
        </nav>
      </div>

      {/* -- the four ------------------------------------------------------ */}
      <ol className="space-y-20 sm:space-y-24 lg:space-y-32">
        {data.items.map((item, i) => (
          <li key={item.key}>
            <Commitment
              item={item}
              data={data}
              id={anchor(item)}
              target={targets[i]}
              onSealed={() => seal(i)}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * One line of the index: node, number, claim. The rail under the node runs to
 * the next one and fills with the scroll through this commitment — measured on
 * the commitment itself, so a long one and a short one each fill their own
 * segment exactly.
 */
function IndexItem({
  item,
  href,
  target,
  last,
  state,
  sealed,
  filled,
}: {
  item: Item;
  href: string;
  target: RefObject<HTMLElement | null>;
  last: boolean;
  state: "active" | "read" | "ahead";
  sealed: boolean;
  /** Reduced motion: a fixed fill instead of the scroll. */
  filled: number | null;
}) {
  const { scrollYProgress } = useScroll({ target, offset: ["start 50%", "end 50%"] });
  const on = state === "active";

  return (
    <li className="relative">
      {last ? null : (
        <span aria-hidden className="absolute top-8.5 -bottom-3 left-2.75 w-px bg-white/12">
          <motion.span
            className="absolute inset-0 origin-top bg-primary shadow-[0_0_10px_rgb(0_142_255/0.7)]"
            style={{ scaleY: filled ?? scrollYProgress }}
          />
        </span>
      )}
      <a
        href={href}
        aria-current={on ? "location" : undefined}
        className="group/ix relative flex min-h-12 items-start gap-4 rounded-md py-3 pr-2"
      >
        <span
          aria-hidden
          className={`relative grid size-5.5 shrink-0 place-items-center rounded-pill transition-[background-color,box-shadow] dur-base ease-brand ${
            sealed
              ? "disc-blue text-white shadow-[0_0_14px_rgb(0_142_255/0.55)]"
              : on
                ? "bg-void ring-1 ring-white/75"
                : "bg-void ring-1 ring-white/22 group-hover/ix:ring-white/50"
          }`}
        >
          {sealed ? (
            <Check className="size-3" strokeWidth={3} />
          ) : on ? (
            <span className="size-1.5 rounded-pill bg-on-panel" />
          ) : null}
        </span>
        <span
          aria-hidden
          className={`mt-0.5 font-mono text-[0.6875rem] tracking-caps transition-colors dur-base ease-brand ${
            on ? "text-accent" : "text-on-panel/55"
          }`}
        >
          {item.n}
        </span>
        <span
          className={`text-sm leading-snug transition-colors dur-base ease-brand group-hover/ix:text-on-panel ${
            on ? "text-on-panel" : state === "read" ? "text-on-panel/80" : "text-on-panel/60"
          }`}
        >
          {item.claim}
        </span>
      </a>
    </li>
  );
}

/**
 * One commitment: its number, the claim, the line under it, and the proof
 * panel — the label, the sentence that keeps the claim true, and the
 * instrument that shows it, sealed with a check once it has been shown.
 */
function Commitment({
  item,
  data,
  id,
  target,
  onSealed,
}: {
  item: Item;
  data: Data;
  id: string;
  target: RefObject<HTMLElement | null>;
  onSealed: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const on = useInView(panel, { once: true, margin: "0px 0px -20% 0px" });
  const [done, setDone] = useState(false);
  const wide = item.key === "working-day";
  const instrument = <Instrument item={item} data={data} on={on} />;

  return (
    <article ref={target} id={id} aria-labelledby={`${id}-claim`}>
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs tracking-caps text-accent">{item.n}</span>
          <span aria-hidden className="h-px flex-1 bg-white/12" />
        </div>
        <h3
          id={`${id}-claim`}
          className="mt-6 max-w-[22ch] text-2xl leading-[1.1] font-light tracking-[-0.03em] text-balance text-on-panel sm:text-3xl"
        >
          {item.claim}
        </h3>
        <p className="mt-4 max-w-[58ch] text-base text-on-panel/70">{item.line}</p>
      </Reveal>

      <Reveal delay={0.08} className="mt-8 lg:mt-10">
        <div
          ref={panel}
          className={`@container relative overflow-hidden rounded-2xl p-5 ring-1 transition-[background-color,box-shadow] duration-700 ease-brand sm:p-7 ${
            done
              ? "bg-white/5 shadow-[0_28px_70px_-36px_rgb(0_142_255/0.55)] ring-white/22"
              : "bg-white/3 ring-white/10"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[0.6875rem] tracking-caps text-accent uppercase">
              {data.proofLabel}
            </p>
            <CheckSeal
              on={on}
              delay={SEAL_AT[item.key]}
              onDone={() => {
                setDone(true);
                onSealed();
              }}
            />
          </div>

          {wide ? (
            <>
              <p className="mt-4 max-w-[64ch] text-base text-on-panel/85">{item.proof}</p>
              <div className="mt-8">{instrument}</div>
            </>
          ) : (
            <div className="mt-4 grid gap-8 @2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] @2xl:items-center @2xl:gap-10">
              <p className="max-w-[46ch] text-base text-on-panel/85">{item.proof}</p>
              <div className="min-w-0">{instrument}</div>
            </div>
          )}
        </div>
      </Reveal>
    </article>
  );
}

/**
 * The instrument for a commitment, by its key. Every figure comes out of the
 * commitment's own sentence (see `commitment-instruments.tsx`); a sentence
 * that no longer carries the figure gets no instrument rather than a wrong one.
 */
function Instrument({ item, data, on }: { item: Item; data: Data; on: boolean }) {
  const f = figures(item.proof);
  switch (item.key) {
    case "only-workday":
      return f[0] ? <YearsMeter figure={f[0]} on={on} /> : null;
    case "same-people":
      return f.length >= 2 ? <TenureScale from={f[0]} to={f[1]} on={on} /> : null;
    case "working-day":
      return (
        <WorkingDay
          entities={data.entities}
          regions={data.regions}
          always={item.proof.match(/\d+\/\d+/)?.[0]}
          on={on}
        />
      );
    case "straight-about-risk":
      return f[0] ? <RetentionRing figure={f[0]} on={on} /> : null;
  }
}
