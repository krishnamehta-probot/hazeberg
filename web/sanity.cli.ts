/**
 * Settings for the `sanity` command line — used by `npm run sanity:types` and
 * `npm run sanity:seed`, never by the site. The CLI reads `.env.local` itself,
 * so the project ID comes from the same place the site's does.
 */
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
  typegen: {
    path: "./src/**/*.{ts,tsx}",
    schema: "./src/sanity/schema.json",
    generates: "./src/sanity/sanity.types.ts",
  },
});
