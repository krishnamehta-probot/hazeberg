"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  type Transition,
  type Variants,
} from "motion/react";
import {
  ArrowRight,
  Cable,
  Compass,
  Flag,
  MousePointerClick,
  RotateCcw,
  TrendingUp,
} from "lucide-react";

import { VIEWPORT } from "@/components/motion/reveal";
import { CtaPill } from "@/components/ui/cta-pill";
import { CAPABILITY_TAGLINE, type WHAT_WE_DO } from "@/lib/what-we-do-content";

import { CapabilityChip } from "./capability-chip";

type Data = (typeof WHAT_WE_DO)["journey"];
type Option = Data["options"][number];
type Face = "card" | "chip" | "open";

const STAGE_ICON = {
  planning: Compass,
  live: Flag,
  maximising: TrendingUp,
  connecting: Cable,
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

/** The morph: one spring for every box that changes size or place. */
const MORPH: Transition = { type: "spring", stiffness: 240, damping: 30, mass: 0.9 };

/* The cards deal in on first sight — up from below, tipped back, settling
   flat — one after another. The photo arrives with its card, uncovered. */
const DEAL_LIST: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const DEAL: Variants = {
  hidden: { opacity: 0, y: 56, rotateX: 18, scale: 0.95 },
  shown: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 150, damping: 20, mass: 0.9 },
  },
};

/**
 * "Find your starting point" — the section answers the reader instead of
 * listing at them.
 *
 * ONE grid of four, and every change is that grid re-laying itself out — no
 * view swapped for another view. That is what lets the choice be a movement
 * rather than a cut:
 *
 *   choose  four photo cards in a row, dealt in on first sight. The section's
 *           close sits under them, for anyone who would rather not choose.
 *   open    the chosen card GROWS — it takes the whole width and becomes the
 *           path, its photograph flying from the top of the card into the
 *           panel — while the other three shrink into chips in a row above it.
 *           Pick a chip and the two trade places: it grows, the open one
 *           shrinks back into the row. The new path then arrives in order:
 *           label, headline, copy, and the capabilities stepping down a line
 *           that draws itself, ending at the close and the call to action.
 *
 * The photograph is one shared element (`layoutId`) across all three faces —
 * card header, chip thumbnail, panel picture — so it is always the same
 * picture travelling, never one fading out while another fades in.
 *
 * Semantics: the cards and chips are buttons that open a stage; the open stage
 * is a region labelled by its own headline. Focus follows the change — to the
 * new headline after a choice, back to the first card after "Choose again" —
 * so nothing a keyboard reader was on disappears from under them.
 *
 * Reduced motion: `MotionConfig reducedMotion="user"` drops every transform
 * and layout animation; the states are the same, they simply cut.
 */
export function JourneyFinder({ data }: { data: Data }) {
  const [chosen, setChosen] = useState<number | null>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const pending = useRef<"heading" | "card" | null>(null);

  useEffect(() => {
    if (pending.current === "heading") heading.current?.focus({ preventScroll: true });
    if (pending.current === "card") cards.current[0]?.focus({ preventScroll: true });
    pending.current = null;
  }, [chosen]);

  const choose = (i: number) => {
    pending.current = "heading";
    setChosen(i);
  };
  const reset = () => {
    pending.current = "card";
    setChosen(null);
  };

  const open = chosen !== null;

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id="journey">
        <div className="mt-10">
          <AnimatePresence initial={false}>
            {!open ? (
              <motion.p
                key="prompt"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="mb-5 inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-caps text-primary uppercase"
              >
                <MousePointerClick aria-hidden className="size-4" strokeWidth={1.8} />
                {data.labels.prompt}
              </motion.p>
            ) : null}
          </AnimatePresence>

          <motion.ul
            layout
            transition={MORPH}
            initial="hidden"
            whileInView="shown"
            viewport={VIEWPORT}
            variants={DEAL_LIST}
            aria-label={data.pickerLabel}
            style={{ perspective: 1400 }}
            className={
              open
                ? "grid grid-cols-3 gap-2 sm:gap-3"
                : "grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
            }
          >
            {data.options.map((o, i) => {
              const face: Face = !open ? "card" : chosen === i ? "open" : "chip";
              return (
                <motion.li
                  key={o.n}
                  layout
                  transition={MORPH}
                  variants={DEAL}
                  style={{ borderRadius: face === "chip" ? 16 : 28 }}
                  className={`overflow-hidden bg-surface ring-1 ${
                    face === "open" ? "col-span-3 row-start-2 ring-primary/20" : "ring-border"
                  }`}
                >
                  {face === "card" ? (
                    <CardFace
                      option={o}
                      cta={data.labels.cardCta}
                      onChoose={() => choose(i)}
                      ref={(el) => {
                        cards.current[i] = el;
                      }}
                    />
                  ) : face === "chip" ? (
                    <ChipFace option={o} onChoose={() => choose(i)} />
                  ) : (
                    <OpenFace option={o} data={data} heading={heading} onReset={reset} />
                  )}
                </motion.li>
              );
            })}
          </motion.ul>

          {/* The section's close, for anyone who would rather not choose. When
              a stage is open it lives at the end of that stage's path instead. */}
          <AnimatePresence initial={false}>
            {!open ? (
              <motion.div
                key="close"
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.15, ease: EASE } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="map-ground mt-5 flex flex-col gap-6 rounded-2xl p-7 ring-1 ring-border sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16"
              >
                <div className="min-w-0">
                  <h3 className="text-xl leading-snug font-light tracking-[-0.02em] text-balance text-ink">
                    {data.closing.title}
                  </h3>
                  <p className="mt-2 max-w-[62ch] text-sm font-medium text-ink">{data.closing.body}</p>
                </div>
                <div className="shrink-0">
                  <CtaPill href={data.closing.cta.href}>{data.closing.cta.label}</CtaPill>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </MotionConfig>
  );
}

/* ================================ faces ================================== */

function Photo({ option, className, sizes }: { option: Option; className: string; sizes: string }) {
  return (
    <motion.span
      layoutId={`journey-photo-${option.n}`}
      transition={MORPH}
      className={`relative block overflow-hidden bg-surface-2 ${className}`}
    >
      <Image
        src={option.photo.src}
        alt=""
        fill
        sizes={sizes}
        style={"position" in option.photo ? { objectPosition: option.photo.position } : undefined}
        className="object-cover"
      />
    </motion.span>
  );
}

function CardFace({
  option,
  cta,
  onChoose,
  ref,
}: {
  option: Option;
  cta: string;
  onChoose: () => void;
  ref: (el: HTMLButtonElement | null) => void;
}) {
  const Icon = STAGE_ICON[option.key];
  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onChoose}
      whileTap={{ scale: 0.97 }}
      className="group/c flex h-full w-full cursor-pointer items-stretch gap-4 p-2.5 text-left transition-shadow dur-base ease-brand hover:shadow-xl hover:shadow-primary/10 sm:flex-col sm:gap-0 sm:p-3"
    >
      <span className="relative block w-24 shrink-0 sm:w-full">
        <Photo
          option={option}
          sizes="(max-width: 639px) 96px, (max-width: 1023px) 50vw, 25vw"
          className="aspect-square rounded-xl sm:aspect-[16/10]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-1/2 rounded-b-xl bg-linear-to-t from-ink/55 to-transparent sm:block"
        />
        <span className="absolute bottom-2.5 left-2.5 hidden items-center gap-2 sm:inline-flex">
          <span className="grid size-8 place-items-center rounded-pill bg-canvas/90 text-primary backdrop-blur-sm transition-transform dur-base ease-brand group-hover/c:scale-110">
            <Icon aria-hidden className="size-4" strokeWidth={1.9} />
          </span>
          <span className="font-mono text-xs tracking-caps text-on-panel">{option.n}</span>
        </span>
      </span>

      <span className="flex min-w-0 flex-1 flex-col py-1 pr-2 sm:px-1.5 sm:pt-4 sm:pb-1.5">
        <span className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle sm:hidden">
          {option.n}
        </span>
        <span className="text-lg leading-snug font-light tracking-[-0.015em] text-balance text-ink">
          {option.stage}
        </span>
        <span className="mt-1.5 hidden text-sm text-ink-muted sm:line-clamp-2">{option.title}</span>
        <span className="mt-auto inline-flex items-center gap-2 pt-3 text-sm font-medium text-primary">
          {cta}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform dur-base ease-brand group-hover/c:translate-x-1"
            strokeWidth={2}
          />
        </span>
      </span>
    </motion.button>
  );
}

function ChipFace({ option, onChoose }: { option: Option; onChoose: () => void }) {
  const Icon = STAGE_ICON[option.key];
  return (
    <motion.button
      type="button"
      onClick={onChoose}
      whileTap={{ scale: 0.96 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.25, delay: 0.1 } }}
      className="group/p flex h-full min-h-16 w-full cursor-pointer items-center gap-3 p-2 text-left transition-colors dur-base ease-brand hover:bg-canvas sm:pr-4"
    >
      <span className="relative hidden shrink-0 sm:block">
        <Photo option={option} sizes="48px" className="size-12 rounded-[10px]" />
      </span>
      <span className="grid size-8 shrink-0 place-items-center rounded-pill bg-canvas text-primary ring-1 ring-border sm:hidden">
        <Icon aria-hidden className="size-4" strokeWidth={1.9} />
      </span>
      <span className="min-w-0">
        <span className="hidden font-mono text-[0.625rem] tracking-caps text-ink-subtle sm:block">
          {option.n}
        </span>
        <span className="line-clamp-2 text-xs leading-snug font-medium text-ink-muted transition-colors dur-base ease-brand group-hover/p:text-ink sm:text-sm">
          {option.stage}
        </span>
      </span>
      <ArrowRight
        aria-hidden
        className="ml-auto hidden size-4 shrink-0 -translate-x-1 text-primary opacity-0 transition dur-base ease-brand group-hover/p:translate-x-0 group-hover/p:opacity-100 lg:block"
        strokeWidth={2}
      />
    </motion.button>
  );
}

function OpenFace({
  option,
  data,
  heading,
  onReset,
}: {
  option: Option;
  data: Data;
  heading: React.RefObject<HTMLHeadingElement | null>;
  onReset: () => void;
}) {
  const Icon = STAGE_ICON[option.key];
  const id = `journey-path-${option.n}`;

  /* The copy arrives in reading order once the box has grown; the path's
     steps follow it down the line. */
  const copy: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: 0.07, delayChildren: 0.22 } },
  };
  const line: Variants = {
    hidden: { opacity: 0, y: 12 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  };
  const steps: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: 0.12, delayChildren: 0.42 } },
  };
  const step: Variants = {
    hidden: { opacity: 0, x: -16 },
    shown: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
  };

  return (
    <section
      aria-labelledby={id}
      className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"
    >
      {/* -- where you are ------------------------------------------------- */}
      <motion.div
        initial="hidden"
        animate="shown"
        variants={copy}
        className="flex flex-col p-6 sm:p-8"
      >
        <motion.div variants={line} className="flex items-center justify-between gap-4">
          <p className="inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-caps text-primary uppercase">
            <Icon aria-hidden className="size-4" strokeWidth={1.9} />
            {data.labels.startingPoint} · {option.n}
          </p>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-pill px-3 text-sm font-medium text-primary transition-colors dur-base ease-brand hover:bg-canvas"
          >
            <RotateCcw aria-hidden className="size-4" strokeWidth={2} />
            {data.labels.reset}
          </button>
        </motion.div>
        <motion.h3
          ref={heading}
          id={id}
          tabIndex={-1}
          variants={line}
          className="mt-2 max-w-[26ch] text-2xl leading-[1.12] font-light tracking-[-0.025em] text-balance text-ink outline-none"
        >
          {option.title}
        </motion.h3>
        {option.body.map((p) => (
          <motion.p key={p} variants={line} className="mt-3 max-w-[56ch] text-sm text-ink-muted">
            {p}
          </motion.p>
        ))}
        <div className="mt-6 hidden lg:block">
          <Photo option={option} sizes="40vw" className="aspect-[2/1] rounded-xl" />
        </div>
      </motion.div>

      {/* -- the path ------------------------------------------------------ */}
      <div className="border-t border-border bg-canvas p-6 sm:p-8 lg:border-t-0 lg:border-l">
        <p className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
          {data.helpsLabel}
        </p>

        <motion.ol initial="hidden" animate="shown" variants={steps} className="relative mt-5">
          {option.helps.map((capability, i) => (
            <motion.li key={capability} variants={step} className="relative flex gap-4 pb-5">
              {/* The route, one segment per step: from under this marker to
                  the top of the next, so it ends exactly at the last one
                  however tall the closing step below it runs. */}
              <motion.span
                aria-hidden
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.35, delay: 0.55 + i * 0.12, ease: EASE }}
                className="grad-primary absolute top-9 bottom-0 left-[1.0625rem] w-[2px] origin-top"
              />
              <span className="disc-blue relative z-10 grid size-9 shrink-0 place-items-center rounded-pill font-mono text-[0.6875rem] text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <CapabilityChip id={capability} />
                <p className="mt-1.5 max-w-[46ch] text-sm text-ink-muted">
                  {CAPABILITY_TAGLINE[capability]}
                </p>
              </div>
            </motion.li>
          ))}

          {/* The end of the path is the conversation. */}
          <motion.li variants={step} className="relative flex gap-4">
            <span
              aria-hidden
              className="relative z-10 grid size-9 shrink-0 place-items-center rounded-pill bg-accent text-accent-ink"
            >
              <ArrowRight className="size-4" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 pt-1">
              <p className="text-lg leading-snug font-light tracking-[-0.015em] text-balance text-ink">
                {data.closing.title}
              </p>
              <p className="mt-1.5 max-w-[48ch] text-sm font-medium text-ink">{data.closing.body}</p>
              <div className="mt-5">
                <CtaPill href={data.closing.cta.href}>{data.closing.cta.label}</CtaPill>
              </div>
            </div>
          </motion.li>
        </motion.ol>
      </div>
    </section>
  );
}
