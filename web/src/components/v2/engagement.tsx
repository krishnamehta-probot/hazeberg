"use client";

import Link from "next/link";

import { Arrow, Eyebrow, Reveal, RevealGroup, RevealItem } from "@/components/v2/kit";
import { V2_MODELS } from "@/lib/v2/content";

/**
 * Engagement models: three cards on the page's first grey band, the middle
 * one filled amber.
 *
 * The band change IS the separator here. v2 has no rules between sections and
 * no heavy dividers; `--surface` under this section and the testimonials
 * below it is what groups the two as the page's quieter second half. That is
 * the comp's structure and it is also v1's rule, arrived at from the opposite
 * direction.
 *
 * The amber card is the comp's, and it is legal: near-black on #FEC00F
 * measures 10.8:1. Yellow is the FILL — the words on it are ink. It is also
 * the only saturated block in the band, which is what makes it read as the
 * recommended path rather than as one of three.
 *
 * Equal heights without a grid hack: the cards are flex columns and the
 * "Get a proposal" link is pushed down by `mt-auto`, so three cards with
 * different body lengths still line their controls up.
 */

export function Engagement() {
  return (
    <section id="engagement" className="relative bg-surface">
      <div className="v2-shell v2-section">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <Eyebrow center>{V2_MODELS.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 max-w-[24ch] v2-h2 text-balance text-ink">
              {V2_MODELS.title}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-[64ch] text-sm text-balance text-ink-muted">
              {V2_MODELS.body}
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-12 grid gap-5 lg:grid-cols-3">
          {V2_MODELS.items.map((item) => {
            const filled = item.featured;
            return (
              <RevealItem
                as="article"
                key={item.title}
                className={`flex h-full flex-col rounded-[var(--v2-radius-media)] p-7 transition-all duration-500 ${
                  filled
                    ? "v2-fill-amber shadow-[var(--v2-shadow-lift)]"
                    : "v2-card v2-hoverable"
                }`}
              >
                <h3
                  className={`text-lg leading-snug font-semibold tracking-[-0.015em] ${
                    filled ? "" : "text-ink"
                  }`}
                >
                  {item.title}
                </h3>

                <p className={`mt-4 text-sm ${filled ? "opacity-85" : "text-ink-muted"}`}>
                  {item.body}
                </p>

                <p
                  className={`mt-6 border-t pt-5 text-sm ${
                    filled ? "border-current/20" : "border-border"
                  }`}
                >
                  <span
                    className={`font-mono text-[0.625rem] tracking-caps uppercase ${
                      filled ? "opacity-70" : "text-ink-subtle"
                    }`}
                  >
                    {V2_MODELS.bestForLabel}
                  </span>
                  <span className={`mt-2 block ${filled ? "opacity-90" : "text-ink-muted"}`}>
                    {item.bestFor}
                  </span>
                </p>

                <Link
                  href={item.href}
                  className={`group mt-auto inline-flex items-center gap-2.5 self-start pt-8 font-mono text-[0.6875rem] tracking-caps uppercase transition-colors duration-300 ${
                    filled ? "text-accent-ink hover:opacity-70" : "text-primary"
                  }`}
                >
                  {V2_MODELS.cta}
                  <Arrow className="h-3.5 w-3.5 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
