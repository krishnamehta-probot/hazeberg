"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowUpRight, Check, ChevronsDownUp, ChevronsUpDown, Plus } from "lucide-react";

import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/section";
import type { Capability, CapabilityId, WHAT_WE_DO } from "@/lib/what-we-do-content";

import { CAPABILITY_ICON } from "./capability-chip";

type Data = (typeof WHAT_WE_DO)["capabilities"];

/** How long a row opened by a link stays lit before it settles. */
const FLASH_MS = 1400;

/* The rows FADE in rather than rise. A transform on a heading's ancestor moves
   where a native jump lands (see `layoutTop` in smooth-scroll.tsx), and these
   eight headings are the page's jump targets. */
const fade: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0.7, ease: [0.2, 0.7, 0.3, 1] } },
};

/**
 * Workday capabilities — the eight, and the place every link on the page lands.
 *
 * Every chip, every lifecycle bar and four links on other pages point at one of
 * these rows, so the section is built around arriving. A link to a row opens it
 * as well as scrolling to it, by whichever road it came: a click here, which
 * Lenis turns into a scroll with no `hashchange` (hence the document click
 * listener); the native jump reduced motion falls back to, which does fire one;
 * or a page load with the hash already in the URL. The row then flashes once,
 * so the eye finds the thing it asked for in a column of eight lookalikes.
 *
 * SEVERAL ROWS STAY OPEN AT ONCE, and that is load-bearing, not a preference.
 * Every jump link computes its scroll target at click time. A one-at-a-time
 * accordion closes the open row as it opens the new one, and when that row sits
 * ABOVE the target, the target rises by the collapsed height while the scroll
 * is still travelling to where it used to be. Opening never closes anything
 * here, so nothing above a target ever moves. Only the first row starts open:
 * enough to show what a row holds, and identical on server and client, so
 * nothing shifts when the page hydrates.
 *
 * The intro holds still on a desktop while the rows pass it, because eight rows
 * opened run to several screens. Inside a row the outcome gets its own card
 * beside the list — it is the line a buyer reads first. That split answers to
 * the row's own width, not the viewport's: at 1024px the column it sits in is
 * narrower than an upright tablet.
 *
 * Height animates on `grid-template-rows`, 0fr to 1fr, so nothing is measured.
 * A closed panel is `inert`: out of the tab order and the accessibility tree, so
 * a keyboard never lands inside a row it cannot see.
 */
export function CapabilityAccordion({ data }: { data: Data }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<ReadonlySet<CapabilityId>>(
    () => new Set(data.items.slice(0, 1).map((c) => c.id)),
  );
  const [flash, setFlash] = useState<CapabilityId | null>(null);
  const allOpen = open.size === data.items.length;

  const toggle = (id: CapabilityId) =>
    setOpen((cur) => {
      const next = new Set(cur);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const toggleAll = () => setOpen(allOpen ? new Set() : new Set(data.items.map((c) => c.id)));

  useEffect(() => {
    const ids = new Set<string>(data.items.map((c) => c.id));
    let timer = 0;

    const arrive = (hash: string) => {
      const id = hash.slice(1);
      if (!ids.has(id)) return;
      const key = id as CapabilityId;
      setOpen((cur) => (cur.has(key) ? cur : new Set(cur).add(key)));
      setFlash(key);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setFlash(null), FLASH_MS);
    };

    // Not preventDefault-ed: Lenis, or the router, still does the scrolling.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      let url: URL;
      try {
        url = new URL(a.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
      arrive(url.hash);
    };
    const onHash = () => arrive(window.location.hash);

    const frame = requestAnimationFrame(onHash);
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHash);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHash);
      window.clearTimeout(timer);
    };
  }, [data.items]);

  return (
    <section id={data.id} className="relative bg-surface">
      <div className="shell py-[var(--section-y)]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-16">
          {/* -- the claim, held ------------------------------------------------ */}
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
            <Reveal>
              <Eyebrow>{data.eyebrow}</Eyebrow>
              <h2 className="mt-5 max-w-[22ch] text-3xl leading-[1.08] font-light tracking-[-0.03em] text-balance text-ink">
                {data.title}
              </h2>
            </Reveal>
            <Reveal delay={0.06}>
              {data.body.map((p) => (
                <p key={p} className="mt-5 max-w-[56ch] text-base text-ink-muted">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>

          {/* -- the eight ------------------------------------------------------ */}
          <div className="min-w-0">
            <Reveal className="flex items-center justify-between gap-4">
              <p className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
                {data.items.length} {data.labels.count}
              </p>
              <button
                type="button"
                onClick={toggleAll}
                aria-controls={data.items.map((c) => `${c.id}-panel`).join(" ")}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                {allOpen ? (
                  <ChevronsDownUp aria-hidden className="size-4" strokeWidth={2} />
                ) : (
                  <ChevronsUpDown aria-hidden className="size-4" strokeWidth={2} />
                )}
                {allOpen ? data.labels.closeAll : data.labels.openAll}
              </button>
            </Reveal>

            <RevealGroup as="ol" stagger={0.06} className="mt-3 space-y-3">
              {data.items.map((item) => (
                <Row
                  key={item.id}
                  item={item}
                  labels={data.labels}
                  open={open.has(item.id)}
                  flash={flash === item.id}
                  onToggle={() => toggle(item.id)}
                  variants={reduce ? undefined : fade}
                />
              ))}
            </RevealGroup>
          </div>
        </div>

      </div>
    </section>
  );
}

function Row({
  item,
  labels,
  open,
  flash,
  onToggle,
  variants,
}: {
  item: Capability;
  labels: Data["labels"];
  open: boolean;
  flash: boolean;
  onToggle: () => void;
  variants?: Variants;
}) {
  const Icon = CAPABILITY_ICON[item.id];
  const buttonId = `${item.id}-toggle`;
  const panelId = `${item.id}-panel`;

  return (
    <motion.li
      variants={variants}
      className={`rounded-2xl bg-canvas transition-shadow dur-slow ease-brand ${
        flash
          ? "shadow-lg shadow-primary/15 ring-2 ring-primary"
          : open
            ? "ring-1 ring-primary/25"
            : "ring-1 ring-border hover:ring-border-strong"
      }`}
    >
      <h3 id={item.id}>
        {/* A grid rather than a row so a phone can lift the number above the
            name: four columns at 320px leave a name like "Modernization" about
            120px to fit in. */}
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group/row grid min-h-22 w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] content-center items-center gap-x-3 gap-y-1 rounded-2xl px-4 py-4 text-left sm:grid-cols-[auto_auto_minmax(0,1fr)_auto] sm:gap-x-5 sm:px-7"
        >
          <span
            aria-hidden
            className={`col-start-2 row-start-1 font-mono text-[0.6875rem] tracking-caps transition-colors dur-base ease-brand sm:col-start-1 sm:row-end-3 ${
              open ? "text-primary" : "text-ink-subtle"
            }`}
          >
            {item.n}
          </span>
          <span
            aria-hidden
            className={`col-start-1 row-start-1 row-end-4 grid size-10 place-items-center rounded-pill transition-colors dur-base ease-brand sm:col-start-2 sm:row-end-3 sm:size-11 ${
              open ? "disc-blue text-white" : "bg-surface text-primary"
            }`}
          >
            <Icon className="size-4 sm:size-5" strokeWidth={1.9} />
          </span>
          <span className="col-start-2 row-start-2 text-lg leading-snug font-light tracking-[-0.02em] text-balance text-ink sm:col-start-3 sm:row-start-1 sm:text-xl">
            {item.name}
          </span>
          <span className="col-start-2 row-start-3 text-sm text-ink-muted sm:col-start-3 sm:row-start-2">
            {item.tagline}
          </span>
          <span
            aria-hidden
            className={`col-start-3 row-start-1 row-end-4 grid size-8 place-items-center rounded-pill ring-1 transition dur-base ease-brand sm:col-start-4 sm:row-end-3 sm:size-10 ${
              open
                ? "rotate-45 text-primary ring-primary/30"
                : "text-ink ring-border group-hover/row:text-primary group-hover/row:ring-primary/40"
            }`}
          >
            <Plus className="size-4" strokeWidth={2} />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-500 ease-brand ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`@container px-4 pb-6 transition-opacity duration-500 ease-brand sm:px-7 sm:pb-8 ${
              open ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="border-t border-border pt-6">
              <p className="max-w-[62ch] text-base text-ink-muted">{item.intro}</p>

              <div className="mt-7 grid gap-6 @2xl:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] @2xl:gap-8">
                <div>
                  <p className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
                    {labels.delivers}
                  </p>
                  <ul className="mt-4 grid gap-x-6 gap-y-3 @md:grid-cols-2">
                    {item.delivers.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-sm text-ink">
                        <Check
                          aria-hidden
                          className="mt-0.5 size-4 shrink-0 text-primary"
                          strokeWidth={2.25}
                        />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* The site's ink panel: the outcome is the line a buyer reads
                    first, so it is the one dark thing in a light row. Its label
                    takes the amber every eyebrow on a dark ground wears. */}
                <div className="grad-ink grain relative overflow-hidden rounded-xl p-5 text-on-panel @2xl:self-start">
                  <span aria-hidden className="grad-primary block h-1 w-8 rounded-pill" />
                  <p className="mt-4 font-mono text-[0.6875rem] tracking-caps text-accent uppercase">
                    {labels.outcome}
                  </p>
                  <p className="mt-2 text-base leading-snug text-on-panel">{item.outcome}</p>
                </div>
              </div>

              {item.related ? (
                <Link
                  href={item.related.href}
                  className="group/rel mt-5 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  {labels.related}: {item.related.label}
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform dur-base ease-brand group-hover/rel:translate-x-0.5 group-hover/rel:-translate-y-0.5"
                    strokeWidth={2}
                  />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  );
}
