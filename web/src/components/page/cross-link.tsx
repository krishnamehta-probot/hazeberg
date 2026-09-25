import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";

/**
 * The strip that closes Contact and Careers, each pointing at the other.
 *
 * These two pages are one space with two doors, and the wrong door is the most
 * common mistake a visitor makes on either: candidates land on Contact and
 * enterprise buyers land on Careers. One row at the foot of each fixes it
 * without either page advertising the other above its own content.
 *
 * It is a whole-row link rather than a card with a button in it — the row is the
 * target, so the hit area is the full width of the shell at every size, which
 * is also what makes it comfortable on a phone. The disc is the site's one disc,
 * and the arrow does the same swap the CTA pill does, so this reads as the same
 * family of control rather than a new one.
 */
export function CrossLink({
  eyebrow,
  title,
  body,
  href,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <section className="relative bg-canvas">
      <div className="shell border-t border-border py-12 md:py-14">
        <Reveal>
          <Link
            href={href}
            className="group/x flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10"
          >
            <div className="min-w-0">
              <p className="font-mono text-xs tracking-caps text-ink-subtle uppercase">{eyebrow}</p>
              <p className="mt-3 max-w-[28ch] text-2xl leading-[1.1] font-light tracking-[-0.02em] text-balance text-ink">
                {title}
              </p>
              <p className="mt-3 max-w-[52ch] text-sm text-ink-muted">{body}</p>
            </div>
            {/* `shrink-0` and `self-start` on a phone, so the disc sits under the
                copy at the left rather than stretching the row. The 44px hit
                area is the whole row, not this. */}
            <span
              aria-hidden
              className="disc-blue relative grid size-12 shrink-0 self-start place-items-center overflow-hidden rounded-pill transition-transform dur-base ease-brand group-hover/x:scale-105 sm:self-auto"
            >
              <ArrowUpRight
                className="absolute size-5 text-white transition-transform duration-300 ease-brand group-hover/x:translate-x-[180%] group-hover/x:-translate-y-[180%]"
                strokeWidth={2}
              />
              <ArrowUpRight
                className="absolute size-5 -translate-x-[180%] translate-y-[180%] text-white transition-transform duration-300 ease-brand group-hover/x:translate-x-0 group-hover/x:translate-y-0"
                strokeWidth={2}
              />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
