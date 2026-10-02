"use client";

import { useId } from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Transition,
} from "motion/react";
import { Award } from "lucide-react";

import { VIEWPORT } from "@/components/motion/reveal";
import type { ABOUT } from "@/lib/about-content";

type Item = (typeof ABOUT)["recognition"]["items"][number];

/* The tilt, per axis. Together they top out just under 6° on the diagonal —
   enough to read as an object turning to the light, never as a card flipping. */
const TILT_X = 4;
const TILT_Y = 4.2;
/** How far the card rises under a pointer, px. */
const LIFT = -6;
const SPRING = { stiffness: 260, damping: 24, mass: 0.6 };
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * One recognition, as a document on a plate.
 *
 * The mark sits on a white plate the way a certificate's seal sits on paper —
 * ISO's own tile (a JPEG on white, so a white plate is the one ground it sits
 * on without a box round it), the #startupindia mark cut from the DPIIT
 * certificate, or, where no mark may be used, a blue disc with a lucide award.
 * In the plate's corner a small seal draws itself on as the card arrives —
 * ring first, then the tick — which is the section's whole claim in one
 * gesture: checked.
 *
 * Under a pointer the card turns towards it (a few degrees, on a spring) and
 * rises, and the light follows the hand: a blue wash across the face and a
 * 1px rim lit nearest the pointer (`.rec-rim`, the same masked-edge trick as
 * `.spec`). White light on a white card would be invisible, so the light here
 * is the brand blue. Everything is motion values written straight to style:
 * a pointer move never renders React.
 *
 * The tilt is a flourish over content that is all on the card already, so
 * the card is not a tab stop: a focusable element that does nothing when it
 * is reached is a dead end for a keyboard, three times over. Touch gets no
 * tilt either — there is no hover to leave. Reduced motion: flat, still, and
 * the seal already drawn.
 */
export function RecognitionCard({ item, index }: { item: Item; index: number }) {
  const reduce = useReducedMotion();
  const headingId = useId();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const lit = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, (v) => (0.5 - v) * 2 * TILT_X), SPRING);
  const rotateY = useSpring(useTransform(px, (v) => (v - 0.5) * 2 * TILT_Y), SPRING);
  const light = useSpring(lit, { stiffness: 200, damping: 28 });
  const y = useTransform(light, (v) => v * LIFT);

  const gx = useTransform(px, (v) => `${(v * 100).toFixed(1)}%`);
  const gy = useTransform(py, (v) => `${(v * 100).toFixed(1)}%`);
  const wash = useMotionTemplate`radial-gradient(26rem circle at ${gx} ${gy}, color-mix(in srgb, var(--primary) 9%, transparent), transparent 62%)`;
  const rim = useMotionTemplate`radial-gradient(15rem circle at ${gx} ${gy}, var(--primary), transparent 72%)`;

  const settle = () => {
    lit.set(0);
    px.set(0.5);
    py.set(0.5);
  };

  /* Reduced motion gets no handlers, so nothing below ever moves. The markup
     is the same either way: the server cannot know the preference, and a
     first client render that dropped the light layers or the style would not
     match what it sent. */
  const pointer = reduce
    ? {}
    : {
        onPointerEnter: (e: React.PointerEvent<HTMLElement>) => {
          if (e.pointerType === "mouse") lit.set(1);
        },
        onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        },
        onPointerLeave: (e: React.PointerEvent<HTMLElement>) => {
          if (e.pointerType === "mouse") settle();
        },
      };

  return (
    <motion.article
      aria-labelledby={headingId}
      {...pointer}
      style={{ rotateX, rotateY, y, transformPerspective: 900 }}
      className="relative isolate flex h-full flex-col rounded-2xl bg-canvas p-3 ring-1 ring-border transition-shadow dur-base ease-brand hover:shadow-xl hover:shadow-primary/10 sm:grid sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:flex lg:flex-col"
    >
      <motion.span
        aria-hidden
        style={{ backgroundImage: wash, opacity: light }}
        className="pointer-events-none absolute inset-0 -z-10 rounded-2xl"
      />
      <motion.span
        aria-hidden
        style={{ backgroundImage: rim, opacity: light }}
        className="rec-rim pointer-events-none absolute inset-0 z-10 rounded-2xl"
      />

      {/* -- the plate ------------------------------------------------------ */}
      <div className="relative grid h-36 place-items-center rounded-xl bg-canvas px-8 shadow-[inset_0_1px_3px_rgb(20_24_26/0.06)] ring-1 ring-border sm:h-full sm:min-h-40 lg:h-44">
        {item.logo ? (
          <Image
            src={item.logo.src}
            alt={item.logo.alt}
            width={item.logo.width}
            height={item.logo.height}
            sizes="168px"
            /* One box for every mark, sized so they read as equals rather than
               measure as equals: ISO's solid tile hits the 56px height cap
               first and lands 134px wide; the open lettering of #startupindia
               takes the full 168px at 39px tall. */
            className="h-auto max-h-14 w-full max-w-[10.5rem] object-contain"
          />
        ) : (
          <span
            aria-hidden
            className="disc-blue grid size-16 place-items-center rounded-pill text-white shadow-lg shadow-primary/25"
          >
            <Award className="size-7" strokeWidth={1.6} />
          </span>
        )}
        <Seal index={index} still={!!reduce} />
      </div>

      {/* -- what it is ---------------------------------------------------- */}
      <div className="flex flex-1 flex-col px-2 pt-6 pb-3 sm:px-5 sm:py-5 lg:px-3 lg:pt-6 lg:pb-3">
        <p className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3
          id={headingId}
          className="mt-3 text-xl leading-snug font-light tracking-[-0.02em] text-balance text-ink"
        >
          {item.name}
        </h3>
        <p className="mt-3 text-sm text-ink-muted">{item.body}</p>
        {item.detail ? (
          <p className="mt-auto pt-6">
            <span className="block border-t border-border pt-4 font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
              {item.detail}
            </span>
          </p>
        ) : null}
      </div>
    </motion.article>
  );
}

/**
 * The seal in the plate's corner: a faint dashed outer ring, then a ring that
 * draws itself round from twelve o'clock, then the tick. Drawn once, as the
 * card scrolls in, a beat after the card itself has arrived; each card's seal
 * a beat after the last. Decorative — the card's text is the record.
 */
function Seal({ index, still }: { index: number; still: boolean }) {
  const delay = 0.45 + index * 0.14;
  /* Still: the same two states with no transition, reached on mount — drawn
     from the start, and the server's "off" frame still matches the first
     client render. */
  const t = (d: number, duration: number): Transition =>
    still ? { duration: 0 } : { duration, delay: delay + d, ease: EASE };
  const shown = still
    ? { initial: "off", animate: "on" }
    : { initial: "off", whileInView: "on", viewport: VIEWPORT };
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 48 48"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...shown}
      className="absolute top-3 right-3 size-11 text-primary"
    >
      <motion.circle
        cx="24"
        cy="24"
        r="21.5"
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeWidth="1"
        strokeDasharray="1.5 3"
        variants={{ off: { opacity: 0 }, on: { opacity: 1, transition: t(0, 0.6) } }}
      />
      <motion.circle
        cx="24"
        cy="24"
        r="16"
        stroke="currentColor"
        strokeWidth="1.5"
        transform="rotate(-90 24 24)"
        variants={{ off: { pathLength: 0 }, on: { pathLength: 1, transition: t(0.1, 0.8) } }}
      />
      <motion.path
        d="M17.5 24.5l4.5 4.5 8.5-9"
        stroke="currentColor"
        strokeWidth="2"
        variants={{ off: { pathLength: 0 }, on: { pathLength: 1, transition: t(0.75, 0.4) } }}
      />
    </motion.svg>
  );
}
