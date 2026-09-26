"use client";

import { useRef, useState } from "react";
import { Check, Mail } from "lucide-react";

import { CtaButton, CtaMail } from "@/components/ui/cta-pill";
import { SelectField, TextField, TextareaField } from "@/components/ui/field";
import { CONTACT_PAGE } from "@/lib/contact-content";
import { CONTACT } from "@/lib/navigation";

/**
 * The contact form.
 *
 * Three states, and the third one is the whole design:
 *
 *   idle      six controls in a two-column grid, one column on a phone
 *   sent      the form is replaced by a confirmation. It does not stay on screen
 *             greyed out — a form you have already submitted invites a second
 *             submit
 *   fallback  **the honest failure.** There is no mail provider wired up in this
 *             project (see `app/api/contact/route.ts`), so when the endpoint
 *             cannot deliver, the form does not claim it sent anything. It hands
 *             over a mail link carrying every word already typed — subject, body,
 *             the lot — so nothing is retyped and nothing is lost.
 *
 * Validation runs on submit, not on every keystroke: telling somebody their email
 * address is invalid while they are still on the third character of it is the
 * single most irritating pattern in web forms. After a failed submit each field
 * clears its own error as soon as it is edited, so the page stops complaining the
 * moment it is being fixed.
 *
 * Focus moves to the first invalid control, which is what makes the error state
 * work for a keyboard and a screen reader rather than only for someone who can
 * see red text appear.
 */

type Values = {
  name: string;
  email: string;
  company: string;
  phone: string;
  interest: string;
  message: string;
};

const EMPTY: Values = { name: "", email: "", company: "", phone: "", interest: "", message: "" };

/** Same rule as the route's, deliberately loose. A regex is a bad judge of an
    address; this only rejects what cannot be one, and the reply is the proof. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: Values) {
  const errors: Partial<Record<keyof Values, string>> = {};
  if (!values.name.trim()) errors.name = "Tell us who you are.";
  if (!values.email.trim()) errors.email = "We need somewhere to reply.";
  else if (!EMAIL.test(values.email.trim()))
    errors.email = "That does not look like an email address.";
  if (!values.company.trim()) errors.company = "Which organization is this for?";
  if (!values.interest) errors.interest = "Pick the closest one — it decides who reads this.";
  if (values.message.trim().length < 10) errors.message = "A line or two about the tenant, at least.";
  return errors;
}

/** Everything typed, folded into a mail link. This is the fallback's payload and
    the reason a failed send costs the visitor nothing. */
function mailLink(values: Values) {
  const subject = [
    "Workday enquiry",
    values.interest || "general",
    values.company || null,
  ]
    .filter(Boolean)
    .join(" — ");

  const body = [
    values.message.trim(),
    "",
    "—",
    `Name: ${values.name}`,
    `Company: ${values.company}`,
    `Email: ${values.email}`,
    values.phone ? `Phone: ${values.phone}` : null,
    `Interest: ${values.interest}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    body,
  )}`;
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "fallback">("idle");
  /** Filled only by something that is not a person. */
  const honeypot = useRef("");
  const form = useRef<HTMLFormElement>(null);

  const copy = CONTACT_PAGE.form;

  const set = (field: keyof Values) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    /* Clear this field's complaint the moment it is being addressed. */
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);

    const first = (Object.keys(found) as (keyof Values)[])[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`#${first}`)?.focus();
      return;
    }

    setState("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot.current }),
      });
      setState(response.ok ? "sent" : "fallback");
    } catch {
      /* Offline, blocked, or the route is not there. Same answer: the mail link
         works even when the network to our own server does not. */
      setState("fallback");
    }
  }

  if (state === "sent") {
    return (
      <Panel
        icon={<Check className="size-5" strokeWidth={2.2} />}
        title="That is with us."
        body={`It is going to a consultant rather than an inbox nobody owns. Expect the reply at ${values.email}.`}
      >
        <button
          type="button"
          onClick={() => {
            setValues(EMPTY);
            setState("idle");
          }}
          className="inline-flex min-h-11 cursor-pointer items-center text-sm font-medium text-primary underline underline-offset-4 hover:no-underline"
        >
          Send another
        </button>
      </Panel>
    );
  }

  if (state === "fallback") {
    return (
      <Panel
        icon={<Mail className="size-5" strokeWidth={2} />}
        title="Send it from your own mail instead."
        body="This form cannot deliver from here yet. Nothing you wrote is lost — the button below opens a message with all of it already in place, addressed to us."
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
          <CtaMail href={mailLink(values)}>Open the message</CtaMail>
          <button
            type="button"
            onClick={() => setState("idle")}
            className="inline-flex min-h-11 cursor-pointer items-center text-left text-sm font-medium text-primary underline underline-offset-4 hover:no-underline"
          >
            Back to the form
          </button>
        </div>
      </Panel>
    );
  }

  return (
    /* `relative`, because the honeypot below is positioned against it. Without
       it the off-screen field anchors to the page and adds 9999px of scroll. */
    <form
      ref={form}
      onSubmit={submit}
      noValidate
      className="relative rounded-2xl bg-canvas p-6 ring-1 ring-border sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="name"
          label="Your name"
          value={values.name}
          onChange={set("name")}
          error={errors.name}
          autoComplete="name"
          placeholder="Priya Raman"
        />
        <TextField
          id="email"
          type="email"
          label="Work email"
          value={values.email}
          onChange={set("email")}
          error={errors.email}
          autoComplete="email"
          placeholder="you@company.com"
        />
        <TextField
          id="company"
          label="Company"
          value={values.company}
          onChange={set("company")}
          error={errors.company}
          autoComplete="organization"
          placeholder="Company name"
        />
        <TextField
          id="phone"
          type="tel"
          label="Phone"
          optional
          value={values.phone}
          onChange={set("phone")}
          error={errors.phone}
          autoComplete="tel"
          placeholder="+1 555 0100"
        />
        <SelectField
          id="interest"
          label="What is this about?"
          wide
          value={values.interest}
          onChange={set("interest")}
          error={errors.interest}
          options={copy.interests}
          placeholder="Choose the closest"
        />
        <TextareaField
          id="message"
          label="What are you working on?"
          wide
          rows={6}
          value={values.message}
          onChange={set("message")}
          error={errors.message}
          placeholder="Which modules, where the tenant is today, and what is getting in the way."
        />
      </div>

      {/* The honeypot. Off-screen rather than `display: none` — some bots skip
          hidden fields and none of them skip one that is in the layout. It is
          `aria-hidden` and out of the tab order, so nobody using the form meets
          it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden"
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          onChange={(event) => {
            honeypot.current = event.target.value;
          }}
        />
      </div>

      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <CtaButton busy={state === "sending"}>
          {state === "sending" ? copy.sending : copy.submit}
        </CtaButton>
        <p className="max-w-[30ch] text-xs text-ink-subtle">{copy.note}</p>
      </div>
    </form>
  );
}

/** The shell both terminal states share, so "sent" and "could not send" are one
    object in two skins rather than two blocks that drift apart. */
function Panel({
  icon,
  title,
  body,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div
      /* `aria-live` on the container rather than `role="alert"`: this replaces
         the whole form, so the arrival of the panel IS the announcement. */
      aria-live="polite"
      className="flex flex-col rounded-2xl bg-canvas p-8 ring-1 ring-border sm:p-10"
    >
      <span aria-hidden className="disc-blue grid size-11 place-items-center rounded-pill text-white">
        {icon}
      </span>
      <p className="mt-6 max-w-[24ch] text-2xl leading-[1.12] font-light tracking-[-0.02em] text-balance text-ink">
        {title}
      </p>
      <p className="mt-4 max-w-[50ch] text-sm text-ink-muted">{body}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}
