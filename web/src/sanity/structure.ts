import { CaseIcon } from "@sanity/icons/Case";
import { HomeIcon } from "@sanity/icons/Home";
import type { StructureResolver } from "sanity/structure";

/**
 * The Studio's sidebar, laid out like the site rather than like the database.
 *
 * "Home page" opens the one home document directly — there is no list of home
 * pages to pick from, because there is only ever one. When the other pages
 * arrive (`CMS-PLAN.md` phase D) they join it here, in sitemap order.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .id("root")
    .title("Content")
    .items([
      S.listItem()
        .id("homePage")
        .title("Home page")
        .icon(HomeIcon)
        .child(S.document().schemaType("homePage").documentId("homePage").title("Home page")),
      S.divider(),
      S.documentTypeListItem("caseStudy").title("Case studies").icon(CaseIcon),
    ]);
