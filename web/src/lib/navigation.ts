/**
 * The site's information architecture — single source of truth for the header,
 * the mobile drawer and (later) the footer.
 *
 * Encoded directly from the signed-off sitemap, in the bar's order:
 *
 *   Home                    separate landing page
 *   What we do              separate landing page; every solution is a section
 *                           ON that page (the sitemap marks them "consolidated")
 *   Services                dropdown only, NO landing page of its own
 *     - 6 Workday services, each its own landing page
 *       (AMS is an engagement model, so it lives on /what-we-do instead)
 *   About                   separate landing page; sections consolidated onto it
 *   Berg                    single page — consulting firms / customers extending
 *                           delivery capacity. "For Consultants" deliberately
 *                           lives on Careers instead, as it is hiring-facing.
 *   Careers                 single page
 *   Contact                 single page
 *
 * ONE DROPDOWN. What we do and About used to open panels of their own, listing
 * their sections; the client's call, 2026-09-30, is that only Services drops
 * down and What we do leads the bar. Both pages carry their own anchor rail, so
 * nothing their panels linked to is lost — it is one click further, on the page
 * it belongs to.
 *
 * COPY STATUS — every `description` and every `feature` block below is drawn
 * from the live site (hazebergconsulting.com, captured in
 * `content/live-site-content.txt`) or is a marked PLACEHOLDER. Per project rule
 * 5, nothing here is final client copy. When Sanity is wired this module becomes
 * the query result rather than a literal; the shape is designed for that swap.
 */

/**
 * Icon keys, not components — the data stays serialisable so it can come
 * straight from Sanity later. `NAV_ICONS` in the header maps key -> Lucide.
 */
export type NavIcon =
  | "hcm"
  | "payroll"
  | "financials"
  | "extend"
  | "integrations"
  | "reporting";

export type NavLeaf = {
  label: string;
  href: string;
  icon: NavIcon;
  /** PLACEHOLDER — one line of orientation. Replace with client copy. */
  description?: string;
};

export type NavColumn = {
  /** Optional column heading, e.g. "Platform" / "Outcomes". */
  heading?: string;
  items: NavLeaf[];
};

/** The card in the panel's right rail. Kept to facts that are already public. */
export type NavFeature = {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  ctaLabel: string;
  /** Short proof chips. Facts only — these are all on the live site today. */
  tags?: string[];
  /** `accent` = yellow fill (near-black type). `quiet` = tinted surface. */
  tone: "accent" | "quiet";
};

export type NavNode =
  | { kind: "link"; label: string; href: string }
  | {
      kind: "menu";
      label: string;
      /**
       * Landing page for the section itself. Omitted for Services, which the
       * sitemap explicitly marks "Drop down, no seperate landing page".
       */
      href?: string;
      /** Left-hand rail inside the panel. */
      lede: { title: string; body: string };
      /** Present only when `href` is — you cannot "view all" of a page that does not exist. */
      viewAll?: { label: string; href: string };
      columns: NavColumn[];
      feature?: NavFeature;
      /** Thin strip across the panel's foot — the "if none of the above" route. */
      footnote?: { text: string; cta: { label: string; href: string } };
    };

export const PRIMARY_NAV: NavNode[] = [
  { kind: "link", label: "What we do", href: "/what-we-do" },
  {
    kind: "menu",
    label: "Services",
    // No href: the sitemap says dropdown only, no landing page.
    lede: {
      title: "Every Workday module, one partner",
      body: "Consultants averaging 12+ years in the Workday ecosystem, delivered from India to clients in 40+ countries.",
    },
    columns: [
      {
        heading: "Human capital",
        items: [
          {
            label: "Workday HCM",
            href: "/services/workday-hcm",
            icon: "hcm",
            description: "Core HR, compensation, time tracking, absence and recruiting.",
          },
          {
            label: "Workday Payroll",
            href: "/services/workday-payroll",
            icon: "payroll",
            description: "Configuration, parallel testing and post-go-live payroll support.",
          },
          {
            label: "Workday Financials",
            href: "/services/workday-financials",
            icon: "financials",
            description: "Spend management, accounting, invoicing and vendor management.",
          },
          {
            label: "Workday Extend",
            href: "/services/workday-extend",
            icon: "extend",
            description: "Custom apps built natively on the Workday platform.",
          },
        ],
      },
      {
        heading: "Technical",
        items: [
          {
            label: "Workday Integrations",
            href: "/services/workday-integrations",
            icon: "integrations",
            description: "Core Connectors, Studio, EIBs and APIs — 200+ built to date.",
          },
          {
            label: "Workday Reporting & Analytics",
            href: "/services/workday-reporting-analytics",
            icon: "reporting",
            description: "Advanced reports, calculated fields, BIRTs and dashboards.",
          },
        ],
      },
    ],
    feature: {
      eyebrow: "Proof",
      title: "200+ integrations, 40+ countries",
      body: "Already connected to Workday for our clients:",
      tags: ["ADP", "Fidelity", "MetLife", "Okta", "DocuSign", "SD Worx", "Cigna", "Greenhouse"],
      href: "/what-we-do",
      ctaLabel: "See how we work",
      tone: "accent",
    },
    footnote: {
      text: "Not sure which module you need?",
      cta: { label: "Start with a Workday Health Check", href: "/what-we-do#workday-health-check" },
    },
  },
  { kind: "link", label: "About", href: "/about" },
  { kind: "link", label: "Berg", href: "/berg" },
  { kind: "link", label: "Careers", href: "/careers" },
];

/** The header's trailing call to action. */
export const NAV_CTA = { label: "Contact us", href: "/contact" } as const;

/** Real, verified contact details. The email and LinkedIn are the live site's;
    the phone number is the client's own, supplied 2026-09-30 to replace
    +91 9750533701 everywhere it appeared. */
export const CONTACT = {
  email: "connect@hazebergconsulting.com",
  phone: "+91 9042200899",
  phoneHref: "tel:+919042200899",
  linkedin: "https://www.linkedin.com/company/hazeberg",
} as const;

/**
 * The three offices, in full, as the client supplied them on 2026-09-30:
 * headquarters in Erode, an office in Coimbatore, and Penang. That list replaces
 * the live site's two (the Coimbatore address at Annamalai Industrial Park, and
 * Penang). The addresses are theirs, only cased down from the all-caps
 * Malaysian line and broken where a postal address breaks.
 *
 * Here rather than in the footer, which is where they used to live: the footer
 * wants one line each and the Contact page wants the whole address, a time zone
 * and what the office is for. Two copies of an address is how one of them ends
 * up out of date.
 *
 * `role` is the client's word for Erode ("HQ") and `[derived]` for the other
 * two; `hours` are `[derived]` — the ordinary business day in each time zone.
 * Both are safe to correct; neither is a claim about capability.
 */
export const OFFICES = [
  {
    city: "Erode",
    code: "IN",
    country: "India",
    /** The footer's one-liner. */
    short: "Moolapalayam, Erode",
    lines: ["214/5, Vinayagar Kovil Street 2", "Moolapalayam, Erode", "Tamil Nadu 638002"],
    role: "Headquarters",
    tz: "IST · UTC+5:30",
    hours: "Mon–Fri, 9:00–18:30",
  },
  {
    city: "Coimbatore",
    code: "IN",
    country: "India",
    short: "Ksquare Complex, Vinayagapuram",
    lines: [
      "19/A, Ksquare Complex",
      "Villankurichi Rd, Murugan Nagar",
      "Vinayagapuram, Coimbatore",
      "Tamil Nadu 641035",
    ],
    role: "Delivery",
    tz: "IST · UTC+5:30",
    hours: "Mon–Fri, 9:00–18:30",
  },
  {
    city: "Penang",
    code: "MY",
    country: "Malaysia",
    short: "Bandar Cassia, Pulau Pinang",
    lines: ["12A-2, Jalan Vervea 7", "Bandar Cassia", "Pulau Pinang 14110"],
    role: "APAC delivery",
    tz: "MYT · UTC+8",
    hours: "Mon–Fri, 9:00–18:00",
  },
] as const;
