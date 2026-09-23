"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp, ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";

import { HazebergWordmark } from "@/components/brand/hazeberg-wordmark";
import { CircleButton } from "@/components/ui/circle-button";
import { NAV_CTA, PRIMARY_NAV, type NavNode } from "@/lib/navigation";

/**
 * Site header.
 *
 * The reference's nav is a floating dark bar inset from every edge, links
 * centred, one solid white pill on the right. It does not collapse, it does not
 * hide, and it does not change skin on scroll beyond deepening its own surface
 * — the restraint is the point.
 *
 * Menus open as a full-width dark mega panel: a lede rail, the link columns,
 * and a feature card, over a footnote strip. The panel is the one surface on
 * the site where yellow is legal as type - #FEC00F measures 7.9:1 against the
 * ink gradient's lightest corner and 12.2:1 against its darkest, against
 * 1.65:1 on white. Column headings use it; nothing else on the site can.
 */

const MENUS = PRIMARY_NAV.filter(
  (node): node is Extract<NavNode, { kind: "menu" }> => node.kind === "menu",
);

function isActive(node: NavNode, pathname: string) {
  if (node.kind === "link") return pathname === node.href || pathname.startsWith(`${node.href}/`);
  if (node.label === "Services") return pathname.startsWith("/services");
  return node.href ? pathname === node.href || pathname.startsWith(`${node.href}/`) : false;
}

type Menu = Extract<NavNode, { kind: "menu" }>;

/** The card in the panel's right rail. Two tones, both measured on the ink ground. */
function FeatureCard({ feature }: { feature: NonNullable<Menu["feature"]> }) {
  const accent = feature.tone === "accent";
  // Solid accent, not `grad-amber`: the gradient's dark corner drops near-black
  // to 4.19:1, which fails AA. Flat #FEC00F holds 11.3:1 across the whole card.
  const skin = accent
    ? "bg-accent text-accent-ink"
    : "bg-white/6 text-on-panel ring-1 ring-white/12";
  const chip = accent ? "bg-accent-ink/10" : "bg-white/10 text-on-panel/85";

  return (
    <div className={`flex h-full flex-col rounded-lg p-5 ${skin}`}>
      <p className="font-mono text-[0.6875rem] tracking-caps uppercase opacity-70">
        {feature.eyebrow}
      </p>
      <p className="mt-2 text-lg leading-tight font-light text-balance">{feature.title}</p>
      <p className="mt-2 text-xs opacity-75">{feature.body}</p>
      {feature.tags ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {feature.tags.map((tag) => (
            <li key={tag} className={`rounded-pill px-2.5 py-1 text-[0.6875rem] ${chip}`}>
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
      <Link
        href={feature.href}
        className="group/f mt-auto inline-flex items-center gap-1.5 pt-5 text-xs font-medium hover:underline"
      >
        {feature.ctaLabel}
        <ArrowUpRight className="size-3.5 transition-transform dur-fast ease-brand group-hover/f:translate-x-0.5 group-hover/f:-translate-y-0.5" />
      </Link>
    </div>
  );
}

function MegaPanel({ menu, onNavigate }: { menu: Menu; onNavigate: () => void }) {
  const cols = menu.feature
    ? "lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)_19rem]"
    : "lg:grid-cols-[16rem_minmax(0,1fr)]";

  return (
    <div className="grad-ink grain relative overflow-hidden rounded-xl shadow-2xl shadow-black/30 ring-1 ring-white/10">
      <div className={`relative grid ${cols}`}>
        {/* lede rail */}
        <div className="flex flex-col justify-between gap-6 p-7">
          <div>
            <p className="text-xl leading-tight font-light text-balance text-on-panel">
              {menu.lede.title}
            </p>
            <p className="mt-3 text-xs text-on-panel/60">{menu.lede.body}</p>
          </div>
          {menu.viewAll ? (
            <Link
              href={menu.viewAll.href}
              onClick={onNavigate}
              className="group/v inline-flex items-center gap-1.5 text-xs font-medium text-accent"
            >
              <span className="group-hover/v:underline">{menu.viewAll.label}</span>
              <ArrowUpRight className="size-3.5 transition-transform dur-fast ease-brand group-hover/v:translate-x-0.5 group-hover/v:-translate-y-0.5" />
            </Link>
          ) : null}
        </div>

        {/* link columns */}
        <div className="grid gap-x-8 gap-y-6 border-white/10 p-7 sm:grid-cols-2 lg:border-l">
          {menu.columns.map((col, i) => (
            <div key={col.heading ?? i}>
              {col.heading ? (
                <p className="mb-3 font-mono text-[0.6875rem] tracking-caps text-accent uppercase">
                  {col.heading}
                </p>
              ) : null}
              <ul className="-mx-3 space-y-0.5">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className="group/i block rounded-sm px-3 py-2 transition-colors dur-fast ease-brand hover:bg-white/8"
                    >
                      <span className="flex items-center gap-1.5 text-sm text-on-panel">
                        {item.label}
                        <ArrowUpRight className="size-3.5 -translate-x-1 opacity-0 transition dur-fast ease-brand group-hover/i:translate-x-0 group-hover/i:opacity-60" />
                      </span>
                      {item.description ? (
                        <span className="mt-0.5 block text-xs text-on-panel/60">
                          {item.description}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* feature - the first thing to go when the viewport cannot hold it */}
        {menu.feature ? (
          <div className="hidden border-white/10 p-7 xl:block xl:border-l">
            <FeatureCard feature={menu.feature} />
          </div>
        ) : null}
      </div>

      {menu.footnote ? (
        <div className="relative flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-white/10 bg-black/20 px-7 py-4">
          <span className="text-xs text-on-panel/60">{menu.footnote.text}</span>
          <Link
            href={menu.footnote.cta.href}
            onClick={onNavigate}
            className="text-xs font-medium text-accent hover:underline"
          >
            {menu.footnote.cta.label}
          </Link>
        </div>
      ) : null}
    </div>
  );
}

/** `useLayoutEffect` warns during SSR; this is the standard way round it. */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function SiteHeader() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  /* True while the bar is sitting over a section that declares itself dark. */
  const [overDark, setOverDark] = useState(false);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setOpen(null);
    setMobile(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * The header is site-wide and has no idea what page it is on, so the page
   * tells it: any section carrying `data-nav-dark` flips the bar to white type
   * while the bar is over it.
   *
   * Layout effect, not a plain one — the home hero is dark from the first paint,
   * and running this after paint shows one frame of near-black type on it.
   *
   * The rootMargin crops the observer's root down to the top band the bar
   * actually occupies, so "intersecting" means "behind the header" rather than
   * "somewhere on screen".
   */
  useIsomorphicLayoutEffect(() => {
    const els = document.querySelectorAll("[data-nav-dark]");
    if (!els.length) {
      setOverDark(false);
      return;
    }
    // EVERY dark section, not the first one. This read `querySelector` while the
    // hero was the only dark block on the page, and the moment a second one
    // existed the bar kept its near-black type all the way over it.
    const hits = new Set<Element>();
    const band = 120;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) hits.add(entry.target);
          else hits.delete(entry.target);
        }
        setOverDark(hits.size > 0);
      },
      { rootMargin: `0px 0px -${Math.max(0, window.innerHeight - band)}px 0px` },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [renderedPath]);

  useEffect(() => {
    if (!mobile) return;
    const { body } = document;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = prev;
    };
  }, [mobile]);

  const hold = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);
  const release = useCallback(() => {
    hold();
    closeTimer.current = window.setTimeout(() => setOpen(null), 160);
  }, [hold]);

  /* Over a dark hero the bar stays transparent for the whole section rather than
     solidifying after 8px — a light pill floating on a dark hero is two grounds
     arguing. It solidifies once the hero is behind it. */
  const solid = (scrolled && !overDark) || Boolean(open) || mobile;
  const dark = overDark && !solid;

  const transition = reduce ? { duration: 0 } : { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="shell pt-[var(--nav-top)]">
          <div
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(null);
            }}
            className={`relative flex h-[var(--nav-h)] items-center justify-between gap-6 rounded-md px-4 transition dur-base ease-brand md:px-6 ${
              solid
                ? "bg-surface-2/92 text-ink ring-1 ring-border backdrop-blur-xl"
                : `bg-transparent ring-1 ring-transparent ${dark ? "text-on-panel" : "text-ink"}`
            }`}
          >
            <Link
              href="/"
              aria-label="Hazeberg — home"
              className="-mx-2 flex min-h-11 shrink-0 items-center rounded-sm px-2 transition-opacity dur-fast ease-brand hover:opacity-70"
            >
              <HazebergWordmark className="h-[0.875rem] w-auto md:h-4" />
            </Link>

            {/* Centred, absolutely positioned so the logo and CTA cannot shift it. */}
            <nav
              aria-label="Main"
              onPointerLeave={release}
              onPointerEnter={hold}
              className="absolute left-1/2 hidden -translate-x-1/2 lg:block"
            >
              <ul className="flex items-center gap-1">
                {PRIMARY_NAV.map((node) => {
                  const active = isActive(node, pathname);
                  const shared = `flex h-10 items-center gap-1 rounded-sm px-3 text-sm transition-colors dur-fast ease-brand ${
                    /* Opacity rather than a colour, so one rule works on both
                       grounds: the link always sits on whatever the bar is set to. */
                    active ? "opacity-100" : "opacity-60 hover:opacity-100"
                  }`;

                  if (node.kind === "link") {
                    return (
                      <li key={node.label}>
                        <Link
                          href={node.href}
                          onPointerEnter={release}
                          aria-current={active ? "page" : undefined}
                          className={shared}
                        >
                          {node.label}
                        </Link>
                      </li>
                    );
                  }

                  const isOpen = open === node.label;
                  return (
                    <li key={node.label}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onPointerEnter={() => {
                          hold();
                          setOpen(node.label);
                        }}
                        onClick={() => setOpen(isOpen ? null : node.label)}
                        className={`cursor-pointer ${shared}`}
                      >
                        {node.label}
                        <ChevronDown
                          aria-hidden
                          className={`size-3.5 opacity-60 transition-transform dur-base ease-brand ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href={NAV_CTA.href}
                data-spec
                /* Over a dark hero the fill drops away and the same pill comes
                   back as an outline. Same shape, same disc, same arrow swap —
                   only the fill changes, so it is one button in two states
                   rather than two buttons. It also keeps the screen to a single
                   yellow element: the hero's own call to action.

                   On the dark ground the outline is now the specular rim, not a
                   flat white ring — the rim already draws a 1px edge all the way
                   round, so a ring on top of it was simply a second border. */
                className={`spec group/cta hidden h-11 items-center gap-3 rounded-pill pr-1.5 pl-5 text-sm font-medium sm:inline-flex ${
                  dark ? "bg-white/5 text-on-panel hover:bg-white/12" : "bg-ink text-on-panel"
                }`}
              >
                {NAV_CTA.label}
                <span
                  aria-hidden
                  className="relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-pill bg-[radial-gradient(circle_at_30%_22%,#3aa4ff_0%,#008eff_38%,#1972b9_72%,#0d4674_100%)]"
                >
                  <ArrowUpRight
                    className="absolute size-3.5 text-white transition-transform duration-300 ease-brand group-hover/cta:translate-x-[180%] group-hover/cta:-translate-y-[180%]"
                    strokeWidth={2}
                  />
                  <ArrowUpRight
                    className="absolute size-3.5 -translate-x-[180%] translate-y-[180%] text-white transition-transform duration-300 ease-brand group-hover/cta:translate-x-0 group-hover/cta:translate-y-0"
                    strokeWidth={2}
                  />
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobile((v) => !v)}
                aria-expanded={mobile}
                aria-label={mobile ? "Close menu" : "Open menu"}
                className={`grid size-11 cursor-pointer place-items-center rounded-sm transition-colors dur-fast ease-brand lg:hidden ${
                  dark ? "hover:bg-white/10" : "hover:bg-glass"
                }`}
              >
                {mobile ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            </div>

            {/* Full-width mega panel, anchored to the bar rather than the trigger. */}
            <AnimatePresence>
              {open ? (
                <motion.div
                  key={open}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={transition}
                  onPointerEnter={hold}
                  onPointerLeave={release}
                  className="absolute inset-x-0 top-full hidden pt-3 lg:block"
                >
                  {(() => {
                    const menu = MENUS.find((m) => m.label === open);
                    return menu ? <MegaPanel menu={menu} onNavigate={() => setOpen(null)} /> : null;
                  })()}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile sheet */}
        <AnimatePresence>
          {mobile ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
              className="fixed inset-x-[var(--gutter)] top-[var(--header-h)] bottom-[var(--gutter)] z-40 overflow-y-auto rounded-lg bg-surface-2/96 p-6 ring-1 ring-border backdrop-blur-xl lg:hidden"
            >
              <nav aria-label="Main">
                <ul className="divide-y divide-border">
                  {PRIMARY_NAV.map((node) => (
                    <li key={node.label} className="py-1">
                      {node.kind === "link" ? (
                        <Link
                          href={node.href}
                          onClick={() => setMobile(false)}
                          className="flex min-h-12 items-center text-xl font-light text-ink"
                        >
                          {node.label}
                        </Link>
                      ) : (
                        <details>
                          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-xl font-light text-ink">
                            {node.label}
                            <ChevronDown className="size-4 opacity-60" />
                          </summary>
                          <ul className="pb-2">
                            {node.columns.flatMap((c) => c.items).map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={() => setMobile(false)}
                                  className="flex min-h-11 items-center text-sm text-ink-muted"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
              <Link
                href={NAV_CTA.href}
                onClick={() => setMobile(false)}
                data-spec
                className="spec mt-8 flex h-12 items-center justify-center rounded-pill bg-ink text-sm font-medium text-ink-invert"
              >
                {NAV_CTA.label}
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <BackToTop visible={scrolled} />
    </>
  );
}

/** The reference's circular back-to-top, bottom-right, fading in after a scroll. */
function BackToTop({ visible }: { visible: boolean }) {
  return (
    <div
      className={`fixed right-[var(--gutter)] bottom-[var(--gutter)] z-40 transition-opacity dur-base ease-brand ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <CircleButton
        label="Back to top"
        icon={ArrowUp}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
    </div>
  );
}
