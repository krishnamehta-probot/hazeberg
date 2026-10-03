/**
 * Berg page copy.
 *
 * SOURCE: the client's "Berg Page Content" document, 2026-09-28. **Every
 * heading, paragraph, bullet, price, CTA label and FAQ answer below is theirs,
 * verbatim.** This replaces the earlier version entirely — that one was built
 * from the live app's metadata and robots.txt because no copy existed yet, and
 * it carried marked placeholders for the FAQ answers. There are no placeholders
 * left on this page.
 *
 * Two deliberate departures, both flagged:
 *
 *   1. **American spelling**, per the instruction that took the whole site to
 *      American forms. Their document writes "organisations", "optimisation" and
 *      "specialised"; those are the only words changed, and only in spelling.
 *   2. **The prices are the document's**, not the live site's. The live Berg
 *      marketing page still shows ₹299 and ₹999; the document supersedes it with
 *      $4 and $12 a month. Flagged because the two are live at the same time and
 *      somebody has to reconcile them.
 *
 * Not carried across, per `SITEMAP.md` — "A Hazeberg solution, not a sub-brand,
 * no separate visual identity": the purple-and-orange palette their own page
 * runs. The words are theirs; the system they are set in is ours.
 *
 * The Berg logo IS used, at the client's request of 2026-09-30: the hero's
 * network scene turns its orb into it when Berg is picked, and the home page's
 * Berg band carries it (`components/brand/berg-logo.tsx`).
 * It brings no second identity with it — its blue and amber are exactly
 * Hazeberg's `--primary` and `--accent`.
 */

/** The Berg web app. Every "Get Started", the enquiry button and the mobile
    block's web link go here, so it is written once. The two STORE addresses
    are not here: they live beside the QR codes drawn from them, in
    `components/berg/qr-codes.ts`, so a code and its link cannot disagree. */
const BERG_APP_URL = "https://berg.hazebergconsulting.com";

export const BERG = {
  eyebrow: "Berg — a Hazeberg platform",
  /** [live] Split so the second half can carry the accent. */
  titleLead: "Where the Workday",
  titleAccent: " World Comes Together",
  lead: "The marketplace built for the Workday ecosystem. Customers, consulting firms, and consultants connect through one platform to discover opportunities, collaborate faster, and build stronger Workday outcomes.",
  strapline: "One platform. Three groups. Infinite opportunities.",
  cta: { label: "Get Started", href: BERG_APP_URL },

  /* -- the three groups ------------------------------------------------ */
  /**
   * The client's document specifies a COLLAPSED and an EXPANDED state for each
   * card, so the expand is their design decision, not a flourish added here.
   */
  roles: {
    eyebrow: "Who it is for",
    title: "The Workday ecosystem built for everyone",
    body: "A unified Workday marketplace connecting customers, consulting firms, and consultants through one trusted ecosystem.",
    moreLabel: "Read more",
    lessLabel: "Show less",
    items: [
      {
        key: "customers",
        n: "01",
        title: "For Workday Customers",
        /* collapsed */
        headline: "Find the right Workday expertise faster.",
        teaser:
          "Connect with verified consultants and trusted firms to deliver projects with confidence.",
        /* expanded */
        expandedHeadline: "Find expertise that matches your Workday needs.",
        body: [
          "Workday success depends on having the right expertise at the right time.",
          "Berg connects customers with verified consultants and trusted consulting firms across the Workday ecosystem.",
          "Whether you are implementing new modules, expanding your workforce capabilities, or looking for ongoing support, Berg helps you discover the right partners for your goals.",
        ],
        benefitsLabel: "With Berg, Workday customers benefit from:",
        benefits: [
          "Access to specialized Workday expertise across HCM, Finance, Integrations, and more.",
          "Flexible engagement options for implementation, optimization, and AMS requirements.",
          "Faster connections with experienced consultants and trusted partner firms.",
          "A simpler way to find the right capability for every stage of your Workday journey.",
        ],
        closing:
          "At its core, Berg helps customers build stronger Workday outcomes through trusted connections and specialized expertise.",
      },
      {
        key: "firms",
        n: "02",
        title: "For Workday Consulting Firms",
        headline: "Discover opportunities. Expand your delivery capabilities.",
        teaser:
          "Connect with customers, projects, and skilled Workday professionals through one trusted marketplace.",
        expandedHeadline: "Grow your Workday network and strengthen delivery.",
        body: [
          "Finding the right opportunities and the right expertise can define how quickly a consulting firm scales.",
          "Berg helps consulting firms discover customer requirements, connect with Workday professionals, and build stronger delivery capabilities through one ecosystem.",
          "Whether you are expanding AMS operations, looking for specialized module expertise, or exploring new client opportunities, Berg helps you create meaningful connections.",
        ],
        benefitsLabel: "With Berg, Workday consulting firms gain:",
        benefits: [
          "Access to relevant Workday requirements from customers worldwide.",
          "Connections with skilled consultants across different Workday domains.",
          "Faster talent discovery for project delivery and specialized requirements.",
          "New opportunities to grow partnerships and expand service capabilities.",
        ],
        closing:
          "Berg brings together opportunities, expertise, and collaboration to help consulting firms deliver with greater confidence.",
      },
      {
        key: "jobseekers",
        n: "03",
        title: "For Workday Jobseekers",
        headline: "Get discovered by the right Workday teams.",
        teaser:
          "Showcase your expertise and connect with opportunities that match your skills and experience.",
        expandedHeadline: "Turn your Workday expertise into new opportunities.",
        body: [
          "Your Workday experience deserves to be discovered by organizations that understand your skills.",
          "Berg connects consultants with customers and consulting firms looking for expertise across different Workday modules and roles.",
          "Create your profile, highlight your experience, and discover opportunities aligned with your capabilities.",
        ],
        benefitsLabel: "With Berg, Workday consultants can:",
        benefits: [
          "Access relevant project and job opportunities from verified customers and firms.",
          "Showcase Workday skills, certifications, and experience.",
          "Build direct connections with organizations seeking specialized expertise.",
          "Become part of a growing Workday community focused on collaboration and growth.",
        ],
        closing:
          "Berg helps Workday professionals find meaningful opportunities while building stronger connections across the ecosystem.",
      },
    ],
  },

  /* -- the workflow ---------------------------------------------------- */
  /** [live] Five steps, each with its own labelled footer — the label differs per
      step in the client's document and is kept exactly as written. */
  workflow: {
    eyebrow: "How Berg works",
    titleLead: "Turning Workday needs into",
    titleAccent: " meaningful connections",
    body: "Berg brings customers, consulting firms, and consultants together through a connected ecosystem designed to discover expertise, accelerate collaboration, and deliver better Workday outcomes.",
    items: [
      {
        n: "01",
        title: "Identify",
        headline: "Every Workday journey starts with a need.",
        body: [
          "Organizations define their goals, requirements, and challenges.",
          "Whether it is implementation, optimization, expansion, or ongoing support, Berg helps bring the right requirement into focus.",
        ],
        footLabel: "Who starts here",
        footValue: "Workday Customers",
      },
      {
        n: "02",
        title: "Discover",
        headline: "Find the expertise that fits.",
        body: [
          "Berg connects requirements with relevant Workday capabilities across modules, industries, and experience levels.",
          "Consulting firms and consultants discover opportunities aligned with their expertise.",
        ],
        footLabel: "Powered by",
        footValue: "Workday skills, experience, and requirements",
      },
      {
        n: "03",
        title: "Connect",
        headline: "Bring the right people together.",
        body: [
          "Customers, consulting firms, and consultants build meaningful connections through a trusted Workday marketplace.",
          "The right conversations begin with the right context.",
        ],
        footLabel: "The Berg advantage",
        footValue: "Relevant connections, not random matches",
      },
      {
        n: "04",
        title: "Deliver",
        headline: "Transform plans into Workday success.",
        body: [
          "The right expertise helps organizations implement, optimize, and support their Workday environment.",
          "Better connections create stronger outcomes.",
        ],
        footLabel: "Outcome",
        footValue: "Successful Workday delivery",
      },
      {
        n: "05",
        title: "Grow",
        headline: "Keep improving beyond delivery.",
        body: [
          "Workday ecosystems continue to evolve.",
          "Berg enables ongoing connections, future opportunities, and continuous growth across the community.",
        ],
        footLabel: "Outcome",
        footValue: "A connected Workday ecosystem",
      },
    ],
  },

  /* -- the platform ---------------------------------------------------- */
  /** [live] Each feature has a STATIC line and an EXPANDED body in the client's
      document — again, their design decision, not an invented interaction. */
  platform: {
    eyebrow: "Berg, a Hazeberg platform",
    title: "Designed by Workday experts for the world",
    body: "Berg creates a smarter way for organizations, firms, and professionals to connect, collaborate, and grow.",
    items: [
      {
        icon: "search",
        title: "Opportunity Access",
        headline: "Find the right Workday opportunities in one place",
        body: [
          "Berg gives customers, consulting firms, and consultants access to relevant Workday requirements, projects, and roles through a single connected platform.",
          "Discover opportunities that match your expertise, business needs, and delivery goals.",
        ],
      },
      {
        icon: "money",
        title: "Smart Monetization",
        headline: "Flexible access designed for every participant",
        body: [
          "Berg creates value across the Workday ecosystem with a model built around different user needs.",
          "Customers can post requirements free. Consultants can showcase their expertise free. Consulting firms gain access to broader opportunities through flexible subscription options.",
        ],
      },
      {
        icon: "shield",
        title: "Trusted Marketplace",
        headline: "A Workday ecosystem built on credibility",
        body: [
          "Berg connects organizations with Workday professionals and partners in a secure and transparent environment.",
          "Powered by Hazeberg's Workday expertise, the platform helps create meaningful connections built around trust, relevance, and collaboration.",
        ],
      },
    ],
  },

  /* -- the app --------------------------------------------------------- */
  /**
   * The owner's change list, 2026-10-03: "QR Codes to be added for Android
   * and iOS for Mobile application download. Web application link can be
   * added too." So the document's single "Berg on mobile — download now"
   * button, which pointed at the web app and downloaded nothing, became the
   * two stores and the web app, each named for what it does.
   *
   * These labels are NOT from the client's document, unlike the rest of the
   * file: "Get it on Google Play" and "Download on the App Store" are the
   * stores' own wording for a link to them, and the platform names, the scan
   * prompt, the web link and the two QR descriptions are mine. The store URLs
   * are in `components/berg/qr-codes.ts`, keyed by `key`.
   */
  app: {
    eyebrow: "On mobile",
    titleLead: "What if your entire Workday network fit",
    titleAccent: " in your pocket?",
    body: "From discovering new requirements to connecting with the right people, Berg brings the Workday ecosystem closer wherever you go.",
    bodySecond:
      "Stay updated on opportunities, manage conversations, and keep your Workday journey moving from anywhere.",
    /** Over the codes, which show only with a mouse or trackpad from `md`.
        On a touch screen there are no codes to scan, and no label. */
    scanLabel: "Scan with your phone's camera",
    stores: [
      {
        key: "android",
        platform: "Android",
        label: "Get it on Google Play",
        qrLabel: "QR code for Berg on Google Play",
      },
      {
        key: "ios",
        platform: "iOS",
        label: "Download on the App Store",
        qrLabel: "QR code for Berg on the App Store",
      },
    ],
    web: { label: "Open the web app", href: BERG_APP_URL },
    panelLabel: "Powering operations for",
    tiles: ["Workday Customer", "Workday Consulting Firm", "Workday Job Seeker"],
    panelNote: "A unified platform that streamlines collaboration and opens new growth opportunities.",
  },

  /* -- pricing --------------------------------------------------------- */
  pricing: {
    eyebrow: "Pricing",
    title: "Simple pricing. Built for the Workday ecosystem.",
    body: "Choose the plan that fits your role. Start free, or unlock additional access when you need more from Berg.",
    note: "All plans are designed to help customers, consulting firms, and consultants connect within the Workday ecosystem.",
    items: [
      {
        icon: "org",
        title: "Workday Customers",
        price: "Free",
        body: "Post your Workday requirements and connect with relevant consultants and consulting firms.",
        benefits: [
          "Post Workday requirements",
          "Connect with Workday professionals",
          "Access the Berg ecosystem at no cost",
        ],
        cta: "Get Started",
        featured: false,
      },
      {
        icon: "firm",
        title: "Workday Consulting Firms",
        price: "$4",
        unit: "/ month",
        body: "Access Workday requirements and discover opportunities across the ecosystem.",
        benefits: [
          "Browse relevant Workday requirements",
          "Discover new project opportunities",
          "Connect with potential clients and consultants",
        ],
        cta: "Start Subscription",
        featured: true,
      },
      {
        icon: "person",
        title: "Workday Consultants",
        price: "$12",
        unit: "/ month",
        label: "Premium Plan",
        body: "Increase your visibility and unlock premium Workday opportunities.",
        benefits: [
          "Create your Workday profile for free",
          "Showcase your skills and experience",
          "Access premium opportunities with an upgrade",
        ],
        cta: "Choose Premium",
        featured: false,
      },
    ],
  },

  /* -- FAQ ------------------------------------------------------------- */
  /** [live] All ten, questions and answers, verbatim. */
  faq: {
    eyebrow: "FAQ",
    title: "Everything you need to know about Berg",
    body: "A single platform connecting Workday customers, consulting firms, and consultants. Explore how Berg helps the ecosystem discover opportunities, build connections, and grow together.",
    items: [
      {
        q: "What is Berg?",
        a: [
          "Berg is a Workday marketplace built by Hazeberg that connects customers, consulting firms, and consultants through one trusted ecosystem.",
          "It helps organizations discover expertise, firms find opportunities, and consultants showcase their Workday experience.",
        ],
      },
      {
        q: "Who can use Berg?",
        a: ["Berg is designed for three groups within the Workday ecosystem:"],
        list: [
          "Workday Customers looking for expertise and delivery support.",
          "Consulting Firms looking for new opportunities and skilled professionals.",
          "Workday Consultants looking to showcase their experience and discover relevant opportunities.",
        ],
      },
      {
        q: "How does Berg work?",
        a: [
          "Customers can post their Workday requirements on Berg.",
          "Consulting firms and consultants can discover relevant opportunities based on skills, modules, and requirements.",
          "The right connections are created through a specialized Workday marketplace.",
        ],
      },
      {
        q: "What type of Workday opportunities are available on Berg?",
        a: [
          "Berg supports opportunities across different areas of the Workday ecosystem, including implementation, optimization, support, AMS, and specialized module expertise.",
          "Requirements may include areas such as HCM, Finance, Integrations, Payroll, Reporting, and other Workday capabilities.",
        ],
      },
      {
        q: "How do Workday consultants get discovered?",
        a: [
          "Consultants can create their profile, highlight their Workday skills, experience, and certifications.",
          "Their expertise becomes visible to organizations and firms looking for relevant capabilities.",
        ],
      },
      {
        q: "How do consulting firms benefit from Berg?",
        a: [
          "Consulting firms can access relevant Workday requirements, discover new opportunities, and connect with consultants to strengthen delivery capabilities.",
          "Berg helps firms expand their network within the Workday ecosystem.",
        ],
      },
      {
        q: "How much does Berg cost?",
        a: [
          "Customers can join Berg for free and post Workday requirements.",
          "Consulting firms can access opportunities through a subscription plan.",
          "Consultants can create a profile for free and upgrade to premium access when they want additional opportunities.",
        ],
      },
      {
        q: "Can I access remote Workday opportunities?",
        a: [
          "Yes. Opportunities on Berg can include remote, hybrid, or location-based requirements depending on the customer's needs.",
          "Users can explore opportunities based on their preferred working model.",
        ],
      },
      {
        q: "How does Berg protect my information?",
        a: [
          "Berg is built and managed by Hazeberg with a focus on security and trusted connections.",
          "User information is used to create relevant ecosystem connections while maintaining privacy and transparency.",
        ],
      },
      {
        q: "How do I get started with Berg?",
        a: [
          "Choose your role, create your account, and start exploring the Workday ecosystem.",
          "Customers can post requirements. Firms can discover opportunities. Consultants can build their profiles and connect with relevant opportunities.",
        ],
      },
    ],
  },

  /* -- contact --------------------------------------------------------- */
  /** Berg's own support address, phone and office — all different from the
      Hazeberg consulting details in `lib/navigation.ts`, and kept separate for
      the obvious reason: a Berg question in the consulting inbox is a question
      in the wrong queue. [live] from the Berg site's own footer. */
  contact: {
    eyebrow: "Contact",
    titleLead: "Contact us to",
    titleAccent: " level up your Workday",
    body: "We take the stress out of your Workday, so your team can focus on what matters most.",
    email: "support.berg@hazebergconsulting.com",
    /** The client's new number, 2026-09-30. Berg's own footer still printed
        the old one (+91 97505 33701) when this was changed. */
    phone: "+91 90422 00899",
    phoneHref: "tel:+919042200899",
    office: [
      "Ksquare Complex",
      "19/A, Villankurichi Rd, Vinayagapuram",
      "Coimbatore, Tamil Nadu 641035",
    ],
    cta: { label: "Send an enquiry", href: BERG_APP_URL },
  },

  cross: {
    eyebrow: "Need the team, not the platform?",
    title: "Hazeberg delivery and AMS",
    body: "Implementation, optimization, integrations and ongoing support, delivered by our own consultants.",
    href: "/contact",
  },
} as const;

/**
 * The band on the home page, straight after Services, that points at Berg —
 * the client asked for one short section saying Berg is theirs, not a second
 * Berg page. Every sentence is from the Berg page's own copy above; only the
 * eyebrow (from `eyebrow`, "Berg — a Hazeberg platform") and the button label
 * are mine. Not in Sanity: it is Berg's copy, and Berg's copy lives here.
 */
export const BERG_HOME_BAND = {
  eyebrow: "A Hazeberg platform",
  /** [live] the page's own title, split where the page splits it. */
  titleLead: BERG.titleLead,
  titleAccent: BERG.titleAccent,
  /** [live] the first sentence of `lead`. */
  body: "The marketplace built for the Workday ecosystem.",
  /** The three groups, in the scene's order and with the scene's names. */
  groups: [
    { key: "customers", label: "Customers" },
    { key: "firms", label: "Consulting Firms" },
    { key: "consultants", label: "Consultants" },
  ],
  cta: { label: "Explore Berg", href: "/berg" },
  /** [live] "Get Started", to the Berg app. */
  app: BERG.cta,
} as const;
