import { NetworkScene } from "@/components/berg/network-scene";
import { Reveal } from "@/components/motion/reveal";
import { CtaPill } from "@/components/ui/cta-pill";
import { Eyebrow } from "@/components/ui/section";
import { BERG } from "@/lib/berg-content";

/**
 * Berg's opener — product first, and the only light hero on the site.
 *
 * Two earlier versions were wrong, in the same way twice. The first reused
 * `PageHero`, so a product opened exactly like the three service pages. The
 * second replaced it with an animated node-and-wire network — which is the most
 * over-used shape in software marketing. Connected dots is what every AI landing
 * page in the world opens with, and it says nothing specific about this product.
 *
 * So the panel on the right is Berg's network drawn as a place — the three
 * groups' people, each in a pool of their own colour on one floor, wired into
 * Berg's lit disc, on a light ground, tilting to the pointer. It is the client's strapline as a world rather than a sentence:
 * "One platform. Three groups." See `network-scene.tsx`; every word in it is
 * theirs, and it says in its own foot that the view is illustrative.
 *
 * **Light ground, deliberately.** Every other page here opens on the dark void. A
 * product page that opens white with one crisp surface floating on it reads as
 * software; the same page on a dark band with a glow reads as another chapter of
 * the consultancy. `.map-ground` supplies two very weak brand washes rather than
 * flat white, so the panel has something to be lit by.
 *
 * Consequences of going light, both handled:
 *   - **no `data-nav-dark`.** The header stays in its dark-type state, which is
 *     what belongs over a white ground.
 *   - **the accent is blue, not amber.** Yellow measures 1.65:1 on white and is a
 *     fill only here, so the headline's second half takes `--primary`. Amber does
 *     still appear — as the Urgent chip's fill, near-black on it at 10.8:1, which
 *     is exactly what that colour is for.
 *
 * Nothing animates on its own. The panel moves when it is asked to and not
 * before — a product surface that pulses is a product surface nobody reads.
 */

export function BergHero() {
  return (
    <section className="map-ground relative isolate overflow-hidden">
      {/* Sized to fit ONE SCREEN. The opener ran to 1095px, which is a screen and
          a half on a 1366x768 laptop — a hero you have to scroll to see is not a
          hero. The chrome came down from 328px of padding to 188, and the
          picture was re-laid-out across the frame instead of down it. */}
      <div className="shell pt-[calc(var(--header-h)+2rem)] pb-10 lg:pt-[calc(var(--header-h)+1.5rem)]">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-14">
          <div>
            <Reveal immediate>
              <Eyebrow>{BERG.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal immediate delay={0.08}>
              <h1 className="mt-5 max-w-[15ch] text-4xl leading-[1.04] font-light tracking-[-0.025em] text-balance text-ink">
                {BERG.titleLead}
                <span className="text-primary">{BERG.titleAccent}</span>
              </h1>
            </Reveal>
            <Reveal immediate delay={0.16}>
              <p className="mt-5 max-w-[48ch] text-base text-ink-muted">{BERG.lead}</p>
            </Reveal>
            <Reveal immediate delay={0.24}>
              {/* One action. There was a second, a white "Quick enquiry" pill
                  down to the contact block; the client took it out, 2026-09-30 —
                  the opener asks for one thing, and that is to get started. The
                  contact block is still at the foot of the page. */}
              <div className="mt-8">
                <CtaPill href={BERG.cta.href} external>
                  {BERG.cta.label}
                </CtaPill>
              </div>
            </Reveal>

            {/* Their strapline, and only the strapline. The three group NAMES
                used to be listed here as well, and once the panel became a
                switch between those same three the row was printing the answer
                twice in one viewport. The panel is the better copy of it — it is
                the one you can press. */}
            <Reveal immediate delay={0.32}>
              <div className="mt-9 border-t border-border pt-6">
                <p className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">
                  {BERG.strapline}
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal immediate delay={0.2}>
            <NetworkScene />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
