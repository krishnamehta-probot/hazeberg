/**
 * Home page copy.
 *
 * Source: the client's "Hazeberg | Homepage Website Copy" document. Every string below
 * is theirs; nothing here is invented. Where the document leaves something unresolved it
 * is marked PLACEHOLDER per project rule 5.
 *
 * Section order follows the SaleUnion reference measured in `REFERENCE-SPEC.md`.
 *
 * Tone: smart, human, confident, enterprise-ready.
 * Audience: US-based Fortune 100 and Fortune 500 organizations.
 * Spelling: AMERICAN throughout, including in client-supplied copy — set 2026-09-25.
 */

/* 01 — opening ---------------------------------------------------------- */
export const HERO = {
  eyebrow: "Workday Consulting",
  title: "Workday expertise. Without the unnecessary overhead.",
  /** The same sentence, split so the second half can carry the brand amber.
      Yellow measures 1.65:1 on white, which is why it has been a fill only
      everywhere else — on this ground it is 11.97:1 and can finally be type. */
  titleA: "Workday expertise.",
  titleB: "Without the ",
  titleAccent: "unnecessary overhead.",
  /** Trimmed from the document's 27-word original. Both claims survive — what
      Hazeberg does, and who does it — at two thirds of the length; the cut words
      were "helps ... teams" scaffolding and "understand what it takes to". */
  lead: "We implement, improve, and manage Workday for enterprise teams, with consultants who know what keeps complex operations running.",
  kicker: "One Workday partner. From implementation to ongoing support.",
  cta: { label: "Let's Talk Workday", href: "/contact" },
  trust: "Trusted by enterprise teams",
  /** The hero's overlapping testimonial card. Attribution is client-approved. */
  quote: {
    stars: 5,
    body: "Workday ERP transformed our operations. The Hazeberg team provided outstanding support throughout the Phase X process.",
    name: "Program Lead",
    role: "Fortune 500 Client",
  },
} as const;

/* 02 — client rail (lives inside the hero) ------------------------------ */
export const LOGOS = {
  /**
   * The thirteen vectors supplied 2026-09-23, normalised once at import:
   *
   *   - every painted fill forced to white, because the strip sits on the hero's
   *     dark ground and the traces arrived in mixed colours
   *   - every DARK fill forced to `--void` instead, because those are knockouts,
   *     not marks. Painting them white too is what turned the UPS shield into a
   *     blank slab and filled in the DocuSign tile. This is why the band's
   *     background is fixed at `--void` and is not a free choice.
   *
   * `scale` is a HEIGHT multiplier on the rail's base height, measured by
   * `scripts/inkscale.mjs`, not guessed. Each file carries a different amount of
   * empty space inside its viewBox — Sandoz's wordmark fills 15% of its box
   * height, Alcon's fills 100% — so one CSS height gives thirteen different
   * apparent sizes. The weight is `inkFillH x ratio^0.35`, normalised to the
   * median; the 0.35 exponent leans on cap height rather than area, because
   * twelve of these thirteen are wordmarks and the eye reads their height first.
   *
   * The viewBoxes are left exactly as supplied. Because of that a mark's LAYOUT
   * box can be much taller than its ink — Sandoz reserves 109px for a 16px
   * wordmark — so the rail row is given a fixed height and the boxes are allowed
   * to overflow it. That is what keeps the band thin without touching the files.
   *
   * Re-derive with `scripts/inkscale.mjs` if a file is replaced. Do not hand-tune.
   */
  items: [
    { file: "novartis.svg", name: "Novartis", scale: 0.49 },
    { file: "chevron.svg", name: "Chevron", scale: 1.3 },
    { file: "hitachi.svg", name: "Hitachi", scale: 1.27 },
    { file: "alcon.svg", name: "Alcon", scale: 0.59 },
    { file: "ups.svg", name: "UPS", scale: 1.0 },
    { file: "iron-mountain.svg", name: "Iron Mountain", scale: 0.63 },
    { file: "medallia.svg", name: "Medallia", scale: 0.66 },
    { file: "docusign.svg", name: "DocuSign", scale: 1.54 },
    { file: "sandoz.svg", name: "Sandoz", scale: 3.04 },
    { file: "enovix.svg", name: "Enovix", scale: 0.93 },
    { file: "menasha.svg", name: "Menasha", scale: 1.41 },
    { file: "northstar.svg", name: "NorthStar Anesthesia", scale: 0.76 },
    { file: "digitalocean.svg", name: "DigitalOcean", scale: 1.13 },
  ],
} as const;

/* 03 — about us --------------------------------------------------------- */
export const ABOUT = {
  eyebrow: "Why Hazeberg",
  /**
   * `title` is not rendered on the home page: the client's layout leads with the
   * body paragraph alone. Kept here because it is their copy and the About page
   * will want it.
   */
  title:
    "Workday expertise, led by people who know the platform and understand the business behind it.",
  /**
   * The section's one hard number, lifted out of the paragraph so it can lead
   * and be counted up. It was buried mid-sentence before, which is the one place
   * a number nobody can miss should never be.
   */
  stat: 12,
  statSuffix: "+",
  statTail: "years of Workday expertise.",
  /**
   * Client-supplied. Revised 2026-09-25, and normalised to American spelling
   * with the rest of the site on the same instruction — "centres" and
   * "organisations" were the last two British forms in it.
   */
  body: "Hazeberg brings 12+ years of Workday expertise, backed by 200+ consolidated years of consultant experience, delivering enterprise implementations, complex integrations, and continuous support. Our certified consultants work alongside your teams to solve challenges, enable smarter decisions, and build solutions that create lasting value beyond go-live. With delivery centers in India and Malaysia, we support organizations across global time zones.",
  /** The way out of the section. It points at the About page, which the sitemap
      already carries and the nav already links as "About Hazeberg". */
  cta: { label: "Explore Hazeberg", href: "/about" },
  /**
   * Client-supplied marks. Their stroke colour is baked in, not currentColor:
   * `2nd.svg` is drawn in white because it sits on the filled circle. Reorder
   * these and that one goes invisible.
   */
  points: [
    {
      icon: "/3rd.svg",
      title: "Workday Expertise",
      body: "Certified consultants with deep, hands-on Workday experience.",
    },
    {
      /**
       * Added 2026-09-25 with the revised copy, and it is the fourth row against
       * three supplied marks. `icon` is deliberately omitted rather than reusing
       * one of the other three or redrawing a supplied file: `AboutPoints` falls
       * back to the locked icon set (Lucide) when there is no mark, which is the
       * one route that touches none of the client's artwork.
       */
      title: "Enterprise-Ready Integrations",
      body: "200+ integrations with platforms like ADP, Okta, and DocuSign.",
    },
    {
      icon: "/2nd.svg",
      title: "High-Fidelity Delivery",
      body: "Experienced leaders involved in the work, not just the kickoff.",
    },
    {
      icon: "/1st.svg",
      title: "Built for Your Business",
      body: "Practical solutions aligned with your processes, priorities, and goals.",
    },
  ],
} as const;

/* 04 — impact ----------------------------------------------------------- */
/**
 * Every figure here already appears in the client's document — nothing is
 * derived, averaged or invented:
 *
 *   40%    case study 01, Fortune 500 — "40% reduction in HR processing time"
 *   30%    case study 01, Fortune 500 — "30% reduction in payroll errors"
 *   100%   consulting results — "Every client we've onboarded is still with us"
 *   $500K  case study 01, Fortune 500 — "Approximately $500K in annual savings"
 *
 * Each carries its source, because three of the four come from ONE engagement.
 * Printed bare they would read as Hazeberg's averages, which the document does
 * not claim. Spreading the attribution needs more approved case data.
 *
 * The client's own note on the source doc stands: confirm each result against
 * approved documentation before launch.
 */
export const IMPACT = {
  eyebrow: "Our impact",
  title: "Better processes. Fewer bottlenecks. Stronger business outcomes.",
  /** The same sentence split at the turn, so the result can carry the amber.
      Four separate gains, then the one thing they add up to — which is also
      exactly what the scene draws. */
  titleLead: "Better processes. Fewer bottlenecks.",
  titleAccent: "Stronger business outcomes.",
  body: "We help enterprise teams get more from Workday through experienced delivery, smarter improvements, and support that keeps operations moving.",
  cta: { label: "Let's Optimize Your Workday Environment", href: "/contact" },
  mediaTag: "Delivery",
  /**
   * Replaced 2026-09-25 with the client's revised figures.
   *
   * **`source` is gone from every card.** The previous four were all traceable to
   * one Fortune 500 engagement and each carried that attribution. These four
   * arrive with no source given, and carrying the old one forward would attribute
   * figures to a client who never stated them. The scene now uses `statLabel`
   * where `source` used to sit.
   *
   * `stat` and `statLabel` are the client's, verbatim. `title` and `body` are the
   * line the scene shows when a strand is opened: two of them are the existing
   * approved copy, kept because the new figure still fits; the other two are
   * marked below and need the client's words.
   */
  cards: [
    {
      stat: "80%+",
      statLabel: "Process Efficiency Gains",
      title: "Operational Efficiency",
      body: "Less manual work. Smoother processes. Better use of your team's time.",
    },
    {
      stat: "<30 sec",
      statLabel: "Faster Data Actions",
      /** PLACEHOLDER — the figure is the client's, this line is not. */
      title: "Answers in Seconds",
      body: "Routine data actions resolved on the spot rather than raised as a request.",
    },
    {
      stat: "Weekly",
      statLabel: "Continuous Insights",
      title: "Continuous Improvement",
      body: "Keep improving your Workday environment long after go-live.",
    },
    {
      stat: "100%",
      statLabel: "Learning Alignment",
      /** PLACEHOLDER — the figure is the client's, this line is not. */
      title: "Aligned Enablement",
      body: "Teams trained on the tenant they actually run, not a generic course.",
    },
  ],
} as const;

/* 05 — services --------------------------------------------------------- */
/**
 * The copy carries seven cards. Only six are routes: AMS is an engagement model, so its
 * card points at /what-we-do#workday-ams rather than a service page that does not exist.
 * That keeps all seven pieces of copy and still leaves six Services pages.
 */
/**
 * Each item carries a `short` as well as its `body`. These are `[derived]`, not
 * new claims: every one is its own `body` compressed to a phrase, so the map view
 * can label a node without inventing anything the client never said. The map's
 * wedges carry an icon and the name only, so `short` is the list view's preview
 * line — and the obvious slot if real one-liners ever arrive.
 */
export const SERVICES = {
  eyebrow: "Our services",
  title: "Workday expertise, built around your business.",
  items: [
    {
      n: "01",
      label: "Workday HCM",
      short: "A stronger foundation for people operations",
      body: "Build a stronger foundation for your people operations, from core HR processes to talent and workforce management.",
      cta: "Explore HCM",
      href: "/services/workday-hcm",
    },
    {
      n: "02",
      label: "Workday Payroll",
      short: "Accurate payroll, built around compliance",
      body: "Support accurate, efficient payroll operations with solutions designed around your business requirements and compliance needs.",
      cta: "Explore Payroll",
      href: "/services/workday-payroll",
    },
    {
      n: "03",
      label: "Workday Financials",
      short: "Structure and visibility for financial operations",
      body: "Bring greater structure and visibility to financial operations through practical Workday solutions that support better decisions.",
      cta: "Explore Financials",
      href: "/services/workday-financials",
    },
    {
      n: "04",
      label: "Workday Integrations",
      short: "Connecting the systems your business relies on",
      body: "Connect Workday with the systems your business relies on. From integration design to implementation and support, we help keep information moving reliably.",
      cta: "Explore Integrations",
      href: "/services/workday-integrations",
    },
    {
      n: "05",
      label: "Reporting & Analytics",
      short: "Workday data turned into business insight",
      body: "Turn Workday data into useful business insight with reporting solutions that help teams understand performance and make informed decisions.",
      cta: "Explore Analytics",
      href: "/services/workday-reporting-analytics",
    },
    {
      n: "06",
      label: "Workday AMS",
      short: "Support that keeps working after go-live",
      body: "Keep your Workday environment running after go-live with responsive support, ongoing improvements, and a team that understands your system.",
      cta: "Explore AMS",
      href: "/what-we-do#workday-ams",
    },
    {
      n: "07",
      label: "Workday Extend",
      short: "Tailored experiences inside your Workday",
      body: "Build tailored Workday experiences that address specific business requirements while working within your broader Workday environment.",
      cta: "Explore Extend",
      href: "/services/workday-extend",
    },
  ],
} as const;

/* 06 — consulting results ----------------------------------------------- */
export const RESULTS = {
  eyebrow: "Our Global Workday Capability",
  /* Two lines, not one wrapped sentence: the figures take the first and carry
     the brand blue, the claim they support takes the second in ink. The head
     puts a hard break between them, so neither string carries a joining space. */
  titleLead: "20+ Projects. 200+ Integrations. 100% Customer Retention.",
  titleRest: "Trusted delivery across the Workday lifecycle.",
  body: "From Go-Live and Zero-Disruption Testing to Workday Health Checks and Always-On Support, we help enterprises achieve long-term success.",
  /**
   * Replaced 2026-09-25. These were four counters — 20+, 200+, 40+, 100% — and
   * the client moved those figures up into the heading, where they now open the
   * section. What is left in the cards is four capabilities, so the card no
   * longer counts anything: the counter is replaced by the item's index, and the
   * rest of the card (the rule, the wash, the hover) is unchanged.
   *
   * Every string is the client's, verbatim, including item 01 repeating its own
   * title in its body — flagged rather than silently trimmed.
   *
   * `tone` still drives the rule and the hover wash: three blue, amber on the
   * last, which is the same climb the photograph beside them draws.
   */
  items: [
    {
      n: "01",
      tone: "primary",
      title: "Pure-Play Workday Expertise",
      body: "Pure-play Workday expertise across implementation, Phase X, AMS, optimization, and integrations.",
    },
    {
      n: "02",
      tone: "primary",
      title: "Onshore + Global Delivery",
      body: "Delivery presence across Malaysia and India among 40+ countries, supporting global enterprises across Americas, EMEA, and APAC.",
      /** Lifted out of the sentence in brand blue. It is the one hard number left
          in the cards — the other three figures moved up into the heading — so it
          is the one fragment that should not read as ordinary body copy.
          A plain substring rather than markup in the string: the copy stays a
          serialisable string for Sanity, and the card does the splitting. */
      highlight: "40+ countries",
    },
    {
      n: "03",
      tone: "primary",
      title: "Functional & Technical Depth",
      body: "Expertise across HCM, Finance, Talent, Payroll, Recruiting, Learning, Reporting, and Integrations.",
    },
    {
      n: "04",
      tone: "accent",
      title: "AI & Integration Enablement",
      body: "200+ integrations connecting Workday with enterprise platforms and AI-driven solutions.",
    },
  ],
} as const;

/* 07 — case studies ------------------------------------------------------ */
/** Client note on the source doc: confirm each result against approved documentation. */
export const CASE_STUDIES = {
  eyebrow: "Use cases",
  title: "Workday Transformation Use Cases",
  body: "How Hazeberg enables smarter HR, Finance, and workforce transformation through Workday.",
  /**
   * **There is no case-study page.** These three are the whole record, so the
   * card carries everything and offers no way out of itself — a "read more" that
   * goes nowhere is worse than not having one.
   *
   * Four fields, and which of them is visible is the design decision: `impact`
   * is what the reader came for and is on the card from the start; `challenge`
   * and `approach` are the story behind it and sit behind the toggle.
   * `capabilities` is the client's own pipe-separated string, split here.
   */
  items: [
    {
      n: "01",
      title: "Modernizing HR Operations with Workday HCM",
      challenge:
        "A global enterprise was facing inefficiencies in HR operations due to fragmented processes and reliance on legacy systems. Limited automation and disconnected workforce data impacted employee experience and decision-making.",
      approach:
        "Hazeberg implemented Workday HCM capabilities to streamline core HR processes, automate workflows, improve employee data management, and create a unified source of workforce information.",
      impact: [
        "Reduced manual HR administration through process automation",
        "Improved accuracy and accessibility of workforce data",
        "Enabled real-time workforce insights for better decision-making",
      ],
      capabilities: [
        "Workday HCM",
        "HR Process Automation",
        "Workforce Reporting",
        "Employee Experience",
      ],
    },
    {
      n: "02",
      title: "Streamlining Global Workforce Management with Workday HCM & Payroll",
      challenge:
        "Managing HR operations across multiple countries created complexity due to varying compliance requirements, regional processes, and inconsistent workforce management practices.",
      approach:
        "Hazeberg deployed Workday HCM and Payroll solutions to standardize workforce processes, improve payroll operations, and support compliance management across regions.",
      impact: [
        "Improved employee experience through streamlined HR services",
        "Faster onboarding and workforce administration",
        "Enhanced compliance tracking across locations",
      ],
      capabilities: [
        "Workday HCM",
        "Payroll",
        "Compliance Management",
        "Global Workforce Operations",
      ],
    },
    {
      n: "03",
      title: "Driving Financial Visibility with Workday Finance",
      challenge:
        "Disconnected financial systems limited visibility into budgeting, reporting, and operational performance. Teams relied on manual processes, impacting financial planning and decision-making.",
      approach:
        "Hazeberg integrated Workday Finance capabilities to unify financial processes, improve reporting accuracy, and provide real-time visibility into financial operations.",
      impact: [
        "Improved financial reporting and operational visibility",
        "Faster budget approvals and planning cycles",
        "Enhanced forecasting through real-time insights",
      ],
      capabilities: [
        "Workday Finance",
        "Financial Reporting",
        "Analytics",
        "Process Integration",
      ],
    },
  ],
} as const;

/* 08 — engagement models ------------------------------------------------- */
export const MODELS = {
  eyebrow: "Engagement models",
  title: "The right support for where you are in your Workday journey.",
  body: "Your needs change depending on whether you're implementing Workday, improving an existing environment, or managing a live tenant. We offer engagement models designed around those different requirements.",
  /**
   * `stage` is `[derived]`, and derived from this section's own body: "whether
   * you're implementing Workday, improving an existing environment, or managing
   * a live tenant". Those are the client's three verbs in the client's own order
   * — the spine only names what the paragraph already says.
   */
  items: [
    {
      stage: "Implement",
      title: "Full Lifecycle Implementation",
      body: "From discovery to hypercare, we help plan, configure, test, and deliver Workday solutions that align with your business.",
      bestFor: "Organizations implementing Workday or undertaking a major transformation.",
      href: "/contact",
    },
    {
      stage: "Improve",
      title: "Workday Optimization",
      body: "Improve the way your tenant works through targeted support across cost optimization, integration modernization, payroll transformation, release management, and health checks.",
      bestFor: "Organizations looking to improve an existing Workday environment.",
      href: "/contact",
    },
    {
      stage: "Manage",
      title: "AMS & Ongoing Support",
      body: "Get dependable post-go-live support with an approach that combines issue resolution, operational continuity, and continuous improvement.",
      bestFor: "Organizations that need ongoing Workday expertise.",
      href: "/contact",
    },
  ],
  cta: "Get a proposal",
} as const;

/* 09 — testimonials ------------------------------------------------------ */
/** Client note on the source doc: use client-approved quotes only. */
/**
 * Two of these are the client's, from their document. The other four are
 * **PLACEHOLDER** — written to fill the carousel while the design is judged, and
 * marked so nobody ships them by accident. They carry no company names and no
 * people's names for the same reason: a fabricated quote is bad, a fabricated
 * quote attributed to a named person at a named company is a different thing
 * entirely.
 *
 * Filter on `placeholder` to see what has to be replaced.
 */
export const TESTIMONIALS = {
  eyebrow: "Testimonials",
  title: "A consulting partner that stays engaged.",
  items: [
    {
      body: "Workday ERP transformed our operations. The Hazeberg team provided outstanding support throughout the Phase X process.",
      name: "Program Lead",
      role: "Fortune 500 Client",
    },
    {
      body: "Hazeberg has been outstanding and thorough in what they are delivering.",
      name: "Program Lead",
      role: "Fortune 500 Client",
    },
    {
      placeholder: true,
      body: "They understood our payroll calendar before they touched a single configuration. That is rarer than it should be.",
      name: "Payroll Director",
      role: "Global Manufacturer",
    },
    {
      placeholder: true,
      body: "The integrations work landed on time and has not needed a rescue since. Our team finally stopped exporting spreadsheets.",
      name: "IT Program Manager",
      role: "Healthcare Group",
    },
    {
      placeholder: true,
      body: "Post go-live is where most partners go quiet. Hazeberg got louder, and our ticket volume halved in two quarters.",
      name: "HR Operations Lead",
      role: "Financial Services",
    },
    {
      placeholder: true,
      body: "Senior people stayed on the work after the kickoff. That single fact changed how the whole program ran.",
      name: "Transformation Director",
      role: "Fortune 100 Client",
    },
  ],
} as const;

/* 10 — why choose -------------------------------------------------------- */
/* RETIRED FROM THE HOME PAGE, 2026-09-23 — the page ran to 18 screens and
   these two came out. The copy is the client's and is kept here rather than
   deleted: Why choose Hazeberg has an obvious home on the About page, and an FAQ
   belongs on a page of its own. Unused exports are dropped by the bundler,
   so parking them costs the home page nothing. */
export const WHY = {
  eyebrow: "Why choose Hazeberg",
  title: "The Right Workday Expertise Changes Everything.",
  body: "Hazeberg brings experienced consultants, direct involvement, and a focused Workday practice to enterprise teams looking for better delivery and dependable support.",
  overlay: {
    quote: "Hazeberg has been outstanding and thorough in everything they deliver.",
    name: "Program Lead",
    role: "Fortune 500 Client",
    stat: "11+ years",
    statLabel: "Workday-focused experience",
  },
  points: [
    {
      n: "01",
      kicker: "Experience that matters",
      title: "Work with people who know Workday.",
      body: "Our consultants bring 11+ years of Workday experience to the requirements, decisions, and challenges that shape your engagement.",
    },
    {
      n: "02",
      kicker: "Focused on Workday",
      title: "One platform. Deep expertise.",
      body: "We focus exclusively on Workday, building the knowledge and experience needed to support complex enterprise environments.",
    },
    {
      n: "03",
      kicker: "Beyond go-live",
      title: "The relationship doesn't end at implementation.",
      body: "From ongoing support to optimization, we stay involved as your business evolves and your Workday environment needs to keep pace.",
    },
  ],
  cta: { label: "Let's talk about your Workday environment", href: "/contact" },
} as const;

/* 11 — FAQ --------------------------------------------------------------- */
/* RETIRED FROM THE HOME PAGE, 2026-09-23 — the page ran to 18 screens and
   these two came out. The copy is the client's and is kept here rather than
   deleted: the FAQ has an obvious home on the About page, and an FAQ
   belongs on a page of its own. Unused exports are dropped by the bundler,
   so parking them costs the home page nothing. */
export const FAQ = {
  eyebrow: "FAQ",
  title: "Before you trust us with Workday, here's what you should know.",
  body: "Straight answers about our expertise, delivery, and how we work with your team.",
  items: [
    {
      q: "What does Hazeberg actually do?",
      a: "We help enterprise teams implement, improve, and support Workday across HCM, Payroll, Financials, Integrations, Reporting & Analytics, AMS, and Extend. Whether you're starting fresh or working through challenges in an existing environment, we bring the expertise to move things forward.",
    },
    {
      q: "Can you take over an existing Workday environment?",
      a: "Yes. We support existing Workday tenants through AMS, optimization, and ongoing improvements. Our focus is a structured transition, clear ownership, and support that keeps your operations moving.",
    },
    {
      q: "Who will actually be working on our account?",
      a: "Experienced Workday consultants with 11+ years of Workday-focused experience. We believe the people who understand your requirements should stay close to the work, not disappear behind layers of management.",
    },
    {
      q: "Why work with Hazeberg instead of a larger consulting firm?",
      a: "We're focused exclusively on Workday. That means a more specialized team, direct access to experienced consultants, and a delivery approach without the unnecessary layers of a large multi-practice firm.",
    },
    {
      q: "Can you support Workday across multiple countries?",
      a: "Yes. We've supported organizations operating across 40+ countries, with experience in international HR, payroll, integrations, and diverse business requirements.",
    },
    {
      q: "What happens after implementation?",
      a: "We stay involved. Through AMS and optimization, we help your team manage ongoing requirements, address issues, improve processes, and keep your Workday environment aligned with the business.",
    },
    {
      q: "How long does a Workday implementation take?",
      a: "There's no universal timeline. Scope, modules, integrations, and business requirements all influence delivery. We'll help you understand the work involved, from discovery and build through testing and hypercare.",
    },
    {
      q: "Do you only work with Fortune 500 companies?",
      a: "We've delivered for Fortune 100 and Fortune 500 organizations, but our services aren't limited to them. We work with organizations running or considering Workday that need experienced consulting support.",
    },
    {
      q: "What's the first step?",
      a: "Tell us what you're working on. Whether it's a new implementation, a struggling integration, or an existing Workday environment that needs attention, we'll start with a conversation about your requirements.",
    },
  ],
} as const;

/* 12 — final CTA --------------------------------------------------------- */
export const CLOSING = {
  eyebrow: "Let's talk Workday",
  title: "A better Workday experience starts with the right conversation.",
  body: "Let's discuss your requirements and find a practical way forward.",
  cta: { label: "Book a consultation", href: "/contact" },
} as const;

/* 13 — footer ------------------------------------------------------------ */
export const FOOTER = {
  blurb:
    "Workday consulting focused on implementation, optimization, and ongoing support for enterprise organizations.",
  body: "We help businesses make better use of Workday through experienced consultants, practical delivery, and long-term engagement.",
  address: "Coimbatore, Tamil Nadu, India",
  cta: { label: "Book a consultation", href: "/contact" },
} as const;
