import { type ArrayOptions, defineField, type StringRule } from "sanity";

import { LINK_OPTIONS } from "../../lib/site-routes";

/**
 * The field vocabulary every document in this Studio is built from.
 *
 * The guardrails from `CMS-PLAN.md` live here, once, so no schema file can
 * quietly skip them:
 *
 *   - **Two limits on every string.** `soft` is the length the design was
 *     measured at — past it the Studio shows a yellow warning and still lets
 *     you publish, because a line wrapping one word early is a judgement call.
 *     `hard` is where the layout actually breaks — past it the Studio refuses
 *     to publish.
 *
 *     Some of the approved copy already runs past a soft limit and shows its
 *     warning from day one, on purpose — each was measured and is a real
 *     layout fault in the shipped copy, not a false alarm:
 *       - the Impact button (39 > 28: wraps to two lines on phones)
 *       - the About paragraph (449 > 400: its label slides under the menu
 *         bar at 1024x768)
 *       - the Workday Integrations wheel description (154 > 150: four lines
 *         below 1024px, so the pinned column re-centres)
 *       - the "Streamlining Global Workforce Management…" case study title
 *         (40 > 34: three lines at 1024–1200px)
 *   - **Required and too-long are separate rules**, so each shows its own
 *     message: Sanity attaches one `.error()` message to every check in a
 *     chain, which made an emptied field say it was too long.
 *   - **Buttons pick a page, they do not take a URL.** See `lib/site-routes.ts`.
 *   - **No colour, font or spacing controls.** None exist to add.
 *
 * Relative imports only: the Sanity CLI bundles this without Next's `@/` alias.
 */

type Limits = { soft: number; hard: number };

type StringFieldOptions = Limits & {
  name: string;
  title: string;
  description?: string;
  /** Multi-line textarea instead of a single line. */
  rows?: number;
  optional?: boolean;
  /** Extra checks on the value, run as warnings. */
  warn?: (value: string, parent: Record<string, unknown> | undefined) => string | true;
};

const noEdgeSpaces = (value: unknown) =>
  typeof value !== "string" || value === value.trim() || "Remove the space at the start or end.";

/** A string with the soft/hard pair, plus whatever warnings the field needs. */
export function textField({
  name,
  title,
  description,
  rows,
  optional = false,
  soft,
  hard,
  warn,
}: StringFieldOptions) {
  const validation = (rule: StringRule) => {
    const rules = [
      ...(optional ? [] : [rule.required().error("Required — this text is on the page.")]),
      rule.max(hard).error(`Longer than ${hard} characters breaks the layout here.`),
      rule
        .max(soft)
        .warning(`The design was measured at up to ${soft} characters. Past that, check the page before publishing.`),
      rule.custom(noEdgeSpaces).warning(),
    ];
    if (warn) {
      rules.push(
        rule
          .custom((value, context) =>
            typeof value === "string" && value.length > 0
              ? warn(value, context.parent as Record<string, unknown> | undefined)
              : true,
          )
          .warning(),
      );
    }
    return rules;
  };

  return rows
    ? defineField({ name, title, description, type: "text", rows, validation })
    : defineField({ name, title, description, type: "string", validation });
}

/** The small caps label above a section heading. */
export function eyebrowField(description?: string) {
  return textField({
    name: "eyebrow",
    title: "Eyebrow",
    description:
      description ??
      "The small label above the heading. The design sets it in capitals, so type it in normal case.",
    soft: 32,
    hard: 40,
  });
}

/** A page on this site, chosen from a fixed list. */
export function routeField({
  name = "href",
  title = "Goes to",
  description = "Which page the button opens. Pages are chosen from a list so a button can never point at a page that does not exist.",
}: { name?: string; title?: string; description?: string } = {}) {
  return defineField({
    name,
    title,
    type: "string",
    description,
    options: { list: LINK_OPTIONS.map((o) => ({ title: o.title, value: o.value })) },
    validation: (rule) => rule.required(),
  });
}

/** A button: its words, and which page it opens. */
export function linkField({
  name = "cta",
  title = "Button",
  label,
  description,
}: {
  name?: string;
  title?: string;
  label: Limits;
  description?: string;
}) {
  return defineField({
    name,
    title,
    type: "object",
    description,
    options: { collapsible: false },
    fields: [
      textField({
        name: "label",
        title: "Button text",
        description: "Set in capitals by the design.",
        ...label,
      }),
      routeField(),
    ],
    validation: (rule) => rule.required(),
  });
}

/**
 * A photograph. Hotspot is on everywhere, because every photo on this site is
 * cropped by its box and the hotspot is how an editor chooses what survives.
 *
 * `alt` is REQUIRED where the picture carries meaning and OPTIONAL where the
 * design treats it as decoration — a screen reader should not have to hear a
 * description of mood photography the card's own words already cover. v1
 * shipped those images with `alt=""`, and this keeps it.
 *
 * `standIn` is rule 5 for pictures: the comp frames and generated images the
 * design was built with are seeded into the CMS so the page stays as approved,
 * and this flag keeps them listed as needing replacing. It lives on the image,
 * never reaches the page, and only ever warns — a missing photograph must not
 * block publishing a text edit.
 */
export function photoField({
  name,
  title,
  description,
  altRequired,
  optional = false,
}: {
  name: string;
  title: string;
  description: string;
  altRequired: boolean;
  optional?: boolean;
}) {
  return defineField({
    name,
    title,
    type: "image",
    description,
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: altRequired ? "Alternative text" : "Alternative text (optional)",
        type: "string",
        description: altRequired
          ? "What the picture shows, for people who cannot see it. One sentence."
          : "Leave empty: this picture is decorative, and the text beside it already says what it shows. Fill it in only if the picture adds information of its own.",
        validation: (rule) =>
          altRequired
            ? [
                rule.required().error("Describe the picture — screen readers need it."),
                rule.max(160).error("Keep the description under 160 characters."),
              ]
            : rule.max(160).error("Keep the description under 160 characters."),
      }),
      defineField({
        name: "standIn",
        title: "Stand-in photograph",
        type: "boolean",
        initialValue: false,
        description:
          "On while this is a comp or generated picture used to fill the design, not a photograph supplied for the site. Switch it off when you upload the real one.",
        validation: (rule) =>
          rule
            .custom((on) => (on ? "Stand-in photograph — replace with a supplied photograph before launch." : true))
            .warning(),
      }),
    ],
    validation: (rule) => (optional ? rule : rule.required().assetRequired()),
  });
}

/** Photography direction from `PROJECT-RULES.md` rule 8, where editors read it. */
export const PHOTO_DIRECTION =
  "Bright daylight, nobody looking at the camera, photographs rather than renders, and neutral colour — the site's blue and amber do the colouring.";

/**
 * Makes an array fixed-length in the Studio: items can be edited and dragged
 * into a new order, but not added or removed. The layout draws exactly this
 * many. Paired with a `length(n)` rule for anything written through the API.
 */
export const FIXED_ARRAY: ArrayOptions = {
  disableActions: ["add", "addBefore", "addAfter", "remove", "duplicate", "copy"],
};

/** Warns when two strings in a list of strings repeat. */
export function uniqueStrings(label: string) {
  return (items: unknown) => {
    if (!Array.isArray(items)) return true;
    const seen = new Set<string>();
    for (const v of items) {
      if (typeof v !== "string") continue;
      if (seen.has(v)) return `"${v}" is listed twice as a ${label}.`;
      seen.add(v);
    }
    return true;
  };
}

/** Warns when two items in an array share a value for `key`. */
export function uniqueBy(key: string, label: string) {
  return (items: unknown) => {
    if (!Array.isArray(items)) return true;
    const seen = new Set<string>();
    for (const item of items) {
      const v = (item as Record<string, unknown>)?.[key];
      if (typeof v !== "string") continue;
      if (seen.has(v)) return `Two items share the ${label} "${v}". Each needs its own.`;
      seen.add(v);
    }
    return true;
  };
}

/** The placeholder flag: shipped copy that is not the client's, tracked in the Studio (rule 5). */
export function placeholderField(what: string) {
  return defineField({
    name: "placeholder",
    title: "Placeholder",
    type: "boolean",
    description: `On while this ${what} is stand-in copy written for the design, not the client's. It still shows on the site — the flag is what lists it as needing replacing. Switch it off once the words are approved.`,
    initialValue: false,
    validation: (rule) =>
      rule.custom((on) => (on ? `Placeholder ${what} — replace with approved copy before launch.` : true)).warning(),
  });
}
