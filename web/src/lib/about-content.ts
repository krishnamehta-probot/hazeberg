/**
 * About page copy.
 *
 * **THIS IS A DRAFT AND IT IS PART PLACEHOLDER.** Read this header before
 * sending the page anywhere.
 *
 * The six sections are the ones `SITEMAP.md` specifies, and the anchors are the
 * ones `navigation.ts` ALREADY LINKS TO — `#our-story`, `#leadership`,
 * `#our-team`, `#life-at-hazeberg`, `#certifications`, `#rewards`. The sitemap
 * writes four of those six shorter (`#story`, `#life`, `#team`); the nav is the
 * live contract because those links ship in the header today, so the nav wins
 * and the sitemap is corrected to match rather than the other way round.
 *
 * Provenance, per entry, marked inline:
 *
 *   [live]   the client's own words, already published on this site or supplied
 *            in one of their documents. Moved here, not rewritten.
 *   [fact]   verifiable from the client's own material — an address, a name in
 *            `navigation.ts`, a certificate file in the repo.
 *   [DRAFT]  written here to give the section a shape. NOT the client's words.
 *            Every one of these has to be replaced or approved.
 *   [EMPTY]  no content exists at all. The page renders a marked slot rather
 *            than inventing something to fill it.
 *
 * What is genuinely missing and cannot be written from anything in the repo:
 *
 *   1. **the founding story** — when Hazeberg started, and why. The "Our story"
 *      section currently runs on the retired "Why choose Hazeberg" copy, which
 *      is about the practice rather than about its origin.
 *   2. **the founder's biography and portrait.** The name is in the nav; nothing
 *      else about him is anywhere in this repo. A founder portrait must be a
 *      photograph of the actual person — it is the one image on this site that
 *      cannot be sourced, only taken.
 *   3. **Life at Hazeberg.** The Careers page carries the client's culture copy;
 *      repeating it here would put the same three paragraphs on two pages. This
 *      section needs its own.
 *   4. **Rewards.** No award, recognition or ranking has been supplied. The
 *      section renders empty slots on purpose.
 *   5. **certificate details** — issuing body, certificate number, valid-to
 *      date. The ISO mark and the DPIIT certificate are both in the repo; the
 *      paperwork behind them is not.
 *
 * ONE DELIBERATE EDIT TO CLIENT COPY, flagged as the American-spelling pass was:
 * the retired "Why choose Hazeberg" block says "11+ years" twice. Every other
 * page now says 12+, because the client revised that figure on 2026-09-25. The
 * number is changed here and nothing else is. Two different figures for the same
 * fact on one site is worse than an edit somebody can veto.
 */

export const ABOUT_PAGE = {
  /* -- hero ------------------------------------------------------------ */
  eyebrow: "About Hazeberg",
  /** [live] The nav's own lede title for this menu — their phrase, not ours. */
  titleLead: "The people behind ",
  titleAccent: "the tenant.",
  /** [live] `ABOUT.title` in `home-content.ts`: written by the client and never
      rendered on the home page, because their layout leads with the body
      paragraph alone. This is the page it was waiting for. */
  lead: "Workday expertise, led by people who know the platform and understand the business behind it.",
  /** [live] The nav's lede body. */
  leadSecond:
    "Recognized by the Government of India and ISO certified, with offices in Coimbatore and Penang.",
  meta: [
    { label: "Workday experience", value: "12+ years" },
    { label: "Consolidated experience", value: "200+ years" },
    { label: "Delivery centers", value: "Coimbatore · Penang" },
  ],

  /* -- 01 — our story --------------------------------------------------- */
  story: {
    eyebrow: "Our story",
    /** [live] `WHY.title`, retired from the home page on 2026-09-23 and parked
        for exactly this section. */
    title: "The Right Workday Expertise Changes Everything.",
    /** [live] `WHY.body`. */
    body: "Hazeberg brings experienced consultants, direct involvement, and a focused Workday practice to enterprise teams looking for better delivery and dependable support.",
    /**
     * [DRAFT] The origin paragraph. This is the one thing a story section exists
     * for and the one thing nothing in this repo knows: the year, the reason,
     * the first client. Replace it.
     */
    origin:
      "[DRAFT — needs the client] Hazeberg was founded to do one thing properly: Workday. The founding year, the reason the practice was started, and what the first engagement was are not recorded anywhere in the material supplied so far, and are deliberately not invented here.",
    /** [live] `WHY.points`, all three, verbatim except the 11+ → 12+ figure. */
    points: [
      {
        n: "01",
        kicker: "Experience that matters",
        title: "Work with people who know Workday.",
        body: "Our consultants bring 12+ years of Workday experience to the requirements, decisions, and challenges that shape your engagement.",
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
    /** [live] `WHY.overlay`. The attribution is the client's own — a program
        lead at a Fortune 500 client, unnamed by them. */
    quote: {
      text: "Hazeberg has been outstanding and thorough in everything they deliver.",
      name: "Program Lead",
      role: "Fortune 500 Client",
      stat: "12+ years",
      statLabel: "Workday-focused experience",
    },
  },

  /* -- 02 — leadership -------------------------------------------------- */
  leadership: {
    eyebrow: "Leadership",
    /** [DRAFT] */
    title: "Led by someone who is in the work.",
    /** [DRAFT] */
    body: "[DRAFT — needs the client] One paragraph on how the practice is led, and what that means for an engagement.",
    people: [
      {
        /** [fact] From `navigation.ts`: "Founded and led by Sakthi Vignesh." */
        name: "Sakthi Vignesh",
        /** [fact] Derived from the same line. */
        role: "Founder",
        /** [EMPTY] */
        bio: "[EMPTY — needs the client] Two or three sentences: background before Hazeberg, what he works on now, and the kind of engagement he is personally involved in.",
        /**
         * [EMPTY] No portrait, and this is the one image on the site that cannot
         * be sourced from a library or generated — it is a photograph of a real
         * person and it has to be taken. The page renders a marked slot.
         */
        portrait: null,
      },
    ],
  },

  /* -- 03 — our team ---------------------------------------------------- */
  team: {
    eyebrow: "Our team",
    /** [DRAFT] */
    title: "The consultants who do the actual work.",
    /** [DRAFT] — the sentence is new; every FIGURE under it is [fact], taken
        from the home page's own numbers. */
    body: "[DRAFT — needs the client] A paragraph on how the team is built: certifications, how people are brought onto engagements, and what stays constant across them.",
    /** [fact] All four already published on this site. */
    facts: [
      { value: 200, suffix: "+", label: "Consolidated years of consultant experience" },
      { value: 20, suffix: "+", label: "Workday projects delivered" },
      { value: 200, suffix: "+", label: "Integrations built" },
      { value: 40, suffix: "+", label: "Countries supported" },
    ],
    /** [EMPTY] No names, roles or photographs have been supplied. */
    roster: null,
    rosterNote:
      "[EMPTY] Named consultants and photographs, if the team wants them here. A team section works without faces; it does not work with invented ones.",
  },

  /* -- 04 — life at hazeberg -------------------------------------------- */
  life: {
    eyebrow: "Life at Hazeberg",
    /** [DRAFT] */
    title: "How we work, and what it is like to work here.",
    /**
     * [DRAFT] The Careers page already carries the client's culture copy, from
     * their own careers draft. Repeating it here would put the same paragraphs
     * on two pages, so this section is left to be written separately and points
     * at Careers in the meantime.
     */
    body: "[DRAFT — needs the client] This section needs its own copy. The Careers page carries the culture writing the client supplied; running it again here would print the same three paragraphs twice on one site.",
    /** [DRAFT] Three shapes, so the section has a structure to fill. */
    points: [
      {
        n: "01",
        title: "[DRAFT] How a day actually runs",
        body: "Hours, overlap with client time zones, and how the two delivery centers work together.",
      },
      {
        n: "02",
        title: "[DRAFT] How people grow here",
        body: "Certification, the move from support into delivery, and who decides what somebody works on next.",
      },
      {
        n: "03",
        title: "[DRAFT] What the offices are like",
        body: "Coimbatore and Penang, and what is true of both.",
      },
    ],
    cta: { label: "See open roles", href: "/careers" },
  },

  /* -- 05 — certifications ---------------------------------------------- */
  certifications: {
    eyebrow: "Certifications",
    /** [DRAFT] */
    title: "Certified, and recognized.",
    /** [DRAFT] */
    body: "[DRAFT — needs the client] One line on what these mean in practice for a client's data and a client's contract.",
    items: [
      {
        key: "iso",
        /** [fact] The client's own mark, downloaded from their site. The
            standard number comes from the file's own alt text in the footer. */
        name: "ISO 27001",
        headline: "Information security management",
        /** [DRAFT] */
        body: "[DRAFT] What the certification covers, and which parts of the business are in scope.",
        image: "/certs/iso-27001.jpg",
        /** [EMPTY] Certificate number, issuing body and valid-to date. */
        detail: "[EMPTY] Certificate number · issuing body · valid until",
      },
      {
        key: "dpiit",
        /** [fact] The certificate is in the repo at
            `design/certificates/dpiit-recognition.png`. It is a full A4 document
            and is deliberately NOT in `public/` — a recognition certificate is
            not a logo, and shrinking one to a card is how it becomes unreadable
            and reproducible at the same time. */
        name: "Recognized by the Government of India",
        headline: "DPIIT recognition",
        /** [DRAFT] */
        body: "[DRAFT] What the recognition is, and what it recognizes.",
        image: null,
        /** [EMPTY] */
        detail: "[EMPTY] Recognition number · date of issue",
      },
    ],
  },

  /* -- 06 — rewards ----------------------------------------------------- */
  rewards: {
    eyebrow: "Rewards",
    /** [DRAFT] */
    title: "Recognition earned by the team and by the work.",
    /** [DRAFT] The line is from the nav's own description of this section. */
    body: "[DRAFT — needs the client] No award, ranking or recognition has been supplied. The slots below are the shape of the section, not its content.",
    /** [EMPTY] Three empty slots rather than three invented awards. */
    slots: 3,
    slotNote: "Award or recognition",
  },

  /* -- the way out ------------------------------------------------------ */
  cross: {
    eyebrow: "Want to work here?",
    title: "Careers at Hazeberg",
    body: "Open roles, how we hire, and what to expect from the process.",
    href: "/careers",
  },
} as const;
