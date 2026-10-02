import { Commitments } from "@/components/about/commitments";
import { DeliveryMap } from "@/components/about/delivery-map";
import { Leadership } from "@/components/about/leadership";
import { Recognition } from "@/components/about/recognition";
import { StartConversation } from "@/components/about/start-conversation";
import { Story } from "@/components/about/story";
import { PageHero } from "@/components/page/page-hero";
import { ABOUT } from "@/lib/about-content";

export const metadata = {
  title: "About",
  description: ABOUT.hero.lead,
};

/**
 * About — the client's copy, all six sections of it (supplied 2026-10-02; see
 * `lib/about-content.ts`).
 *
 * **The page's one idea: every claim comes with the thing that keeps it true.**
 * The document says it outright in How we're built — "so you can check it
 * rather than take it on trust" — and the rest of the page is built the same
 * way: the scale in the hero counts itself, the story's two paragraphs light as
 * they are read, each commitment carries a live instrument rather than an
 * adjective (the delivery teams' own clocks, the years, the retention), the
 * leadership is four real practitioners with their certifications, and the
 * recognition shows its paperwork.
 *
 * The sections, and the one movement each is built around:
 *
 *   Hero                  the delivery map: both centres on a dotted world,
 *                         each on its own clock, with arcs out to the regions
 *   Our story             the story lights word by word as it is read; mission
 *                         and vision as a pair; the closing line set large
 *   How we're built       four claims, each verified in front of the reader
 *   Meet the team         four people, one open at a time
 *   Recognition           three marks, each with its paperwork
 *   Start a conversation  the close, with both offices on their own clocks
 *
 * Grounds: void (hero), surface, ink, canvas, surface, ink.
 */
export default function Page() {
  const { hero } = ABOUT;
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={
          <>
            {hero.titleLead}
            <span className="text-accent">{hero.titleAccent}</span>
          </>
        }
        lead={hero.lead}
        cta={hero.cta}
        secondary={hero.secondary}
        titleMax="max-w-[24ch]"
        statsLabel={hero.statsLabel}
        stats={hero.stats}
        aside={<DeliveryMap entities={ABOUT.built.entities} regions={ABOUT.built.regions} />}
        backdrop="glow"
        fit
      />
      <Story data={ABOUT.story} />
      <Commitments data={ABOUT.built} />
      <Leadership data={ABOUT.team} />
      <Recognition data={ABOUT.recognition} />
      <StartConversation data={ABOUT.contact} />
    </>
  );
}
