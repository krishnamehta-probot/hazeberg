import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";

import { FlowList } from "./flow-list";
import type { FlowData } from "./flow-parts";
import { FlowRing } from "./flow-ring";
import { ServiceHead } from "./service-head";

/**
 * The connections that run both ways. The content type has no field for it, and
 * the documents say it in their own words — Financials' banks are "payment
 * files out, statements in", Integrations' finance is "to and from the ledger"
 * — so the drawing reads it from here: these connectors carry a second stream
 * of packets, in amber, against the section's direction. Keyed by connection,
 * so the order of the list cannot move it. When the CMS grows a direction per
 * connection, this set becomes that field.
 */
const TWO_WAY: ReadonlySet<string> = new Set(["banks", "finance"]);

/**
 * The module pages' "flows" section — Workday Financials (everything arriving
 * in the ledger) and Workday Integrations (Workday feeding everything else).
 *
 * Both documents describe one thing at the centre with traffic round it, so
 * the section draws exactly that: the hub as a glass disc, each connection a
 * node round it, and light travelling the connectors in the direction the data
 * does — in, out, or, on the two connections that do both, both. It is the
 * home page's services wheel and core put to work: the same blue glass in the
 * middle, now with something moving through it.
 *
 * Two drawings of one idea, chosen by the room the panel actually has, not by
 * the screen. From 44rem of panel the connections sit on a ring round the hub,
 * with a card for the one selected (`flow-ring.tsx`); that width is where eight
 * twelve-rem nodes stop colliding, worked through in that file. Under it — any
 * phone, and a tablet held upright — the hub moves to the top and the
 * connections hang off a line down the left, each one tapped open to read
 * (`flow-list.tsx`). A container query makes the switch, so the server sends
 * the right one and nothing swaps after the page loads.
 *
 * The visible drawing only ever shows one connection's line on the ring, and
 * none of the closed ones on the list, so every connection is also written out
 * in full in a visually hidden list.
 *
 * Nothing here pins: the section scrolls at the page's own speed, and the
 * diagram is a thing to point at rather than a thing to scroll through.
 */
export function FlowHub({ data }: { data: FlowData }) {
  const twoWay = data.items.map((item) => TWO_WAY.has(item.key));
  return (
    <Section ground="surface" id={data.id}>
      <ServiceHead eyebrow={data.eyebrow} title={data.title} body={data.body} />

      <Reveal className="mt-12 lg:mt-16">
        <div className="map-ground relative overflow-hidden rounded-2xl ring-1 ring-border">
          <div className="@container relative p-3 sm:p-6 lg:p-8 xl:p-10">
            <div className="@min-[44rem]:hidden">
              <FlowList data={data} twoWay={twoWay} />
            </div>
            <div className="hidden @min-[44rem]:block">
              <FlowRing data={data} twoWay={twoWay} />
            </div>
          </div>
        </div>

        <ul className="sr-only">
          {data.items.map((item) => (
            <li key={item.key}>
              {item.name}
              {item.vendor ? `, ${item.vendor}` : null}. {item.line}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
