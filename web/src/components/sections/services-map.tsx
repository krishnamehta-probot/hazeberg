"use client";

import { useRef, useState, useSyncExternalStore } from "react";
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

import { indexLabel } from "@/lib/home/index-label";
import type { ServiceKey } from "@/lib/home/services";
import type { HomeServices } from "@/lib/home/types";

/**
 * Services as one wheel: a Workday core, and seven capabilities filling the ring
 * around it.
 *
 * It was seven floating discs before and it read as cheap, for a reason worth
 * writing down: discs with gaps between them are seven separate objects that
 * happen to be arranged in a circle. A segmented ring is ONE object that has been
 * divided — which is the actual claim the section is making.
 *
 * **Made, not drawn.** The first ring was flat tints with hairline gaps, and it
 * read as a diagram. This one is built like an object on a plate: the seven
 * segments are raised tiles with rounded corners and a soft shadow, cut apart by
 * gaps of one constant width (the edges run parallel to the radius, not along
 * it, so the daylight between two tiles does not fan open towards the rim). Each
 * icon sits in its own well. The core is the brand blue as glass — the client's
 * own three-stop gradient, a pale rim, a sheen across the top and a glow round
 * it — and the capability in front turns to blue glass too. Four amber markers
 * ride a dotted orbit that turns, very slowly, the whole time.
 *
 * **Pinned, and slow.** 300vh of track, with the sweep spread across two thirds
 * of it. One hand goes round from twelve and uncovers the ring as it passes —
 * one continuous motion reads as a system coming up; a sequence of fades reads
 * as a list being rendered.
 *
 * **SVG and CSS, no WebGL.** Glow needs darkness — on white it is a smudge — so
 * the light here is all shadow and tint.
 *
 * **Phones get the same wheel, with icons only.** Seven two-word names need
 * width a phone does not have; seven icons in their wells do not. The heading
 * sits above the wheel, the capability in front is named and described in a
 * card below it, and tapping an icon puts that capability in front. The full
 * seven stay in the DOM for assistive technology at every size.
 */

/* The ring, in the 0-100 box the wheel is drawn in. */
const R_OUT = 44;
const R_IN = 23.5;
/** The core sits inside the ring with white daylight between them. */
const R_CORE = 19;
/** The plate the tiles sit on: just wider than the ring, so its shadow is the
    wheel's edge on the white ground. */
const R_PLATE = 45.5;
/** Where a wedge's label sits: the band's exact middle, (23.5 + 44) / 2. The
    label is a well over two lines, 12.9 units tall and at most 15 wide; checked
    against all seven wedges at the narrowest desktop wheel (568px, where the
    type is at its 12px floor), every line clears the rim by 1.5 units or more. */
const R_LABEL = 33.75;
/** The dotted orbit outside everything. */
const R_ORBIT = 49;
/** The daylight between two tiles, in units, and the same all the way out. */
const GAP = 1.5;
/** The tiles' corner radius. */
const CORNER = 2.2;

/** Presentation, not content: the client supplied no service icons, and these are
    a UI icon set doing a UI job rather than artwork put in their name.
    Keyed by service rather than by position, so reordering the wheel in the
    CMS cannot hand Payroll the HCM icon. */
const ICONS: Record<ServiceKey, LucideIcon> = {
  hcm: Users,
  payroll: Wallet,
  financials: FileText,
  integrations: Share2,
  "reporting-analytics": BarChart3,
  ams: LifeBuoy,
  extend: Blocks,
};

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
const pt = (p: { x: number; y: number }) => `${(50 + p.x).toFixed(3)} ${(50 + p.y).toFixed(3)}`;

/**
 * One tile of the ring, from angle `from` to angle `to`, with rounded corners.
 *
 * Each side edge runs parallel to its boundary radius, GAP/2 inside it. Each
 * corner is a fillet of radius CORNER, tangent to that edge and to the rim it
 * meets: its centre is on the edge pushed in by CORNER, and on the circle CORNER
 * inside the outer rim (or outside the inner one). The tangent points are the
 * foot of that centre on the edge, and its projection onto the rim.
 */
function tilePath(from: number, to: number) {
  const h = GAP / 2;
  const d = h + CORNER;
  const u0 = { x: Math.cos(rad(from)), y: Math.sin(rad(from)) };
  const u1 = { x: Math.cos(rad(to)), y: Math.sin(rad(to)) };
  /* Inward normals: towards the tile from each side. */
  const n0 = { x: -u0.y, y: u0.x };
  const n1 = { x: u1.y, y: -u1.x };

  const corner = (u: typeof u0, n: typeof n0, rim: number, outer: boolean) => {
    const rc = outer ? rim - CORNER : rim + CORNER;
    const t = Math.sqrt(rc * rc - d * d);
    const c = { x: t * u.x + d * n.x, y: t * u.y + d * n.y };
    return {
      edge: { x: t * u.x + h * n.x, y: t * u.y + h * n.y },
      rim: { x: (c.x * rim) / rc, y: (c.y * rim) / rc },
    };
  };

  const so = corner(u0, n0, R_OUT, true);
  const eo = corner(u1, n1, R_OUT, true);
  const ei = corner(u1, n1, R_IN, false);
  const si = corner(u0, n0, R_IN, false);
  const f = `A ${CORNER} ${CORNER} 0 0 1`;

  return [
    `M ${pt(si.edge)}`,
    `L ${pt(so.edge)}`,
    `${f} ${pt(so.rim)}`,
    `A ${R_OUT} ${R_OUT} 0 0 1 ${pt(eo.rim)}`,
    `${f} ${pt(eo.edge)}`,
    `L ${pt(ei.edge)}`,
    `${f} ${pt(ei.rim)}`,
    `A ${R_IN} ${R_IN} 0 0 0 ${pt(si.rim)}`,
    `${f} ${pt(si.edge)}`,
    "Z",
  ].join(" ");
}

const noop = () => () => {};

/** The hand: a pie from `start`, `deg` degrees round, wider than the box. */
function piePath(start: number, deg: number) {
  const a = at(80, start);
  const b = at(80, start + deg);
  return `M 50 50 L ${a.x} ${a.y} A 80 80 0 ${deg > 180 ? 1 : 0} 1 ${b.x} ${b.y} Z`;
}

export function ServicesMap({ services }: { services: HomeServices }) {
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  /* Pinned only once it is on the client: the server cannot know the scroll,
     so it sends the finished layout without the 300vh track. */
  const pinned = useSyncExternalStore(noop, () => true, () => false);
  const [p, setP] = useState(0);
  /* Pointer and keyboard put a capability in front while they are on it. A tap
     puts it there until the sweep moves on, so a phone can choose one without
     scrolling past it. */
  const [hover, setHover] = useState<number | null>(null);
  const [tapped, setTapped] = useState<{ i: number; at: number } | null>(null);

  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (pinned && !reduce) setP(clamp01(v));
  });

  const prog = reduce ? 1 : p;
  const total = services.items.length;
  const step = 360 / total;
  const start = -90 - step / 2;

  const core = span(prog, 0, CORE_END);
  const orbit = span(prog, ORBIT_FROM, ORBIT_TO);
  const sweep = span(prog, SWEEP_FROM, SWEEP_TO);
  const reached = Math.min(total - 1, Math.floor(sweep * total));
  const active = Math.min(hover ?? (tapped?.at === reached ? tapped.i : reached), total - 1);
  const item = services.items[active];
  const ActiveIcon = ICONS[item.key];
  const hand = sweep >= 0.9999 ? null : piePath(start, sweep * 360);

  /* No reveal on the heading. It is the section's own words and it is there from
     the first frame of the pin — a heading that fades in while a diagram is
     already building beside it is two things starting at once. */
  const head = (
    <div className="lg:col-start-1 lg:row-start-2">
      <p className="font-mono text-xs tracking-caps text-ink-subtle uppercase">{services.eyebrow}</p>
      <h2 className="mt-3 max-w-[18ch] text-2xl leading-[1.08] font-light tracking-[-0.03em] text-pretty text-ink sm:text-3xl lg:mt-5">
        {services.title}
      </h2>
    </div>
  );

  /* The capability in front. Announced, because for most of the pin it changes
     on its own.
     The height is held at the tallest description, and that is load-bearing
     rather than tidy: on a desktop the column is centred in the pinned pane, so
     a description one line longer than the last re-centres it and drags the
     heading with it; on a phone the card sits under the wheel and would push it
     about. On a phone it is a card, because there it is the only place the
     names are written. */
  const detail = (
    <div
      aria-live="polite"
      className="min-h-[13.25rem] rounded-2xl bg-canvas/85 p-4 shadow-[0_18px_40px_-22px_rgb(11_63_107/0.35)] ring-1 ring-border backdrop-blur-sm sm:p-5 lg:col-start-1 lg:row-start-3 lg:mt-10 lg:min-h-[12rem] lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none lg:ring-0 lg:backdrop-blur-none"
    >
      <p className="flex items-center gap-2.5 font-mono text-[0.6875rem] tracking-caps text-primary uppercase">
        <span aria-hidden className="disc-blue grid size-7 shrink-0 place-items-center rounded-pill text-primary-ink">
          <ActiveIcon className="size-3.5" strokeWidth={1.8} />
        </span>
        {indexLabel(active)} &middot; {item.label}
      </p>
      <p className="mt-2.5 max-w-[40ch] text-sm text-ink-muted sm:text-base lg:mt-3">{item.body}</p>
      <Link href={item.href} className="group/e mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-ink lg:mt-2">
        <span className="group-hover/e:underline">{item.cta}</span>
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform dur-fast ease-brand group-hover/e:translate-x-0.5 group-hover/e:-translate-y-0.5"
          strokeWidth={2}
        />
      </Link>
    </div>
  );

  const list = (
    <ul className="sr-only">
      {services.items.map((s, i) => (
        <li key={s.key}>
          <p>{indexLabel(i)}</p>
          <p>{s.label}</p>
          <p>{s.body}</p>
          <Link href={s.href}>{s.cta}</Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={track} data-map-track className={pinned ? "h-[300vh]" : ""}>
      <div className={pinned ? "sticky top-0 flex h-svh items-center overflow-hidden" : ""}>
        {/* A phone stacks heading, wheel, card, under the header. A desktop
            puts the heading and the card in the left column, centred together
            by the two `1fr` rows round them, and the wheel on the right
            across all four. */}
        <div className="shell grid w-full content-center gap-5 pt-[calc(var(--header-h)+0.5rem)] pb-6 lg:h-full lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1fr)] lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-10 lg:gap-y-0 lg:py-0">
          {head}

          {/* -- the wheel ------------------------------------------------- */}
          {/* Square, and sized by its WIDTH, which is bounded by the height —
              the labels are positioned in percentages of this box, so box and
              drawing must be the same shape. On a phone it gives up height to
              the heading and the card first: 30rem is what those two and the
              header need. It is also the container its labels size against, so
              type and wells scale with the drawing and land where it does. */}
          <div className="@container relative aspect-square w-[min(100%,26rem,calc(100svh_-_30rem))] justify-self-center lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:w-full lg:max-w-[74svh] lg:self-center lg:justify-self-end">
            {/* The light the plate stands in. */}
            <div
              aria-hidden
              style={{ opacity: orbit }}
              className="absolute -inset-[7%] rounded-full bg-[radial-gradient(closest-side,rgb(25_114_185/0.16),rgb(25_114_185/0.05)_62%,transparent)]"
            />

            <svg data-map aria-hidden viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
              <defs>
                {/* Lit from above: the tiles run from the page's lightest grey
                    at the top of the wheel to its next one at the foot. */}
                <linearGradient id="svc-tile" gradientUnits="userSpaceOnUse" x1="0" y1="6" x2="0" y2="94">
                  <stop offset="0" style={{ stopColor: "var(--surface)" }} />
                  <stop offset="1" style={{ stopColor: "var(--surface-2)" }} />
                </linearGradient>
                {/* Blue glass: the brand blue at 8% on white, to 18%. */}
                <linearGradient id="svc-glass" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#edf4f9" />
                  <stop offset="1" stopColor="#d6e6f2" />
                </linearGradient>
                {/* The client's blue, as `--grad-blue` has it: lit top left. */}
                <radialGradient id="svc-core" cx="0.32" cy="0.22" r="0.95">
                  <stop offset="0" stopColor="#2b8ae0" />
                  <stop offset="0.42" stopColor="#1972b9" />
                  <stop offset="1" stopColor="#0b3f6b" />
                </radialGradient>
                <linearGradient id="svc-sheen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffffff" stopOpacity="0.15" />
                  <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
                <radialGradient id="svc-halo" gradientUnits="userSpaceOnUse" cx="50" cy="50" r={R_CORE + 5}>
                  <stop offset={(R_CORE - 1) / (R_CORE + 5)} stopColor="#008eff" stopOpacity="0.38" />
                  <stop offset="1" stopColor="#008eff" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="svc-marker" r="0.5">
                  <stop offset="0.35" stopColor="#fec00f" stopOpacity="0.45" />
                  <stop offset="1" stopColor="#fec00f" stopOpacity="0" />
                </radialGradient>
                <filter id="svc-lift" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="0.7" stdDeviation="0.9" floodColor="#0b3f6b" floodOpacity="0.16" />
                </filter>
                <filter id="svc-plate" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1.4" stdDeviation="2.6" floodColor="#1972b9" floodOpacity="0.18" />
                </filter>
                <clipPath id="svc-core-clip">
                  <circle cx="50" cy="50" r={R_CORE} />
                </clipPath>
                {hand ? (
                  <clipPath id="svc-hand">
                    <path d={hand} />
                  </clipPath>
                ) : null}
              </defs>

              {/* The orbit, and four markers riding it, turning. */}
              <g style={{ opacity: orbit }}>
                <g className="svc-orbit">
                  <circle
                    cx="50"
                    cy="50"
                    r={R_ORBIT}
                    fill="none"
                    stroke="rgb(20 24 26 / 0.2)"
                    strokeWidth="0.3"
                    strokeDasharray="0.5 1.6"
                    vectorEffect="non-scaling-stroke"
                  />
                  {[-64, 26, 116, 206].map((deg) => {
                    const q = at(R_ORBIT, deg);
                    return (
                      <g key={deg}>
                        <circle cx={q.x} cy={q.y} r="2.6" fill="url(#svc-marker)" />
                        <circle cx={q.x} cy={q.y} r="1.05" className="fill-accent" stroke="#ffffff" strokeWidth="0.35" />
                      </g>
                    );
                  })}
                </g>
              </g>

              {/* The plate. */}
              <circle cx="50" cy="50" r={R_PLATE} fill="#ffffff" filter="url(#svc-plate)" style={{ opacity: orbit }} />

              {/* The tiles, uncovered by the hand. The shadow is on the group
                  outside the clip, so it follows the swept shape. */}
              <g filter="url(#svc-lift)">
                <g clipPath={hand ? "url(#svc-hand)" : undefined}>
                  {services.items.map((s, i) => {
                    const d = tilePath(start + i * step, start + (i + 1) * step);
                    const on = i === active;
                    return (
                      <g key={s.key}>
                        <path d={d} fill="url(#svc-tile)" stroke="#ffffff" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                        <path
                          d={d}
                          fill="url(#svc-glass)"
                          stroke="rgb(25 114 185 / 0.55)"
                          strokeWidth="1"
                          vectorEffect="non-scaling-stroke"
                          style={{ opacity: on ? 1 : 0 }}
                          className="transition-opacity dur-base ease-brand"
                        />
                      </g>
                    );
                  })}
                </g>
              </g>

              {/* The core: halo, white rim, blue glass, sheen. */}
              <g style={{ opacity: core, transformOrigin: "50px 50px", transform: `scale(${0.86 + core * 0.14})` }}>
                <circle cx="50" cy="50" r={R_CORE + 5} fill="url(#svc-halo)" />
                <circle cx="50" cy="50" r={R_CORE + 1.2} fill="#ffffff" />
                <circle cx="50" cy="50" r={R_CORE} fill="url(#svc-core)" />
                <g clipPath="url(#svc-core-clip)">
                  <ellipse cx="57" cy="34" rx="22" ry="11" fill="url(#svc-sheen)" transform="rotate(-24 57 34)" />
                </g>
                <circle
                  cx="50"
                  cy="50"
                  r={R_CORE - 0.35}
                  fill="none"
                  stroke="rgb(140 200 250 / 0.75)"
                  strokeWidth="0.7"
                />
              </g>
            </svg>

            <div
              style={{ opacity: core }}
              className="pointer-events-none absolute top-1/2 left-1/2 w-[36%] -translate-x-1/2 -translate-y-1/2 text-center text-primary-ink"
            >
              <p className="text-[5.6cqw] leading-none font-medium tracking-[-0.02em]">Workday</p>
              <p className="mt-[1.6cqw] font-mono text-[clamp(0.5rem,1.55cqw,0.75rem)] tracking-[0.24em] text-primary-ink/80 uppercase @max-[18rem]:hidden">
                Expertise Engine
              </p>
            </div>

            {/* The labels. HTML, not SVG text: these wrap, they are buttons, and
                SVG text is bad at both. The names are written from lg; a phone
                shows the wells alone, and the name is the button's label. */}
            {services.items.map((s, i) => {
              const q = at(R_LABEL, -90 + i * step);
              const shown = ease(clamp01(sweep * total - i));
              const on = i === active;
              const Icon = ICONS[s.key];
              const words = s.label.split(" ");
              return (
                <button
                  key={s.key}
                  type="button"
                  aria-label={s.label}
                  aria-current={on ? "true" : undefined}
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") setHover(i);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType === "mouse") setHover((v) => (v === i ? null : v));
                  }}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover((v) => (v === i ? null : v))}
                  onClick={() => setTapped({ i, at: reached })}
                  style={{ left: `${q.x}%`, top: `${q.y}%`, opacity: shown }}
                  className="absolute flex min-h-11 w-[15cqw] min-w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center justify-center gap-[1.1cqw] text-center"
                >
                  <span
                    aria-hidden
                    className={`grid size-[clamp(1.75rem,10cqw,2.5rem)] shrink-0 place-items-center rounded-pill ring-1 transition-colors dur-base ease-brand lg:size-[clamp(2.25rem,6.6cqw,3rem)] ${
                      on
                        ? "bg-primary/12 text-primary ring-primary/25"
                        : "bg-surface-2 text-ink-subtle shadow-[inset_0_1px_2px_rgb(20_24_26/0.08)] ring-white"
                    }`}
                  >
                    <Icon className="size-[46%]" strokeWidth={1.7} />
                  </span>
                  {/* Every name is two words or more, and it is SET as two
                      lines: everything but the last word, then the last. */}
                  <span
                    aria-hidden
                    className={`hidden text-[clamp(0.75rem,2.15cqw,0.9375rem)] leading-[1.2] font-semibold transition-colors dur-base ease-brand lg:block ${
                      on ? "text-primary" : "text-ink"
                    }`}
                  >
                    {words.slice(0, -1).join(" ")}
                    <br />
                    {words.at(-1)}
                  </span>
                </button>
              );
            })}
          </div>

          {detail}
          {list}
        </div>
      </div>
    </div>
  );
}
