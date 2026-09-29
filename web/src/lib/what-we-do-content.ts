/**
 * What we do — the eight engagement models, on one page.
 *
 * **DRAFT.** Same marking scheme as `about-content.ts`:
 *
 *   [live]   the client's own words, already published on this site
 *   [repo]   already written into this repository and shipping — the nav's own
 *            one-line descriptions, which are live in the header dropdown today
 *   [DRAFT]  written here to give the section a shape. NOT the client's words
 *   [EMPTY]  nothing exists; the page renders a marked slot
 *
 * THE ANCHORS ARE THE NAV'S, NOT THE SITEMAP'S. `SITEMAP.md` lists these eight
 * short (`#implementation`, `#ams`, `#health-check`); `navigation.ts` links the
 * long forms and those links ship in the header today. The live contract wins
 * and the sitemap is corrected, exactly as it was for `/about`.
 *
 * The two groups — "Get live" and "Stay ahead" — are the nav's own columns, in
 * the nav's own order. They are the page's argument in four words: this half is
 * for a tenant you are building, that half is for a tenant you are running.
 *
 * What is real on this page: the eight names, the eight one-line descriptions,
 * the group split, and the figures. What is not: every body paragraph, every
 * "what it covers" list, and every "best when" line. That is the writing job,
 * and it is eight times the same shape — which is exactly why the shape is
 * settled here first and the words go in afterwards.
 *
 * `AMS` is the one entry that also appears in the Services menu. That is
 * deliberate and recorded in `SITEMAP.md`: the client confirmed six Services
 * pages and AMS was the seventh, so it lives here as an engagement model rather
 * than there as a module. `SERVICES.items` still carries it, pointing at
 * `/what-we-do#workday-ams`.
 */

export type Engagement = {
  id: string;
  n: string;
  group: "Get live" | "Stay ahead";
  title: string;
  /** [repo] The nav's own description for this item. */
  lede: string;
  /** [DRAFT] */
  body: string;
  /** [DRAFT] */
  covers: readonly string[];
  /** [DRAFT] The qualifying line — who this is the right answer for. */
  bestWhen: string;
  /** A related module page, where one exists. Real routes only. */
  related?: { label: string; href: string };
};

export const WHAT_WE_DO = {
  eyebrow: "What we do",
  /** [repo] The nav's own lede title for this menu. */
  titleLead: "From first deployment ",
  titleAccent: "to year ten.",
  /** [repo] The nav's lede body. */
  lead: "Eight engagement models covering the whole Workday lifecycle — pick the one that matches where your tenant is today.",
  /** [DRAFT] */
  leadSecond:
    "[DRAFT — needs the client] One sentence on how an engagement actually starts, and what a client is committing to when it does.",
  meta: [
    { label: "Engagement models", value: "Eight" },
    { label: "Workday experience", value: "12+ years" },
    { label: "Countries supported", value: "40+" },
  ],

  railLabel: "Engagement models",

  /** [DRAFT] The two group headings are the nav's; the lines under them are not. */
  groups: [
    {
      name: "Get live",
      body: "[DRAFT] For a tenant you are building, moving or rebuilding.",
    },
    {
      name: "Stay ahead",
      body: "[DRAFT] For a tenant you already run, and have to keep running.",
    },
  ],

  items: [
    {
      id: "workday-implementation",
      n: "01",
      group: "Get live",
      title: "Workday Implementation",
      lede: "Consult, design and configure, through to cut-over.",
      body: "[DRAFT — needs the client] What a Hazeberg implementation looks like from the client's side: who is in the room, how long the phases run, and what the client's own team is doing while it happens.",
      covers: [
        "[DRAFT] Discovery and design",
        "[DRAFT] Configuration and iteration",
        "[DRAFT] Data conversion and validation",
        "[DRAFT] Testing, training and cut-over",
      ],
      bestWhen: "[DRAFT] Best when you are moving onto Workday, or onto a module you do not run yet.",
      related: { label: "Workday HCM", href: "/services/workday-hcm" },
    },
    {
      id: "payroll-transformation",
      n: "02",
      group: "Get live",
      title: "Payroll Transformation",
      lede: "Move payroll onto Workday without breaking a cycle.",
      body: "[DRAFT — needs the client] Payroll is the one workstream that cannot be late. Say how parallel runs are structured, how many cycles are run in parallel, and what the sign-off gate is.",
      covers: [
        "[DRAFT] Current-state payroll analysis",
        "[DRAFT] Configuration and pay component design",
        "[DRAFT] Parallel testing cycles",
        "[DRAFT] First live run, supported",
      ],
      bestWhen: "[DRAFT] Best when payroll is moving onto Workday, or off a legacy engine.",
      related: { label: "Workday Payroll", href: "/services/workday-payroll" },
    },
    {
      id: "integration-modernization",
      n: "03",
      group: "Get live",
      title: "Integration Modernization",
      lede: "Retire brittle point-to-point feeds for supported patterns.",
      body: "[DRAFT — needs the client] What gets replaced and what gets kept, and how a tenant with years of accumulated custom feeds is moved onto Core Connectors, Studio and EIBs without a freeze.",
      covers: [
        "[DRAFT] Integration inventory and risk read",
        "[DRAFT] Pattern selection — Core Connector, Studio, EIB, API",
        "[DRAFT] Rebuild and parallel run",
        "[DRAFT] Monitoring and handover",
      ],
      bestWhen: "[DRAFT] Best when integrations break on every release, or nobody left knows how one works.",
      related: { label: "Workday Integrations", href: "/services/workday-integrations" },
    },
    {
      id: "workday-health-check",
      n: "04",
      group: "Get live",
      title: "Workday Health Check",
      lede: "A structured read on tenant health before you commit budget.",
      body: "[DRAFT — needs the client] The scope, the duration and — most importantly — the deliverable. A health check is bought on what the client is holding at the end of it.",
      covers: [
        "[DRAFT] Configuration and security review",
        "[DRAFT] Integration and reporting review",
        "[DRAFT] Adoption and process gaps",
        "[DRAFT] Prioritised findings and a costed plan",
      ],
      bestWhen: "[DRAFT] Best when you suspect something is wrong but cannot yet name it.",
    },
    {
      id: "workday-optimization",
      n: "05",
      group: "Stay ahead",
      title: "Workday Optimization",
      lede: "Post go-live fixes and new functionality, rolled out safely.",
      body: "[DRAFT — needs the client] How work is prioritised once the tenant is live, and how a change gets from a request to production without a project around it.",
      covers: [
        "[DRAFT] Backlog triage and prioritisation",
        "[DRAFT] Configuration changes and new functionality",
        "[DRAFT] Regression testing",
        "[DRAFT] Adoption support",
      ],
      bestWhen: "[DRAFT] Best when the tenant is live and the list of things to fix keeps growing.",
    },
    {
      id: "workday-ams",
      n: "06",
      group: "Stay ahead",
      title: "Workday AMS",
      lede: "A standing team for the tenant you already run.",
      /** [live] `SERVICES.items` — the client's own AMS paragraph, already
          published on the home page. The only body on this page that is real. */
      body: "Keep your Workday environment running after go-live with responsive support, ongoing improvements, and a team that understands your system.",
      covers: [
        "[DRAFT] Named team and response targets",
        "[DRAFT] Incident and request handling",
        "[DRAFT] Continuous improvement backlog",
        "[DRAFT] Release support included",
      ],
      bestWhen: "[DRAFT] Best when you need Workday capability standing by rather than hired per project.",
    },
    {
      id: "release-management",
      n: "07",
      group: "Stay ahead",
      title: "Release Management",
      lede: "Two Workday releases a year, tested and adopted on time.",
      body: "[DRAFT — needs the client] What happens in the weeks around a Workday release: what is tested, what is adopted, and who signs it off.",
      covers: [
        "[DRAFT] Release impact assessment",
        "[DRAFT] Regression testing",
        "[DRAFT] New-feature evaluation and adoption",
        "[DRAFT] Communications and training",
      ],
      bestWhen: "[DRAFT] Best when releases arrive faster than your team can absorb them.",
    },
    {
      id: "cost-optimization",
      n: "08",
      group: "Stay ahead",
      title: "Cost Optimization",
      lede: "Take spend out of the run without taking out capability.",
      body: "[DRAFT — needs the client] Where the money actually goes in a Workday run, which of it is avoidable, and what a client should expect to save. A number here would be worth more than any paragraph.",
      covers: [
        "[DRAFT] Run-cost breakdown",
        "[DRAFT] Licence and module utilisation",
        "[DRAFT] Support model comparison",
        "[DRAFT] A costed reduction plan",
      ],
      bestWhen: "[DRAFT] Best when the Workday run costs more than anyone can justify line by line.",
    },
  ] as readonly Engagement[],

  /** [DRAFT] */
  closing: {
    eyebrow: "Not sure which one",
    title: "Start with a Workday Health Check.",
    body: "[DRAFT — needs the client] One line on why the health check is the honest first step when the answer is not obvious.",
    cta: { label: "Talk to us", href: "/contact" },
  },

  cross: {
    eyebrow: "By module",
    title: "Workday services",
    body: "HCM, Payroll, Financials, Integrations, Reporting and Extend — the module pages, where an engagement meets a product area.",
    href: "/services/workday-hcm",
  },
} as const;
