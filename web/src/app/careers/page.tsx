import { ArrowUpRight, Check } from "lucide-react";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CrossLink } from "@/components/page/cross-link";
import { PageHero } from "@/components/page/page-hero";
import { CtaMail } from "@/components/ui/cta-pill";
import { Eyebrow, Section, SectionHead } from "@/components/ui/section";
import { CAREERS_PAGE } from "@/lib/careers-content";
import { SERVICES } from "@/lib/home-content";
import { CONTACT } from "@/lib/navigation";

export const metadata = {
  title: "Careers",
  description:
    "Build a Workday career at Hazeberg — HCM, Payroll, Financials, Integrations, Reporting, AMS and Extend, from Coimbatore and Penang.",
};

/**
 * Careers.
 *
 * The honest structural decision on this page: **there is no job board**, because
 * there are no advertised roles. §18 of the captured live site records it — the
 * whole careers section is four value props and an email address. Inventing six
 * openings would be the easiest thing on this page to make look good and the
 * fastest thing to get caught out by, so the page says what is true instead: we
 * hire continuously into the seven practices we deliver, and here is the address.
 *
 * That turns out to be the better design anyway. A list of practices is a list of
 * things a Workday consultant already identifies with — "I am a Payroll person" —
 * and each row applies straight into that practice with the subject line already
 * written, which is a shorter path than any job board.
 *
 * The rows are not new content: they are `SERVICES.items`, the same seven the home
 * page and the footer render, with their existing one-line summaries. Nothing is
 * restated and nothing can drift.
 *
 * Ground order mirrors Contact — dark, surface, canvas, surface, ink, canvas — so
 * the two pages read as one space with two doors.
 */

/** Every mail route off this page, composed in one place so the subject lines
    stay consistent and an application lands sorted. */
function apply(practice?: string) {
  const subject = practice ? `Application — ${practice}` : "Application — Hazeberg";
  const body = [
    practice
      ? `I would like to be considered for work in the ${practice} practice.`
      : "I would like to be considered for a role at Hazeberg.",
    "",
    "Experience:",
    "Workday certifications:",
    "Location and notice period:",
    "",
    "(CV attached)",
  ].join("\n");
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    body,
  )}`;
}

/* ============================== 02 — WHY HERE =========================== */

/**
 * The client's own four reasons, verbatim, as four cards.
 *
 * The number is the decoration — set large, light and in `--surface-3`, it sits
 * behind the title as a watermark rather than competing with it. It is the same
 * device the home page's services list uses for "01 /", which is why it does not
 * read as a new idea.
 */
function Why() {
  const { why } = CAREERS_PAGE;
  return (
    <Section ground="surface">
      <SectionHead
        align="start"
        eyebrow={why.eyebrow}
        title={why.title}
        titleMax="max-w-[26ch]"
      />

      <RevealGroup as="ul" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {why.items.map((item) => (
          <RevealItem as="li" key={item.n}>
            <div className="group/w relative flex h-full flex-col overflow-hidden rounded-lg bg-canvas p-7 ring-1 ring-border transition dur-base ease-brand hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 hover:ring-primary/35">
              {/* The wash, same as the home page's stat cards: there at 0 and
                  blurred in on hover, so a touch device that never reports one
                  still gets the card and the rule. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-20 -right-16 size-44 rounded-pill bg-primary/25 opacity-0 blur-3xl transition-opacity dur-slow ease-brand group-hover/w:opacity-100"
              />
              <span
                aria-hidden
                className="relative font-mono text-sm tracking-caps text-ink-subtle"
              >
                {item.n}
              </span>
              <span
                aria-hidden
                className="grad-primary relative mt-5 h-1 w-10 rounded-pill"
              />
              <h3 className="relative mt-6 text-lg leading-snug font-medium text-balance text-ink">
                {item.title}
              </h3>
              <p className="relative mt-3 text-sm text-ink-muted">{item.body}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/* ============================= 03 — PRACTICES =========================== */

/**
 * The seven practices as rows, each one an application.
 *
 * A list, not a grid of cards: seven cards is a wall, and these are not seven
 * different propositions — they are seven doors into the same one. The row is the
 * link, so the target is the full width of the shell.
 *
 * What moves on hover: the rule on the left grows from 0 to full height, the
 * label shifts right by the width it vacated, and the word "Apply" arrives with
 * its arrow. Three properties, one gesture. The rule is `grad-primary` so the
 * motion carries the brand colour rather than a grey.
 *
 * At rest the row shows the practice and its one-liner and nothing else, which
 * is what keeps seven of them legible as a list.
 */
function Practices() {
  const { practices } = CAREERS_PAGE;
  return (
    <Section ground="canvas">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start lg:gap-16">
        <SectionHead
          align="start"
          eyebrow={practices.eyebrow}
          title={practices.title}
          body={practices.body}
          titleMax="max-w-[20ch]"
        />

        <div>
          <RevealGroup as="ul" className="border-t border-border" stagger={0.05}>
            {SERVICES.items.map((service) => (
              <RevealItem as="li" key={service.n} className="border-b border-border">
                <a
                  href={apply(service.label)}
                  className="group/r relative flex items-center gap-5 py-6 pl-0 transition-[padding] dur-base ease-brand hover:pl-5"
                >
                  {/* Grows from the row's centre outwards, so it does not read as
                      a bar dropping in from the top. */}
                  <span
                    aria-hidden
                    className="grad-primary absolute top-1/2 left-0 h-0 w-[3px] -translate-y-1/2 rounded-pill transition-all dur-base ease-brand group-hover/r:h-[calc(100%-2rem)]"
                  />
                  <span className="font-mono text-xs tracking-caps text-ink-subtle">
                    {service.n}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg leading-snug font-medium text-ink">
                      {service.label}
                    </span>
                    <span className="mt-1 block text-sm text-ink-muted">{service.short}</span>
                  </span>
                  {/* Hidden from assistive tech, because the link's own text
                      already says which practice this applies into — this is the
                      visual affordance, not the label. On a touch device it never
                      appears, and the whole row is still the link. */}
                  <span
                    aria-hidden
                    className="hidden shrink-0 items-center gap-2 font-mono text-[0.6875rem] tracking-caps text-primary uppercase opacity-0 transition-opacity dur-base ease-brand group-hover/r:opacity-100 sm:flex"
                  >
                    {practices.applyLabel}
                    <ArrowUpRight className="size-3.5" strokeWidth={2} />
                  </span>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[56ch] text-sm text-ink-subtle">{practices.note}</p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* ============================== 04 — HIRING ============================= */

/**
 * Four steps on one horizontal rule at lg, stacked on a phone.
 *
 * The rule runs BEHIND the markers rather than between them, so the sequence is
 * one line with four stops on it — the same reading as the engagement journey on
 * the home page, at a quarter of the machinery. `aria-hidden` on the rule: it is
 * the drawing of an order the `<ol>` already carries.
 */
function Hiring() {
  const { hiring } = CAREERS_PAGE;
  return (
    <Section ground="surface">
      <SectionHead
        align="start"
        eyebrow={hiring.eyebrow}
        title={hiring.title}
        body={hiring.body}
        titleMax="max-w-[24ch]"
      />

      <div className="relative mt-14">
        <span
          aria-hidden
          className="absolute top-[7px] right-0 left-0 hidden h-px bg-border lg:block"
        />
        <RevealGroup as="ol" className="grid gap-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {hiring.items.map((step) => (
            <RevealItem as="li" key={step.n} className="relative">
              <span
                aria-hidden
                className="disc-blue block size-[15px] rounded-pill ring-4 ring-surface"
              />
              <p className="mt-6 font-mono text-xs tracking-caps text-ink-subtle">{step.n}</p>
              <h3 className="mt-3 max-w-[18ch] text-lg leading-snug font-medium text-balance text-ink">
                {step.title}
              </h3>
              <p className="mt-2.5 max-w-[34ch] text-sm text-ink-muted">{step.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

/* =========================== 05 — FOR CONSULTANTS ======================= */

/**
 * The one dark block in the middle of the page, and it is dark because it is
 * addressed to a different person: everything above is for someone who wants a
 * job, and this is for someone who already has a practice of their own.
 *
 * The sitemap puts "For Consultants" on Careers rather than on Berg deliberately
 * — it is hiring-facing — so it sits here, one panel, not a section with a head
 * and a grid. `ground="ink"` is the site's existing dark panel: the ink gradient
 * with grain over it, white type, `--on-panel`.
 *
 * `data-nav-dark` is NOT set on it: the block is mid-page, and the header's
 * observer only reads the top band of the viewport — flipping the bar to white
 * while a light section is still under it is the bug that attribute exists to
 * avoid.
 */
function ForConsultants() {
  const { consultants } = CAREERS_PAGE;
  return (
    <Section ground="ink">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
        <div>
          <Eyebrow tone="panel">{consultants.eyebrow}</Eyebrow>
          <Reveal>
            <h2 className="mt-5 max-w-[22ch] text-3xl leading-[1.08] font-light tracking-[-0.03em] text-balance text-on-panel">
              {consultants.title}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 max-w-[56ch] text-base text-on-panel/70">{consultants.body}</p>
          </Reveal>
          <Reveal delay={0.14}>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {consultants.points.map((point) => (
                /* Chips, not bullets. Three short facts read faster side by side
                   than stacked, and the panel has the width for it. */
                <li
                  key={point}
                  className="rounded-pill bg-white/8 px-4 py-2 text-sm text-on-panel/85 ring-1 ring-white/12"
                >
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          {/* The white pill, because this is a dark ground — the same two-tone
              rule every CTA on the site follows. */}
          <CtaMail href={apply("Independent consultant")} tone="light">
            {consultants.cta}
          </CtaMail>
        </Reveal>
      </div>
    </Section>
  );
}

/* =============================== 06 — APPLY ============================= */

/**
 * The close, and the only place on the page that asks for something.
 *
 * Email is the whole application process, which is what the live site already
 * says — so rather than apologise for the absence of a form, the block makes the
 * email a briefing: four things to put in it, then the button that opens it with
 * the subject and the skeleton already written.
 *
 * The list is ticks rather than bullets: these are things to check off before
 * sending, and a tick says that where a dot does not.
 */
function Apply() {
  const { apply: copy } = CAREERS_PAGE;
  return (
    <Section ground="canvas" id="apply">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-16">
        <div>
          <SectionHead
            align="start"
            eyebrow={copy.eyebrow}
            title={copy.title}
            body={copy.body}
            titleMax="max-w-[24ch]"
          />
          <Reveal delay={0.12}>
            <div className="mt-10">
              <CtaMail href={apply()}>{copy.cta}</CtaMail>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <div className="rounded-2xl bg-surface p-7 sm:p-8">
            <p className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
              What to include
            </p>
            <ul className="mt-6 space-y-4">
              {copy.include.map((item) => (
                <li key={item} className="flex items-start gap-3.5 text-sm text-ink">
                  <span
                    aria-hidden
                    className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-pill bg-primary/12 text-primary"
                  >
                    <Check className="size-3" strokeWidth={2.6} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ================================= PAGE ================================= */

export default function Page() {
  const { eyebrow, titleLead, titleAccent, lead, meta, cross } = CAREERS_PAGE;

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

      <Why />
      <Practices />
      <Hiring />
      <ForConsultants />
      <Apply />
      <CrossLink {...cross} />
    </>
  );
}
