import { Mail, Phone } from "lucide-react";

import { LinkedInMark } from "@/components/brand/linkedin-mark";
import { ContactForm } from "@/components/contact/contact-form";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CrossLink } from "@/components/page/cross-link";
import { PageHero } from "@/components/page/page-hero";
import { Section, SectionHead } from "@/components/ui/section";
import { CONTACT_PAGE } from "@/lib/contact-content";
import { CONTACT, OFFICES } from "@/lib/navigation";

export const metadata = {
  title: "Contact",
  description:
    "Tell us what your Workday tenant is doing — implementation, optimization, integrations or ongoing support. Offices in Coimbatore and Penang.",
};

/**
 * Contact.
 *
 * The page answers one question — how do I reach a person who knows Workday —
 * and it answers it three times over, in descending order of effort:
 *
 *   1. the form, which is the only route that asks what you actually need
 *   2. the direct lines, for anyone who does not want a form at all
 *   3. the offices, for anyone who wants to know where the company is before
 *      they talk to it
 *
 * The composition is the home page's, at page scale: a dark band opens it, then
 * surface, canvas, surface. The ground change is the only separator, exactly as
 * it is on the home page — no rules, no dividers between sections.
 *
 * The one structural decision worth naming: the form is on the RIGHT and the
 * copy on the left. A form in the left column reads as the page's aside, and
 * this form is the page's point. On a phone the head comes first and the form
 * follows it, which is the same order read down instead of across.
 */

/* ============================= 02 — THE FORM ============================ */

/**
 * The left rail. It stays put while the form scrolls at lg — the steps are the
 * reassurance that makes somebody finish a six-field form, and reassurance that
 * has scrolled off the top of the screen is not doing its job.
 *
 * `top` clears the floating header, which is why it is the header token plus a
 * gap rather than a number.
 */
function Rail() {
  const { form, steps } = CONTACT_PAGE;
  return (
    <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
      <SectionHead
        align="start"
        eyebrow={form.eyebrow}
        title={form.title}
        body={form.body}
        titleMax="max-w-[20ch]"
      />

      <Reveal delay={0.12} className="mt-12">
        <p className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
          {steps.eyebrow}
        </p>
        {/* A numbered list with the rule down its left, rather than three cards.
            Cards would compete with the form beside them, and this is a sequence
            — one continuous line saying so is worth more than three boxes. */}
        <ol className="mt-5 border-l border-border">
          {steps.items.map((step) => (
            <li key={step.n} className="relative pb-7 pl-6 last:pb-0">
              {/* The marker sits ON the rule, centred on it: a 9px dot pulled
                  back by half its width plus the rule's own pixel. */}
              <span
                aria-hidden
                className="disc-blue absolute top-1.5 -left-[5px] size-[9px] rounded-pill"
              />
              <p className="text-sm font-medium text-ink">{step.title}</p>
              <p className="mt-1.5 max-w-[34ch] text-sm text-ink-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  );
}

/* ============================ 03 — DIRECT LINES ========================= */

/**
 * Three tiles, three real accounts. Nothing invented: the email, the phone and
 * the LinkedIn company page are the only three channels Hazeberg has, and a
 * fourth tile with an X handle nobody runs would undo the other three.
 *
 * Each tile is the whole link, so the hit area is the tile and not the line of
 * text inside it. The value is set in the mono face at body size — it is a
 * string to be read character by character rather than a sentence, and that is
 * exactly what a monospace is for.
 */
const CHANNELS = [
  {
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    icon: Mail,
    note: "Best for anything with detail in it.",
    external: false,
  },
  {
    label: "Phone",
    value: CONTACT.phone,
    href: CONTACT.phoneHref,
    icon: Phone,
    note: "Coimbatore and Penang business hours.",
    external: false,
  },
  {
    label: "LinkedIn",
    value: "Hazeberg Consulting",
    href: CONTACT.linkedin,
    icon: LinkedInMark,
    note: "Company page — updates and roles.",
    external: true,
  },
] as const;

function Channels() {
  const { direct } = CONTACT_PAGE;
  return (
    <Section ground="canvas">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start lg:gap-16">
        <SectionHead
          align="start"
          eyebrow={direct.eyebrow}
          title={direct.title}
          body={direct.body}
          titleMax="max-w-[16ch]"
        />

        <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-3">
          {CHANNELS.map((channel) => (
            <RevealItem as="li" key={channel.label}>
              <a
                href={channel.href}
                {...(channel.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group/c flex h-full flex-col rounded-lg bg-canvas p-6 ring-1 ring-border transition dur-base ease-brand hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:ring-primary/35"
              >
                <span
                  aria-hidden
                  className="disc-blue grid size-10 place-items-center rounded-pill text-white"
                >
                  <channel.icon className="size-4" strokeWidth={1.9} />
                </span>
                <span className="mt-6 font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
                  {channel.label}
                </span>
                {/* `break-all` on the address only: the email is 30 characters
                    with no break opportunity in it, and at 320px it is wider
                    than the tile. */}
                <span className="mt-2 font-mono text-sm break-all text-primary group-hover/c:underline">
                  {channel.value}
                </span>
                <span className="mt-auto pt-5 text-sm text-ink-muted">{channel.note}</span>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

/* ============================== 04 — OFFICES ============================ */

/**
 * Two offices, and no map. A map is an external tile server, a third-party
 * script and a cookie banner in exchange for a picture of a road nobody is
 * driving to — every one of which the site has spent real effort avoiding.
 *
 * `.map-ground` instead: the same two brand washes the services board floats on,
 * here inside a card, so the block has brand light in it without a photograph or
 * an embed. The address is a `<address>` element, which is what it is for.
 */
function Offices() {
  const { offices } = CONTACT_PAGE;
  return (
    <Section ground="surface">
      <SectionHead
        align="start"
        eyebrow={offices.eyebrow}
        title={offices.title}
        body={offices.body}
        titleMax="max-w-[22ch]"
      />

      <RevealGroup as="ul" className="mt-12 grid gap-5 lg:grid-cols-2">
        {OFFICES.map((office) => (
          <RevealItem as="li" key={office.city}>
            <div className="map-ground flex h-full flex-col rounded-2xl p-7 ring-1 ring-border sm:p-9">
              <div className="flex items-baseline gap-3">
                <h3 className="text-2xl leading-none font-light tracking-[-0.02em] text-ink">
                  {office.city}
                </h3>
                <span className="font-mono text-xs tracking-caps text-ink-subtle uppercase">
                  {office.country}
                </span>
              </div>
              <span
                aria-hidden
                className="grad-primary mt-6 h-1 w-10 rounded-pill"
              />
              <address className="mt-6 text-sm leading-relaxed text-ink-muted not-italic">
                {office.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              {/* The three facts a person actually wants off an office card: what
                  it is for, what time it is there, and when somebody is in. */}
              <dl className="mt-auto grid gap-x-6 gap-y-4 border-t border-border pt-7 sm:grid-cols-3">
                {[
                  { k: "Role", v: office.role },
                  { k: "Timezone", v: office.tz },
                  { k: "Hours", v: office.hours },
                ].map((row) => (
                  <div key={row.k}>
                    <dt className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
                      {row.k}
                    </dt>
                    <dd className="mt-1.5 text-sm text-ink">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/* ================================= PAGE ================================= */

export default function Page() {
  const { eyebrow, titleLead, titleAccent, lead, meta, cross } = CONTACT_PAGE;

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={
          <>
            {titleLead}
            <span className="text-accent">{titleAccent}</span>
          </>
        }
        lead={lead}
        meta={[...meta]}
      />

      <Section ground="surface" id="enquiry">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-16">
          <Rail />
          <Reveal delay={0.08}>
            <ContactForm />
          </Reveal>
        </div>
      </Section>

      <Channels />
      <Offices />
      <CrossLink {...cross} />
    </>
  );
}
