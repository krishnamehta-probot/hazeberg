import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * The call to action — one style, used everywhere.
 *
 * **No amber fill.** A yellow button was the loudest thing in every section it
 * appeared in, and it appears in six of them. The brand pair moved to where it
 * belongs on a button: the rim and the disc. What is left is a shape that reads
 * the same on both grounds — black on white, white on black — with one bright
 * object in it.
 *
 *   rim    blue on the left running to amber on the right, lit at rest, and
 *          driven by the pointer from `.spec` (see globals.css)
 *   disc   the same pair as a fill, which is the one saturated thing on the
 *          button and the thing the eye lands on
 *   arrow  leaves to the top right while a second one arrives from the bottom
 *          left, so the swap happens INSIDE the disc — the disc clips, which is
 *          what sells it
 *
 * Nothing grows on hover: no scale anywhere, so the button never shifts what is
 * around it. The hover, the focus and the press are NOT defined here — they are
 * `.spec`, shared with every other button on the site.
 */
export function CtaPill({
  href,
  children,
  tone = "dark",
}: {
  href: string;
  children: React.ReactNode;
  /** One button, two grounds. `dark` is the black pill for white sections;
      `light` is the white pill for the dark panels. The rim, the disc and the
      arrow swap are identical in both — only the fill and the label invert. */
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  const arrow = "absolute size-4 text-white transition-transform duration-300 ease-brand";
  return (
    <Link
      href={href}
      data-spec
      className={`spec group/p inline-flex h-14 items-center gap-4 rounded-pill pr-2.5 pl-8 font-mono text-xs tracking-caps uppercase ${
        light ? "bg-canvas text-ink" : "bg-ink text-on-panel"
      }`}
    >
      {children}
      {/* The disc is BLUE, not blue-into-amber. A 36px circle is too small to
          get from one to the other without spending most of itself in the
          grey-green they blend through — it came out looking like a bug. Amber
          lives on the rim, which turns, so both colours are still on the button;
          they are just never mixed. White on this measures 5.1:1 where the
          arrow sits, 3.58:1 at the disc's lightest point. */}
      <span
        aria-hidden
        className="disc-blue relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-pill"
      >
        <ArrowUpRight
          className={`${arrow} group-hover/p:translate-x-[180%] group-hover/p:-translate-y-[180%]`}
          strokeWidth={2}
        />
        <ArrowUpRight
          className={`${arrow} -translate-x-[180%] translate-y-[180%] group-hover/p:translate-x-0 group-hover/p:translate-y-0`}
          strokeWidth={2}
        />
      </span>
    </Link>
  );
}
