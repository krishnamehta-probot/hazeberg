import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Headset,
  Rocket,
  ShieldCheck,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { CtaPill } from "@/components/ui/cta-pill";
import { Eyebrow, Section } from "@/components/ui/section";
import { SERVICES } from "@/lib/home-content";
import type { WHAT_WE_DO } from "@/lib/what-we-do-content";

type Cover = (typeof WHAT_WE_DO)["cover"];
type StageKey = Cover["lifecycle"]["items"][number]["key"];

/* Health Check and Always-On Support are the Health Check and AMS
   capabilities under other names, so they keep those capabilities' glyphs
   (`capability-chip.tsx`). */
const STAGE_ICON: Record<StageKey, LucideIcon> = {
  golive: Rocket,
  testing: ShieldCheck,
  health: Stethoscope,
  support: Headset,
};

/**
 * What we cover — a photograph and the lifecycle, side by side.
 *
 * The left half is the photograph made for this page: the hero's globe again,
 * at sunrise, so the page opens and nearly closes on the same world. It
 * stretches to whatever height the panel beside it sets, holding the person
 * in frame (`position`), and on a phone it is a 16:10 band above the panel.
 *
 * The right half is the client's four lifecycle stages on the brand blue —
 * the client's own gradient, darkened a fifth so small white type clears
 * 4.5:1 across the whole sweep. Two by two, so the section is two rows deep
 * rather than four. The stages are capabilities under the client's other
 * names, and each already has a door in the accordion, so these describe and
 * nothing in them pretends to be clickable.
 */
export function WhatWeCover({ data }: { data: Cover }) {
  const { photo, lifecycle } = data;
  return (
    <section id={data.id} className="relative bg-surface">
      <div className="shell py-[var(--section-y)]">
        {/* Same head as "Wherever you are": title left, body right, on one
            baseline. At 24ch each half of the title breaks once, evenly, so it
            sets as two lines of ink over two of blue (measured at 40px). */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <Reveal>
            <Eyebrow>{data.eyebrow}</Eyebrow>
            <h2 className="mt-5 max-w-[24ch] text-3xl leading-[1.08] font-light tracking-[-0.03em] text-balance text-ink">
              <span className="block">{data.titleLead}</span>{" "}
              <span className="block text-primary">{data.titleRest}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            {data.body.map((p) => (
              <p key={p} className="mt-4 max-w-[60ch] text-base text-ink-muted first:mt-0">
                {p}
              </p>
            ))}
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* -- the photograph ------------------------------------------------ */}
          <Reveal className="relative overflow-hidden rounded-2xl bg-void">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 1023px) 100vw, 40vw"
              style={{ objectPosition: photo.position }}
              className="aspect-[16/10] w-full object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
            />
          </Reveal>

          {/* -- the lifecycle, on the brand blue ------------------------------ */}
          <Reveal delay={0.08}>
            <article className="grad-primary-deep grain relative h-full overflow-hidden rounded-2xl p-7 text-on-panel sm:p-9">
              <h3 className="text-xl leading-snug font-light tracking-[-0.02em] text-balance">
                {lifecycle.title}
              </h3>
              <p className="mt-2 text-sm text-on-panel/85">{lifecycle.lead}</p>
              <ul className="mt-7 grid gap-x-8 sm:grid-cols-2">
                {lifecycle.items.map((item) => {
                  const Icon = STAGE_ICON[item.key];
                  return (
                    <li key={item.key} className="flex gap-4 border-t border-white/20 py-5">
                      <span
                        aria-hidden
                        className="grid size-9 shrink-0 place-items-center rounded-pill bg-white/12 ring-1 ring-white/25"
                      >
                        <Icon className="size-4" strokeWidth={1.9} />
                      </span>
                      {/* `pt-1.5` centres the title's first line on the disc. */}
                      <div className="min-w-0 pt-1.5">
                        <h4 className="text-base font-medium">{item.title}</h4>
                        <p className="mt-1.5 text-sm text-on-panel/85">{item.body}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * The close — one line, one body, one button, on the ink ground.
 *
 * The client gave this no eyebrow, and a label invented to fill the slot would
 * be copy nobody wrote. The short gradient bar keeps the slot's rhythm without
 * saying anything; it is the same rule the challenge cards carry.
 *
 * The title is two sentences and is held at 24ch so it breaks between them.
 * Measured at 40px: 18ch, the old close's measure, balances it into "One
 * Workday / partner. Complete / ecosystem expertise.", splitting both.
 */
export function Closing({ data }: { data: (typeof WHAT_WE_DO)["closing"] }) {
  return (
    <Section ground="ink">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
        <div>
          <Reveal>
            <span aria-hidden className="grad-primary block h-1 w-12 rounded-pill" />
            <h2 className="mt-6 max-w-[24ch] text-3xl leading-[1.08] font-light tracking-[-0.03em] text-balance text-on-panel">
              {data.title}
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-5 max-w-[52ch] text-base text-on-panel/70">{data.body}</p>
          </Reveal>
        </div>
        <Reveal delay={0.12}>
          <CtaPill href={data.cta.href} tone="light">
            {data.cta.label}
          </CtaPill>
        </Reveal>
      </div>
    </Section>
  );
}

/* This component only renders on /what-we-do, so a service link back into the
   page is cut to its hash. A bare "#..." is what Lenis smooth-scrolls
   (`smooth-scroll.tsx`) and what the accordion listens for, so the click lands
   on the item already open. Left as a route, it would be a full navigation to
   the page the reader is already on. */
const HERE = "/what-we-do#";

const PILL =
  "group/pill inline-flex min-h-11 items-center gap-2 rounded-pill bg-surface px-4 text-sm text-ink ring-1 ring-border transition dur-base ease-brand hover:text-primary hover:ring-primary/40";

/**
 * The foot of the page: the client's sentence, then the seven services it
 * names, as links, in its order.
 *
 * It replaces the CrossLink strip that closed the draft. The sentence names
 * seven places and a strip can only go to one, so the names became the
 * links. They come from `SERVICES.items` rather than a second list, which is
 * the order the sentence uses and the list the header and footer already
 * read, so a renamed or added service reaches all three.
 *
 * Six are pages and wear the page arrow. AMS has no page; it is a capability
 * on this one, so it wears the down arrow every in-page chip uses.
 */
export function ExploreServices({ text }: { text: string }) {
  return (
    <section className="relative bg-canvas">
      <div className="shell border-t border-border py-12 md:py-14">
        <Reveal>
          <p className="max-w-[60ch] text-xl font-light tracking-[-0.02em] text-balance text-ink">
            {text}
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <ul className="mt-7 flex flex-wrap gap-2.5">
            {SERVICES.items.map((s) => {
              const href = s.href.startsWith(HERE) ? s.href.slice(HERE.length - 1) : s.href;
              return (
                <li key={s.href}>
                  {href.startsWith("#") ? (
                    <a href={href} className={PILL}>
                      {s.label}
                      <ArrowDown
                        aria-hidden
                        className="size-3.5 text-primary transition-transform dur-base ease-brand group-hover/pill:translate-y-0.5 group-focus-visible/pill:translate-y-0.5"
                        strokeWidth={2}
                      />
                    </a>
                  ) : (
                    <Link href={href} className={PILL}>
                      {s.label}
                      <ArrowUpRight
                        aria-hidden
                        className="size-3.5 text-primary transition-transform dur-base ease-brand group-hover/pill:translate-x-0.5 group-hover/pill:-translate-y-0.5 group-focus-visible/pill:translate-x-0.5 group-focus-visible/pill:-translate-y-0.5"
                        strokeWidth={2}
                      />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
