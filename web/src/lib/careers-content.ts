/**
 * Careers page copy.
 *
 * COPY STATUS, per rule 5.
 *
 * The live site's §13 is the one section of it that is genuinely usable, and it
 * is used verbatim: the heading, the opening paragraph, all four value props and
 * the "send your resume" close are the client's own words, marked `[live]`.
 *
 * What the live site does NOT have, per §18: any open role, any hiring process,
 * and any application form. **No roles are invented here.** Instead the page
 * lists the practices Hazeberg actually sells — the same seven in
 * `home-content.ts` — and says plainly that hiring is continuous across them.
 * That is honest, it needs no maintenance, and it does not put a job title on
 * the internet that nobody is recruiting for.
 *
 *   [live]        verbatim from hazebergconsulting.com §13
 *   [derived]     says only what the home page or the sitemap already says
 *   [PLACEHOLDER] mine, and the client's to confirm: the hiring sequence and the
 *                 For Consultants proposition
 */

export const CAREERS_PAGE = {
  eyebrow: "Careers",
  /** [live] §13 heading, reworked into two lines so the second can carry the
      amber. The original is "Join Our Team At Hazeberg". */
  titleLead: "Join our team",
  titleAccent: " at Hazeberg.",
  /** [live] §13 body, first paragraph, trimmed of "Are you passionate about
      innovation and" — the sentence still asks the same question in half the
      words. */
  lead: "Looking for an opportunity to grow your career? At Hazeberg we are building a team of creative, driven and talented individuals who want to make an impact.",
  /** [derived] from the live site and the sitemap. */
  meta: [
    { label: "Based in", value: "Coimbatore · Penang" },
    { label: "Practices", value: "Seven, hiring across all" },
    { label: "Apply by", value: "Email — we read every one" },
  ],

  /* -- why here ------------------------------------------------------- */
  /** [live] §13.1–13.4, verbatim. */
  why: {
    eyebrow: "Why here",
    title: "Four things people who join us say about the place.",
    items: [
      {
        n: "01",
        title: "Collaborative Environment",
        body: "Work with a team that values creativity, teamwork, and innovation.",
      },
      {
        n: "02",
        title: "Career Growth",
        body: "We provide opportunities for learning and professional development.",
      },
      {
        n: "03",
        title: "Supportive Culture",
        body: "Experience a workplace where your ideas are valued and your contributions matter.",
      },
      {
        n: "04",
        title: "Dynamic Work Environment",
        body: "Engage in a fast-paced, innovative setting that fosters growth and excellence.",
      },
    ],
  },

  /* -- the practices we hire into ------------------------------------- */
  /**
   * The rows themselves come from `SERVICES.items` in `home-content.ts` — the
   * seven practices, their labels and their one-line summaries, already written
   * and already on the home page. Nothing is restated here.
   */
  practices: {
    eyebrow: "Practices",
    title: "We hire into the seven practices we deliver.",
    body: "There is no board of open positions, because that is not how a consultancy this size staffs. We read CVs continuously across all seven and talk to people whose experience fits one of them.",
    /** The line under the list. Says out loud why there are no job titles. */
    note: "Certified or on the way, one module deep or several — say which of these is yours.",
    /** Prefixes the mailto subject so an application lands sorted. */
    applyLabel: "Apply",
  },

  /* -- how hiring works ----------------------------------------------- */
  /** [PLACEHOLDER] — a four-step sequence is ordinary practice, but this is the
      client's process to describe and the timings are theirs to commit to. */
  hiring: {
    eyebrow: "How hiring works",
    title: "Four steps, and you hear back at every one.",
    body: "No silence after step one — that is the part most people have been through and none of them liked.",
    items: [
      {
        n: "01",
        title: "Send a CV",
        body: "By email, with the practice you are aiming at in the subject line.",
      },
      {
        n: "02",
        title: "A conversation",
        body: "Thirty minutes on what you have worked on and what you want next.",
      },
      {
        n: "03",
        title: "A technical discussion",
        body: "With a consultant from the practice. Real tenant problems, not a quiz.",
      },
      {
        n: "04",
        title: "Offer and onboarding",
        body: "Scope, level and start date, in writing, with a named person to ask.",
      },
    ],
  },

  /* -- for independent consultants ------------------------------------ */
  /**
   * [PLACEHOLDER]. The sitemap is explicit that "For Consultants" belongs on
   * Careers rather than on Berg, because it is hiring-facing — so the block
   * exists. The proposition itself is mine and needs the client's words.
   */
  consultants: {
    eyebrow: "For consultants",
    title: "Independent, and not looking for a payroll.",
    body: "We work with experienced independent Workday consultants on specific engagements. If that is you, the conversation is the same one — send what you have delivered and which modules you own.",
    points: [
      "Engagement-based, not a bench",
      "Named on the work, with the client",
      "Coimbatore, Penang or remote",
    ],
    cta: "Talk to us about contracting",
  },

  /* -- apply ---------------------------------------------------------- */
  /** [live] §13 close: "Send your resume to connect@hazebergconsulting.com and
      be part of our exciting journey!" — the address comes from `CONTACT`. */
  apply: {
    eyebrow: "Apply",
    title: "Send your CV and be part of the journey.",
    body: "Email is deliberately the whole process — an attachment and three lines about what you want to work on gets further here than a form would.",
    /** What to put in it. [derived] — this is only what the steps above imply. */
    include: [
      "The practice you are aiming at",
      "Your CV, as a PDF",
      "Workday certifications, if you hold any",
      "Where you are and when you could start",
    ],
    cta: "Email your CV",
  },

  cross: {
    eyebrow: "Not here for a role?",
    title: "Talk to us about your Workday environment",
    body: "Implementation, optimization, integrations, AMS — the other door is Contact.",
    href: "/contact",
  },
} as const;
