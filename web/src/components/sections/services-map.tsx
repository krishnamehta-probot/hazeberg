"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Blocks,
  FileText,
  LifeBuoy,
  Share2,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";

import { SERVICES } from "@/lib/home-content";

/**
 * Services as one wheel: a Workday core, and seven capabilities filling the ring
 * around it.
 *
 * It was seven floating discs before and it read as cheap, for a reason worth
 * writing down: discs with gaps between them are seven separate objects that
 * happen to be arranged in a circle. A segmented ring is ONE object that has been
 * divided — which is the actual claim the section is making. Nothing about the
 * colours or the shadows would have fixed that; the shape was wrong.
 *
 * **Pinned, and slow.** 300vh of track, with the sweep spread across two thirds
 * of it. The first version ran the whole build inside about half a screen of
 * scroll and arrived before you had looked at it.
 *
 * The wedges sweep in clockwise from twelve, like a hand going round, rather than
 * appearing one at a time. One continuous motion reads as a system coming up; a
 * sequence of fades reads as a list being rendered.
 *
 * **SVG and CSS, no WebGL.** The brief asked for glow on a white ground, and glow
 * needs darkness — on white it is a smudge. Flat fills, hairlines and one solid
 * core are what read as expensive here.
 *
 * The phone draws the wheel and drops the label ring. Seven labelled wedges need
 * width a phone does not have, so the naming moves under the circle — the active
 * capability, named and described, changing as the sweep goes round. The full
 * seven stay in the DOM for assistive technology at every size.
 */

/* The ring, in the 0-100 box the wheel is drawn in. */
const R_OUT = 44;
const R_IN = 23.5;
/** The core sits inside the ring with white daylight between them. */
const R_CORE = 19;
/** Where a wedge's label sits: the band's exact middle, (23.5 + 44) / 2. A label
    is a rectangle in a ring, so what has to clear both edges is its CORNER, and
    the corner is furthest out when the label is widest — which is why the box
    below is 6rem rather than as wide as the wedge would allow. Centred, with a
    96px box, every corner lands about 1.6 units clear at both ends. */
const R_LABEL = 33.75;
/** The dotted orbit outside everything. */
const R_ORBIT = 49;
/** Degrees of daylight between wedges. */
const GAP_DEG = 1.1;

/** Presentation, not content: the client supplied no service icons, and these are
    a UI icon set doing a UI job rather than artwork put in their name. */
const ICONS: LucideIcon[] = [Users, Wallet, FileText, Share2, BarChart3, LifeBuoy, Blocks];

/* The pin's timeline, as shares of the track. The sweep owns most of it, and the
   last fifth is the finished wheel simply being there to look at. */
const CORE_END = 0.12;
const ORBIT_FROM = 0.08;
const ORBIT_TO = 0.26;
const SWEEP_FROM = 0.18;
const SWEEP_TO = 0.82;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));
const span = (v: number, a: number, b: number) => ease((v - a) / (b - a));
const rad = (deg: number) => (deg * Math.PI) / 180;
const at = (r: number, deg: number) => ({ x: 50 + r * Math.cos(rad(deg)), y: 50 + r * Math.sin(rad(deg)) });

/** One wedge of the ring: out along the outer arc, in, back along the inner. */
function wedgePath(from: number, to: number) {
  const a = at(R_OUT, from);
  const b = at(R_OUT, to);
  const c = at(R_IN, to);
  const d = at(R_IN, from);
  const large = to - from > 180 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${R_OUT} ${R_OUT} 0 ${large} 1 ${b.x} ${b.y} L ${c.x} ${c.y} A ${R_IN} ${R_IN} 0 ${large} 0 ${d.x} ${d.y} Z`;
}

export function ServicesMap() {
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [pinned, setPinned] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [p, setP] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    /* The wheel runs on a phone too. What does NOT run there is the ring of
       seven HTML labels: a 390px frame gives each wedge about 80px of arc and
       every name is two words, which is exactly what used to push them out of
       the circle. Narrow keeps the drawing and moves the naming underneath it,
       where there is a whole line to say it in. */
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => {
      setPinned(true);
      setNarrow(!mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (pinned && !reduce) setP(clamp01(v));
  });

  const prog = reduce ? 1 : p;
  const total = SERVICES.items.length;
  const step = 360 / total;

  const core = span(prog, 0, CORE_END);
  const orbit = span(prog, ORBIT_FROM, ORBIT_TO);
  const sweep = span(prog, SWEEP_FROM, SWEEP_TO);
  const reached = Math.min(total - 1, Math.floor(sweep * total));
  const active = picked ?? reached;
  const item = SERVICES.items[active];

  const copy = (
    <div>
      {/* No reveal on this column. It is the section's own words and it is there
          from the first frame of the pin — a heading that fades in while a
          diagram is already building beside it is two things starting at once.
          The same eyebrow and the same title as the list view: one section, two
          drawings of it, not two different sections. */}
      <p className="font-mono text-xs tracking-caps text-ink-subtle uppercase">
        {SERVICES.eyebrow}
      </p>
      <h2 className="mt-4 max-w-[18ch] text-2xl leading-[1.08] font-light tracking-[-0.03em] text-pretty text-ink sm:text-3xl lg:mt-5">
        {SERVICES.title}
      </h2>

      {/* The active capability. Announced, because for most of the pin it changes
          on its own.
          The height is held at the tallest description, and that is load-bearing
          rather than tidy: the column is vertically centred in the pinned pane,
          so a description one line longer than the last re-centres the whole
          column and drags the heading with it. Measured at 12px of drift before
          this was tall enough — inside a pin, where nothing is supposed to move
          at all. */}
      <div aria-live="polite" className="mt-6 min-h-[8.5rem] lg:mt-10 lg:min-h-[12rem]">
        <p className="font-mono text-[0.6875rem] tracking-caps text-primary uppercase">
          {item.n} &middot; {item.label}
        </p>
        <p className="mt-2.5 max-w-[40ch] text-sm text-ink-muted sm:text-base lg:mt-3">{item.body}</p>
        <Link
          href={item.href}
          className="group/e mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink"
        >
          <span className="group-hover/e:underline">{item.cta}</span>
          <ArrowUpRight
            aria-hidden
            className="size-4 transition-transform dur-fast ease-brand group-hover/e:translate-x-0.5 group-hover/e:-translate-y-0.5"
            strokeWidth={2}
          />
        </Link>
      </div>
    </div>
  );

  const list = (
    <ul className="sr-only">
      {SERVICES.items.map((s) => (
        <li key={s.label}>
          <p className="font-mono text-[0.6875rem] tracking-caps text-ink-subtle uppercase">{s.n}</p>
          <p className="mt-1 text-xl leading-tight font-light text-ink">{s.label}</p>
          <p className="mt-1.5 max-w-[52ch] text-sm text-ink-muted">{s.body}</p>
          <Link
            href={s.href}
            className="group/e mt-2.5 inline-flex items-center gap-1.5 text-sm font-medium text-ink"
          >
            <span className="group-hover/e:underline">{s.cta}</span>
            <ArrowUpRight aria-hidden className="size-4" strokeWidth={2} />
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={track} data-map-track className={pinned ? "h-[300vh]" : ""}>
      <div className={pinned ? "sticky top-0 flex h-svh items-center overflow-hidden" : ""}>
        <div className="shell grid w-full gap-6 py-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1fr)] lg:items-center lg:gap-10 lg:py-0">
          {copy}

          {/* -- the wheel, desktop only ------------------------------------ */}
          {/* Square, and bounded by HEIGHT through max-width rather than
              max-height. With `max-h` the box stayed as wide as the column while
              its height was clipped, so the SVG letterboxed its circle into the
              middle — and the labels, positioned as percentages of the BOX, kept
              spreading to the full width and walked straight out of the ring on
              the left and right. Constraining the width keeps box and drawing the
              same shape, which is the only way percentage positions can line up
              with a viewBox at all. */}
          <div className="relative order-first aspect-square w-full max-w-[min(74svh,26rem)] justify-self-center lg:order-none lg:max-w-[74svh] lg:justify-self-end">
            <svg data-map aria-hidden viewBox="0 0 100 100" className="absolute inset-0 size-full">
              {/* The orbit, and four markers riding it. */}
              <g style={{ opacity: orbit }}>
                <circle
                  cx="50"
                  cy="50"
                  r={R_ORBIT}
                  fill="none"
                  stroke="rgb(20 24 26 / 0.22)"
                  strokeWidth="0.3"
                  strokeDasharray="0.6 2"
                  vectorEffect="non-scaling-stroke"
                />
                {[-64, 26, 116, 206].map((deg) => {
                  const q = at(R_ORBIT, deg);
                  return (
                    <circle key={deg} cx={q.x} cy={q.y} r="0.9" className="fill-accent" />
                  );
                })}
              </g>

              {/* The ring. Each wedge sweeps out from its own leading edge, so the
                  whole thing reads as one hand going round rather than seven
                  panels fading up. */}
              {SERVICES.items.map((s, i) => {
                const from = -90 - step / 2 + i * step + GAP_DEG / 2;
                const full = step - GAP_DEG;
                const grown = ease(clamp01(sweep * total - i));
                const on = i === active;
                if (grown <= 0.001) return null;
                return (
                  <path
                    key={s.label}
                    d={wedgePath(from, from + full * grown)}
                    className={`transition-colors dur-base ease-brand ${
                      on ? "fill-primary/12" : "fill-surface-2"
                    }`}
                  />
                );
              })}

              {/* The core. Solid, and the only saturated shape in the section —
                  everything else is a tint of the page. */}
              <circle
                cx="50"
                cy="50"
                r={R_CORE}
                className="fill-primary"
                style={{ opacity: core, transformOrigin: "50px 50px", transform: `scale(${0.86 + core * 0.14})` }}
              />
            </svg>

            <div
              style={{ opacity: core }}
              className="absolute top-1/2 left-1/2 w-[34%] -translate-x-1/2 -translate-y-1/2 text-center"
            >
              <p className="text-xl leading-tight font-medium text-primary-ink">Workday</p>
              <p className="mt-1.5 font-mono text-[0.625rem] tracking-caps text-primary-ink/75 uppercase">
                Expertise Engine
              </p>
            </div>

            {/* The labels. HTML, not SVG text: these wrap, they are buttons, and
                SVG text is bad at both. */}
            {(narrow ? [] : SERVICES.items).map((s, i) => {
              const centre = -90 + i * step;
              const q = at(R_LABEL, centre);
              const shown = ease(clamp01(sweep * total - i));
              const on = i === active;
              const Icon = ICONS[i];
              return (
                <button
                  key={s.label}
                  type="button"
                  onPointerEnter={() => setPicked(i)}
                  onPointerLeave={() => setPicked((v) => (v === i ? null : v))}
                  onFocus={() => setPicked(i)}
                  onBlur={() => setPicked((v) => (v === i ? null : v))}
                  aria-current={on ? "true" : undefined}
                  style={{ left: `${q.x}%`, top: `${q.y}%`, opacity: shown }}
                  className="absolute flex w-[6rem] -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-2 text-center"
                >
                  <Icon
                    aria-hidden
                    className={`size-5 shrink-0 transition-colors dur-base ease-brand ${
                      on ? "text-primary" : "text-ink-subtle"
                    }`}
                    strokeWidth={1.6}
                  />
                  {/* Every name is two words, so it is SET as two lines. Left to
                      wrap on its own the seven wedges came out one, two and three
                      lines deep and the longest ones pushed straight through the
                      ring — which is what was breaking out of the box. */}
                  <span
                    className={`block text-sm leading-[1.25] font-semibold transition-colors dur-base ease-brand ${
                      on ? "text-primary" : "text-ink"
                    }`}
                  >
                    {s.label.split(" ").slice(0, -1).join(" ")}
                    <br />
                    {s.label.split(" ").slice(-1)}
                  </span>
                </button>
              );
            })}
          </div>

          {list}
        </div>
      </div>
    </div>
  );
}
