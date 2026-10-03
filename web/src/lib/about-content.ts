/**
 * About — the client's copy, in full.
 *
 * Source: "About Page" (Google Doc), supplied 2026-10-02. It replaces the draft
 * this file used to carry — the founding-story placeholders, the team roster
 * note and the empty Rewards slots are all gone, because the document does not
 * have them. Six sections, in the document's order:
 *
 *   Hero · Our story · How we're built · Meet the team · Recognition ·
 *   Start a conversation
 *
 * And two from the owner's change list (2026-10-02), with the hero's new
 * figures and Sakthi's title: the Founder's note, after Our story, and Life at
 * Hazeberg, after Meet the team. Their photographs are in `about-photos.ts`.
 *
 * Marking:
 *
 *   (unmarked)  the client's words, verbatim — except the spelling, which is US
 *               English throughout (organizations, optimization, center), as on
 *               every other page. The document mixed the two; the site does not
 *   [derived]   structure the page needs that the document implies but does not
 *               write: an eyebrow named after its own section, an anchor, a
 *               figure lifted out of the document's own sentence, a time zone
 *   [fact]      read off the client's own material in this repo — the DPIIT
 *               certificate (`design/certificates/dpiit-recognition.png`)
 *
 * Two things the document does that are worth knowing:
 *
 *   1. **It drops the stray "Untitled" chips** the Google Doc carried after
 *      each Story paragraph. Those are empty smart-chips, not copy.
 *   2. **The Coimbatore address is the live site's old one** — Annamalai
 *      Industrial Park, Kalapatti — where `navigation.ts` `OFFICES` (supplied
 *      2026-09-30) has Ksquare Complex, Vinayagapuram. The document is followed
 *      here as written; which address is current is a question for the client.
 *
 * Anchors: `#our-story`, `#founder`, `#how-were-built`, `#leadership`,
 * `#life-at-hazeberg`, `#recognition`, `#start-a-conversation`. `#our-story` and `#leadership` keep the ids the old
 * page had; nothing else on the site links into this page by hash.
 */

export type AboutStat = { value: number; suffix?: string; label: string };

export type AboutCommitment = {
  /** [derived] */
  key: "only-workday" | "same-people" | "working-day" | "straight-about-risk";
  n: string;
  claim: string;
  line: string;
  proof: string;
};

export type AboutPerson = {
  /** [derived] */
  key: string;
  name: string;
  role: string;
  /** The bold opening of the bio — the person's specialism in one line. */
  focus: string;
  bio: string;
  /** The bold closing line, verbatim. */
  credentials: string;
  /** [derived] Lifted out of `credentials` so they can be drawn. */
  years: { value: number; plus: boolean; scope: string };
  certs: readonly string[];
  /** No portrait has been supplied for anyone. The component draws the
      person's initials until one is; set a path here and it takes over. */
  portrait: string | null;
};

export const ABOUT = {
  hero: {
    eyebrow: "About Hazeberg",
    titleLead: "We saw what Workday was missing. ",
    titleAccent: "So we built it differently.",
    lead: "Built by Workday practitioners, Hazeberg brings hands-on expertise to every stage of the Workday lifecycle.",
    /* The document's order: Meet the team first, then Contact us. The first is
       the pill and goes down the page; the second is the quiet link. */
    cta: { label: "Meet the team", href: "#leadership" },
    secondary: { label: "Contact us", href: "/contact" },
    statsLabel: "The scale behind Hazeberg",
    /* The owner's set (change list, 2026-10-02): "200+ Integrations built"
       removed — it had already gone with the rebuild — and 160+ countries,
       35+ customers and 5M users served added. 100% retention is the About
       document's own figure and stays beside them. Krishna, 2026-10-03:
       "50+ Projects Delivered. 35+ Global Client Served" — the projects
       figure up from 20+, and the customers named as global clients served
       (plural here; the home page carries the same two). */
    stats: [
      { value: 200, suffix: "+", label: "Combined years of Workday experience" },
      /* A no-break space before "delivered": on the narrow rail at 1024-1132
         it would otherwise wrap to a line of its own. */
      { value: 50, suffix: "+", label: "Workday projects delivered" },
      { value: 160, suffix: "+", label: "Countries supported" },
      { value: 35, suffix: "+", label: "Global clients served" },
      { value: 5, suffix: "M", label: "Users served" },
      { value: 100, suffix: "%", label: "Customer retention" },
    ] satisfies AboutStat[],
  },

  story: {
    id: "our-story",
    eyebrow: "Our story",
    title: "The problems we saw became the standards we built around.",
    body: [
      "Hazeberg was shaped by years of hands-on Workday experience across implementations, data conversions, integrations, and application support. We saw the same challenges repeat, from solutions that did not fit the business to customers left without enough support after go-live.",
      "That experience led us to build a specialist Workday practice where expertise stays focused, delivery stays accountable, and the relationship continues beyond implementation.",
    ],
    mission: {
      eyebrow: "Our mission",
      title: "Make Workday work better for the organizations that rely on it.",
      body: "Bring focused Workday expertise to every engagement, from implementation through ongoing support and optimization.",
    },
    vision: {
      eyebrow: "Our vision",
      title: "Raise the standard for Workday partnership.",
      body: "Build a specialist practice known for deep expertise, accountable delivery, and long-term customer relationships.",
    },
    /** The document's closing statement, split where its full stop falls so
        the second sentence can carry the accent. */
    closing: {
      lead: "Specialists in Workday.",
      accent: "Invested in what comes next.",
    },
  },

  /**
   * The founder's note — the owner's text (change list, 2026-10-02), verbatim.
   * `**…**` marks the owner's own bold; the component sets it as emphasis
   * (`<strong>`), never as a heavier headline. Nothing else is markup.
   */
  founder: {
    id: "founder",
    /** [derived] */
    eyebrow: "Founder's note",
    name: "Sakthi Vignesh",
    role: "Founder & CEO, Hazeberg Consulting LLP",
    /** The owner's bold line under the name — the section's heading. */
    title: "Building a Workday consulting company from Coimbatore, with a global vision.",
    body: [
      "Sakthi Vignesh is the Founder and CEO of **Hazeberg Consulting LLP**, a Workday-focused consulting firm built with a simple belief: **quality should always come before quantity.**",
      "With deep experience in the Workday ecosystem, Sakthi founded Hazeberg with the ambition of creating a consulting organization that combines strong technical expertise, trusted customer relationships, and a culture where people can grow. What started as a focused entrepreneurial venture has grown into a global Workday consulting team supporting customers across multiple Workday programs and geographies.",
      "Under his leadership, Hazeberg has developed expertise across **Workday HCM, Finance, Integrations, PRISM, Adaptive Planning, Payroll, Reporting, Workday Extend, Orchestrate, Studio, and post-production support**. The company works with organizations ranging from growing businesses to global enterprises, including Fortune 100 and Fortune 500 organizations.",
      "Sakthi's approach to building Hazeberg is rooted in three principles: **stay specialized, stay close to customers, and continuously invest in people.** He believes that a consulting company's greatest strength is not its size, but the quality of its people and the trust it builds with every engagement.",
      "He is also the driving force behind **BERG**, a platform created specifically for the Workday ecosystem, bringing together Workday customers, consulting firms, and professionals on a unified platform.",
    ],
    /** [derived] The three principles, lifted out of the fourth paragraph so
        they can be drawn. The paragraph keeps them too. */
    principles: ["Stay specialized", "Stay close to customers", "Continuously invest in people"],
    beyond: {
      /** The owner's own subheading, without its colon. */
      eyebrow: "Beyond Business",
      lead: "For Sakthi, entrepreneurship is not simply about building a company. It is about creating opportunities, developing talent, and building something that can create a lasting impact.",
      body: [
        "He believes great companies are built by people who work hard, work smart, work together, and celebrate their journey along the way.",
        "From building a Workday practice in Coimbatore to creating a global consulting organization, Sakthi continues to focus on one goal — building Hazeberg into a trusted name in the Workday ecosystem, one customer and one consultant at a time.",
      ],
    },
    /** The owner's three founder files (`about-photos.ts`). */
    portrait: "founder-portrait",
    recognition: ["founder-recognition-01", "founder-recognition-02"],
  },

  built: {
    id: "how-were-built",
    /** [derived] the document's section name. */
    eyebrow: "How we're built",
    title: "Four commitments, and what keeps them true.",
    body: "Most firms make similar claims. Each of ours is tied to something about how Hazeberg is set up, so you can check it rather than take it on trust.",
    proofLabel: "What keeps it true",
    items: [
      {
        key: "only-workday",
        n: "01",
        claim: "Workday, and only Workday",
        line: "Our consultants work in Workday every day, on nothing else.",
        proof:
          "A significant share of the team is Workday-certified, with 200+ consolidated years of Workday experience.",
      },
      {
        key: "same-people",
        n: "02",
        claim: "The people you meet do the work",
        line: "The consultants in the first conversation are the ones on your tenant, with no hand-off to a team you have never met.",
        proof:
          "Delivery is led by practitioners with 11 to 15+ years each in Workday and enterprise systems.",
      },
      {
        key: "working-day",
        n: "03",
        claim: "Close to your working day",
        line: "Coverage across time zones, at a price that reflects where the work is done.",
        proof:
          "Two delivery entities. In Penang, Malaysia, in-country consultants run onshore workshops and same-time-zone hypercare. In Coimbatore, India, our center for scale provides 24/7 coverage. Together they support customers in 160+ countries across the Americas, EMEA and APAC.",
      },
      {
        key: "straight-about-risk",
        n: "04",
        claim: "Straight about risk, here for the long run",
        line: "We name what could go wrong before it does, present targets as ranges rather than guarantees, and stay on through support, releases and new modules.",
        proof: "100% customer retention.",
      },
    ] satisfies AboutCommitment[],
    /** [derived] Commitment 03's two entities, lifted out of its proof so they
        can be drawn. Time zones are IANA names, for a live local clock. */
    entities: [
      {
        key: "penang",
        city: "Penang",
        country: "Malaysia",
        role: "In-country consultants run onshore workshops and same-time-zone hypercare.",
        tz: "Asia/Kuala_Lumpur",
        tzLabel: "MYT · UTC+8",
      },
      {
        key: "coimbatore",
        city: "Coimbatore",
        country: "India",
        role: "Our center for scale provides 24/7 coverage.",
        tz: "Asia/Kolkata",
        tzLabel: "IST · UTC+5:30",
      },
    ],
    /** [derived] the regions named in commitment 03. */
    regions: ["Americas", "EMEA", "APAC"],
  },

  team: {
    id: "leadership",
    eyebrow: "Our leadership",
    title: "Senior practitioners who still do the work.",
    body: "Hazeberg is led by consultants with decades of Workday delivery between them, and they stay close to customer work.",
    people: [
      {
        key: "sakthi-vignesh",
        name: "Sakthi Vignesh",
        /* The owner's title (change list, 2026-10-02); the About document
           had "CEO & Co-founder". */
        role: "Founder & CEO",
        focus: "Payroll, Benefits and HCM integrations across EMEA and APAC.",
        bio: "Brings experience across 15+ implementations and AMS engagements, with hands-on expertise in Core Integration, Cloud Connect for Benefits, Third-Party Payroll and Workday Studio.",
        credentials: "11 years in Workday. Certified in Core Integration and Workday Studio.",
        years: { value: 11, plus: false, scope: "in Workday" },
        certs: ["Core Integration", "Workday Studio"],
        portrait: null,
      },
      {
        key: "vignesh-ravishankar",
        name: "Vignesh Ravishankar",
        role: "Director",
        focus:
          "Enterprise Workday delivery across Financials, HCM integrations, APIs and Workday Studio.",
        bio: "Experience spans complex implementations, data conversions and application support, backed by a broader enterprise-systems background including PeopleSoft.",
        credentials: "15+ years in enterprise systems.",
        years: { value: 15, plus: true, scope: "in enterprise systems" },
        certs: [],
        portrait: null,
      },
      {
        key: "rajesh-venkatesan",
        name: "Rajesh Venkatesan",
        role: "Consultant, Workday HCM & PATT",
        focus: "Deep expertise across HCM, Recruiting, Time Tracking and Absence.",
        bio: "Particularly experienced in complex payroll, absence and time configurations, with additional expertise in Workday's calculation engine and Workday Docs.",
        credentials: "12+ years in Workday. Certified in HCM and Payroll.",
        years: { value: 12, plus: true, scope: "in Workday" },
        certs: ["HCM", "Payroll"],
        portrait: null,
      },
      {
        key: "namitha-lunawat",
        name: "Namitha Lunawat",
        role: "Manager, Workday Practice",
        focus: "Recruiting expertise from configuration through end-to-end delivery.",
        bio: "Experience spans 30+ AMS engagements across industries, alongside custom reports, dashboards, analytics, HCM Recruiting and People Experience.",
        credentials: "13+ years in Workday. Certified in HCM, Recruiting and People Experience.",
        years: { value: 13, plus: true, scope: "in Workday" },
        certs: ["HCM", "Recruiting", "People Experience"],
        portrait: null,
      },
    ] satisfies AboutPerson[],
  },

  /**
   * Life at Hazeberg — the owner's change list (2026-10-02): the offsite
   * photos of 2025 and 2026, the recognition photos, and two lines. The lines
   * are verbatim but for two fixes: "People is everything" reads "People are
   * everything", and the stray space before the comma in the second is gone.
   * HARD, HARDER and OFTEN keep the owner's capitals.
   *
   * The chapters are the owner's own folders, under the folders' names
   * (`public/Hazeberg/Offsite 2025`, `…/Offsite 2026`); the recognition photos
   * sat loose beside them. "Team recognition" rather than "Recognition",
   * because the page already has a Recognition section — the certifications —
   * and two sections of one name on one page is one too many. Photo order
   * within a chapter is a choice, not the folder's: it opens on the widest
   * frame of the whole group.
   */
  life: {
    id: "life-at-hazeberg",
    eyebrow: "Life at Hazeberg",
    title: "People are everything at Hazeberg.",
    body: "Hazeberg values the team as much as they value customers.",
    motto: "We work HARD, we party HARDER, we party OFTEN",
    chapters: [
      {
        key: "offsite-2026",
        label: "Offsite 2026",
        photos: [
          "offsite-2026-05",
          "offsite-2026-06",
          "offsite-2026-01",
          "offsite-2026-04",
          "offsite-2026-07",
          "offsite-2026-03",
          "offsite-2026-02",
        ],
      },
      {
        key: "offsite-2025",
        label: "Offsite 2025",
        photos: ["offsite-2025-01", "offsite-2025-04", "offsite-2025-02", "offsite-2025-03"],
      },
      {
        key: "team-recognition",
        label: "Team recognition",
        photos: [
          "recognition-team-trophies",
          "recognition-indhu",
          "recognition-namitha",
          "recognition-rajesh",
          "recognition-vignesh",
          "recognition-medals-02",
          "recognition-medals-01",
        ],
      },
    ],
  },

  recognition: {
    id: "recognition",
    /** [derived] The document gives this section a name and no heading of its
        own, so the name is the heading. */
    eyebrow: "Recognition",
    title: "Recognition",
    items: [
      {
        key: "iso",
        name: "ISO 27001:2022 Certified",
        body: "Our information security management system is certified to ISO 27001:2022, providing an audited framework for information security, integrity, and confidentiality.",
        logo: { src: "/certs/iso-27001.jpg", width: 346, height: 145, alt: "ISO 27001 certified" },
        detail: null,
      },
      {
        key: "dpiit",
        name: "Recognized by the Government of India",
        body: "Hazeberg Consulting is recognized as a startup by the Department for Promotion of Industry and Internal Trade (DPIIT), Ministry of Commerce and Industry, in the IT services and consulting sector.",
        /** [fact] The #startupindia mark, cut from the client's own certificate
            with its paper knocked out. The certificate itself stays in
            `design/`. The national emblem on it is deliberately NOT used — its
            use is restricted by law. */
        logo: { src: "/certs/startup-india.png", width: 195, height: 45, alt: "Startup India" },
        /** [fact] From the certificate. */
        detail: "Certificate DIPP166352 · valid to February 2034",
      },
      {
        key: "workday",
        name: "Workday-Certified Consultants",
        body: "A significant share of our consulting team holds Workday certifications across HCM, Payroll, Recruiting, Integrations, and more.",
        /** Workday's own "Pro Certified" badge, as Credly issues it for the
            Workday Pro Learning Certification (supplied by Krishna,
            2026-10-03: credly.com/org/workday/badge/workday-pro-learning-certification).
            A 480px copy of Credly's 1600px PNG, never redrawn — a
            certification mark is reproduced, not made. Square, so the card
            sizes it by `shape`, not by the wide marks' height cap. */
        logo: {
          src: "/certs/workday-pro-certified.png",
          width: 480,
          height: 480,
          alt: "Workday Pro Certified",
          shape: "square",
        },
        detail: null,
      },
    ],
  },

  contact: {
    id: "start-a-conversation",
    eyebrow: "Start a conversation",
    title: "Let's talk about your Workday journey.",
    body: "Tell us where you are with Workday and what you need next. We'll connect you with the Hazeberg team best placed to understand your requirements.",
    primary: { label: "Contact us", href: "/contact" },
    secondary: { label: "See what we do", href: "/what-we-do" },
    officesLabel: "Our offices",
    offices: [
      {
        key: "coimbatore",
        city: "Coimbatore",
        country: "India",
        line: "Annamalai Industrial Park, Kalapatti",
        /** [derived] */
        tz: "Asia/Kolkata",
        tzLabel: "IST · UTC+5:30",
      },
      {
        key: "penang",
        city: "Penang",
        country: "Malaysia",
        line: "Bandar Cassia, Pulau Pinang",
        /** [derived] */
        tz: "Asia/Kuala_Lumpur",
        tzLabel: "MYT · UTC+8",
      },
    ],
    contactLabel: "Contact",
    /* Phone and email are the same as `CONTACT` in `navigation.ts`; the
       component reads them from there so there is one copy. */
  },
} as const;
