"use client";

/**
 * The Sanity Studio, mounted at `/studio` (`src/app/studio/[[...tool]]`).
 *
 * `"use client"` because the config holds functions and is passed to
 * `NextStudio` from a server component — this is next-sanity's convention.
 *
 * Three tools:
 *   - Structure — the editing sidebar (`src/sanity/structure.ts`)
 *   - Presentation — the live site in a frame, with every piece of text
 *     clickable back to its field
 *   - Vision — a GROQ query console, for developers; editors can ignore it
 */
import { visionTool } from "@sanity/vision";
import { map } from "rxjs";
import { defineConfig } from "sanity";
import { type DocumentLocationsState, presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId, studioUrl } from "./src/sanity/env";
import { schemaTypes, SINGLETONS } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

/** A singleton can be edited and published, never deleted, duplicated or
    unpublished — directly, or through a release's "Unpublish when releasing"
    (`unpublishVersion`). Unpublishing the home page would put the code copy
    back on the live site. A deny list rather than an allow list, so actions a
    later Sanity release adds (scheduling, releases) are not silently hidden. */
const SINGLETON_BLOCKED = new Set(["delete", "duplicate", "unpublish", "unpublishVersion"]);

/** What the Preview banner says on each document: which page it appears on. */
const HOME: DocumentLocationsState = {
  message: "This is the home page.",
  locations: [{ title: "Home", href: "/" }],
};
const ON_HOME: DocumentLocationsState = {
  locations: [{ title: "Home page, Use cases", href: "/#case-studies" }],
};
const NOT_ON_HOME: DocumentLocationsState = {
  tone: "caution",
  message: "Not on the site. Choose it under Home page → Use cases to show it.",
  locations: [],
};

export default defineConfig({
  name: "default",
  title: "Hazeberg",
  basePath: studioUrl,
  projectId,
  dataset,

  schema: { types: schemaTypes },

  document: {
    actions: (actions, { schemaType }) =>
      SINGLETONS.has(schemaType)
        ? actions.filter(({ action }) => !action || !SINGLETON_BLOCKED.has(action))
        : actions,
    /* No "new Home page" in any create menu: the one document is opened from
       the sidebar. The template itself stays registered — the sidebar's editor
       uses it to fill a brand-new home document with the shipped copy. */
    newDocumentOptions: (options) =>
      options.filter(({ templateId }) => !SINGLETONS.has(templateId)),
  },

  plugins: [
    structureTool({ structure }),
    presentationTool({
      title: "Preview",
      previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } },
      resolve: {
        mainDocuments: [{ route: "/", filter: `_type == "homePage" && _id == "homePage"` }],
        /* A case study is only on the site while the home page lists it, so
           its banner asks the home page — live, drafts included, so choosing
           it in an unpublished home edit already reads as "on the page". */
        locations: (params, { documentStore }) => {
          if (params.type === "homePage") return HOME;
          if (params.type !== "caseStudy") return null;
          return documentStore
            .listenQuery(
              `*[_id in ["homePage", "drafts.homePage"] && references($id)][0]._id`,
              { id: params.id.replace(/^drafts\./, "") },
              { perspective: "raw", tag: "presentation.case-study-locations" },
            )
            .pipe(map((homeId: unknown) => (homeId ? ON_HOME : NOT_ON_HOME)));
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
