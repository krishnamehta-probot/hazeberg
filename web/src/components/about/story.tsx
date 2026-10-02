import { ScrollText } from "@/components/motion/scroll-text";
import { Section, SectionHead } from "@/components/ui/section";
import type { ABOUT } from "@/lib/about-content";

import { StoryClosing } from "./story-closing";
import { StoryPanels } from "./story-panels";

type Data = (typeof ABOUT)["story"];

/**
 * Our story — told in three movements, each one bigger than the last.
 *
 *   1. The account. The head on the left; the client's two paragraphs on the
 *      right, lighting word by word as they are read (`ScrollText`). The
 *      story is the one place on the page that asks to be read rather than
 *      scanned, so the scroll is made the reading: the words are all there
 *      from the first frame, at AA in their resting grey, and come up to ink
 *      as the reader reaches them.
 *   2. What it became. Mission and vision as a matched pair of panels, blue
 *      and ink (`story-panels.tsx`).
 *   3. The close. The document's last line, across the width at display size
 *      (`story-closing.tsx`).
 *
 * `surface` ground: `ScrollText`'s resting colour is measured against it
 * (4.75:1), and it is the ground the light hero hands down to.
 *
 * Phones stack all three; the head, the paragraphs, the panels and the close
 * step down a size each, and nothing is wider than the column.
 */
export function Story({ data }: { data: Data }) {
  return (
    <Section ground="surface" id={data.id}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <SectionHead align="start" eyebrow={data.eyebrow} title={data.title} titleMax="max-w-[19ch]" />
        <div className="space-y-5 lg:pt-12">
          {data.body.map((p) => (
            <ScrollText
              key={p}
              text={p}
              className="max-w-[56ch] text-base leading-[1.65] font-light text-pretty lg:text-lg"
            />
          ))}
        </div>
      </div>

      <StoryPanels mission={data.mission} vision={data.vision} />
      <StoryClosing lead={data.closing.lead} accent={data.closing.accent} />
    </Section>
  );
}
