"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

/**
 * "You are looking at unpublished changes" — and the way back out.
 *
 * Only rendered in draft mode, and only OUTSIDE the Studio's Presentation
 * frame: inside it, the Studio already says it is a preview and has its own
 * controls, and a second bar over the page would cover the thing being edited.
 * Draft mode is a cookie, so without this an editor who opens the site in a
 * normal tab after previewing would keep seeing drafts and never know why.
 *
 * Deliberately does not use `next-sanity/hooks` to detect the frame: that
 * module pulls the visual-editing runtime into the site's shared bundle on
 * every page (measured at ~230 KB), and `window.top` answers the same question.
 *
 * `prefetch={false}` is load-bearing: a prefetched link would call the disable
 * route in the background and end the preview before anyone clicked it.
 */
const subscribe = () => () => {};
const framed = () => window.self !== window.top;

export function DraftModeBar() {
  // null on the server, where there is no window to ask.
  const inFrame = useSyncExternalStore(subscribe, framed, () => null);
  if (inFrame !== false) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-4 rounded-pill bg-ink py-2 pr-2 pl-5 text-sm text-ink-invert shadow-lg"
    >
      <span>Previewing unpublished changes</span>
      <Link
        href="/api/draft-mode/disable"
        prefetch={false}
        className="inline-flex h-11 items-center rounded-pill bg-canvas px-4 font-medium text-ink"
      >
        Exit preview
      </Link>
    </div>
  );
}
