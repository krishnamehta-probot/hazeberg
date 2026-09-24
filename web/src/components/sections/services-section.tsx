import { ServicesMap } from "@/components/sections/services-map";

/**
 * Services: the wheel, and nothing else.
 *
 * There were two views here and a small switch in the corner to compare them
 * live on the real page rather than side by side in a screenshot. The wheel won;
 * the switch and the index list are gone. A visitor offered two drawings of one
 * list has been handed a choice that was never theirs to make.
 *
 * The ground stays `map-ground`: a flat surface under a diagram made of soft
 * discs reads as paper with stickers on it, and the two very wide, very weak
 * washes give the white something to be lit by.
 */
export function ServicesSection() {
  return (
    <section id="services" className="relative map-ground">
      <ServicesMap />
    </section>
  );
}
