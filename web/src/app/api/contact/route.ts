/**
 * The contact form's endpoint.
 *
 * There is no mail provider in this project and no database, so this route does
 * the two things it honestly can: it validates, and it forwards.
 *
 *   - **validates** server-side as well as in the browser. The client's checks
 *     are for the person filling the form in; these are for everything that
 *     posts here without using the form.
 *   - **forwards** to `CONTACT_WEBHOOK_URL` if one is set — any of Zapier, Make,
 *     n8n, a Slack incoming webhook, or a Sanity/CRM endpoint later. A webhook
 *     rather than an SMTP or Resend dependency because it adds no package, no
 *     API key in the repo, and no vendor decision that is the client's to make.
 *
 * With no webhook configured it answers **503 `unconfigured`**, and the form
 * turns into a prefilled mail link carrying everything the person typed. That is
 * the whole reason this route reports failure honestly instead of returning 200:
 * a form that says "thank you" into a void is worse than no form, and a visitor
 * who wrote four paragraphs must never lose them.
 *
 * Nothing is logged. The body is a named person's contact details, and writing
 * it into a platform log is a copy of personal data nobody asked for.
 */

/** Long enough to be a sentence, short enough not to be a novel. */
const LIMITS = {
  name: 120,
  email: 160,
  company: 160,
  phone: 40,
  interest: 80,
  message: 4000,
} as const;

type Field = keyof typeof LIMITS;

const REQUIRED: Field[] = ["name", "email", "company", "interest", "message"];

/** Deliberately loose. A regex is a bad judge of an address; this only rejects
    what cannot be one, and the reply is what proves it. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function bad(reason: string, status = 400) {
  return Response.json({ ok: false, reason }, { status });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return bad("malformed");
  }

  /* The honeypot. A field no human sees and no human fills; a bot fills
     everything. Answered with 200 rather than an error, because telling a bot
     which check it failed is telling it how to pass. */
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true, delivered: true });
  }

  const data: Partial<Record<Field, string>> = {};
  for (const field of Object.keys(LIMITS) as Field[]) {
    const raw = body[field];
    if (raw !== undefined && typeof raw !== "string") return bad("malformed");
    const value = (raw ?? "").trim();
    if (value.length > LIMITS[field]) return bad(`${field}-too-long`);
    data[field] = value;
  }

  for (const field of REQUIRED) {
    if (!data[field]) return bad(`${field}-missing`);
  }
  if (!EMAIL.test(data.email as string)) return bad("email-invalid");

  const target = process.env.CONTACT_WEBHOOK_URL;
  if (!target) return bad("unconfigured", 503);

  try {
    const sent = await fetch(target, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ source: "hazeberg-contact-form", ...data }),
      /* A hanging webhook must not hang the person's browser — they get the mail
         fallback instead, which works. */
      signal: AbortSignal.timeout(8000),
    });
    if (!sent.ok) return bad("upstream", 502);
  } catch {
    return bad("upstream", 502);
  }

  return Response.json({ ok: true, delivered: true });
}
