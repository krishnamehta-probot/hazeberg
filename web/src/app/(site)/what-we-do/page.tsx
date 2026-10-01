import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/page/page-hero";
import { Section, SectionHead } from "@/components/ui/section";
import { CapabilityAccordion } from "@/components/what-we-do/capability-accordion";
import { CapabilityGlobe } from "@/components/what-we-do/capability-globe";
import { HowWeWork } from "@/components/what-we-do/how-we-work";
import { JourneyFinder } from "@/components/what-we-do/journey-finder";
import { LifecycleMap } from "@/components/what-we-do/lifecycle-map";
import { Closing, ExploreServices, WhatWeCover } from "@/components/what-we-do/what-we-cover";
import { WhoWeAre } from "@/components/what-we-do/who-we-are";
import { WHAT_WE_DO } from "@/lib/what-we-do-content";

export const metadata = {
  title: "What we do",
  description: WHAT_WE_DO.hero.lead,
};

/**
 * What we do — the client's copy, all seven sections of it (supplied
 * 2026-10-01; see `lib/what-we-do-content.ts`).
 *
 * **The page's one idea: eight capabilities, and every mention of one is a door
 * to it.** The draft this replaces was eight blocks under a rail, and the
 * client's copy names the same eight over and over — as the answer to each
 * founding problem, as what helps at each stage of a journey, as cells in a
 * lifecycle table. Read as lists, that is the same eight names five times.
 * Built as links, it is five routes into one place: every chip, every bar in
 * the lifecycle map opens its capability in the accordion and carries the
 * reader there. One icon per capability, everywhere, so the thing you clicked
 * is visibly the thing you land on.
 *
 * The sections, and the one movement each is built around:
 *
 *   Who we are           the story holds still while its three challenges
 *                        scroll past; each lights the sentence it answers
 *   Your journey         "find your starting point": four situations to choose
 *                        from, and the choice opens as a path of capabilities
 *                        that ends at the call to action
 *   How it fits          the client's stage table on a time axis, with the
 *                        body's three handovers drawn and lit one at a time
 *   Capabilities         the accordion every link above lands in
 *   How we work          the six steps on a drum that turns with the scroll
 *                        and never runs out: after Optimize, Discover again
 *   What we cover        platform and lifecycle, side by side
 *
 * The hero carries the same eight before the page has said a word about
 * them: in orbit round a globe, each one a door straight to its row.
 *
 * Grounds alternate light and dark so no two neighbours match: the dark
 * breaks fall on the two diagrams (How it fits, How we work) and the close.
 *
 * Photographs: one in Who we are, one per journey. Every one is a comp frame
 * standing in, marked in the content file, the same status as the home page's.
 */

function Journey() {
  const { journey } = WHAT_WE_DO;
  return (
    <Section ground="canvas" id={journey.id}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <SectionHead
          align="start"
          eyebrow={journey.eyebrow}
          title={journey.title}
          titleMax="max-w-[22ch]"
        />
        <Reveal delay={0.06}>
          {journey.body.map((p) => (
            <p key={p} className="mt-4 max-w-[56ch] text-base text-ink-muted first:mt-0">
              {p}
            </p>
          ))}
        </Reveal>
      </div>

      <JourneyFinder data={journey} />
    </Section>
  );
}

function Fits() {
  const { fits } = WHAT_WE_DO;
  return (
    <Section ground="ink" id={fits.id}>
      <SectionHead
        align="start"
        tone="panel"
        eyebrow={fits.eyebrow}
        title={fits.title}
        body={fits.body}
        titleMax="max-w-[20ch]"
      />
      <LifecycleMap data={fits} />
    </Section>
  );
}

export default function Page() {
  const { hero } = WHAT_WE_DO;
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={
          <>
            {hero.titleLead} <span className="text-accent">{hero.titleAccent}</span>
          </>
        }
        lead={hero.lead}
        leadSecond={hero.leadSecond}
        cta={hero.cta}
        secondary={hero.secondary}
        stats={hero.proof.confirmed ? hero.proof.items : undefined}
        backdrop="space"
        fit
        aside={
          <CapabilityGlobe
            items={WHAT_WE_DO.capabilities.items}
            label={WHAT_WE_DO.capabilities.eyebrow}
          />
        }
      />
      <WhoWeAre data={WHAT_WE_DO.who} />
      <Journey />
      <Fits />
      <CapabilityAccordion data={WHAT_WE_DO.capabilities} />
      <HowWeWork data={WHAT_WE_DO.process} />
      <WhatWeCover data={WHAT_WE_DO.cover} />
      <Closing data={WHAT_WE_DO.closing} />
      <ExploreServices text={WHAT_WE_DO.explore.text} />
    </>
  );
}
