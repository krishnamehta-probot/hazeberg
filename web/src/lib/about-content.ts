/**
 * About — the client's copy, in full.
 *
 * Source: "About Page" (Google Doc), supplied 2026-10-02. It replaces the draft
 * this file used to carry — the founding-story placeholders, Life at Hazeberg,
 * the team roster note and the empty Rewards slots are all gone, because the
 * document does not have them. Six sections, in the document's order:
 *
 *   Hero · Our story · How we're built · Meet the team · Recognition ·
 *   Start a conversation
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
 * Anchors: `#our-story`, `#how-were-built`, `#leadership`, `#recognition`,
 * `#start-a-conversation`. `#our-story` and `#leadership` keep the ids the old
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
    stats: [
      { value: 200, suffix: "+", label: "Combined years of Workday experience" },
      { value: 20, suffix: "+", label: "Workday projects delivered" },
      { value: 40, suffix: "+", label: "Countries supported" },
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
          "Two delivery entities. In Penang, Malaysia, in-country consultants run onshore workshops and same-time-zone hypercare. In Coimbatore, India, our center for scale provides 24/7 coverage. Together they support customers in 40+ countries across the Americas, EMEA and APAC.",
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
        role: "CEO & Co-founder",
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
        /** No logo: Workday's certification marks are licensed artwork and none
            has been supplied. The component draws an icon until one is. */
        logo: null,
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
