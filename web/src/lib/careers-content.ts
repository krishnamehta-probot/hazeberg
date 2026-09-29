/**
 * Careers page copy.
 *
 * SOURCE: the client's own careers draft at hazeberg-careers-blossom.lovable.app,
 * captured 2026-09-28. **Every heading, paragraph, pillar and list item below is
 * theirs, verbatim.** The earlier version of this file was built from the live
 * site's four value props plus marked placeholders; all of that is replaced.
 *
 * Two deliberate departures, both small and both flagged:
 *
 *   1. **American spelling**, per the instruction of 2026-09-28 that took the
 *      whole site to American forms. Their draft writes "organisations" and
 *      "optimisation"; those are the only words changed, and only in spelling.
 *   2. **No "For Consultants" block.** `SITEMAP.md` places that audience on this
 *      page, and the previous version carried a placeholder panel for it. The
 *      client's draft has no such section, so it is gone rather than invented —
 *      if it is meant to be here, it needs their copy.
 *
 * Their draft's CTA reads "View open positions", and there are no positions
 * listed anywhere on it. Rather than link a button to nothing, it scrolls to the
 * application block, which is where the page actually sends people. Flagged: if
 * a roles list is coming, that is where it goes.
 */

export const CAREERS_PAGE = {
  eyebrow: "Careers at Hazeberg",
  /** [live] Split so the last two words can carry the amber on the dark opener. */
  titleLead: "Build your career around",
  titleAccent: " Workday expertise.",
  lead: "At Hazeberg, we bring together consultants, technologists, and problem-solvers who are passionate about delivering impactful Workday solutions.",
  leadSecond:
    "Join a team where deep expertise, continuous learning, and hands-on experience come together to solve complex business challenges for organizations worldwide.",
  cta: { label: "View open positions", href: "#apply" },
  /** [live] their own three-up rail. */
  meta: [
    { label: "Based in", value: "Coimbatore, India · Penang, Malaysia" },
    { label: "Focus", value: "Workday, end to end" },
    { label: "Apply by", value: "Email — we read every one" },
  ],

  /* -- why here -------------------------------------------------------- */
  why: {
    eyebrow: "Why Hazeberg?",
    title: "Work with expertise that creates impact.",
    body: [
      "A significant part of our consulting team holds Workday certifications, reflecting our commitment to quality, knowledge, and delivery excellence.",
      "Backed by collective experience across Workday implementations, integrations, and optimization initiatives, our teams bring practical insights and proven approaches to every engagement.",
      "At Hazeberg, you will work alongside professionals who understand the platform deeply and are focused on creating reliable, scalable solutions for clients.",
    ],
  },

  /* -- the three pillars ----------------------------------------------- */
  pillars: {
    eyebrow: "Three career pillars",
    title: "What a career here is built on.",
    items: [
      {
        n: "01",
        title: "Grow your Workday expertise",
        body: "Work alongside experienced consultants and build your understanding across Workday modules, implementation methodologies, integrations, and enterprise transformation.",
      },
      {
        n: "02",
        title: "Work on meaningful engagements",
        body: "Contribute to projects where your work directly supports organizations in improving their processes, systems, and ways of working.",
      },
      {
        n: "03",
        title: "Learn from experienced professionals",
        body: "Be part of a team where knowledge sharing, collaboration, and continuous improvement are part of everyday work.",
      },
    ],
  },

  /* -- culture --------------------------------------------------------- */
  culture: {
    eyebrow: "Our consulting culture",
    title: "Built by consultants. Driven by collaboration.",
    body: [
      "Successful Workday transformations require more than technical skills. They require curiosity, teamwork, and the ability to understand business challenges.",
      "At Hazeberg, we encourage our teams to share knowledge, take ownership, and continuously develop their expertise.",
    ],
    chips: ["Share knowledge", "Take ownership", "Keep developing"],
  },

  /* -- what you can expect --------------------------------------------- */
  expect: {
    eyebrow: "What you can expect",
    title: "What you can expect at Hazeberg.",
    items: [
      {
        n: "01",
        icon: "growth",
        title: "Professional Growth",
        body: "Build expertise through exposure to diverse Workday projects and industry challenges.",
      },
      {
        n: "02",
        icon: "globe",
        title: "Global Exposure",
        body: "Collaborate with teams and clients across different markets and business environments.",
      },
      {
        n: "03",
        icon: "learning",
        title: "Continuous Learning",
        body: "Stay ahead with opportunities to expand your skills across Workday technologies and consulting practices.",
      },
      {
        n: "04",
        icon: "ownership",
        title: "Ownership & Responsibility",
        body: "Take initiative, contribute ideas, and play an active role in delivering client outcomes.",
      },
    ],
  },

  /* -- apply ------------------------------------------------------------ */
  apply: {
    eyebrow: "Join us",
    title: "Ready to shape the future of Workday transformation?",
    body: "Join Hazeberg and become part of a team helping organizations unlock the full potential of their Workday ecosystem.",
    cta: "Explore careers",
    includeLabel: "What to include",
    include: [
      "The Workday area you're aiming at",
      "Your CV, as a PDF",
      "Workday certifications, if you hold any",
      "Where you are and when you could start",
    ],
  },

  cross: {
    eyebrow: "Not here for a role?",
    title: "Talk to us about your Workday environment",
    body: "Implementation, optimization, integrations, AMS — the other door is Contact.",
    href: "/contact",
  },
} as const;
