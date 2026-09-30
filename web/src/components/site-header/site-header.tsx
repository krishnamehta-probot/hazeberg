"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FocusEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Blocks,
  ChartColumn,
  ChevronDown,
  Landmark,
  Menu,
  Users,
  Wallet,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";

import { AnimatedHazebergWordmark } from "@/components/brand/hazeberg-wordmark-animated";
import { CircleButton } from "@/components/ui/circle-button";
import { CONTACT, NAV_CTA, PRIMARY_NAV, type NavIcon, type NavNode } from "@/lib/navigation";

/**
 * Site header.
 *
 * The reference's nav is a floating dark bar inset from every edge, links
 * centred, one solid white pill on the right. It does not collapse, it does not
 * hide, and it does not change skin on scroll beyond deepening its own surface
 * — the restraint is the point.
 *
 * What we do, Services, About, Berg, Careers — and only Services drops down
 * (the client's order and call, 2026-09-30). Everything else is a link.
 *
 * What makes the bar feel alive, none of it loud:
 *   - the wordmark's birds are a flock (`hazeberg-wordmark-animated.tsx`)
 *   - one highlight glides between the links under the pointer, rather than
 *     each link lighting on its own
 *   - a dot marks the page you are on, and travels to the next one when you go
 *   - once the bar goes solid, a hairline along its foot fills blue to gold with
 *     the page — the birds' contrail colours
 *
 * Services opens as a full-width dark mega panel: a lede rail, the six services
 * with their icons, and a proof card whose partner names drift past, all under
 * a soft light that follows the pointer. The panel is the one surface on the
 * site where yellow is legal as type — #FEC00F measures 7.9:1 against the ink
 * gradient's lightest corner and 12.2:1 against its darkest, against 1.65:1 on
 * white. Headings and icons use it; nothing else on the site can.
 *
 * Keys: ArrowDown on Services opens it and steps into it; Escape closes the
 * panel or the phone menu and hands focus back to what opened it.
 */

const MENUS = PRIMARY_NAV.filter(
  (node): node is Extract<NavNode, { kind: "menu" }> => node.kind === "menu",
);

type MenuNode = Extract<NavNode, { kind: "menu" }>;

/** Icon keys come from the data (it stays serialisable for Sanity); this maps
    them to drawings. */
const NAV_ICONS: Record<NavIcon, LucideIcon> = {
  hcm: Users,
  payroll: Wallet,
  financials: Landmark,
  extend: Blocks,
  integrations: Workflow,
  reporting: ChartColumn,
};

const EASE = [0.22, 1, 0.36, 1] as const;
const GLIDE = { type: "spring", stiffness: 520, damping: 40, mass: 0.8 } as const;

function isActive(node: NavNode, pathname: string) {
  if (node.kind === "link") return pathname === node.href || pathname.startsWith(`${node.href}/`);
  if (node.label === "Services") return pathname.startsWith("/services");
  return node.href ? pathname === node.href || pathname.startsWith(`${node.href}/`) : false;
}

/**
 * The card in the panel's right rail. Two tones, both measured on the ink
 * ground. Its proof chips drift past in two rows, opposite ways, and stop under
 * the pointer so a name can be read.
 */
function FeatureCard({
  feature,
  onNavigate,
}: {
  feature: NonNullable<MenuNode["feature"]>;
  onNavigate: () => void;
}) {
  const accent = feature.tone === "accent";
  // Solid accent, not `grad-amber`: the gradient's dark corner drops near-black
  // to 4.19:1, which fails AA. Flat #FEC00F holds 11.3:1 across the whole card.
  const skin = accent
    ? "bg-accent text-accent-ink"
    : "bg-white/6 text-on-panel ring-1 ring-white/12";
  const chip = accent ? "bg-accent-ink/10" : "bg-white/10 text-on-panel/85";
  const tags = feature.tags ?? [];
  const rows = tags.length ? [tags, [...tags].reverse()] : [];

  return (
    <div className={`flex h-full flex-col rounded-lg p-5 ${skin}`}>
      <p className="font-mono text-[0.6875rem] tracking-caps uppercase opacity-70">
        {feature.eyebrow}
      </p>
      <p className="mt-2 text-lg leading-tight font-light text-balance">{feature.title}</p>
      <p className="mt-2 text-xs opacity-75">{feature.body}</p>
      {rows.length ? (
        <div className="-mx-5 mt-4 space-y-1.5 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)]">
          {rows.map((row, r) => (
            /* Each row is its list twice over, and the track moves exactly half
               its width, so it loops without a seam. The second row and every
               repeat are hidden from screen readers — the names are read once. */
            <ul
              key={r}
              aria-hidden={r > 0 ? true : undefined}
              className={`flex w-max hover:[animation-play-state:paused] ${r ? "marquee-track-rev" : "marquee-track"}`}
              style={{ animationDuration: r ? "34s" : "26s" }}
            >
              {[...row, ...row].map((tag, i) => (
                <li
                  key={`${tag}-${i}`}
                  aria-hidden={r === 0 && i >= row.length ? true : undefined}
                  className={`mr-1.5 rounded-pill px-2.5 py-1 text-[0.6875rem] whitespace-nowrap ${chip}`}
                >
                  {tag}
                </li>
              ))}
            </ul>
          ))}
        </div>
      ) : null}
      <Link
        href={feature.href}
        onClick={onNavigate}
        className="group/f mt-auto inline-flex items-center gap-1.5 pt-5 text-xs font-medium hover:underline"
      >
        {feature.ctaLabel}
        <ArrowUpRight className="size-3.5 transition-transform dur-fast ease-brand group-hover/f:translate-x-0.5 group-hover/f:-translate-y-0.5" />
      </Link>
    </div>
  );
}

function MegaPanel({
  menu,
  onNavigate,
  reduce,
}: {
  menu: MenuNode;
  onNavigate: () => void;
  reduce: boolean;
}) {
  const cols = menu.feature
    ? "lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_18rem]"
    : "lg:grid-cols-[15rem_minmax(0,1fr)]";
  const count = menu.columns.reduce((n, c) => n + c.items.length, 0);
  /* Where each column's tiles start in the run, so the stagger reads across
     the whole panel rather than restarting per column. */
  const starts = menu.columns.map((_, i) =>
    menu.columns.slice(0, i).reduce((n, c) => n + c.items.length, 0),
  );
  /* The footnote sits at the foot of the shorter column, filling the space
     the column leaves, rather than as a strip under the whole panel. */
  const shortest = menu.columns.reduce(
    (m, c, i, all) => (c.items.length < all[m].items.length ? i : m),
    0,
  );
  const rise = (i: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 8 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.06 + i * 0.035, ease: EASE },
  });

  return (
    <div
      id="site-mega-panel"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className="group/panel grad-ink grain relative overflow-hidden rounded-xl shadow-2xl shadow-black/30 ring-1 ring-white/10"
    >
      {/* A soft blue light that follows the pointer across the panel. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/panel:opacity-100"
        style={{
          background:
            "radial-gradient(440px circle at var(--mx, 50%) var(--my, 0px), rgb(30 136 229 / 0.16), transparent 70%)",
        }}
      />

      <div className={`relative grid ${cols}`}>
        {/* lede rail */}
        <div className="flex flex-col justify-between gap-6 p-7">
          <div>
            <p className="font-mono text-[0.6875rem] tracking-caps text-accent uppercase">
              {menu.label} · {count}
            </p>
            <p className="mt-3 text-xl leading-tight font-light text-balance text-on-panel">
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

        {/* the services */}
        <div className="grid gap-x-4 gap-y-6 border-white/10 p-5 sm:grid-cols-2 lg:border-l">
          {menu.columns.map((col, ci) => (
            <div key={col.heading ?? ci} className="flex flex-col">
              {col.heading ? (
                <motion.p
                  {...rise(starts[ci])}
                  className="mb-2 px-3 font-mono text-[0.6875rem] tracking-caps text-accent uppercase"
                >
                  {col.heading}
                </motion.p>
              ) : null}
              <ul className="space-y-0.5">
                {col.items.map((item, ii) => {
                  const Icon = NAV_ICONS[item.icon];
                  return (
                    <motion.li key={item.href} {...rise(starts[ci] + ii)}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className="group/i flex gap-3.5 rounded-md p-3 transition-colors dur-fast ease-brand hover:bg-white/[0.06] focus-visible:bg-white/[0.06]"
                      >
                        <span
                          aria-hidden
                          className="grid size-9 shrink-0 place-items-center rounded-md bg-white/[0.07] ring-1 ring-white/10 transition dur-base ease-brand group-hover/i:scale-105 group-hover/i:bg-primary group-hover/i:ring-white/25"
                        >
                          <Icon
                            className="size-4 text-accent transition-colors dur-base ease-brand group-hover/i:text-white"
                            strokeWidth={1.75}
                          />
                        </span>
                        <span className="min-w-0 pt-px">
                          <span className="flex items-center gap-1.5 text-sm text-on-panel">
                            {item.label}
                            <ArrowRight
                              aria-hidden
                              className="size-3.5 -translate-x-1 opacity-0 transition dur-fast ease-brand group-hover/i:translate-x-0 group-hover/i:opacity-70"
                            />
                          </span>
                          {item.description ? (
                            <span className="mt-0.5 block text-xs leading-snug text-on-panel/60">
                              {item.description}
                            </span>
                          ) : null}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
              {menu.footnote && ci === shortest ? (
                <motion.div
                  {...rise(count)}
                  className="mx-3 mt-4 rounded-md border border-dashed border-white/15 p-4 lg:mt-auto"
                >
                  <p className="text-xs text-on-panel/60">{menu.footnote.text}</p>
                  <Link
                    href={menu.footnote.cta.href}
                    onClick={onNavigate}
                    className="group/n mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-accent"
                  >
                    <span className="group-hover/n:underline">{menu.footnote.cta.label}</span>
                    <ArrowUpRight className="size-3.5 shrink-0 transition-transform dur-fast ease-brand group-hover/n:translate-x-0.5 group-hover/n:-translate-y-0.5" />
                  </Link>
                </motion.div>
              ) : null}
            </div>
          ))}
        </div>

        {/* feature - the first thing to go when the viewport cannot hold it */}
        {menu.feature ? (
          <div className="hidden border-white/10 p-5 xl:block xl:border-l">
            <FeatureCard feature={menu.feature} onNavigate={onNavigate} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** `useLayoutEffect` warns during SSR; this is the standard way round it. */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function SiteHeader() {
  const pathname = usePathname();
  const reduce = Boolean(useReducedMotion());
  const [open, setOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  /* True while the bar is sitting over a section that declares itself dark. */
  const [overDark, setOverDark] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [mobileServices, setMobileServices] = useState(false);
  /* The link under the pointer (or keyboard focus): where the highlight sits. */
  const [hovered, setHovered] = useState<string | null>(null);
  /* Each link's place along the list, for the highlight to glide between. */
  const [boxes, setBoxes] = useState<Record<string, { x: number; w: number }>>({});
  const closeTimer = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const triggers = useRef(new Map<string, HTMLButtonElement>());
  const menuButton = useRef<HTMLButtonElement>(null);

  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setOpen(null);
    setMobile(false);
    setMobileServices(false);
  }

  /* Page progress for the hairline, eased so it glides rather than ticks. */
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Measured, not guessed: the labels are live text, so their widths are only
     known once the font is in. The observer's first report does the first
     measure, and any later change in the list's size — the font landing, a
     resize — does it again. */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const ro = new ResizeObserver(() => {
      const next: Record<string, { x: number; w: number }> = {};
      list.querySelectorAll<HTMLElement>("[data-nav-item]").forEach((el) => {
        next[el.dataset.navItem ?? ""] = { x: el.offsetLeft, w: el.offsetWidth };
      });
      setBoxes(next);
    });
    ro.observe(list);
    return () => ro.disconnect();
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

  /* Escape closes whatever is open and gives focus back to what opened it. */
  useEffect(() => {
    if (!open && !mobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (open) {
        triggers.current.get(open)?.focus();
        setOpen(null);
      }
      if (mobile) {
        setMobile(false);
        setMobileServices(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, mobile]);

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
  const showProgress = scrolled && !overDark && !open && !mobile;

  /* The highlight follows the pointer, and stays on Services while its panel
     is open. */
  const lit = hovered ?? open;
  const litBox = lit ? boxes[lit] : undefined;

  const transition = reduce ? { duration: 0 } : { duration: 0.32, ease: EASE };

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
            {/* The page's progress, along the bar's foot. Clipped to the bar's
                own corners by a wrapper, not by the bar — the bar cannot clip,
                or it would cut off the mega panel hanging below it. */}
            <span
              aria-hidden
              className={`pointer-events-none absolute inset-0 overflow-hidden rounded-md transition-opacity dur-base ease-brand ${
                showProgress ? "opacity-100" : "opacity-0"
              }`}
            >
              <motion.span
                data-nav-progress
                style={{ scaleX: progress }}
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-linear-to-r from-[#1E88E5] to-[#FEC00F]"
              />
            </span>

            <Link
              href="/"
              aria-label="Hazeberg — home"
              className="-mx-2 flex min-h-11 shrink-0 items-center rounded-sm px-2"
            >
              {/* Up twice on the client's note. It started at 14/16px, which was
                  correct against the nav links and too quiet as the one piece of
                  identity in the bar; 18/22px was closer; this is 21/26px.
                  Still well inside the bar — the nav is 56px on a phone and 68px
                  from md, and the link's own 44px minimum is what sets the row's
                  height, so nothing around the wordmark moves at either size.
                  No hover fade on the link: the birds are the hover now. */}
              <AnimatedHazebergWordmark className="h-[1.3125rem] w-auto md:h-[1.625rem]" />
            </Link>

            {/* Centred, absolutely positioned so the logo and CTA cannot shift it. */}
            <nav
              aria-label="Main"
              onPointerLeave={() => {
                release();
                setHovered(null);
              }}
              onPointerEnter={hold}
              className="absolute left-1/2 hidden -translate-x-1/2 lg:block"
            >
              <div ref={listRef} className="relative">
                {/* The one highlight. It fades in where the pointer arrives,
                    glides from link to link, and fades out where it leaves. */}
                <AnimatePresence>
                  {litBox ? (
                    <motion.span
                      key="glide"
                      aria-hidden
                      data-nav-glide
                      className={`pointer-events-none absolute top-0 left-0 h-10 rounded-pill ${
                        dark ? "bg-white/12" : "bg-ink/[0.06]"
                      }`}
                      initial={{ x: litBox.x, width: litBox.w, opacity: 0, scale: 0.92 }}
                      animate={{ x: litBox.x, width: litBox.w, opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={reduce ? { duration: 0 } : { ...GLIDE, opacity: { duration: 0.16 } }}
                    />
                  ) : null}
                </AnimatePresence>

                <ul className="flex items-center gap-1">
                  {PRIMARY_NAV.map((node) => {
                    const active = isActive(node, pathname);
                    const shared = `relative flex h-10 items-center gap-1 rounded-pill px-3.5 text-sm transition-opacity dur-fast ease-brand ${
                      /* Opacity rather than a colour, so one rule works on both
                         grounds: the link always sits on whatever the bar is set to. */
                      active || lit === node.label ? "opacity-100" : "opacity-65"
                    }`;
                    /* The page you are on. One dot, shared across the list, so
                       going to another page slides it along rather than blinking
                       one out and another in. */
                    const here = active ? (
                      <motion.span
                        layoutId="nav-here"
                        aria-hidden
                        data-nav-here
                        transition={reduce ? { duration: 0 } : GLIDE}
                        className={`absolute inset-x-0 bottom-1 mx-auto size-1 rounded-pill ${
                          dark ? "bg-accent" : "bg-primary"
                        }`}
                      />
                    ) : null;
                    const focusIn = (e: FocusEvent) => {
                      if ((e.target as Element).matches(":focus-visible")) setHovered(node.label);
                    };
                    const focusOut = () => setHovered((h) => (h === node.label ? null : h));

                    if (node.kind === "link") {
                      return (
                        <li
                          key={node.label}
                          data-nav-item={node.label}
                          onPointerEnter={() => setHovered(node.label)}
                          onFocus={focusIn}
                          onBlur={focusOut}
                        >
                          <Link
                            href={node.href}
                            onPointerEnter={release}
                            aria-current={active ? "page" : undefined}
                            className={shared}
                          >
                            {node.label}
                            {here}
                          </Link>
                        </li>
                      );
                    }

                    const isOpen = open === node.label;
                    return (
                      <li
                        key={node.label}
                        data-nav-item={node.label}
                        onPointerEnter={() => setHovered(node.label)}
                        onFocus={focusIn}
                        onBlur={focusOut}
                      >
                        <button
                          type="button"
                          ref={(el) => {
                            if (el) triggers.current.set(node.label, el);
                            else triggers.current.delete(node.label);
                          }}
                          aria-expanded={isOpen}
                          aria-controls="site-mega-panel"
                          onPointerEnter={() => {
                            hold();
                            setOpen(node.label);
                          }}
                          onClick={() => setOpen(isOpen ? null : node.label)}
                          onKeyDown={(e) => {
                            if (e.key !== "ArrowDown") return;
                            e.preventDefault();
                            setOpen(node.label);
                            /* Two frames: one for the panel to mount, one for
                               its links to exist. */
                            requestAnimationFrame(() =>
                              requestAnimationFrame(() =>
                                document.querySelector<HTMLElement>("#site-mega-panel a[href]")?.focus(),
                              ),
                            );
                          }}
                          className={`cursor-pointer ${shared}`}
                        >
                          {node.label}
                          <ChevronDown
                            aria-hidden
                            className={`size-3.5 opacity-60 transition-transform dur-base ease-brand ${isOpen ? "rotate-180" : ""}`}
                          />
                          {here}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
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
                  className="relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-pill disc-blue"
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
                ref={menuButton}
                onClick={() => {
                  setMobile((v) => !v);
                  setMobileServices(false);
                }}
                aria-expanded={mobile}
                aria-label={mobile ? "Close menu" : "Open menu"}
                className={`grid size-11 cursor-pointer place-items-center rounded-sm transition-colors dur-fast ease-brand lg:hidden ${
                  dark ? "hover:bg-white/10" : "hover:bg-glass"
                }`}
              >
                {/* The two icons turn through each other rather than swapping. */}
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={mobile ? "close" : "open"}
                    initial={reduce ? false : { opacity: 0, rotate: -90, scale: 0.6 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0, rotate: 90, scale: 0.6 }}
                    transition={{ duration: 0.24, ease: EASE }}
                    className="grid place-items-center"
                  >
                    {mobile ? <X className="size-5" /> : <Menu className="size-5" />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>

            {/* Full-width mega panel, anchored to the bar rather than the trigger. */}
            <AnimatePresence>
              {open ? (
                <motion.div
                  key={open}
                  initial={{ opacity: 0, y: -10, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.99 }}
                  transition={transition}
                  onPointerEnter={hold}
                  onPointerLeave={release}
                  className="absolute inset-x-0 top-full hidden origin-top pt-3 lg:block"
                >
                  {(() => {
                    const menu = MENUS.find((m) => m.label === open);
                    return menu ? (
                      <MegaPanel menu={menu} onNavigate={() => setOpen(null)} reduce={reduce} />
                    ) : null;
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
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={transition}
              className="fixed inset-x-[var(--gutter)] top-[var(--header-h)] bottom-[var(--gutter)] z-40 flex flex-col overflow-y-auto rounded-lg bg-surface-2/96 p-6 ring-1 ring-border backdrop-blur-xl lg:hidden"
            >
              <nav aria-label="Main">
                <ul className="divide-y divide-border">
                  {PRIMARY_NAV.map((node, i) => {
                    const active = isActive(node, pathname);
                    const mark = active ? (
                      <span aria-hidden className="size-1.5 rounded-pill bg-primary" />
                    ) : null;
                    return (
                      <motion.li
                        key={node.label}
                        className="py-1"
                        initial={reduce ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.05 + i * 0.045, ease: EASE }}
                      >
                        {node.kind === "link" ? (
                          <Link
                            href={node.href}
                            onClick={() => setMobile(false)}
                            aria-current={active ? "page" : undefined}
                            className="group/m flex min-h-14 items-center justify-between text-2xl font-light text-ink"
                          >
                            <span className="flex items-center gap-3">
                              {node.label}
                              {mark}
                            </span>
                            <ArrowUpRight
                              aria-hidden
                              className="size-5 opacity-30 transition dur-fast ease-brand group-hover/m:opacity-80"
                              strokeWidth={1.5}
                            />
                          </Link>
                        ) : (
                          <>
                            <button
                              type="button"
                              aria-expanded={mobileServices}
                              aria-controls="site-mobile-services"
                              onClick={() => setMobileServices((v) => !v)}
                              className="flex min-h-14 w-full cursor-pointer items-center justify-between text-2xl font-light text-ink"
                            >
                              <span className="flex items-center gap-3">
                                {node.label}
                                {mark}
                              </span>
                              <ChevronDown
                                aria-hidden
                                className={`size-5 opacity-50 transition-transform dur-base ease-brand ${mobileServices ? "rotate-180" : ""}`}
                                strokeWidth={1.5}
                              />
                            </button>
                            <AnimatePresence initial={false}>
                              {mobileServices ? (
                                <motion.div
                                  id="site-mobile-services"
                                  initial={reduce ? false : { height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                                  transition={{ duration: 0.32, ease: EASE }}
                                  className="overflow-hidden"
                                >
                                  <ul className="grid gap-1 pb-3 sm:grid-cols-2">
                                    {node.columns
                                      .flatMap((c) => c.items)
                                      .map((item) => {
                                        const Icon = NAV_ICONS[item.icon];
                                        return (
                                          <li key={item.href}>
                                            <Link
                                              href={item.href}
                                              onClick={() => setMobile(false)}
                                              className="flex min-h-12 items-center gap-3 rounded-md px-2 py-1.5 text-sm text-ink transition-colors dur-fast ease-brand hover:bg-glass"
                                            >
                                              <span
                                                aria-hidden
                                                className="grid size-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary"
                                              >
                                                <Icon className="size-4" strokeWidth={1.75} />
                                              </span>
                                              {item.label}
                                            </Link>
                                          </li>
                                        );
                                      })}
                                  </ul>
                                </motion.div>
                              ) : null}
                            </AnimatePresence>
                          </>
                        )}
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <motion.div
                className="mt-auto pt-8"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 + PRIMARY_NAV.length * 0.045, ease: EASE }}
              >
                <Link
                  href={NAV_CTA.href}
                  onClick={() => setMobile(false)}
                  data-spec
                  className="spec flex h-12 items-center justify-center gap-2 rounded-pill bg-ink text-sm font-medium text-ink-invert"
                >
                  {NAV_CTA.label}
                  <ArrowUpRight aria-hidden className="size-4" strokeWidth={2} />
                </Link>
                <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-ink-muted">
                  <a href={`mailto:${CONTACT.email}`} className="inline-flex min-h-11 items-center hover:text-ink">
                    {CONTACT.email}
                  </a>
                  <a href={CONTACT.phoneHref} className="inline-flex min-h-11 items-center hover:text-ink">
                    {CONTACT.phone}
                  </a>
                </div>
              </motion.div>
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
