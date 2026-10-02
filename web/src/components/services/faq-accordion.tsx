"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";

import { RevealGroup, RevealItem } from "@/components/motion/reveal";

type Item = { q: string; a: string };

const EASE = [0.22, 1, 0.36, 1] as const;
/** The height animation's length — `duration-500` below. A closed answer is
    marked hidden-until-found only once it has finished closing. */
const CLOSE_MS = 500;

const pad = (i: number) => String(i + 1).padStart(2, "0");

/**
 * The five questions, one open at a time, beside a head that holds still.
 *
 * From lg the head stays in place while the questions pass it, and under it a
 * large blue numeral keeps count of the question last opened — "02 / 05" — so
 * the still column has something to say about the moving one. It is
 * decoration: each row carries its own number.
 *
 * Each question is a `<button aria-expanded aria-controls>` in a heading, and
 * the arrow keys, Home and End move between them. The + on its disc turns a
 * quarter to an × and the disc fills with the brand blue when the answer is
 * open. Opening one closes the last: five short answers read better as a
 * conversation than as a wall. The first starts open, on the server and the
 * client alike, so nothing shifts on hydration.
 *
 * Height animates on `grid-template-rows`, 0fr to 1fr, so nothing is measured.
 *
 * **Every answer stays in the document.** A closed one is marked
 * `hidden="until-found"`: out of the tab order and the accessibility tree like
 * any collapsed panel, but find-in-page still searches it, and the browser
 * fires `beforematch` on a hit — which opens that question. The attribute is
 * set on the element directly rather than through a prop because React treats
 * `hidden` as a boolean and writes any truthy value as a bare `hidden`, which
 * is `display: none` and invisible to find-in-page. A browser without
 * until-found reads the value as plain `hidden`, which is a closed answer
 * anyway. It goes on only after the close has run, so the answer is visible
 * all the way down, and before paint on the way up.
 */
export function FaqAccordion({
  items,
  idBase,
  head,
}: {
  items: readonly Item[];
  idBase: string;
  head: ReactNode;
}) {
  const still = Boolean(useReducedMotion());
  const [open, setOpen] = useState<number | null>(0);
  const [last, setLast] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const n = items.length;

  const toggle = (i: number) => {
    setOpen((cur) => (cur === i ? null : i));
    setLast(i);
  };
  /* Stable, so each row's `beforematch` listener is not re-attached on every
     render. */
  const reveal = useCallback((i: number) => {
    setOpen(i);
    setLast(i);
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const to =
      e.key === "ArrowDown"
        ? (i + 1) % n
        : e.key === "ArrowUp"
          ? (i - 1 + n) % n
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : null;
    if (to === null) return;
    e.preventDefault();
    buttons.current[to]?.focus();
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
      <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
        {head}
        <div
          aria-hidden
          className="mt-12 hidden items-end gap-3 border-t border-border pt-8 lg:flex"
        >
          <span className="relative block h-[1em] overflow-hidden text-4xl leading-none font-light tracking-[-0.04em] text-primary tabular-nums">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={last}
                className="block"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-100%" }}
                transition={still ? { duration: 0 } : { duration: 0.5, ease: EASE }}
              >
                {pad(last)}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="pb-1 font-mono text-[0.6875rem] tracking-caps text-ink-subtle">
            / {pad(n - 1)}
          </span>
        </div>
      </div>

      <RevealGroup as="ol" stagger={0.06} className="min-w-0 space-y-3">
        {items.map((item, i) => (
          <Question
            key={item.q}
            item={item}
            i={i}
            idBase={idBase}
            open={open === i}
            still={still}
            onToggle={toggle}
            onFound={reveal}
            onKeyDown={onKeyDown}
            buttonRef={(el) => {
              buttons.current[i] = el;
            }}
          />
        ))}
      </RevealGroup>
    </div>
  );
}

function Question({
  item,
  i,
  idBase,
  open,
  still,
  onToggle,
  onFound,
  onKeyDown,
  buttonRef,
}: {
  item: Item;
  i: number;
  idBase: string;
  open: boolean;
  still: boolean;
  onToggle: (i: number) => void;
  onFound: (i: number) => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>, i: number) => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
}) {
  const body = useRef<HTMLDivElement>(null);
  const settled = useRef(false);
  const buttonId = `${idBase}-q${i + 1}`;
  const panelId = `${idBase}-a${i + 1}`;

  /* Open: take the attribute off before paint, so the rows have content to
     grow into. Closed: on first sight at once; after a close, once the close
     has finished — or at once, under reduced motion, where it does not run. */
  useLayoutEffect(() => {
    const el = body.current;
    if (!el) return;
    if (open) {
      el.removeAttribute("hidden");
      settled.current = true;
      return;
    }
    if (!settled.current || still) {
      el.setAttribute("hidden", "until-found");
      settled.current = true;
      return;
    }
    const t = window.setTimeout(() => el.setAttribute("hidden", "until-found"), CLOSE_MS);
    return () => window.clearTimeout(t);
  }, [open, still]);

  /* Find-in-page landed in this answer. The browser removes the attribute and
     scrolls to the match as soon as this returns, so the row opens NOW —
     committed synchronously, with its height and fade cut for this one change
     — rather than growing out of nothing after the page has already moved. */
  useEffect(() => {
    const el = body.current;
    if (!el) return;
    const cut = [el.parentElement, el.firstElementChild].filter(
      (node): node is HTMLElement => node instanceof HTMLElement,
    );
    let frame = 0;
    const onMatch = () => {
      cut.forEach((node) => (node.style.transitionDuration = "0s"));
      flushSync(() => onFound(i));
      /* Two frames: the cut has to outlive the style pass that opens the row. */
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() =>
          cut.forEach((node) => (node.style.transitionDuration = "")),
        );
      });
    };
    el.addEventListener("beforematch", onMatch);
    return () => {
      el.removeEventListener("beforematch", onMatch);
      cancelAnimationFrame(frame);
    };
  }, [onFound, i]);

  return (
    <RevealItem
      as="li"
      className={`rounded-2xl bg-canvas transition-shadow dur-slow ease-brand ${
        open ? "shadow-lg shadow-primary/8 ring-1 ring-primary/25" : "ring-1 ring-border hover:ring-border-strong"
      }`}
    >
      <h3>
        {/* Number, question, disc. The answer below repeats the same three
            columns, so it starts exactly under the question at any width. */}
        <button
          ref={buttonRef}
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => onToggle(i)}
          onKeyDown={(e) => onKeyDown(e, i)}
          className="group/q grid min-h-20 w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 rounded-2xl px-5 py-5 text-left sm:gap-x-6 sm:px-7"
        >
          <span
            aria-hidden
            className={`font-mono text-[0.6875rem] tracking-caps transition-colors dur-base ease-brand ${
              open ? "text-primary" : "text-ink-subtle"
            }`}
          >
            {pad(i)}
          </span>
          <span className="text-base leading-snug font-normal text-pretty text-ink sm:text-lg">
            {item.q}
          </span>
          <span
            aria-hidden
            className={`relative grid size-10 shrink-0 place-items-center rounded-pill ring-1 transition dur-base ease-brand ${
              open
                ? "text-white ring-transparent"
                : "text-ink ring-border group-hover/q:text-primary group-hover/q:ring-primary/40"
            }`}
          >
            <span
              className={`disc-blue absolute inset-0 rounded-pill transition dur-base ease-brand ${
                open ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            />
            <Plus
              className={`relative size-4 transition-transform duration-500 ease-brand ${
                open ? "rotate-45" : ""
              }`}
              strokeWidth={2}
            />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-500 ease-brand ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div ref={body} className="min-h-0 overflow-hidden">
          <div
            className={`grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-4 px-5 pb-6 transition-opacity duration-500 ease-brand sm:gap-x-6 sm:px-7 sm:pb-8 ${
              open ? "opacity-100" : "opacity-0"
            }`}
          >
            <span aria-hidden className="invisible font-mono text-[0.6875rem] tracking-caps">
              {pad(i)}
            </span>
            {/* Below sm the answer also takes the disc's column: at 320px the
                question's own column is about 150px, too narrow to read a
                paragraph in. */}
            <p className="max-w-[62ch] text-base text-ink-muted max-sm:col-span-2">{item.a}</p>
            <span aria-hidden className="w-10 max-sm:hidden" />
          </div>
        </div>
      </div>
    </RevealItem>
  );
}
