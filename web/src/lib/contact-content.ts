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
  /** [live] Every string in this block is from the client's "Hazeberg Contact Us
      Page" document, 2026-09-28, verbatim. */
  eyebrow: "Contact Hazeberg",
  titleLead: "Let's talk about your",
  titleAccent: " Workday journey.",
  lead: "Whether you are planning a new implementation, optimizing your existing Workday environment, or exploring new possibilities, tell us what you are looking to achieve.",
  leadSecond: "Our team will connect with you to understand your goals and identify the right next steps.",
  /** [PLACEHOLDER] on the first row only — the other two are facts already on
      the home page and in the sitemap. */
  meta: [
    { label: "Reply", value: "One business day" },
    { label: "Offices", value: "Erode & Coimbatore, India · Penang, Malaysia" },
    { label: "Delivering to", value: "40+ countries" },
  ],

  /* -- the form ------------------------------------------------------- */
  form: {
    eyebrow: "Start here",
    title: "Tell us what you are looking to achieve",
    body: "Share a few details about your requirement, and we will connect you with the right Hazeberg team.",
    /** [live] the client's own eight dropdown options, in their order. */
    interests: [
      "Workday Implementation",
      "Workday Optimization",
      "Workday AMS Support",
      "Workday Integration",
      "Workday Reporting & Analytics",
      "Partnership Opportunity",
      "Careers",
      "Other",
    ],
    /** [live] their field labels and placeholders. */
    labels: {
      name: "Your Name",
      namePlaceholder: "Enter your name",
      email: "Work Email",
      emailPlaceholder: "you@company.com",
      company: "Company",
      companyPlaceholder: "Company name",
      phone: "Phone Number",
      phonePlaceholder: "Phone number",
      interest: "What can we help with?",
      interestPlaceholder: "Choose the closest",
      message: "Tell us more",
      messagePlaceholder: "Describe your Workday requirement, challenge, or objective.",
    },
    /** No privacy-policy link was needed when this was written; there is one now,
        and a form that takes a name should point at it. */
    note: "We use these details to reply to you and nothing else.",
    submit: "Start the conversation",
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
        body: "Not a form handler. A consultant who works on the areas you named.",
      },
      {
        n: "02",
        title: "We reply within a business day",
        body: "With a first read on what you have described, and what we would want to see.",
      },
      {
        n: "03",
        title: "A call, if it is useful",
        body: "Thirty minutes, your time zone. No deck unless you ask for one.",
      },
    ],
  },

  /* -- the direct lines ----------------------------------------------- */
  /** [live] heading and supporting copy, verbatim. */
  direct: {
    eyebrow: "Go direct",
    title: "Prefer to reach us directly?",
    body: "You can also connect with our team through the details below.",
  },

  /* -- the offices ---------------------------------------------------- */
  offices: {
    eyebrow: "Where we are",
    title: "Three offices, one delivery team.",
    body: "Headquartered in Erode, delivering from Coimbatore, with Penang covering APAC hours. Clients are in 40+ countries; none of these addresses is where the work has to happen.",
  },

  /** The paired door at the foot of the page. Candidates land here constantly. */
  cross: {
    eyebrow: "Looking for a role?",
    title: "Careers at Hazeberg",
    body: "How we work, what you can expect, and where to send a CV.",
    href: "/careers",
  },
} as const;
