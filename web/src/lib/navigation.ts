/**
 * The site's information architecture — single source of truth for the header,
 * the mobile drawer and (later) the footer.
 *
 * Encoded directly from the signed-off sitemap:
 *
 *   Home                    separate landing page
 *   Services                dropdown only, NO landing page of its own
 *     - 6 Workday services, each its own landing page
 *       (AMS is an engagement model, so it lives on /what-we-do instead)
 *   What we do              separate landing page; every solution is a section
 *                           ON that page (the sitemap marks them "consolidated")
 *   About                   separate landing page; sections consolidated onto it
 *   Berg                    single page — consulting firms / customers extending
 *                           delivery capacity. "For Consultants" deliberately
 *                           lives on Careers instead, as it is hiring-facing.
 *   Careers                 single page
 *   Contact                 single page
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
  | "reporting"
  | "ams"
  | "implementation"
  | "payroll-transformation"
  | "integration-modernization"
  | "health-check"
  | "optimization"
  | "release"
  | "cost"
  | "story"
  | "leadership"
  | "team"
  | "life"
  | "certifications"
  | "rewards";

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
  {
    kind: "menu",
    label: "What we do",
    href: "/what-we-do",
    lede: {
      title: "From first deployment to year ten",
      body: "Eight engagement models covering the whole Workday lifecycle — pick the one that matches where your tenant is today.",
    },
    viewAll: { label: "View all solutions", href: "/what-we-do" },
    columns: [
      {
        heading: "Get live",
        items: [
          {
            label: "Workday Implementation",
            href: "/what-we-do#workday-implementation",
            icon: "implementation",
            description: "Consult, design and configure, through to cut-over.",
          },
          {
            label: "Payroll Transformation",
            href: "/what-we-do#payroll-transformation",
            icon: "payroll-transformation",
            description: "Move payroll onto Workday without breaking a cycle.",
          },
          {
            label: "Integration Modernization",
            href: "/what-we-do#integration-modernization",
            icon: "integration-modernization",
            description: "Retire brittle point-to-point feeds for supported patterns.",
          },
          {
            label: "Workday Health Check",
            href: "/what-we-do#workday-health-check",
            icon: "health-check",
            description: "A structured read on tenant health before you commit budget.",
          },
        ],
      },
      {
        heading: "Stay ahead",
        items: [
          {
            label: "Workday Optimization",
            href: "/what-we-do#workday-optimization",
            icon: "optimization",
            description: "Post go-live fixes and new functionality, rolled out safely.",
          },
          {
            label: "Workday AMS",
            href: "/what-we-do#workday-ams",
            icon: "ams",
            description: "A standing team for the tenant you already run.",
          },
          {
            label: "Release Management",
            href: "/what-we-do#release-management",
            icon: "release",
            description: "Two Workday releases a year, tested and adopted on time.",
          },
          {
            label: "Cost Optimization",
            href: "/what-we-do#cost-optimization",
            icon: "cost",
            description: "Take spend out of the run without taking out capability.",
          },
        ],
      },
    ],
    feature: {
      eyebrow: "Case study",
      title: "Half a million dollars a year",
      body: "What a Fortune 500 client got from moving to Workday:",
      tags: ["40% faster HR processing", "30% fewer payroll errors", "50% faster onboarding"],
      href: "/what-we-do#case-studies",
      ctaLabel: "Read the case studies",
      tone: "quiet",
    },
    footnote: {
      text: "Already live on Workday?",
      cta: { label: "See how our AMS model works", href: "/what-we-do#workday-ams" },
    },
  },
  {
    kind: "menu",
    label: "About",
    href: "/about",
    lede: {
      title: "The people behind the tenant",
      body: "Recognized by the Government of India and ISO certified, with offices in Coimbatore and Penang.",
    },
    viewAll: { label: "About Hazeberg", href: "/about" },
    columns: [
      {
        items: [
          {
            label: "Our story",
            href: "/about#our-story",
            icon: "story",
            description: "Why a Workday-only consultancy, and why now.",
          },
          {
            label: "Leadership",
            href: "/about#leadership",
            icon: "leadership",
            description: "Founded and led by Sakthi Vignesh.",
          },
          {
            label: "Our team",
            href: "/about#our-team",
            icon: "team",
            description: "The consultants who do the actual work.",
          },
        ],
      },
      {
        items: [
          {
            label: "Life at Hazeberg",
            href: "/about#life-at-hazeberg",
            icon: "life",
            description: "How we work, and what it is like to work here.",
          },
          {
            label: "Certifications",
            href: "/about#certifications",
            icon: "certifications",
            description: "ISO certified; recognized by the Government of India.",
          },
          {
            label: "Rewards",
            href: "/about#rewards",
            icon: "rewards",
            description: "Recognition earned by the team and by the work.",
          },
        ],
      },
    ],
    footnote: {
      text: "Want to work here?",
      cta: { label: "See open roles", href: "/careers" },
    },
  },
  { kind: "link", label: "Berg", href: "/berg" },
  { kind: "link", label: "Careers", href: "/careers" },
];

/** The header's trailing call to action. */
export const NAV_CTA = { label: "Contact us", href: "/contact" } as const;

/** Real, verified contact details — lifted from the live site. */
export const CONTACT = {
  email: "connect@hazebergconsulting.com",
  phone: "+91 9750533701",
  phoneHref: "tel:+919750533701",
  linkedin: "https://www.linkedin.com/company/hazeberg",
} as const;

/**
 * The two offices, in full. `[live]` §17 — the addresses are exactly as the live
 * site prints them, only cased down from its all-caps Malaysian line.
 *
 * Here rather than in the footer, which is where they used to live: the footer
 * wants one line each and the Contact page wants the whole address, a timezone
 * and what the office is for. Two copies of an address is how one of them ends
 * up out of date.
 *
 * `role` and `hours` are `[derived]` — the split of work between the two offices
 * is not stated anywhere on the live site, and the hours are the ordinary
 * business day in each timezone. Both are safe to correct; neither is a claim
 * about capability.
 */
export const OFFICES = [
  {
    city: "Coimbatore",
    code: "IN",
    country: "India",
    /** The footer's one-liner. */
    short: "Annamalai Industrial Park, Kalapatti",
    lines: [
      "Annamalai Industrial Park, 227/1A",
      "Sharp Nagar, Nehru Nagar West",
      "Kalapatti, Coimbatore",
      "Tamil Nadu 641048",
    ],
    role: "Headquarters and delivery",
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
