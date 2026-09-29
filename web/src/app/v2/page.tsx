import { About } from "@/components/v2/about";
import { Closing } from "@/components/v2/closing";
import { Engagement } from "@/components/v2/engagement";
import { Hero } from "@/components/v2/hero";
import { Impact } from "@/components/v2/impact";
import { LogoStrip } from "@/components/v2/logo-strip";
import { Results } from "@/components/v2/results";
import { ServicesCarousel } from "@/components/v2/services-carousel";
import { Testimonials } from "@/components/v2/testimonials";
import { UseCases } from "@/components/v2/use-cases";

/**
 * Home, version 2 — built to the supplied full-page design comp.
 *
 * A parallel version of the home page: same company, same brand, same client
 * copy, laid out to the comp rather than to v1's reference template. It
 * shares no component and no content module with v1, so `/` and `/v2` can
 * change independently. The single exception is the footer, which imports the
 * offices and the contact details from `lib/navigation.ts` — those are facts
 * about the company, and a second copy of a phone number is how one of them
 * goes out of date.
 *
 * Ten bands, in the comp's order:
 *
 *   hero         copy left, photograph right, testimonial card overlapping it
 *   logos        thirteen client marks, slow rail, pausing under the pointer
 *   about        a centred statement over three points
 *   impact       centred head, photograph, and a 2x2 divided panel
 *   services     the seven, as a full-bleed expanding gallery
 *   results      four figures, two of them filled — amber, then blue
 *   work         three engagements, one open and filled blue
 *   engagement   three models on grey, the middle one filled amber
 *   testimonials the two approved quotes
 *   closing      a full-bleed photograph under the call to action
 *
 * Motion is one vocabulary applied consistently rather than a set of
 * effects: everything arrives 24px up at the same trigger line, rows stagger
 * by 70ms, figures count on arrival, and three photographs drift on scroll.
 * Nothing pins, nothing hijacks the scroll, and every one of them is dropped
 * by `prefers-reduced-motion`.
 */
export default function V2Home() {
  return (
    <>
      <Hero />
      <LogoStrip />
      <About />
      <Impact />
      <ServicesCarousel />
      <Results />
      <UseCases />
      <Engagement />
      <Testimonials />
      <Closing />
    </>
  );
}
