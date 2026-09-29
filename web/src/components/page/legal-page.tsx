import { Reveal } from "@/components/motion/reveal";
import { CrossLink } from "@/components/page/cross-link";
import { AnchorRail } from "@/components/page/anchor-rail";
import { PageHero } from "@/components/page/page-hero";
import { Section } from "@/components/ui/section";
import type { LegalDoc } from "@/lib/legal-content";

/**
 * The renderer both legal pages share.
 *
 * A legal page is the one page on a site that people arrive at looking for a
 * specific clause, not to read it through. So it is built for finding rather
 * than for browsing:
 *
 *   - a **numbered contents list**, sticky on the left at lg, that links to each
 *     section. Every heading carries an `id`, so any clause can be linked to
 *     directly and quoted in an email
 *   - **one measure, and it is narrow.** The prose caps at 68 characters, which
 *     is the width long text is actually read at — full shell width would be
 *     140 characters a line and unreadable
 *   - **`scroll-mt` on every heading**, because the header floats: without it a
 *     jump link parks the heading underneath the nav bar
 *
 * The two pages differ only in their content object, which is why this exists at
 * all — two hand-built legal pages would drift apart at the first amendment.
 *
 * The prose is styled here rather than through a typography plugin: there are
 * exactly two block types in these documents, paragraphs and lists, and pulling
 * in a plugin to style two elements would add a dependency and a second set of
 * type rules competing with the design system's own.
 */
export function LegalPage({ doc, other }: { doc: LegalDoc; other: { label: string; href: string } }) {
  return (
    <>
      <PageHero
        eyebrow={doc.eyebrow}
        title={doc.title}
        lead={doc.lead}
        meta={[
          { label: "Last updated", value: doc.updated },
          { label: "Applies to", value: "hazebergconsulting.com" },
        ]}
      />

      <Section ground="canvas">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-16">
          {/* -- contents ------------------------------------------------- */}
          {/* Lives in its own client component because it tracks the scroll —
              see `anchor-rail.tsx`, shared with `/what-we-do`. Everything else
              on this page is static and stays on the server. */}
          <AnchorRail sections={doc.sections} />

          {/* -- the document --------------------------------------------- */}
          <div className="max-w-[68ch]">
            {/* The separation lives on the REVEAL, not on the section inside it.
                It was on the section, with `first:border-t-0 first:pt-0` to skip
                the top of the document — and every section is the only child of
                its own Reveal wrapper, so every section matched `:first-child`.
                The rule and the padding were switched off on all eleven, which
                is why the document ran together: section 9 started one paragraph
                gap after section 8 ended, with nothing between them.

                The Reveals ARE siblings, so `first:` means what it says here.

                `[&+*]` is gone with it. Sibling margins collapse differently
                once a wrapper is involved; `mt` on the element that actually has
                neighbours is the version with nothing to reason about. */}
            {doc.sections.map((section, i) => (
              <Reveal
                key={section.id}
                delay={i === 0 ? 0 : 0.04}
                className="mt-12 border-t border-border pt-12 first:mt-0 first:border-t-0 first:pt-0"
              >
                <section>
                  <h2
                    id={section.id}
                    className="scroll-mt-[calc(var(--header-h)+2rem)] text-xl leading-snug font-medium text-ink"
                  >
                    {section.heading}
                  </h2>
                  <div className="mt-5 space-y-4">
                    {section.blocks.map((block, b) =>
                      block.kind === "p" ? (
                        <p key={b} className="text-sm leading-relaxed text-ink-muted">
                          {block.text}
                        </p>
                      ) : (
                        <ul key={b} className="space-y-3">
                          {block.items.map((item) => (
                            <li
                              key={item}
                              className="flex gap-3.5 text-sm leading-relaxed text-ink-muted"
                            >
                              {/* A rule, not a bullet glyph. The marker is set on
                                  the first line's optical centre and takes the
                                  brand blue, which is the same treatment every
                                  other list on the site gets. */}
                              <span
                                aria-hidden
                                className="mt-[0.5rem] h-px w-3 shrink-0 bg-primary"
                              />
                              <span className="min-w-0">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ),
                    )}
                  </div>
                </section>
              </Reveal>
            ))}

            <Reveal delay={0.06}>
              <p className="mt-12 border-t border-border pt-7 text-xs text-ink-subtle">
                Last updated {doc.updated}.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      <CrossLink
        eyebrow="Also on this site"
        title={other.label}
        body="The other half of the legal pair."
        href={other.href}
      />
    </>
  );
}
