import { Section } from "@/components/ui/section";
import type { ServiceFeature } from "@/lib/service-content";

import { ServiceHead } from "./service-head";
import { UsesGrid } from "./uses-grid";

type Data = Extract<ServiceFeature, { kind: "uses" }>;

/**
 * Where Extend fits — Extend's own section, in the slot Industries takes on
 * HCM (the client's document: "six cards in a three-by-two grid, each with
 * the app type and one example line").
 *
 * So it is Industries' bento, card for card: the same equal cards, the same
 * inset well with a small animated drawing, the same index, hairline and
 * glyph — the two module pages are one hand. What the drawings say is
 * Extend's. The section's sentence is that a good candidate is "work that
 * depends on Workday data but happens somewhere else", and every drawing is
 * that sentence: something loose and dashed outside (an email, a spreadsheet
 * row, a thank-you note, a slide, a paper credential, a chat) comes in through
 * one door on Workday's edge and becomes a native thing inside a solid frame
 * (a task in the inbox, a register row with a status, a badge on the worker
 * record, live capacity, a credential matched to the record, leave on the
 * calendar), with the amber marking what moved (`uses-motifs.tsx`).
 *
 * The six tell it in turn — a relay round the grid in reading order, with a
 * visible timer on the card whose turn it is (`uses-grid.tsx`) — and each one
 * rests on its ending, the work already inside, which is also the still
 * frame reduced motion gets.
 *
 * The head is the module page's band (`service-head.tsx`), as on Industries:
 * the grid under it is full width.
 *
 * Server-rendered; only the grid is a client component.
 */
export function ExtendUses({ data }: { data: Data }) {
  return (
    <Section ground="surface" id={data.id}>
      <ServiceHead eyebrow={data.eyebrow} title={data.title} body={data.body} />

      <UsesGrid items={data.items} />
    </Section>
  );
}
