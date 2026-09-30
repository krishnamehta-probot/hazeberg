import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

/**
 * The Sanity Studio — where the site's content is edited — at `/studio`.
 *
 * It sits under the bare root layout, not `(site)`, so none of the public
 * site's CSS, header, footer or smooth scroll reach it. `metadata` marks it
 * `noindex`; access is controlled by Sanity's own login, not by this route.
 */
export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) return <NotConfigured />;
  return <NextStudio config={config} />;
}

/**
 * Shown until a project ID is set — plain markup with inline styles, because
 * no site CSS is loaded here.
 */
function NotConfigured() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: "40rem", margin: "15vh auto", padding: "0 1.5rem", lineHeight: 1.6 }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>The CMS is not connected yet</h1>
      <p>
        Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> (and optionally{" "}
        <code>NEXT_PUBLIC_SANITY_DATASET</code>) in <code>web/.env.local</code> locally, or in the
        Vercel project settings, then restart or redeploy. Until then the site shows the copy that
        ships in code.
      </p>
      <p>
        Setup steps are in <code>web/SANITY.md</code>.
      </p>
    </main>
  );
}
