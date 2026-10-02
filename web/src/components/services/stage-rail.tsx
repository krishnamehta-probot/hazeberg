import { Info } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import type { WrittenService } from "@/lib/service-content";

import { ServiceHead } from "./service-head";
import { StagePanel } from "./stage-panel";
import { StageSpy } from "./stage-spy";

/**
 * Capabilities — the module's six stages, read down a rail that fills as you
 * go.
 *
 * Every module document lists its capabilities as six stages of one cycle,
 * and the hero has already drawn that cycle as a ring whose six stations are
 * links to here. So this section is where the ring is unrolled: the same six
 * in the same order, each one a panel of its own, and beside them a rail that
 * says which one you are in and how far round the cycle you have come. The
 * hero's ring is the map; this is the territory.
 *
 * Built in three parts so almost all of it stays on the server:
 *
 *   StageRail   this file: the ground, the page's head band, the footnote
 *   StagePanel  one stage — a server component, styled by attribute
 *   StageSpy    the only client part: what is being read, the sticky rail
 *               on a desktop and the sticky chips on a phone
 *
 * Nothing pins. The rail is a sticky COLUMN, which the project rules separate
 * from a pin on purpose: the page keeps its own speed and the only thing that
 * holds still is the thing telling you where you are.
 *
 * `surface` ground: the panels are white cards on it, and the page has just
 * come out of the void hero.
 */
export function StageRail({ data }: { data: WrittenService["capabilities"] }) {
  const total = data.stages.length;
  return (
    <Section ground="surface" id={data.id}>
      <ServiceHead eyebrow={data.eyebrow} title={data.title} body={data.body} />

      <StageSpy stages={data.stages} label={data.eyebrow}>
        {data.stages.map((stage, i) => (
          <StagePanel key={stage.key} stage={stage} index={i} total={total} />
        ))}

        {/* Financials' line under the stages: something that reads from the
            same books rather than a seventh stage, so it is set as a note. */}
        {data.footnote ? (
          <Reveal className="pt-10 lg:pt-12">
            <p className="flex max-w-[64ch] items-start gap-2.5 text-sm text-ink-subtle">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
              {data.footnote}
            </p>
          </Reveal>
        ) : null}
      </StageSpy>
    </Section>
  );
}
