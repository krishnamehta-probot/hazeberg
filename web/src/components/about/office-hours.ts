import { zonedHours } from "@/components/ui/local-time";
import { OFFICES } from "@/lib/navigation";

/*
 * The working days both of About's clocks read: Penang's ring on How we're
 * built's dial, and the two office cards in the close. One definition, so the
 * page can never call the same city open in one section and closed in the
 * next, or say it in two different words.
 *
 * The hours are the client's own, read straight out of `OFFICES` in
 * `lib/navigation.ts` (supplied 2026-09-30): "Mon–Fri, 9:00–18:30" for the
 * India offices and "Mon–Fri, 9:00–18:00" for Penang. Change them there and
 * every clock on the site follows. Only the zone-to-office pairing is
 * [derived] — the offices carry a label ("IST · UTC+5:30"), not a zone name.
 */

export type WorkingDay = { open: number; close: number };

const FALLBACK: WorkingDay = { open: 9, close: 18 };

const CITY_BY_ZONE: Record<string, string> = {
  "Asia/Kolkata": "Coimbatore",
  "Asia/Kuala_Lumpur": "Penang",
};

/** "Mon–Fri, 9:00–18:30" -> { open: 9, close: 18.5 }. */
function parse(hours: string): WorkingDay | null {
  const m = hours.match(/(\d{1,2}):(\d{2})\D+(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return { open: Number(m[1]) + Number(m[2]) / 60, close: Number(m[3]) + Number(m[4]) / 60 };
}

const days = new Map<string, WorkingDay>();

/** The working day of the office in `tz`, in local hours. */
export function dayFor(tz: string): WorkingDay {
  let d = days.get(tz);
  if (!d) {
    const office = OFFICES.find((o) => o.city === CITY_BY_ZONE[tz]);
    d = (office && parse(office.hours)) ?? FALLBACK;
    days.set(tz, d);
  }
  return d;
}

/** What a status reads as. Interface text, not copy. */
export const STATUS = { open: "Open now", closed: "After hours" } as const;

const weekdays = new Map<string, Intl.DateTimeFormat>();

function isWeekend(t: number, tz: string) {
  let f = weekdays.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: tz });
    weekdays.set(tz, f);
  }
  const day = f.format(t);
  return day === "Sat" || day === "Sun";
}

/** Whether `tz` is inside its working day at `t` (epoch ms). Client-side only:
    `t` comes from `useMinute`, which is 0 until hydration. */
export function inWorkingDay(t: number, tz: string) {
  if (!t || isWeekend(t, tz)) return false;
  const h = zonedHours(t, tz);
  const { open, close } = dayFor(tz);
  return h >= open && h < close;
}
