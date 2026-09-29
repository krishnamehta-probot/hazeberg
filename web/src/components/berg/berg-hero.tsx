import { Search } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { CtaPill } from "@/components/ui/cta-pill";
import { Eyebrow } from "@/components/ui/section";
import { BERG } from "@/lib/berg-content";

/**
 * Berg's opener — product first, and the only light hero on the site.
 *
 * Two earlier versions were wrong, in the same way twice. The first reused
 * `PageHero`, so a product opened exactly like the three service pages. The
 * second replaced it with an animated node-and-wire network — which is the most
 * over-used shape in software marketing. Connected dots is what every AI landing
 * page in the world opens with, and it says nothing specific about this product.
 *
 * So this shows the product instead of a metaphor for it. The panel on the right
 * is Berg's requirement feed: the tab pair and the example row are the ones Berg
 * publishes on its own marketing site — "Workday Functional Consultant
 * (HCM/Finance)", with the Active, Urgent and Manpower chips — rendered as real
 * markup rather than as a picture. The feed says in its own foot that it is an
 * illustrative view, because it is representative and not a capture of a live
 * tenant.
 *
 * **Light ground, deliberately.** Every other page here opens on the dark void. A
 * product page that opens white with one crisp surface floating on it reads as
 * software; the same page on a dark band with a glow reads as another chapter of
 * the consultancy. `.map-ground` supplies two very weak brand washes rather than
 * flat white, so the panel has something to be lit by.
 *
 * Consequences of going light, both handled:
 *   - **no `data-nav-dark`.** The header stays in its dark-type state, which is
 *     what belongs over a white ground.
 *   - **the accent is blue, not amber.** Yellow measures 1.65:1 on white and is a
 *     fill only here, so the headline's second half takes `--primary`. Amber does
 *     still appear — as the Urgent chip's fill, near-black on it at 10.8:1, which
 *     is exactly what that colour is for.
 *
 * Nothing animates except the reveals. A product surface that pulses is a product
 * surface nobody reads.
 */

/**
 * The feed's rows. The FIRST is Berg's own published example, verbatim from their
 * marketing site. The other two carry role names that already appear across this
 * site; they exist so the feed reads as a list rather than as a single card, and
 * they make no claim about a real posting.
 */
const FEED = [
  {
    role: "Workday Functional Consultant (HCM/Finance)",
    meta: "Posted by a Workday customer",
    status: "Active",
    chips: ["Urgent", "Manpower"],
    featured: true,
  },
  {
    role: "Workday Integrations Consultant",
    meta: "Consulting firm · Remote",
    status: "Active",
    chips: ["Studio", "EIB"],
    featured: false,
  },
  {
    role: "Workday Payroll Lead",
    meta: "Consulting firm · APAC",
    status: "Active",
    chips: ["Payroll"],
    featured: false,
  },
] as const;

function Chip({ tone, children }: { tone: "status" | "urgent" | "quiet"; children: string }) {
  const skin =
    tone === "urgent"
      ? /* The one place amber is a fill on this page. Near-black on #FEC00F is
           10.8:1 — the only way yellow is ever allowed to carry a word. */
        "bg-accent text-accent-ink"
      : tone === "status"
        ? "bg-primary/10 text-primary"
        : "bg-surface-2 text-ink-muted";
  return (
    <span className={`rounded-pill px-2.5 py-1 text-[0.6875rem] font-medium ${skin}`}>
      {children}
    </span>
  );
}

/**
 * The product surface.
 *
 * Straight, not tilted: a rotated panel is a stock-illustration trick and it
 * makes the type inside it harder to read for nothing in return. No fake browser
 * chrome either — three coloured dots at the top of a card is a picture of a
 * window, and it says nothing about the software in it.
 */
function Feed() {
  return (
    <div className="overflow-hidden rounded-2xl bg-canvas shadow-2xl shadow-ink/10 ring-1 ring-border">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
        <p className="text-sm font-medium text-ink">Requirements</p>
        <span
          aria-hidden
          className="flex items-center gap-2 rounded-md bg-surface px-3 py-1.5 text-xs text-ink-subtle"
        >
          <Search className="size-3.5" strokeWidth={1.8} />
          Search the network
        </span>
      </div>

      {/* The tab pair Berg shows on its own site. */}
      <div className="flex items-center gap-1 px-5 pt-4">
        <span className="rounded-md bg-ink px-3 py-1.5 text-xs font-medium text-on-panel">
          Published
        </span>
        <span className="rounded-md px-3 py-1.5 text-xs font-medium text-ink-subtle">Proposed</span>
      </div>

      <ul className="space-y-3 p-5">
        {FEED.map((row) => (
          <li
            key={row.role}
            className={`rounded-lg p-4 ring-1 ${
              row.featured ? "bg-primary/5 ring-primary/30" : "ring-border"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm leading-snug font-medium text-ink">{row.role}</p>
                <p className="mt-1 text-xs text-ink-subtle">{row.meta}</p>
              </div>
              <Chip tone="status">{row.status}</Chip>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {row.chips.map((chip) => (
                <Chip key={chip} tone={chip === "Urgent" ? "urgent" : "quiet"}>
                  {chip}
                </Chip>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <p className="border-t border-border px-5 py-3 text-xs text-ink-subtle">
        Illustrative view of the Berg requirement feed.
      </p>
    </div>
  );
}

export function BergHero() {
  return (
    <section className="map-ground relative isolate overflow-hidden">
      <div className="shell pt-[calc(var(--header-h)+5rem)] pb-[calc(var(--section-y)+1rem)] lg:pt-[calc(var(--header-h)+6.5rem)]">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-20">
          <div>
            <Reveal immediate>
              <Eyebrow>{BERG.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal immediate delay={0.08}>
              <h1 className="mt-6 max-w-[15ch] text-4xl leading-[1.04] font-light tracking-[-0.025em] text-balance text-ink">
                {BERG.titleLead}
                <span className="text-primary">{BERG.titleAccent}</span>
              </h1>
            </Reveal>
            <Reveal immediate delay={0.16}>
              <p className="mt-7 max-w-[50ch] text-base text-ink-muted">{BERG.lead}</p>
            </Reveal>
            <Reveal immediate delay={0.24}>
              {/* Two actions, one hierarchy. Berg's own page runs two filled
                  buttons side by side, which is two primary actions — and two
                  primary actions is none. */}
              {/* The second action is the WHITE pill, not a bare text link. A
                  text link beside a 56px button is not a second action, it is a
                  footnote — and on a product page the enquiry route is a real
                  choice, not an afterthought. Same shape, inverted fill: the
                  hierarchy is carried by the fill rather than by one of them
                  barely being a control at all.

                  White reads on this ground because the rim is lit at rest —
                  `.spec`'s conic gradient is not gated on hover. */}
              <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-4">
                <CtaPill href={BERG.cta.href} external>
                  {BERG.cta.label}
                </CtaPill>
                <CtaPill href={BERG.ctaSecondary.href} tone="light">
                  {BERG.ctaSecondary.label}
                </CtaPill>
              </div>
            </Reveal>

            {/* The three groups as a fact, not a device. Their own strapline, then
                the three names — the page says who it is for before anyone has to
                scroll to find out. */}
            <Reveal immediate delay={0.32}>
              <div className="mt-14 border-t border-border pt-7">
                <p className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
                  {BERG.strapline}
                </p>
                <ul className="mt-4 flex flex-wrap gap-x-7 gap-y-3">
                  {BERG.roles.items.map((role, i) => (
                    <li key={role.key} className="flex items-center gap-2.5 text-sm text-ink">
                      <span
                        aria-hidden
                        className={`size-1.5 rounded-pill ${i === 1 ? "bg-accent" : "bg-primary"}`}
                      />
                      {role.title.replace("For ", "")}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal immediate delay={0.2}>
            <Feed />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
