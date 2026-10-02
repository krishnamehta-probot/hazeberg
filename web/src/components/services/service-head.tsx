import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/section";

/**
 * The module page's section head: eyebrow and title on the left, the
 * document's paragraph on the right, on one baseline — the band What we do
 * opens its sections with ("Wherever you are", AI in the flow of work, What we
 * cover), at the same ratio, gap and measures.
 *
 * Every section under the hero opens on a full-width body (a rail, a lens, a
 * track, a gallery, an instrument, a map), and a head stacked in a narrow
 * column over one leaves a screen of empty ground beside it. So the module page
 * has one head, written once: six sections built in parallel had drifted to
 * three gaps, two column ratios and three paragraph measures, which is exactly
 * how a page stops reading as one hand (rule 3).
 *
 * `titleId` is for a section whose heading names something else — the
 * audiences' tablist is labelled by it. `panel` is the ink ground: white type,
 * the amber eyebrow (legal there, 11.97:1).
 *
 * The questions keep the shared `SectionHead` in a sticky column instead,
 * because their body is a column too.
 */
export function ServiceHead({
  eyebrow,
  title,
  body,
  titleId,
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  body: string;
  titleId?: string;
  tone?: "light" | "panel";
}) {
  const panel = tone === "panel";
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
      <Reveal>
        <Eyebrow tone={panel ? "panel" : "subtle"}>{eyebrow}</Eyebrow>
        <h2
          id={titleId}
          className={`mt-5 max-w-[22ch] text-3xl leading-[1.08] font-light tracking-[-0.03em] text-balance ${
            panel ? "text-on-panel" : "text-ink"
          }`}
        >
          {title}
        </h2>
      </Reveal>
      <Reveal delay={0.06}>
        <p className={`max-w-[60ch] text-base ${panel ? "text-on-panel/70" : "text-ink-muted"}`}>{body}</p>
      </Reveal>
    </div>
  );
}
