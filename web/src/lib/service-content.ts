/**
 * The module pages — `/services/[slug]`.
 *
 * Six routes, ONE template, per `SITEMAP.md`: "All six share one template and
 * one CMS document type — six documents, not six hand-built pages." This file is
 * that document type, standing in for Sanity until Sanity exists. When the CMS
 * lands, the shape below is the schema and the objects are the documents; the
 * page component does not change.
 *
 * **FOUR PAGES ARE WRITTEN**, each from its own client document, supplied
 * 2026-10-02: Workday HCM, Workday Payroll, Workday Financials and Workday
 * Integrations. Reporting & Analytics and Extend have no document yet; they keep
 * their live opener and the marked scaffold.
 *
 * All four documents share one structure — hero, six capability stages, three
 * audiences of four, three engagement routes, one section of the module's own,
 * a call to action and five questions — so the template does too. The one
 * section that differs is `feature`, a union: Industries (HCM), the two payroll
 * models (Payroll), connected finance (Financials), and what we connect
 * (Integrations).
 *
 * Marking:
 *
 *   (unmarked)  the client's words, verbatim. The documents are already in US
 *               English, which the site uses throughout
 *   [derived]   structure the page needs that the document implies but does not
 *               write: a link target, a key, an accent split the document did
 *               not specify, a figure lifted out of the document's own sentence
 *   [live]      the client's own words already published on this site
 *
 * Links: every "Links to" in the documents points at the capability of that
 * name on `/what-we-do`, whose eight anchors are a contract. Related services
 * link to the module page of that name, or to `#workday-ams`, which is an
 * engagement model rather than a module (see `SITEMAP.md`).
 */

/** Which module — keys the icon, and nothing else. */
export type ServiceIconKey = "hcm" | "payroll" | "financials" | "integrations" | "reporting" | "extend";

export type ServiceLink = { label: string; href: string };

/** A capability under a stage: a plain line, or — once, on HCM — a line that is
    a door to another module page. */
export type StageItem = string | ServiceLink;

export type ServiceStage = {
  /** [derived] Stable key for icons and anchors. Never shown. */
  key: string;
  /** The document's stage word — set in caps by the component, stored as read. */
  stage: string;
  /** The capability area. */
  area: string;
  /** The one line under it. */
  line: string;
  items: readonly StageItem[];
};

export type ServiceAudience = {
  /** [derived] */
  key: string;
  name: string;
  features: readonly { title: string; line: string }[];
};

export type ServiceRoute = {
  n: string;
  name: string;
  line: string;
  link: ServiceLink;
};

export type ServiceFeature =
  | {
      kind: "industries";
      id: string;
      eyebrow: string;
      title: string;
      body: string;
      items: readonly { key: string; sector: string; line: string; tags: readonly string[] }[];
    }
  | {
      kind: "models";
      id: string;
      eyebrow: string;
      title: string;
      body: string;
      models: readonly { key: string; name: string; line: string; points: readonly string[] }[];
      /** [derived] The three figures in the document's own intro, lifted out so
          they can be drawn. Nothing here that the intro does not say. */
      reach: readonly { value: string; label: string; detail?: string }[];
    }
  | {
      kind: "flows";
      id: string;
      eyebrow: string;
      title: string;
      body: string;
      /** [derived] What sits in the middle of the picture. */
      hub: string;
      /** `in` — everything arrives at the hub (the ledger). `out` — the hub
          feeds everything (Workday, the record). */
      direction: "in" | "out";
      items: readonly { key: string; name: string; vendor?: string; line: string }[];
    };

export type WrittenService = {
  written: true;
  slug: string;
  label: string;
  icon: ServiceIconKey;
  /** [live] `SERVICES.items.short`, kept for the meta description fallback. */
  short: string;
  hero: {
    eyebrow: string;
    /** The headline, split so the second half can carry the amber. */
    titleLead: string;
    titleAccent: string;
    intro: string;
    differentiator: string;
    primary: ServiceLink;
    secondary: ServiceLink;
    outcomes: readonly { title: string; label: string }[];
  };
  capabilities: {
    id: string;
    eyebrow: string;
    title: string;
    body: string;
    stages: readonly ServiceStage[];
    /** A line under the stages, where the document has one (Financials). */
    footnote?: string;
  };
  audiences: {
    id: string;
    eyebrow: string;
    title: string;
    body: string;
    groups: readonly ServiceAudience[];
  };
  engage: {
    id: string;
    eyebrow: string;
    title: string;
    body: string;
    routes: readonly ServiceRoute[];
  };
  feature: ServiceFeature;
  cta: {
    title: string;
    body: string;
    button: ServiceLink;
    related: readonly ServiceLink[];
  };
  faq: {
    id: string;
    eyebrow: string;
    title: string;
    items: readonly { q: string; a: string }[];
  };
};

/** The two modules with no document yet: the live opener and nothing else. */
export type StubService = {
  written: false;
  slug: string;
  label: string;
  icon: ServiceIconKey;
  short: string;
  lead: string;
  titleLead: string;
  titleAccent: string;
};

export type ServicePage = WrittenService | StubService;

/* ---------------------------------------------------------------------------
   Shared links
   --------------------------------------------------------------------------- */

const CONTACT_HREF = "/contact";
/** [derived] Every "Book a … Health Check" goes to the Health Check itself on
    What we do, which carries its own call to action. */
const HEALTH_CHECK = "/what-we-do#workday-health-check";

const IMPLEMENTATION: ServiceLink = {
  label: "Workday Implementation",
  href: "/what-we-do#workday-implementation",
};
const OPTIMIZATION: ServiceLink = {
  label: "Workday Optimization",
  href: "/what-we-do#workday-optimization",
};
const MODERNIZATION: ServiceLink = {
  label: "Integration Modernization",
  href: "/what-we-do#integration-modernization",
};
const AMS: ServiceLink = { label: "Workday AMS", href: "/what-we-do#workday-ams" };

const R_HCM: ServiceLink = { label: "Workday HCM", href: "/services/workday-hcm" };
const R_PAYROLL: ServiceLink = { label: "Workday Payroll", href: "/services/workday-payroll" };
const R_FINANCIALS: ServiceLink = { label: "Workday Financials", href: "/services/workday-financials" };
const R_INTEGRATIONS: ServiceLink = {
  label: "Workday Integrations",
  href: "/services/workday-integrations",
};
const R_REPORTING: ServiceLink = {
  label: "Workday Reporting and Analytics",
  href: "/services/workday-reporting-analytics",
};
const R_EXTEND: ServiceLink = { label: "Workday Extend", href: "/services/workday-extend" };

/* ---------------------------------------------------------------------------
   Workday HCM
   --------------------------------------------------------------------------- */

const WORKDAY_HCM: WrittenService = {
  written: true,
  slug: "workday-hcm",
  label: "Workday HCM",
  icon: "hcm",
  short: "A stronger foundation for people operations",
  hero: {
    eyebrow: "Workday HCM",
    titleLead: "People first, ",
    titleAccent: "processes that follow.",
    intro:
      "Core HR, Payroll, Compensation, Time, Absence and Recruiting, set up so every part of an employee's working life runs smoothly.",
    differentiator:
      "Nobody at Hazeberg works on anything but Workday. The consultants designing your HCM start from how your people actually work, and they are still with you years after go-live.",
    primary: { label: "Talk to an HCM specialist", href: CONTACT_HREF },
    secondary: { label: "Book an HCM Health Check", href: HEALTH_CHECK },
    outcomes: [
      { title: "Ready on day one", label: "New hires set up before they walk in" },
      { title: "Fewer HR tickets", label: "Employees find their own answers" },
      { title: "Managers who log in", label: "Approvals and team data in one place" },
      { title: "Pay right first time", label: "Time, absence and pay on one record" },
    ],
  },
  capabilities: {
    id: "capabilities",
    eyebrow: "HCM capabilities",
    title: "From the first interview to every payslip after it.",
    body: "Nobody experiences HCM as six modules. People experience getting hired, getting set up, growing in a role, getting paid and taking time off. We build each area around that moment first, then configure the process to follow.",
    stages: [
      {
        key: "hired",
        stage: "Hired",
        area: "Recruiting and onboarding",
        line: "Good candidates don't wait, and your hiring process shouldn't make them.",
        items: [
          "Requisitions and candidate pipelines",
          "Careers site and candidate experience",
          "Offer letters generated with Workday Docs",
          "Background checks and onboarding before day one",
        ],
      },
      {
        key: "set-up",
        stage: "Set up",
        area: "Core HR",
        line: "One clean record for every person, and everything else reads from it.",
        items: [
          "Worker records and employee self-service",
          "Organizations, positions and job architecture",
          "Business processes and role-based security",
          "Country-specific data and local compliance",
        ],
      },
      {
        key: "growing",
        stage: "Growing",
        area: "Talent and learning",
        line: "Know what your people can do and where they could go next.",
        items: [
          "Goals, reviews and ongoing feedback",
          "Skills Cloud and career paths",
          "Talent reviews and succession plans",
          "Learning programs and required training",
        ],
      },
      {
        key: "rewarded",
        stage: "Rewarded",
        area: "Compensation and benefits",
        line: "Pay decisions people can see the logic behind.",
        items: [
          "Plans, grades and eligibility rules",
          "Merit, bonus and stock grant cycles",
          "Benefits enrollment and life events",
          "Carrier connections that stay in sync",
        ],
      },
      {
        key: "on-the-clock",
        stage: "On the clock",
        area: "Time and absence",
        line: "Hours and leave recorded once, and recorded right.",
        items: [
          "Time entry, calculations and approvals",
          "Shift, overtime and scheduling rules",
          "Leave plans, accruals and balances",
          "Country leave policies configured, not worked around",
        ],
      },
      {
        key: "paid",
        stage: "Paid",
        area: "Payroll",
        line: "Payday is the one process nobody forgives you for getting wrong.",
        items: [
          "Workday Payroll or your own provider",
          "Earnings, deductions and pay rules",
          "Time, absence and benefits flowing into pay",
          /* [derived] the document's own pointer, made a link. */
          { label: "More on our Workday Payroll page", href: "/services/workday-payroll" },
        ],
      },
    ],
  },
  audiences: {
    id: "who-its-for",
    eyebrow: "Who it's built for",
    title: "One system, three very different users.",
    body: "At Hazeberg, putting people first means designing for the ones who use HCM every day, then letting the processes follow. Here is what changes for each of them.",
    groups: [
      {
        key: "employees",
        name: "Employees",
        features: [
          {
            title: "Self-service",
            line: "Update details, request leave and check pay without raising a ticket.",
          },
          {
            title: "Everything on a phone",
            line: "Leave requests, payslips and profile updates, all from mobile.",
          },
          {
            title: "A profile that keeps up",
            line: "Skills and career goals kept current, from a profile or from chat.",
          },
          {
            title: "Balances on hand",
            line: "Leave, pay and benefit details visible without asking HR.",
          },
        ],
      },
      {
        key: "managers",
        name: "Managers",
        features: [
          {
            title: "One place to approve",
            line: "Every request arrives with the context needed to decide.",
          },
          {
            title: "The team at a glance",
            line: "Skills, absence and availability in one view before work is staffed.",
          },
          {
            title: "Reviews without spreadsheets",
            line: "Performance and pay cycles run inside Workday from start to finish.",
          },
          {
            title: "Hiring on the move",
            line: "Interview feedback and offer approvals done from a phone.",
          },
        ],
      },
      {
        key: "hr-teams",
        name: "HR teams",
        features: [
          {
            title: "Connected processes",
            line: "Hiring, onboarding and pay hand off to each other without rekeying.",
          },
          {
            title: "Answers without exports",
            line: "Dashboards and reports that settle questions inside Workday.",
          },
          {
            title: "One policy, many countries",
            line: "Local rules configured once and applied the same way every time.",
          },
          {
            title: "Time for people",
            line: "Less admin, and more hours for the cases that need judgment.",
          },
        ],
      },
    ],
  },
  engage: {
    id: "how-we-engage",
    eyebrow: "How we engage",
    title: "Three ways in, depending on where you are with Workday.",
    body: "The right route depends on whether HCM is new to you, live but not working as it should, or live and in need of a steady hand. We recommend one after a first conversation, and you decide.",
    routes: [
      {
        n: "01",
        name: "Implement",
        line: "Standing HCM up for the first time, or adding a module you don't run yet. We design around your processes, configure, convert data, test and take you live.",
        link: IMPLEMENTATION,
      },
      {
        n: "02",
        name: "Optimize",
        line: "Fixing and extending what is already live, without a project wrapped around every change.",
        link: OPTIMIZATION,
      },
      {
        n: "03",
        name: "Support",
        line: "A standing team on your Workday, handling requests, releases and improvements as they arrive.",
        link: AMS,
      },
    ],
  },
  feature: {
    kind: "industries",
    id: "industries",
    eyebrow: "Industries",
    title: "The same platform, very different workforces.",
    body: "HCM has to fit the people it serves. These are the sectors we work in, and what HCM has to get right in each of them.",
    items: [
      {
        key: "higher-education",
        sector: "Higher education",
        line: "Faculty, staff and student workers on one system, alongside Workday Student.",
        tags: ["Academic appointments", "Student worker jobs", "HR and Student working together"],
      },
      {
        key: "healthcare",
        sector: "Healthcare",
        line: "Round-the-clock staffing, where time and leave rules cannot slip.",
        tags: ["Shift and on-call time", "Certifications that stay current", "Complex leave rules"],
      },
      {
        key: "financial-services",
        sector: "Financial services",
        line: "Regulated roles and pay decisions that have to stand up to audit.",
        tags: ["Role-based security", "Compensation governance", "Audit-ready approvals"],
      },
      {
        key: "retail",
        sector: "Retail",
        line: "Large hourly workforces that change with the season.",
        tags: ["Hourly and seasonal hiring", "Time tracking at volume", "Fast onboarding"],
      },
      {
        key: "fintech",
        sector: "Fintech",
        line: "Fast-growing teams that outgrow spreadsheets quickly.",
        tags: ["Rapid hiring", "Multi-country teams", "Compensation as headcount grows"],
      },
      {
        key: "ai-technology",
        sector: "AI and technology",
        line: "Skills-based teams where talent moves faster than the org chart.",
        tags: ["Skills Cloud", "Distributed teams", "Internal mobility"],
      },
    ],
  },
  cta: {
    title: "Not sure where to start with HCM?",
    body: "Tell us how your people work today, and we'll show you what Workday HCM should look like around them.",
    button: { label: "Talk to an HCM specialist", href: CONTACT_HREF },
    related: [R_PAYROLL, R_INTEGRATIONS, R_REPORTING],
  },
  faq: {
    id: "questions",
    eyebrow: "Questions",
    title: "Questions we hear about Workday HCM.",
    items: [
      {
        q: "Do we have to implement every HCM area at once?",
        a: "No. Many organizations go live with Core HR and a few essentials, then add Recruiting, Compensation, Talent or Learning in later phases. We plan the order with you so that each phase stands on its own.",
      },
      {
        q: "We're already live on HCM. Can you help without starting a new project?",
        a: "Yes. Through optimization or AMS, we fix what isn't working and add new functionality in small, tested changes. A Health Check is often the quickest way to see where to begin.",
      },
      {
        q: "Can you take over HCM support from our current partner?",
        a: "Yes. We plan the takeover around your third-party dependencies and run knowledge transfer with checkpoints, so nothing is lost along the way.",
      },
      {
        q: "How does HCM connect to payroll?",
        a: "Time, absence, compensation and benefits all feed pay, so we configure them with payroll in mind, whether you run Workday Payroll or a third-party provider. Our Workday Payroll page covers this in more detail.",
      },
      {
        q: "Can you support a workforce spread across countries?",
        a: "Yes. We support customers in 40+ countries, with delivery teams in India and Malaysia covering multiple time zones.",
      },
    ],
  },
};

/* ---------------------------------------------------------------------------
   Workday Payroll
   --------------------------------------------------------------------------- */

const WORKDAY_PAYROLL: WrittenService = {
  written: true,
  slug: "workday-payroll",
  label: "Workday Payroll",
  icon: "payroll",
  short: "Accurate payroll, built around compliance",
  hero: {
    eyebrow: "Workday Payroll",
    titleLead: "Every input right, ",
    titleAccent: "every payday on time.",
    intro:
      "Pay calculation, deductions, tax, payments, and year-end, set up so every pay run closes cleanly and every employee gets exactly what they're owed.",
    differentiator:
      "Workday Payroll or your own provider: the payroll team at Hazeberg is certified for both routes, and spends as much time on the time and absence rules that feed pay as on the pay run itself.",
    primary: { label: "Talk to a payroll specialist", href: CONTACT_HREF },
    secondary: { label: "Book a Payroll Health Check", href: HEALTH_CHECK },
    outcomes: [
      { title: "No rekeying", label: "HR changes reach payroll on their own" },
      { title: "Fewer off-cycle runs", label: "Inputs right before the calculation starts" },
      { title: "Audit-ready every period", label: "Every change traceable to who made it" },
      { title: "Payslips people trust", label: "Clear pay details on any device" },
    ],
  },
  capabilities: {
    id: "capabilities",
    eyebrow: "Payroll capabilities",
    title: "Every pay period, from first input to final posting.",
    body: "A payroll is only as good as what goes into it. We set up each stage of the cycle so errors are stopped where they start, rather than found by an employee reading their payslip.",
    stages: [
      {
        key: "inputs",
        stage: "Inputs",
        area: "Pay inputs",
        line: "Pay usually goes wrong long before the pay run.",
        items: [
          "Time Tracking and Absence rules built to feed pay",
          "Compensation and job changes in before the cut-off",
          "Benefit deductions in step with enrollments",
          "One-time payments and adjustments",
        ],
      },
      {
        key: "calculate",
        stage: "Calculate",
        area: "Pay setup and calculation",
        line: "Pay groups, earnings and deductions built the way your policies actually read.",
        items: [
          "Pay groups, calendars and periods",
          "Earnings, deductions and the rules behind them",
          "Continuous calculation as changes happen",
          "Retro pay and off-cycle runs inside Workday",
        ],
      },
      {
        key: "check",
        stage: "Check",
        area: "Audit and accuracy",
        line: "Catch it in the audit, not on the payslip.",
        items: [
          "Pre-payroll audit reports for every run",
          "Period-on-period variance checks",
          "Pay anomaly detection and Payroll Agent",
          "Sign-off before results are final",
        ],
      },
      {
        key: "pay",
        stage: "Pay",
        area: "Payments and payslips",
        line: "Money where it should be, on the day it should be there.",
        items: [
          "Settlement and payment files",
          "On-demand and off-cycle payments",
          "Bank details and payment elections in self-service",
          "Payslips readable on any device",
        ],
      },
      {
        key: "post",
        stage: "Post",
        area: "Payroll accounting",
        line: "Payroll costs that land in the right place in finance.",
        items: [
          "Costing by cost center, project or grant",
          "Journals to Workday Financials or your ERP",
          "Payroll-to-ledger reconciliation",
          "Labor cost reporting",
        ],
      },
      {
        key: "close",
        stage: "Close",
        area: "Tax, compliance and year-end",
        line: "Year-end without the scramble.",
        items: [
          "Tax and statutory updates applied as they arrive",
          "Statutory reporting by country",
          "Year-end processing and balance checks",
          "Employee tax documents in self-service",
        ],
      },
    ],
  },
  audiences: {
    id: "who-its-for",
    eyebrow: "Who it's built for",
    title: "Three groups who feel every pay run.",
    body: "Payroll lands on more desks than almost any other HR process. Here is what changes for each of them.",
    groups: [
      {
        key: "employees",
        name: "Employees",
        features: [
          {
            title: "Payslips that make sense",
            line: "Every earning and deduction laid out clearly, on any device.",
          },
          {
            title: "Changes paid on time",
            line: "Late changes land in the right pay run, not a correction run later.",
          },
          {
            title: "Payment details in their hands",
            line: "Bank accounts and payment elections updated directly.",
          },
          {
            title: "Tax forms on demand",
            line: "Year-end documents available in self-service without asking.",
          },
        ],
      },
      {
        key: "payroll-team",
        name: "Payroll team",
        features: [
          { title: "Exceptions first", line: "Audit reports that point straight at what changed." },
          {
            title: "Less keyed by hand",
            line: "HR changes arrive on their own, so fewer inputs need checking.",
          },
          {
            title: "Results ahead of the run",
            line: "Continuous calculation shows pay as changes land, not on the night of the run.",
          },
          { title: "Time for judgment", line: "More hours for the cases that need a person." },
        ],
      },
      {
        key: "finance",
        name: "Finance",
        features: [
          {
            title: "Costs in the right place",
            line: "Payroll posted to the right cost centers, projects and grants.",
          },
          {
            title: "Reconciled as you go",
            line: "Payroll and the ledger agree without a month-end chase.",
          },
          {
            title: "Labor cost visibility",
            line: "Workforce cost reporting on the same data HR uses.",
          },
          {
            title: "A clean audit trail",
            line: "Every pay change traceable to who made it and when.",
          },
        ],
      },
    ],
  },
  engage: {
    id: "how-we-engage",
    eyebrow: "How we engage",
    title: "Three ways in, depending on where you are with Workday.",
    body: "The right route depends on whether you are moving payroll to Workday, already paying people through it, or need a team to keep every cycle on track.",
    routes: [
      {
        n: "01",
        name: "Implement",
        line: "Moving payroll onto Workday Payroll, or connecting your provider to Workday. Configuration, data conversion, parallel runs and a cut-over planned around your pay calendar.",
        link: IMPLEMENTATION,
      },
      {
        n: "02",
        name: "Optimize",
        line: "Fixing what slows each pay run down: manual workarounds, noisy audit reports and integrations that need hand-holding.",
        link: OPTIMIZATION,
      },
      {
        n: "03",
        name: "Support",
        line: "A standing team for every pay cycle, year-end and statutory change, with coverage across time zones.",
        link: AMS,
      },
    ],
  },
  feature: {
    kind: "models",
    id: "payroll-model",
    eyebrow: "Your payroll model",
    title: "Two ways to run payroll on Workday. We do both.",
    body: "Workday Payroll runs natively in the US, Canada, the UK, Ireland, France and Australia, and reaches 60+ countries with Strada. Beyond that, payroll stays with a local provider and Workday feeds it everything it needs, with certified partner connections covering 180+ countries. Many organizations run both models at once, country by country.",
    models: [
      {
        key: "workday-payroll",
        name: "Workday Payroll",
        line: "Pay calculated inside Workday, on the same record as HR.",
        points: [
          "Pay groups, earnings, deductions and tax setup",
          "Parallel runs reconciled against your legacy payroll before cut-over",
          "Support through every pay cycle and year-end",
        ],
      },
      {
        key: "third-party",
        name: "Third-party payroll",
        line: "Your provider keeps the calculation, and Workday keeps the record.",
        points: [
          "Cloud Connect for Third-Party Payroll, sending every effective-dated change through PECI",
          "Results, payslips and tax documents brought back into Workday",
          "Connections to providers such as ADP, built and maintained by our integration team",
        ],
      },
    ],
    /* [derived] The intro's three figures, in its own order. */
    reach: [
      {
        value: "6",
        label: "Countries native",
        detail: "US, Canada, UK, Ireland, France, Australia",
      },
      { value: "60+", label: "Countries with Strada" },
      { value: "180+", label: "Countries through certified partners" },
    ],
  },
  cta: {
    title: "Is payroll still the riskiest week of your month?",
    body: "Tell us how payroll runs today, from inputs to posting, and we'll show you where it can be made safer and simpler.",
    button: { label: "Talk to a payroll specialist", href: CONTACT_HREF },
    related: [R_HCM, R_INTEGRATIONS, AMS],
  },
  faq: {
    id: "questions",
    eyebrow: "Questions",
    title: "Questions we hear about Workday Payroll.",
    items: [
      {
        q: "Should we move to Workday Payroll or keep our current provider?",
        a: "It depends on where your people are and how well your provider serves you today. Workday Payroll suits the countries it covers natively, while elsewhere, connecting your provider to Workday usually makes more sense. We help you decide country by country.",
      },
      {
        q: "How do you make sure the first Workday payroll is right?",
        a: "We run parallel payrolls against your current system and reconcile them before cut-over. At Hazeberg, go-live waits until every difference is explained.",
      },
      {
        q: "Can you support a provider like ADP alongside Workday?",
        a: "Yes. We have built and maintained connections to providers such as ADP, using Workday's third-party payroll connectors and custom integrations where they are needed.",
      },
      {
        q: "What happens at year-end?",
        a: "We plan year-end work well ahead, apply statutory updates, check balances and support the production of employee tax documents, so the last payroll of the year is not the riskiest.",
      },
      {
        q: "Can you take over payroll support from our current partner?",
        a: "Yes, with a structured transition and knowledge-transfer checkpoints planned around your pay calendar, so no pay run falls between two teams.",
      },
    ],
  },
};

/* ---------------------------------------------------------------------------
   Workday Financials
   --------------------------------------------------------------------------- */

const WORKDAY_FINANCIALS: WrittenService = {
  written: true,
  slug: "workday-financials",
  label: "Workday Financials",
  icon: "financials",
  short: "Structure and visibility for financial operations",
  hero: {
    eyebrow: "Workday Financials",
    titleLead: "Close faster. ",
    titleAccent: "See everything.",
    intro:
      "Accounting, spend and suppliers in one set of books, with real-time numbers finance leaders trust.",
    differentiator:
      "Every Financials engagement at Hazeberg is led by consultants who have spent their careers on finance integrations, so your banks, payroll and procurement are connected to the ledger from day one, not patched in later.",
    primary: { label: "Talk to a Financials specialist", href: CONTACT_HREF },
    secondary: { label: "Book a Financials Health Check", href: HEALTH_CHECK },
    outcomes: [
      { title: "Shorter closes", label: "Fewer manual steps between period end and sign-off" },
      { title: "One set of numbers", label: "Every report built on the same books" },
      { title: "Spend approved upfront", label: "Approvals before money leaves, not after" },
      { title: "Audit-ready books", label: "Approvals and changes recorded as they happen" },
    ],
  },
  capabilities: {
    id: "capabilities",
    eyebrow: "Financials capabilities",
    title: "From the first purchase to the final report.",
    body: "A fast close is decided long before period end. We set up each part of the cycle so the numbers are right when they land, and month-end becomes a check rather than a rebuild.",
    stages: [
      {
        key: "set-up",
        stage: "Set up",
        area: "Core accounting",
        line: "A chart of accounts built for the questions you will ask, not the ones your old system could answer.",
        items: [
          "Chart of accounts and reporting tags",
          "Companies, ledgers and currencies",
          "Intercompany accounting",
          "Projects, grants and business assets",
        ],
      },
      {
        key: "spend",
        stage: "Spend",
        area: "Procure to pay",
        line: "Every purchase signed off before it is made, not justified afterwards.",
        items: [
          "Requisitions, purchase orders and receipts",
          "Supplier onboarding and invoice matching",
          "Expenses from a phone, checked against policy",
          "Supplier payments and payment files",
        ],
      },
      {
        key: "earn",
        stage: "Earn",
        area: "Contract to cash",
        line: "Revenue recognized the way your contracts are written.",
        items: [
          "Customer contracts and billing schedules",
          "Invoicing and collections",
          "Revenue recognition rules",
          "Customer payments applied to open invoices",
        ],
      },
      {
        key: "plan",
        stage: "Plan",
        area: "Planning and budgeting",
        line: "Budgets that check spend as it happens, and forecasts that start from actuals.",
        items: [
          "Budgets with spend checks in Workday",
          "Forecasts and scenarios in Adaptive Planning",
          "Budget against actual by cost center",
          "Cash position and cash forecasts",
        ],
      },
      {
        key: "close",
        stage: "Close",
        area: "Close and reporting",
        line: "A close that runs from a checklist, not a crisis.",
        items: [
          "Bank and account reconciliations",
          "Consolidation across companies",
          "Close tasks tracked in one place",
          "Financial statements and management reports",
        ],
      },
      {
        key: "control",
        stage: "Control",
        area: "Controls and compliance",
        line: "The controls your auditors ask for, already part of how the work gets done.",
        items: [
          "Approvals routed through business processes",
          "Segregation of duties through security",
          "A full audit trail on every entry",
          "SOX controls and audit evidence",
        ],
      },
    ],
    footnote:
      "Prism Analytics draws on the same books when deeper analysis is needed, blending finance data with operational data from outside Workday.",
  },
  audiences: {
    id: "who-its-for",
    eyebrow: "Who it's built for",
    title: "Three teams who live in the numbers.",
    body: "Finance only moves as fast as the people feeding it and reading it. Here is what changes for each of them.",
    groups: [
      {
        key: "finance-leaders",
        name: "Finance leaders",
        features: [
          {
            title: "Live results",
            line: "Results in real time, without waiting for month-end packs.",
          },
          {
            title: "One version of the numbers",
            line: "The same figures for the board, the auditors and operating teams.",
          },
          {
            title: "Forecasts from actuals",
            line: "Plans refreshed from the books, not from last month's export.",
          },
          {
            title: "A shorter close",
            line: "Fewer days between period end and signed-off results.",
          },
        ],
      },
      {
        key: "accounting-team",
        name: "Accounting team",
        features: [
          {
            title: "Fewer manual journals",
            line: "Payroll, spend and revenue post to the ledger on their own.",
          },
          {
            title: "Reconciliations in Workday",
            line: "Bank and account reconciliations done where the data lives.",
          },
          {
            title: "Consolidation built in",
            line: "Intercompany and consolidation handled inside Workday.",
          },
          {
            title: "A close everyone can see",
            line: "Every close task, owner and status in one place.",
          },
        ],
      },
      {
        key: "budget-holders",
        name: "Budget holders and approvers",
        features: [
          {
            title: "Approvals on a phone",
            line: "Spend requests reviewed and approved wherever they are.",
          },
          {
            title: "Their own budget view",
            line: "Budget against actual for their cost center on any day of the month.",
          },
          {
            title: "Spend checked upfront",
            line: "Requests tested against budget before anyone approves them.",
          },
          {
            title: "Expenses without chasing",
            line: "Claims submitted, approved and reimbursed in one flow.",
          },
        ],
      },
    ],
  },
  engage: {
    id: "how-we-engage",
    eyebrow: "How we engage",
    title: "Three ways in, depending on where you are with Workday.",
    body: "The right route depends on whether you are moving finance onto Workday, already closing your books in it, or need a team beside you every period end.",
    routes: [
      {
        n: "01",
        name: "Implement",
        line: "Moving your ledger, spend and revenue processes onto Workday Financials: chart of accounts design, data conversion from your current ERP, a trial close and a cut-over timed around your period end.",
        link: IMPLEMENTATION,
      },
      {
        n: "02",
        name: "Optimize",
        line: "Fixing what slows the close: manual journals, reconciliations done outside Workday, approval chains nobody follows and reports rebuilt in spreadsheets.",
        link: OPTIMIZATION,
      },
      {
        n: "03",
        name: "Support",
        line: "A standing team for every period end, year-end and Workday release, with coverage across time zones.",
        link: AMS,
      },
    ],
  },
  feature: {
    kind: "flows",
    id: "connected-finance",
    eyebrow: "Connected finance",
    title: "Your ledger is only as complete as what flows into it.",
    body: "Workday Financials sits at the center of a lot of traffic: payroll costs, bank statements, supplier invoices, customer payments and, during a move, years of history from the system you are leaving. We connect each of those so the numbers arrive complete and on time.",
    /* [derived] */
    hub: "Your ledger",
    direction: "in",
    items: [
      {
        key: "hr-payroll",
        name: "From HR and payroll",
        line: "Payroll costs and headcount landing on the right cost centers, projects and grants, whether pay runs in Workday or with a provider.",
      },
      {
        key: "banks",
        name: "To and from your banks",
        line: "Payment files out, statements in, and reconciliation that happens inside Workday.",
      },
      {
        key: "suppliers",
        name: "Suppliers and procurement",
        line: "Supplier records, purchase orders and invoices flowing in from the portals and tools your teams already use.",
      },
      {
        key: "old-erp",
        name: "From your old ERP",
        line: "Opening balances, open items and the history you actually need, converted, reconciled and signed off before go-live.",
      },
    ],
  },
  cta: {
    title: "Still closing the books in spreadsheets?",
    body: "Tell us how your close runs today, from first journal to final report, and we'll show you where Workday Financials can shorten it.",
    button: { label: "Talk to a Financials specialist", href: CONTACT_HREF },
    related: [R_INTEGRATIONS, R_REPORTING, R_PAYROLL],
  },
  faq: {
    id: "questions",
    eyebrow: "Questions",
    title: "Questions we hear about Workday Financials.",
    items: [
      {
        q: "Can we add Workday Financials if we already run Workday HCM?",
        a: "Yes. Financials uses the same organizations, workers and security you already have, so payroll costs, expenses and approvals connect without new interfaces. We plan the rollout around your financial year so the switch lands at a clean period end.",
      },
      {
        q: "What happens to the data in our current ERP?",
        a: "Data conversion gets senior attention at Hazeberg rather than being left to the end. We map, cleanse and reconcile opening balances, open items and the history you actually need, and nothing goes live until finance has signed off the numbers.",
      },
      {
        q: "Can Workday Financials handle multiple companies and currencies?",
        a: "Yes. We set up each company, its currencies and the intercompany rules between them, so consolidation runs inside Workday instead of in a spreadsheet after the close.",
      },
      {
        q: "Can you connect Workday Financials to our banks and other systems?",
        a: "Yes. Bank connections, payroll postings, procurement portals and other finance feeds are built with Workday Studio, EIB and APIs, and tested against each Workday release so they keep working.",
      },
      {
        q: "Will our auditors be comfortable with it?",
        a: "That is designed in from the start. Approvals run through business processes, segregation of duties is enforced through security, and every entry carries a full audit trail, so SOX testing has the evidence it needs. We agree the controls with your finance and audit teams before build begins.",
      },
    ],
  },
};

/* ---------------------------------------------------------------------------
   Workday Integrations
   --------------------------------------------------------------------------- */

const WORKDAY_INTEGRATIONS: WrittenService = {
  written: true,
  slug: "workday-integrations",
  label: "Workday Integrations",
  icon: "integrations",
  short: "Connecting the systems your business relies on",
  hero: {
    eyebrow: "Workday Integrations",
    /* [derived] The document gives no accent split; the second half takes it,
       as on the other three. */
    titleLead: "Every system, ",
    titleAccent: "one conversation.",
    intro:
      "Studio, EIB, Core Connectors and APIs linking Workday to payroll, benefits, identity and finance systems, with 200+ integrations built.",
    differentiator:
      "The integration team at Hazeberg holds Workday's Studio and Cloud Connect certifications, and the vendors on your list, from ADP and Okta to DocuSign, are usually ones we have connected before.",
    primary: { label: "Talk to an integration specialist", href: CONTACT_HREF },
    /* [derived] The map is on this page — "What we connect" — so the second
       button goes to it; the closing call to action sends it to Contact. */
    secondary: { label: "Map your integrations", href: "#what-we-connect" },
    outcomes: [
      { title: "Entered once", label: "Data keyed in Workday, used everywhere" },
      { title: "Failures caught early", label: "Alerts before anyone downstream notices" },
      { title: "Release-ready", label: "Integrations checked before each Workday update" },
      { title: "Fully documented", label: "An owner, a schedule and a fix for every feed" },
    ],
  },
  capabilities: {
    id: "capabilities",
    eyebrow: "Integration capabilities",
    title: "From the first field mapped to every run after it.",
    body: "An integration is judged on its worst day, the night a vendor changes a file format or a release moves a field. We choose the right Workday tool for each connection, build it to fail loudly rather than quietly, and keep it working well past go-live.",
    stages: [
      {
        key: "map",
        stage: "Map",
        area: "Integration design",
        line: "The cheapest integration to fix is the one designed right the first time.",
        items: [
          "An inventory of every existing connection",
          "The right Workday tool chosen for each job",
          "Field mapping and transformation rules",
          "Integration accounts with only the access they need",
        ],
      },
      {
        key: "load",
        stage: "Load",
        area: "Data loads and file exchange",
        line: "Bulk data checked before it touches live records.",
        items: [
          "EIB loads for bulk and one-off data",
          "Data conversion during implementation",
          "Scheduled inbound and outbound files",
          "Secure file transfer with on-premise systems",
        ],
      },
      {
        key: "connect",
        stage: "Connect",
        area: "Workday connectors",
        line: "Workday's own connectors wherever they fit, so less has to be custom.",
        items: [
          "Core Connectors for worker and organization changes",
          "Cloud Connect for Benefits to carriers",
          "Cloud Connect for Third-Party Payroll and PECI",
          "Partner apps and connectors from Workday Marketplace",
        ],
      },
      {
        key: "build",
        stage: "Build",
        area: "Custom integrations",
        line: "Custom where it has to be, and only where it has to be.",
        items: [
          "Workday Studio when the logic outgrows a connector",
          "Transformations between file formats",
          "Error handling and automatic retries",
          "High-volume and multi-system flows",
        ],
      },
      {
        key: "sync",
        stage: "Sync",
        area: "Real-time APIs",
        line: "Changes that reach other systems in minutes, not on tomorrow's file.",
        items: [
          "REST and SOAP web services",
          "Custom reports published as APIs (RaaS)",
          "Event-triggered flows in Workday Orchestrate",
          "API connections to platforms and AI assistants",
        ],
      },
      {
        key: "run",
        stage: "Run",
        area: "Monitoring and release readiness",
        line: "Nobody should hear about a failed integration from an employee.",
        items: [
          "Monitoring with alerts on every failure",
          "Regression tests before each Workday release",
          "Runbooks and documentation for every feed",
          "Rebuilds for fragile or duplicate integrations",
        ],
      },
    ],
  },
  audiences: {
    id: "who-its-for",
    eyebrow: "Who it's built for",
    title: "Three teams who depend on every feed.",
    body: "An integration has more owners than it first appears. Here is what changes for each of them.",
    groups: [
      {
        key: "it-security",
        name: "IT and security",
        features: [
          {
            title: "One map of every connection",
            line: "Every integration listed with its owner, vendor, method and schedule.",
          },
          {
            title: "Access kept tight",
            line: "Integration accounts and API clients that see only what they need.",
          },
          {
            title: "Fewer tools to run",
            line: "Workday's own tools used before anything new is added to the estate.",
          },
          {
            title: "Room to grow",
            line: "New vendors added to proven patterns instead of one-off builds.",
          },
        ],
      },
      {
        key: "hris-integration",
        name: "HRIS and integration team",
        features: [
          {
            title: "Alerts, not surprises",
            line: "Failures flagged the moment they happen, with the reason attached.",
          },
          {
            title: "Fixes anyone can follow",
            line: "Runbooks that let any team member resolve a failed run.",
          },
          {
            title: "Calm release weeks",
            line: "Integrations tested in the preview window before each update goes live.",
          },
          {
            title: "Fewer reruns by hand",
            line: "Retries and error handling built in, not done at midnight.",
          },
        ],
      },
      {
        key: "hr-payroll-finance",
        name: "HR, payroll and finance",
        features: [
          {
            title: "Data entered once",
            line: "A hire or change made in Workday reaches every system that needs it.",
          },
          {
            title: "Vendors in step",
            line: "Payroll providers and benefit carriers get changes on schedule.",
          },
          {
            title: "Fewer reconciliations",
            line: "Systems that agree with each other, so less checking between them.",
          },
          {
            title: "Day-one access",
            line: "New starters get their accounts and tools before they arrive.",
          },
        ],
      },
    ],
  },
  engage: {
    id: "how-we-engage",
    eyebrow: "How we engage",
    title: "Three ways in, depending on where you are with Workday.",
    body: "The right route depends on whether integrations are part of a new Workday rollout, already live and causing trouble, or need a team to keep them running.",
    routes: [
      {
        n: "01",
        name: "Implement",
        line: "Integrations planned alongside the rest of your Workday rollout: an inventory of what has to connect, design, build, testing with each vendor and a cut-over that keeps every feed running.",
        link: IMPLEMENTATION,
      },
      {
        n: "02",
        name: "Optimize",
        line: "Rebuilding integrations that break, duplicate each other or need manual help, and moving them onto supported Workday patterns.",
        link: MODERNIZATION,
      },
      {
        n: "03",
        name: "Support",
        line: "A standing team that watches your integrations, fixes failures and tests every connection before each Workday release.",
        link: AMS,
      },
    ],
  },
  feature: {
    kind: "flows",
    id: "what-we-connect",
    eyebrow: "What we connect",
    title: "Everywhere your Workday data needs to go.",
    body: "Workday holds the record, but payroll providers, carriers, identity tools and many other systems need it too. These are the connections we build, with a vendor we have worked with wherever there is one.",
    /* [derived] */
    hub: "Workday",
    direction: "out",
    items: [
      {
        key: "payroll",
        name: "Payroll providers",
        vendor: "ADP",
        line: "Worker changes sent on the pay calendar, with results and payslips brought back into Workday.",
      },
      {
        key: "benefits",
        name: "Benefits and insurance",
        vendor: "MetLife",
        line: "Enrollments and life events sent to carriers without a spreadsheet in between.",
      },
      {
        key: "retirement",
        name: "Retirement and savings",
        vendor: "Fidelity",
        line: "Contributions and eligibility kept in step with pay and job changes.",
      },
      {
        key: "identity",
        name: "Identity and access",
        vendor: "Okta",
        line: "Accounts opened for new starters on day one and closed the moment someone leaves.",
      },
      {
        key: "recruiting",
        name: "Recruiting",
        vendor: "Greenhouse",
        line: "Hired candidates arriving in Workday as new hires, ready for onboarding.",
      },
      {
        key: "documents",
        name: "Documents and e-signature",
        vendor: "DocuSign",
        line: "Offer letters and contracts signed, then filed back to the worker's record.",
      },
      {
        key: "finance",
        name: "Finance and banking",
        vendor: "Your ERP and banks",
        line: "Payroll costs, bank files and supplier data flowing to and from the ledger.",
      },
      {
        key: "ai",
        name: "AI assistants",
        vendor: "Your existing assistant",
        line: "Employees and managers asking Workday questions from Teams or Slack, under their own Workday security.",
      },
    ],
  },
  cta: {
    title: "Not sure what's connected to your Workday?",
    body: "Send us your integration list, or let us build one with you, and we'll show you which connections need attention first.",
    button: { label: "Map your integrations", href: CONTACT_HREF },
    related: [R_PAYROLL, R_FINANCIALS, R_EXTEND],
  },
  faq: {
    id: "questions",
    eyebrow: "Questions",
    title: "Questions we hear about Workday integrations.",
    items: [
      {
        q: "Which Workday integration tool is right for us?",
        a: "It depends on the job. EIB suits bulk loads and simple scheduled files, Core Connectors and Cloud Connect cover common vendor feeds with logic Workday already provides, Studio handles complex multi-step integrations, and REST or SOAP APIs suit real-time exchanges. We choose per connection and use Workday's own tools before building anything custom.",
      },
      {
        q: "Can you take over integrations another partner built?",
        a: "Yes. We start with an inventory of what each integration does, who owns it, how often it runs and how often it fails. Then we document and stabilize them, and give you a clear list of what to fix first.",
      },
      {
        q: "How do you keep integrations working through Workday releases?",
        a: "Workday releases major updates twice a year and opens a preview window about five weeks before each one. Release testing is routine work at Hazeberg, not an extra: integrations are run in that window, so problems are fixed before the update reaches production.",
      },
      {
        q: "Can Workday connect through our existing middleware?",
        a: "Yes. Workday's APIs work with the integration platforms and API gateways IT teams already run. We decide case by case where the logic should live, and keep it inside Workday when Workday is the main source of the data.",
      },
      {
        q: "Can you connect Workday to our AI assistant?",
        a: "Yes. Workday's REST APIs and reports can be exposed to an assistant in Teams or Slack, so people can check and update their Workday data from chat. Every action runs under the person's own Workday security, so the assistant never sees more than they could.",
      },
    ],
  },
};

/* ---------------------------------------------------------------------------
   The two not yet written
   ---------------------------------------------------------------------------
   Hero copy only, all of it [live] from `SERVICES.items`. The template renders
   these as a marked scaffold — a real opener and an honest statement that the
   rest of the page is not written.
   --------------------------------------------------------------------------- */

export const SERVICE_PAGES: Record<string, ServicePage> = {
  "workday-hcm": WORKDAY_HCM,
  "workday-payroll": WORKDAY_PAYROLL,
  "workday-financials": WORKDAY_FINANCIALS,
  "workday-integrations": WORKDAY_INTEGRATIONS,
  "workday-reporting-analytics": {
    written: false,
    slug: "workday-reporting-analytics",
    label: "Reporting & Analytics",
    icon: "reporting",
    short: "Workday data turned into business insight",
    lead: "Turn Workday data into useful business insight with reporting solutions that help teams understand performance and make informed decisions.",
    titleLead: "Workday data turned into ",
    titleAccent: "business insight.",
  },
  "workday-extend": {
    written: false,
    slug: "workday-extend",
    label: "Workday Extend",
    icon: "extend",
    short: "Tailored experiences inside your Workday",
    lead: "Build tailored Workday experiences that address specific business requirements while working within your broader Workday environment.",
    titleLead: "Tailored experiences inside ",
    titleAccent: "your Workday.",
  },
};

/** The four written pages, in the nav's order — for the related-services row
    and anything else that wants to walk them. */
export const WRITTEN_SERVICES = Object.values(SERVICE_PAGES).filter(
  (p): p is WrittenService => p.written,
);

/** The scaffold notice, one place, so both unwritten pages say the same thing. */
export const SERVICE_SCAFFOLD = {
  eyebrow: "Not written yet",
  title: "This module page is a scaffold.",
  body: "The opener above is the client's own copy, already live on the home page. Everything below it — what the module covers, who it is for, how an engagement runs, and the questions — is written once per module, and four of the six are done.",
  reference: { label: "See a written one — Workday HCM", href: "/services/workday-hcm" },
  needs: [
    "Six capability stages, with a line and four capabilities each",
    "Three audiences, four changes each",
    "How we engage: implement, optimize, support",
    "One section of the module's own, a call to action and five questions",
  ],
} as const;
