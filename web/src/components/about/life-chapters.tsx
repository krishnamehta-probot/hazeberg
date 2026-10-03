"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import Image from "next/image";
import { MotionConfig, motion, useInView, type Transition, type UseInViewOptions } from "motion/react";
import { Expand } from "lucide-react";

import { HazebergBirds } from "@/components/brand/hazeberg-wordmark";
import { VIEWPORT } from "@/components/motion/reveal";

import { LifeLightbox } from "./life-lightbox";

/**
 * Whether something has come up the screen yet, and whether it should wait
 * for it.
 *
 * Every entrance in this section is CSS, and every one of them starts from
 * the AT-REST state: without script, before hydration and under reduced
 * motion, the prints lie flat and the motto is set, because nothing has
 * asked them to wait. This is the opt-in. Before the first paint React
 * makes, it looks at where the element is, and only if it is still below
 * the fold does it set `data-armed` (straight on the element, not through
 * React, so the server's markup and the first client render stay the same).
 * Armed, the CSS holds it in its waiting place until `useInView` says it has
 * arrived. Anything already on screen when the page came to life is never
 * armed, so nobody sees it vanish and play again. Reduced motion is the CSS's
 * business, not this hook's: the attribute goes on either way, and only the
 * timing changes.
 *
 * Arming is idempotent and has no cleanup on purpose: once the element has
 * arrived the attribute holds nothing, and taking it off in between (Strict
 * Mode's rehearsal unmount) would move the tabs 64px under motion's feet just
 * as it snapshots the bar, which then glides in from nowhere.
 */
export function useArrival(ref: RefObject<HTMLElement | null>, viewport: UseInViewOptions) {
  const arrived = useInView(ref, viewport);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || el.getBoundingClientRect().top < window.innerHeight) return;
    el.dataset.armed = "";
  }, [ref]);
  return arrived;
}

/** A place on a sheet's grid, which from md is 12 columns by 6 rows of square
    units: the column and row it starts on, and how many of each it spans. */
export type LifeCell = readonly [col: number, row: number, cols: number, rows: number];

/** One photograph, resolved on the server (`life-at-hazeberg.tsx`) so the
    photo table never enters this bundle. */
export type LifeFrame = {
  key: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  blur: string;
  cell: LifeCell;
  /** What its cell is drawn at, at every width — the strip's on a phone, the
      sheet's from md. */
  sizes: string;
};

export type LifeChapter = {
  key: string;
  label: string;
  frames: readonly LifeFrame[];
  /** The chapter's title card: the cell its photographs leave over. */
  slate: LifeCell;
};

/** The selected tab's bar travelling to the next one — the roster's glide. */
const GLIDE: Transition = { type: "spring", stiffness: 420, damping: 38, mass: 0.8 };

/** How far off square each print lands before it settles, in deal order. A
    fixed table, not a random one: the server and the client have to agree. */
const TILT = [-2.2, 1.6, -1.2, 2, -1.6, 1.2, -0.8, 1.4];

const two = (n: number) => String(n).padStart(2, "0");

/** A cell as the two grid lines the sheet's CSS reads (`.life-tile`). */
const place = ([col, row, cols, rows]: LifeCell) => ({
  "--c": `${col} / span ${cols}`,
  "--r": `${row} / span ${rows}`,
});

/**
 * Life at Hazeberg's working part: the three chapters as a tablist, each
 * chapter's photographs as a sheet dealt onto the ground, and the viewer that
 * opens any one of them full size.
 *
 * **The chapters are a real tablist** — three views of one place, one at a
 * time. A roving tabindex puts the open chapter in the tab order and the
 * other two one arrow away (← and → move and open as they go, Home and End
 * jump to the ends), each sheet is a tabpanel labelled by its tab, and Tab
 * goes on from the chapter to its first photograph. The open tab carries the
 * blue bar, which GLIDES between them (`layoutId`; measured only when the
 * chapter changes, `layoutDependency`, so the tabs' own entrance and the
 * section's other re-renders never set it sliding), and every tab prints its
 * frame count under its name in mono, the way a contact sheet numbers a roll.
 *
 * **The three sheets share one grid cell** (`.life-sheets`), and from md each
 * is the same 2:1 box, so changing chapter never moves the page under the
 * reader. Every photograph of every chapter is in the server's HTML with its
 * alt text; the two closed sheets are `inert` (out of the tab order and the
 * accessibility tree at once) and `visibility: hidden` once their prints have
 * gone, as closed tabpanels should be.
 *
 * **The closed chapters wait for a reach** (`data-warm`). Until the reader
 * points at, touches or tabs into the chapters, the two closed sheets are
 * `display: none`, so their eleven lazy thumbnails are never fetched — about
 * three quarters of the section's bytes (355 KB of 478 at 1440 on a 1×
 * screen, 950 KB of 1.3 MB on a 2× one), spent by everyone and looked at only
 * by those who change chapter. Hover and focus come a few hundred
 * milliseconds before the click, and a touch's pointerdown before its tap;
 * the deal staggers its prints over most of a second, and every print has its
 * blur meanwhile, so the chapter still changes at once and its photographs
 * sharpen inside the deal (measured on a phone at 9 Mbps, a cold tap: the
 * 2025 prints arrived 470–845ms after the press, against the deal's
 * 580–745ms fade-in).
 *
 * **The deal.** A sheet's prints are not faded in; they are dealt. Each one
 * lands from a little below, a degree or two off square and a touch small,
 * and settles flat, one after another in reading order (`--i`), so the
 * collage assembles the way a pile of prints does on a table. It happens once
 * when the sheets first come up the screen (`useArrival`, on the site's
 * reveal line), and again whenever the chapter changes: the old prints are
 * cleared where they lie and the new chapter is dealt in their place. CSS on
 * flags, so nothing animates through React state. The prints' default is to
 * lie flat: only a sheet still below the fold is armed to wait for the deal,
 * so without script, before hydration, and for a reader already looking at
 * it, the photographs are simply there. Reduced motion keeps the flags and
 * loses the timing: the prints are always there, and a change of chapter
 * cuts.
 *
 * **Phones get a strip**, not a 21-tile column: below md each sheet is one
 * horizontal row at a fixed height, every print at its own proportions with
 * nothing cropped, snapping frame by frame and running to the screen's edge
 * so the next one shows. The title card is a desktop object and stays off it;
 * the tab already carries the count.
 *
 * Each print is a button that opens `LifeLightbox` on its own frame. The
 * button remembers itself as the opener, and focus goes back to it when the
 * viewer closes.
 *
 * No auto-advance, by design: a gallery that changes chapter on its own takes
 * the photograph away from whoever was looking at it.
 */
export function LifeChapters({
  chapters,
  label,
  head,
}: {
  chapters: readonly LifeChapter[];
  /** The tablist's accessible name. */
  label: string;
  /** The section's head, server-rendered, set beside the tabs from lg. */
  head: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [warm, setWarm] = useState(false);
  const [view, setView] = useState<{ chapter: number; frame: number } | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const opener = useRef<HTMLButtonElement | null>(null);
  const rise = useRef<HTMLDivElement>(null);
  const sheets = useRef<HTMLDivElement>(null);
  const risen = useArrival(rise, VIEWPORT);
  const dealt = useArrival(sheets, VIEWPORT);
  const last = chapters.length - 1;
  const reach = () => setWarm(true);

  const tabId = (c: LifeChapter) => `life-tab-${c.key}`;
  const panelId = (c: LifeChapter) => `life-panel-${c.key}`;

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const next =
      e.key === "ArrowRight"
        ? i === last
          ? 0
          : i + 1
        : e.key === "ArrowLeft"
          ? i === 0
            ? last
            : i - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    // The arrows would otherwise scroll a phone's strip, or the page.
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  /* The viewer closes itself (Esc, the close button, a click off the
     photograph); this is told afterwards, and hands focus back. */
  const onClose = () => {
    setView(null);
    opener.current?.focus({ preventScroll: true });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div className="min-w-0 lg:flex-1">{head}</div>

        {/* -- the chapters ------------------------------------------------- */}
        {/* The site's reveal, in CSS (`.life-rise`), so the tabs are there
            without script and agree with the server under reduced motion. */}
        <div ref={rise} data-on={risen ? "" : undefined} className="life-rise lg:shrink-0">
          <div
            role="tablist"
            aria-label={label}
            onPointerEnter={reach}
            onPointerDown={reach}
            onFocus={reach}
            className="grid grid-cols-3 gap-x-3 border-b border-white/15 sm:flex sm:gap-x-9"
          >
            {chapters.map((c, i) => {
              const on = i === active;
              return (
                <button
                  key={c.key}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={tabId(c)}
                  aria-selected={on}
                  aria-controls={panelId(c)}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className="group/tab relative flex min-h-11 cursor-pointer flex-col items-start justify-end rounded-sm pt-2 pb-4 text-left focus-visible:outline-on-panel"
                >
                  <span
                    className={`text-sm leading-tight font-light tracking-[-0.01em] transition-colors dur-base ease-brand sm:text-base ${
                      on ? "text-on-panel" : "text-on-panel/60 group-hover/tab:text-on-panel"
                    }`}
                  >
                    {c.label}
                  </span>
                  <span
                    aria-hidden
                    className="mt-1.5 font-mono text-[0.6875rem] tracking-caps text-on-panel/60 uppercase tabular-nums"
                  >
                    {two(c.frames.length)} frames
                  </span>
                  {on ? (
                    <motion.span
                      layoutId="life-tab-bar"
                      layoutDependency={active}
                      transition={GLIDE}
                      aria-hidden
                      className="grad-primary absolute inset-x-0 -bottom-px block h-0.5 rounded-pill"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* -- the sheets ------------------------------------------------------ */}
      <div
        ref={sheets}
        data-dealt={dealt ? "" : undefined}
        data-warm={warm ? "" : undefined}
        className="life-sheets mt-8 lg:mt-12"
      >
        {chapters.map((c, ci) => {
          const on = ci === active;
          const n = c.frames.length;
          return (
            <div
              key={c.key}
              role="tabpanel"
              id={panelId(c)}
              aria-labelledby={tabId(c)}
              inert={!on}
              data-on={on ? "" : undefined}
              className="life-sheet"
            >
              <ul className="life-grid">
                {c.frames.map((f, i) => (
                  <li
                    key={f.key}
                    className="life-tile"
                    style={
                      {
                        ...place(f.cell),
                        "--ar": `${f.width} / ${f.height}`,
                        "--i": i,
                        "--tilt": `${TILT[i % TILT.length]}deg`,
                      } as CSSProperties
                    }
                  >
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      onClick={(e) => {
                        opener.current = e.currentTarget;
                        setView({ chapter: ci, frame: i });
                      }}
                      className="group/tile relative block size-full cursor-pointer overflow-hidden rounded-md bg-white/[0.04] ring-1 ring-white/10 transition-shadow dur-base ease-brand hover:ring-white/35 focus-visible:outline-on-panel"
                    >
                      <Image
                        src={f.src}
                        alt={f.alt}
                        fill
                        sizes={f.sizes}
                        placeholder="blur"
                        blurDataURL={f.blur}
                        className="object-cover transition-transform dur-slow ease-brand group-hover/tile:scale-105"
                      />
                      {/* The frame's number, as a contact sheet prints it. */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute bottom-2 left-2 rounded-pill bg-void/70 px-2 py-0.5 font-mono text-[0.6875rem] tracking-caps text-on-panel tabular-nums backdrop-blur-sm"
                      >
                        {two(i + 1)}
                      </span>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute top-2 right-2 grid size-8 place-items-center rounded-pill bg-void/60 text-on-panel opacity-0 backdrop-blur-sm transition-opacity dur-base ease-brand group-hover/tile:opacity-100 group-focus-visible/tile:opacity-100"
                      >
                        <Expand className="size-3.5" strokeWidth={2} />
                      </span>
                    </button>
                  </li>
                ))}

                {/* The title card. It repeats what the tab says, so it is
                    hidden from assistive technology and left out of the
                    list's count. */}
                <li
                  aria-hidden
                  className="life-tile relative hidden flex-col justify-between overflow-hidden rounded-md bg-white/[0.04] p-4 ring-1 ring-white/10 md:flex lg:p-5"
                  style={{ ...place(c.slate), "--i": n, "--tilt": "0deg" } as CSSProperties}
                >
                  <HazebergBirds className="absolute -top-[18%] -right-[14%] w-[62%] text-white/[0.06]" />
                  <span className="relative font-mono text-[0.6875rem] tracking-caps text-on-panel/60 uppercase tabular-nums">
                    {two(ci + 1)} / {two(chapters.length)}
                  </span>
                  <span className="relative">
                    <span className="block text-xl leading-[1.1] font-light tracking-[-0.02em] text-balance text-on-panel">
                      {c.label}
                    </span>
                    <span className="mt-2 flex items-center gap-2 font-mono text-[0.6875rem] tracking-caps text-on-panel/60 uppercase tabular-nums">
                      <span className="size-1.5 shrink-0 rounded-pill bg-primary" />
                      {two(n)} frames
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          );
        })}
      </div>

      <LifeLightbox
        chapter={view ? chapters[view.chapter] : null}
        frame={view?.frame ?? 0}
        onStep={(to) => setView((v) => (v ? { ...v, frame: to } : v))}
        onClose={onClose}
      />
    </MotionConfig>
  );
}
