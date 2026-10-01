"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/section";
import type { WHAT_WE_DO } from "@/lib/what-we-do-content";

import { CapabilityChip } from "./capability-chip";

type Data = (typeof WHAT_WE_DO)["who"];

/**
 * Who we are — the story, and the three problems it was started to fix.
 *
 * The client's paragraph names three problems in three sentences, and the
 * column beside it answers them as three challenges, in the same order. That
 * pairing is the whole argument of the section, so the page draws it: the
 * story holds still while the challenges scroll past it, and whichever
 * challenge is being read marks its sentence — a highlighter stroke, amber as a
 * FILL behind ink type, which is the one way rule 6 lets yellow near a word on
 * a light ground. The small number after each sentence is the same mark as the
 * challenge's own, so the link reads even before anything moves.
 *
 * "Being read" is the pointer or keyboard focus if either is on a card, and
 * otherwise the last card whose top has passed the middle of the screen.
 * Measured on scroll for the same reason the anchor rail is: cards several
 * hundred pixels tall overlap the viewport two at a time, so "intersecting" is
 * true for both and the arithmetic is needed anyway.
 *
 * Phones get the stack in reading order and no sticky column. The highlight
 * still runs, but nobody depends on it; every sentence and every challenge is
 * plain text in the DOM either way.
 */
export function WhoWeAre({ data }: { data: Data }) {
  const [scrolled, setScrolled] = useState<number | null>(null);
  const [pointed, setPointed] = useState<number | null>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const lit = pointed ?? scrolled;

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.55;
      let current: number | null = null;
      cards.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) current = i;
      });
      setScrolled(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id={data.id} className="relative bg-surface">
      <div className="shell grid gap-14 py-[var(--section-y)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
        {/* -- the story, held ------------------------------------------------ */}
        <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
          <Reveal>
            <Eyebrow>{data.eyebrow}</Eyebrow>
            <h2 className="mt-5 max-w-[14ch] text-3xl leading-[1.08] font-light tracking-[-0.03em] text-balance text-ink">
              {data.title}
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-7 max-w-[54ch] text-base text-ink-muted">
              {data.story.map((part, i) =>
                "challenge" in part ? (
                  <span key={i}>
                    <span data-on={lit === part.challenge ? "" : undefined} className="marker text-ink">
                      {part.text}
                    </span>
                    <sup
                      aria-hidden
                      className="ml-0.5 font-mono text-[0.625rem] tracking-caps text-primary"
                    >
                      {data.challenges[part.challenge].n}
                    </sup>
                  </span>
                ) : (
                  <span key={i}>{part.text}</span>
                ),
              )}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[54ch] text-base text-ink-muted">{data.body}</p>
          </Reveal>
        </div>

        {/* -- the picture, then the three answers ----------------------------- */}
        <div className="min-w-0">
          <Reveal>
            <figure className="relative overflow-hidden rounded-2xl bg-surface-2">
              <Image
                src={data.photo.src}
                alt={data.photo.alt}
                width={data.photo.width}
                height={data.photo.height}
                sizes="(max-width: 1023px) 100vw, 46vw"
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-pill bg-ink/70 px-3.5 py-2 font-mono text-[0.6875rem] tracking-caps text-on-panel uppercase backdrop-blur-md">
                <span aria-hidden className="size-1.5 rounded-pill bg-accent" />
                {data.photoTag}
              </figcaption>
            </figure>
          </Reveal>

          <Reveal>
            <p className="mt-14 font-mono text-xs tracking-caps text-ink-subtle uppercase">
              {data.visualTitle}
            </p>
          </Reveal>

          <ol className="mt-6 space-y-5">
            {data.challenges.map((c, i) => {
              const on = lit === i;
              return (
                <li
                  key={c.n}
                  ref={(el) => {
                    cards.current[i] = el;
                  }}
                  onPointerEnter={() => setPointed(i)}
                  onPointerLeave={() => setPointed(null)}
                  onFocusCapture={() => setPointed(i)}
                  onBlurCapture={() => setPointed(null)}
                >
                  <Reveal>
                    <article
                      className={`rounded-2xl bg-canvas p-7 ring-1 transition dur-slow ease-brand sm:p-8 ${
                        on ? "shadow-lg shadow-primary/10 ring-primary/35" : "ring-border"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-6">
                        <p
                          className={`font-mono text-[0.6875rem] tracking-caps uppercase transition-colors dur-base ease-brand ${
                            on ? "text-primary" : "text-ink-subtle"
                          }`}
                        >
                          {data.labels.challenge} {c.n}
                        </p>
                        <span
                          aria-hidden
                          className={`grad-primary h-1 rounded-pill transition-[width] dur-slow ease-brand ${
                            on ? "w-14" : "w-6"
                          }`}
                        />
                      </div>
                      <h3 className="mt-4 max-w-[26ch] text-xl leading-snug font-light tracking-[-0.02em] text-balance text-ink">
                        {c.title}
                      </h3>

                      <div className="mt-7 border-t border-border pt-6">
                        <p className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
                          {data.labels.does}
                        </p>
                        <p className="mt-3 max-w-[56ch] text-sm text-ink-muted">{c.does}</p>
                      </div>

                      <div className="mt-6">
                        <p className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
                          {data.labels.capabilities}
                        </p>
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {c.capabilities.map((id) => (
                            <li key={id}>
                              <CapabilityChip id={id} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
