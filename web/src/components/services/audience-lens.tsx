import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import type { WrittenService } from "@/lib/service-content";

import { AudienceTabs } from "./audience-tabs";
import { ServiceHead } from "./service-head";

type Data = WrittenService["audiences"];

/**
 * Who it's built for — three audiences, one lens.
 *
 * Every module document answers the same question three times: what changes
 * for this group. Three columns of four would print all twelve at once and ask
 * the reader to find their own row; the section is more useful as a question
 * the reader answers. So the groups are a selector and the four changes sit in
 * one dark panel beside it — the lens — which shows one group at a time.
 *
 * The head is the module page's band (`service-head.tsx`), given an id here
 * because the tablist is labelled by it.
 *
 * Server-rendered; only the selector and the lens (`audience-tabs.tsx`) are
 * client code. White (`canvas`) between the capabilities' `surface` and How we
 * engage's ink, so no two neighbours share a ground.
 */
export function AudienceLens({ data }: { data: Data }) {
  const headingId = `${data.id}-title`;
  return (
    <Section ground="canvas" id={data.id}>
      <ServiceHead eyebrow={data.eyebrow} title={data.title} body={data.body} titleId={headingId} />

      <Reveal className="mt-12 lg:mt-16">
        <AudienceTabs groups={data.groups} idBase={data.id} labelledBy={headingId} />
      </Reveal>
    </Section>
  );
}
