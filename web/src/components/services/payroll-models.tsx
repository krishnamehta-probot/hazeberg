import { Section } from "@/components/ui/section";
import type { ServiceFeature } from "@/lib/service-content";

import { PayrollExplorer } from "./payroll-explorer";
import { ServiceHead } from "./service-head";

type Data = Extract<ServiceFeature, { kind: "models" }>;

/**
 * Your payroll model — Payroll's own section. Two ways to run payroll on
 * Workday, how far each one reaches, and the sentence the document ends on:
 * many organizations run both at once.
 *
 * Two parts, worked by one control. The two models face each other across a
 * seam whose disc is the two of them overlapping — "both", drawn rather than
 * written. Under them, the intro's three figures are drawn as what they are:
 * three rings of reach, one inside the next. Choose a model and the rings it
 * covers light, and its panel lights with them; choose both and everything
 * does, which is the state the section opens in, because that is its title.
 *
 * The module page's head band (`service-head.tsx`): title left, paragraph
 * right, over a full-width body. Server-rendered; the explorer is the client component.
 */
export function PayrollModels({ data }: { data: Data }) {
  return (
    <Section ground="surface" id={data.id}>
      <ServiceHead eyebrow={data.eyebrow} title={data.title} body={data.body} />

      <PayrollExplorer data={data} />
    </Section>
  );
}
