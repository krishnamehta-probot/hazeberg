"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Horizontal rail with scroll-snap and a pair of arrows, matching the
 * reference's service and testimonial carousels.
 *
 * Native scrolling does the work: the arrows page by one child width rather
 * than driving a transform, so touch, trackpad, keyboard and scrollbar all
 * behave without a second code path. Arrows disable at the ends instead of
 * wrapping — a rail that silently loops hides how much is left.
 */
export function Carousel({
  children,
  label,
  header,
  className = "",
}: {
  children: React.ReactNode;
  label: string;
  /** When given, the arrows move up beside it instead of sitting under the rail. */
  header?: React.ReactNode;
  className?: string;
}) {
  const rail = useRef<HTMLUListElement>(null);
  const [at, setAt] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAt({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 });
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [measure]);

  const page = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = first ? first.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const arrow =
    "grid size-11 place-items-center rounded-pill ring-1 ring-border-strong text-ink transition dur-base ease-brand hover:bg-glass disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer";

  const controls = (
    <div className="flex gap-3">
      <button type="button" onClick={() => page(-1)} disabled={at.start} aria-label="Previous" className={arrow}>
        <ArrowLeft aria-hidden className="size-4" strokeWidth={1.75} />
      </button>
      <button type="button" onClick={() => page(1)} disabled={at.end} aria-label="Next" className={arrow}>
        <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
      </button>
    </div>
  );

  return (
    <div className={className}>
      {header ? (
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          {header}
          <div className="hidden sm:block">{controls}</div>
        </div>
      ) : null}

      <ul
        ref={rail}
        aria-label={label}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [mask-image:linear-gradient(90deg,#000_0,#000_97%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>

      <div className={`mt-8 flex justify-center ${header ? "sm:hidden" : ""}`}>{controls}</div>
    </div>
  );
}
