"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";

import { LocalTime, useMinute, zonedHours } from "@/components/ui/local-time";
import type { ABOUT } from "@/lib/about-content";

import { STATUS, dayFor, inWorkingDay } from "./office-hours";

type Office = (typeof ABOUT)["contact"]["offices"][number];

/** A ruler label: "09" on the hour, "18:30" off it. */
const two = (h: number) => {
  const hh = String(Math.floor(h)).padStart(2, "0");
  const mm = Math.round((h % 1) * 60);
  return mm ? `${hh}:${String(mm).padStart(2, "0")}` : hh;
};

/**
 * Both offices, each on its own clock.
 *
 * "Close to your working day" is a claim the page makes further up; this is
 * where it can be checked. Each office shows the time there now, live to the
 * minute (one shared clock for the whole page, `ui/local-time.tsx`), a dot that
 * is lit while the office is inside its working day — the client's own hours
 * from `OFFICES`, the same ones How we're built's dial reads
 * (`office-hours.ts`) — and the day itself as a ruler: midnight to midnight, the
 * working hours marked on it, and a point of light where the office is right
 * now. Coimbatore and Penang are two and a half hours apart, so most of the
 * time the two points sit at visibly different places on the same day.
 *
 * The server cannot know the reader's minute, so it sends `--:--`, an unlit
 * dot and no point on the ruler; the real state arrives on hydration and
 * nothing moves when it does. The open dot sends out a slow ring while it is
 * on screen; off screen, or under reduced motion, it is simply lit.
 */
export function ConversationOffices({
  label,
  offices,
}: {
  label: string;
  offices: readonly Office[];
}) {
  const list = useRef<HTMLUListElement>(null);
  const inView = useInView(list);
  const reduce = useReducedMotion();
  return (
    <>
      <h3 className="font-mono text-[0.6875rem] tracking-caps text-on-panel/60 uppercase">{label}</h3>
      <ul ref={list} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {offices.map((o) => (
          <OfficeCard key={o.key} office={o} lively={inView && !reduce} />
        ))}
      </ul>
    </>
  );
}

function OfficeCard({ office, lively }: { office: Office; lively: boolean }) {
  const t = useMinute();
  const known = t > 0;
  const h = known ? zonedHours(t, office.tz) : 0;
  const open = inWorkingDay(t, office.tz);
  const state = open ? STATUS.open : STATUS.closed;
  const { open: OPEN, close: CLOSE } = dayFor(office.tz);

  return (
    <li className="group/o relative flex flex-col rounded-2xl bg-white/[0.045] p-5 ring-1 ring-white/10 transition-colors dur-base ease-brand hover:bg-white/[0.07] hover:ring-white/20 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <h4 className="text-2xl leading-tight font-light tracking-[-0.02em] text-on-panel">{office.city}</h4>
          <p className="mt-1.5 font-mono text-[0.6875rem] tracking-caps text-on-panel/60 uppercase">
            {office.country}
          </p>
        </div>
        {/* The dot is the state; the word beside it is only the dot read
            aloud for anyone who does not know what a lit dot means. The word
            is held (invisible) before the minute is known: on a two-up card
            it is what wraps this row, and arriving after hydration it would
            grow the card under the reader. */}
        <span className="mt-1.5 inline-flex shrink-0 items-center gap-2">
          <span
            aria-hidden
            className={`font-mono text-[0.6875rem] tracking-caps text-on-panel/70 uppercase ${
              known ? "" : "invisible"
            }`}
          >
            {state}
          </span>
          <span
            role="img"
            aria-label={known ? `${office.city}: ${state.toLowerCase()}` : undefined}
            aria-hidden={known ? undefined : true}
            className={`relative block size-2.5 rounded-pill transition-colors dur-slow ease-brand ${
              open
                ? `bg-accent shadow-[0_0_12px_2px_rgb(254_192_15/0.55)] ${lively ? "talk-ping" : ""}`
                : "bg-transparent ring-1 ring-white/40"
            }`}
          />
        </span>
      </div>

      <p className="mt-3 text-sm text-on-panel/70">{office.line}</p>

      <div className="mt-auto pt-7">
        {/* The time over its zone, not beside it: two cards side by side at
            xl leave each about 230px, and a 64px clock with its label next to
            it needs 300. */}
        <div className="border-t border-white/10 pt-4">
          <LocalTime
            tz={office.tz}
            className="block text-4xl leading-none font-light tracking-[-0.03em] text-on-panel"
          />
          <p className="mt-2.5 font-mono text-[0.6875rem] tracking-caps text-on-panel/60 uppercase">
            {office.tzLabel}
          </p>
        </div>

        {/* The day, midnight to midnight: the working hours lit, and where
            the office is in it right now. A picture of the dot's state, so
            it is hidden from assistive technology. */}
        <div aria-hidden className="mt-5">
          <div className="relative h-1 rounded-pill bg-white/10">
            <span
              style={{ left: `${(OPEN / 24) * 100}%`, width: `${((CLOSE - OPEN) / 24) * 100}%` }}
              className={`absolute inset-y-0 block rounded-pill transition-colors dur-slow ease-brand ${
                open ? "bg-accent/70" : "bg-white/25"
              }`}
            />
            {known ? (
              <span
                style={{ left: `${(h / 24) * 100}%` }}
                className="absolute top-1/2 block size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-pill bg-on-panel shadow-[0_0_10px_2px_rgb(0_142_255/0.7)] transition-[left] duration-700 ease-brand"
              />
            ) : null}
          </div>
          <div className="relative mt-2 h-3 font-mono text-[0.6875rem] leading-none text-on-panel/60 tabular-nums">
            <span className="absolute left-0">00</span>
            <span style={{ left: `${(OPEN / 24) * 100}%` }} className="absolute -translate-x-1/2">
              {two(OPEN)}
            </span>
            <span style={{ left: `${(CLOSE / 24) * 100}%` }} className="absolute -translate-x-1/2">
              {two(CLOSE)}
            </span>
            <span className="absolute right-0">24</span>
          </div>
        </div>
      </div>
    </li>
  );
}
