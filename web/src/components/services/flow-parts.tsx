import { useId } from "react";
import {
  ArchiveRestore,
  ArrowLeftRight,
  ArrowRight,
  BotMessageSquare,
  FilePenLine,
  HeartPulse,
  KeyRound,
  Landmark,
  PiggyBank,
  Truck,
  UserRoundPlus,
  Users,
  Wallet,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import type { ServiceFeature } from "@/lib/service-content";

/* ---------------------------------------------------------------------------
   The pieces both drawings of the flow hub share — the ring a desktop gets and
   the line a phone gets (`flow-ring.tsx`, `flow-list.tsx`). Shared so the two
   cannot drift: one disc, one packet, one set of glyphs.
--------------------------------------------------------------------------- */

export type FlowData = Extract<ServiceFeature, { kind: "flows" }>;
export type FlowItem = FlowData["items"][number];

/** Presentation, not content: the client supplied no icons, and these are a UI
    set doing a UI job. Keyed by connection rather than position, so reordering
    the list in the CMS cannot hand the banks the recruiting glyph. The two
    finance-and-banking connections share the bank, on purpose — on either page
    it is the same counterparty. */
const FLOW_ICON: Record<string, LucideIcon> = {
  /* Financials, into the ledger */
  "hr-payroll": Users,
  banks: Landmark,
  suppliers: Truck,
  "old-erp": ArchiveRestore,
  /* Integrations, out of Workday */
  payroll: Wallet,
  benefits: HeartPulse,
  retirement: PiggyBank,
  identity: KeyRound,
  recruiting: UserRoundPlus,
  documents: FilePenLine,
  finance: Landmark,
  ai: BotMessageSquare,
};

/** A connection's glyph. A key the CMS adds before the map above learns it
    still gets one: the integrations mark itself, rather than nothing. */
export function FlowGlyph({
  id,
  className,
  strokeWidth = 1.9,
}: {
  id: string;
  className: string;
  strokeWidth?: number;
}) {
  const Icon = FLOW_ICON[id] ?? Workflow;
  return <Icon aria-hidden className={className} strokeWidth={strokeWidth} />;
}

export const pad = (i: number) => String(i + 1).padStart(2, "0");

/* The packets' light. Raw values, because these are SVG strokes animated by
   CSS and a token cannot reach them there: the light end of the client's blue
   gradient (`--grad-primary`), and the amber the call-to-action gradient starts
   from — a lit dot here, a fill, never a word. */
export const LIGHT = "#008eff";
const AMBER = "#f1b403";

/**
 * A stream of packets along one connector: a short dash repeating along the
 * path, run by `.flow-packet` in globals.css. Two strokes per packet — a wide
 * faint one under a thin bright one — so on the white ground it reads as a
 * light rather than as a dash.
 *
 * The path is oriented the way the data travels, so a stream always runs
 * forward along it. `back` runs the second stream of a two-way connection,
 * against the first, in amber — the same pairing as AI in the flow of work's
 * two lanes on What we do: blue out, amber back.
 *
 * The dash lives on `pathLength={1}`, in an SVG drawn 1:1 in pixels — never in
 * a stretched viewBox with `vector-effect`, where Chrome measures the dash in
 * screen pixels instead (see `impact-scene.tsx`). `lit` is the selected
 * connector: a white core in a stronger glow. Duration and phase come in as
 * numbers so each caller keeps its own pace in one place.
 */
export function Stream({
  d,
  dash,
  run,
  delay = 0,
  back = false,
  lit = false,
  glow = 7,
  core = 2.25,
}: {
  d: string;
  dash: string;
  /** Seconds for one packet to run the whole path. */
  run: number;
  delay?: number;
  back?: boolean;
  lit?: boolean;
  glow?: number;
  core?: number;
}) {
  const hue = back ? AMBER : LIGHT;
  const style = { animationDuration: `${run}s`, animationDelay: `${delay.toFixed(2)}s` };
  return (
    <>
      <path
        d={d}
        pathLength={1}
        strokeDasharray={dash}
        stroke={hue}
        strokeOpacity={lit ? 0.4 : 0.22}
        strokeWidth={lit ? glow + 2 : glow}
        data-back={back || undefined}
        className="flow-packet"
        style={style}
      />
      <path
        d={d}
        pathLength={1}
        strokeDasharray={dash}
        stroke={lit ? "#ffffff" : hue}
        strokeWidth={core}
        data-back={back || undefined}
        className="flow-packet"
        style={style}
      />
    </>
  );
}

/**
 * The hub: the brand blue as glass, from the same family as the services
 * wheel's core on the home page (`services-map.tsx`) — the client's three-stop
 * gradient lit from the top left, a white rim, a sheen across the top and a
 * pale inner edge. Square viewBox, scaled uniformly, so nothing in it is ever
 * stretched.
 *
 * Decoration only: whatever names the hub is set over it, in HTML, by the
 * caller. White type at the middle of this gradient measures about 4.5:1, so
 * the callers set the name at 24px or more, where 3:1 is the bar.
 */
export function HubDisc({ className = "" }: { className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className}>
      <defs>
        {/* The client's blue, as `--grad-blue` has it. */}
        <radialGradient id={`${id}-core`} cx="0.32" cy="0.22" r="0.95">
          <stop offset="0" stopColor="#2b8ae0" />
          <stop offset="0.42" stopColor="#1972b9" />
          <stop offset="1" stopColor="#0b3f6b" />
        </radialGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <circle cx="50" cy="50" r="46" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="50" fill="#ffffff" />
      <circle cx="50" cy="50" r="46" fill={`url(#${id}-core)`} />
      <g clipPath={`url(#${id}-clip)`}>
        <ellipse cx="62" cy="24" rx="48" ry="22" fill={`url(#${id}-sheen)`} transform="rotate(-24 62 24)" />
      </g>
      <circle cx="50" cy="50" r="45.2" fill="none" stroke="rgb(140 200 250 / 0.75)" strokeWidth="1.2" />
    </svg>
  );
}

/**
 * Two rings the hub sends out — or draws in. `out` (Workday feeding everything)
 * broadcasts: the rings leave the disc and fade. `in` (everything landing in
 * the ledger) gathers: they arrive from outside and fade as they reach it. The
 * direction of the whole section, said once more at its centre.
 *
 * Transform and opacity only. `--flow-ripple` is how far a ring travels, so a
 * small disc can keep its rings inside the frame.
 */
export function HubRipples({ inward, reach }: { inward: boolean; reach?: number }) {
  return (
    <>
      {[0, 1].map((k) => (
        <span
          key={k}
          aria-hidden
          data-in={inward || undefined}
          style={
            {
              animationDelay: `${-k * 1.7}s`,
              ...(reach ? { "--flow-ripple": String(reach) } : null),
            } as React.CSSProperties
          }
          className="flow-ripple absolute inset-0 rounded-pill ring-1 ring-primary/45"
        />
      ))}
    </>
  );
}

/**
 * The connection as a route, in the detail card: hub, arrow, the far end — in
 * the order the data travels, with a two-headed arrow where it travels both
 * ways. The far end is the vendor where the document names one, and the
 * connection's own glyph where it does not. Every word in it is data.
 *
 * Hidden from assistive technology: the tab and the list in the section
 * already carry the vendor, and an arrow read aloud is noise.
 */
export function FlowRoute({
  item,
  hub,
  inward,
  twoWay,
}: {
  item: FlowItem;
  hub: string;
  inward: boolean;
  twoWay: boolean;
}) {
  const Glyph = twoWay ? ArrowLeftRight : ArrowRight;
  const far = item.vendor ? (
    <span>{item.vendor}</span>
  ) : (
    <FlowGlyph id={item.key} className="size-3.5 text-ink" />
  );
  const core = (
    <span className="inline-flex items-center gap-1.5">
      <span className="disc-blue size-2 rounded-pill" />
      {hub}
    </span>
  );
  return (
    <p
      aria-hidden
      className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase"
    >
      {inward ? far : core}
      <Glyph className="size-3.5 shrink-0 text-primary" strokeWidth={2} />
      {inward ? core : far}
    </p>
  );
}
