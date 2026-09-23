"use client";

import { useState } from "react";
import { LayoutList, Share2 } from "lucide-react";

import { ServicesIndex } from "@/components/sections/services-index";
import { ServicesMap } from "@/components/sections/services-map";

/**
 * Two takes on the same seven services, and a switch between them.
 *
 * **The switch is a decision tool, not a feature.** It is here so the two can be
 * compared live on the real page instead of side by side in a screenshot, and it
 * comes out before launch — delete `ServicesSwitch` and render the chosen view
 * directly. A visitor offered two views of one list has been handed a choice that
 * is not theirs to make.
 *
 * Which is why it is deliberately small, in the corner, unlabelled in the layout,
 * and reachable only by pointer or keyboard — it must not read as part of the
 * design while it is being judged against it.
 *
 * The list is the default: it is measured, it works on a phone, and it works from
 * the keyboard. The map is the newer idea and has to earn the swap.
 */

const VIEWS = [
  { key: "list" as const, label: "Index list", icon: LayoutList },
  { key: "map" as const, label: "Ecosystem map", icon: Share2 },
];

export function ServicesSection() {
  const [view, setView] = useState<"list" | "map">("list");

  return (
    /* The map is lit from its own corners, and a flat surface under it reads as
       paper with stickers on. The list keeps the page's own ground. */
    <section id="services" className={`relative ${view === "map" ? "map-ground" : "bg-surface"}`}>
      {/* TEMPORARY — see the note above. */}
      <div
        data-decision-tool
        className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden lg:block"
      >
        <div className="shell flex justify-end pt-6">
          <div
            role="group"
            aria-label="Preview: services layout (temporary, not part of the design)"
            className="pointer-events-auto flex gap-1 rounded-pill border border-border bg-canvas/90 p-1 backdrop-blur-sm"
          >
            {VIEWS.map((v) => {
              const on = view === v.key;
              return (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => setView(v.key)}
                  aria-pressed={on}
                  title={v.label}
                  className={`grid size-8 cursor-pointer place-items-center rounded-pill transition dur-fast ease-brand ${
                    on ? "bg-ink text-ink-invert" : "text-ink-subtle hover:text-ink"
                  }`}
                >
                  <v.icon aria-hidden className="size-4" strokeWidth={2} />
                  <span className="sr-only">{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {view === "list" ? <ServicesIndex /> : <ServicesMap />}
    </section>
  );
}
