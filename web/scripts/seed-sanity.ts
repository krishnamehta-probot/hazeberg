/**
 * Puts the home page into Sanity — the copy that ships in code today, the
 * photographs in `public/`, and the three case studies — so the CMS starts
 * exactly where the site is and nothing is retyped.
 *
 *   npm run sanity:seed               create what is missing, touch nothing else
 *   npm run sanity:seed -- --replace  overwrite the published home page and
 *                                     case studies with the shipped copy
 *
 * Runs through `sanity exec --with-user-token`, i.e. as whoever is logged in
 * with `npx sanity login` — no API token has to be created for it.
 *
 * Safe to run twice: without `--replace` every write is `createIfNotExists`,
 * and Sanity de-duplicates uploaded files by content, so a second run adds
 * nothing. `--replace` exists for a deliberate reset and is the only path
 * that can overwrite an editor's published work.
 */
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";

import { getCliClient } from "sanity/cli";

import { FALLBACK_HOME } from "../src/lib/home/fallback";
import { homeDocumentText } from "../src/sanity/lib/home-document";

const replace = process.argv.includes("--replace");
const client = getCliClient({ apiVersion: "2026-09-30" });
const PUBLIC = path.resolve(process.cwd(), "public");

type ImageField = {
  _type: "image";
  asset: { _type: "reference"; _ref: string };
  alt?: string;
  standIn?: boolean;
};

/* Pictures the design was built with that are not the client's: frames from
   the reference set (`/comp/`) and generated use-case images (`/cases/`, see
   `content/case-study-image-prompts.md`). They are seeded so the page stays
   as approved, and flagged so the Studio keeps them listed for replacing. */
const isStandIn = (sitePath: string) => /^\/(comp|cases)\//.test(sitePath);

/* The PROMISE is cached, not the id: uploads run in parallel, and six
   testimonials sharing one portrait would otherwise all start their own. */
const uploads = new Map<string, Promise<string>>();

/** Uploads a file from `public/` once and returns an image field pointing at it. */
async function image(sitePath: string, alt?: string): Promise<ImageField> {
  const file = path.join(PUBLIC, decodeURIComponent(sitePath));
  if (!existsSync(file)) throw new Error(`seed: missing ${file}`);
  let upload = uploads.get(file);
  if (!upload) {
    upload = client.assets
      .upload("image", createReadStream(file), { filename: path.basename(file) })
      .then((asset) => {
        console.log(`  uploaded ${sitePath}`);
        return asset._id;
      });
    uploads.set(file, upload);
  }
  const id = await upload;
  return {
    _type: "image",
    asset: { _type: "reference", _ref: id },
    ...(alt ? { alt } : {}),
    ...(isStandIn(sitePath) ? { standIn: true } : {}),
  };
}

/** `caseStudy-hr-operations` from `/cases/01-hr-operations.jpg`: readable, stable ids. */
const caseId = (src: string) =>
  `caseStudy-${path.basename(src, path.extname(src)).replace(/^\d+-/, "")}`;

async function main() {
  const { projectId, dataset } = client.config();
  console.log(`Seeding ${projectId}/${dataset}${replace ? " (replacing)" : ""}…`);

  const home = FALLBACK_HOME;
  const text = homeDocumentText();

  console.log("Uploading photographs:");
  const caseStudies = await Promise.all(
    home.caseStudies.items.map(async (c) => ({
      _id: caseId(c.image.src),
      _type: "caseStudy",
      title: c.title,
      challenge: c.challenge,
      approach: c.approach,
      impact: c.impact,
      capabilities: c.capabilities,
      image: await image(c.image.src),
    })),
  );

  const homePage = {
    _id: "homePage",
    _type: "homePage",
    ...text,
    results: { ...text.results, media: await image(home.results.media.src, home.results.media.alt) },
    caseStudies: {
      ...text.caseStudies,
      items: caseStudies.map((c) => ({ _key: c._id, _type: "reference", _ref: c._id })),
    },
    models: {
      ...text.models,
      items: await Promise.all(
        text.models.items.map(async (m, i) => ({ ...m, image: await image(home.models.items[i].image.src) })),
      ),
    },
    testimonials: {
      ...text.testimonials,
      items: await Promise.all(
        text.testimonials.items.map(async (t, i) => {
          const portrait = home.testimonials.items[i].portrait;
          return portrait ? { ...t, portrait: await image(portrait.src) } : t;
        }),
      ),
    },
  };

  /* Case studies first, in the same transaction: the home page references
     them, and a reference to a document that does not exist yet is refused. */
  const tx = client.transaction();
  const write = (doc: { _id: string; _type: string }) =>
    replace ? tx.createOrReplace(doc) : tx.createIfNotExists(doc);
  caseStudies.forEach(write);
  write(homePage);
  const result = await tx.commit();
  console.log(`Done — ${result.results.length} documents written or already present.`);
  if (!replace) {
    console.log("Existing documents were left alone. Use `npm run sanity:seed -- --replace` to reset them.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
