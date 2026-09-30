/**
 * Privacy Policy and Terms & Conditions.
 *
 * ⚠️ **THESE ARE DRAFTS AND THEY HAVE NOT BEEN REVIEWED BY A LAWYER.**
 *
 * They are written to be accurate about what this website actually does — which
 * is the part a template cannot get right and the part that matters most — but
 * they are not legal advice and they must go past the client's counsel before
 * launch. `SITEMAP.md` has carried "Careers and Contact both collect personal
 * data, which needs a Privacy Policy" as an open gap since 2026-09-17; this
 * closes the build side of it, not the legal side.
 *
 * Everything factual in them is drawn from the project itself rather than from a
 * boilerplate generator, and every one of these was checked in the code:
 *
 *   - the contact form's fields are exactly those in `components/contact/
 *     contact-form.tsx`
 *   - `app/api/contact/route.ts` logs nothing and stores nothing; it validates
 *     and forwards to `CONTACT_WEBHOOK_URL`, and answers 503 when that is unset
 *   - careers applications arrive by email only — there is no upload anywhere
 *   - the site sets **no cookies of its own** and loads **no analytics or
 *     tracking scripts**. `next/font` self-hosts Manrope and Space Mono, so the
 *     browser never talks to Google either
 *   - Berg (berg.hazebergconsulting.com) is a separate application with its own
 *     accounts, its own support address and its own Google Tag Manager and
 *     OneSignal integrations. None of that is on this site, and this policy
 *     says so rather than claiming coverage it does not have
 *
 * Company facts: Hazeberg Consulting LLP, incorporated 28 February 2024 (DPIIT
 * recognition certificate DIPP166352). Offices and contact details come from
 * `lib/navigation.ts`.
 *
 * Two things the client must confirm before this is published, both marked
 * [CONFIRM] in the text:
 *   1. the hosting provider named in the privacy policy
 *   2. that Coimbatore, Tamil Nadu is the intended jurisdiction — a live
 *      question since headquarters moved to Erode (2026-09-30)
 */

export type LegalBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] };

export type LegalSection = {
  id: string;
  heading: string;
  blocks: LegalBlock[];
};

export type LegalDoc = {
  eyebrow: string;
  title: string;
  lead: string;
  updated: string;
  sections: LegalSection[];
};

/** Shared by both documents, so the entity is described once. */
const ENTITY =
  "Hazeberg Consulting LLP, a limited liability partnership incorporated in India on 28 February 2024, headquartered at 214/5, Vinayagar Kovil Street 2, Moolapalayam, Erode, Tamil Nadu 638002, India, with offices at 19/A, Ksquare Complex, Villankurichi Rd, Murugan Nagar, Vinayagapuram, Coimbatore, Tamil Nadu 641035, India, and at 12A-2, Jalan Vervea 7, Bandar Cassia, Pulau Pinang 14110, Malaysia.";

export const PRIVACY: LegalDoc = {
  eyebrow: "Legal",
  title: "Privacy Policy",
  lead: "What this website collects, why, and what you can ask us to do about it. Written to describe this site specifically rather than to cover every possibility.",
  updated: "28 September 2026",
  sections: [
    {
      id: "who-we-are",
      heading: "1. Who we are",
      blocks: [
        {
          kind: "p",
          text: `In this policy, "we", "us" and "Hazeberg" mean ${ENTITY}`,
        },
        {
          kind: "p",
          text: "We are the controller of the personal data described below. If you are in the United Kingdom or the European Economic Area, we do not currently have a representative appointed under Article 27 of the UK/EU GDPR; you may contact us directly using the details in section 11.",
        },
      ],
    },
    {
      id: "scope",
      heading: "2. What this policy covers",
      blocks: [
        {
          kind: "p",
          text: "This policy covers hazebergconsulting.com — this website — and the enquiries and job applications that reach us through it.",
        },
        {
          kind: "p",
          text: "It does not cover Berg, our separate platform at berg.hazebergconsulting.com. Berg has its own accounts, its own sign-up, its own support address and its own privacy terms. If you have a Berg account, that platform's terms apply to it.",
        },
      ],
    },
    {
      id: "what-we-collect",
      heading: "3. What we collect",
      blocks: [
        {
          kind: "p",
          text: "We only collect what you choose to send us. There is no account to create on this website and nothing to log in to.",
        },
        {
          kind: "p",
          text: "When you submit the contact form, we receive the fields you complete: your name, your work email address, your company, the nature of your enquiry, your message, and your phone number if you choose to give it. The phone number is the only optional field.",
        },
        {
          kind: "p",
          text: "When you apply for a role, you email us directly — this site has no upload. We therefore receive whatever you send, which will usually include your CV and the contact details in your message and email signature.",
        },
        {
          kind: "p",
          text: "Our hosting provider records ordinary server request information, which includes IP addresses, for security and diagnostics. We do not use that information to build a profile of you and we do not combine it with anything you send us. [CONFIRM: the hosting provider is to be named here before publication.]",
        },
      ],
    },
    {
      id: "cookies",
      heading: "4. Cookies and tracking",
      blocks: [
        {
          kind: "p",
          text: "This website sets no cookies of its own, and it loads no analytics, advertising or tracking scripts. There is no cookie banner because there is nothing to consent to.",
        },
        {
          kind: "p",
          text: "Our typefaces are served from our own domain rather than from a font service, so loading a page on this site does not send a request to any third party on your behalf.",
        },
        {
          kind: "p",
          text: "If that changes — if we add analytics, for example — this policy will be updated first and consent will be sought where the law requires it.",
        },
      ],
    },
    {
      id: "why",
      heading: "5. Why we use it, and on what basis",
      blocks: [
        {
          kind: "p",
          text: "We use enquiry details to reply to you, to understand what you need, and to carry on the conversation you started. We use application details to assess your application and to contact you about it.",
        },
        {
          kind: "p",
          text: "Where the UK/EU GDPR applies, our legal basis is our legitimate interest in responding to enquiries about our services and in recruiting for our own roles, and — where you are asking us to quote or to take steps before entering into a contract — the performance of that pre-contractual request. Where India's Digital Personal Data Protection Act, 2023 applies, we process your data for the purpose for which you provided it.",
        },
        {
          kind: "p",
          text: "We do not sell personal data. We do not share it with advertisers. We do not use it to train machine-learning models. We will not add you to a marketing list because you sent an enquiry.",
        },
      ],
    },
    {
      id: "sharing",
      heading: "6. Who else sees it",
      blocks: [
        {
          kind: "p",
          text: "Inside Hazeberg, an enquiry is seen by the consultants and staff who need to answer it. An application is seen by the people involved in that hire.",
        },
        {
          kind: "p",
          text: "Outside Hazeberg, only the service providers that operate our systems: our website host, our email provider, and the service that routes contact-form submissions into our own inbox or CRM. Each acts on our instructions and is bound to keep the data confidential.",
        },
        {
          kind: "p",
          text: "We will also disclose information where we are legally required to, or where it is necessary to establish, exercise or defend legal claims.",
        },
      ],
    },
    {
      id: "transfers",
      heading: "7. International transfers",
      blocks: [
        {
          kind: "p",
          text: "We operate from India and Malaysia and we work with clients in more than forty countries, so information you send us will be accessed from outside your own country, including from India.",
        },
        {
          kind: "p",
          text: "Where we transfer personal data out of the UK or the European Economic Area, we rely on the UK Addendum and the European Commission's Standard Contractual Clauses, together with any additional measures needed in the circumstances.",
        },
      ],
    },
    {
      id: "retention",
      heading: "8. How long we keep it",
      blocks: [
        {
          kind: "p",
          text: "Enquiries are kept for as long as the conversation is live and then for up to twenty-four months, so that we have a record of what was discussed if you come back to us.",
        },
        {
          kind: "p",
          text: "Applications are kept for up to twelve months after the process ends, so we can consider you for something that opens later. Ask us and we will delete yours sooner.",
        },
        {
          kind: "p",
          text: "Where a longer period is required by law — for tax or company records, for example — we keep only what that requirement covers.",
        },
      ],
    },
    {
      id: "rights",
      heading: "9. Your rights",
      blocks: [
        {
          kind: "p",
          text: "Depending on where you are, you may have some or all of the following rights over the personal data we hold about you:",
        },
        {
          kind: "list",
          items: [
            "Access — ask for a copy of it",
            "Correction — have anything inaccurate or incomplete put right",
            "Erasure — ask us to delete it, where there is no reason for us to keep it",
            "Restriction — ask us to pause what we do with it while something is resolved",
            "Objection — object to our processing it on the basis of legitimate interests",
            "Portability — receive it in a structured, commonly used, machine-readable form",
            "Withdraw consent — where we relied on consent, withdraw it at any time, without affecting what was lawful before",
            "Nominate — under India's Digital Personal Data Protection Act, 2023, nominate someone to exercise these rights on your behalf in the event of death or incapacity",
          ],
        },
        {
          kind: "p",
          text: "Write to us at connect@hazebergconsulting.com and we will answer within one month. There is no charge. If you are unhappy with our answer you may complain to your data protection regulator — in the UK, the Information Commissioner's Office; in the EEA, your national supervisory authority; in India, the Data Protection Board once it is constituted.",
        },
      ],
    },
    {
      id: "security",
      heading: "10. Security",
      blocks: [
        {
          kind: "p",
          text: "The site is served over HTTPS. Access to enquiries and applications is limited to the people who need it. We are ISO 27001 certified, which means our information security management is independently audited against that standard.",
        },
        {
          kind: "p",
          text: "No system is perfectly secure, and email in particular is not a confidential channel. Please do not send us financial details, identity documents, passwords, or anything else sensitive through the contact form or by unencrypted email. If you need to share something confidential, tell us and we will arrange a secure route.",
        },
      ],
    },
    {
      id: "contact",
      heading: "11. Contact and changes",
      blocks: [
        {
          kind: "p",
          text: "For anything in this policy, including a request to exercise your rights, write to connect@hazebergconsulting.com or call +91 9042200899. Postal enquiries can go to our headquarters in Erode, at the address in section 1.",
        },
        {
          kind: "p",
          text: "This policy is not aimed at children and we do not knowingly collect information from anyone under 18 through this site.",
        },
        {
          kind: "p",
          text: "If we change this policy we will update the date at the top of this page. Material changes will be described here rather than made quietly.",
        },
      ],
    },
  ],
};

export const TERMS: LegalDoc = {
  eyebrow: "Legal",
  title: "Terms & Conditions",
  lead: "The terms on which this website is made available. Short, because a marketing site is not a service agreement — the work itself is governed by its own contract.",
  updated: "28 September 2026",
  sections: [
    {
      id: "these-terms",
      heading: "1. These terms",
      blocks: [
        {
          kind: "p",
          text: `This website is operated by ${ENTITY}`,
        },
        {
          kind: "p",
          text: "By using this website you accept these terms. If you do not accept them, please do not use the site.",
        },
        {
          kind: "p",
          text: "These terms govern the website only. Any engagement between you and Hazeberg is governed by the separate written agreement for that work, and where the two differ, that agreement takes precedence.",
        },
      ],
    },
    {
      id: "using-the-site",
      heading: "2. Using the site",
      blocks: [
        {
          kind: "p",
          text: "You may read this site, and print or download extracts from it, for your own information or for evaluating us as a supplier.",
        },
        { kind: "p", text: "You may not:" },
        {
          kind: "list",
          items: [
            "use the site in any way that breaks any applicable law or regulation",
            "attempt to gain unauthorised access to the site, the server it runs on, or any connected system",
            "introduce any malicious or technologically harmful material",
            "scrape, harvest or systematically extract content or contact details from the site, including for training a machine-learning model",
            "use the contact form to send unsolicited advertising, bulk messages, or anything unlawful",
            "reproduce, distribute or commercially exploit any part of the site without our written permission",
          ],
        },
      ],
    },
    {
      id: "ip",
      heading: "3. Intellectual property",
      blocks: [
        {
          kind: "p",
          text: "All content on this site — text, design, layout, graphics, photography and code — is owned by Hazeberg or licensed to us, and is protected by copyright and other intellectual property laws. Our name, our logo and the Berg name are our trade marks.",
        },
        {
          kind: "p",
          text: "Workday is a trade mark of Workday, Inc. Other product, company and certification names on this site are the trade marks of their respective owners. Their use here is descriptive and does not imply endorsement.",
        },
      ],
    },
    {
      id: "no-advice",
      heading: "4. Content is information, not advice",
      blocks: [
        {
          kind: "p",
          text: "The content of this site is published for general information. It is not professional, legal, financial, tax or implementation advice, and it must not be relied on as the basis for a decision about your own systems or business.",
        },
        {
          kind: "p",
          text: "Case studies, figures and outcomes describe what happened in particular engagements under particular conditions. They are not a prediction, a guarantee, or an estimate of what will happen in yours.",
        },
        {
          kind: "p",
          text: "We try to keep the site accurate and current, but we do not warrant that it is complete, accurate or up to date at any given moment. Before acting on anything here, get advice that is specific to your circumstances — which is a conversation we are happy to have.",
        },
      ],
    },
    {
      id: "berg-and-links",
      heading: "5. Berg, and links to other sites",
      blocks: [
        {
          kind: "p",
          text: "Berg, at berg.hazebergconsulting.com, is a separate platform with its own accounts, its own terms and its own privacy terms. Following a link from this site to Berg takes you to that platform, and those terms — not these — govern your use of it.",
        },
        {
          kind: "p",
          text: "Where this site links to any other third-party website, we do so for information. We have no control over those sites and accept no responsibility for them or for any loss arising from your use of them.",
        },
      ],
    },
    {
      id: "what-you-send",
      heading: "6. What you send us",
      blocks: [
        {
          kind: "p",
          text: "When you send an enquiry or an application you confirm that the information you give is accurate, that it is yours to send, and that sending it does not breach anyone else's rights or any obligation of confidence you are under.",
        },
        {
          kind: "p",
          text: "Please do not send us confidential or commercially sensitive material through this site. Anything you do send that is not personal data we may use for the purpose of responding to you, without obligation of confidence unless we have agreed one in writing.",
        },
        {
          kind: "p",
          text: "Personal data you send is handled as described in our Privacy Policy.",
        },
      ],
    },
    {
      id: "availability",
      heading: "7. Availability",
      blocks: [
        {
          kind: "p",
          text: "We do not guarantee that this site will be available uninterrupted. We may suspend, withdraw or change all or any part of it without notice, and we may update these terms at any time by amending this page.",
        },
      ],
    },
    {
      id: "liability",
      heading: "8. Our liability",
      blocks: [
        {
          kind: "p",
          text: "Nothing in these terms excludes or limits our liability for death or personal injury caused by our negligence, for fraud or fraudulent misrepresentation, or for anything else that cannot lawfully be excluded or limited.",
        },
        {
          kind: "p",
          text: "Subject to that, we exclude all implied conditions, warranties and representations relating to this site, and we are not liable to you for any loss of profit, loss of business, business interruption, or loss of anticipated savings arising out of or in connection with your use of, or inability to use, this site, or your reliance on anything published on it.",
        },
        {
          kind: "p",
          text: "This clause governs the website. Liability for our services is dealt with in the agreement covering that work.",
        },
      ],
    },
    {
      id: "law",
      heading: "9. Governing law",
      blocks: [
        {
          kind: "p",
          text: "These terms and any dispute arising out of them or out of your use of this site are governed by the laws of India. The courts at Coimbatore, Tamil Nadu have exclusive jurisdiction, save that we retain the right to bring proceedings in the courts of the country in which you are resident. [CONFIRM: jurisdiction to be confirmed with the client's counsel — Coimbatore, or Erode now that headquarters is there.]",
        },
      ],
    },
    {
      id: "contact-terms",
      heading: "10. Contact",
      blocks: [
        {
          kind: "p",
          text: "Questions about these terms go to connect@hazebergconsulting.com, or to our headquarters in Erode, at the address in section 1.",
        },
      ],
    },
  ],
};
