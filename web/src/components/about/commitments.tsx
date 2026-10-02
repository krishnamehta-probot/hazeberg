import { Section, SectionHead } from "@/components/ui/section";
import type { ABOUT } from "@/lib/about-content";

import { CommitmentList } from "./commitment-list";

type Data = (typeof ABOUT)["built"];

/**
 * How we're built — the page's signature, and its idea in its plainest form:
 * four commitments, and under each one the thing that keeps it true.
 *
 * Every firm's About page makes these four claims. What this one has that
 * theirs do not is the proof, so the section is built around showing it
 * rather than asserting it. Each commitment opens a proof panel with the
 * client's own sentence and an instrument that draws the sentence's figures —
 * the years counted onto a meter, the tenure lit on a scale, the delivery
 * teams' live clocks on a shared dial, the retention closing a ring — and only
 * once the instrument has landed does the panel's check draw itself. The head
 * stays on screen beside them with an index that ticks each one off as its
 * check lands, so the section reads as a list being verified in front of the
 * reader. Nothing pins: the column holds, the page keeps its own speed.
 *
 * The ink ground carries `data-nav-dark` on a wrapper, since `Section` takes
 * no attributes of its own; the wrapper is exactly the section's box, so the
 * header turns white over precisely this band.
 *
 * Server-rendered head; the index, the observers and the instruments are the
 * client part (`commitment-list.tsx`).
 */
export function Commitments({ data }: { data: Data }) {
  return (
    <div data-nav-dark>
      <Section ground="ink" id={data.id}>
        <CommitmentList
          data={data}
          head={
            <SectionHead
              align="start"
              tone="panel"
              eyebrow={data.eyebrow}
              title={data.title}
              body={data.body}
              titleMax="max-w-[16ch]"
            />
          }
        />
      </Section>
    </div>
  );
}
