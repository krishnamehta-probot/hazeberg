import { HomeIcon } from "@sanity/icons/Home";
import { defineArrayMember, defineField, defineType } from "sanity";

import { SERVICE_OPTIONS } from "../../lib/home/services";
import { homeDocumentText } from "../lib/home-document";
import {
  eyebrowField,
  FIXED_ARRAY,
  linkField,
  PHOTO_DIRECTION,
  photoField,
  placeholderField,
  routeField,
  textField,
  uniqueBy,
} from "./fields";

/**
 * The home page — one document, one tab per section, in page order.
 *
 * Level 2 from `CMS-PLAN.md`: the words, the photographs and the lists are
 * editable; the sections, their order and their layout are not. Every field
 * here is one the page actually renders (v1, `/`); copy that only /v2 or the
 * About page uses stays in code.
 *
 * Lists the design draws a fixed number of — four impact strands, four result
 * cards, seven wedges on the wheel, three engagement tabs — can be edited and
 * reordered but not grown or shrunk. See `FIXED_ARRAY`.
 */

const hero = defineField({
  name: "hero",
  title: "Hero",
  type: "object",
  group: "hero",
  options: { collapsible: false },
  validation: (rule) => rule.required(),
  fields: [
    textField({
      name: "titleA",
      title: "Headline — first sentence",
      description: "The first line of the headline, in white.",
      soft: 30,
      hard: 45,
    }),
    textField({
      name: "titleB",
      title: "Headline — second sentence, white part",
      description:
        "The start of the second line, in white. The amber words below follow it on the same line, with a space added automatically.",
      soft: 16,
      hard: 24,
    }),
    textField({
      name: "titleAccent",
      title: "Headline — second sentence, amber part",
      description: "The end of the second line, in the brand amber.",
      soft: 24,
      hard: 32,
      warn: (value, parent) => {
        const white = typeof parent?.titleB === "string" ? parent.titleB : "";
        return white.length + 1 + value.length > 35
          ? "The second line (white + amber) is longer than 35 characters, so it wraps on laptop screens where the design holds it on one line."
          : true;
      },
    }),
    textField({
      name: "lead",
      title: "Introduction",
      description: "The paragraph under the headline.",
      rows: 3,
      soft: 160,
      hard: 220,
    }),
    linkField({ label: { soft: 28, hard: 36 } }),
    textField({
      name: "trust",
      title: "Logo rail label",
      description:
        "The label beside the rolling client logos. The logos themselves are managed in code: each file is prepared for the dark band and sized by measurement.",
      soft: 40,
      hard: 60,
    }),
  ],
});

const about = defineField({
  name: "about",
  title: "About",
  type: "object",
  group: "about",
  options: { collapsible: false },
  validation: (rule) => rule.required(),
  fields: [
    eyebrowField(),
    defineField({
      name: "stat",
      title: "Headline figure",
      type: "number",
      description: 'Counts up from zero as the section arrives. A whole number — "12" for "12+ years".',
      validation: (rule) => rule.required().integer().min(1).max(999),
    }),
    textField({
      name: "statSuffix",
      title: "After the figure",
      description: 'Sits straight after the number, e.g. "+". Can be empty.',
      optional: true,
      soft: 2,
      hard: 2,
    }),
    textField({
      name: "statTail",
      title: "Rest of the headline",
      description: 'Follows the figure, e.g. "years of Workday expertise."',
      soft: 32,
      hard: 48,
    }),
    textField({
      name: "body",
      title: "Paragraph",
      description:
        "Fills in word by word as the visitor scrolls. One paragraph, no line breaks. The section is held on screen while it plays and centred in it, so every extra line pushes the 'Why Hazeberg' label up towards the menu bar: on a 1024x768 screen it starts to slide under the bar at about 415 characters, on 1280x720 at about 490.",
      rows: 6,
      /* Measured by DOM on the pinned pane: 8 lines clear the nav at 1024x768
         up to ~415 characters; the 10th line starts at 466. */
      soft: 400,
      hard: 460,
    }),
    linkField({ label: { soft: 28, hard: 36 } }),
    defineField({
      name: "points",
      title: "Points",
      description:
        "Four points. The sphere shows one at a time as the visitor scrolls, and the ring around it has one segment per point. Drag to reorder.",
      type: "array",
      options: FIXED_ARRAY,
      of: [
        defineArrayMember({
          name: "point",
          type: "object",
          fields: [
            textField({
              name: "title",
              title: "Title",
              description: "Set inside the sphere — keep it short.",
              soft: 30,
              hard: 40,
            }),
            textField({
              name: "body",
              title: "Line",
              description: "One line under the sphere.",
              soft: 90,
              hard: 110,
            }),
            /* No icon field. The supplied marks are only drawn by the
               unanimated list, which the pinned scene replaces on mount — no
               visitor ever sees them, so an upload here would change nothing.
               They stay in code, by position (`lib/home/normalize.ts`). */
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        }),
      ],
      validation: (rule) => [
        rule.required().length(4),
        rule.custom(uniqueBy("title", "title")).error(),
      ],
    }),
  ],
});

const impact = defineField({
  name: "impact",
  title: "Impact",
  type: "object",
  group: "impact",
  options: { collapsible: false },
  validation: (rule) => rule.required(),
  fields: [
    eyebrowField(),
    textField({
      name: "titleLead",
      title: "Heading — white part",
      description: "Arrives after the four lines meet.",
      soft: 40,
      hard: 50,
    }),
    textField({
      name: "titleAccent",
      title: "Heading — amber part",
      description: "Follows the white part, in the brand amber.",
      soft: 30,
      hard: 40,
    }),
    textField({ name: "body", title: "Paragraph", rows: 3, soft: 170, hard: 220 }),
    linkField({
      label: { soft: 28, hard: 48 },
      description:
        "Past about 28 characters the button text wraps onto two lines on phones and small laptops.",
    }),
    defineField({
      name: "cards",
      title: "Figures",
      description:
        "Four figures, one per line in the drawing. The figure and its label sit at the end of each line; the title and sentence open when a visitor hovers or taps it. Drag to reorder.",
      type: "array",
      options: FIXED_ARRAY,
      of: [
        defineArrayMember({
          name: "impactCard",
          type: "object",
          fields: [
            textField({
              name: "stat",
              title: "Figure",
              description: 'Shown as written, e.g. "80%+" or "<30 sec".',
              soft: 8,
              hard: 10,
            }),
            textField({
              name: "statLabel",
              title: "Figure label",
              description: "Shown on one line next to the figure — on wide screens it cannot wrap.",
              /* Measured: "Process Efficiency Gains" (24) stays one line at every
                 width; the label box holds 224px of text, which "80%+ " plus
                 it (29 characters) fills to within its own padding. */
              soft: 24,
              hard: 30,
              warn: (value, parent) => {
                const stat = typeof parent?.stat === "string" ? parent.stat : "";
                return stat.length + 1 + value.length > 29
                  ? "Figure plus label is longer than 29 characters — on wide screens it will run past the end of its line."
                  : true;
              },
            }),
            textField({ name: "title", title: "Title", soft: 28, hard: 36 }),
            textField({ name: "body", title: "Sentence", soft: 100, hard: 130 }),
            placeholderField("figure text"),
          ],
          preview: { select: { title: "stat", subtitle: "statLabel" } },
        }),
      ],
      validation: (rule) => [
        rule.required().length(4),
        rule.custom(uniqueBy("title", "title")).error(),
      ],
    }),
  ],
});

const services = defineField({
  name: "services",
  title: "Services",
  type: "object",
  group: "services",
  options: { collapsible: false },
  validation: (rule) => rule.required(),
  fields: [
    eyebrowField(),
    textField({ name: "title", title: "Heading", soft: 50, hard: 60 }),
    defineField({
      name: "items",
      title: "The wheel",
      description:
        "One wedge per service, clockwise from the top. Drag to change the order. Each item is tied to its service page, so its link and icon follow it.",
      type: "array",
      options: FIXED_ARRAY,
      of: [
        defineArrayMember({
          name: "serviceItem",
          type: "object",
          fields: [
            defineField({
              name: "service",
              title: "Service",
              type: "string",
              description: "Which service page this wedge opens. Fixed — the pages themselves are part of the site's structure.",
              readOnly: true,
              options: { list: SERVICE_OPTIONS.map((s) => ({ title: s.title, value: s.key })) },
              validation: (rule) => rule.required(),
            }),
            textField({
              name: "label",
              title: "Name",
              description:
                "Set on two lines inside its wedge: every word but the last, then the last word. Two or three words, each line up to about 13 characters.",
              soft: 24,
              hard: 30,
              warn: (value) => {
                const words = value.split(/\s+/).filter(Boolean);
                if (words.length < 2) return "Use at least two words — the wedge sets the name on two lines.";
                const first = words.slice(0, -1).join(" ");
                const last = words[words.length - 1];
                return first.length > 13 || last.length > 13
                  ? "A line of the name is longer than 13 characters and may touch the edge of its wedge."
                  : true;
              },
            }),
            textField({
              name: "body",
              title: "Description",
              description: "Shown beside the wheel when this wedge is active.",
              rows: 3,
              soft: 150,
              hard: 190,
            }),
            textField({ name: "cta", title: "Link text", soft: 24, hard: 30 }),
          ],
          preview: { select: { title: "label", subtitle: "body" } },
        }),
      ],
      validation: (rule) => [
        rule.required().length(SERVICE_OPTIONS.length),
        rule.custom(uniqueBy("service", "service")).error(),
        rule.custom(uniqueBy("label", "name")).warning(),
      ],
    }),
  ],
});

const results = defineField({
  name: "results",
  title: "Results",
  type: "object",
  group: "results",
  options: { collapsible: false },
  validation: (rule) => rule.required(),
  fields: [
    eyebrowField(),
    textField({
      name: "titleLead",
      title: "Heading — figures line",
      description: "The first line, in brand blue. Holds one line on laptops and wider.",
      soft: 60,
      hard: 70,
    }),
    textField({
      name: "titleRest",
      title: "Heading — second line",
      description: "Always starts on its own line.",
      soft: 60,
      hard: 70,
    }),
    textField({ name: "body", title: "Paragraph", rows: 3, soft: 160, hard: 200 }),
    defineField({
      name: "items",
      title: "Cards",
      description:
        "Four cards in a 2 x 2 block that the photograph splits open. The last card is drawn in amber. Drag to reorder.",
      type: "array",
      options: FIXED_ARRAY,
      of: [
        defineArrayMember({
          name: "capability",
          type: "object",
          fields: [
            textField({ name: "title", title: "Title", soft: 30, hard: 40 }),
            textField({
              name: "body",
              title: "Sentence",
              description: "Past about 140 characters a card runs to four lines and the block grows taller than its photograph.",
              rows: 3,
              soft: 140,
              hard: 170,
            }),
            textField({
              name: "highlight",
              title: "Highlight (optional)",
              description:
                'A few words from the sentence to set in blue, e.g. "40+ countries". Must be copied exactly from the sentence above.',
              optional: true,
              soft: 30,
              hard: 40,
              warn: (value, parent) =>
                typeof parent?.body === "string" && !parent.body.includes(value)
                  ? "These words do not appear in the sentence exactly as typed, so nothing will be highlighted."
                  : true,
            }),
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        }),
      ],
      validation: (rule) => rule.required().length(4),
    }),
    photoField({
      name: "media",
      title: "Photograph",
      description: `Opens up between the cards as the visitor scrolls. Portrait, about 5:6 (the column is 23 x 28 rem). ${PHOTO_DIRECTION}`,
      altRequired: true,
    }),
  ],
});

const caseStudies = defineField({
  name: "caseStudies",
  title: "Use cases",
  type: "object",
  group: "caseStudies",
  options: { collapsible: false },
  validation: (rule) => rule.required(),
  fields: [
    eyebrowField(),
    textField({ name: "title", title: "Heading", soft: 60, hard: 72 }),
    textField({ name: "body", title: "Paragraph", rows: 3, soft: 155, hard: 200 }),
    defineField({
      name: "items",
      title: "Case studies",
      description:
        "Three case studies, side by side. Edit the stories themselves under Case studies in the sidebar; here you choose which three appear and in what order.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "caseStudy" }] })],
      validation: (rule) => rule.required().length(3).unique(),
    }),
  ],
});

const models = defineField({
  name: "models",
  title: "Engagement models",
  type: "object",
  group: "models",
  options: { collapsible: false },
  validation: (rule) => rule.required(),
  fields: [
    eyebrowField(),
    textField({ name: "title", title: "Heading", soft: 60, hard: 74 }),
    textField({ name: "body", title: "Paragraph", rows: 4, soft: 240, hard: 300 }),
    textField({
      name: "cta",
      title: "Button text",
      description: "The same button text on all three panels.",
      soft: 24,
      hard: 30,
    }),
    defineField({
      name: "items",
      title: "Models",
      description:
        "Three tabs over one panel that changes every seven seconds. The panel has a fixed height, measured for the current copy: a model that runs past its length warnings makes the panel grow while it shows, and the page below jumps. Drag to reorder.",
      type: "array",
      options: FIXED_ARRAY,
      of: [
        defineArrayMember({
          name: "model",
          type: "object",
          fields: [
            textField({
              name: "stage",
              title: "Stage",
              description: 'One word above the tab title, e.g. "Implement".',
              soft: 12,
              hard: 16,
            }),
            textField({ name: "title", title: "Title", soft: 30, hard: 40 }),
            textField({
              name: "body",
              title: "Description",
              description: "Past about 180 characters the panel grows and the page below it jumps every seven seconds.",
              rows: 4,
              soft: 180,
              hard: 220,
            }),
            textField({
              name: "bestFor",
              title: "Best for",
              description: 'Follows "Best for:" in the panel.',
              rows: 2,
              soft: 80,
              hard: 110,
            }),
            routeField(),
            photoField({
              name: "image",
              title: "Photograph",
              description: `Fills the right side of the panel. Landscape. ${PHOTO_DIRECTION}`,
              altRequired: false,
            }),
          ],
          preview: { select: { title: "title", subtitle: "stage", media: "image" } },
        }),
      ],
      validation: (rule) => [
        rule.required().length(3),
        rule.custom(uniqueBy("title", "title")).error(),
      ],
    }),
  ],
});

const testimonials = defineField({
  name: "testimonials",
  title: "Testimonials",
  type: "object",
  group: "testimonials",
  options: { collapsible: false },
  validation: (rule) => rule.required(),
  fields: [
    eyebrowField(),
    textField({ name: "title", title: "Heading", soft: 60, hard: 74 }),
    defineField({
      name: "items",
      title: "Quotes",
      description: "A sideways-scrolling row of cards. Use client-approved quotes only.",
      type: "array",
      of: [
        defineArrayMember({
          name: "testimonial",
          type: "object",
          fields: [
            textField({ name: "body", title: "Quote", rows: 3, soft: 130, hard: 170 }),
            textField({
              name: "role",
              title: "Client",
              description: 'Who the client is, e.g. "Fortune 500 Client". Shown large.',
              soft: 20,
              hard: 28,
            }),
            textField({
              name: "name",
              title: "Their role",
              description: 'The person\'s role, e.g. "Program Lead". Shown small beside the client.',
              soft: 30,
              hard: 40,
            }),
            photoField({
              name: "portrait",
              title: "Portrait (optional)",
              description: "A small square beside the name. Leave empty and the card ends on the name.",
              altRequired: false,
              optional: true,
            }),
            placeholderField("quote"),
          ],
          preview: {
            select: { title: "body", subtitle: "role", media: "portrait", placeholder: "placeholder" },
            prepare: ({ title, subtitle, media, placeholder }) => ({
              title,
              subtitle: placeholder ? `PLACEHOLDER · ${subtitle ?? ""}` : subtitle,
              media,
            }),
          },
        }),
      ],
      validation: (rule) => rule.required().min(2).max(8),
    }),
  ],
});

const closing = defineField({
  name: "closing",
  title: "Closing",
  type: "object",
  group: "closing",
  options: { collapsible: false },
  validation: (rule) => rule.required(),
  fields: [
    eyebrowField(),
    textField({ name: "title", title: "Heading", soft: 70, hard: 84 }),
    textField({ name: "body", title: "Paragraph", rows: 2, soft: 100, hard: 130 }),
    linkField({ label: { soft: 28, hard: 36 } }),
  ],
});

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "about", title: "About" },
    { name: "impact", title: "Impact" },
    { name: "services", title: "Services" },
    { name: "results", title: "Results" },
    { name: "caseStudies", title: "Use cases" },
    { name: "models", title: "Engagement" },
    { name: "testimonials", title: "Testimonials" },
    { name: "closing", title: "Closing" },
  ],
  fields: [hero, about, impact, services, results, caseStudies, models, testimonials, closing],
  /* A new home document opens already holding today's copy — see
     `lib/home-document.ts`. Photographs and case studies come from the seed. */
  initialValue: homeDocumentText,
  preview: { prepare: () => ({ title: "Home page" }) },
});
