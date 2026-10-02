"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Globe } from "lucide-react";

import { LocalTime, useMinute, zonedHours } from "@/components/ui/local-time";
import type { ABOUT } from "@/lib/about-content";

import { STATUS, dayFor, inWorkingDay } from "./office-hours";

type Built = (typeof ABOUT)["built"];
type Entity = Built["entities"][number];
type Cover = { from: number; to: number } | "always";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * How each delivery entity covers the day, from commitment 03's own sentence:
 * Penang runs "same-time-zone hypercare" — its working day — and Coimbatore
 * "provides 24/7 coverage". The sentence gives Penang no hours, so its day is
 * the Penang office's own hours from `OFFICES` (`office-hours.ts`), the same
 * ones the close's office cards read, drawn as such and nowhere written as text.
 */
const COVER: Record<Entity["key"], Cover> = {
  penang: { from: dayFor("Asia/Kuala_Lumpur").open, to: dayFor("Asia/Kuala_Lumpur").close },
  coimbatore: "always",
};

/**
 * Hours ahead of UTC, read off the zone rather than its label. Measured at a
 * fixed UTC midnight rather than now: render must not read the clock, and
 * neither zone keeps daylight saving, so any instant gives the same answer on
 * the server and in the browser.
 */
const REF = Date.UTC(2026, 0, 1);
const offsetOf = (tz: string) => {
  const h = zonedHours(REF, tz);
  return h > 12 ? h - 24 : h;
};

/* The dial, in a 240-unit box centred on 0. Midnight UTC at the top,
   clockwise. */
const R_TICK = 110;
const R_LABEL = 91;
const R_ALWAYS = 73;
const R_DAY = 55;
const R_HAND_IN = 42;
const BAND = 9;

const deg = (h: number) => (h / 24) * 360 - 90;
const at = (r: number, h: number) => {
  const a = (deg(h) * Math.PI) / 180;
  return `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
};
const wrap = (h: number) => ((h % 24) + 24) % 24;
/** Inside its cover at `t`: always, or inside the working day, weekdays. */
const covered = (t: number, tz: string, c: Cover) => c === "always" || inWorkingDay(t, tz);

/**
 * 03 — close to your working day, as the two entities' own clocks.
 *
 * The claim is about time, so the instrument tells it: one 24-hour dial in UTC
 * with each entity drawn as the part of the day it covers — Coimbatore the
 * whole ring, Penang the arc of its working day, converted from its own zone
 * onto the shared dial — and a hand at this minute, crossing both. Where the
 * hand meets Penang's ring it lights if Penang is in its working day (a
 * weekday, inside its hours); Coimbatore's is always lit. Beside the dial, a
 * card per entity with its live local time, its zone and whether it is
 * working now; under them, the three regions the sentence names.
 *
 * The clocks are the page's one live fact and the thing a reader can check
 * against their own watch, which is the section's whole argument. They come
 * from `local-time.tsx`'s shared minute: the server renders `--:--` and no
 * hand, and the time arrives after hydration.
 *
 * The cards are content (a screen reader hears each city, its time and its
 * state); the dial and the region chips are `aria-hidden`, because the
 * sentence above them already says what they draw.
 */
export function WorkingDay({
  entities,
  regions,
  always,
  on,
}: {
  entities: Built["entities"];
  regions: Built["regions"];
  /** "24/7", lifted out of the commitment's sentence. */
  always?: string;
  on: boolean;
}) {
  const reduce = useReducedMotion();
  const t = useMinute();
  const shown = !!reduce || on;
  /* The always-on ring's gradient, shared by the dial and its swatch. */
  const ring = `${useId().replace(/[^a-zA-Z0-9_-]/g, "")}-always`;

  return (
    <div className="grid gap-7 @2xl:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] @2xl:items-center @2xl:gap-9">
      <Dial entities={entities} t={t} shown={shown} still={!!reduce} ring={ring} />

      <div className="@container min-w-0">
        <ul className="grid gap-3 @md:grid-cols-2">
          {entities.map((e) => (
            <City key={e.key} entity={e} t={t} always={always} ring={ring} />
          ))}
        </ul>
        <ul aria-hidden className="mt-4 flex flex-wrap gap-2">
          {regions.map((r) => (
            <li
              key={r}
              className="inline-flex items-center gap-2 rounded-pill bg-white/6 px-3.5 py-2 text-sm text-on-panel/85 ring-1 ring-white/12"
            >
              <Globe className="size-3.5 text-on-panel/60" strokeWidth={1.8} />
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Dial({
  entities,
  t,
  shown,
  still,
  ring,
}: {
  entities: Built["entities"];
  t: number;
  shown: boolean;
  still: boolean;
  ring: string;
}) {
  /* One ring per kind of cover. The arc's ends are its local hours moved onto
     UTC: Penang's 09:00-18:00 at UTC+8 is 01:00-10:00 here. */
  const day = entities.find((e) => COVER[e.key] !== "always");
  const cover: Cover = day ? COVER[day.key] : "always";
  const span =
    day && cover !== "always"
      ? { from: wrap(cover.from - offsetOf(day.tz)), to: wrap(cover.to - offsetOf(day.tz)) }
      : null;
  const large = span ? wrap(span.to - span.from) > 12 : false;

  const utc = t ? (t % 86_400_000) / 3_600_000 : null;
  const dayOpen = t && day ? covered(t, day.tz, cover) : false;

  const draw = (delay: number, duration = 1.3) => ({
    initial: still ? (false as const) : { pathLength: 0 },
    animate: shown ? { pathLength: 1 } : undefined,
    transition: { duration, delay, ease: EASE },
  });

  return (
    <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[15rem]">
      <svg viewBox="-120 -120 240 240" className="absolute inset-0 size-full overflow-visible">
        <defs>
          {/* Literal stops: SVG gradients cannot read a token. The brand blue
              to its lighter rim, and amber — which is legal here, a mark on
              the ink ground, never type on a light one. */}
          <linearGradient id={ring} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8cc8fa" />
            <stop offset="0.5" stopColor="#008eff" />
            <stop offset="1" stopColor="#1972b9" />
          </linearGradient>
        </defs>

        {/* 24 hour ticks, the four quarters longer. */}
        {Array.from({ length: 24 }, (_, h) => {
          const major = h % 6 === 0;
          const a = (deg(h) * Math.PI) / 180;
          const r0 = major ? R_TICK - 9 : R_TICK - 5;
          return (
            <line
              key={h}
              x1={(r0 * Math.cos(a)).toFixed(2)}
              y1={(r0 * Math.sin(a)).toFixed(2)}
              x2={(R_TICK * Math.cos(a)).toFixed(2)}
              y2={(R_TICK * Math.sin(a)).toFixed(2)}
              stroke="currentColor"
              strokeWidth={major ? 1.6 : 1}
              strokeLinecap="round"
              className={major ? "text-white/50" : "text-white/22"}
            />
          );
        })}
        {[0, 6, 12, 18].map((h) => {
          const a = (deg(h) * Math.PI) / 180;
          return (
            <text
              key={h}
              x={(R_LABEL * Math.cos(a)).toFixed(2)}
              y={(R_LABEL * Math.sin(a)).toFixed(2)}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={11}
              className="fill-on-panel/60 font-mono"
            >
              {String(h).padStart(2, "0")}
            </text>
          );
        })}

        {/* Coimbatore: the whole day. */}
        <circle r={R_ALWAYS} fill="none" stroke="currentColor" strokeWidth={BAND} className="text-white/6" />
        <g transform="rotate(-90)">
          <motion.circle
            r={R_ALWAYS}
            fill="none"
            stroke={`url(#${ring})`}
            strokeWidth={BAND}
            {...draw(0.1, 1.5)}
          />
        </g>

        {/* Penang: its working day. */}
        <circle r={R_DAY} fill="none" stroke="currentColor" strokeWidth={BAND} className="text-white/6" />
        {span ? (
          <motion.path
            d={`M ${at(R_DAY, span.from)} A ${R_DAY} ${R_DAY} 0 ${large ? 1 : 0} 1 ${at(R_DAY, span.to)}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={BAND}
            strokeLinecap="round"
            className="text-accent"
            {...draw(0.55, 1)}
          />
        ) : null}

        {/* Now. Client-only: the server does not know the minute. */}
        {utc !== null ? (
          <motion.g
            initial={still ? false : { opacity: 0 }}
            animate={{ opacity: shown ? 1 : 0 }}
            transition={{ duration: 0.5, delay: shown && !still ? 1.2 : 0 }}
          >
            {/* Rotated on a plain group, not the motion one: Motion owns the
                transform of anything it animates. */}
            <g transform={`rotate(${deg(utc).toFixed(2)})`}>
              <line
                x1={R_HAND_IN}
                y1={0}
                x2={R_TICK + 4}
                y2={0}
                stroke="currentColor"
                strokeWidth={1.4}
                strokeLinecap="round"
                className="text-on-panel/85"
              />
              {/* Where the hand crosses each ring: Coimbatore's always lit,
                  Penang's lit only inside its day. */}
              <circle cx={R_ALWAYS} cy={0} r={4.2} className="fill-on-panel" />
              <circle
                cx={R_DAY}
                cy={0}
                r={4.2}
                strokeWidth={1.6}
                className={dayOpen ? "fill-accent stroke-accent" : "fill-void stroke-accent"}
              />
            </g>
          </motion.g>
        ) : null}
      </svg>

      {/* The dial's zone and this minute in it, in the middle. */}
      <div className="absolute inset-0 grid place-items-center">
        <p className="text-center">
          <span className="block font-mono text-[0.6875rem] tracking-caps text-on-panel/60 uppercase">UTC</span>
          <LocalTime tz="UTC" className="mt-1 block text-base leading-none font-light text-on-panel" />
        </p>
      </div>
    </div>
  );
}

function City({
  entity: e,
  t,
  always,
  ring,
}: {
  entity: Entity;
  t: number;
  always?: string;
  ring: string;
}) {
  const cover = COVER[e.key];
  const open = t ? covered(t, e.tz, cover) : null;
  const allDay = cover === "always";

  return (
    <li className="rounded-xl bg-white/4 p-4 ring-1 ring-white/10 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0">
          <span className="block text-lg leading-tight font-light text-on-panel">{e.city}</span>
          <span className="mt-1 block font-mono text-[0.6875rem] tracking-caps text-on-panel/60 uppercase">
            {e.country}
          </span>
        </p>
        <Swatch cover={cover} ring={ring} />
      </div>
      <p className="mt-5 text-3xl leading-none font-light tracking-[-0.03em] text-on-panel">
        <LocalTime tz={e.tz} />
      </p>
      <p className="mt-2 font-mono text-[0.6875rem] tracking-caps text-on-panel/60 uppercase">
        {e.tzLabel}
      </p>
      {/* Held at one line's height, so the card does not grow when the
          minute arrives after hydration. */}
      <p className="mt-4 flex min-h-4 items-center gap-2 font-mono text-[0.6875rem] tracking-caps uppercase">
        {open === null ? null : (
          <>
            <span
              aria-hidden
              className={`size-1.5 shrink-0 rounded-pill ${
                open
                  ? allDay
                    ? "bg-primary shadow-[0_0_8px_2px_rgb(0_142_255/0.7)]"
                    : "bg-accent shadow-[0_0_8px_2px_rgb(254_192_15/0.55)]"
                  : "ring-1 ring-white/45"
              }`}
            />
            <span className={open ? "text-on-panel" : "text-on-panel/60"}>
              {open ? STATUS.open : STATUS.closed}
              {allDay && always ? ` · ${always}` : ""}
            </span>
          </>
        )}
      </p>
    </li>
  );
}

/** Which ring on the dial is this entity's: the whole circle, or an arc. */
function Swatch({ cover, ring }: { cover: Cover; ring: string }) {
  return (
    <svg aria-hidden viewBox="-12 -12 24 24" className="size-6 shrink-0">
      <circle r={8} fill="none" stroke="currentColor" strokeWidth={3} className="text-white/12" />
      {cover === "always" ? (
        <circle r={8} fill="none" stroke={`url(#${ring})`} strokeWidth={3} />
      ) : (
        <path
          d={`M 0 -8 A 8 8 0 0 1 ${(8 * Math.cos(Math.PI / 4)).toFixed(2)} ${(8 * Math.sin(Math.PI / 4)).toFixed(2)}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          className="text-accent"
        />
      )}
    </svg>
  );
}
