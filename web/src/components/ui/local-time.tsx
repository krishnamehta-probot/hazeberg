"use client";

import { useSyncExternalStore } from "react";

/**
 * The time somewhere else, live — for the offices, and for anything that wants
 * to show "it is working hours there right now".
 *
 * One shared clock for the whole page: a single timeout, re-armed on each
 * minute boundary, however many clocks are mounted. It only runs while at least
 * one is mounted.
 *
 * The server does not know the reader's minute, so it renders `--:--` and the
 * real time arrives after hydration (`getServerSnapshot` returns 0). The
 * placeholder is the same width in tabular figures, so nothing shifts.
 */

let now = 0;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function arm() {
  timer = setTimeout(
    () => {
      now = Date.now();
      listeners.forEach((l) => l());
      arm();
    },
    60_000 - (Date.now() % 60_000) + 40,
  );
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    now = Date.now();
    arm();
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size && timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  };
}

function getSnapshot() {
  if (!now) now = Date.now();
  return now;
}

const getServerSnapshot = () => 0;

/** The current minute as epoch ms, or 0 before hydration. */
export function useMinute(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const formats = new Map<string, Intl.DateTimeFormat>();
function format(tz: string) {
  let f = formats.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone: tz,
    });
    formats.set(tz, f);
  }
  return f;
}

/** Hours since local midnight in `tz`, fractional — 13.5 is half past one in
    the afternoon there. For dials and "open now" checks. */
export function zonedHours(t: number, tz: string): number {
  const parts = format(tz).formatToParts(t);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return (h % 24) + m / 60;
}

export function LocalTime({ tz, className = "" }: { tz: string; className?: string }) {
  const t = useMinute();
  return (
    <time className={`tabular-nums ${className}`} dateTime={t ? new Date(t).toISOString() : undefined}>
      {t ? format(tz).format(t) : "--:--"}
    </time>
  );
}
