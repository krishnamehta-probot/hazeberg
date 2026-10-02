/**
 * The seven services the home page's wheel can show, and where each one goes.
 *
 * An editor picks WHICH service a wheel item is; the route comes from here.
 * Every published route is a generated page (`app/services/[slug]`) that the
 * header links by hand, so a free-text href in the CMS would be one typo away
 * from a 404 that the rest of the site still links to.
 *
 * Plain data with no React in it: the Studio's schema imports this file too.
 *
 * When the `servicePage` and `solution` collections from `CMS-PLAN.md` land,
 * wheel items become references to those documents and this list goes.
 */
export const SERVICE_OPTIONS = [
  { key: "hcm", title: "Workday HCM", href: "/services/workday-hcm", published: true },
  { key: "payroll", title: "Workday Payroll", href: "/services/workday-payroll", published: true },
  {
    key: "financials",
    title: "Workday Financials",
    href: "/services/workday-financials",
    published: true,
  },
  {
    key: "integrations",
    title: "Workday Integrations",
    href: "/services/workday-integrations",
    published: true,
  },
  /* Held back until the client's document for it arrives (client's call,
     2026-10-02): no page is built and nothing on the site links to it. Flip
     `published` when the page is written and it returns everywhere at once. */
  {
    key: "reporting-analytics",
    title: "Reporting & Analytics",
    href: "/services/workday-reporting-analytics",
    published: false,
  },
  /* A service page since the client's AMS document (2026-10-02); it used to
     point at the AMS capability on What we do. */
  { key: "ams", title: "Workday AMS", href: "/services/workday-ams", published: true },
  { key: "extend", title: "Workday Extend", href: "/services/workday-extend", published: true },
] as const;

export type ServiceKey = (typeof SERVICE_OPTIONS)[number]["key"];

/**
 * Whether a service is on the site. One switch, read by everything that lists
 * or links a service — the header, the home wheel, the footer, What we do's
 * service links, the related-services rows and the router — so a service
 * cannot be half-hidden. The CMS keeps an unpublished service's wheel item
 * (its validation still counts all of them), and the wheel skips it.
 */
const HIDDEN = new Set<string>(
  SERVICE_OPTIONS.flatMap((s) => (s.published ? [] : [s.key, s.href])),
);

export function isPublishedService(key: string): boolean {
  return !HIDDEN.has(key);
}

/** For any link: false only for an unpublished service's page. */
export function isPublishedHref(href: string): boolean {
  return !HIDDEN.has(href);
}

const BY_KEY = new Map<string, (typeof SERVICE_OPTIONS)[number]>(
  SERVICE_OPTIONS.map((s) => [s.key, s]),
);

export function isServiceKey(value: unknown): value is ServiceKey {
  return typeof value === "string" && BY_KEY.has(value);
}

export function serviceHref(key: ServiceKey): string {
  return BY_KEY.get(key)!.href;
}

/** The key for a route, for mapping `home-content.ts` (which stores hrefs). */
export function serviceKeyForHref(href: string): ServiceKey | undefined {
  return SERVICE_OPTIONS.find((s) => s.href === href)?.key;
}
