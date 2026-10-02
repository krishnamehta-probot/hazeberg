import Link from "next/link";
import { ArrowUpRight, Compass } from "lucide-react";

import { HazebergBirds } from "@/components/brand/hazeberg-wordmark";
import { Reveal } from "@/components/motion/reveal";
import { CtaPill } from "@/components/ui/cta-pill";
import { Section } from "@/components/ui/section";
import { isPublishedHref } from "@/lib/home/services";
import type { WrittenService } from "@/lib/service-content";

import { LiveLoop } from "./engage-loop";
import { iconForHref } from "./service-icons";

type Data = WrittenService["cta"];

/** The one word over the related row. UI, not copy: it names the row. */
const RELATED = "Related";
const RELATED_ID = "service-cta-related";

/**
 * The call to action, and where to go instead.
 *
 * One dark panel on the white ground: the question, the line under it and the
 * white pill, with the related modules along its foot. Every module page
 * closes on the same object, so the reader who has scrolled this far meets one
 * decision, not a section of them.
 *
 * Behind the question, on the right, Hazeberg's birds sit at the centre of two
 * dotted orbits that turn very slowly in opposite directions, with amber
 * markers riding the inner one — the home wheel's orbit, taken off the wheel.
 * It is the quietest thing on the page on purpose: noticed, not watched, and
 * only running while it is on screen (`LiveLoop`). On a phone the birds go and
 * the rings retreat to the top corner, behind nothing but air. The orbits are
 * clipped at the hairline above the related row, so they read as setting
 * behind it rather than running under the links.
 *
 * The related row is the document's three links in glass, each wearing the
 * glyph of the page it opens (`iconForHref`) and an arrow, and each at least
 * 64px tall. They stack below lg, where three across would wrap a name like
 * "Workday Reporting and Analytics" onto three lines. A link to a service held
 * back from the site (`isPublishedHref`) is left out rather than dead-ending,
 * so a row can hold two; the columns are as many as the links, so two share
 * the row instead of leaving a gap where the third was.
 *
 * The panel sits INSIDE a light section, so it carries no `data-nav-dark`: the
 * header flips to white type only over sections that are dark edge to edge,
 * and a light bar over a dark card is correct here.
 */
export function ServiceCta({ data }: { data: Data }) {
  return (
    <Section ground="canvas">
      <Reveal>
        <div className="grad-ink grain relative isolate overflow-hidden rounded-2xl text-on-panel">
          {/* -- the ask --------------------------------------------------- */}
          <div className="relative overflow-hidden">
            <div aria-hidden className="cta-glow absolute inset-0" />
            <LiveLoop className="pointer-events-none absolute -top-28 -right-32 size-[22rem] opacity-55 lg:top-1/2 lg:-right-20 lg:size-[36rem] lg:-translate-y-1/2 lg:opacity-100 xl:right-0">
              <Orbits />
            </LiveLoop>

            <div className="relative px-6 py-12 sm:px-10 sm:py-14 lg:max-w-[48rem] lg:px-16 lg:py-20">
              <h2 className="max-w-[18ch] text-3xl leading-[1.04] font-light tracking-[-0.03em] text-balance text-on-panel lg:text-4xl">
                {data.title}
              </h2>
              <p className="mt-6 max-w-[52ch] text-base text-on-panel/70">{data.body}</p>
              <div className="mt-10">
                <CtaPill href={data.button.href} tone="light">
                  {data.button.label}
                </CtaPill>
              </div>
            </div>
          </div>

          {/* -- where else ------------------------------------------------ */}
          <div className="relative border-t border-white/10 px-6 pt-6 pb-6 sm:px-10 sm:pb-8 lg:px-16 lg:pt-7 lg:pb-10">
            <p
              id={RELATED_ID}
              className="font-mono text-[0.6875rem] tracking-caps text-on-panel/55 uppercase"
            >
              {RELATED}
            </p>
            <ul aria-labelledby={RELATED_ID} className="mt-4 grid gap-2.5 lg:auto-cols-fr lg:grid-flow-col lg:gap-3">
              {data.related.filter((link) => isPublishedHref(link.href)).map((link) => {
                const Icon = iconForHref(link.href) ?? Compass;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group/rel flex min-h-16 items-center gap-3.5 rounded-xl bg-white/5 py-3 pr-4 pl-3 ring-1 ring-white/12 transition dur-base ease-brand hover:bg-white/10 hover:ring-white/28 focus-visible:bg-white/10 focus-visible:outline-on-panel active:scale-[0.99]"
                    >
                      <span
                        aria-hidden
                        className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-pill bg-white/8 ring-1 ring-white/12"
                      >
                        <span className="disc-blue absolute inset-0 opacity-0 transition-opacity dur-base ease-brand group-hover/rel:opacity-100 group-focus-visible/rel:opacity-100" />
                        <Icon className="relative size-4.5 text-on-panel" strokeWidth={1.8} />
                      </span>
                      <span className="min-w-0 flex-1 text-sm leading-snug font-medium text-on-panel">
                        {link.label}
                      </span>
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 shrink-0 text-on-panel/60 transition dur-base ease-brand group-hover/rel:translate-x-0.5 group-hover/rel:-translate-y-0.5 group-hover/rel:text-on-panel group-focus-visible/rel:text-on-panel"
                        strokeWidth={2}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/** Marker positions on each orbit, in degrees. */
const INNER = [-38, 82, 202];
const OUTER = [24, 204];

const at = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: 100 + r * Math.cos(a), y: 100 + r * Math.sin(a) };
};

/**
 * The motif, drawn in a 0-200 box. Strokes are in the box's units rather than
 * `non-scaling-stroke`, so the dots grow with the drawing instead of turning
 * into a hairline on a large panel.
 *
 * Raw hex in the gradient stops is the one place a token cannot reach: an SVG
 * `<stop>` takes a colour attribute, and these are the brand blue's own stops
 * as `--grad-blue` and `.disc-blue` have them, and the accent.
 */
function Orbits() {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="size-full overflow-visible">
      <defs>
        <radialGradient id="svc-cta-core" cx="0.32" cy="0.24" r="0.9">
          <stop offset="0" stopColor="#2b8ae0" />
          <stop offset="0.45" stopColor="#1972b9" />
          <stop offset="1" stopColor="#0b3f6b" />
        </radialGradient>
        <radialGradient id="svc-cta-halo" r="0.5">
          <stop offset="0.35" stopColor="#008eff" stopOpacity="0.42" />
          <stop offset="1" stopColor="#008eff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="svc-cta-marker" r="0.5">
          <stop offset="0.3" stopColor="#fec00f" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fec00f" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* The still ring nearest the centre. */}
      <circle cx="100" cy="100" r="40" stroke="rgb(255 255 255 / 0.1)" strokeWidth="0.4" />

      <g className="cta-orbit">
        <circle
          cx="100"
          cy="100"
          r="64"
          stroke="rgb(255 255 255 / 0.3)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeDasharray="0 3.4"
        />
        {INNER.map((deg) => {
          const q = at(64, deg);
          return (
            <g key={deg}>
              <circle cx={q.x} cy={q.y} r="5.5" fill="url(#svc-cta-marker)" />
              <circle cx={q.x} cy={q.y} r="1.7" className="fill-accent" stroke="#ffffff" strokeWidth="0.45" />
            </g>
          );
        })}
      </g>

      <g className="cta-orbit cta-orbit-rev">
        <circle
          cx="100"
          cy="100"
          r="92"
          stroke="rgb(255 255 255 / 0.18)"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeDasharray="0 4.2"
        />
        {OUTER.map((deg) => {
          const q = at(92, deg);
          return <circle key={deg} cx={q.x} cy={q.y} r="1.3" fill="rgb(255 255 255 / 0.7)" />;
        })}
      </g>

      {/* The core, from lg only: on a phone the rings are a corner ornament
          and a lit disc there would sit on the headline. */}
      <g className="hidden lg:inline">
        <circle cx="100" cy="100" r="40" fill="url(#svc-cta-halo)" />
        <circle cx="100" cy="100" r="23" fill="#ffffff" fillOpacity="0.14" />
        <circle cx="100" cy="100" r="21.5" fill="url(#svc-cta-core)" />
        <circle cx="100" cy="100" r="21.2" stroke="rgb(140 200 250 / 0.7)" strokeWidth="0.5" />
        <HazebergBirds x={87} y={87} width={26} height={26} className="text-white" />
      </g>
    </svg>
  );
}
