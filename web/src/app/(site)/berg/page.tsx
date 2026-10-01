import {
  Briefcase,
  Building2,
  Check,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Smartphone,
  UserRound,
  Wallet,
} from "lucide-react";

import { BergHero } from "@/components/berg/berg-hero";
import { RoleCards } from "@/components/berg/role-cards";
import { Workflow } from "@/components/berg/workflow";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CrossLink } from "@/components/page/cross-link";
import { CtaPill } from "@/components/ui/cta-pill";
import { Eyebrow, Section, SectionHead } from "@/components/ui/section";
import { BERG } from "@/lib/berg-content";

export const metadata = {
  title: "Berg",
  description:
    "Berg — the marketplace built for the Workday ecosystem. Customers, consulting firms, and consultants connect through one platform to discover opportunities and collaborate faster.",
};

/**
 * Berg.
 *
 * Rebuilt 2026-09-28 on the client's own "Berg Page Content" document. Every
 * word on this page is theirs, and the section order is theirs too — who it is
 * for, how it works, what the platform does, mobile, pricing, questions, contact
 * — because that order is the argument they chose to make.
 *
 * Three of those sections are interactive because the DOCUMENT asks for it, not
 * because a product page needs decoration:
 *
 *   - the three audience cards ship with a "Collapsed Card" and an "Expanded
 *     Model" in their copy — `components/berg/role-cards.tsx`
 *   - the ecosystem workflow is drawn as a five-stop flow — `workflow.tsx`
 *   - the platform features each carry a "Static" line and an "Expanded" body,
 *     which is a disclosure by definition
 *
 * What is NOT carried across, per `SITEMAP.md` — "A Hazeberg solution, not a
 * sub-brand, no separate visual identity": the Berg wordmark and the
 * purple-and-orange palette their own page runs. The words are theirs; the
 * system they are set in is ours.
 */

/* ============================== 02 — WHO IT IS FOR ====================== */

function Roles() {
  const { roles } = BERG;
  return (
    <Section ground="surface" id="roles">
      <SectionHead
        align="start"
        eyebrow={roles.eyebrow}
        title={roles.title}
        body={roles.body}
        titleMax="max-w-[20ch]"
      />
      <div className="mt-12">
        <RoleCards />
      </div>
    </Section>
  );
}

/* ============================== 03 — WORKFLOW =========================== */

function HowItWorks() {
  const { workflow } = BERG;
  return (
    <Section ground="canvas" id="how">
      <SectionHead
        align="start"
        eyebrow={workflow.eyebrow}
        title={
          <>
            {workflow.titleLead}
            <span className="text-primary">{workflow.titleAccent}</span>
          </>
        }
        body={workflow.body}
        titleMax="max-w-[22ch]"
      />
      <div className="mt-14">
        <Workflow />
      </div>
    </Section>
  );
}

/* ============================== 04 — PLATFORM =========================== */

const PLATFORM_ICONS = { search: Search, money: Wallet, shield: ShieldCheck } as const;

/**
 * The three platform features, as native disclosures.
 *
 * `<details>` rather than a JavaScript accordion: the browser supplies the
 * keyboard operation, the open state, the semantics and find-in-page for free,
 * and a hand-built version has to re-implement all four. The only styling is the
 * marker (removed) and the chevron (rotated by `open:`).
 *
 * Not single-open, deliberately. These are three independent statements and
 * closing one to read another is tidiness getting in the way of reading.
 */
function Platform() {
  const { platform } = BERG;
  return (
    <Section ground="surface">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start lg:gap-16">
        <SectionHead
          align="start"
          eyebrow={platform.eyebrow}
          title={platform.title}
          body={platform.body}
          titleMax="max-w-[16ch]"
        />

        <RevealGroup as="ul" className="space-y-4" stagger={0.07}>
          {platform.items.map((item) => {
            const Icon = PLATFORM_ICONS[item.icon as keyof typeof PLATFORM_ICONS];
            return (
              <RevealItem as="li" key={item.title}>
                <details className="group/f rounded-2xl bg-canvas ring-1 ring-border transition dur-base ease-brand open:shadow-lg open:shadow-primary/10 open:ring-primary/30 hover:ring-border-strong">
                  <summary className="flex cursor-pointer list-none items-center gap-5 p-6 [&::-webkit-details-marker]:hidden sm:p-7">
                    <span
                      aria-hidden
                      className="disc-blue grid size-11 shrink-0 place-items-center rounded-pill text-white"
                    >
                      <Icon className="size-4.5" strokeWidth={1.9} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-medium text-ink">{item.title}</span>
                      <span className="mt-1 block text-sm text-ink-muted">{item.headline}</span>
                    </span>
                    <span
                      aria-hidden
                      className="grid size-8 shrink-0 place-items-center rounded-pill ring-1 ring-border transition dur-base ease-brand group-open/f:rotate-45 group-open/f:bg-primary group-open/f:text-white group-open/f:ring-primary"
                    >
                      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor">
                        <path d="M8 2v12M2 8h12" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <div className="space-y-3.5 px-6 pb-6 sm:px-7 sm:pb-7 sm:pl-[5.75rem]">
                    {item.body.map((para) => (
                      <p key={para.slice(0, 24)} className="max-w-[62ch] text-sm text-ink-muted">
                        {para}
                      </p>
                    ))}
                  </div>
                </details>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </Section>
  );
}

/* ================================ 05 — APP ============================== */

/**
 * The mobile block.
 *
 * Their document puts a photograph of a phone here with the app's screen inside
 * it. We do not have that asset, and drawing a plausible interface would be
 * presenting a mock-up as the product — so the device is built out of the app's
 * OWN words: "Powering operations for…" and its three tiles, as real markup in a
 * real device-shaped frame. Honest, sharp at any resolution, nothing to ship.
 */
function App() {
  const { app } = BERG;
  return (
    <Section ground="ink">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-center lg:gap-20">
        <div>
          <Eyebrow tone="panel">{app.eyebrow}</Eyebrow>
          <Reveal>
            <h2 className="mt-5 max-w-[18ch] text-3xl leading-[1.08] font-light tracking-[-0.03em] text-balance text-on-panel">
              {app.titleLead}
              <span className="text-accent">{app.titleAccent}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 max-w-[52ch] text-base text-on-panel/70">{app.body}</p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-4 max-w-[52ch] text-base text-on-panel/70">{app.bodySecond}</p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9">
              <CtaPill href={app.cta.href} tone="light" external>
                {app.cta.label}
              </CtaPill>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="group/d mx-auto w-full max-w-[17rem] rounded-[2rem] bg-white/8 p-2.5 ring-1 ring-white/15 transition-transform duration-700 ease-brand hover:-translate-y-2">
            <div className="rounded-[1.6rem] bg-canvas p-5">
              <span aria-hidden className="mx-auto block h-1 w-10 rounded-pill bg-surface-3" />
              <p className="mt-5 flex items-center gap-2 font-mono text-[0.625rem] tracking-caps text-ink-subtle uppercase">
                <Smartphone aria-hidden className="size-3.5" strokeWidth={1.8} />
                {app.panelLabel}
              </p>
              <ul className="mt-4 space-y-2.5">
                {app.tiles.map((tile, i) => (
                  <li
                    key={tile}
                    className="flex items-center gap-3 rounded-md bg-surface px-3.5 py-3 text-sm font-medium text-ink transition-colors duration-500 ease-brand group-hover/d:bg-surface-2"
                  >
                    <span
                      aria-hidden
                      className={`size-2 shrink-0 rounded-pill ${i === 1 ? "bg-accent" : "bg-primary"}`}
                    />
                    {tile}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-ink-muted">{app.panelNote}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ============================== 06 — PRICING ============================ */

const PRICE_ICONS = { org: Building2, firm: Briefcase, person: UserRound } as const;

/**
 * Three tiers. The subscription tier is the only one that carries the amber rule
 * and a deeper ring — the site's existing accent discipline doing the
 * highlighting, rather than a "most popular" ribbon nobody has claimed.
 */
function Pricing() {
  const { pricing } = BERG;
  return (
    <Section ground="canvas" id="pricing">
      <SectionHead
        align="start"
        eyebrow={pricing.eyebrow}
        title={pricing.title}
        body={pricing.body}
        titleMax="max-w-[18ch]"
      />

      {/* From lg the three cards share seven rows (bar, icon, name, price,
          body, benefits, button): each card is a subgrid over them, so every
          divider, list and button sits on one line across the three, whatever
          length any one card's copy runs to. */}
      <RevealGroup as="ul" className="mt-12 grid gap-5 lg:grid-cols-3 lg:gap-y-0">
        {pricing.items.map((tier) => {
          const Icon = PRICE_ICONS[tier.icon as keyof typeof PRICE_ICONS];
          const featured = tier.featured;
          return (
            <RevealItem
              as="li"
              key={tier.title}
              className="lg:row-span-7 lg:grid lg:grid-rows-subgrid"
            >
              <div
                className={`group/t flex h-full flex-col rounded-2xl bg-canvas p-7 ring-1 transition dur-base ease-brand hover:-translate-y-1 hover:shadow-xl sm:p-8 lg:row-span-7 lg:grid lg:grid-rows-subgrid lg:gap-y-0 ${
                  featured
                    ? "ring-accent/45 hover:shadow-accent/15 hover:ring-accent/70"
                    : "ring-border hover:shadow-primary/10 hover:ring-primary/35"
                }`}
              >
                <span
                  aria-hidden
                  className={`h-1 w-10 rounded-pill ${featured ? "grad-cta" : "grad-primary"}`}
                />
                {/* The plan's label rides the icon row, so it never adds a
                    line under one price that the other two do not have. */}
                <div className="mt-6 flex items-center justify-between gap-3">
                  <span
                    aria-hidden
                    className="grid size-11 place-items-center rounded-pill bg-primary/10 text-primary transition-colors dur-base ease-brand group-hover/t:bg-primary group-hover/t:text-white"
                  >
                    <Icon className="size-4.5" strokeWidth={1.9} />
                  </span>
                  {"label" in tier && tier.label ? (
                    <span className="rounded-pill bg-primary/10 px-3 py-1.5 font-mono text-[0.6875rem] tracking-caps text-primary uppercase">
                      {tier.label}
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-5 text-base font-medium text-ink">{tier.title}</h3>
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl leading-none font-light tracking-[-0.03em] text-primary tabular-nums">
                    {tier.price}
                  </span>
                  {"unit" in tier && tier.unit ? (
                    <span className="text-sm text-ink-subtle">{tier.unit}</span>
                  ) : null}
                </p>
                <p className="mt-5 text-sm text-ink-muted">{tier.body}</p>

                <ul className="mt-6 space-y-3 border-t border-border pt-6">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3 text-sm text-ink">
                      <span
                        aria-hidden
                        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-pill ${
                          featured ? "bg-accent text-accent-ink" : "bg-primary/12 text-primary"
                        }`}
                      >
                        <Check className="size-3" strokeWidth={2.6} />
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-1">
                  <CtaPill href={BERG.cta.href} external>
                    {tier.cta}
                  </CtaPill>
                </div>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>

      <Reveal delay={0.1}>
        <p className="mt-10 max-w-[70ch] text-sm text-ink-subtle">{pricing.note}</p>
      </Reveal>
    </Section>
  );
}

/* ================================ 07 — FAQ ============================== */

function Faq() {
  const { faq } = BERG;
  return (
    <Section ground="surface">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start lg:gap-16">
        <SectionHead
          align="start"
          eyebrow={faq.eyebrow}
          title={faq.title}
          body={faq.body}
          titleMax="max-w-[14ch]"
        />

        <RevealGroup as="ul" className="border-t border-border" stagger={0.04}>
          {faq.items.map((item) => (
            <RevealItem as="li" key={item.q} className="border-b border-border">
              <details className="group/q">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 text-base font-medium text-ink transition-colors dur-fast ease-brand hover:text-primary [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0">{item.q}</span>
                  <span
                    aria-hidden
                    className="grid size-8 shrink-0 place-items-center rounded-pill ring-1 ring-border transition dur-base ease-brand group-open/q:rotate-45 group-open/q:bg-primary group-open/q:text-white group-open/q:ring-primary"
                  >
                    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor">
                      <path d="M8 2v12M2 8h12" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <div className="max-w-[62ch] space-y-3 pr-12 pb-6">
                  {item.a.map((para) => (
                    <p key={para.slice(0, 24)} className="text-sm text-ink-muted">
                      {para}
                    </p>
                  ))}
                  {"list" in item && item.list ? (
                    <ul className="space-y-2.5 pt-1">
                      {item.list.map((line) => (
                        <li key={line} className="flex gap-3 text-sm text-ink-muted">
                          <span aria-hidden className="mt-[0.5rem] h-px w-3 shrink-0 bg-primary" />
                          <span className="min-w-0">{line}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </details>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

/* ============================== 08 — CONTACT ============================ */

/**
 * Berg's own contact details — not Hazeberg's. The support address, the phone
 * and the office on the Berg site are all different from the consulting ones,
 * and that is deliberate on their part: a question about the platform belongs in
 * the platform's queue. The strip below sends anyone who wanted the consultancy
 * to the right door instead.
 */
function Contact() {
  const { contact } = BERG;
  const lines = [
    { icon: Mail, value: contact.email, href: `mailto:${contact.email}` },
    { icon: Phone, value: contact.phone, href: contact.phoneHref },
  ];
  return (
    <Section ground="canvas" id="enquiry">
      <div className="map-ground rounded-2xl p-8 ring-1 ring-border sm:p-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
          <div>
            <Eyebrow>{contact.eyebrow}</Eyebrow>
            <Reveal>
              <h2 className="mt-5 max-w-[16ch] text-3xl leading-[1.08] font-light tracking-[-0.03em] text-balance text-ink">
                {contact.titleLead}
                <span className="text-primary">{contact.titleAccent}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mt-5 max-w-[46ch] text-base text-ink-muted">{contact.body}</p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-9">
                <CtaPill href={contact.cta.href} external>
                  {contact.cta.label}
                </CtaPill>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <ul className="space-y-5 lg:border-l lg:border-border lg:pl-10">
              {lines.map((line) => (
                <li key={line.value}>
                  <a
                    href={line.href}
                    className="group/c flex min-h-11 items-center gap-3.5 text-sm break-all text-ink transition-colors dur-fast ease-brand hover:text-primary"
                  >
                    <line.icon
                      aria-hidden
                      className="size-4 shrink-0 text-ink-subtle transition-colors dur-fast ease-brand group-hover/c:text-primary"
                      strokeWidth={1.8}
                    />
                    {line.value}
                  </a>
                </li>
              ))}
              <li className="flex gap-3.5 pt-1">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-subtle" strokeWidth={1.8} />
                <address className="text-sm leading-relaxed text-ink-muted not-italic">
                  {contact.office.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* ================================= PAGE ================================= */

export default function Page() {
  return (
    <>
      <BergHero />
      <Roles />
      <HowItWorks />
      <Platform />
      <App />
      <Pricing />
      <Faq />
      <Contact />
      <CrossLink {...BERG.cross} />
    </>
  );
}
