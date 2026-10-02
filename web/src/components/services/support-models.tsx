import { Section } from "@/components/ui/section";
import type { ServiceFeature } from "@/lib/service-content";

import { ServiceHead } from "./service-head";
import { SupportExplorer } from "./support-explorer";

type Data = Extract<ServiceFeature, { kind: "support" }>;

/**
 * Support models — Workday AMS's own section. Three ways to buy support, and
 * the title's point: the same team behind each.
 *
 * So the section draws the team rather than three icons. Five Hazeberg
 * consultants, the same five throughout, stand in one of three arrangements —
 * round your Workday on a closed ring of service levels; beside a bank of
 * expert time, going out to meet each request; or inside your team's room,
 * under your lead — and choosing a model walks the same five from one to the
 * next. The walk is the claim. The three cards beside the drawing carry every
 * word of each model at all times and are the control that chooses; the
 * drawing is decoration over them (`support-stage.tsx`).
 *
 * The module page's head band (`service-head.tsx`): title left, paragraph
 * right, over a full-width body. The title is the cards' group name.
 * Server-rendered; the explorer is the client component.
 */
export function SupportModels({ data }: { data: Data }) {
  const titleId = `${data.id}-title`;
  return (
    <Section ground="surface" id={data.id}>
      <ServiceHead eyebrow={data.eyebrow} title={data.title} body={data.body} titleId={titleId} />

      <SupportExplorer data={data} labelledBy={titleId} />
    </Section>
  );
}
