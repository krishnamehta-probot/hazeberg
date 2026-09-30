import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

import { DraftModeBar } from "@/components/draft-mode-bar";
import { SiteShell } from "@/components/site-shell";
import { live } from "@/sanity/lib/live";
import { refreshFromSanity } from "@/sanity/lib/live-actions";

import "../globals.css";

/**
 * Every public page. The root layout above this is bare so the Studio at
 * `/studio` can be its own application — see `app/layout.tsx`.
 *
 * Two Sanity pieces, both invisible to a visitor:
 *
 *   - `<SanityLive />` listens for published changes while the page is open
 *     and refreshes exactly the cached queries they touch, so an open tab
 *     updates in about two seconds. About 2 KB, quiet otherwise. It is the fast
 *     path, not the guarantee — the publish webhook is (`sanity/lib/live.ts`).
 *     Its action is ours, not the default — see `sanity/lib/live-actions.ts`.
 *   - `<VisualEditing />` and the preview bar mount ONLY in draft mode — the
 *     overlays that make preview text clickable, and a way out of preview.
 *
 * Reading `isEnabled` does not make the pages dynamic: outside draft mode
 * every page is still prerendered.
 */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const { isEnabled: preview } = await draftMode();
  const SanityLive = live?.SanityLive;

  return (
    <>
      <SiteShell>{children}</SiteShell>
      {SanityLive ? <SanityLive action={refreshFromSanity} /> : null}
      {preview ? (
        <>
          <VisualEditing />
          <DraftModeBar />
        </>
      ) : null}
    </>
  );
}
