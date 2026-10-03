import { Section, SectionHead } from "@/components/ui/section";
import type { ABOUT } from "@/lib/about-content";
import { PHOTOS } from "@/lib/about-photos";

import { LifeChapters, type LifeCell, type LifeChapter } from "./life-chapters";
import { LifeMotto } from "./life-motto";

type Data = (typeof ABOUT)["life"];
type Chapter = Data["chapters"][number];

/** A chapter's sheet: a cell for every one of its photographs, keyed by the
    photograph, and the cell its title card takes. */
type Sheet<C extends Chapter> = { frames: Record<C["photos"][number], LifeCell>; slate: LifeCell };

/**
 * The three sheets, on a 12 × 6 grid of square units (the box is 2:1).
 *
 * Laid out from the photographs' own shapes, so nothing is cropped beyond
 * what the gaps take: a 3:2 frame is 6 × 4 or 3 × 2 units, a 3:4 portrait
 * 3 × 4, the 2025 line-up (4:3) 8 × 6, and its portraits 2 × 3 — the one
 * real cut: a ninth of their width by the units, and a seventh once the gaps
 * are counted (measured 13.6–14.5% from 768 to 1920; every other print loses
 * 0–2.5% to the gaps). Each chapter opens on its widest frame at the
 * top left, as the content orders it, and the cells follow the content's
 * order in reading order, so Tab goes round a sheet the way the eye does.
 * The title card takes the cell the photographs leave:
 *
 *   Offsite 2026                Offsite 2025                Team recognition
 *   ┌───────────┬─────┬─────┐   ┌───────────────┬───┬───┐   ┌───────────┬─────┬─────┐
 *   │           │ 06  │ 01  │   │               │04 │02 │   │           │ in  │ na  │
 *   │    05     ├─────┼─────┤   │      01       ├───┼───┤   │   team    ├─────┼─────┤
 *   │           │ 04  │ 07  │   │               │03 │▒▒▒│   │           │ ra  │ vi  │
 *   ├─────┬─────┼─────┤     │   └───────────────┴───┴───┘   ├───────────┼─────┼─────┤
 *   │▒▒▒▒▒│ 03  │ 02  │     │                               │▒▒▒▒▒▒▒▒▒▒▒│ m2  │ m1  │
 *   └─────┴─────┴─────┴─────┘                               └───────────┴─────┴─────┘
 *
 *   (▒ the title card; 2025's rows are three units deep, the others' two)
 *
 * Typed against the content, so a photograph added to a chapter in
 * `about-content.ts` without a cell here is a type error, not a hole.
 */
const SHEETS: { [K in Chapter["key"]]: Sheet<Extract<Chapter, { key: K }>> } = {
  "offsite-2026": {
    frames: {
      "offsite-2026-05": [1, 1, 6, 4],
      "offsite-2026-06": [7, 1, 3, 2],
      "offsite-2026-01": [10, 1, 3, 2],
      "offsite-2026-04": [7, 3, 3, 2],
      "offsite-2026-07": [10, 3, 3, 4],
      "offsite-2026-03": [4, 5, 3, 2],
      "offsite-2026-02": [7, 5, 3, 2],
    },
    slate: [1, 5, 3, 2],
  },
  "offsite-2025": {
    frames: {
      "offsite-2025-01": [1, 1, 8, 6],
      "offsite-2025-04": [9, 1, 2, 3],
      "offsite-2025-02": [11, 1, 2, 3],
      "offsite-2025-03": [9, 4, 2, 3],
    },
    slate: [11, 4, 2, 3],
  },
  "team-recognition": {
    frames: {
      "recognition-team-trophies": [1, 1, 6, 4],
      "recognition-indhu": [7, 1, 3, 2],
      "recognition-namitha": [10, 1, 3, 2],
      "recognition-rajesh": [7, 3, 3, 2],
      "recognition-vignesh": [10, 3, 3, 2],
      "recognition-medals-02": [7, 5, 3, 2],
      "recognition-medals-01": [10, 5, 3, 2],
    },
    slate: [1, 5, 6, 2],
  },
};

/**
 * A print's `sizes`, from its cell and its proportions:
 *
 *   from 1320px  its share of the shell's widest content box, 1256px
 *                (`--container-shell` less two 2rem gutters)
 *   from md      its share of the window less those gutters
 *   below md     the phone strip's: its height, `min(15rem, 56vw)`, times
 *                its ratio — 15rem until 429px, 56vw below
 *
 * Every `vw` sits inside a `calc()` on purpose. next/image builds the srcset
 * from the smallest bare `NNvw` in `sizes` (anything under it is dropped), so
 * a bare `84vw` would cut the 256 and 384 candidates and a 300px print on a
 * desktop would fetch 640.
 */
function sizesFor([, , cols]: LifeCell, ar: number) {
  const share = cols / 12;
  return [
    `(min-width: 1320px) ${Math.round(1256 * share)}px`,
    `(min-width: 768px) calc((100vw - 4rem) * ${+share.toFixed(4)})`,
    `(min-width: 429px) ${Math.round(240 * ar)}px`,
    `calc(${+(56 * ar).toFixed(2)}vw)`,
  ].join(", ");
}

/**
 * Life at Hazeberg — the people, after the paperwork. The page's warmest
 * moment, and its only photographs of the whole team.
 *
 * The owner asked for three things (change list, 2026-10-02): the 2025 and
 * 2026 offsites, the team's recognition photographs, and two lines. The
 * section is built as the album those make:
 *
 *   1. The head. The owner's first line is the heading and the second is the
 *      body, on the left; the album's three chapters, named after the
 *      owner's own folders, as tabs on the right from lg.
 *   2. The sheet. The open chapter's photographs dealt onto the ground as a
 *      collage, each print numbered in its corner and opening full size;
 *      the chapter's title card fills the one cell they leave
 *      (`life-chapters.tsx`, `life-lightbox.tsx`).
 *   3. The answer. The owner's motto set as three beats, each a size up from
 *      the last (`life-motto.tsx`).
 *
 * `ink` ground, between Meet the team on canvas and Recognition on surface,
 * with a light of its own (`.life-glow`): the page's blue off the top left,
 * where the head sits, and a low tungsten warmth under the photographs — the
 * one dark band that earns it by being warm. `data-nav-dark` is on a wrapper,
 * since `Section` takes no attributes (as in How we're built). The content
 * sits above the ground's grain, so the photographs are not printed through
 * it.
 *
 * Server component: the photographs are resolved here — the content's keys
 * against `PHOTOS`, each with its cell and its `sizes` — so every photograph
 * of every chapter, with its alt text, is in the server's HTML, and the
 * client bundle never carries the photo table.
 */
export function LifeAtHazeberg({ data }: { data: Data }) {
  const chapters: LifeChapter[] = data.chapters.map((c) => {
    const sheet: { frames: Record<string, LifeCell>; slate: LifeCell } = SHEETS[c.key];
    return {
      key: c.key,
      label: c.label,
      slate: sheet.slate,
      frames: c.photos.map((key) => {
        const p = PHOTOS[key];
        const cell = sheet.frames[key];
        return {
          key,
          src: p.src,
          width: p.width,
          height: p.height,
          alt: p.alt,
          blur: p.blur,
          cell,
          sizes: sizesFor(cell, p.width / p.height),
        };
      }),
    };
  });

  return (
    <div data-nav-dark>
      <Section ground="ink" id={data.id}>
        <div aria-hidden className="life-glow pointer-events-none absolute inset-0" />
        <div className="relative z-10">
          <LifeChapters
            chapters={chapters}
            label={data.eyebrow}
            head={
              <SectionHead
                align="start"
                tone="panel"
                eyebrow={data.eyebrow}
                title={data.title}
                body={data.body}
                titleMax="max-w-[18ch]"
              />
            }
          />
          <LifeMotto motto={data.motto} />
        </div>
      </Section>
    </div>
  );
}
