import { ArrowUpRight } from "lucide-react";

import { BERG_HUES } from "@/components/berg/hues";
import { BergLogo } from "@/components/brand/berg-logo";
import { Reveal } from "@/components/motion/reveal";
import { CtaPill } from "@/components/ui/cta-pill";
import { BERG_HOME_BAND } from "@/lib/berg-content";

/**
 * Berg, on the home page: one card, straight after Services.
 *
 * Services is what Hazeberg does for a client; Berg is the thing Hazeberg built.
 * So it comes right after the services and says one thing — this platform is
 * ours, go and look — and does not try to be a second Berg page. The logo, the
 * page's own title, one sentence, the three groups, two ways in.
 *
 * A white card on the surface, the same as every card on the site, lit by
 * `.map-ground`'s two washes — the ground Services itself sits on, so the card
 * reads as coming out of the section above it. The section has no bottom
 * padding of its own: Results, on the same surface, starts with its full
 * `--section-y`, and that is the gap.
 *
 * Server-rendered: nothing here moves except the reveal.
 */
export function BergBand() {
  const band = BERG_HOME_BAND;
  return (
    <section id="berg" aria-labelledby="berg-band-title" className="relative bg-surface">
      <div className="shell pt-[var(--section-y)]">
        <Reveal>
          <div className="map-ground flex flex-col gap-8 rounded-2xl px-6 py-8 ring-1 ring-border sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-14 lg:px-14 lg:py-12">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <BergLogo className="h-9 w-auto sm:h-10" />
                <p className="font-mono text-xs tracking-caps text-ink-subtle uppercase">
                  {band.eyebrow}
                </p>
              </div>
              <h2
                id="berg-band-title"
                className="mt-6 max-w-[24ch] text-3xl leading-[1.08] font-light tracking-[-0.03em] text-balance text-ink"
              >
                {band.titleLead}
                <span className="text-primary">{band.titleAccent}</span>
              </h2>
              <p className="mt-4 max-w-[52ch] text-base text-ink-muted">{band.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {band.groups.map((g) => (
                  <li
                    key={g.key}
                    className="flex items-center gap-2 rounded-pill bg-canvas py-1.5 pr-3.5 pl-2.5 text-xs font-medium text-ink-muted ring-1 ring-border"
                  >
                    <span
                      aria-hidden
                      className="size-2 rounded-pill"
                      style={{ backgroundColor: BERG_HUES[g.key] }}
                    />
                    {g.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-x-7 gap-y-4">
              <CtaPill href={band.cta.href}>{band.cta.label}</CtaPill>
              <a
                href={band.app.href}
                target="_blank"
                rel="noreferrer"
                className="group/a inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary"
              >
                {band.app.label}
                <ArrowUpRight
                  aria-hidden
                  className="size-4 transition-transform dur-base ease-brand group-hover/a:translate-x-0.5 group-hover/a:-translate-y-0.5"
                  strokeWidth={2}
                />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
