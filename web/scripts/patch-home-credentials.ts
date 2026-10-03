/**
 * Writes the Results credentials into the LIVE home page, and touches nothing
 * else in it. A one-off: run once, after review, then it has nothing left to do.
 *
 * The `credentials` field joined the `homePage` schema on 2026-10-03, after the
 * document was seeded, so the published document does not have it. The site is
 * already right without it — `lib/home/normalize.ts` falls back to the shipped
 * pair from `lib/home-content.ts` — but the Studio is not: an editor opening
 * Results finds the field empty and cannot fill it, because it is a fixed-length
 * list (`FIXED_ARRAY`) and a fixed-length list has no add button. This puts the
 * owner's two lines into the document so they become editable words.
 *
 * Exactly one operation, `setIfMissing` on `results.credentials`, on:
 *
 *   - `homePage`, the published document
 *   - `drafts.homePage`, if an editor has one open — otherwise publishing that
 *     draft later would put back a document without the field
 *
 * A document that already has the field is left exactly as it is, so the script
 * is safe to run twice and can never overwrite an editor's words. Each patch is
 * pinned to the revision it read (`ifRevisionId`): if someone saves between the
 * read and the write, the whole transaction is refused and nothing changes — run
 * it again.
 *
 * Not `npm run sanity:seed -- --replace`, which would reset the whole home page
 * to the shipped copy and throw away every edit made in the Studio since.
 *
 * Release versions (`versions.<release>.homePage`) are listed and NOT patched:
 * a scheduled release is someone else's pending work. One published without the
 * field is harmless — the page falls back again — and running this afterwards
 * fills it in.
 *
 * Runs as whoever is logged in with `npx sanity login`, like the seed. It only
 * READS unless it is given `--write`, so a bare run, or a flag lost on its way
 * through `sanity exec`, can never change anything. From `web/`:
 *
 *   npx sanity exec scripts/patch-home-credentials.ts --with-user-token              (dry run)
 *   npx sanity exec scripts/patch-home-credentials.ts --with-user-token -- --write
 *
 * Read the dry run first: it names each document it would patch and the
 * revision it read, and lists any release versions it is leaving alone.
 */
import { getCliClient } from "sanity/cli";

import { homeDocumentText } from "../src/sanity/lib/home-document";

const write = process.argv.includes("--write");

/* `raw`, not the API's default `published`: a published-only read would never
   see the draft, and the draft is half of what this has to patch. */
const client = getCliClient({ apiVersion: "2026-09-30", perspective: "raw", useCdn: false });

/** The owner's two lines, keyed and typed exactly as the Studio writes them. */
const credentials = homeDocumentText().results.credentials;

type Target = { _id: string; _rev: string; hasResults: boolean; hasCredentials: boolean };

async function main() {
  const { projectId, dataset } = client.config();
  console.log(`${write ? "Patching" : "Dry run against"} ${projectId}/${dataset}`);
  console.log(`Value: ${JSON.stringify(credentials)}\n`);

  const targets = await client.fetch<Target[]>(
    `*[_id in ["homePage", "drafts.homePage"]]{
      _id, _rev,
      "hasResults": defined(results),
      "hasCredentials": defined(results.credentials)
    }`,
  );
  const versions = await client.fetch<string[]>(`*[_id in path("versions.*.homePage")]._id`);

  const tx = client.transaction();
  let pending = 0;
  for (const id of ["homePage", "drafts.homePage"]) {
    const doc = targets.find((t) => t._id === id);
    if (!doc) {
      console.log(`  ${id.padEnd(16)} not found — nothing to do`);
      continue;
    }
    /* Never create the section around the field: a document with no Results
       at all is a different problem, and the page already falls back whole. */
    if (!doc.hasResults) {
      console.log(`  ${id.padEnd(16)} has no Results section — skipped`);
      continue;
    }
    if (doc.hasCredentials) {
      console.log(`  ${id.padEnd(16)} already has credentials — left alone`);
      continue;
    }
    console.log(`  ${id.padEnd(16)} setIfMissing results.credentials (rev ${doc._rev})`);
    tx.patch(id, (p) => p.ifRevisionId(doc._rev).setIfMissing({ "results.credentials": credentials }));
    pending++;
  }
  for (const id of versions) console.log(`  ${id} — release version, not patched (see the note at the top)`);

  if (pending === 0) {
    console.log("\nNothing to write.");
    return;
  }
  if (!write) {
    console.log(`\nDry run: ${pending} patch(es) not sent. Add \`-- --write\` to send them.`);
    return;
  }
  const result = await tx.commit();
  console.log(`\nDone — transaction ${result.transactionId}, ${result.results.length} document(s) patched.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
