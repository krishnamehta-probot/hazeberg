import Link from "next/link";
import { ArrowUpRight, Route as RouteGlyph, type LucideIcon } from "lucide-react";

import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { CAPABILITY_ICON } from "@/components/what-we-do/capability-chip";
import type { ServiceRoute, WrittenService } from "@/lib/service-content";

import { LiveLoop } from "./engage-loop";
import { ServiceHead } from "./service-head";

type Data = WrittenService["engage"];

/** Every route is a door to a capability on What we do, so it wears that
    capability's own glyph (`capability-chip.tsx`): the icon on the card is the
    icon on the row it opens. Keyed by the full link, built once; a link to
    anywhere else gets the plain route. */
const GLYPH: Record<string, LucideIcon> = Object.fromEntries(
  Object.entries(CAPABILITY_ICON).map(([id, icon]) => [`/what-we-do#${id}`, icon]),
);

/**
 * How we engage — three ways in, on one track.
 *
 * The three routes are not three services side by side; they are where a
 * customer is with Workday, in order — before it, live on it, running it. So
 * they stand on one rail, numbered, with a light running along it from the
 * first to the last: the order is drawn rather than only written. Across the
 * row from lg, down the left edge on a phone. The pulse is CSS and runs only
 * while the track is on screen (`LiveLoop`); reduced motion leaves the rail
 * still.
 *
 * Each card is ONE link — the whole card — to the capability it names on What
 * we do. Its accessible name is the route and its destination; the line under
 * the name is the description, so a screen reader moving by links hears
 * "Implement Workday Implementation" and then why. Hover or focus lifts the
 * card off the rail and lights its stop in amber, which this ground allows
 * (11.97:1 on ink). The stops and their ticks sit outside the link, so the
 * lift does not drag them off the rail with it.
 *
 * The section is the `ink` ground; amber carries the numbers here for the same
 * reason. Dark edge to edge, so it carries `data-nav-dark` and the header turns
 * white over it — the locked rule for any dark section. `Section` takes no
 * attributes of its own, so it goes on a wrapper that is exactly the section's
 * box, as About's commitments do.
 */
export function EngageRoutes({ data }: { data: Data }) {
  return (
    <div data-nav-dark>
      <Section ground="ink" id={data.id}>
        <ServiceHead tone="panel" eyebrow={data.eyebrow} title={data.title} body={data.body} />

        <div className="relative mt-12 lg:mt-16">
          {/* The rail: centred 11px in from the left on a phone, 11px down from
              the top from lg. Every stop below is placed against that line. */}
          <LiveLoop className="engage-rail absolute top-0 bottom-0 left-2.5 w-0.5 lg:top-2.5 lg:right-0 lg:bottom-auto lg:left-0 lg:h-0.5 lg:w-auto" />

          <RevealGroup as="ol" className="relative grid gap-4 lg:grid-cols-3 lg:gap-5">
            {data.routes.map((route) => (
              <RevealItem
                as="li"
                key={route.n}
                className="engage-stop relative flex flex-col pl-10 lg:pl-0 lg:pt-14"
              >
                <Stop route={route} idBase={data.id} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>
    </div>
  );
}

/**
 * One route: its stop on the rail, the tick down to the card, and the card.
 *
 * The stop's centre is measured off the card, not tuned by eye. On a phone the
 * card is `p-6` and its first row is the 44px glyph disc, so the row's centre is
 * 46px down — the stop sits there, on the rail at x 11px, and the tick runs from
 * it to the card's edge at 40px. From lg the card is `p-7`, so its content
 * starts 28px in: the stop sits there on the rail and the tick drops from it to
 * the card's top at 56px.
 */
function Stop({ route, idBase }: { route: ServiceRoute; idBase: string }) {
  const Icon = GLYPH[route.link.href] ?? RouteGlyph;
  const id = `${idBase}-${route.n}`;
  return (
    <>
      <span
        aria-hidden
        className="engage-node absolute top-[2.4375rem] left-1 size-3.5 lg:top-1 lg:left-[1.3125rem]"
      />
      <span
        aria-hidden
        className="engage-tick absolute top-[2.875rem] left-[1.125rem] h-px w-[1.375rem] lg:top-[1.125rem] lg:left-7 lg:h-[2.375rem] lg:w-px"
      />

      <Link
        href={route.link.href}
        aria-labelledby={`${id}-name ${id}-link`}
        aria-describedby={`${id}-line`}
        className="group/card relative flex flex-1 flex-col overflow-hidden rounded-2xl bg-white/4 p-6 ring-1 ring-white/10 transition dur-base ease-brand hover:-translate-y-1.5 hover:bg-white/7 hover:shadow-2xl hover:shadow-primary/20 hover:ring-white/25 focus-visible:-translate-y-1.5 focus-visible:bg-white/7 focus-visible:outline-on-panel focus-visible:ring-white/25 active:-translate-y-0.5 lg:p-7"
      >
        {/* A lit edge along the top — the glass catching the light. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent opacity-50 transition-opacity dur-base ease-brand group-hover/card:opacity-100 group-focus-visible/card:opacity-100"
        />

        <span className="flex items-center justify-between gap-4">
          <span aria-hidden className="font-mono text-xs tracking-caps text-accent">
            {route.n}
          </span>
          <span
            aria-hidden
            className="grid size-11 shrink-0 place-items-center rounded-pill bg-white/6 text-on-panel ring-1 ring-white/14 transition-colors dur-base ease-brand group-hover/card:bg-white/12 group-focus-visible/card:bg-white/12"
          >
            <Icon className="size-5" strokeWidth={1.6} />
          </span>
        </span>

        {/* 4xl on a phone and from xl; 3xl between, where three cards share
            1024px and "Implement" at 4xl would outrun its card. */}
        <span
          id={`${id}-name`}
          className="mt-8 block text-4xl leading-none font-light tracking-[-0.035em] text-on-panel lg:mt-10 lg:text-3xl xl:text-4xl"
        >
          {route.name}
        </span>
        <span id={`${id}-line`} className="mt-5 block max-w-[44ch] flex-1 pb-8 text-sm text-on-panel/70">
          {route.line}
        </span>

        <span className="flex items-center justify-between gap-4 border-t border-white/10 pt-5">
          <span id={`${id}-link`} className="text-sm font-medium text-on-panel">
            {route.link.label}
          </span>
          <span
            aria-hidden
            className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-pill ring-1 ring-white/20"
          >
            <span className="disc-blue absolute inset-0 opacity-0 transition-opacity dur-base ease-brand group-hover/card:opacity-100 group-focus-visible/card:opacity-100" />
            <ArrowUpRight
              className="relative size-4 text-on-panel transition-transform dur-base ease-brand group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
              strokeWidth={2}
            />
          </span>
        </span>
      </Link>
    </>
  );
}
