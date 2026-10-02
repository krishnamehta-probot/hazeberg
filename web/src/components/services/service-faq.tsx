import { Section, SectionHead } from "@/components/ui/section";
import type { WrittenService } from "@/lib/service-content";

import { FaqAccordion } from "./faq-accordion";

type Data = WrittenService["faq"];

/**
 * Questions — five, one open at a time, and the same five for search engines.
 *
 * The page is the record of what the client says about the module, so the
 * questions are marked up as an FAQPage straight from the document's own
 * words: built from `data.items` here on the server, never retyped, so the
 * structured data cannot drift from what the reader sees. `<` is escaped in
 * the payload, which is the standard guard against a string closing the
 * script tag early.
 *
 * The head is the shared `SectionHead`, passed into the accordion as a slot so
 * it stays server-rendered while the column it sits in holds still beside the
 * questions on a desktop (`faq-accordion.tsx`).
 */
export function ServiceFaq({ data }: { data: Data }) {
  const structured = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <Section ground="surface" id={data.id}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }}
      />
      <FaqAccordion
        items={data.items}
        idBase={data.id}
        head={
          <SectionHead align="start" eyebrow={data.eyebrow} title={data.title} titleMax="max-w-[18ch]" />
        }
      />
    </Section>
  );
}
