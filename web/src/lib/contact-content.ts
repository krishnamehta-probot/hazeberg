/**
 * Contact page copy.
 *
 * COPY STATUS, per rule 5. The live site has **no contact page and no form** —
 * §18 of `content/live-site-content.txt` lists it as a gap. What exists and is
 * real is the email address, the phone number, the LinkedIn account and the two
 * office addresses; all four live in `lib/navigation.ts` and are used from
 * there, not retyped here.
 *
 * Everything below is therefore mine and is marked:
 *
 *   [derived]     says only what the home page and the sitemap already say
 *   [PLACEHOLDER] a claim the client has to confirm or replace. There is exactly
 *                 one class of these on this page and it is the response-time
 *                 promise — a commitment about how the business operates is not
 *                 mine to invent, so it is flagged rather than buried.
 *
 * When Sanity is wired this module becomes the query result; the shape is built
 * for that swap.
 */

export const CONTACT_PAGE = {
  eyebrow: "Contact",
  /** Split so the second half can carry the brand amber. Yellow is 11.97:1 on
      the void ground and 1.65:1 on white, which is why it is type here and
      nowhere on the light sections. */
  titleLead: "Tell us what your",
  titleAccent: " tenant is doing.",
  lead: "Whether it is a first implementation, an integration that keeps failing, or a live tenant nobody has optimised since go-live — start with the specifics and we will come back with a view, not a brochure.",
  /** [PLACEHOLDER] on the first row only — the other two are facts already on
      the home page and in the sitemap. */
  meta: [
    { label: "Reply", value: "One business day" },
    { label: "Offices", value: "Coimbatore · Penang" },
    { label: "Delivering to", value: "40+ countries" },
  ],

  /* -- the form ------------------------------------------------------- */
  form: {
    eyebrow: "Start here",
    title: "Six fields. It reaches a consultant, not a queue.",
    body: "The more you can say about the modules and the state of the tenant, the more useful the first reply is.",
    /** [derived] — every option is a Workday service or engagement model the
        home page already names. "Something else" exists because a picker with
        no way out makes people lie to it. */
    interests: [
      "New Workday implementation",
      "Optimisation or a health check",
      "AMS and ongoing support",
      "Integrations",
      "Payroll",
      "Reporting and analytics",
      "Partnering with Hazeberg",
      "Something else",
    ],
    /** Under the button. No privacy-policy link, because there is no privacy
        policy yet — see the gap logged in `SITEMAP.md`. A link to a page that
        does not exist is worse than the plain sentence. */
    note: "We use these details to reply to you and nothing else.",
    submit: "Send it over",
    sending: "Sending",
  },

  /* -- what happens after you press send ------------------------------ */
  /** [PLACEHOLDER] — the sequence is ordinary consulting practice, but the
      timings are a commitment and the client owns them. */
  steps: {
    eyebrow: "What happens next",
    items: [
      {
        n: "01",
        title: "A person reads it",
        body: "Not a form handler. A consultant who works on the modules you named.",
      },
      {
        n: "02",
        title: "We reply within a business day",
        body: "With a first read on what you have described, and what we would want to see.",
      },
      {
        n: "03",
        title: "A call, if it is useful",
        body: "Thirty minutes, your timezone. No deck unless you ask for one.",
      },
    ],
  },

  /* -- the direct lines ----------------------------------------------- */
  direct: {
    eyebrow: "Or go direct",
    title: "Skip the form.",
    body: "Everything below reaches the same people.",
  },

  /* -- the offices ---------------------------------------------------- */
  offices: {
    eyebrow: "Where we are",
    title: "Two offices, one delivery team.",
    body: "Coimbatore leads delivery and Penang covers APAC hours. Clients are in 40+ countries; neither address is where the work has to happen.",
  },

  /** The paired door at the foot of the page. Candidates land here constantly. */
  cross: {
    eyebrow: "Looking for a role?",
    title: "Careers at Hazeberg",
    body: "Open practices, how hiring works, and where to send a CV.",
    href: "/careers",
  },
} as const;
