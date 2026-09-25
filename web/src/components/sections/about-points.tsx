"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { Waypoints } from "lucide-react";

import { RevealGroup, RevealItem } from "@/components/motion/reveal";

/**
 * The three proof rows, with the filled mark following the reader.
 *
 * The fill used to sit permanently on the middle row, which meant nothing —
 * nothing about "High-Fidelity Delivery" is selected, it was there for rhythm.
 * Driving it off scroll position turns an arbitrary decoration into a state: it
 * marks where you are in the section. Hover takes it over, because a pointer is
 * a stronger statement of intent than a scroll position.
 *
 * Nothing collapses. All three bodies stay visible at all times — they are one
 * short line each and every one earns its place, so hiding two of them behind an
 * accordion would cost information and buy nothing.
 *
 * A row with no supplied mark falls back to Lucide, the project's locked icon
 * set. Three marks were supplied and the revised copy runs to four rows; the
 * alternatives were reusing one of the three — a duplicate icon in a four-row
 * list — or drawing a fourth in the supplied files' style, which is exactly the
 * "supplied assets are not rewritten" rule. The fallback is stroked rather than
 * filled, so it takes `currentColor` and follows the same state as the others.
 *
 * The icons are painted through a CSS mask rather than rendered as images. The
 * supplied files have their colours baked in and they disagree with each other:
 * `2nd.svg` is stroked in white because it was drawn for the filled circle,
 * `1st` and `3rd` in near-black for the plain one. As soon as the fill moves,
 * one of them is invisible whichever way round it lands. Masking uses only each
 * file's alpha and takes the colour from `currentColor`, so all three follow the
 * state and none of the artwork has to be touched.
 */

type Point = { readonly icon?: string; readonly title: string; readonly body: string };

export function AboutPoints({ points }: { points: readonly Point[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  // The list's own travel through the viewport is the progress. Ends at 0.55
  // rather than at the bottom so the last row is lit while it is still being
  // read, not as it leaves.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    setActive(Math.min(points.length - 1, Math.max(0, Math.floor(v * points.length))));
  });

  const current = hover ?? active;

  return (
    <RevealGroup as="ul" ref={ref} className="divide-y divide-border">
      {points.map((p, i) => {
        const on = i === current;
        return (
          <RevealItem
            as="li"
            key={p.title}
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
            className="flex gap-5 py-6 first:pt-0 lg:py-7 lg:first:pt-0"
          >
            <span
              className={`relative grid size-11 shrink-0 place-items-center rounded-pill ring-1 transition-colors dur-base ease-brand ${
                on ? "text-primary-ink ring-transparent" : "text-ink ring-border"
              }`}
            >
              {/* The fill is a layer that cross-fades, not a class that swaps.
                  `grad-primary` is a background-image, and background-image does
                  not transition — toggling the class would snap. */}
              <span
                aria-hidden
                className={`grad-primary absolute inset-0 rounded-pill transition-opacity dur-base ease-brand ${
                  on ? "opacity-100" : "opacity-0"
                }`}
              />
              {p.icon ? (
                <span
                  aria-hidden
                  className="relative size-6 bg-current"
                  style={{
                    maskImage: `url(${p.icon})`,
                    WebkitMaskImage: `url(${p.icon})`,
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                  }}
                />
              ) : (
                <Waypoints aria-hidden className="relative size-5" strokeWidth={1.6} />
              )}
            </span>
            <span className="min-w-0">
              <span className="block text-base font-medium text-ink">{p.title}</span>
              <span className="mt-1.5 block text-sm text-ink-muted">{p.body}</span>
            </span>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
