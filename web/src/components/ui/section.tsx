import { Reveal } from "@/components/motion/reveal";
import { CtaPill } from "@/components/ui/cta-pill";

/* ---------------------------------------------------------------------------
   The page's vertical rhythm, and the three pieces of furniture every section
   starts from. Lifted out of `sections/home.tsx` when Contact and Careers were
   built: three sections' worth of heading markup copied into two new pages is
   exactly how sections built weeks apart stop looking like one site (rule 3).

   Behaviour is unchanged from the home page's originals. The only addition is
   `SectionHead`'s `align` — the home page is centred throughout and stays
   centred by default; the inner pages lead left, because a page that opens with
   a form or a list of roles reads top-left to bottom-right and a centred head
   over a left-aligned body is two different pages stacked.
--------------------------------------------------------------------------- */

/**
 * `surface` is the page. Every section sits on it unless there is a reason to
 * break — `canvas` and `ink` are the exceptions, reached for deliberately.
 * Cards go the other way: white on the surface, which is what gives them an
 * edge without darkening a whole band to produce one.
 */
export const GROUND = {
  surface: "bg-surface",
  canvas: "bg-canvas",
  ink: "grad-ink grain text-on-panel",
} as const;

export function Section({
  children,
  ground = "surface",
  id,
  className = "",
}: {
  children: React.ReactNode;
  ground?: keyof typeof GROUND;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={`relative ${GROUND[ground]}`}>
      <div className={`shell py-[var(--section-y)] ${className}`}>{children}</div>
    </section>
  );
}

/**
 * Space Mono, caps, tracked. Three of the four reference sites set their
 * micro-labels in a monospace and nothing else — it is the one place the second
 * face appears, which is what keeps it from reading as a gimmick.
 */
export function Eyebrow({
  children,
  tone = "subtle",
}: {
  children: React.ReactNode;
  tone?: "subtle" | "panel" | "onDark";
}) {
  const skin =
    tone === "panel" ? "text-accent" : tone === "onDark" ? "text-on-panel/60" : "text-ink-subtle";
  return <p className={`font-mono text-xs tracking-caps uppercase ${skin}`}>{children}</p>;
}

export function SectionHead({
  eyebrow,
  title,
  body,
  cta,
  tone = "light",
  titleMax = "max-w-[24ch]",
  align = "center",
}: {
  eyebrow: string;
  /** A node, not a string: one head sets part of its line in brand blue and
      breaks the sentence itself. */
  title: React.ReactNode;
  body?: string;
  cta?: { label: string; href: string };
  tone?: "light" | "panel";
  /** `24ch` is the measure every head wants EXCEPT one that carries its own
      hard break — there the cap has to clear the longer of the two lines. */
  titleMax?: string;
  /** Centred is the home page. `start` is the inner pages. */
  align?: "center" | "start";
}) {
  const panel = tone === "panel";
  const centred = align === "center";
  return (
    <Reveal className={`flex flex-col ${centred ? "items-center text-center" : "items-start"}`}>
      <Eyebrow tone={panel ? "panel" : "subtle"}>{eyebrow}</Eyebrow>
      <h2
        className={`mt-5 ${titleMax} text-3xl leading-[1.08] font-light tracking-[-0.03em] text-balance ${
          panel ? "text-on-panel" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {body ? (
        <p className={`mt-5 max-w-[60ch] text-base ${panel ? "text-on-panel/70" : "text-ink-muted"}`}>
          {body}
        </p>
      ) : null}
      {cta ? (
        <div className="mt-9">
          <CtaPill href={cta.href}>{cta.label}</CtaPill>
        </div>
      ) : null}
    </Reveal>
  );
}
