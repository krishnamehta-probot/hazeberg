"use client";

import { useId, useRef, useState } from "react";
import { useInView } from "motion/react";
import { Plus } from "lucide-react";

import { FlowGlyph, HubDisc, HubRipples, Stream, type FlowData } from "./flow-parts";

/* -- the line's geometry, in px from each row's top-left ----------------------
   The trunk runs down x = 24 (the hub disc's centre). Each row leaves it at a
   junction 6px below the row's top, and its branch curves from there into the
   left edge of the row's icon, whose centre is at (60, 28): the card starts at
   36, the icon 8px inside it, 12px down. The branch's own box is 22 x 23,
   placed at (23, 6), so the stroke's centre runs from (24, 6) to (44, 28). */
const BRANCH_OUT = "M1 0C1 13 7 22 21 22";
const BRANCH_IN = "M21 22C7 22 1 13 1 0";
/** A packet on a branch: one short dash per run. */
const DASH = "0.3 0.7";
/** Seconds for a branch packet's run — at rest, and on an open row. */
const RUN = 1.5;
const RUN_LIT = 0.8;
/** Seconds between neighbouring trunk segments, so the light reads as one wave
    travelling the line rather than every segment pulsing at once. */
const STEP = 0.3;

/**
 * The flow hub, narrow: the same picture turned on its side. Eight nodes on a
 * ring at 320px would be eight unreadable chips, so the hub sits at the top and
 * the connections hang off one line running down the left from it — a trunk,
 * a short branch into each row, light travelling both.
 *
 * The idea holds: the light runs DOWN the trunk and out along the branches
 * when the hub feeds everything, and in along the branches and UP into the hub
 * when everything feeds it; the two-way connections carry amber coming back
 * along their branch. An open row's branch brightens and speeds up, the way the
 * selected connector does on the ring.
 *
 * Each row is a disclosure: tap it to read its line. Several can be open at
 * once — opening a row never closes one above it, so nothing jumps under a
 * finger. The first starts open. A closed line is `inert`; the section's
 * visually hidden list still carries every line for assistive technology.
 *
 * Built from CSS rather than measured: the trunk is drawn by each row, from its
 * own junction to the next one, so a row that opens stretches its own segment
 * and nothing has to be re-measured while it does. The seams sit under the
 * junction dots. Light stops when the list is off screen; under reduced motion
 * there is none, and the lines are simply drawn.
 */
export function FlowList({ data, twoWay }: { data: FlowData; twoWay: readonly boolean[] }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root);
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set([0]));

  const { items, hub } = data;
  const n = items.length;
  const inward = data.direction === "in";
  const branch = inward ? BRANCH_IN : BRANCH_OUT;

  const toggle = (i: number) =>
    setOpen((cur) => {
      const next = new Set(cur);
      if (!next.delete(i)) next.add(i);
      return next;
    });

  /* Segment s runs from junction s - 1 (the hub, for s = 0) to junction s. The
     wave starts at the hub going out and at the foot coming in. Negative, so
     every segment is already mid-run on the first frame. */
  const trunk = (s: number) => ({
    "data-up": inward || undefined,
    style: { "--flow-delay": `${((inward ? n - 1 - s : s) * STEP - 6).toFixed(2)}s` } as React.CSSProperties,
  });

  return (
    <div ref={root} data-flow-paused={inView ? undefined : ""} className="relative">
      {/* -- the hub -- */}
      <div className="relative flex items-center gap-4">
        <span aria-hidden {...trunk(0)} className="flow-trunk top-6 -bottom-[1.125rem] left-[23px] w-0.5" />
        <span aria-hidden className="relative size-12 shrink-0">
          <HubRipples inward={inward} reach={1.5} />
          <span className="relative block size-full rounded-pill shadow-[0_12px_24px_-10px_rgb(11_63_107/0.55)]">
            <HubDisc className="size-full" />
          </span>
        </span>
        <p className="text-2xl leading-tight font-light tracking-[-0.025em] text-ink">{hub}</p>
      </div>

      {/* -- the connections -- */}
      <ul className="mt-3">
        {items.map((item, i) => {
          const on = open.has(i);
          const panelId = `${uid}-line-${i}`;
          return (
            <li key={item.key} className="relative pb-2">
              {i < n - 1 ? (
                <span aria-hidden {...trunk(i + 1)} className="flow-trunk top-1.5 -bottom-1.5 left-[23px] w-0.5" />
              ) : null}
              <span
                aria-hidden
                className="absolute top-1.5 left-6 size-2 -translate-x-1/2 -translate-y-1/2 rounded-pill bg-canvas ring-2 ring-primary/45"
              />

              <div
                className={`ml-9 rounded-xl ring-1 transition dur-base ease-brand ${
                  on
                    ? "bg-canvas shadow-[0_14px_30px_-18px_rgb(25_114_185/0.45)] ring-primary/35"
                    : "bg-canvas/75 ring-border"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={panelId}
                  onClick={() => toggle(i)}
                  className="group/r flex min-h-14 w-full cursor-pointer items-start gap-2.5 rounded-xl py-3 pr-3 pl-2 text-left"
                >
                  <span
                    aria-hidden
                    className={`grid size-8 shrink-0 place-items-center rounded-pill transition-colors dur-base ease-brand ${
                      on ? "disc-blue text-white" : "bg-surface text-primary ring-1 ring-border"
                    }`}
                  >
                    <FlowGlyph id={item.key} className="size-3.5" />
                  </span>
                  <span className="min-w-0 flex-1 pt-1">
                    <span className="block text-sm leading-snug font-medium text-ink">{item.name}</span>
                    {item.vendor ? (
                      <span className="mt-1 block font-mono text-[0.6875rem] leading-snug tracking-caps break-words text-ink-subtle uppercase">
                        {item.vendor}
                      </span>
                    ) : null}
                  </span>
                  <span
                    aria-hidden
                    className={`mt-1 grid size-6 shrink-0 place-items-center rounded-pill ring-1 transition dur-base ease-brand ${
                      on
                        ? "rotate-45 text-primary ring-primary/35"
                        : "text-ink ring-border group-hover/r:text-primary group-hover/r:ring-primary/40"
                    }`}
                  >
                    <Plus className="size-3.5" strokeWidth={2} />
                  </span>
                </button>
                <div
                  id={panelId}
                  inert={!on}
                  className={`grid transition-[grid-template-rows] dur-base ease-brand ${
                    on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p
                      className={`pr-4 pb-4 pl-[3.125rem] text-sm text-ink-muted transition-opacity dur-base ease-brand ${
                        on ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {item.line}
                    </p>
                  </div>
                </div>
              </div>

              {/* After the card, so the branch is drawn over its edge and runs
                  right into the icon. */}
              <svg
                aria-hidden
                width="22"
                height="23"
                viewBox="0 0 22 23"
                fill="none"
                strokeLinecap="round"
                className="pointer-events-none absolute top-1.5 left-[23px] overflow-visible"
              >
                <path
                  d={branch}
                  className="stroke-primary transition-[stroke-opacity] dur-base ease-brand"
                  strokeOpacity={on ? 0.6 : 0.3}
                  strokeWidth={1.5}
                />
                <Stream
                  key={`f${on}`}
                  d={branch}
                  dash={DASH}
                  run={on ? RUN_LIT : RUN}
                  delay={-i * 0.37}
                  lit={on}
                  glow={5}
                  core={2}
                />
                {twoWay[i] ? (
                  <Stream
                    key={`b${on}`}
                    d={branch}
                    dash={DASH}
                    run={on ? RUN_LIT : RUN}
                    delay={-i * 0.37 - (on ? RUN_LIT : RUN) / 2}
                    lit={on}
                    glow={5}
                    core={2}
                    back
                  />
                ) : null}
              </svg>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
