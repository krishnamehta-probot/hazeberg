"use client";

import { useEffect, useRef, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

import type { LifeChapter } from "./life-chapters";

/**
 * What the photograph is drawn at, for `sizes`. The stage is the window less
 * the chrome round it — from md, a gutter and a 48px step button with its gap
 * on each side, and the bar, the caption and their margins top and bottom;
 * on a phone, the gutters across and a taller foot, where the step buttons
 * sit — and the photograph is the largest box of its own proportions that
 * fits in it. `calc()` round every `vw`: next/image prunes its candidate
 * widths by the smallest bare `NNvw` it finds, which is the wrong question
 * for an expression like this one.
 */
const stageSizes = (ar: number) => {
  const r = +ar.toFixed(3);
  return [
    `(min-width: 768px) min(calc(100vw - 12rem), calc((100vh - 12.5rem) * ${r}))`,
    `min(calc(100vw - 2.5rem), calc((100vh - 14rem) * ${r}))`,
  ].join(", ");
};

/** A round control on the void, 48px. Display is left to each use: the step
    buttons stand beside the photograph from md and under it on a phone. */
const BUTTON =
  "size-12 shrink-0 cursor-pointer place-items-center rounded-pill bg-white/[0.06] text-on-panel ring-1 ring-white/20 transition-colors dur-base ease-brand hover:bg-white/[0.12] hover:ring-white/40 focus-visible:outline-on-panel";

/** A 1px GIF, for cutting a photograph's download short. */
const NOTHING = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/**
 * The photograph's ref: when it leaves (the viewer closes, or steps on to the
 * next frame) half-downloaded, its request is cut. Chrome lets a detached
 * image's download run to the end, a full-size photograph nobody will see;
 * pointing it elsewhere first is what aborts it (measured: `ERR_ABORTED`,
 * where removal alone ran on to `done`). Module level, so the ref is the same
 * function every render; and it acts only once the image has really left the
 * document (React lets go of a ref before it removes the node), so a ref
 * re-attached to a photograph still on screen never cuts it.
 */
const cutShort = (img: HTMLImageElement | null) => {
  if (!img) return;
  return () => {
    queueMicrotask(() => {
      if (img.isConnected || img.complete) return;
      img.removeAttribute("srcset");
      img.src = NOTHING;
    });
  };
};

/**
 * One chapter's photographs at full size — a real modal dialog.
 *
 * `<dialog>` and `showModal()`, so the browser does the parts that are easy
 * to get wrong: the page behind is inert, the dialog sits in the top layer
 * over the header, and Esc closes it. On open, focus goes to the close
 * button; ← and → (and Home, End) move through the chapter from anywhere in
 * it, and the step buttons wrap — the caption always says where you are, so a
 * loop is never a surprise. A swipe does the same on a touchscreen, and a
 * click anywhere off the photograph closes it.
 *
 * Every way out goes through `dialog.close()`, so there is one `close` event
 * and one path back: the parent hears it and puts focus on the print that
 * opened the viewer.
 *
 * The dialog itself takes focus (`tabIndex={-1}`, never in the Tab order),
 * so a click on the photograph or the caption leaves focus inside it rather
 * than on the page's body, where the arrows would stop reaching the viewer.
 * Tab goes round the three controls; the browser's own modal handling
 * passes through its toolbar on the way round, never the page behind.
 *
 * A click off the photograph closes only if the press began there too and
 * ended there: a drag that starts on the photograph (or a swipe) and lets go
 * over the stage is not a click on the backdrop, though the browser reports
 * one there.
 *
 * **The page stays where it was.** Lenis takes the wheel for the whole
 * document, so the dialog carries `data-lenis-prevent` — wheel and touch
 * inside it are left to the browser — and while it is open the root is
 * `overflow: hidden` (`:root:has(.life-box[open])` in globals.css), so the
 * browser has nothing behind it to scroll either. The site hides every
 * scrollbar, so locking the root moves nothing sideways.
 *
 * **The photograph is fit, never cropped.** The stage is a size container and
 * the image is drawn at `min(100cqw, 100cqh × its ratio)` with its ratio
 * reserved, so its box exists at full size before a byte has arrived and the
 * blur placeholder fills exactly that box. `object-contain` on top, so a
 * served file a pixel off its stated ratio is letterboxed, not stretched. Each new frame arrives with a short
 * fade off its placeholder (`key` per frame); reduced motion cuts.
 *
 * The caption is the photograph's alt text and its place in the chapter,
 * nothing invented, and it is a polite live region, so stepping is announced
 * without moving focus.
 *
 * Server markup is an empty, closed `<dialog>`: the viewer has no content
 * until something opens it.
 */
export function LifeLightbox({
  chapter,
  frame,
  onStep,
  onClose,
}: {
  /** The chapter being viewed, or `null` while the viewer is closed. */
  chapter: LifeChapter | null;
  frame: number;
  onStep: (to: number) => void;
  onClose: () => void;
}) {
  const box = useRef<HTMLDialogElement>(null);
  const closer = useRef<HTMLButtonElement>(null);
  /* The press in progress on the stage: where it went down, whether that was
     the stage's own empty ground, and how it ended. A press ends in a click
     on the nearest element common to its two ends — the stage, for a drag
     off the photograph — so the click alone cannot say it was a backdrop
     click, and a swipe's click would close the viewer it just stepped. */
  const press = useRef<{ x: number; y: number; touch: boolean; off: boolean; up: boolean; swiped: boolean } | null>(
    null,
  );
  const isOpen = chapter !== null;

  useEffect(() => {
    const d = box.current;
    if (!d) return;
    if (isOpen && !d.open) {
      d.showModal();
      closer.current?.focus();
    } else if (!isOpen && d.open) {
      d.close();
    }
  }, [isOpen]);

  const n = chapter?.frames.length ?? 0;
  const f = chapter?.frames[frame];
  const go = (to: number) => {
    if (n) onStep((to + n) % n);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    const to =
      e.key === "ArrowRight"
        ? frame + 1
        : e.key === "ArrowLeft"
          ? frame - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : null;
    if (to === null) return;
    e.preventDefault();
    go(to);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    press.current = {
      x: e.clientX,
      y: e.clientY,
      touch: e.pointerType !== "mouse",
      off: e.target === e.currentTarget,
      up: false,
      swiped: false,
    };
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const p = press.current;
    if (!p) return;
    p.up = e.target === e.currentTarget;
    if (!p.touch) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    p.swiped = true;
    go(frame + (dx < 0 ? 1 : -1));
  };
  const onStageClick = () => {
    const p = press.current;
    press.current = null;
    if (p && p.off && p.up && !p.swiped) box.current?.close();
  };

  const step = (by: 1 | -1, display: string) => (
    <button
      type="button"
      aria-label={by === 1 ? "Next photo" : "Previous photo"}
      onClick={() => go(frame + by)}
      className={`${display} ${BUTTON}`}
    >
      {by === 1 ? (
        <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
      ) : (
        <ArrowLeft aria-hidden className="size-4" strokeWidth={1.75} />
      )}
    </button>
  );

  return (
    <dialog
      ref={box}
      tabIndex={-1}
      data-lenis-prevent=""
      aria-label={chapter?.label}
      onClose={onClose}
      onKeyDown={onKeyDown}
      className="life-box"
    >
      {chapter && f ? (
        <div className="flex h-full flex-col px-[var(--gutter)] pt-4 pb-5 md:pt-6 md:pb-7">
          {/* -- the bar ------------------------------------------------- */}
          <div className="flex items-center justify-between gap-4">
            <p className="flex min-w-0 items-center gap-2.5 font-mono text-xs tracking-caps text-on-panel/70 uppercase">
              <span aria-hidden className="size-1.5 shrink-0 rounded-pill bg-primary" />
              {chapter.label}
            </p>
            <button
              ref={closer}
              type="button"
              aria-label="Close"
              onClick={() => box.current?.close()}
              className={`grid ${BUTTON}`}
            >
              <X aria-hidden className="size-4" strokeWidth={1.75} />
            </button>
          </div>

          {/* -- the photograph ------------------------------------------ */}
          <div className="mt-4 flex min-h-0 flex-1 items-center gap-4 md:mt-5">
            {step(-1, "hidden md:grid")}
            <div
              className="life-box-stage min-w-0 flex-1 self-stretch"
              onClick={onStageClick}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              <Image
                key={f.key}
                ref={cutShort}
                src={f.src}
                alt={f.alt}
                width={f.width}
                height={f.height}
                sizes={stageSizes(f.width / f.height)}
                placeholder="blur"
                blurDataURL={f.blur}
                loading="eager"
                className="life-box-photo rounded-md object-contain shadow-2xl shadow-black/40"
                style={{ "--ar": `${f.width} / ${f.height}` } as CSSProperties}
              />
            </div>
            {step(1, "hidden md:grid")}
          </div>

          {/* -- the caption --------------------------------------------- */}
          <div className="mt-4 flex items-end justify-between gap-6 md:mt-5">
            <div aria-live="polite" aria-atomic="true" className="min-w-0">
              <p className="max-w-[64ch] text-sm leading-snug text-on-panel/85 md:text-base">{f.alt}</p>
              <p className="mt-1.5 font-mono text-xs tracking-caps text-on-panel/60 uppercase tabular-nums">
                {frame + 1} of {n}
              </p>
            </div>
            <div className="flex shrink-0 gap-3 md:hidden">
              {step(-1, "grid")}
              {step(1, "grid")}
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
