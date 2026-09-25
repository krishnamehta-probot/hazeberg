import { HorizonGlow } from "@/components/motion/horizon-glow";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/section";

/**
 * The opener every inner page starts with.
 *
 * The home page opens on a full-screen shader hero. An inner page must not:
 * a whole screen of light before a single word of the thing you navigated here
 * for is a home page pretending to be a sub-page. So this is the same light,
 * one third the height — a dark band with the arc low in it, bleeding into the
 * light section below.
 *
 * Three deliberate differences from the hero:
 *
 *   - **left-aligned.** The hero is one centred sentence. An inner page's first
 *     screen carries a heading AND a rail of facts, and a centred head over a
 *     left-aligned body is two pages stacked.
 *   - **not interactive.** `interactive={false}`, like the closing panel: in the
 *     hero the light is something to play with, and at the top of a form it is
 *     scenery. It also costs nothing to run — no pointer listener, no energy
 *     term, one canvas.
 *   - **short clearance.** 44px, so the arc's crest sits just above the band's
 *     foot and the type keeps the whole upper frame. Measured the same way the
 *     hero's 165 was: the number is the fixed thing at the bottom of the
 *     section, and here that is nothing but a gap.
 *
 * `data-nav-dark` is what flips the site header to white over it — the header
 * is global and has no idea which page it is sitting on.
 *
 * The meta rail is the page's own facts, in Space Mono at label size: where we
 * are, how fast we answer, what we are. It is deliberately short. A rail is a
 * caption, and a caption that runs to six rows is a paragraph.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  meta,
}: {
  eyebrow: string;
  /** A node, not a string: both pages break their own headline and one of them
      carries the brand amber on the second half — the one ground on the site
      where yellow is allowed to be type (11.97:1 here, 1.65:1 on white). */
  title: React.ReactNode;
  lead: string;
  meta?: { label: string; value: string }[];
}) {
  return (
    <section
      data-nav-dark
      className="relative isolate overflow-hidden bg-void text-on-panel"
    >
      <HorizonGlow
        interactive={false}
        clearance={44}
        className="absolute inset-0 block size-full"
      />

      <div className="relative shell pt-[calc(var(--header-h)+3.5rem)] pb-[var(--section-y)] lg:pt-[calc(var(--header-h)+5.5rem)]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-end lg:gap-16">
          <div>
            <Reveal immediate>
              <Eyebrow tone="onDark">{eyebrow}</Eyebrow>
            </Reveal>
            <Reveal immediate delay={0.08}>
              <h1 className="mt-6 max-w-[22ch] text-4xl leading-[1.04] font-light tracking-[-0.025em] text-balance">
                {title}
              </h1>
            </Reveal>
            <Reveal immediate delay={0.16}>
              <p className="mt-7 max-w-[54ch] text-base text-on-panel/70">{lead}</p>
            </Reveal>
          </div>

          {meta?.length ? (
            /* Two up on a phone, one column at lg. Stacked in one, four rows of
               label-and-value pushed the headline off a short screen on its
               own. */
            <Reveal immediate delay={0.24}>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/12 pt-6 lg:grid-cols-1 lg:gap-y-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                {meta.map((row) => (
                  <li key={row.label}>
                    <p className="font-mono text-[0.6875rem] tracking-caps text-on-panel/55 uppercase">
                      {row.label}
                    </p>
                    <p className="mt-1.5 text-sm text-on-panel">{row.value}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
