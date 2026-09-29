import { Check } from "lucide-react";

import { ExpectRail } from "@/components/careers/expect-rail";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CrossLink } from "@/components/page/cross-link";
import { PageHero } from "@/components/page/page-hero";
import { CtaMail } from "@/components/ui/cta-pill";
import { Section, SectionHead } from "@/components/ui/section";
import { CAREERS_PAGE } from "@/lib/careers-content";
import { CONTACT } from "@/lib/navigation";

export const metadata = {
  title: "Careers",
  description:
    "Build your career around Workday expertise. Join Hazeberg's certified consultants across implementations, integrations and optimization, from Coimbatore and Penang.",
};

/**
 * Careers.
 *
 * Rebuilt 2026-09-28 on the client's own careers draft — every heading, pillar
 * and paragraph on this page is theirs. What the build adds is the motion the
 * client signed off on for the home page and asked for everywhere else:
 *
 *   - the three pillars arrive staggered and light on hover
 *   - "What you can expect" is a four-tab rail against one panel, rather than
 *     four equal cards saying four things at once (`components/careers/`)
 *   - the culture chips settle in sequence
 *
 * Ground order matches Contact — dark opener, then surface, canvas, surface,
 * canvas — so the two pages still read as one space with two doors.
 *
 * One thing this page does NOT have: a list of open roles. The client's draft
 * has a "View open positions" button and no positions anywhere on it, so the
 * button scrolls to the application block rather than to an empty page. When a
 * roles list arrives it belongs between "What you can expect" and the apply
 * block, and nothing else has to move.
 */

/** Every mail route off this page, composed once so applications land sorted. */
function apply() {
  const subject = "Application — Hazeberg";
  const body = [
    "I would like to be considered for a role at Hazeberg.",
    "",
    "The Workday area I am aiming at:",
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
 * Their three paragraphs, set as one column against the heading rather than as
 * three cards. It is an argument, not a list, and three boxes would break it
 * into three claims that do not obviously belong together.
 */
function Why() {
  const { why } = CAREERS_PAGE;
  return (
    <Section ground="surface">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start lg:gap-20">
        <SectionHead align="start" eyebrow={why.eyebrow} title={why.title} titleMax="max-w-[16ch]" />
        <RevealGroup className="space-y-5" stagger={0.08}>
          {why.body.map((para) => (
            <RevealItem key={para.slice(0, 24)}>
              <p className="max-w-[62ch] text-base text-ink-muted">{para}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

/* ============================== 03 — PILLARS ============================ */

function Pillars() {
  const { pillars } = CAREERS_PAGE;
  return (
    <Section ground="canvas">
      <SectionHead
        align="start"
        eyebrow={pillars.eyebrow}
        title={pillars.title}
        titleMax="max-w-[18ch]"
      />

      <RevealGroup as="ul" className="mt-12 grid gap-5 lg:grid-cols-3">
        {pillars.items.map((item) => (
          <RevealItem as="li" key={item.n}>
            <div className="group/p relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface p-7 transition dur-base ease-brand hover:-translate-y-1 hover:bg-canvas hover:shadow-xl hover:shadow-primary/10 hover:ring-1 hover:ring-primary/25 sm:p-8">
              {/* The wash sits at 0 and blurs in — the same device the home
                  page's stat cards use, so a card built on a different page
                  still behaves like a Hazeberg card. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-20 -right-16 size-44 rounded-pill bg-primary/25 opacity-0 blur-3xl transition-opacity dur-slow ease-brand group-hover/p:opacity-100"
              />
              <span aria-hidden className="grad-primary relative h-1 w-10 rounded-pill" />
              <span className="relative mt-6 font-mono text-xs tracking-caps text-ink-subtle">
                {item.n}
              </span>
              <h3 className="relative mt-3 max-w-[20ch] text-xl leading-tight font-light tracking-[-0.02em] text-balance text-ink">
                {item.title}
              </h3>
              <p className="relative mt-4 text-sm text-ink-muted">{item.body}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/* ============================== 04 — CULTURE ============================ */

/**
 * The one dark block on the page. Their culture copy is the part that is about
 * people rather than about the platform, and the ground change is what marks it
 * as a different kind of statement — the same way the home page uses its dark
 * panels.
 */
function Culture() {
  const { culture } = CAREERS_PAGE;
  return (
    <Section ground="ink">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center lg:gap-20">
        <div>
          <SectionHead
            align="start"
            tone="panel"
            eyebrow={culture.eyebrow}
            title={culture.title}
            titleMax="max-w-[18ch]"
          />
        </div>
        <div>
          <RevealGroup className="space-y-5" stagger={0.08}>
            {culture.body.map((para) => (
              <RevealItem key={para.slice(0, 24)}>
                <p className="text-base text-on-panel/70">{para}</p>
              </RevealItem>
            ))}
          </RevealGroup>
          <RevealGroup as="ul" className="mt-9 flex flex-wrap gap-2.5" stagger={0.07}>
            {culture.chips.map((chip) => (
              <RevealItem as="li" key={chip}>
                <span className="inline-flex min-h-11 items-center gap-2.5 rounded-pill bg-white/8 px-5 py-2 text-sm text-on-panel/85 ring-1 ring-white/12 transition dur-base ease-brand hover:bg-white/14 hover:text-on-panel">
                  <span aria-hidden className="size-1.5 rounded-pill bg-accent" />
                  {chip}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}

/* ============================== 05 — EXPECT ============================= */

function Expect() {
  const { expect } = CAREERS_PAGE;
  return (
    <Section ground="surface">
      <SectionHead
        align="start"
        eyebrow={expect.eyebrow}
        title={expect.title}
        titleMax="max-w-[18ch]"
      />
      <div className="mt-12">
        <ExpectRail />
      </div>
    </Section>
  );
}

/* =============================== 06 — APPLY ============================= */

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
            titleMax="max-w-[20ch]"
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
              {copy.includeLabel}
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
  const { eyebrow, titleLead, titleAccent, lead, leadSecond, meta, cta, cross } = CAREERS_PAGE;

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
        leadSecond={leadSecond}
        meta={[...meta]}
        cta={cta}
      />

      <Why />
      <Pillars />
      <Culture />
      <Expect />
      <Apply />
      <CrossLink {...cross} />
    </>
  );
}
