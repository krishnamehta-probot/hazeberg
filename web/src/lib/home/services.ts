/**
 * The seven services the home page's wheel can show, and where each one goes.
 *
 * An editor picks WHICH service a wheel item is; the route comes from here.
 * Six of these routes are generated pages (`app/services/[slug]`) and the
 * header links all six by hand, so a free-text href in the CMS would be one
 * typo away from a 404 that the rest of the site still links to.
 *
 * Plain data with no React in it: the Studio's schema imports this file too.
 *
 * When the `servicePage` and `solution` collections from `CMS-PLAN.md` land,
 * wheel items become references to those documents and this list goes.
 */
export const SERVICE_OPTIONS = [
  { key: "hcm", title: "Workday HCM", href: "/services/workday-hcm" },
  { key: "payroll", title: "Workday Payroll", href: "/services/workday-payroll" },
  { key: "financials", title: "Workday Financials", href: "/services/workday-financials" },
  { key: "integrations", title: "Workday Integrations", href: "/services/workday-integrations" },
  {
    key: "reporting-analytics",
    title: "Reporting & Analytics",
    href: "/services/workday-reporting-analytics",
  },
  /* An engagement model, not a service page — see `home-content.ts`. */
  { key: "ams", title: "Workday AMS", href: "/what-we-do#workday-ams" },
  { key: "extend", title: "Workday Extend", href: "/services/workday-extend" },
] as const;

export type ServiceKey = (typeof SERVICE_OPTIONS)[number]["key"];

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
