/**
 * Moves the LIVE home page's Results figures line from the old figures to the
 * new ones, and touches nothing else in it. A one-off, like
 * `patch-home-credentials.ts`: run once, then it has nothing left to do.
 *
 * Krishna, 2026-10-03: "50+ Projects Delivered. 35+ Global Client Served", on
 * the home page and the About page. About is code; the home page's line is the
 * Sanity field `results.titleLead`, so the code fallback alone would change
 * nothing a visitor sees.
 *
 *   from  "20+ Projects. 200+ Integrations. 100% Customer Retention."
 *   to    `RESULTS.titleLead` in `lib/home-content.ts`, the new line
 *
 * Only where the field still holds the OLD line exactly. A document whose
 * line an editor has already rewritten is left alone and named, so nobody's
 * words are overwritten — move the figures by hand there. On `homePage` and,
 * if one is open, `drafts.homePage` (otherwise publishing that draft later
 * would put the old figures back). Each patch is pinned to the revision it
 * read (`ifRevisionId`): a save in between refuses the whole transaction.
 *
 * Reads unless given `--write`. From `web/`:
 *
 *   npx sanity exec scripts/patch-home-figures.ts --with-user-token              (dry run)
 *   npx sanity exec scripts/patch-home-figures.ts --with-user-token -- --write
 */
import { getCliClient } from "sanity/cli";

import { RESULTS } from "../src/lib/home-content";

const OLD = "20+ Projects. 200+ Integrations. 100% Customer Retention.";
const NEW = RESULTS.titleLead;

const write = process.argv.includes("--write");
const client = getCliClient({ apiVersion: "2026-09-30", perspective: "raw", useCdn: false });

type Target = { _id: string; _rev: string; titleLead: string | null };

async function main() {
  const { projectId, dataset } = client.config();
  console.log(`${write ? "Patching" : "Dry run against"} ${projectId}/${dataset}`);
  console.log(`  from ${JSON.stringify(OLD)}\n  to   ${JSON.stringify(NEW)}\n`);

  const targets = await client.fetch<Target[]>(
    `*[_id in ["homePage", "drafts.homePage"]]{ _id, _rev, "titleLead": results.titleLead }`,
  );

  const tx = client.transaction();
  let pending = 0;
  for (const id of ["homePage", "drafts.homePage"]) {
    const doc = targets.find((t) => t._id === id);
    if (!doc) {
      console.log(`  ${id.padEnd(16)} not found — nothing to do`);
      continue;
    }
    if (doc.titleLead === NEW) {
      console.log(`  ${id.padEnd(16)} already has the new line — left alone`);
      continue;
    }
    if (doc.titleLead !== OLD) {
      console.log(`  ${id.padEnd(16)} holds an edited line — left alone: ${JSON.stringify(doc.titleLead)}`);
      continue;
    }
    console.log(`  ${id.padEnd(16)} set results.titleLead (rev ${doc._rev})`);
    tx.patch(id, (p) => p.ifRevisionId(doc._rev).set({ "results.titleLead": NEW }));
    pending++;
  }

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
