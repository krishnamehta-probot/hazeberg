import Link from "next/link";
import { Mail, Phone } from "lucide-react";

import { HazebergWordmark } from "@/components/brand/hazeberg-wordmark";
import { LinkedInMark } from "@/components/brand/linkedin-mark";
import { SERVICES } from "@/lib/home-content";
import { CONTACT, OFFICES } from "@/lib/navigation";

/**
 * Footer.
 *
 * The mark and a two-line claim on the left, a rule, the links on the right, a
 * thin legal strip. The company name used to run enormous and almost invisible
 * across the foot; it is gone.
 *
 * It sits on the same ground as the closing panel above it with no rule between
 * them, so the page ends on one dark block rather than two. No shader down here:
 * the arc belongs to the panel above, and running it twice would halve it.
 *
 * Measured on this ground: links 7.1:1, the legal strip 5.0:1, the amber line
 * 11.97:1.
 */

function Column({
  heading,
  links,
  split,
}: {
  heading: string;
  links: { label: string; href: string }[];
  /** Run the list in two, filling the first four down before starting the
      second. Services is seven long and everything beside it is three — one
      tall column against three short ones is not a row, it is a list with
      decoration. `grid-flow-col` over four rows is what gives 4 then 3; a plain
      two-column grid fills across instead and interleaves them. */
  split?: boolean;
}) {
  return (
    <div className={split ? "col-span-2" : undefined}>
      <h3 className="font-mono text-[0.6875rem] tracking-caps text-on-panel/55 uppercase">
        {heading}
      </h3>
      <ul
        className={`mt-4 gap-y-2.5 ${
          split ? "grid grid-flow-col grid-rows-4 gap-x-6" : "space-y-2.5"
        }`}
      >
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="text-sm text-on-panel/70 transition-colors dur-fast ease-brand hover:text-on-panel"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative bg-void">
      <div className="shell relative py-12 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-16">
          {/* -- the mark, the claim, the one social account we actually have -- */}
          <div className="lg:border-r lg:border-white/10 lg:pr-16">
            <HazebergWordmark className="h-4 w-auto text-on-panel md:h-5" />
            <p className="mt-6 max-w-[16ch] text-2xl leading-[1.15] font-light tracking-[-0.02em] text-balance text-on-panel md:text-3xl">
              Workday expertise
              <span className="block text-accent">that stays engaged</span>
            </p>

            {/* One icon, because one account is what exists. A row of four with
                three of them invented is worse than a row of one — and the mail
                tile that used to sit beside it went when the address below grew
                a mark of its own. The same link twice is not two links. */}
            <div className="mt-7 flex items-center gap-3">
              <a
                href={CONTACT.linkedin}
                aria-label="Hazeberg on LinkedIn"
                className="grid size-10 place-items-center rounded-sm ring-1 ring-white/15 text-on-panel/70 transition dur-base ease-brand hover:bg-white/8 hover:text-on-panel"
              >
                <LinkedInMark className="size-4" />
              </a>
            </div>
          </div>

          {/* -- the links ---------------------------------------------------- */}
          {/* A footer is a map of the site, not a copy of the nav.

              Services keeps all seven and runs them 4 then 3, because it is the
              one column anybody came down here for. Everything else is a page,
              so everything else is one line under Company — What we do included.
              Its eight in-page anchors made the footer a second navigation, and
              a heading of its own over a single link is not a column.

              Two columns from the smallest screen, not from 640px: stacked in
              one, a phone had eighteen links running straight down and the
              footer came out 1688px — taller than the viewport, twice over. */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-9 lg:grid-cols-3 lg:gap-10">
            <Column
              split
              heading="Services"
              links={SERVICES.items.map((s) => ({ label: s.label, href: s.href }))}
            />
            <Column
              heading="Company"
              links={[
                { label: "What we do", href: "/what-we-do" },
                { label: "About us", href: "/about" },
                { label: "Berg", href: "/berg" },
                { label: "Contact", href: "/contact" },
              ]}
            />
          </div>
        </div>

        {/* -- offices ------------------------------------------------------- */}
        {/* Two up on a phone as well. Three stacked rows of address was the
            single tallest block down here after the links. */}
        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-white/10 pt-8 lg:grid-cols-4">
          {OFFICES.map((office) => (
            <li key={office.city}>
              <p className="text-sm font-medium text-on-panel">
                {office.city}, {office.code}
              </p>
              <p className="mt-1 text-sm text-on-panel/70">{office.short}</p>
            </li>
          ))}
          {/* The two lines here are the only ones in the footer you can ACT on
              rather than navigate to, so they get a mark each. The icons are
              `aria-hidden`: the number and the address already say what they
              are, and a screen reader announcing "phone, plus nine one…" is the
              same fact twice. */}
          <li>
            <p className="text-sm font-medium text-on-panel">Talk to us</p>
            <a
              href={CONTACT.phoneHref}
              className="group/c mt-2 flex items-center gap-2.5 text-sm text-on-panel/70 transition-colors dur-fast ease-brand hover:text-on-panel"
            >
              <Phone
                aria-hidden
                className="size-4 shrink-0 text-on-panel/45 transition-colors dur-fast ease-brand group-hover/c:text-accent"
                strokeWidth={1.8}
              />
              {CONTACT.phone}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="group/c mt-2 flex items-start gap-2.5 text-sm break-all text-on-panel/70 transition-colors dur-fast ease-brand hover:text-on-panel"
            >
              <Mail
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-on-panel/45 transition-colors dur-fast ease-brand group-hover/c:text-accent"
                strokeWidth={1.8}
              />
              {CONTACT.email}
            </a>
          </li>
        </ul>

        {/* -- legal --------------------------------------------------------- */}
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-on-panel/60">
            Recognized by the Government of India &middot; ISO certified
          </p>
          <p className="text-xs text-on-panel/60">
            &copy; {new Date().getFullYear()} Hazeberg Consulting. All rights reserved.
          </p>
        </div>
      </div>

    </footer>
  );
}
