import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { AnchorRail } from "@/components/page/anchor-rail";
import { CrossLink } from "@/components/page/cross-link";
import { PageHero } from "@/components/page/page-hero";
import { CtaPill } from "@/components/ui/cta-pill";
import { Eyebrow, Section } from "@/components/ui/section";
import { WHAT_WE_DO, type Engagement } from "@/lib/what-we-do-content";

export const metadata = {
  title: "What we do",
  description:
    "Eight Workday engagement models covering the whole lifecycle — implementation, payroll transformation, integration modernization, health check, optimization, AMS, release management and cost optimization.",
};

/**
 * What we do — DRAFT.
 *
 * Eight engagement models on one page, on the anchors `navigation.ts` already
 * links. The sitemap writes them short; the nav writes them long and those links
 * ship in the header today, so the nav wins and the sitemap is corrected. Same
 * call as `/about`.
 *
 * **The layout is chosen for how this page is arrived at.** Almost nobody opens
 * `/what-we-do` and reads it top to bottom — they click "Release Management" in
 * the nav and land two thirds of the way down. So the page is built around a
 * sticky rail of its own eight sections that tracks the scroll: whichever way
 * you got here, the rail says where you are and what else is on the page. It is
 * the same component the legal pages use, which is why it exists as
 * `components/page/anchor-rail.tsx` rather than twice.
 *
 * Grouped "Get live" / "Stay ahead" — the nav's own two columns, in its order.
 * That split is the page's argument in four words: this half is for a tenant you
 * are building, that half is for a tenant you are running. Eight equal blocks
 * with no grouping is a list; two groups of four is a decision.
 *
 * **Roughly seven eighths of the prose is placeholder** and every line of it is
 * marked — see `lib/what-we-do-content.ts`. Real: the eight names, the eight
 * one-line descriptions (live in the nav today), the grouping, the figures, and
 * the AMS paragraph, which is the client's own copy from the home page. The
 * rest is the writing job, and it is the same shape eight times — which is
 * exactly why the shape is settled first.
 */

function Block({ item }: { item: Engagement }) {
  return (
    <Reveal
      as="section"
      className="border-t border-border pt-10 first:border-t-0 first:pt-0 [&:not(:first-child)]:mt-10"
    >
      {/* The heading carries the id, so a jump link lands on the words rather
          than on the rule above them. `scroll-mt` clears the floating header. */}
      <div className="flex items-baseline gap-4">
        <p className="font-mono text-xs tracking-caps text-ink-subtle">{item.n}</p>
        <h2
          id={item.id}
          className="scroll-mt-[calc(var(--header-h)+2rem)] text-2xl leading-tight font-light tracking-[-0.025em] text-balance text-ink"
        >
          {item.title}
        </h2>
      </div>

      <p className="mt-4 max-w-[52ch] text-base font-medium text-balance text-ink">{item.lede}</p>
      <p className="mt-4 max-w-[62ch] text-sm text-ink-muted">{item.body}</p>

      <div className="mt-7 grid gap-6 rounded-2xl bg-canvas p-6 ring-1 ring-border sm:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] sm:gap-10 sm:p-7">
        <div>
          <p className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
            What it covers
          </p>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 sm:gap-x-8">
            {item.covers.map((line) => (
              <li key={line} className="flex gap-3 text-sm text-ink-muted">
                <span aria-hidden className="mt-[0.5rem] h-px w-3 shrink-0 bg-primary" />
                <span className="min-w-0">{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border pt-5 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
          <p className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
            Best when
          </p>
          <p className="mt-3 text-sm text-ink">{item.bestWhen}</p>

          {/* Only rendered where a real route exists. An engagement model and a
              module page answer two different questions — "what kind of work"
              and "which part of Workday" — and this is the one place on the site
              where the two meet. */}
          {item.related ? (
            <Link
              href={item.related.href}
              className="group/r mt-6 inline-flex min-h-11 items-center gap-2.5 text-sm font-medium text-primary"
            >
              {item.related.label}
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform dur-base ease-brand group-hover/r:translate-x-0.5 group-hover/r:-translate-y-0.5"
                strokeWidth={2}
              />
            </Link>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
}

export default function Page() {
  const { eyebrow, titleLead, titleAccent, lead, leadSecond, meta, items, groups, railLabel } =
    WHAT_WE_DO;

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={
          <>
            {titleLead}
            <span className="text-accent">{titleAccent}</span>
          </>
        }
        lead={lead}
        leadSecond={leadSecond}
        meta={[...meta]}
      />

      <Section ground="surface">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-16">
          <AnchorRail
            label={railLabel}
            sections={items.map((item) => ({ id: item.id, heading: item.title }))}
          />

          <div className="min-w-0">
            {groups.map((group, g) => (
              <div key={group.name} className={g === 0 ? "" : "mt-16"}>
                {/* The group header is a rule with a label on it, not another
                    heading level — eight h2s under two h2s reads as sixteen
                    sections to a screen reader. */}
                <Reveal>
                  <div className="flex flex-col gap-1.5 border-b border-border-strong pb-5">
                    <p className="font-mono text-[0.6875rem] tracking-caps text-primary uppercase">
                      {group.name}
                    </p>
                    <p className="max-w-[48ch] text-sm text-ink-muted">{group.body}</p>
                  </div>
                </Reveal>

                <div className="mt-10">
                  {items
                    .filter((item) => item.group === group.name)
                    .map((item) => (
                      <Block key={item.id} item={item} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section ground="ink">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <div>
            <Eyebrow tone="panel">{WHAT_WE_DO.closing.eyebrow}</Eyebrow>
            <Reveal>
              <h2 className="mt-5 max-w-[18ch] text-3xl leading-[1.08] font-light tracking-[-0.03em] text-balance text-on-panel">
                {WHAT_WE_DO.closing.title}
              </h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mt-5 max-w-[52ch] text-base text-on-panel/70">
                {WHAT_WE_DO.closing.body}
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <CtaPill href={WHAT_WE_DO.closing.cta.href} tone="light">
              {WHAT_WE_DO.closing.cta.label}
            </CtaPill>
          </Reveal>
        </div>
      </Section>

      <CrossLink {...WHAT_WE_DO.cross} />
    </>
  );
}
