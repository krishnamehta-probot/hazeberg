"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Switches the site chrome off under `/v2`.
 *
 * v2 is a parallel version of the home page with its own header and its own
 * footer. The App Router's root layout applies to every route including this
 * one, so without a gate `/v2` would render two headers and two footers.
 *
 * The idiomatic alternative is multiple root layouts — move every existing
 * page into a `(site)` route group, give that group the current root layout and
 * v2 its own. That was rejected here: it rewrites the path of every page in the
 * app to add one route, and it forces a full document reload on any navigation
 * between the two groups. This is nine lines and touches the root layout twice.
 *
 * `children` is passed in from a server component and is only ever returned or
 * dropped, never rendered into — so the header and footer stay server
 * components. The client boundary is this file alone.
 */
export function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/v2" || pathname.startsWith("/v2/")) return null;
  return <>{children}</>;
}
