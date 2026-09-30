import {
  About,
  CaseStudies,
  Closing,
  Hero,
  Impact,
  Models,
  Results,
  Services,
  Testimonials,
} from "@/components/sections/home";
import { BergBand } from "@/components/sections/berg-band";
import { getHome } from "@/lib/home/get-home";

/**
 * The home page. Its words, photographs and lists come from the `homePage`
 * document in Sanity (see `lib/home/get-home.ts`); its sections, their order
 * and their layout are this file and `components/sections/home.tsx`.
 *
 * Still a static page: the fetch is cached by tag, and a publish in the Studio
 * revalidates it through the publish webhook (and, while someone has the page
 * open, `<SanityLive />`) — see `sanity/lib/live.ts`.
 */
export default async function Home() {
  const home = await getHome();
  return (
    <>
      <Hero hero={home.hero} />
      <About about={home.about} />
      <Impact impact={home.impact} />
      <Services services={home.services} />
      <BergBand />
      <Results results={home.results} />
      <CaseStudies caseStudies={home.caseStudies} />
      <Models models={home.models} />
      <Testimonials testimonials={home.testimonials} />
      <Closing closing={home.closing} />
    </>
  );
}
