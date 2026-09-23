import Link from "next/link";
import { Mail } from "lucide-react";

import { HazebergWordmark } from "@/components/brand/hazeberg-wordmark";
import { SERVICES } from "@/lib/home-content";
import { CONTACT, PRIMARY_NAV, type NavNode } from "@/lib/navigation";

/**
 * Footer.
 *
 * Built to the supplied reference: the mark and a two-line claim on the left,
 * a rule, four link columns on the right, a thin legal strip, and the company
 * name set enormous and almost invisible across the foot.
 *
 * That last one is the whole trick, and it is cheap to get wrong. It works
 * because it is a TEXTURE, not a heading — at 3.5% white it is something you
 * notice after you have finished reading, which is exactly when a footer should
 * be the loudest thing about who you were just talking to. Any darker and it
 * competes with the links; any lighter and it looks like a rendering fault.
 *
 * It sits on the same ground as the closing panel above it with no rule between
 * them, so the page ends on one dark block rather than two. No shader down here:
 * the arc belongs to the panel above, and running it twice would halve it.
 *
 * Measured on this ground: links 7.1:1, the legal strip 5.0:1, the amber line
 * 11.97:1.
 */

/** Lucide dropped its brand marks, and a generic "link" glyph next to a LinkedIn
    URL tells you nothing. Drawn here rather than pulled in as a whole icon set. */
function LinkedInMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.71h.05a4.17 4.17 0 0 1 3.75-2.06c4 0 4.74 2.63 4.74 6.06V21h-4v-5.5c0-1.31-.02-3-1.83-3-1.84 0-2.12 1.43-2.12 2.9V21h-4V9Z" />
    </svg>
  );
}

const MENUS = PRIMARY_NAV.filter(
  (n): n is Extract<NavNode, { kind: "menu" }> => n.kind === "menu",
);

/** [live] §17 */
const OFFICES = [
  { city: "Coimbatore, IN", detail: "Annamalai Industrial Park, Kalapatti" },
  { city: "Penang, MY", detail: "Bandar Cassia, Pulau Pinang" },
];

function Column({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="font-mono text-[0.6875rem] tracking-caps text-on-panel/55 uppercase">
        {heading}
      </h3>
      <ul className="mt-5 space-y-3">
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
  const whatWeDo = MENUS.find((m) => m.label === "What we do");
  const about = MENUS.find((m) => m.label === "About");

  return (
    <footer className="relative bg-void">
      <div className="shell relative py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-16">
          {/* -- the mark, the claim, the one social account we actually have -- */}
          <div className="lg:border-r lg:border-white/10 lg:pr-16">
            <HazebergWordmark className="h-4 w-auto text-on-panel md:h-5" />
            <p className="mt-9 max-w-[16ch] text-3xl leading-[1.1] font-light tracking-[-0.02em] text-balance text-on-panel">
              Workday expertise
              <span className="block text-accent">that stays engaged</span>
            </p>

            {/* One icon, because one account is what exists. A row of four with
                three of them invented is worse than a row of one. */}
            <div className="mt-10 flex items-center gap-3">
              <a
                href={CONTACT.linkedin}
                aria-label="Hazeberg on LinkedIn"
                className="grid size-10 place-items-center rounded-sm ring-1 ring-white/15 text-on-panel/70 transition dur-base ease-brand hover:bg-white/8 hover:text-on-panel"
              >
                <LinkedInMark className="size-4" />
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                aria-label={`Email ${CONTACT.email}`}
                className="grid size-10 place-items-center rounded-sm ring-1 ring-white/15 text-on-panel/70 transition dur-base ease-brand hover:bg-white/8 hover:text-on-panel"
              >
                <Mail aria-hidden className="size-4" strokeWidth={1.8} />
              </a>
            </div>
          </div>

          {/* -- the links ---------------------------------------------------- */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <Column
              heading="Services"
              links={SERVICES.items.map((s) => ({ label: s.label, href: s.href }))}
            />
            <Column
              heading="What we do"
              links={(whatWeDo?.columns.flatMap((c) => c.items) ?? []).map((i) => ({
                label: i.label,
                href: i.href,
              }))}
            />
            <Column
              heading="Company"
              links={(about?.columns.flatMap((c) => c.items) ?? []).map((i) => ({
                label: i.label,
                href: i.href,
              }))}
            />
            <Column
              heading="More"
              links={[
                { label: "Berg", href: "/berg" },
                { label: "Careers", href: "/careers" },
                { label: "Contact", href: "/contact" },
                { label: "Case studies", href: "/what-we-do#case-studies" },
              ]}
            />
          </div>
        </div>

        {/* -- offices ------------------------------------------------------- */}
        <ul className="mt-16 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {OFFICES.map((office) => (
            <li key={office.city}>
              <p className="text-sm font-medium text-on-panel">{office.city}</p>
              <p className="mt-1 text-sm text-on-panel/70">{office.detail}</p>
            </li>
          ))}
          <li>
            <p className="text-sm font-medium text-on-panel">Talk to us</p>
            <a
              href={CONTACT.phoneHref}
              className="mt-1 block text-sm text-on-panel/70 transition-colors dur-fast ease-brand hover:text-on-panel"
            >
              {CONTACT.phone}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="mt-1 block text-sm text-on-panel/70 transition-colors dur-fast ease-brand hover:text-on-panel"
            >
              {CONTACT.email}
            </a>
          </li>
        </ul>

        {/* -- legal --------------------------------------------------------- */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-on-panel/60">
            Recognised by the Government of India &middot; ISO certified
          </p>
          <p className="text-xs text-on-panel/60">
            &copy; {new Date().getFullYear()} Hazeberg Consulting. All rights reserved.
          </p>
        </div>
      </div>

      {/* The name, as texture.
          Drawn as SVG text with an explicit `textLength`, not as a CSS font size.
          At `19vw` the word's width depended on the font having loaded and on how
          Manrope happened to fit at that size, so the clip landed somewhere
          different at every width — through the middle of the letters, which is
          what made it look accidental rather than placed. Here the viewBox is the
          frame and the word is told to be exactly 1140 of its 1200 units wide, so
          it fills the same margins and shows the same amount of itself at every
          screen, before the font arrives and after.
          3.5% white: noticed after you have finished reading, which is when a
          footer should be loudest about who you were talking to. Darker competes
          with the links; lighter looks like a rendering fault. */}
      <div className="shell pb-6 md:pb-10">
        <svg
          aria-hidden
          viewBox="0 0 1200 250"
          className="block w-full text-white/[0.035] select-none"
        >
          <text
            x="600"
            y="196"
            textAnchor="middle"
            textLength="1140"
            lengthAdjust="spacingAndGlyphs"
            fill="currentColor"
            className="font-sans font-light"
            style={{ fontSize: 215, letterSpacing: "-0.03em" }}
          >
            Hazeberg
          </text>
        </svg>
      </div>
    </footer>
  );
}
