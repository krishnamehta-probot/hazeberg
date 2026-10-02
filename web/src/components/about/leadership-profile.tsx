import Image from "next/image";
import { BadgeCheck } from "lucide-react";

import { HazebergBirds } from "@/components/brand/hazeberg-wordmark";
import type { AboutPerson } from "@/lib/about-content";

/* The pieces of a profile that the desktop roster and the phone stack both
   draw. No hooks and no directive: the stack renders them on the server, the
   roster pulls them into its own client bundle, and they look the same in
   both because they are the same code. */

export const pad = (i: number) => String(i + 1).padStart(2, "0");

/** First letter of the first and last word: "Vignesh Ravishankar" is VR. */
export function initials(name: string) {
  const words = name.split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return `${words[0][0]}${last}`.toUpperCase();
}

/** One line of a profile that rises into place when its panel opens — its
    class and its place in the order (`.lead-line` in globals.css). Off, it is
    an ordinary line. */
function rise(on: boolean, i: number) {
  return on
    ? { cls: "lead-line ", style: { "--i": i } as React.CSSProperties }
    : { cls: "", style: undefined };
}

/**
 * The portrait — typographic until there is a photograph.
 *
 * No portrait has been supplied for anyone, and a grey silhouette in four
 * frames says "missing" four times over. So the plate is the brand blue, lit
 * from the top left, with the person's initials set large and light in its
 * foot and the mark's three birds faint across the top: a monogram, not a
 * placeholder. It is drawn in container units, so the same plate holds its
 * proportions as a 96px tile on a phone and a 16rem column on a desktop.
 *
 * Set `portrait` to a path in `about-content.ts` and the photograph takes the
 * frame instead, at the frame's size.
 */
export function Portrait({
  person,
  n,
  sizes,
  compact = false,
  className = "",
}: {
  person: AboutPerson;
  /** The person's place in the four, printed small in the plate's corner. */
  n: string;
  sizes: string;
  /** A tile, not a column: no corner index, which a 96px plate has no room for. */
  compact?: boolean;
  className?: string;
}) {
  if (person.portrait) {
    return (
      <div className={`relative overflow-hidden bg-surface-2 ${className}`}>
        <Image src={person.portrait} alt={person.name} fill sizes={sizes} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={`@container grad-blue grain relative isolate overflow-hidden text-on-panel ${className}`}
    >
      <span className="lead-sheen absolute inset-0" />
      <HazebergBirds className="absolute -top-[8%] -right-[16%] w-[88%] text-white/10" />
      {/* Top right, not top left: the left corner is where `grad-blue` is lit
          and the sheen falls, about 2.3:1 for small white type; the right is
          the deep end of the same gradient, over 5:1. */}
      {compact ? null : (
        <span className="absolute top-[7cqw] right-[8cqw] font-mono text-[0.6875rem] tracking-caps text-on-panel/85">
          {n}
        </span>
      )}
      <span className="absolute bottom-[5cqw] left-[7cqw] text-[44cqw] leading-[0.8] font-light tracking-[-0.07em]">
        {initials(person.name)}
      </span>
    </div>
  );
}

/** Name and role. The name is the heading the profile is labelled by. */
export function ProfileHeader({
  person,
  size = "lg",
  stagger = false,
}: {
  person: AboutPerson;
  size?: "lg" | "sm";
  /** Rise into place line by line when its panel opens. */
  stagger?: boolean;
}) {
  const name = rise(stagger, 0);
  const role = rise(stagger, 1);
  return (
    <header>
      <h3
        style={name.style}
        className={`${name.cls}leading-[1.08] font-light tracking-[-0.03em] text-balance text-ink ${
          size === "lg" ? "text-3xl" : "text-xl"
        }`}
      >
        {person.name}
      </h3>
      <p
        style={role.style}
        className={`${role.cls}mt-2 font-mono text-[0.6875rem] tracking-caps text-primary uppercase`}
      >
        {person.role}
      </p>
    </header>
  );
}

/**
 * The document's bio, in the document's shape: the bold opening line (the
 * person's specialism), the paragraph, the bold closing line (their years and
 * certifications), and then the certifications drawn as what they are —
 * separate credentials, each with its own mark — rather than left as a list
 * inside a sentence. A person with none gets no row, not an empty one.
 *
 * Chips are ink on white with a blue ring, not blue on a blue tint: a 8% blue
 * wash over the phone card's grey measured 4.2:1 for blue type, and ink on
 * white does not have to be measured.
 */
export function ProfileBody({
  person,
  stagger = false,
  from = 2,
}: {
  person: AboutPerson;
  stagger?: boolean;
  /** The first line's place in the arrival, after whatever came above it. */
  from?: number;
}) {
  const focus = rise(stagger, from);
  const bio = rise(stagger, from + 1);
  const proof = rise(stagger, from + 2);
  return (
    <>
      <p
        style={focus.style}
        className={`${focus.cls}mt-6 text-lg leading-snug font-semibold text-balance text-ink`}
      >
        {person.focus}
      </p>
      <p style={bio.style} className={`${bio.cls}mt-3 max-w-[58ch] text-sm text-ink-muted xl:text-base`}>
        {person.bio}
      </p>
      <div style={proof.style} className={`${proof.cls}mt-6 border-t border-border pt-5`}>
        <p className="text-sm font-semibold text-ink">{person.credentials}</p>
        {person.certs.length ? (
          <ul className="mt-3.5 flex flex-wrap gap-2">
            {person.certs.map((c) => (
              <li
                key={c}
                className="inline-flex min-h-8 items-center gap-1.5 rounded-pill bg-canvas py-1 pr-3 pl-2 text-xs font-medium text-ink ring-1 ring-primary/20"
              >
                <BadgeCheck aria-hidden className="size-4 shrink-0 text-primary" strokeWidth={1.9} />
                {c}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  );
}
