import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail, Phone, type LucideIcon } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { CtaPill } from "@/components/ui/cta-pill";
import { Eyebrow } from "@/components/ui/section";
import type { ABOUT } from "@/lib/about-content";
import { CONTACT } from "@/lib/navigation";

import { ConversationOffices } from "./conversation-offices";

/**
 * Start a conversation — the page's close, and the one place on it with
 * somewhere to go.
 *
 * Left, the ask: the amber eyebrow (amber may be type on this ground, 11.97:1),
 * the line set large and light, and one white pill with a quiet text link
 * beside it — the frame keeps one filled call to action, as the hero does.
 * Right, the two offices on their own live clocks, and the phone number and
 * address as rows you can act on. The phone and email are read from `CONTACT`
 * (`lib/navigation.ts`), the copy the footer and the Contact page use, so a
 * changed number reaches all three. They are quiet rows rather than
 * `CtaMail`: a second pill beside the first would be two calls to action
 * shouting at each other.
 *
 * The footer follows directly and is the void this ground runs down to, so
 * without an edge the close and the footer read as one undifferentiated slab.
 * Three things keep them apart: the close is navy (`grad-ink`) where the
 * footer is black; it carries its own light, a blue bloom behind the offices;
 * and it ends on a horizon — a hairline lit in the middle with a low glow
 * rising off it (`.talk-horizon`) — so the page's last section finishes on a
 * line of light and the footer begins in the dark under it. No WebGL: the
 * home page's close spends its shader on the same job, and a second one on
 * the slow machines this has to run on is not worth a hairline's difference.
 */
export function StartConversation({ data }: { data: (typeof ABOUT)["contact"] }) {
  return (
    <section
      id={data.id}
      data-nav-dark
      className="grad-ink grain relative isolate overflow-hidden text-on-panel"
    >
      <div aria-hidden className="talk-glow pointer-events-none absolute inset-0" />
      <div aria-hidden className="talk-horizon pointer-events-none absolute inset-x-0 bottom-0 h-48" />

      <div className="relative shell grid gap-14 pt-[calc(var(--section-y)+1rem)] pb-[calc(var(--section-y)+2.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 xl:gap-24">
        {/* -- the ask ------------------------------------------------------- */}
        <div className="lg:pt-2">
          <Reveal>
            <Eyebrow tone="panel">{data.eyebrow}</Eyebrow>
            <h2 className="mt-6 max-w-[18ch] text-3xl leading-[1.04] font-light tracking-[-0.03em] text-balance text-on-panel lg:text-4xl">
              {data.title}
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-6 max-w-[48ch] text-base text-on-panel/70">{data.body}</p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <CtaPill href={data.primary.href} tone="light">
                {data.primary.label}
              </CtaPill>
              <Link
                href={data.secondary.href}
                className="group/s inline-flex min-h-11 items-center gap-2.5 font-mono text-xs tracking-caps text-on-panel/80 uppercase transition-colors dur-base ease-brand hover:text-on-panel"
              >
                {data.secondary.label}
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform dur-base ease-brand group-hover/s:translate-x-0.5"
                  strokeWidth={2}
                />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* -- where, and how ------------------------------------------------ */}
        <div className="min-w-0">
          <Reveal delay={0.08}>
            <ConversationOffices label={data.officesLabel} offices={data.offices} />
          </Reveal>
          <Reveal delay={0.14}>
            <h3 className="mt-10 font-mono text-[0.6875rem] tracking-caps text-on-panel/60 uppercase">
              {data.contactLabel}
            </h3>
            <ul className="mt-3 border-t border-white/10">
              <ContactRow href={CONTACT.phoneHref} icon={Phone} text={CONTACT.phone} />
              <ContactRow href={`mailto:${CONTACT.email}`} icon={Mail} text={CONTACT.email} />
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** A number or an address you can act on: the whole row is the link, 56px
    tall, with its mark turning blue and the arrow leaving on hover or focus. */
function ContactRow({ href, icon: Icon, text }: { href: string; icon: LucideIcon; text: string }) {
  return (
    <li className="border-b border-white/10">
      <a
        href={href}
        className="group/c flex min-h-14 items-center gap-4 rounded-sm py-2 text-on-panel transition-colors dur-base ease-brand"
      >
        <span
          aria-hidden
          className="grid size-10 shrink-0 place-items-center rounded-pill bg-white/[0.06] ring-1 ring-white/15 transition-colors dur-base ease-brand group-hover/c:bg-primary group-hover/c:ring-primary group-focus-visible/c:bg-primary group-focus-visible/c:ring-primary"
        >
          <Icon className="size-4" strokeWidth={1.8} />
        </span>
        <span className="min-w-0 flex-1 text-lg leading-snug font-light tracking-[-0.01em] wrap-anywhere">
          {text}
        </span>
        <ArrowUpRight
          aria-hidden
          className="size-4 shrink-0 text-on-panel/60 transition dur-base ease-brand group-hover/c:translate-x-0.5 group-hover/c:-translate-y-0.5 group-hover/c:text-on-panel group-focus-visible/c:text-on-panel"
          strokeWidth={2}
        />
      </a>
    </li>
  );
}
