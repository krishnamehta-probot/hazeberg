"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { HazebergWordmark } from "@/components/brand/hazeberg-wordmark";
import { Arrow, Button, Chevron } from "@/components/v2/kit";
import { V2_NAV, V2_SERVICES } from "@/lib/v2/content";

/**
 * v2's header, to the comp: a white bar floating clear of every edge, with
 * the wordmark left, the links centred and one blue pill on the right.
 *
 * The site's own header is a dark pill with a full-width mega panel. It is
 * not reused here — v2 renders on its own chrome, switched on by
 * `ChromeGate` in the root layout — but the INFORMATION ARCHITECTURE is the
 * same one, because that is the signed-off sitemap and not a design choice.
 *
 * Three things the comp fixes that are worth naming:
 *
 *   - the bar is opaque white from the first pixel, not transparent-until-
 *     scrolled. The hero behind it is a white page with a photograph on the
 *     right, and a transparent bar would put the wordmark on the photograph
 *     at exactly one scroll position
 *   - it gains a shadow rather than a border on scroll. A hairline appearing
 *     under a floating bar reads as a seam; a shadow reads as lift
 *   - the dropdowns open on hover AND on click, and close on Escape and on
 *     pointer-leave. Hover alone is unusable on a touch screen; click alone
 *     makes a mouse user work for something the chevron is inviting
 */

/** The Services panel lists the real seven, straight from the content module,
    so a service added there cannot go missing from the nav. */
const SERVICE_LINKS = V2_SERVICES.items.map((s) => ({ label: s.label, href: s.href }));

const PANELS: Record<string, { label: string; href: string }[]> = {
  services: SERVICE_LINKS,
  solutions: [
    { label: "What we do", href: "/what-we-do" },
    { label: "Workday AMS", href: "/what-we-do#workday-ams" },
    { label: "Case studies", href: "/what-we-do#case-studies" },
  ],
  about: [
    { label: "About Hazeberg", href: "/about" },
    { label: "Berg", href: "/berg" },
    { label: "Careers", href: "/careers" },
  ],
};

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const reduce = useReducedMotion();
  /* Closing is delayed by a beat so the pointer can cross the gap between the
     trigger and the panel without the panel disappearing under it. */
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenMenu(null);
      setDrawer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* The drawer covers the page, so a wheel event inside it must not move the
     document behind it. Restoring the previous value rather than clearing it
     keeps this from fighting anything else that locks scrolling. */
  useEffect(() => {
    if (!drawer) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawer]);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const hold = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(key);
  };
  const release = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-3 md:pt-4">
      <div className="v2-shell">
        <div
          className={`relative flex h-[var(--v2-nav-h)] items-center justify-between gap-4 rounded-pill border border-border bg-canvas px-3 transition-shadow duration-500 md:px-4 ${
            scrolled ? "shadow-[var(--v2-shadow-float)]" : "shadow-[var(--v2-shadow-card)]"
          }`}
        >
          <Link
            href="/v2"
            aria-label="Hazeberg — home"
            className="shrink-0 px-2 text-ink transition-opacity duration-300 hover:opacity-70"
          >
            <HazebergWordmark className="h-[17px] w-auto" />
          </Link>

          {/* Centred absolutely rather than by flex, so the link row stays in
              the middle of the BAR and does not drift when the wordmark and
              the button turn out to be different widths. */}
          <nav
            aria-label="Primary"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center lg:flex"
          >
            {V2_NAV.links.map((link) => {
              const panel = link.menu ? PANELS[link.menu] : undefined;
              const open = openMenu === link.menu;
              return (
                <div
                  key={link.label}
                  className="relative"
                  onPointerEnter={() => (panel ? hold(link.menu!) : release())}
                  onPointerLeave={release}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpenMenu(null)}
                    aria-expanded={panel ? open : undefined}
                    className="flex items-center gap-1.5 rounded-pill px-3.5 py-2 text-sm text-ink-muted transition-colors duration-300 hover:text-ink"
                  >
                    {link.label}
                    {panel ? (
                      <Chevron
                        className={`h-3 w-3 rotate-90 transition-transform duration-300 ${
                          open ? "-rotate-90" : ""
                        }`}
                      />
                    ) : null}
                  </Link>

                  <AnimatePresence>
                    {panel && open ? (
                      <motion.div
                        initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-full left-1/2 w-60 -translate-x-1/2 pt-3"
                      >
                        <ul className="v2-card overflow-hidden p-1.5 shadow-[var(--v2-shadow-float)]">
                          {panel.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={() => setOpenMenu(null)}
                                className="group flex items-center justify-between gap-3 rounded-[10px] px-3 py-2.5 text-sm text-ink-muted transition-colors duration-200 hover:bg-surface hover:text-ink"
                              >
                                {item.label}
                                <Arrow className="h-3.5 w-3.5 -translate-x-1 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button href={V2_NAV.cta.href} size="sm" className="hidden sm:inline-flex">
              {V2_NAV.cta.label}
            </Button>

            <button
              type="button"
              onClick={() => setDrawer((v) => !v)}
              aria-expanded={drawer}
              aria-controls="v2-drawer"
              aria-label={drawer ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors duration-300 hover:bg-surface lg:hidden"
            >
              {/* Two bars becoming a cross — drawn rather than swapped for an
                  icon, so the shape is continuous through the change. */}
              <span aria-hidden className="relative block h-3 w-4.5">
                <span
                  className={`absolute left-0 block h-px w-full bg-current transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    drawer ? "top-1/2 rotate-45" : "top-0.5"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-full bg-current transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    drawer ? "top-1/2 -rotate-45" : "top-[calc(100%-2px)]"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {drawer ? (
          <motion.div
            id="v2-drawer"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="v2-shell mt-3 lg:hidden"
          >
            <div className="v2-card max-h-[calc(100svh-8rem)] overflow-y-auto p-2 shadow-[var(--v2-shadow-float)]">
              <ul>
                {V2_NAV.links.map((link) => (
                  <li key={link.label} className="border-b border-border last:border-0">
                    <Link
                      href={link.href}
                      onClick={() => setDrawer(false)}
                      className="flex items-center justify-between gap-3 px-3 py-3.5 text-base text-ink"
                    >
                      {link.label}
                      <Arrow className="h-4 w-4 text-primary" />
                    </Link>
                    {link.menu && PANELS[link.menu] ? (
                      <ul className="pb-3">
                        {PANELS[link.menu].map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setDrawer(false)}
                              className="block px-3 py-2 text-sm text-ink-muted"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
              <div className="p-3">
                <Button href={V2_NAV.cta.href} className="w-full justify-between">
                  {V2_NAV.cta.label}
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
