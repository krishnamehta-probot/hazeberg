import Image from "next/image";
import Link from "next/link";
import { Award, ShieldCheck, Stamp, UserRound } from "lucide-react";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CrossLink } from "@/components/page/cross-link";
import { PageHero } from "@/components/page/page-hero";
import { Counter } from "@/components/ui/counter";
import { CtaPill } from "@/components/ui/cta-pill";
import { Eyebrow, Section, SectionHead } from "@/components/ui/section";
import { ABOUT_PAGE } from "@/lib/about-content";

export const metadata = {
  title: "About",
  description:
    "Hazeberg — a Workday-only consultancy with 12+ years of platform experience and delivery centers in Coimbatore and Penang. Our story, leadership, team, certifications and recognition.",
};

/**
 * About — DRAFT.
 *
 * Six sections, exactly the six `SITEMAP.md` specifies, on the anchors
 * `navigation.ts` already links to. The nav's anchors win over the sitemap's
 * shorter ones because those links ship in the header today; the sitemap is
 * corrected to match.
 *
 * **Roughly half of this page is placeholder**, and every placeholder is marked
 * in `lib/about-content.ts` with what is missing and why it was not invented.
 * The short version: the founding story, the founder's biography and portrait,
 * the Life-at-Hazeberg copy, every award, and the certificate paperwork. What is
 * real: the retired "Why choose Hazeberg" block (the client's own words, parked
 * for this page when it came off the home page), the founder's name, the four
 * delivery figures, and the two certifications.
 *
 * The sections that have nothing render a MARKED EMPTY SLOT rather than filler.
 * A dashed frame that says "Award or recognition" is useful to the team filling
 * it in; three invented awards are a liability, and a section quietly deleted
 * because it had no content is how a gap survives to launch.
 *
 * Section order follows the nav's reading order — column one then column two —
 * which also happens to be the order the story wants: who started it, who leads
 * it, who does the work, what it is like inside, what is certified, what has
 * been won.
 */

/* ============================== 01 — OUR STORY ========================== */

function Story() {
  const { story } = ABOUT_PAGE;
  return (
    <Section ground="surface" id="our-story">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start lg:gap-16">
        <div>
          <SectionHead
            align="start"
            eyebrow={story.eyebrow}
            title={story.title}
            body={story.body}
            titleMax="max-w-[20ch]"
          />
          <Reveal delay={0.06}>
            <p className="mt-6 max-w-[62ch] text-sm text-ink-muted">{story.origin}</p>
          </Reveal>

          <RevealGroup as="ol" className="mt-12 space-y-px" stagger={0.07}>
            {story.points.map((point) => (
              <RevealItem as="li" key={point.n}>
                {/* Rows on one rule rather than three cards. The three beats are
                    one argument in sequence; cards would make them three
                    alternatives to choose between. */}
                <div className="group/p grid gap-4 border-t border-border py-7 transition-colors dur-base ease-brand hover:border-primary/40 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-8 last:border-b">
                  <div>
                    <p className="font-mono text-xs tracking-caps text-ink-subtle">{point.n}</p>
                    <span
                      aria-hidden
                      className="grad-primary mt-3 block h-1 w-6 rounded-pill transition-[width] dur-slow ease-brand group-hover/p:w-12"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[0.6875rem] tracking-caps text-primary uppercase">
                      {point.kicker}
                    </p>
                    <h3 className="mt-3 max-w-[30ch] text-xl leading-snug font-light tracking-[-0.02em] text-balance text-ink">
                      {point.title}
                    </h3>
                    <p className="mt-3 max-w-[58ch] text-sm text-ink-muted">{point.body}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* The quote rides down beside the three beats. `sticky` inside a GRID —
            grid gaps are not margins, and a sticky element is clamped inside its
            containing block by its margin box, which is what broke the Berg deck
            when the gap was `space-y`. */}
        <Reveal delay={0.1}>
          <figure className="grad-ink grain relative overflow-hidden rounded-2xl p-8 text-on-panel lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
            <span aria-hidden className="grad-primary block h-1 w-12 rounded-pill" />
            <blockquote className="mt-7 text-xl leading-snug font-light tracking-[-0.02em] text-balance">
              “{story.quote.text}”
            </blockquote>
            <figcaption className="mt-7 border-t border-white/12 pt-6">
              <p className="text-sm font-medium">{story.quote.name}</p>
              <p className="mt-1 text-sm text-on-panel/65">{story.quote.role}</p>
            </figcaption>
            <div className="mt-8 border-t border-white/12 pt-6">
              {/* Amber carries a word here, which is legal on this ground and
                  nowhere else: 11.97:1 on the ink panel, 1.65:1 on white. */}
              <p className="text-2xl font-light tracking-[-0.02em] text-accent">
                {story.quote.stat}
              </p>
              <p className="mt-2 font-mono text-[0.6875rem] tracking-caps text-on-panel/55 uppercase">
                {story.quote.statLabel}
              </p>
            </div>
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}

/* ============================== 02 — LEADERSHIP ========================= */

function Leadership() {
  const { leadership } = ABOUT_PAGE;
  return (
    <Section ground="canvas" id="leadership">
      <SectionHead
        align="start"
        eyebrow={leadership.eyebrow}
        title={leadership.title}
        body={leadership.body}
        titleMax="max-w-[18ch]"
      />

      <RevealGroup as="ul" className="mt-12 grid gap-5 lg:grid-cols-2" stagger={0.08}>
        {leadership.people.map((person) => (
          <RevealItem as="li" key={person.name}>
            <div className="grid gap-7 rounded-2xl bg-surface p-7 ring-1 ring-border sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:p-8">
              {/* The portrait slot. Marked, not filled: a founder's photograph is
                  the one image on this site that cannot be sourced or generated,
                  only taken. */}
              {person.portrait ? (
                <Image
                  src={person.portrait}
                  alt={person.name}
                  width={440}
                  height={560}
                  className="aspect-[4/5] w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border-strong bg-canvas text-center">
                  <UserRound aria-hidden className="size-7 text-ink-subtle" strokeWidth={1.4} />
                  <p className="max-w-[12ch] font-mono text-[0.625rem] tracking-caps text-ink-subtle uppercase">
                    Portrait to supply
                  </p>
                </div>
              )}

              <div className="min-w-0">
                <h3 className="text-2xl leading-none font-light tracking-[-0.03em] text-ink">
                  {person.name}
                </h3>
                <p className="mt-2.5 font-mono text-[0.6875rem] tracking-caps text-primary uppercase">
                  {person.role}
                </p>
                <p className="mt-5 max-w-[46ch] text-sm text-ink-muted">{person.bio}</p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/* ============================== 03 — OUR TEAM =========================== */

function Team() {
  const { team } = ABOUT_PAGE;
  return (
    <Section ground="ink" id="our-team">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start lg:gap-20">
        <div>
          <Eyebrow tone="panel">{team.eyebrow}</Eyebrow>
          <Reveal>
            <h2 className="mt-5 max-w-[16ch] text-3xl leading-[1.08] font-light tracking-[-0.03em] text-balance text-on-panel">
              {team.title}
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-5 max-w-[46ch] text-base text-on-panel/70">{team.body}</p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-[46ch] border-t border-white/12 pt-6 text-sm text-on-panel/55">
              {team.rosterNote}
            </p>
          </Reveal>
        </div>

        {/* The four figures are the only part of this section that is real, so
            they carry it. All four are already published on the home page. */}
        <RevealGroup as="ul" className="grid gap-px bg-white/10 sm:grid-cols-2" stagger={0.07}>
          {team.facts.map((fact) => (
            <RevealItem as="li" key={fact.label} className="grad-ink p-7 sm:p-8">
              <p className="text-4xl leading-none font-light tracking-[-0.03em] text-on-panel tabular-nums">
                <Counter value={fact.value} suffix={fact.suffix} />
              </p>
              <p className="mt-4 max-w-[22ch] text-sm text-on-panel/65">{fact.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

/* ========================== 04 — LIFE AT HAZEBERG ======================= */

function Life() {
  const { life } = ABOUT_PAGE;
  return (
    <Section ground="surface" id="life-at-hazeberg">
      <SectionHead
        align="start"
        eyebrow={life.eyebrow}
        title={life.title}
        body={life.body}
        titleMax="max-w-[20ch]"
      />

      <RevealGroup as="ul" className="mt-12 grid gap-5 lg:grid-cols-3" stagger={0.08}>
        {life.points.map((point) => (
          <RevealItem as="li" key={point.n}>
            <div className="group/l flex h-full flex-col rounded-2xl bg-canvas p-7 ring-1 ring-border transition dur-base ease-brand hover:shadow-lg hover:shadow-primary/10 hover:ring-primary/25 sm:p-8">
              <span
                aria-hidden
                className="grad-primary h-1 w-10 rounded-pill transition-[width] dur-slow ease-brand group-hover/l:w-16"
              />
              <p className="mt-6 font-mono text-xs tracking-caps text-ink-subtle">{point.n}</p>
              <h3 className="mt-3 text-lg leading-snug font-medium text-balance text-ink">
                {point.title}
              </h3>
              <p className="mt-3 text-sm text-ink-muted">{point.body}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal delay={0.1}>
        <div className="mt-10">
          <CtaPill href={life.cta.href}>{life.cta.label}</CtaPill>
        </div>
      </Reveal>
    </Section>
  );
}

/* ========================== 05 — CERTIFICATIONS ========================= */

const CERT_ICONS = { iso: ShieldCheck, dpiit: Stamp } as const;

function Certifications() {
  const { certifications } = ABOUT_PAGE;
  return (
    <Section ground="canvas" id="certifications">
      <SectionHead
        align="start"
        eyebrow={certifications.eyebrow}
        title={certifications.title}
        body={certifications.body}
        titleMax="max-w-[16ch]"
      />

      <RevealGroup as="ul" className="mt-12 grid gap-5 lg:grid-cols-2" stagger={0.08}>
        {certifications.items.map((item) => {
          const Icon = CERT_ICONS[item.key as keyof typeof CERT_ICONS];
          return (
            <RevealItem as="li" key={item.key}>
              <div className="flex h-full flex-col rounded-2xl bg-surface p-7 ring-1 ring-border sm:p-8">
                <div className="flex items-start justify-between gap-6">
                  <span
                    aria-hidden
                    className="disc-blue grid size-11 shrink-0 place-items-center rounded-pill text-white"
                  >
                    <Icon className="size-4.5" strokeWidth={1.9} />
                  </span>
                  {/* The client's own mark, on its own white card so it is not
                      sitting on a tint it was never drawn for. */}
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={`${item.name} certified`}
                      width={346}
                      height={145}
                      sizes="120px"
                      className="h-10 w-auto rounded-sm bg-canvas"
                    />
                  ) : null}
                </div>

                <h3 className="mt-7 text-xl leading-snug font-light tracking-[-0.02em] text-balance text-ink">
                  {item.name}
                </h3>
                <p className="mt-2.5 font-mono text-[0.6875rem] tracking-caps text-primary uppercase">
                  {item.headline}
                </p>
                <p className="mt-5 max-w-[48ch] text-sm text-ink-muted">{item.body}</p>
                <p className="mt-auto border-t border-border pt-5 text-xs text-ink-subtle">
                  {item.detail}
                </p>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}

/* ============================== 06 — REWARDS ============================ */

function Rewards() {
  const { rewards } = ABOUT_PAGE;
  return (
    <Section ground="surface" id="rewards">
      <SectionHead
        align="start"
        eyebrow={rewards.eyebrow}
        title={rewards.title}
        body={rewards.body}
        titleMax="max-w-[20ch]"
      />

      {/* Empty slots, marked. Three invented awards would be a liability and a
          quietly deleted section is how a gap survives to launch. */}
      <RevealGroup as="ul" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
        {Array.from({ length: rewards.slots }, (_, i) => (
          <RevealItem as="li" key={i}>
            <div className="flex min-h-[13rem] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border-strong bg-canvas/50 p-8 text-center">
              <Award aria-hidden className="size-6 text-ink-subtle" strokeWidth={1.4} />
              <p className="font-mono text-[0.625rem] tracking-caps text-ink-subtle uppercase">
                {rewards.slotNote}
              </p>
              <p className="max-w-[24ch] text-xs text-ink-subtle">
                Name, the body that gave it, the year, and one line on what it was for.
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal delay={0.1}>
        <p className="mt-8 max-w-[62ch] text-sm text-ink-subtle">
          Nothing has been supplied for this section. Send the list and it fills in —{" "}
          <Link href="/contact" className="text-primary underline-offset-4 hover:underline">
            get in touch
          </Link>
          .
        </p>
      </Reveal>
    </Section>
  );
}

/* ================================= PAGE ================================= */

export default function Page() {
  const { eyebrow, titleLead, titleAccent, lead, leadSecond, meta, cross } = ABOUT_PAGE;
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
      />
      <Story />
      <Leadership />
      <Team />
      <Life />
      <Certifications />
      <Rewards />
      <CrossLink {...cross} />
    </>
  );
}
