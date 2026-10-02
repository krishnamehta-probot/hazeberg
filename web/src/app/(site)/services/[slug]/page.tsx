import { notFound } from "next/navigation";
import { FileText } from "lucide-react";

import { PageHero } from "@/components/page/page-hero";
import { AudienceLens } from "@/components/services/audience-lens";
import { EngageRoutes } from "@/components/services/engage-routes";
import { FlowHub } from "@/components/services/flow-hub";
import { Industries } from "@/components/services/industries";
import { PayrollModels } from "@/components/services/payroll-models";
import { ServiceCta } from "@/components/services/service-cta";
import { ServiceCycle } from "@/components/services/service-cycle";
import { ServiceFaq } from "@/components/services/service-faq";
import { StageRail } from "@/components/services/stage-rail";
import { CtaPill } from "@/components/ui/cta-pill";
import { Section } from "@/components/ui/section";
import { SERVICES } from "@/lib/home-content";
import {
  SERVICE_PAGES,
  SERVICE_SCAFFOLD,
  type ServiceFeature,
  type StubService,
  type WrittenService,
} from "@/lib/service-content";

/**
 * The module pages — one template, six routes.
 *
 * `SITEMAP.md` is explicit: "All six share one template and one CMS document
 * type — six documents, not six hand-built pages." This file is the template
 * and `lib/service-content.ts` is the document type, standing in for Sanity.
 *
 * **Four are written** — HCM, Payroll, Financials and Integrations, each from
 * its own client document (2026-10-02). All four documents have the same seven
 * sections, so the page does too, and the movement in each is the same on every
 * module — a reader who has seen one knows how to read the next:
 *
 *   Hero            the module's cycle as a dial that turns its six stages
 *                   under one marker, in the dark (`backdrop="space"`); each
 *                   stage is a door straight to that stage below
 *   Capabilities    the six stages down a sticky rail that fills as you read
 *   Who it's for    three audiences, one lens: pick a group, see what changes
 *   How we engage   three routes on one track, each a door to What we do
 *   (the module's own section — the one place the pages differ)
 *   Call to action  with the three related modules
 *   Questions       five, one open at a time
 *
 * The module's own section, by `feature.kind`:
 *
 *   industries   HCM — six workforces side by side as a bento grid, each card
 *                carrying its own animated drawing of what HCM must get right
 *   models       Payroll — the two ways to run it, and how far each reaches
 *   flows        Financials (into the ledger) and Integrations (out of
 *                Workday): one hub, everything connected to it moving
 *
 * Grounds alternate so no two neighbours match: void (hero), surface, canvas,
 * ink, surface, canvas, surface.
 *
 * Reporting & Analytics and Extend have no document yet. They render their live
 * opener and a marked scaffold rather than a 404 or borrowed copy.
 *
 * The routes come from `SERVICES.items`, not from this file's own keys, so the
 * nav and the router cannot drift apart. `Workday AMS` is in `SERVICES.items`
 * and points at `/what-we-do#workday-ams` instead; the filter keeps it out.
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
  return {
    title: page.label,
    description: page.written ? page.hero.intro : page.lead,
  };
}

/* ------------------------------ sections ------------------------------- */

function Feature({ data }: { data: ServiceFeature }) {
  switch (data.kind) {
    case "industries":
      return <Industries data={data} />;
    case "models":
      return <PayrollModels data={data} />;
    case "flows":
      return <FlowHub data={data} />;
  }
}

function Written({ page }: { page: WrittenService }) {
  const { hero } = page;
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={
          <>
            {hero.titleLead}
            <span className="text-accent">{hero.titleAccent}</span>
          </>
        }
        lead={hero.intro}
        leadSecond={hero.differentiator}
        cta={hero.primary}
        secondary={hero.secondary}
        outcomes={hero.outcomes}
        backdrop="space"
        fit
        aside={
          <ServiceCycle
            icon={page.icon}
            label={page.label}
            stages={page.capabilities.stages}
            target={page.capabilities.id}
          />
        }
      />
      <StageRail data={page.capabilities} />
      <AudienceLens data={page.audiences} />
      <EngageRoutes data={page.engage} />
      <Feature data={page.feature} />
      <ServiceCta data={page.cta} />
      <ServiceFaq data={page.faq} />
    </>
  );
}

/**
 * The scaffold, for the modules whose page has not been written.
 *
 * Deliberately not disguised. A visitor gets the client's real opener and then a
 * clear statement that the rest is coming, with a link to a finished one — and
 * whoever is filling these in gets the list of what each page needs.
 */
function Scaffold({ page }: { page: StubService }) {
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
        fit
      />
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
    </>
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

  return page.written ? <Written page={page} /> : <Scaffold page={page} />;
}
