import type { ReactNode } from "react";
import Image from "next/image";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Section, SectionHead } from "@/components/ui/section";
import type { ABOUT } from "@/lib/about-content";
import { PHOTOS, type AboutPhoto } from "@/lib/about-photos";

import { FounderPortrait } from "./founder-portrait";
import { FounderQuote } from "./founder-quote";

type Data = (typeof ABOUT)["founder"];

/** The body's measure. Manrope's `0` is 1.29 times its average character, so
    `ch` here is not a character: 50ch sets 58-68 characters a line (62 on
    average, measured at 768, 1280 and 1440), the 60-68 a long read wants.
    The 56-60ch the rest of the page uses is 72-77 characters, which is fine
    for two paragraphs and tiring for seven. Below about 515px wide the phone's
    own column is the measure. */
const PROSE = "max-w-[50ch] text-base leading-[1.7] font-light text-pretty text-ink-muted lg:text-lg";

/** With scripting off, every inline first frame Motion left in the section is
    lifted: full opacity, no offset, no over-scale, the rule drawn. */
const NO_SCRIPT =
  "noscript:[&_[style*=opacity]]:opacity-100! noscript:[&_[style*=transform]]:transform-none!";

/**
 * The owner's `**…**`, as `<strong>`.
 *
 * Split on the marker and nothing else: even runs are plain, odd runs are the
 * bold. Every run is a string handed to React as a child, so the copy is
 * escaped like any other text and no character in it can become markup — no
 * HTML is parsed, and nothing goes near `dangerouslySetInnerHTML`. A marker
 * with no partner (an odd count) is put back as the two asterisks it was,
 * rather than bolding the rest of the paragraph; an empty pair (`****`) draws
 * nothing rather than an empty `<strong>`.
 *
 * The emphasis is weight and value together — medium in full ink, out of a
 * light gray paragraph — because either alone is too quiet to find on a
 * second read, and a heavier face than medium turns a phrase into a heading.
 */
function emphasis(text: string): ReactNode[] {
  const runs = text.split("**");
  const unpaired = runs.length % 2 === 0;
  return runs.map((run, i) => {
    if (i % 2 === 0) return run;
    if (unpaired && i === runs.length - 1) return `**${run}`;
    if (run === "") return null;
    return (
      <strong key={i} className="font-medium text-ink">
        {run}
      </strong>
    );
  });
}

/**
 * A caption out of the manifest's own alt text, never new words. Each alt
 * opens on his name, which the section has given twice by the time the
 * photographs arrive, so the caption is the rest of the sentence with its
 * first letter raised: "With two guests at a recognition event". An alt that
 * does not open on the name is used whole.
 *
 * So the caption is for the eye only: `aria-hidden`, because it is the alt's
 * own words again, and a screen reader would otherwise read the sentence as
 * the image and then again as the caption. The alt keeps the whole sentence,
 * name included, because it is the one that travels with the picture — saved,
 * shared, or failed to load. And it is a `<p>` beside the image, not a
 * `<figure>`/`<figcaption>`: a figure takes its name from its figcaption, and
 * whether a browser still does so once the figcaption is hidden varies
 * (Chrome drops it; the HTML-AAM mapping and Playwright's snapshot keep it),
 * so a figure here is at best an empty "figure" said around the image and at
 * worst the caption read a second time. Without it, every browser reads the
 * alt once and nothing else.
 */
function caption(alt: string, name: string) {
  const rest = alt.startsWith(`${name} `) ? alt.slice(name.length + 1) : alt;
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}

/** The pair's width from `sm`: Tailwind's `max-w-lg`, and the `sm:gap-4`
    between the two. */
const PAIR_PX = 512;
const PAIR_GAP_PX = 16;

/**
 * The two recognition photographs, as a small pair under the signature.
 *
 * One is 4:3 and the other a little taller than wide, and neither crops well
 * to the other's shape — the first has three people across it, the second a
 * presentation that needs both hands in frame. So neither is cropped: each
 * column is as wide as its photograph's aspect ratio (`fr` from the
 * manifest's own sizes), which makes the two exactly the same height at any
 * width. Their `sizes` come out of the same arithmetic — 512px less the gap,
 * split by those ratios, from sm; the column less the gutters and the 12px
 * gap below it.
 */
function RecognitionPair({ photos, name }: { photos: readonly AboutPhoto[]; name: string }) {
  const ratios = photos.map((p) => p.width / p.height);
  const total = ratios.reduce((a, b) => a + b, 0);
  return (
    /* The grid is a plain div inside the group: `RevealGroup` takes no style,
       and its items inherit its variants through Motion's context, not
       through the DOM, so they stagger the same one level down. */
    <RevealGroup className="mt-12 max-w-lg sm:mt-14" stagger={0.12}>
      <div
        className="grid gap-3 sm:gap-4"
        style={{ gridTemplateColumns: ratios.map((r) => `minmax(0, ${r.toFixed(4)}fr)`).join(" ") }}
      >
        {photos.map((photo, i) => {
          const share = ratios[i] / total;
          return (
            <RevealItem key={photo.src}>
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes={`(min-width: 640px) ${Math.round((PAIR_PX - PAIR_GAP_PX) * share)}px, calc((100vw - 3.25rem) * ${share.toFixed(3)})`}
                placeholder="blur"
                blurDataURL={photo.blur}
                className="h-auto w-full rounded-xl bg-surface-2"
              />
              <p aria-hidden className="mt-3 text-xs leading-snug text-pretty text-ink-subtle sm:text-sm">
                {caption(photo.alt, name)}
              </p>
            </RevealItem>
          );
        })}
      </div>
    </RevealGroup>
  );
}

/**
 * The Founder's note — Sakthi Vignesh, in the owner's words and his own
 * photographs.
 *
 * It is a note, not a bio card, so it is built to be read: one column of text
 * at a real reading measure (`PROSE`), opened by the owner's bold line as the
 * section's heading and closed by his name and title as the signature, with
 * the portrait beside it. From lg the portrait is the sticky column and holds
 * still for the length of the note while the text goes past it — the device
 * How we're built uses for its head, one section further down, and the one
 * this page reaches for whenever a column of reading wants an anchor. It is
 * not a pin; the page keeps its own speed. Below lg there is no sticky
 * column: the portrait, then the note.
 *
 * The columns are 5:7 at lg, where an even split would leave the note
 * narrower than its measure (448px at 1024), and even from xl, where the
 * note's column is its measure and the two halves weigh the same. The
 * portrait holds at `--header-h` plus 2rem (140px on a desktop), the same
 * line How we're built's head holds at, for the note's length less its own
 * height — 1,469px of scroll at 1440 x 900 — and lets go as the last caption
 * passes.
 *
 * The text, in the owner's order and verbatim:
 *
 *   heading     the bold line under his name, as the h2
 *   the note    five paragraphs; the owner's bold kept as emphasis
 *               (`emphasis()`), never as a heavier headline
 *   Beyond      the owner's subheading as a small h3, its bold opening set
 *   Business    large as the pull-quote (`founder-quote.tsx`), then its two
 *               paragraphs
 *   signature   name and title, after the last line
 *   pair        the two recognition photographs, captioned from their alt
 *
 * **The three principles are not drawn.** They are already in the fourth
 * paragraph, in the owner's bold; drawing them again as a list would be the
 * same three phrases a second time on one screen, saying nothing the bold has
 * not. `principles` stays in the content for any page that wants them alone.
 *
 * `canvas` ground: white between Our story's `surface` and How we're built's
 * ink, so the three bands read as three. The body's muted gray measures
 * 7.28:1 on it, and the emphasis in ink 17.9:1.
 *
 * Server-rendered. The portrait's settle and the quote's rule are the only
 * client code of its own (the reveals are the shared ones), and the
 * photographs are served by `next/image` from the web copies in
 * `public/about/` — below the fold, so none is `priority`.
 *
 * **Without JavaScript** every one of those motions would stay on its first
 * frame, which Motion writes into the server HTML as an inline style: the
 * reveals at `opacity: 0`, the rule at `scaleY(0)` — the whole note blank.
 * `NO_SCRIPT` lifts those first frames when scripting is off
 * (`@media (scripting: none)`, Tailwind's `noscript:`), so the note reads
 * whole and settled. With scripting on it matches nothing, so the server HTML
 * and the first client render are untouched.
 */
export function FounderNote({ data }: { data: Data }) {
  const portrait = PHOTOS[data.portrait];
  const recognition = data.recognition.map((key) => PHOTOS[key]);

  return (
    <Section ground="canvas" id={data.id}>
      <div
        className={`grid gap-10 sm:gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 xl:grid-cols-2 xl:gap-24 ${NO_SCRIPT}`}
      >
        {/* -- the portrait, held ------------------------------------------- */}
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
          <Reveal>
            <FounderPortrait
              photo={portrait}
              className="max-w-[28rem] lg:max-h-[calc(100svh-var(--header-h)-4rem)] lg:max-w-none"
            />
          </Reveal>
        </div>

        {/* -- the note ----------------------------------------------------- */}
        <div className="min-w-0">
          <SectionHead align="start" eyebrow={data.eyebrow} title={data.title} titleMax="max-w-[22ch]" />

          <Reveal className="mt-8 space-y-5 lg:mt-10">
            {data.body.map((p) => (
              <p key={p} className={PROSE}>
                {emphasis(p)}
              </p>
            ))}
          </Reveal>

          <Reveal className="mt-14 border-t border-border pt-12 sm:mt-16 lg:mt-20 lg:pt-14">
            <h3 className="font-mono text-xs tracking-caps text-ink-subtle uppercase">
              {data.beyond.eyebrow}
            </h3>
            <FounderQuote text={data.beyond.lead} />
            <div className="mt-8 space-y-5 lg:mt-10">
              {data.beyond.body.map((p) => (
                <p key={p} className={PROSE}>
                  {emphasis(p)}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-12 sm:mt-14">
            <footer className="flex items-center gap-4">
              <span aria-hidden className="h-px w-10 shrink-0 bg-primary" />
              <div>
                <p className="text-xl leading-tight font-light tracking-[-0.02em] text-ink">
                  {data.name}
                </p>
                <p className="mt-2 font-mono text-[0.6875rem] tracking-caps text-primary uppercase">
                  {data.role}
                </p>
              </div>
            </footer>
          </Reveal>

          <RecognitionPair photos={recognition} name={data.name} />
        </div>
      </div>
    </Section>
  );
}
