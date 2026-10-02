"use client";

import {
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { LayoutGroup, motion, useReducedMotion, type Transition, type Variants } from "motion/react";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  Cable,
  Calculator,
  ChartPie,
  HeartHandshake,
  ShieldCheck,
  Stamp,
  TrendingUp,
  UserRound,
  UserSearch,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import type { ServiceAudience } from "@/lib/service-content";

/** Presentation, not content: the client supplied no audience icons. Keyed by
    the group's [derived] key rather than its position, so a reordered group
    keeps its glyph, and a key this map has not met yet gets the plain group
    rather than nothing. Employees and managers wear the glyphs they wear in
    AI in the flow of work, so a reader who met them there knows them here. */
const GROUP_ICON: Record<string, LucideIcon> = {
  employees: UserRound,
  managers: UserSearch,
  "hr-teams": HeartHandshake,
  "payroll-team": Calculator,
  finance: ChartPie,
  "finance-leaders": TrendingUp,
  "accounting-team": BookOpenCheck,
  "budget-holders": Stamp,
  "it-security": ShieldCheck,
  "hris-integration": Cable,
  "hr-payroll-finance": Building2,
};
const iconFor = (key: string) => GROUP_ICON[key] ?? UsersRound;

const EASE = [0.22, 1, 0.36, 1] as const;
const INSTANT: Transition = { duration: 0 };
/** The selected tab's ground travelling to the next one. */
const PILL: Transition = { type: "spring", stiffness: 380, damping: 34, mass: 0.8 };

/* The selector stands beside the lens from lg and sits above it below that, so
   the arrow keys that move along it change with it. Read through the store so
   the server and the first client render agree (horizontal) and the real value
   arrives straight after. */
const WIDE = "(min-width: 1024px)";
const subscribeWide = (onChange: () => void) => {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const wideNow = () => window.matchMedia(WIDE).matches;
const wideOnServer = () => false;

const pad = (i: number) => String(i + 1).padStart(2, "0");

/* The values are the same with and without reduced motion — only the timing
   changes — so the server's markup is right for both and nothing has to be
   corrected after hydration. Reduced motion gets the same states, cut. */
const panelVariants = (still: boolean): Variants => ({
  hidden: { transition: { staggerChildren: 0 } },
  shown: { transition: still ? INSTANT : { staggerChildren: 0.06, delayChildren: 0.05 } },
});
const lineVariants = (still: boolean): Variants => ({
  hidden: { opacity: 0, y: 14, transition: still ? INSTANT : { duration: 0.16, ease: "easeOut" } },
  shown: { opacity: 1, y: 0, transition: still ? INSTANT : { duration: 0.5, ease: EASE } },
});

/**
 * The selector and the lens.
 *
 * A real tablist: one tab in the tab order at a time, the arrow keys moving
 * along it (left and right while it is a row, up and down once it stands as a
 * column), Home and End to its ends, and selection following focus — the
 * panels are already on the page, so there is nothing to wait for.
 *
 * The selected tab's ground is one dark pill that travels between the three
 * (`layoutId`), cut from the same ink as the lens, so the eye reads the chosen
 * group and the panel as one object. Inside the lens a soft blue light sits on
 * the edge nearest the selector and slides level with the chosen tab — along
 * the top on a phone, down the left from lg (`.aud-bloom`, transform only).
 *
 * All three panels are mounted, in the same grid cell. The tallest one sets
 * the lens's height whichever is showing, so changing group never moves the
 * page; the other two are `invisible`, which takes them out of the tab order
 * and the accessibility tree without taking them out of the layout. A switch
 * is a short cross-fade: the old panel lets go, and the new one arrives in
 * reading order — its name, then the four changes.
 *
 * Phones get the selector as a three-up segmented control, icon over name.
 * "Budget holders and approvers" wraps there, and the three cells share the
 * tallest one's height, so the control stays one even row.
 */
export function AudienceTabs({
  groups,
  idBase,
  labelledBy,
}: {
  groups: readonly ServiceAudience[];
  idBase: string;
  labelledBy: string;
}) {
  const still = Boolean(useReducedMotion());
  const wide = useSyncExternalStore(subscribeWide, wideNow, wideOnServer);
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = groups.length;

  const tabId = (i: number) => `${idBase}-tab-${groups[i].key}`;
  const panelId = (i: number) => `${idBase}-panel-${groups[i].key}`;

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const back = wide ? "ArrowUp" : "ArrowLeft";
    const on = wide ? "ArrowDown" : "ArrowRight";
    const to =
      e.key === on
        ? (active + 1) % n
        : e.key === back
          ? (active - 1 + n) % n
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : null;
    if (to === null) return;
    e.preventDefault();
    setActive(to);
    tabs.current[to]?.focus();
  };

  const panel = panelVariants(still);
  const line = lineVariants(still);

  return (
    <LayoutGroup id={`${idBase}-lens`}>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
        {/* -- the selector ------------------------------------------------- */}
        <div
          role="tablist"
          aria-labelledby={labelledBy}
          aria-orientation={wide ? "vertical" : "horizontal"}
          className="grid grid-cols-3 gap-1 rounded-2xl bg-surface p-1 ring-1 ring-border lg:grid-cols-1 lg:grid-rows-3 lg:gap-3 lg:rounded-none lg:bg-transparent lg:p-0 lg:ring-0"
        >
          {groups.map((g, i) => {
            const on = i === active;
            const Icon = iconFor(g.key);
            return (
              <button
                key={g.key}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={tabId(i)}
                aria-selected={on}
                aria-controls={panelId(i)}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={onKeyDown}
                className={`group/tab relative flex min-h-19 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl px-1.5 py-3 text-center transition dur-base ease-brand active:scale-[0.98] lg:flex-row lg:justify-start lg:gap-4 lg:rounded-2xl lg:px-5 lg:py-4 lg:text-left ${
                  on
                    ? "text-on-panel"
                    : "text-ink-muted hover:text-ink max-lg:hover:bg-canvas/70 lg:bg-surface lg:ring-1 lg:ring-border lg:hover:ring-primary/35"
                }`}
              >
                {on ? (
                  <motion.span
                    layoutId="pill"
                    aria-hidden
                    transition={still ? INSTANT : PILL}
                    className="grad-ink grain absolute inset-0 overflow-hidden rounded-[inherit] shadow-lg shadow-primary/20"
                  />
                ) : null}

                <span
                  aria-hidden
                  className={`relative grid size-8 shrink-0 place-items-center rounded-pill transition-colors dur-base ease-brand lg:size-11 ${
                    on
                      ? "disc-blue text-white"
                      : "bg-canvas text-primary ring-1 ring-border group-hover/tab:ring-primary/40"
                  }`}
                >
                  <Icon className="size-4 lg:size-5" strokeWidth={1.8} />
                </span>

                <span className="relative min-w-0 lg:flex-1">
                  <span
                    aria-hidden
                    className={`hidden font-mono text-[0.6875rem] tracking-caps transition-colors dur-base ease-brand lg:block ${
                      on ? "text-accent" : "text-ink-subtle"
                    }`}
                  >
                    {pad(i)}
                  </span>
                  <span className="block text-xs leading-tight font-medium text-balance hyphens-auto sm:text-sm lg:mt-1 lg:text-lg lg:leading-snug lg:font-normal">
                    {g.name}
                  </span>
                </span>

                {/* From lg the chosen tile points at the lens it is showing. */}
                <ArrowRight
                  aria-hidden
                  className={`relative hidden size-4 shrink-0 transition dur-base ease-brand lg:block ${
                    on ? "translate-x-0 text-on-panel/80 opacity-100" : "-translate-x-1 opacity-0"
                  }`}
                  strokeWidth={2}
                />
              </button>
            );
          })}
        </div>

        {/* -- the lens ----------------------------------------------------- */}
        <div className="grad-ink grain relative isolate min-w-0 overflow-hidden rounded-2xl text-on-panel">
          <span
            aria-hidden
            className="aud-bloom"
            style={{ "--at": active, "--n": n } as CSSProperties}
          />
          {/* The lens's own optics: two faint rings off its far corner. */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-28 -bottom-28 size-96 rounded-full ring-1 ring-white/8"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-10 -bottom-10 size-60 rounded-full ring-1 ring-white/6"
          />

          <div className="relative grid">
            {groups.map((g, i) => {
              const on = i === active;
              const Icon = iconFor(g.key);
              return (
                <motion.div
                  key={g.key}
                  id={panelId(i)}
                  role="tabpanel"
                  aria-labelledby={tabId(i)}
                  tabIndex={on ? 0 : -1}
                  initial={false}
                  animate={on ? "shown" : "hidden"}
                  variants={panel}
                  /* Visibility waits for the old panel's fade before it lets
                     go, and arrives at once with the new one. */
                  className={`col-start-1 row-start-1 rounded-2xl p-6 focus-visible:outline-offset-[-8px] focus-visible:outline-on-panel/70 sm:p-8 lg:p-10 ${
                    on
                      ? "visible [transition:visibility_0s]"
                      : "pointer-events-none invisible [transition:visibility_0s_200ms]"
                  }`}
                >
                  <motion.div variants={line} className="flex items-center gap-4">
                    <span
                      aria-hidden
                      className="disc-blue grid size-11 shrink-0 place-items-center rounded-pill text-white shadow-lg shadow-primary/30 sm:size-12"
                    >
                      <Icon className="size-5" strokeWidth={1.7} />
                    </span>
                    <h3 className="min-w-0 flex-1 text-xl leading-tight font-light tracking-[-0.02em] text-balance sm:text-2xl">
                      {g.name}
                    </h3>
                    {/* From sm only: on a phone the segmented control above
                        already says which one, and the name needs the width. */}
                    <p
                      aria-hidden
                      className="hidden shrink-0 font-mono text-[0.6875rem] tracking-caps text-on-panel/55 sm:block"
                    >
                      <span className="text-on-panel">{pad(i)}</span> / {pad(n - 1)}
                    </p>
                  </motion.div>

                  <ol className="mt-6 -mb-5 grid gap-x-10 sm:mt-8 sm:-mb-6 sm:grid-cols-2">
                    {g.features.map((f, k) => (
                      <motion.li
                        key={f.title}
                        variants={line}
                        className="flex gap-4 border-t border-white/10 py-5 sm:py-6"
                      >
                        {/* Amber as type is legal here: the lens is the dark
                            ground, 11.97:1. */}
                        <span
                          aria-hidden
                          className="pt-1 font-mono text-[0.6875rem] tracking-caps text-accent"
                        >
                          {pad(k)}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-lg leading-snug font-normal text-on-panel">
                            {f.title}
                          </h4>
                          <p className="mt-1.5 max-w-[42ch] text-sm text-on-panel/70">{f.line}</p>
                        </div>
                      </motion.li>
                    ))}
                  </ol>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </LayoutGroup>
  );
}
