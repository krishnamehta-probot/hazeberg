import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import type { ServiceStage } from "@/lib/service-content";

import { StageIcon } from "./stage-icons";

const pad = (v: number) => String(v).padStart(2, "0");

/**
 * One stage of the cycle, as the place a link lands.
 *
 * Every stage on the hero's ring and every row of the rail beside these points
 * here (`#stage-<key>`), so the panel is built to be arrived at: the stage word
 * first, huge and light and set in capitals like the stage names on What we
 * do, so a reader who jumped can see at once that they landed on "Paid" and
 * not on the panel above it; then the area, the one line, and the four
 * capabilities as a two-by-two of ticked rows.
 *
 * The word is the panel's one bit of theatre. It is ink while the panel is
 * elsewhere and the brand blue sweeps through it from the left when it becomes
 * the stage being read (`.stage-word`) — every point of that sweep is at least
 * 3.36:1 on white, which display type this size needs 3:1 to clear.
 *
 * A server component. Which panel is being read is the rail's business
 * (`stage-spy.tsx`): it sets `data-active` on this element directly, and the
 * styles below answer to the attribute, so six panels of copy never re-render
 * for a scroll.
 *
 * The id is on the article, and the article carries the gap above its card as
 * padding. That is what makes a jump land clear of everything stuck to the top
 * of the screen: Lenis aims a link at the article's top less the header's
 * height plus 24px, and ignores `scroll-margin`, so the room has to be in the
 * box itself. On a phone the stage chips are stuck under the header as well
 * (they end 147px down; Lenis lands the article at 92), so the 72px of padding
 * starts the card 17px below them — 192 against 175 from md. The native jump
 * reduced motion falls back to uses the page's `scroll-padding-top` and lands
 * lower still. On a desktop the 32px puts a jumped-to card level with the
 * sticky rail's top. The reveal moves the card, never the article, so nothing
 * animates where a jump aims.
 */
export function StagePanel({
  stage,
  index,
  total,
}: {
  stage: ServiceStage;
  index: number;
  total: number;
}) {
  const id = `stage-${stage.key}`;
  return (
    <article
      id={id}
      data-stage-panel
      aria-labelledby={`${id}-area`}
      className="group/panel pt-18 md:pt-20 lg:pt-8 lg:first-of-type:pt-0"
    >
      <Reveal>
        <div className="rounded-2xl bg-canvas p-6 ring-1 ring-border transition-shadow dur-slow ease-brand group-data-[active]/panel:shadow-xl group-data-[active]/panel:shadow-primary/10 group-data-[active]/panel:ring-primary/25 sm:p-8 lg:p-10">
          <div className="flex items-center gap-3.5">
            <span className="relative grid size-11 shrink-0 place-items-center rounded-pill bg-surface text-primary">
              <span
                aria-hidden
                className="disc-blue absolute inset-0 rounded-pill opacity-0 transition-opacity dur-base ease-brand group-data-[active]/panel:opacity-100"
              />
              <StageIcon
                stageKey={stage.key}
                className="relative size-[1.125rem] transition-colors dur-base ease-brand group-data-[active]/panel:text-white"
              />
            </span>
            <p className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle tabular-nums">
              <span className="text-primary">{pad(index + 1)}</span> / {pad(total)}
            </p>
          </div>

          <p className="stage-word mt-7 w-fit text-3xl leading-[0.95] font-light tracking-[-0.035em] uppercase sm:text-4xl">
            {stage.stage}
          </p>
          <h3
            id={`${id}-area`}
            className="mt-5 text-xl leading-snug font-light tracking-[-0.015em] text-balance text-ink"
          >
            {stage.area}
          </h3>
          <p className="mt-3 max-w-[54ch] text-base text-ink-muted">{stage.line}</p>

          <ul className="mt-8 grid gap-x-8 sm:grid-cols-2">
            {stage.items.map((item) => (
              <li key={typeof item === "string" ? item : item.href} className="border-t border-border">
                {typeof item === "string" ? (
                  <p className="flex items-start gap-3 py-4 text-sm text-ink">
                    <span
                      aria-hidden
                      className="mt-px grid size-5 shrink-0 place-items-center rounded-pill bg-primary/10 text-primary"
                    >
                      <Check className="size-3" strokeWidth={2.75} />
                    </span>
                    <span className="min-w-0">{item}</span>
                  </p>
                ) : (
                  /* The one capability that is a door — to another module's
                     page. Same row, same disc, but the disc holds the arrow
                     every link on the site wears, and the words are blue. */
                  <Link
                    href={item.href}
                    className="group/link flex min-h-11 items-start gap-3 py-4 text-sm font-medium text-primary"
                  >
                    <span
                      aria-hidden
                      className="mt-px grid size-5 shrink-0 place-items-center rounded-pill bg-primary/10 text-primary transition-colors dur-base ease-brand group-hover/link:bg-primary group-hover/link:text-white"
                    >
                      <ArrowUpRight
                        className="size-3 transition-transform dur-base ease-brand group-hover/link:translate-x-px group-hover/link:-translate-y-px"
                        strokeWidth={2.75}
                      />
                    </span>
                    <span className="min-w-0 underline-offset-4 group-hover/link:underline">
                      {item.label}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </article>
  );
}
