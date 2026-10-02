/**
 * What we do — the client's copy, in full.
 *
 * Source: "What We Do Content" (PDF), supplied 2026-10-01. It replaces the
 * draft this file used to carry, every `[DRAFT]` line of it. Marking:
 *
 *   (unmarked)  the client's words, verbatim — except the spelling, which is
 *               US English throughout (organization, optimize, specialized,
 *               maximize…), by direction 2026-10-01. The document mixed the
 *               two; the site does not. The ids and `key`s are code, not copy,
 *               and keep their old spelling so no link or lookup moves
 *   [derived]   structure the page needs that the document implies but does
 *               not write: an eyebrow named after its own section, a link to
 *               a page that already exists
 *   [COMP]      a photograph from the reference set, standing in. Same status
 *               as the comp frames on the home page — replaced before launch
 *
 * THE EIGHT ANCHORS ARE A CONTRACT. `navigation.ts` and `service-content.ts`
 * link `#workday-ams`, `#workday-health-check`, `#workday-implementation`,
 * `#workday-optimization` and `#integration-modernization` from other pages,
 * so the ids below never change. (`home-content.ts` linked `#workday-ams`
 * until AMS got its own page on 2026-10-02.) Each one is an accordion item now, and arriving
 * on its hash opens it.
 *
 * Every capability is referred to by id everywhere else in this file — the
 * challenges, the journeys, the lifecycle map — never by a second copy of its
 * name. One spelling, so a rename is one edit.
 */

export const CAPABILITY_IDS = [
  "workday-implementation",
  "workday-optimization",
  "workday-ams",
  "cost-optimization",
  "integration-modernization",
  "payroll-transformation",
  "release-management",
  "workday-health-check",
] as const;

export type CapabilityId = (typeof CAPABILITY_IDS)[number];

export type Capability = {
  id: CapabilityId;
  n: string;
  name: string;
  tagline: string;
  intro: string;
  delivers: readonly string[];
  outcome: string;
  /** [derived] The service page of the same name, where one exists. Only a
      name match — never a guess at which module a capability "belongs" to. */
  related?: { label: string; href: string };
};

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Where the crop holds when the frame is a different shape from the file. */
  position?: string;
};

/* The document's order, which is not the lifecycle's. Kept: it is theirs, and
   the lifecycle order already has a section of its own (How it fits together). */
const CAPABILITIES: readonly Capability[] = [
  {
    id: "workday-implementation",
    n: "01",
    name: "Workday Implementation",
    tagline: "Build a Workday foundation designed around your business.",
    intro:
      "Hazeberg helps organizations move from planning to successful deployment through structured implementation expertise across design, configuration, testing, and go-live support.",
    delivers: [
      "Workday solution design aligned with business objectives",
      "Business process configuration and optimization",
      "Data migration and validation support",
      "Testing strategy and execution",
      "Integration planning and deployment",
      "Go-live preparation and post-launch stabilization",
    ],
    outcome:
      "A Workday environment built to support your organization's processes, people, and future growth.",
  },
  {
    id: "workday-optimization",
    n: "02",
    name: "Workday Optimization",
    tagline: "Improve performance and unlock more value from Workday.",
    intro:
      "Workday continues to evolve after implementation. Hazeberg helps organizations assess their existing environment, identify improvement opportunities, and optimize how they use the platform.",
    delivers: [
      "Business process improvements",
      "Configuration reviews and enhancements",
      "Feature adoption support",
      "Reporting and analytics improvements",
      "User experience optimization",
      "Continuous improvement roadmap",
    ],
    outcome:
      "A Workday environment that becomes more efficient, effective, and aligned with changing business needs.",
  },
  {
    id: "workday-ams",
    n: "03",
    name: "Workday AMS",
    tagline: "Continuous support beyond go-live.",
    intro:
      "Hazeberg provides ongoing functional and technical support to help organizations maintain, enhance, and evolve their Workday environment.",
    delivers: [
      "Functional and technical support",
      "Issue resolution and troubleshooting",
      "Workday enhancements",
      "Tenant management support",
      "Release support",
      "Continuous improvements",
    ],
    outcome: "A reliable Workday environment supported by specialists who understand your platform.",
    related: { label: "Workday AMS", href: "/services/workday-ams" },
  },
  {
    id: "cost-optimization",
    n: "04",
    name: "Cost Optimization",
    tagline: "Maximize your Workday investment.",
    intro:
      "Hazeberg helps organizations identify opportunities to improve efficiency, reduce unnecessary complexity, and optimize the overall cost of managing Workday.",
    delivers: [
      "Process efficiency reviews",
      "Support model optimization",
      "Platform utilization analysis",
      "Reduction of manual workarounds",
      "Improvement recommendations",
      "Value optimization roadmap",
    ],
    outcome:
      "Better efficiency, improved utilization, and stronger return from your Workday investment.",
  },
  {
    id: "integration-modernization",
    n: "05",
    name: "Integration Modernization",
    tagline: "Build a connected enterprise ecosystem.",
    intro:
      "Workday delivers maximum value when it connects seamlessly with the systems your organization relies on. Hazeberg helps modernize and maintain integrations across your technology landscape.",
    delivers: [
      "Integration assessment",
      "Modernization strategy",
      "Workday integration development",
      "Third-party system connectivity",
      "Integration testing",
      "Monitoring and optimization",
    ],
    outcome: "Reliable data flow and a connected ecosystem that supports business operations.",
    related: { label: "Workday Integrations", href: "/services/workday-integrations" },
  },
  {
    id: "payroll-transformation",
    n: "06",
    name: "Payroll Transformation",
    tagline: "Create smarter and more connected payroll operations.",
    intro:
      "Hazeberg helps organizations improve payroll processes by aligning Workday capabilities, integrations, and operational requirements.",
    delivers: [
      "Payroll process optimization",
      "Workday Payroll support",
      "Time and absence integration",
      "Benefits and compensation alignment",
      "Payroll testing and validation",
      "Operational improvements",
    ],
    outcome: "More accurate, efficient, and connected payroll operations.",
    related: { label: "Workday Payroll", href: "/services/workday-payroll" },
  },
  {
    id: "release-management",
    n: "07",
    name: "Release Management",
    tagline: "Navigate Workday updates with confidence.",
    intro:
      "Workday releases bring continuous innovation, but organizations need the right approach to assess, test, and adopt changes effectively.",
    delivers: [
      "Release impact assessment",
      "Feature review and recommendations",
      "Regression testing",
      "Configuration validation",
      "Deployment planning",
      "Adoption support",
    ],
    outcome: "Smooth Workday updates with minimal disruption and maximum value.",
  },
  {
    id: "workday-health-check",
    n: "08",
    name: "Workday Health Check",
    tagline: "Understand your current Workday environment.",
    intro:
      "Hazeberg evaluates your Workday setup to identify strengths, gaps, and opportunities for improvement.",
    delivers: [
      "Tenant assessment",
      "Configuration review",
      "Business process analysis",
      "Integration review",
      "Reporting and security assessment",
      "Prioritized improvement roadmap",
    ],
    outcome:
      "Clear visibility into your Workday environment and actionable steps to improve performance.",
  },
];

/** Name by id, for every chip on the page. */
export const CAPABILITY_NAME = Object.fromEntries(
  CAPABILITIES.map((c) => [c.id, c.name]),
) as Record<CapabilityId, string>;

/** Tagline by id — each capability's one-line promise, where a path needs it. */
export const CAPABILITY_TAGLINE = Object.fromEntries(
  CAPABILITIES.map((c) => [c.id, c.tagline]),
) as Record<CapabilityId, string>;

export const WHAT_WE_DO = {
  /* 1 — Hero ------------------------------------------------------------ */
  hero: {
    eyebrow: "What we do",
    titleLead: "Workday, done right.",
    titleAccent: "From first design to years after go-live.",
    lead: "Hazeberg is a specialist Workday consultancy helping organizations design, deploy, integrate, optimize, and support Workday solutions across their business.",
    leadSecond:
      "From implementation and transformation to ongoing support and optimization, we help organizations maximize the value of their Workday investment at every stage of the journey.",
    cta: { label: "Talk to our experts", href: "/contact" },
    secondary: { label: "Explore our capabilities", href: "#capabilities" },
    /**
     * The document marks this strip "(Only after client confirmation)", so it
     * is built and switched OFF. Flip `confirmed` once they sign the four
     * figures off.
     *
     * "200+ years" and Who we are's "12+ years" are not in conflict — settled
     * 2026-10-01: 200+ is every consultant's Workday years added together, 12+
     * is how long the practice itself has been at it.
     */
    proof: {
      confirmed: false,
      items: [
        { value: 20, suffix: "+", label: "Workday projects delivered" },
        { value: 200, suffix: "+", label: "Years of combined Workday experience" },
        { value: 40, suffix: "+", label: "Countries supported" },
        { value: 100, suffix: "%", label: "Customer retention" },
      ],
    },
  },

  /* 2 — Who we are ------------------------------------------------------- */
  who: {
    id: "who-we-are",
    eyebrow: "Hazeberg Offerings",
    title: "We do one thing: Workday.",
    /**
     * The first paragraph, cut where it names the three problems. Each of those
     * three sentences is tied to the challenge that answers it (`challenge` is
     * the index into `challenges`), and the page lights the sentence while its
     * challenge is being read. The words are untouched; joined, these segments
     * are the client's paragraph exactly.
     */
    story: [
      {
        text: "Hazeberg was founded by Workday practitioners who spent years inside complex implementations and saw the same problems repeat. ",
      },
      { text: "Designs didn't match how the business worked.", challenge: 0 },
      { text: " " },
      { text: "Integrations broke at every release.", challenge: 1 },
      { text: " " },
      { text: "Customers were left alone after go-live.", challenge: 2 },
    ],
    body: "We built Hazeberg to fix that. Our consultants bring 12+ years of combined Workday experience. They work from India and Malaysia, supporting customers across time zones.",
    /** [COMP] The v2 comp's hero frame. A real team photograph replaces it. */
    photo: {
      src: "/hero/meeting.png",
      alt: "Consultants working together around a table in a meeting room",
      width: 1200,
      height: 900,
    },
    /** [derived] From the paragraph above it — where the team works. */
    photoTag: "India · Malaysia",
    visualTitle: "What we built to solve",
    labels: { challenge: "Challenge", does: "What Hazeberg does", capabilities: "Capabilities" },
    challenges: [
      {
        n: "01",
        title: "The solution did not always fit the business",
        does: "We start with how your people, processes, and operations actually work, then design Workday solutions around your organization.",
        capabilities: ["workday-implementation", "payroll-transformation"],
      },
      {
        n: "02",
        title: "Integrations became difficult to manage",
        does: "We build and modernize integrations that remain reliable as your Workday environment evolves.",
        capabilities: ["integration-modernization", "release-management"],
      },
      {
        n: "03",
        title: "Support stopped after go-live",
        does: "We stay involved beyond deployment, helping organizations maintain, optimize, and continuously improve their Workday environment.",
        capabilities: [
          "workday-ams",
          "workday-optimization",
          "workday-health-check",
          "cost-optimization",
        ],
      },
    ],
  },

  /* 3 — Wherever you are with Workday ------------------------------------ */
  journey: {
    id: "your-journey",
    eyebrow: "Wherever you are with Workday",
    title: "Every Workday journey is different. Our expertise adapts to where you are.",
    body: [
      "Every organization's Workday journey is different.",
      "Whether you are planning a new implementation, stabilizing after go-live, improving an existing environment, or connecting Workday with other enterprise systems, Hazeberg brings the expertise needed to move forward.",
    ],
    /** [derived] The selector's accessible name. */
    pickerLabel: "Where you are with Workday",
    helpsLabel: "Hazeberg helps with:",
    /** [derived] Interface words for the finder — the document writes none. */
    labels: {
      prompt: "Choose where you are",
      cardCta: "See your path",
      startingPoint: "Your starting point",
      reset: "Choose again",
    },
    options: [
      {
        n: "01",
        key: "planning",
        stage: "Planning Workday",
        title: "Start with a Workday foundation built for long-term success.",
        body: [
          "A successful Workday journey begins with more than technology. It requires a clear understanding of your business processes, operating model, and future goals.",
          "Hazeberg helps organizations design, configure, test, and prepare their Workday environment for a successful implementation and confident go-live.",
        ],
        helps: ["workday-implementation", "payroll-transformation", "integration-modernization"],
        photo: {
          src: "/journey/1.png",
          alt: "A team mapping a process flow on a glass wall during a planning workshop",
          width: 1536,
          height: 1024,
          position: "50% 22%",
        },
      },
      {
        n: "02",
        key: "live",
        stage: "Recently Gone Live",
        title: "Move beyond go-live with confidence.",
        body: [
          "Launching Workday is an important milestone, but the real value comes from stabilizing the environment and helping teams adopt it effectively.",
          "Hazeberg supports organizations after deployment by resolving challenges, improving adoption, and ensuring Workday continues to perform as expected.",
        ],
        helps: ["workday-ams", "workday-health-check", "workday-optimization"],
        photo: {
          src: "/journey/2.png",
          alt: "A consultant talking a client through a live dashboard at her desk",
          width: 1536,
          height: 1024,
          position: "50% 30%",
        },
      },
      {
        n: "03",
        key: "maximising",
        stage: "Maximizing an Existing Workday Environment",
        title: "Unlock more value from the Workday investment you already made.",
        body: [
          "Over time, business needs evolve, new capabilities become available, and processes require refinement.",
          "Hazeberg helps organizations assess their environment, optimize performance, adopt new Workday capabilities, and continuously improve their platform.",
        ],
        helps: [
          "workday-health-check",
          "workday-optimization",
          "cost-optimization",
          "release-management",
        ],
        photo: {
          src: "/journey/3.png",
          alt: "Two colleagues reviewing improvement figures on a tablet in a bright office",
          width: 1536,
          height: 1024,
          position: "50% 22%",
        },
      },
      {
        n: "04",
        key: "connecting",
        stage: "Connecting Your Enterprise",
        title: "Create a Workday ecosystem that works together.",
        body: [
          "Workday does not operate in isolation. It needs to connect seamlessly with the systems that support your people, processes, and operations.",
          "Hazeberg helps organizations modernize integrations and maintain reliable connections across their enterprise applications.",
        ],
        helps: ["integration-modernization", "payroll-transformation", "workday-ams"],
        photo: {
          src: "/journey/4.png",
          alt: "A consultant working through an integration diagram across two monitors",
          width: 1536,
          height: 1024,
          position: "45% 22%",
        },
      },
    ],
    closing: {
      title: "Your journey. Your priorities. Our expertise.",
      body: "Every organization's Workday needs are different. Hazeberg creates tailored engagement models that align with your goals, challenges, and stage of transformation.",
      cta: { label: "Start your Workday conversation", href: "/contact" },
    },
  },

  /* 4 — How it fits together --------------------------------------------- */
  fits: {
    id: "how-it-fits",
    eyebrow: "How it fits together",
    title: "One practice, eight ways in.",
    body: "Every engagement starts somewhere different, but none of them stand alone. An implementation becomes a support relationship, a health check turns into an optimization roadmap, and every release touches your integrations. We organize the work around the life of your tenant, so each piece hands over to the next without a gap.",
    /** The document's table, row for row. */
    stages: [
      {
        name: "Build",
        line: "Designed, configured, tested and taken live.",
        capabilities: ["workday-implementation"],
      },
      {
        name: "Run",
        line: "Supported every day and updated twice a year.",
        capabilities: ["workday-ams", "release-management"],
      },
      {
        name: "Improve",
        line: "Reviewed, refined and made cheaper to run.",
        capabilities: ["workday-health-check", "workday-optimization", "cost-optimization"],
      },
    ],
    acrossLabel: "Across all stages",
    across: [
      {
        capability: "integration-modernization",
        line: "Connections to every system Workday depends on.",
      },
      { capability: "payroll-transformation", line: "Pay, time, absence and benefits kept in step." },
    ],
    /** The body's own three examples, drawn as the map's connectors. */
    handovers: [
      {
        from: "workday-implementation",
        to: "workday-ams",
        line: "An implementation becomes a support relationship.",
      },
      {
        from: "workday-health-check",
        to: "workday-optimization",
        line: "A health check turns into an optimization roadmap.",
      },
      {
        from: "release-management",
        to: "integration-modernization",
        line: "Every release touches your integrations.",
      },
    ],
    /** The body's own phrase, as the connectors' heading. */
    handoverLabel: "Each piece hands over to the next",
    /** [derived] Interface words the document does not write. */
    handoverPrompt: "Point at a capability to see where it leads.",
  },

  /* 5 — Workday capabilities --------------------------------------------- */
  capabilities: {
    id: "capabilities",
    eyebrow: "Our Workday expertise",
    title: "Specialized expertise across the complete Workday lifecycle",
    body: [
      "Hazeberg brings together specialized Workday capabilities to help organizations implement, optimize, and continuously improve their Workday environment.",
      "From building a strong foundation during implementation to enhancing existing systems, modernizing integrations, and supporting long-term operations, our expertise helps organizations maximize the value of their Workday investment.",
    ],
    labels: {
      delivers: "What we deliver:",
      outcome: "Outcome:",
      /** [derived] Interface words the document does not write. */
      related: "Related service",
      count: "capabilities",
      openAll: "Open all",
      closeAll: "Close all",
    },
    items: CAPABILITIES,
    /* The document's closing line here ("A connected approach to Workday
       success.") is left off by direction, 2026-10-01. */
  },

  /* 6 — AI in the flow of work ------------------------------------------- */
  /**
   * Source: "AI in the Flow of Work" (PDF), supplied 2026-10-01 — a use case
   * of its own, set between the capabilities and How we work. Same marking and
   * the same US spelling as the rest of this file (organization, center).
   *
   * The document drafts its head twice. The first draft is used; the second
   * is kept here so the swap is one edit:
   *   title    "Bring AI into Workday workflows with Hazeberg."
   *   tagline  "AI understands the conversation. Hazeberg connects it to Workday."
   *   intro    "Workday holds critical workforce data. Hazeberg connects it with
   *            AI experiences so employees and managers can access, update, and
   *            act on that information more naturally, while Workday remains the
   *            governed source of truth."
   */
  ai: {
    id: "ai-in-the-flow-of-work",
    eyebrow: "Use case · AI + Workday",
    titleLead: "Bring AI into the flow of Workday",
    titleRest: "with Hazeberg",
    /** One line, three sentences — kept apart so the last can carry the
        accent. Joined with spaces, they are the client's line exactly. */
    tagline: ["AI at the front.", "Workday at the core.", "Hazeberg connects the two."],
    intro:
      "Workday holds critical workforce data, but accessing it can take people out of the tools where they already work. Hazeberg connects AI with Workday so employees can update skills, managers can find expertise, and teams can act on workforce data more naturally, while Workday remains the governed source of truth.",
    /**
     * [derived] The tagline drawn: its three parts, in the order they sit in
     * the picture rather than the sentence. Hazeberg is in the middle because
     * it is the thing in the middle. The tagline is the text; this is the
     * picture of it.
     */
    bridge: [
      { key: "ai", name: "AI", role: "At the front" },
      { key: "hazeberg", name: "Hazeberg", role: "Connects the two" },
      { key: "workday", name: "Workday", role: "At the core" },
    ],
    people: {
      title: "AI that brings Workday closer to your people",
      items: [
        {
          key: "employees",
          audience: "For Employees",
          title: "Less navigating. More doing.",
          body: "Access and update workforce information through simple AI conversations instead of switching between systems.",
        },
        {
          key: "managers",
          audience: "For Managers",
          title: "Find the right expertise faster.",
          body: "Use natural language to surface relevant skills, people, and workforce information when decisions need to be made.",
        },
        {
          key: "talent",
          audience: "For HR & Talent Teams",
          title: "Make workforce data more actionable.",
          body: "Bring skills and workforce intelligence closer to the decisions, conversations, and workflows that depend on it.",
        },
        {
          key: "organization",
          audience: "For Your Organization",
          title: "Extend Workday into the flow of work.",
          body: "Connect workforce intelligence with the everyday tools people already use, while Workday remains the governed source of truth.",
        },
      ],
    },
    value: {
      title: "The value at a glance",
      items: [
        {
          figure: "80%+",
          label: "Skills profile completeness",
          body: "Help more employees keep their skills profiles current and usable.",
        },
        {
          figure: "<30 sec",
          label: "To update a skill",
          body: "Turn a multi-step update into a simple conversational interaction.",
        },
        {
          figure: "Weekly",
          label: "Manager skills check-ins",
          body: "Make workforce skills easier to review and act on regularly.",
        },
        {
          figure: "100%",
          label: "Learning tied to a real skill gap",
          body: "Connect learning activity to identified workforce capability needs.",
        },
      ],
      /** The document's own caveat. It travels with the figures, always. */
      note: "Illustrative targets. Actual outcomes and baselines are established during discovery.",
    },
    closing: {
      titleLead: "AI makes the interaction simpler.",
      titleRest: "Hazeberg makes the connection.",
      body: "Hazeberg connects AI with Workday to make workforce intelligence easier to access and act on, while keeping Workday at the center of your data, processes, and governance.",
      cta: { label: "Discuss an AI use case", href: "/contact" },
      secondary: { label: "Explore Workday integrations", href: "/services/workday-integrations" },
    },
  },

  /* 7 — How we work ------------------------------------------------------ */
  process: {
    id: "how-we-work",
    eyebrow: "How we work",
    title: "A proven approach to every Workday transformation",
    body: [
      "Every successful Workday journey starts with understanding the organization behind the technology.",
      "Hazeberg follows a structured approach that combines business understanding, solution design, technical expertise, rigorous validation, deployment support, and continuous optimization to deliver Workday solutions that create long-term value.",
    ],
    steps: [
      {
        key: "discover",
        name: "Discover",
        title: "Understand your business and goals",
        body: "We begin by understanding your current Workday environment, business processes, challenges, and future objectives to define the right approach.",
      },
      {
        key: "design",
        name: "Design",
        title: "Create the right solution foundation",
        body: "We define the solution strategy, business processes, integrations, and roadmap required to align Workday with your organization.",
      },
      {
        key: "build",
        name: "Build",
        title: "Transform requirements into Workday solutions",
        body: "Our consultants configure, develop, and prepare Workday solutions designed around your operational needs.",
      },
      {
        key: "test",
        name: "Test",
        title: "Validate before deployment",
        body: "We test configurations, integrations, and business processes to ensure readiness and minimize disruption.",
      },
      {
        key: "golive",
        name: "Go live",
        title: "Transition with confidence",
        body: "Hazeberg supports deployment, cutover activities, and early-stage stabilization to help ensure a smooth transition.",
      },
      {
        key: "optimise",
        name: "Optimize",
        title: "Continue improving beyond go-live",
        body: "We help organizations enhance adoption, refine processes, manage changes, and maximize the ongoing value of their Workday investment.",
      },
    ],
    /** The label on the loop in the document's own diagram. */
    cycleLabel: "Continuous cycle",
    closing: {
      eyebrow: "Maximize your Workday investment",
      title: "Turning your Workday platform into a long-term advantage.",
      body: "Through ongoing optimization, support, and improvement initiatives, Hazeberg helps organizations get more value from their Workday environment over time.",
    },
  },

  /* 8 — What we cover ---------------------------------------------------- */
  cover: {
    id: "what-we-cover",
    /** [derived] The section's own name in the document. */
    eyebrow: "What we cover",
    titleLead: "Expertise across the Workday ecosystem.",
    titleRest: "Support across the entire lifecycle.",
    body: [
      "Workday success requires more than expertise in individual modules. It requires a connected understanding of the platform, the business processes around it, and the changes that continue after deployment.",
      "Hazeberg brings together functional and technical capabilities across the Workday ecosystem, helping organizations implement, optimize, and continuously evolve their Workday environment.",
    ],
    /**
     * The document's "Workday Platform Expertise" list (HCM, Financials,
     * Student, Integrations, Extend, Prism Analytics, Adaptive Planning) is
     * left off this section by direction, 2026-10-01, and a photograph stands
     * in its place. The modules are still named in the page's last line.
     *
     * The photograph is the one made for this page's first hero idea: the
     * hero's globe at sunrise, with someone in front of it.
     */
    photo: {
      src: "/hero/whatwedo_hero.jpg",
      alt: "A consultant holding a tablet, with the Earth at sunrise behind her",
      width: 1376,
      height: 768,
      position: "84% 40%",
    },
    lifecycle: {
      title: "Across the Workday Lifecycle",
      lead: "Supporting every stage from deployment to continuous improvement:",
      items: [
        {
          key: "golive",
          title: "Go Live with Confidence",
          body: "Helping organizations transition smoothly into their Workday environment.",
        },
        {
          key: "testing",
          title: "Zero-Surprise Testing",
          body: "Ensuring configurations, integrations, and processes are validated before critical changes.",
        },
        {
          key: "health",
          title: "Workday Health Check",
          body: "Identifying improvement opportunities and creating a roadmap for optimization.",
        },
        {
          key: "support",
          title: "Always-On Workday Support",
          body: "Providing ongoing expertise to maintain, enhance, and evolve your platform.",
        },
      ],
    },
  },

  /* Closing line ---------------------------------------------------------- */
  closing: {
    title: "One Workday partner. Complete ecosystem expertise.",
    body: "Whether you are implementing new capabilities, improving existing processes, or planning what comes next, Hazeberg provides the expertise to help your Workday environment evolve with your organization.",
    /** [derived] The hero's own call to action, repeated at the foot. */
    cta: { label: "Talk to our experts", href: "/contact" },
  },

  /* Footer / navigation line --------------------------------------------- */
  /* The client's sentence named Reporting & Analytics too; it comes out while
     that page is held back (2026-10-02), so the sentence names exactly the
     links under it. Put it back with the page:
     "…Financials, Integrations, Reporting & Analytics, AMS, and Extend." */
  explore: {
    text: "Explore our specialized service offerings for deeper expertise across Workday HCM, Payroll, Financials, Integrations, AMS, and Extend.",
  },
} as const;
