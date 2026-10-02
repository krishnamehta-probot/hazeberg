import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import type { ABOUT } from "@/lib/about-content";

import { RecognitionCard } from "./recognition-card";

/**
 * Recognition — three marks, each with its paperwork.
 *
 * A recognition section is usually a strip of logos, and a logo on its own is
 * an assertion. Here every mark comes with what it is (the certification, the
 * body that granted it) and, where the client's own certificate says more, the
 * reference on it — the DPIIT certificate number and its expiry, in mono, as a
 * certificate would print it. That is the page's idea applied to the one
 * section that is nothing but claims.
 *
 * The document names this section and gives it no heading, so the name is the
 * heading, set once. The short gradient bar keeps the eyebrow's slot in the
 * rhythm without printing the same word twice — the same device the closing
 * panels use where the client gave no eyebrow.
 *
 * Three across from lg; below it each card lies on its side, plate left and
 * text right, from sm; a phone stacks plate over text.
 */
export function Recognition({ data }: { data: (typeof ABOUT)["recognition"] }) {
  return (
    <Section ground="surface" id={data.id}>
      <Reveal>
        <span aria-hidden className="grad-primary block h-1 w-12 rounded-pill" />
        <h2 className="mt-6 max-w-[24ch] text-3xl leading-[1.08] font-light tracking-[-0.03em] text-balance text-ink">
          {data.title}
        </h2>
      </Reveal>

      {/* The tilt is on the card, not the item: the item's transform belongs
          to the reveal. */}
      <RevealGroup as="ul" className="mt-10 grid gap-4 lg:mt-12 lg:grid-cols-3 lg:gap-5">
        {data.items.map((item, i) => (
          <RevealItem as="li" key={item.key} className="h-full">
            <RecognitionCard item={item} index={i} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
