import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, FileText } from "lucide-react";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CrossLink } from "@/components/page/cross-link";
import { PageHero } from "@/components/page/page-hero";
import { CtaPill } from "@/components/ui/cta-pill";
import { Eyebrow, Section, SectionHead } from "@/components/ui/section";
import { SERVICES } from "@/lib/home-content";
import { SERVICE_PAGES, SERVICE_SCAFFOLD, type ServicePage } from "@/lib/service-content";

/**
 * The module pages — one template, six routes.
 *
 * `SITEMAP.md` is explicit: "All six share one template and one CMS document
 * type — six documents, not six hand-built pages." So this file is the template
 * and `lib/service-content.ts` is the document type, standing in for Sanity
 * until Sanity exists. Adding the seventh module later costs a content entry,
 * not a build.
 *
 * **Only `workday-hcm` is written.** The other five render their live opener —
 * the client's own copy, already on the home page — and then a MARKED SCAFFOLD
 * saying so, with a link to the written one. That is the honest option and it is
 * also the useful one: five pages of the HCM copy with the nouns swapped is how
 * a shared template quietly becomes filler, and a 404 would break six links that
 * ship in the header today.
 *
 * The routes come from `SERVICES.items`, not from this file's own keys, so the
 * nav and the router cannot drift apart. `Workday AMS` is in `SERVICES.items`
 * and deliberately points at `/what-we-do#workday-ams` instead — the client
 * confirmed six module pages, and AMS is an engagement model. The filter below
 * is what keeps it out of here.
 */

const ROUTED = SERVICES.items.filter((s) => s.href.startsWith("/services/"));

const slugOf = (href: string) => href.replace("/services/", "");

export function generateStaticParams() {
  return ROUTED.map((s) => ({ slug: slugOf(s.href) }));
}

export async function generateMetadata(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const page = SERVICE_PAGES[slug];
  if (!page) return { title: "Service" };
  return { title: page.label, description: page.lead };
}

/* ------------------------------ sections ------------------------------- */

function Capabilities({ data }: { data: NonNullable<ServicePage["capabilities"]> }) {
  return (
    <Section ground="surface" id="covers">
      <SectionHead
        align="start"
        eyebrow={data.eyebrow}
        title={data.title}
        body={data.body}
        titleMax="max-w-[20ch]"
      />
      {/* A hairline grid rather than six floating cards: these are areas of one
          module, not six products, and the shared rules say so. */}
      <RevealGroup
        as="ul"
        className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.06}
      >
        {data.items.map((item) => (
          <RevealItem as="li" key={item.title} className="group/c bg-canvas p-7 sm:p-8">
            <span
              aria-hidden
              className="grad-primary block h-1 w-8 rounded-pill transition-[width] dur-slow ease-brand group-hover/c:w-14"
            />
            <h3 className="mt-6 text-lg leading-snug font-medium text-ink">{item.title}</h3>
            <p className="mt-3 text-sm text-ink-muted">{item.body}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

function Engage({ data }: { data: NonNullable<ServicePage["engage"]> }) {
  return (
    <Section ground="canvas" id="engage">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start lg:gap-16">
        <SectionHead
          align="start"
          eyebrow={data.eyebrow}
          title={data.title}
          body={data.body}
          titleMax="max-w-[16ch]"
        />
        <RevealGroup as="ol" className="space-y-px" stagger={0.08}>
          {data.items.map((item) => (
            <RevealItem as="li" key={item.n}>
              <div className="group/e grid gap-4 border-t border-border py-7 transition-colors dur-base ease-brand hover:border-primary/40 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-8 last:border-b">
                <div>
                  <p className="font-mono text-xs tracking-caps text-ink-subtle">{item.n}</p>
                  <span
                    aria-hidden
                    className="grad-primary mt-3 block h-1 w-6 rounded-pill transition-[width] dur-slow ease-brand group-hover/e:w-12"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl leading-snug font-light tracking-[-0.02em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[56ch] text-sm text-ink-muted">{item.body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

function Proof({ data }: { data: NonNullable<ServicePage["proof"]> }) {
  return (
    <Section ground="ink">
      <Eyebrow tone="panel">{data.eyebrow}</Eyebrow>
      <Reveal>
        <h2 className="mt-5 max-w-[20ch] text-3xl leading-[1.08] font-light tracking-[-0.03em] text-balance text-on-panel">
          {data.title}
        </h2>
      </Reveal>
      <RevealGroup
        as="ul"
        className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4"
        stagger={0.06}
      >
        {data.items.map((item) => (
          <RevealItem as="li" key={item.label} className="grad-ink p-7 sm:p-8">
            <p className="text-4xl leading-none font-light tracking-[-0.03em] text-on-panel tabular-nums">
              {item.value}
            </p>
            <p className="mt-4 max-w-[22ch] text-sm text-on-panel/65">{item.label}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

function Related({ data }: { data: NonNullable<ServicePage["related"]> }) {
  return (
    <Section ground="surface">
      <SectionHead
        align="start"
        eyebrow="Engagement models"
        title="How this module gets delivered."
        body="A module answers which part of Workday. An engagement model answers what kind of work. These are the ones that apply here."
        titleMax="max-w-[18ch]"
      />
      <RevealGroup as="ul" className="mt-12 grid gap-5 lg:grid-cols-3" stagger={0.07}>
        {data.map((item) => (
          <RevealItem as="li" key={item.href}>
            <Link
              href={item.href}
              className="group/r flex h-full flex-col rounded-2xl bg-canvas p-7 ring-1 ring-border transition dur-base ease-brand hover:shadow-lg hover:shadow-primary/10 hover:ring-primary/25 sm:p-8"
            >
              <span className="flex items-start justify-between gap-5">
                <span className="text-lg leading-snug font-medium text-balance text-ink">
                  {item.label}
                </span>
                <span
                  aria-hidden
                  className="grid size-8 shrink-0 place-items-center rounded-pill ring-1 ring-primary/30 text-primary transition dur-base ease-brand group-hover/r:bg-primary/10"
                >
                  <ArrowUpRight className="size-4" strokeWidth={2} />
                </span>
              </span>
              <span className="mt-3 text-sm text-ink-muted">{item.body}</span>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/**
 * The scaffold, for the five modules whose page has not been written.
 *
 * Deliberately not disguised. A visitor gets the client's real opener and then a
 * clear statement that the rest is coming, with a link to the finished one — and
 * whoever is filling these in gets the list of what each page needs.
 */
function Scaffold({ page }: { page: ServicePage }) {
  return (
    <Section ground="surface">
      <div className="grid gap-10 rounded-2xl border border-dashed border-border-strong bg-canvas/60 p-8 sm:p-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
        <div>
          <p className="flex items-center gap-3 font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
            <FileText aria-hidden className="size-4" strokeWidth={1.8} />
            {SERVICE_SCAFFOLD.eyebrow}
          </p>
          <h2 className="mt-5 max-w-[20ch] text-2xl leading-tight font-light tracking-[-0.025em] text-balance text-ink">
            {SERVICE_SCAFFOLD.title}
          </h2>
          <p className="mt-5 max-w-[60ch] text-sm text-ink-muted">{SERVICE_SCAFFOLD.body}</p>
          <div className="mt-8">
            <CtaPill href={SERVICE_SCAFFOLD.reference.href}>
              {SERVICE_SCAFFOLD.reference.label}
            </CtaPill>
          </div>
        </div>

        <div className="border-t border-border pt-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          <p className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
            What {page.label} needs
          </p>
          <ul className="mt-4 space-y-3">
            {SERVICE_SCAFFOLD.needs.map((need) => (
              <li key={need} className="flex gap-3 text-sm text-ink-muted">
                <span aria-hidden className="mt-[0.5rem] h-px w-3 shrink-0 bg-primary" />
                <span className="min-w-0">{need}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------- page --------------------------------- */

export default async function ServicePage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  // The router's own list is the source of truth, so a content entry with a typo
  // cannot invent a route and a missing entry cannot silently 404 a live link.
  if (!ROUTED.some((s) => slugOf(s.href) === slug)) notFound();
  const page = SERVICE_PAGES[slug];
  if (!page) notFound();

  const written = Boolean(page.capabilities);

  return (
    <>
      <PageHero
        eyebrow="Workday services"
        title={
          <>
            {page.titleLead}
            <span className="text-accent">{page.titleAccent}</span>
          </>
        }
        lead={page.lead}
        leadSecond={page.leadSecond}
        meta={[...page.meta]}
      />

      {written ? (
        <>
          {page.capabilities ? <Capabilities data={page.capabilities} /> : null}
          {page.engage ? <Engage data={page.engage} /> : null}
          {page.proof ? <Proof data={page.proof} /> : null}
          {page.related ? <Related data={page.related} /> : null}
        </>
      ) : (
        <Scaffold page={page} />
      )}

      <CrossLink
        eyebrow="Start a conversation"
        title="Talk to us about your tenant"
        body={`Tell us where ${page.label} sits in your Workday estate and what you are trying to change.`}
        href="/contact"
      />
    </>
  );
}
