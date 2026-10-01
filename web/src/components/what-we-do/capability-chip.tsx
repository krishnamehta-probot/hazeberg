import {
  ArrowDown,
  Banknote,
  CalendarSync,
  Coins,
  Gauge,
  Headset,
  Layers,
  Network,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

import { CAPABILITY_NAME, type CapabilityId } from "@/lib/what-we-do-content";

/**
 * One icon per capability, used everywhere the capability appears on the page —
 * the chip, the accordion row, the lifecycle map. A capability that wears a
 * different glyph in each section reads as eight things in one place and eight
 * other things in the next.
 */
export const CAPABILITY_ICON: Record<CapabilityId, LucideIcon> = {
  "workday-implementation": Layers,
  "workday-optimization": Gauge,
  "workday-ams": Headset,
  "cost-optimization": Coins,
  "integration-modernization": Network,
  "payroll-transformation": Banknote,
  "release-management": CalendarSync,
  "workday-health-check": Stethoscope,
};

/**
 * A capability, named anywhere on the page, is a door to it.
 *
 * Every chip is a plain `#anchor` link to that capability's accordion row:
 * Lenis carries the scroll (`smooth-scroll.tsx` takes every `href="#..."`), and
 * the accordion opens the row itself — it listens for exactly these clicks. So
 * the challenges, the journeys and the lifecycle map are not three more lists
 * of names; they are three routes into the one place each capability is
 * explained.
 *
 * The arrow points DOWN because that is where it goes. The 44px height is the
 * hit area, not decoration.
 */
export function CapabilityChip({
  id,
  tone = "light",
}: {
  id: CapabilityId;
  /** `dark` for the ink sections. */
  tone?: "light" | "dark";
}) {
  const Icon = CAPABILITY_ICON[id];
  const dark = tone === "dark";
  return (
    <a
      href={`#${id}`}
      className={`group/chip inline-flex min-h-11 items-center gap-2.5 rounded-pill py-2 pr-3.5 pl-2 text-sm ring-1 transition dur-base ease-brand ${
        dark
          ? "bg-white/6 text-on-panel ring-white/14 hover:bg-white/12 hover:ring-white/30"
          : "bg-canvas text-ink ring-border hover:text-primary hover:ring-primary/40"
      }`}
    >
      <span
        aria-hidden
        className={`grid size-7 shrink-0 place-items-center rounded-pill ${
          dark ? "bg-white/10 text-on-panel" : "bg-surface text-primary"
        }`}
      >
        <Icon className="size-3.5" strokeWidth={2} />
      </span>
      {CAPABILITY_NAME[id]}
      <ArrowDown
        aria-hidden
        className="size-3.5 -translate-y-0.5 opacity-0 transition dur-base ease-brand group-hover/chip:translate-y-0 group-hover/chip:opacity-100 group-focus-visible/chip:translate-y-0 group-focus-visible/chip:opacity-100"
        strokeWidth={2}
      />
    </a>
  );
}
