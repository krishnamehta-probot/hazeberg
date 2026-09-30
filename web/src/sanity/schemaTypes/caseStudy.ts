import { CaseIcon } from "@sanity/icons/Case";
import { defineArrayMember, defineField, defineType } from "sanity";

import { PHOTO_DIRECTION, photoField, textField, uniqueStrings } from "./fields";

/**
 * A use case. A collection rather than fields on the home page because
 * `CMS-PLAN.md` has three more places that will want the same records — the
 * nav's feature card, What we do and the service pages. Written once, placed
 * anywhere.
 *
 * There is no case-study page, so a card carries the whole story and links
 * nowhere. The limits below are the card's: three sit side by side and are
 * held at one height, so a long field on one card makes all three taller.
 *
 * Icons come from their own subpath: `@sanity/icons` v5 dropped named exports
 * from the root entry, and Turbopack fails the build on the root import.
 */
export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  icon: CaseIcon,
  fields: [
    textField({
      name: "title",
      title: "Title",
      description:
        'Written as "<what we did> with <what it was done in>". The card breaks the line at the last " with ", so every title sits on two lines and the rule under it lines up across all three cards.',
      soft: 70,
      hard: 90,
      warn: (value) => {
        const at = value.lastIndexOf(" with ");
        if (at < 0) return 'Add " with " (lower case) where the line should break, e.g. "Modernizing HR Operations with Workday HCM".';
        if (at > 34 || value.length - at - 1 > 34)
          return "One half of the title is longer than 34 characters, so it will wrap onto a third line on laptop screens.";
        return true;
      },
    }),
    textField({
      name: "challenge",
      title: "Business challenge",
      description: "Shown on the back of the card, after it is turned over.",
      rows: 4,
      soft: 240,
      hard: 300,
    }),
    textField({
      name: "approach",
      title: "Hazeberg approach",
      description: "Shown on the back of the card, under the challenge.",
      rows: 4,
      soft: 200,
      hard: 260,
    }),
    defineField({
      name: "impact",
      title: "Business impact",
      description: "Two or three results, one line each. These are on the front of the card.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => [
        rule.required().min(2).max(3),
        rule.custom(uniqueStrings("result")).warning(),
        rule
          .custom((items) =>
            Array.isArray(items) && items.some((s) => typeof s === "string" && s.length > 100)
              ? "Keep each result under 100 characters."
              : true,
          )
          .error(),
        rule
          .custom((items) =>
            Array.isArray(items) && items.some((s) => typeof s === "string" && s.length > 80)
              ? "A result longer than about 80 characters runs to a third line."
              : true,
          )
          .warning(),
      ],
    }),
    defineField({
      name: "capabilities",
      title: "Capabilities delivered",
      description: "Three or four short tags, shown as chips on the back of the card.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => [
        rule.required().min(3).max(4),
        rule.custom(uniqueStrings("tag")).warning(),
        rule
          .custom((items) => {
            if (!Array.isArray(items)) return true;
            if (items.some((s) => typeof s === "string" && s.length > 28))
              return "Keep each tag to 28 characters or fewer.";
            const total = items.reduce<number>((n, s) => n + (typeof s === "string" ? s.length : 0), 0);
            return total > 72 ? "The tags add up to more than 72 characters — the chips will take an extra row on this card only." : true;
          })
          .warning(),
      ],
    }),
    photoField({
      name: "image",
      title: "Photograph",
      description: `Shown 16:9 across the top of the card, with a label over its top-left corner — keep that corner quiet. ${PHOTO_DIRECTION}`,
      altRequired: false,
    }),
  ],
  preview: {
    select: { title: "title", media: "image" },
  },
});
