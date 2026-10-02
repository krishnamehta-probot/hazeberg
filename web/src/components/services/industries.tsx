import { Section } from "@/components/ui/section";
import type { ServiceFeature } from "@/lib/service-content";

import { IndustryGrid } from "./industry-grid";
import { ServiceHead } from "./service-head";

type Data = Extract<ServiceFeature, { kind: "industries" }>;

/**
 * Industries — HCM's own section. Six workforces on the same platform, and what
 * HCM has to get right in each.
 *
 * All six are on the page at once, every word of them, as a bento grid of
 * equal cards. The section's point is a comparison — one product, six very
 * different groups of people — and a comparison wants its terms side by side.
 * The previous form handed the sectors over one at a time behind a row of
 * narrow panels, which read as a template trick: names set sideways, five
 * empty columns and a ghost of an icon, with five sixths of the copy hidden
 * at any moment.
 *
 * What carries the difference between workforces is each card's drawing, not
 * its layout. The six cards are identical in build, so the eye compares what
 * differs: a small animated motif of the one thing HCM must get right for that
 * workforce — three roles locking into one system, shifts turning around a day,
 * approvals stamped down a trail, a seasonal surge, growth fanning into
 * countries, a person moving between teams (`industry-motifs.tsx`).
 *
 * The head is the module page's band (`service-head.tsx`) — title left, the
 * paragraph right, on one baseline — because the grid under it is full width,
 * and a head in a narrow column would leave a screen of empty surface beside
 * it.
 *
 * Server-rendered; only the grid is a client component.
 */
export function Industries({ data }: { data: Data }) {
  return (
    <Section ground="surface" id={data.id}>
      <ServiceHead eyebrow={data.eyebrow} title={data.title} body={data.body} />

      <IndustryGrid items={data.items} />
    </Section>
  );
}
