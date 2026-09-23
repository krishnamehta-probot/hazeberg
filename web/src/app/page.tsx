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

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Impact />
      <Services />
      <Results />
      <CaseStudies />
      <Models />
      <Testimonials />
      <Closing />
    </>
  );
}
