import { RevealGroup, RevealItem } from "@/components/motion/reveal";

/**
 * The owner's two distinctions, as a pair of ordinal marks.
 *
 * They are rankings, so they are set the way a ranking is read: the ordinal
 * first and large, the claim beside it at reading size. Set as two more lines of
 * body copy, "3rd Workday exclusive consulting firm from India" reads as a
 * feature; set as a figure it reads as a distinction, which is what it is.
 *
 * They sit in Results, between the heading's figures and the four cards. That
 * is where the page keeps its proof — "20+ Projects. 200+ Integrations. 100%
 * Customer Retention." — and the first card under them, "Pure-Play Workday
 * Expertise", is the very thing they rank. The hero was not an option: it is
 * the first screen at 1280x650 with nothing to spare, and About is a pinned
 * pane whose paragraph is already at the length its label clears the menu bar.
 *
 * **Blue, not amber.** This is a light ground, where #FEC00F measures 1.65:1 as
 * type. The figures are `--primary`, the same blue as the heading's figures
 * line directly above them, so the two read as one set of proof. Manrope light
 * at display size, like every other large figure on the page.
 *
 * Open type on the ground rather than cards: four cards follow immediately, and
 * a fifth and sixth box above them would read as more capabilities. A single
 * hairline between the two is all the structure a pair needs.
 *
 * The content is one sentence per credential, and the split happens here: the
 * leading ordinal ("1st") becomes the figure, and the digits and their ending
 * are set apart so the ending can sit raised, the way a typeset ordinal does.
 * The sentence is still whole in the DOM — each item's text is exactly the
 * owner's line — and a line that does not start with digits is set as plain
 * text rather than guessed at.
 */

/** "1st Workday exclusive…" -> 1 / st / " " / Workday exclusive…
    The space is captured and put back as it came, so the item's text is the
    line character for character, whatever whitespace the editor typed.
    Draft-mode source maps are appended to the END of a string, so they land in
    `rest`, and the preview's click-to-edit still finds the field. */
const ORDINAL = /^(\d+)([^\s\d]*)(\s+)([\s\S]+)$/;

function Credential({ line }: { line: string }) {
  const m = ORDINAL.exec(line);
  if (!m) return <span className="text-base text-ink lg:text-lg">{line}</span>;
  const [, figure, ending, space, rest] = m;
  return (
    <>
      {/* The figure and its ending share ONE line box: "1" is text and "st" is
          an inline span inside the same block. An inline-flex here made each a
          block of its own, and the accessibility tree read the pair as two
          words — "1 st Workday…" — measured in Chromium's snapshot. Inline,
          it is "1st Workday…".
          The raise is the same as before: `align-top` sets the top of the
          ending's solid box on the top of the figure's, and `top-[0.25em]`, a
          quarter of its own size, brings it down to the figure's cap height.
          Not `<sup>`: some screen readers announce "superscript". */}
      <span className="shrink-0 text-4xl leading-none font-light tracking-[-0.03em] whitespace-nowrap text-primary">
        {figure}
        <span className="relative top-[0.25em] ml-[0.06em] align-top text-[0.4em] leading-none tracking-normal">
          {ending}
        </span>
      </span>
      {space}
      <span className="max-w-[17rem] text-base leading-snug text-balance text-ink lg:max-w-[19rem] lg:text-lg">
        {rest}
      </span>
    </>
  );
}

export function Credentials({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    /* `w-fit` and one equal column per item: the pair is as wide as its longer
       item twice over, so the hairline between them lands on the section's
       centre axis, under the centred heading, whichever line is longer. Auto
       columns rather than `grid-cols-2`, so a draft with one line left in it
       sits centred instead of in the left half of an empty pair. Stacked below
       md, left-aligned in a centred block so the two figures line up. */
    <RevealGroup
      as="ul"
      stagger={0.12}
      className="mx-auto mt-12 grid w-fit gap-7 md:auto-cols-fr md:grid-flow-col md:gap-0"
    >
      {items.map((line, i) => (
        <RevealItem
          as="li"
          key={i}
          className="flex items-center gap-4 md:not-first:border-l md:not-first:pl-10 md:not-last:pr-10 lg:gap-5 lg:not-first:pl-12 lg:not-last:pr-12"
        >
          <Credential line={line} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
