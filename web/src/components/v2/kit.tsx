"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

/**
 * v2's shared furniture.
 *
 * Project rule 3 — a shared element is built once and reused — kept INSIDE
 * v2. Nothing here is imported from v1's component layer and nothing here is
 * exported to it: a component shared across the two versions would make every
 * change to one a change to both, which is the opposite of what a version is
 * for.
 *
 * The comp's vocabulary is small and repeats hard, which is most of why it
 * reads as professional rather than assembled. Six pieces cover the whole
 * page: an eyebrow, a section head, one button, one circular control, one
 * reveal and one counter.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/** The trigger line, one value for the whole page: an element counts as
    entered once it is a fifth of the way up the viewport. Same rule v1 uses,
    measured off the reference template — a page that fires its reveals at a
    different depth from the rest of the site feels like a different site. */
const VIEWPORT = { once: true, margin: "0px 0px -18% 0px" } as const;

/* ------------------------------------------------------------- Reveal --- */

/**
 * The page's one scroll reveal: 24px up, fading in.
 *
 * 24px, not v1's 64. The comp is a dense grid of cards and rows; at 64px the
 * blocks visibly fly, and four cards flying in sequence is the exact thing
 * that makes a corporate page read as a template demo. Short travel plus a
 * long ease reads as settling.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
  y = 24,
  immediate = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header" | "p" | "span";
  y?: number;
  /**
   * Animate on mount instead of on scroll. Required above the fold: the
   * trigger line sits a fifth of the way up the viewport, so anything in the
   * lowest fifth of the first screen never crosses it and would stay
   * invisible until the user scrolls past their own hero.
   */
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  const shown = { opacity: 1, y: 0 };

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Component
      initial={{ opacity: 0, y }}
      {...(immediate ? { animate: shown } : { whileInView: shown, viewport: VIEWPORT })}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </Component>
  );
}

/**
 * A row or grid whose children arrive one after another.
 *
 * The stagger is 70ms and capped at six steps by the call sites that need it:
 * past ~400ms of total lead-in the last card in a row arrives after the reader
 * has already looked at it, which reads as lag rather than as choreography.
 */
export function RevealGroup({
  children,
  className = "",
  delay = 0,
  stagger = 0.07,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "div" | "ul" | "dl";
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Component
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={className}
    >
      {children}
    </Component>
  );
}

/** One child of a `RevealGroup`. Must be inside one — on its own it never
    animates, because it has no parent to hand it the `shown` state. */
export function RevealItem({
  children,
  className = "",
  as = "div",
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article" | "a";
  y?: number;
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Component
      variants={{ hidden: { opacity: 0, y }, shown: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.7, ease: EASE }}
      className={className}
    >
      {children}
    </Component>
  );
}

/* ------------------------------------------------------------ Eyebrow --- */

/**
 * Space Mono, caps, tracked, 11px. The locked typeface decision puts the
 * second face at micro-label scale and nowhere else, which is exactly what
 * the comp does with its section labels.
 *
 * `center` exists because the comp genuinely alternates: About, Impact, Our
 * work, Engagement models and Testimonials are centred; the hero, Services
 * and Consulting results are flush left. That alternation is the page's
 * rhythm, so it is a prop rather than a wrapper's problem.
 */
export function Eyebrow({
  children,
  center = false,
  tone = "subtle",
  className = "",
}: {
  children: ReactNode;
  center?: boolean;
  tone?: "subtle" | "primary" | "onDark" | "onFill";
  className?: string;
}) {
  const skin =
    tone === "primary"
      ? "text-primary"
      : tone === "onDark"
        ? "text-[var(--v2-night-muted)]"
        : tone === "onFill"
          ? "opacity-70"
          : "text-ink-subtle";
  return (
    <p
      className={`flex items-center gap-2 font-mono text-[0.6875rem] leading-none tracking-caps uppercase ${skin} ${
        center ? "justify-center" : ""
      } ${className}`}
    >
      <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-primary" />
      {children}
    </p>
  );
}

/* -------------------------------------------------------- SectionHead --- */

/**
 * The head block. Two authored lines rather than one wrapped string, because
 * the comp breaks every heading at the same place at every width and a
 * heading that re-breaks is the fastest way to lose a comp's proportions.
 */
export function SectionHead({
  eyebrow,
  lead,
  rest,
  body,
  center = false,
  className = "",
  children,
}: {
  eyebrow: string;
  lead: ReactNode;
  rest?: ReactNode;
  body?: string;
  center?: boolean;
  className?: string;
  /** The right-hand slot on the flush-left heads: a button, usually. */
  children?: ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-7 ${
        center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      } ${className}`}
    >
      <div className={center ? "flex flex-col items-center" : "max-w-[30ch]"}>
        <Reveal>
          <Eyebrow center={center}>{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h2
            className={`mt-5 text-3xl leading-[1.12] font-normal tracking-[-0.025em] text-ink ${
              center ? "max-w-[22ch] text-balance" : ""
            }`}
          >
            {lead}
            {rest ? (
              <>
                {/* A space BEFORE the break. `<br>` separates the lines
                    visually but contributes nothing to `textContent`, so
                    without this the two halves concatenate into
                    "bottlenecks.Stronger" for anything reading the text layer
                    — copy-paste, in-page search and some screen readers. */}{" "}
                <br />
                {rest}
              </>
            ) : null}
          </h2>
        </Reveal>
        {body ? (
          <Reveal delay={0.12}>
            <p
              className={`mt-5 text-sm text-ink-muted ${
                center ? "max-w-[62ch] text-balance" : "max-w-[48ch]"
              }`}
            >
              {body}
            </p>
          </Reveal>
        ) : null}
      </div>
      {children ? (
        <Reveal delay={0.18} className={center ? "mt-2" : "shrink-0"}>
          {children}
        </Reveal>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------- Button --- */

/**
 * The comp's one button: a filled pill with a white disc on its right holding
 * a small arrow.
 *
 * The disc is the whole identity of the control and it is also the hover —
 * the arrow slides out to the top right while a second copy slides in from
 * the bottom left, so the movement reads as one arrow travelling rather than
 * an icon twitching. Two copies, one overflow-hidden box.
 *
 * Tones, and the contrast behind each:
 *
 *   primary  #1972B9 with white type, 5.06:1. The default, everywhere
 *   accent   #FEC00F with near-black type, 10.8:1. FILL only — the yellow is
 *            never the word, it is the ground under it
 *   ghost    a hairline pill carrying `--ink` at 16.9:1
 *   onDark   white pill on the footer's near-black
 *
 * `--gap` between the label and the disc is 0.75rem on every tone, so a row
 * mixing two of them still lines up.
 */
export function Button({
  href,
  children,
  tone = "primary",
  size = "md",
  className = "",
  ...rest
}: {
  href: string;
  children: ReactNode;
  tone?: "primary" | "accent" | "ghost" | "onDark";
  size?: "sm" | "md";
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  const skin = {
    primary: "bg-primary text-primary-ink hover:bg-[var(--primary-deep)]",
    accent: "bg-accent text-accent-ink hover:bg-[#ffcf3f]",
    ghost: "border border-border-strong text-ink hover:border-primary hover:text-primary",
    onDark: "bg-white text-ink hover:bg-[#e9eef2]",
  }[tone];

  const disc =
    tone === "ghost"
      ? "bg-primary text-primary-ink"
      : tone === "primary"
        ? "bg-white text-primary"
        : "bg-[var(--ink)] text-white";

  const pad = size === "sm" ? "py-1.5 pr-1.5 pl-4 text-xs" : "py-2 pr-2 pl-5 text-sm";
  const discSize = size === "sm" ? "h-7 w-7" : "h-8 w-8";

  return (
    <Link
      href={href}
      {...rest}
      className={`group inline-flex shrink-0 items-center gap-3 rounded-pill font-medium transition-colors duration-300 ${pad} ${skin} ${className}`}
    >
      <span className="whitespace-nowrap">{children}</span>
      <span
        aria-hidden
        className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full ${discSize} ${disc}`}
      >
        <Arrow className="absolute h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4 group-hover:-translate-y-4" />
        <Arrow className="absolute h-3.5 w-3.5 -translate-x-4 translate-y-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
      </span>
    </Link>
  );
}

/** The one arrow on the page, drawn rather than imported: Lucide's stroke is
    2px and every rule in the comp is 1px, so an imported icon would be the
    heaviest line on the screen. */
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M4 12 12 4" />
      <path d="M5.5 4H12v6.5" />
    </svg>
  );
}

/** A plain chevron, for the carousel controls and the nav's menu hints. */
export function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m6 3 5 5-5 5" />
    </svg>
  );
}

/**
 * The circular previous / next control under both carousels.
 *
 * Disabled rather than hidden at the ends of a track: a control that vanishes
 * moves the one beside it, and a reader who was about to click lands on the
 * other direction instead.
 */
export function CircleButton({
  label,
  onClick,
  disabled = false,
  direction = "next",
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  direction?: "prev" | "next";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-border-strong text-ink transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-ink disabled:pointer-events-none disabled:opacity-30"
    >
      <Chevron className={`h-4 w-4 ${direction === "prev" ? "rotate-180" : ""}`} />
    </button>
  );
}

/* ------------------------------------------------------------- Count ---- */

/**
 * A figure that climbs when it arrives.
 *
 * The real value is in the DOM from the first render in a visually hidden
 * span, and the climbing number beside it is `aria-hidden`. So assistive tech
 * always reads the figure and never a 0 that will later become one — which
 * also means nothing has to be written to state before the animation starts.
 *
 * easeOutExpo: fast off the mark, long settle. Reads as a readout landing
 * rather than a slot machine stopping.
 */
export function Count({
  value,
  suffix = "",
  duration = 1600,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setShown(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} className="v2-num">
      <span aria-hidden>{reduce ? value : shown}</span>
      <span className="sr-only">{value}</span>
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------- Stars --- */

/** The rating on the hero's testimonial card. One path, repeated — the value
    is announced once in text so the shapes stay decorative. */
export function Stars({ count = 5 }: { count?: number }) {
  return (
    <p className="flex items-center gap-0.5" aria-label={`${count} out of 5`}>
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-accent" aria-hidden>
          <path d="M10 1.5 12.4 7l6 .5-4.6 4 1.4 5.9L10 14.2 4.8 17.4 6.2 11.5 1.6 7.5l6-.5z" />
        </svg>
      ))}
    </p>
  );
}
