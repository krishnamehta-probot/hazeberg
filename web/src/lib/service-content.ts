/**
 * The module pages — `/services/[slug]`.
 *
 * Six routes, ONE template, per `SITEMAP.md`: "All six share one template and
 * one CMS document type — six documents, not six hand-built pages." This file is
 * that document type, standing in for Sanity until Sanity exists. When the CMS
 * lands, the shape below is the schema and the objects are the documents; the
 * page component does not change.
 *
 * **ONE PAGE IS WRITTEN: `workday-hcm`.** The other five carry their live hero
 * copy and nothing else, and the template renders a marked scaffold for them
 * rather than a broken page or five copies of the same invented paragraphs.
 * That is deliberate — the point of a shared template is that the sixth page
 * costs a content entry, not a build.
 *
 * Marking, as everywhere else in this repo:
 *
 *   [live]   the client's own words, already published on this site
 *   [repo]   already shipping in this repository — the nav's descriptions
 *   [fact]   verifiable from the client's own material
 *   [DRAFT]  written here for shape. NOT the client's words
 *
 * What is real on the HCM page: the label, the lede and the body (all from
 * `SERVICES.items`, live on the home page), the six capability NAMES (the nav's
 * own description lists five of them and `SERVICES.items` names the sixth), and
 * the four figures. Every capability description, all three engagement phases
 * and the closing line are drafts.
 */

export type ServiceCapability = {
  title: string;
  body: string;
};

export type ServicePhase = {
  n: string;
  title: string;
  body: string;
};

export type ServicePage = {
  slug: string;
  /** [live] `SERVICES.items.label`. */
  label: string;
  /** [live] `SERVICES.items.short` — the client's own one-liner. */
  short: string;
  /** [live] `SERVICES.items.body`. */
  lead: string;
  /** Split so the second half can take the accent. */
  titleLead: string;
  titleAccent: string;
  /** [DRAFT] */
  leadSecond?: string;
  meta: readonly { label: string; value: string }[];
  capabilities?: {
    eyebrow: string;
    title: string;
    body: string;
    items: readonly ServiceCapability[];
  };
  engage?: {
    eyebrow: string;
    title: string;
    body: string;
    items: readonly ServicePhase[];
  };
  proof?: {
    eyebrow: string;
    title: string;
    items: readonly { value: string; label: string }[];
  };
  /** Engagement models on `/what-we-do` that apply to this module. Real anchors
      only — these are the links that make the two menus one site rather than
      two lists. */
  related?: readonly { label: string; href: string; body: string }[];
};

/* ---------------------------------------------------------------------------
   The one written page
   --------------------------------------------------------------------------- */

const WORKDAY_HCM: ServicePage = {
  slug: "workday-hcm",
  label: "Workday HCM",
  short: "A stronger foundation for people operations",
  lead: "Build a stronger foundation for your people operations, from core HR processes to talent and workforce management.",
  titleLead: "A stronger foundation for ",
  titleAccent: "people operations.",
  leadSecond:
    "[DRAFT — needs the client] One sentence on what makes an HCM engagement here different from the same engagement bought anywhere else.",
  meta: [
    { label: "Workday experience", value: "12+ years" },
    { label: "Projects delivered", value: "20+" },
    { label: "Countries supported", value: "40+" },
  ],

  capabilities: {
    eyebrow: "What we cover",
    /** [DRAFT] */
    title: "Core HR, and everything built on top of it.",
    /** [DRAFT] */
    body: "[DRAFT — needs the client] One paragraph on how these areas are picked up together or separately, and what a typical scope looks like.",
    /**
     * The six NAMES are real. The nav's own description for Workday HCM reads
     * "Core HR, compensation, time tracking, absence and recruiting" — that is
     * five of them, shipping in the header today — and `SERVICES.items` adds
     * "talent and workforce management" in the client's own body copy. Every
     * description under a name is [DRAFT].
     */
    items: [
      {
        title: "Core HR",
        body: "[DRAFT] Supervisory organizations, positions, business processes and security — the structure everything else hangs off.",
      },
      {
        title: "Compensation",
        body: "[DRAFT] Compensation plans, grades, eligibility rules and the annual cycle.",
      },
      {
        title: "Time Tracking",
        body: "[DRAFT] Time entry, calculations, approvals and the feed into payroll.",
      },
      {
        title: "Absence",
        body: "[DRAFT] Leave types, accruals, entitlements and country-specific rules.",
      },
      {
        title: "Recruiting",
        body: "[DRAFT] Job requisitions, candidate pipeline, and the hand-off into onboarding.",
      },
      {
        title: "Talent & Performance",
        body: "[DRAFT] Reviews, goals, succession and the reporting layer over them.",
      },
    ],
  },

  engage: {
    eyebrow: "How we engage",
    /** [DRAFT] */
    title: "Three ways in, depending on where the tenant is.",
    /** [DRAFT] */
    body: "[DRAFT — needs the client] A line on how the right one is chosen, and who chooses it.",
    items: [
      {
        n: "01",
        title: "[DRAFT] Implement",
        body: "Standing HCM up for the first time, or adding a module to a tenant that does not run it yet.",
      },
      {
        n: "02",
        title: "[DRAFT] Optimize",
        body: "Fixing and extending what is already live, without a project wrapped around every change.",
      },
      {
        n: "03",
        title: "[DRAFT] Support",
        body: "A standing team on the tenant, handling requests and improvements as they arrive.",
      },
    ],
  },

  proof: {
    eyebrow: "Proof",
    /** [DRAFT] heading; every figure under it is [fact] and already published. */
    title: "[DRAFT] What the practice has behind it.",
    items: [
      { value: "20+", label: "Workday projects delivered" },
      { value: "200+", label: "Consolidated years of consultant experience" },
      { value: "40+", label: "Countries supported" },
      { value: "100%", label: "Customer retention" },
    ],
  },

  related: [
    {
      label: "Workday Implementation",
      href: "/what-we-do#workday-implementation",
      body: "Consult, design and configure, through to cut-over.",
    },
    {
      label: "Workday Optimization",
      href: "/what-we-do#workday-optimization",
      body: "Post go-live fixes and new functionality, rolled out safely.",
    },
    {
      label: "Workday AMS",
      href: "/what-we-do#workday-ams",
      body: "A standing team for the tenant you already run.",
    },
  ],
};

/* ---------------------------------------------------------------------------
   The five not yet written
   ---------------------------------------------------------------------------
   Hero copy only, all of it [live] from `SERVICES.items`. The template renders
   these as a marked scaffold — a real opener and an honest statement that the
   rest of the page is not written — rather than as five pages of the HCM copy
   with the nouns swapped, which is how a template turns into filler.
   --------------------------------------------------------------------------- */

const STUB = (
  slug: string,
  label: string,
  short: string,
  lead: string,
  titleLead: string,
  titleAccent: string,
): ServicePage => ({
  slug,
  label,
  short,
  lead,
  titleLead,
  titleAccent,
  meta: [
    { label: "Workday experience", value: "12+ years" },
    { label: "Projects delivered", value: "20+" },
    { label: "Countries supported", value: "40+" },
  ],
});

export const SERVICE_PAGES: Record<string, ServicePage> = {
  "workday-hcm": WORKDAY_HCM,
  "workday-payroll": STUB(
    "workday-payroll",
    "Workday Payroll",
    "Accurate payroll, built around compliance",
    "Support accurate, efficient payroll operations with solutions designed around your business requirements and compliance needs.",
    "Accurate payroll, built around ",
    "compliance.",
  ),
  "workday-financials": STUB(
    "workday-financials",
    "Workday Financials",
    "Structure and visibility for financial operations",
    "Bring greater structure and visibility to financial operations through practical Workday solutions that support better decisions.",
    "Structure and visibility for ",
    "financial operations.",
  ),
  "workday-integrations": STUB(
    "workday-integrations",
    "Workday Integrations",
    "Connecting the systems your business relies on",
    "Connect Workday with the systems your business relies on. From integration design to implementation and support, we help keep information moving reliably.",
    "Connecting the systems ",
    "your business relies on.",
  ),
  "workday-reporting-analytics": STUB(
    "workday-reporting-analytics",
    "Reporting & Analytics",
    "Workday data turned into business insight",
    "Turn Workday data into useful business insight with reporting solutions that help teams understand performance and make informed decisions.",
    "Workday data turned into ",
    "business insight.",
  ),
  "workday-extend": STUB(
    "workday-extend",
    "Workday Extend",
    "Tailored experiences inside your Workday",
    "Build tailored Workday experiences that address specific business requirements while working within your broader Workday environment.",
    "Tailored experiences inside ",
    "your Workday.",
  ),
};

/** The scaffold notice, one place, so five pages say the same thing. */
export const SERVICE_SCAFFOLD = {
  eyebrow: "Not written yet",
  title: "This module page is a scaffold.",
  body: "The opener above is the client's own copy, already live on the home page. Everything below it — what the module covers, how an engagement runs, and the proof — is written once per module and has only been written for Workday HCM so far.",
  reference: { label: "See the written one — Workday HCM", href: "/services/workday-hcm" },
  needs: [
    "Six to eight capability areas, with a line each",
    "How an engagement starts, runs and finishes",
    "Any figure specific to this module",
    "Which engagement models on /what-we-do apply",
  ],
} as const;
