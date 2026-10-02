import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Section, SectionHead } from "@/components/ui/section";
import type { ABOUT } from "@/lib/about-content";

import { Portrait, ProfileBody, ProfileHeader, pad } from "./leadership-profile";
import { LeadershipRoster } from "./leadership-roster";
import { YearsBlock } from "./leadership-years";

/**
 * Meet the team — four practitioners, and the years and certifications that
 * make "senior practitioners" a fact rather than an adjective.
 *
 * The page's idea is that every claim arrives with the thing that keeps it
 * true. Here the claim is the heading and the proof is the people: each
 * profile ends on the client's own credentials line, the certifications drawn
 * as separate marks, and the years set as a figure on a ruler the whole team
 * shares — so "decades between them" is something the reader can see.
 *
 * From lg it is a roster (`leadership-roster.tsx`): the four names as a
 * vertical tablist, one profile open beside it. Below lg there is no room for
 * a list and a profile side by side, and a tab strip on a phone hides three
 * people behind a tap, so the phone gets the four profiles as cards, all open,
 * one after another — two up from md. Nothing on either is behind a hover.
 *
 * White (`canvas`) between How we're built on ink and Recognition on
 * `surface`. This is the section the hero's "Meet the team" jumps to, which is
 * why the id is the section's own.
 */
export function Leadership({ data }: { data: (typeof ABOUT)["team"] }) {
  const { people } = data;
  const last = people.length - 1;
  return (
    <Section ground="canvas" id={data.id}>
      <SectionHead align="start" eyebrow={data.eyebrow} title={data.title} body={data.body} />

      {/* -- lg and up: the roster ---------------------------------------- */}
      <Reveal className="mt-16 hidden lg:block">
        <LeadershipRoster people={people} label={data.eyebrow} />
      </Reveal>

      {/* -- phones and tablets: every profile, open --------------------- */}
      <RevealGroup as="ul" className="mt-12 grid gap-4 md:grid-cols-2 lg:hidden">
        {people.map((p, i) => (
          <RevealItem as="li" key={p.key}>
            <article className="flex h-full flex-col rounded-2xl bg-surface p-5 ring-1 ring-border sm:p-6">
              <div className="flex items-center gap-4 sm:gap-5">
                <Portrait
                  person={p}
                  n={`${pad(i)} / ${pad(last)}`}
                  compact
                  sizes="96px"
                  className="aspect-square w-20 shrink-0 rounded-xl sm:w-24"
                />
                <div className="min-w-0">
                  <ProfileHeader person={p} size="sm" />
                </div>
              </div>
              <ProfileBody person={p} />
              {/* On the card's floor, so the four rulers line up across a row
                  whatever the bios above them run to. */}
              <div className="mt-auto pt-7">
                <YearsBlock years={p.years} size="sm" delay={0.25} />
              </div>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
