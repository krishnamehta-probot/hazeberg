import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChartNetwork,
  Database,
  Info,
  MessagesSquare,
  UserRound,
  UserSearch,
  type LucideIcon,
} from "lucide-react";

import { HazebergBirds } from "@/components/brand/hazeberg-wordmark";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CtaPill } from "@/components/ui/cta-pill";
import { Eyebrow, Section } from "@/components/ui/section";
import type { WHAT_WE_DO } from "@/lib/what-we-do-content";

type Data = (typeof WHAT_WE_DO)["ai"];
type Node = Data["bridge"][number];
type PersonKey = Data["people"]["items"][number]["key"];

const PERSON_ICON: Record<PersonKey, LucideIcon> = {
  employees: UserRound,
  managers: UserSearch,
  talent: ChartNetwork,
  organization: Building2,
};

/* The bridge's two ends: the conversation, and the record it reaches. The
   middle wears Hazeberg's own mark. */
const END_ICON: Record<Exclude<Node["key"], "hazeberg">, LucideIcon> = {
  ai: MessagesSquare,
  workday: Database,
};

const SUBHEAD = "text-2xl font-light tracking-[-0.025em] text-balance text-ink";

/**
 * AI in the flow of work — the client's use case, between the capabilities
 * and How we work.
 *
 * **The tagline is the picture.** "AI at the front. Workday at the core.
 * Hazeberg connects the two." is a diagram written as a sentence, so the
 * section draws it: three discs on one ink panel, Hazeberg in the middle,
 * and two lanes running end to end under it — the request out in blue, the
 * answer back in amber (`.ai-lane` in globals.css). Neither gets from one end
 * to the other without passing through the middle disc, which is the claim.
 * The drawing is decoration; the tagline above it is the text.
 *
 * Then the rest of the document in its own order, all of it on the white
 * ground: four audiences as cards, the four figures with the document's own
 * caveat directly under them (they are targets, and they never appear without
 * saying so), and a close with the document's two links.
 *
 * Nothing here pins. How we work, straight after, holds the screen for nearly
 * three of them; a second pinned scene in front of it would be the same
 * device twice.
 *
 * White (`canvas`) between the capabilities' `surface` and How we work's
 * `void`, so no two neighbours share a ground.
 */
export function AiFlow({ data }: { data: Data }) {
  const { people, value, closing } = data;
  return (
    <Section ground="canvas" id={data.id}>
      {/* Title left, intro right, on one baseline — the head "Wherever you
          are" and What we cover use. */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <Reveal>
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <h2 className="mt-5 max-w-[22ch] text-3xl leading-[1.08] font-light tracking-[-0.03em] text-balance text-ink">
            {data.titleLead} <span className="text-primary">{data.titleRest}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="max-w-[60ch] text-base text-ink-muted">{data.intro}</p>
        </Reveal>
      </div>

      <Bridge data={data} />

      {/* -- the four audiences -------------------------------------------- */}
      <div className="mt-16 lg:mt-24">
        <Reveal>
          <h3 className={SUBHEAD}>{people.title}</h3>
        </Reveal>
        <RevealGroup as="ul" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {people.items.map((p) => {
            const Icon = PERSON_ICON[p.key];
            return (
              <RevealItem as="li" key={p.key}>
                {/* The lift is on the card, not the item: the item's transform
                    belongs to the reveal. */}
                <article className="group/card flex h-full flex-col rounded-lg bg-surface p-6 ring-1 ring-transparent transition dur-base ease-brand hover:-translate-y-0.5 hover:bg-canvas hover:shadow-lg hover:shadow-primary/10 hover:ring-primary/35 sm:p-7">
                  <span
                    aria-hidden
                    className="grid size-11 place-items-center rounded-pill bg-primary/10 text-primary transition-colors dur-base ease-brand group-hover/card:bg-primary group-hover/card:text-white"
                  >
                    <Icon className="size-4.5" strokeWidth={1.9} />
                  </span>
                  <p className="mt-6 font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
                    {p.audience}
                  </p>
                  <h4 className="mt-2 text-lg leading-snug font-medium text-balance text-ink">
                    {p.title}
                  </h4>
                  <p className="mt-2.5 text-sm text-ink-muted">{p.body}</p>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>

      {/* -- the value at a glance ----------------------------------------- */}
      <div className="mt-16 lg:mt-24">
        <Reveal>
          <h3 className={SUBHEAD}>{value.title}</h3>
        </Reveal>
        {/* Blue figures, the way the home page sets its own: #1972B9 is
            5.06:1 on white, and a figure is read before anything round it. */}
        <RevealGroup as="ul" className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {value.items.map((v) => (
            <RevealItem as="li" key={v.label}>
              <span aria-hidden className="grad-primary block h-1 w-10 rounded-pill" />
              <p className="mt-6 text-4xl leading-none font-light tracking-[-0.04em] whitespace-nowrap text-primary">
                {v.figure}
              </p>
              <p className="mt-4 text-base font-medium text-ink">{v.label}</p>
              <p className="mt-1.5 max-w-[34ch] text-sm text-ink-muted">{v.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal delay={0.1}>
          <p className="mt-10 flex items-start gap-2 text-xs text-ink-subtle">
            <Info aria-hidden className="mt-px size-3.5 shrink-0" strokeWidth={2} />
            {value.note}
          </p>
        </Reveal>
      </div>

      {/* -- the close ----------------------------------------------------- */}
      <div className="mt-16 grid gap-10 border-t border-border pt-12 lg:mt-24 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16 lg:pt-16">
        <Reveal>
          <h3 className={`max-w-[24ch] ${SUBHEAD}`}>
            <span className="block">{closing.titleLead}</span>{" "}
            <span className="block text-primary">{closing.titleRest}</span>
          </h3>
          <p className="mt-5 max-w-[56ch] text-base text-ink-muted">{closing.body}</p>
        </Reveal>
        <Reveal delay={0.08} className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <CtaPill href={closing.cta.href}>{closing.cta.label}</CtaPill>
          <Link
            href={closing.secondary.href}
            className="group/s inline-flex min-h-11 items-center gap-2.5 font-mono text-xs tracking-caps text-ink uppercase transition-colors dur-base ease-brand hover:text-primary"
          >
            {closing.secondary.label}
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform dur-base ease-brand group-hover/s:translate-x-0.5"
              strokeWidth={2}
            />
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}

/**
 * The tagline, and the tagline drawn.
 *
 * Wide, the three discs sit in thirds and the lanes run from the first disc's
 * centre to the last's — 1/6 to 5/6 of the row — level with the discs'
 * centres. Narrow, the discs stack down the left with the names beside them,
 * and the lanes run down through their centres instead. Either way the discs
 * are opaque and drawn over the lanes, so the light goes under each one.
 */
function Bridge({ data }: { data: Data }) {
  const [first, second, last] = data.tagline;
  return (
    <Reveal className="mt-12 lg:mt-16">
      <div className="grad-ink grain relative overflow-hidden rounded-2xl px-6 py-10 text-on-panel sm:px-10 sm:py-12 lg:px-14 lg:py-16">
        {/* The panel's ground is dark, which is the one place amber may be
            type (11.97:1). */}
        <p className="relative max-w-[34ch] text-2xl leading-[1.15] font-light tracking-[-0.025em] text-balance sm:text-3xl lg:mx-auto lg:text-center">
          {first} {second} <span className="text-accent">{last}</span>
        </p>

        <div aria-hidden className="relative mt-10 lg:mx-auto lg:mt-14 lg:max-w-4xl">
          {/* Disc centres: 2rem in from the edge narrow (size-16), 2.5rem
              down wide (size-20). */}
          <div className="absolute top-8 bottom-8 left-8 flex -translate-x-1/2 gap-2 lg:top-10 lg:right-[16.667%] lg:bottom-auto lg:left-[16.667%] lg:translate-x-0 lg:-translate-y-1/2 lg:flex-col">
            <span className="ai-lane w-[3px] lg:h-[3px] lg:w-auto" />
            <span className="ai-lane ai-lane-back w-[3px] lg:h-[3px] lg:w-auto" />
          </div>
          <div className="relative grid gap-8 lg:grid-cols-3 lg:gap-0">
            {data.bridge.map((node) => (
              <BridgeNode key={node.key} node={node} />
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function BridgeNode({ node }: { node: Node }) {
  const hub = node.key === "hazeberg";
  const Icon = node.key === "hazeberg" ? null : END_ICON[node.key];
  return (
    <div className="flex items-center gap-5 lg:flex-col lg:gap-0 lg:text-center">
      <span
        className={`grid size-16 shrink-0 place-items-center rounded-pill lg:size-20 ${
          hub ? "ai-hub disc-blue text-white" : "bg-void text-on-panel ring-1 ring-white/15"
        }`}
      >
        {Icon ? (
          <Icon className="size-6 lg:size-7" strokeWidth={1.6} />
        ) : (
          <HazebergBirds className="w-10 lg:w-12" />
        )}
      </span>
      <span className="lg:mt-5">
        <span className="block text-xl leading-tight font-light tracking-[-0.02em]">{node.name}</span>
        <span className="mt-1.5 block font-mono text-[0.6875rem] tracking-caps text-on-panel/60 uppercase">
          {node.role}
        </span>
      </span>
    </div>
  );
}
