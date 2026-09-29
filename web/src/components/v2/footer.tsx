"use client";

import Link from "next/link";

import { HazebergWordmark } from "@/components/brand/hazeberg-wordmark";
import { Arrow, Reveal } from "@/components/v2/kit";
import { CONTACT, OFFICES } from "@/lib/navigation";
import { V2_FOOTER } from "@/lib/v2/content";

/**
 * The footer, to the comp: near-black, the lockup line on the left, three
 * link columns on the right, then the offices and a legal strip.
 *
 * The addresses, the phone number and the email are imported from
 * `lib/navigation.ts` rather than restated in v2's content module. They are
 * facts about the company, not design, and the site already treats that file
 * as their single source of truth — two copies of a phone number is how one
 * of them ends up out of date. This is the ONE place v2 reaches into shared
 * data, and it is deliberate.
 *
 * `--v2-night` #101416 is the page's only dark surface, and it is what makes
 * the amber half of the lockup legal: #FEC00F measures 11.9:1 here against
 * 1.65:1 on the white page above, which is why that colour carries a word in
 * this component and nowhere else on the page.
 *
 * What is NOT here: the comp's bottom-left line reads as a DPIIT recognition.
 * It is not in the copy document, the comp is not legible enough to
 * transcribe the wording exactly, and a government certification is the last
 * claim to reconstruct from a blurry render. It is listed in
 * `V2-CHECKLIST.md` for the client to supply verbatim.
 */

export function Footer() {
  return (
    <footer className="v2-night relative">
      <div className="v2-shell py-14">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1.4fr] lg:gap-16">
          <Reveal>
            <Link
              href="/v2"
              aria-label="Hazeberg — home"
              className="inline-block text-[var(--v2-night-ink)] transition-opacity duration-300 hover:opacity-70"
            >
              <HazebergWordmark className="h-5 w-auto" />
            </Link>
            <p className="mt-7 max-w-[20ch] text-[clamp(1.5rem,1.1rem+1.2vw,2rem)] leading-[1.2] font-normal tracking-[-0.03em]">
              <span className="block text-[var(--v2-night-ink)]">
                {V2_FOOTER.lockupLead}
              </span>
              <span className="block text-accent">{V2_FOOTER.lockupAccent}</span>
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-3">
              {V2_FOOTER.columns.map((column, i) => (
                <div key={column.title || `col-${i}`}>
                  {/* The middle column continues the first and carries no
                      heading of its own in the comp. An empty <p> would still
                      take its line box, so the spacer is explicit and hidden
                      from assistive tech rather than being a blank string. */}
                  {column.title ? (
                    <p className="font-mono text-[0.625rem] tracking-caps text-[var(--v2-night-muted)] uppercase">
                      {column.title}
                    </p>
                  ) : (
                    <p aria-hidden className="hidden h-[0.9375rem] sm:block" />
                  )}
                  <ul className="mt-5 space-y-3">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm text-[var(--v2-night-muted)] transition-colors duration-300 hover:text-[var(--v2-night-ink)]"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 grid gap-8 border-t border-[var(--v2-night-line)] pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {OFFICES.map((office) => (
              <div key={office.city}>
                <p className="font-mono text-[0.625rem] tracking-caps text-[var(--v2-night-muted)] uppercase">
                  {office.city}, {office.code}
                </p>
                <p className="mt-2.5 max-w-[24ch] text-sm text-[var(--v2-night-ink)]">
                  {office.short}
                </p>
              </div>
            ))}

            <div className="sm:col-span-2 lg:col-span-2">
              <p className="font-mono text-[0.625rem] tracking-caps text-[var(--v2-night-muted)] uppercase">
                {V2_FOOTER.talkLabel}
              </p>
              <ul className="mt-2.5 flex flex-col gap-2 sm:flex-row sm:gap-8">
                <li>
                  <a
                    href={CONTACT.phoneHref}
                    className="group inline-flex items-center gap-2 text-sm text-[var(--v2-night-ink)] transition-colors duration-300 hover:text-accent"
                  >
                    {CONTACT.phone}
                    <Arrow className="h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="group inline-flex items-center gap-2 text-sm text-[var(--v2-night-ink)] transition-colors duration-300 hover:text-accent"
                  >
                    {CONTACT.email}
                    <Arrow className="h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="border-t border-[var(--v2-night-line)]">
        <div className="v2-shell flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--v2-night-muted)]">{V2_FOOTER.legal}</p>
          {/* The way back to v1. This page exists to be compared with the
              original, and a link is the cheapest way to make that possible. */}
          <Link
            href="/"
            className="font-mono text-[0.625rem] tracking-caps text-[var(--v2-night-muted)] uppercase transition-colors duration-300 hover:text-accent"
          >
            View version 1
          </Link>
        </div>
      </div>
    </footer>
  );
}
